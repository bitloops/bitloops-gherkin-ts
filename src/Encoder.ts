/**
 *  bitloops-gherkin
 *  Copyright (C) 2022 Bitloops S.A.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  For further information you can contact legal(at)bitloops.com.
 */
import { google } from 'googleapis';
import { TextEncoder } from 'util';
import fs from 'fs';
import path from 'path';

export class Encoder {
  // private testFile: string;
  private featureFile: string;
  private encoder = new TextEncoder();
  private sheets;

  constructor(apiKey: string, testFile: string) {
    // this.testFile = testFile;
    if (testFile.includes('.feature')) {
      this.featureFile = testFile;
    } else {
      const dir = path.dirname(testFile);
      const tempFeatureFile = getFeatureFile(testFile);
      if (path.isAbsolute(tempFeatureFile)) {
        this.featureFile = tempFeatureFile;
      } else {
        this.featureFile = path.normalize(`${dir.split('/__tests__/')[0]}/${tempFeatureFile}`);
      }
    }
    this.sheets = google.sheets({
      version: 'v4',
      auth: apiKey,
    });
  }

  public encodeFeatureFile = async (): Promise<void> => {
    const testFileLines = readFile(this.featureFile).split('\n');
    const cleanFile: string[] = [];
    const newFile: string[] = [];
    const spreadsheetId = testFileLines[0].split('spreadsheets/d/')[1].split('/')[0];
    if (!spreadsheetId) return;
    let previousLineWasEmpty = false;
    for (let i = 0; i < testFileLines.length; i++) {
      if (testFileLines[i].trim() === '' && previousLineWasEmpty === false) {
        cleanFile.push(testFileLines[i]);
        previousLineWasEmpty = true;
      } else if (testFileLines[i].trim() === '' && previousLineWasEmpty === true) {
        previousLineWasEmpty = true;
      } else if (!testFileLines[i].includes('@bitloops-auto-generated')) {
        previousLineWasEmpty = false;
        cleanFile.push(testFileLines[i]);
      }
    }
    let tabName = '';
    for (let i = 0; i < cleanFile.length; i++) {
      newFile.push(cleanFile[i]);
      if (cleanFile[i].trim().startsWith('Scenario')) {
        if (cleanFile[i].trim().startsWith('Scenario Template:')) {
          tabName = cleanFile[i].split('Scenario Template:')[1].trim();
        } else if (cleanFile[i].trim().startsWith('Scenario Outline:')) {
          tabName = cleanFile[i].split('Scenario Outline:')[1].trim();
        }
      } else if (tabName !== '' && cleanFile[i].trim() === '') {
        const testData = await this.getAllTestData(spreadsheetId, tabName);
        newFile.push(testData);
        tabName = '';
      }
    }
    // console.log('========== CLEAN FILE ==========');
    // console.log(cleanFile.join('\n'));
    // console.log('========== NEW FILE ==========');
    // console.log(newFile.join('\n'));
    fs.writeFileSync(this.featureFile, newFile.join('\n'));
  };

  private getAllTestData = async (spreadsheetId: string, tabName: string): Promise<string> => {
    const params = {
      spreadsheetId,
      range: `${tabName}!A:Z`,
    };
    return new Promise((resolve, reject) => {
      this.sheets.spreadsheets.values.get(params, (err, res) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        const rows = res.data.values;
        if (rows.length === 0) {
          console.log('No data found.');
        } else {
          let outputString = `   # Examples: # @bitloops-auto-generated
  `;
          let encodedString = `    Examples: # @bitloops-auto-generated
  `;
          for (let i = 0; i < rows.length; i++) {
            let row = '|';
            let encodedRow = '|';
            for (let j = 0; j < rows[i].length; j++) {
              if (
                j > 0 &&
                (rows[i][0].toLowerCase().includes('active') ||
                  rows[i][0].toLowerCase() === '@status') &&
                !rows[0][j].includes('@ignore')
              ) {
                row += ` ${rows[i][j]} |`;
                encodedRow += ` ${this.encoder.encode(rows[i][j])} |`;
              }
            }
            if (i === 0) {
              outputString += `     # ${row.replaceAll('\n', ' ')} @bitloops-auto-generated |
  `;
              encodedString += `      ${row} @bitloops-auto-generated |
  `;
            } else if (row !== '|') {
              outputString += `     # ${row.replaceAll('\n', ' ')} @bitloops-auto-generated |
  `;
              encodedString += `      ${encodedRow} @bitloops-auto-generated |
  `;
            }
          }
          resolve(outputString + '\n' + encodedString);
        }
      });
    });
  };
}

const getFeatureFile = (testFile: string): string => {
  let fileContents = readFile(testFile);
  fileContents = fileContents.replace(/\r?\n|\r/g, ' ');
  if (fileContents.includes("loadFeature('")) {
    const firstPart = fileContents.split("loadFeature('")[1];
    const fileName = firstPart.split("'")[0];
    return fileName;
  } else if (fileContents.includes('loadFeature("')) {
    const firstPart = fileContents.split('loadFeature("')[1];
    const fileName = firstPart.split('"')[0];
    return fileName;
  } else {
    const featureFileGuess = testFile
      .replace('.steps.ts', '.feature')
      .replace('.steps.js', '.feature')
      .replace('/step-definitions/', '/features/');
    try {
      readFile(featureFileGuess);
      return featureFileGuess;
    } catch {
      throw new Error(`:'( Could not find the feature file mentioned in the test file.
        Make sure you include a loadFeature() call in your test file...`);
    }
  }
};

const readFile = (file: string): string => {
  const data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
  return data;
};

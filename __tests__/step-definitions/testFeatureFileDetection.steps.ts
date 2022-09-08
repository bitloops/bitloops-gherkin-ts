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
import { defineFeature, loadFeature } from 'jest-cucumber';
import { decode, d } from '../../index.js';
import { Encoder } from '../../src/Encoder.js';

const feature = loadFeature('./__tests__/features/testFeatureFileDetection.feature');

class Tester extends Encoder {
  constructor(apiKey: string, testFile: string, readFileDI = (str: string) => str) {
    super(apiKey, testFile, readFileDI);
  }

  public getFeatureFile = this.getFeatureFile;
}

defineFeature(feature, (test) => {
  let cwd;
  let inputFile;
  let fileContents;
  let outputFile;

  test('Feature File Should be Found', ({ given, when, then }) => {
    given(/^I have the cwd (.*), inputFile (.*), fileContents (.*)$/, (arg0, arg1, arg2) => {
      cwd = decode(arg0);
      inputFile = decode(arg1);
      fileContents = decode(arg2);
    });

    when('I calculate the result', () => {
      outputFile = new Tester('', inputFile, () => fileContents).getFeatureFile(
        inputFile,
        () => fileContents,
        cwd,
      );
    });

    then(/^I should get (.*)$/, (arg1) => {
      expect(outputFile).toEqual(d(arg1));
    });
  });
});

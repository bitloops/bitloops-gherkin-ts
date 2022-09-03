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
import chalk from 'chalk';
import inquirer, { QuestionCollection } from 'inquirer';
import { Encoder } from '../Encoder.js';
import { copyrightSnippet } from './copyright.js';

interface ICollection {
  testFile: string;
  apiKey: string;
}

const questions: QuestionCollection<ICollection> = [
  {
    type: 'input',
    name: 'testFile',
    message: 'What is the location of your test file?',
  },
];

const encode = async (source: ICollection): Promise<void> => {
  console.log();
  console.log(copyrightSnippet);
  console.log();
  const answers = await inquirer.prompt(questions, source);
  const apiKey = source.apiKey || process.env.BITLOOPS_GHERKIN_GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    const redColor = chalk.hex('#ff0000');
    console.error(redColor('BITLOOPS_GHERKIN_GOOGLE_SHEETS_API_KEY not set'));
    process.exit(1);
  }
  const { testFile } = answers;
  const encoder = new Encoder(apiKey, testFile);
  await encoder.encodeFeatureFile();
};

export default encode;

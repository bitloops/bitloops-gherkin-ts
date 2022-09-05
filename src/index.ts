#!/usr/bin/env node
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
import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { TextEncoder } from 'util';
// import fs from 'fs';
// import path from 'path';
// import appRoot from 'app-root-path';

import { decoder } from './decoder.js';
import enc from './commands/encode.js';
import copyright, { copyrightSnippet } from './commands/copyright.js';

export const VERSION = '0.2.3';

const decode = decoder;
const d = decoder;
const encode = new TextEncoder().encode;

const program = new Command();

const purpleColor = chalk.hex('#7700e5');
console.log(purpleColor(figlet.textSync('Bitloops Gherkin', { horizontalLayout: 'default' })));

program
  .version('0.0.1')
  .description(
    'bitloops-gherkin is a node.js package and CLI that allows you to generate Gherkin tables in Cucumber feature files using Google Sheets',
  );
program.summary(
  'bitloops-gherkin is a CLI that allows you to generate Gherkin tables in Cucumber feature files using Google Sheets',
);
program.description(copyrightSnippet);
program
  .command('encode')
  .description('Initialize Bitloops')
  .option('-t, --testFile <string>')
  .option('-k, --apiKey <string>')
  .action(enc);

program.command('copyright').description('Print copyright information').action(copyright);

program
  .command('version')
  .description('Print version information')
  .action(() => {
    // fs.readFile(path.join(appRoot.path, './package.json'), 'utf8', (err, data) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    console.log(`You are running v${VERSION}`);
    // });
  });

program.parse(process.argv);

export { decode, d, encode };

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
import { decode, d } from 'bitloops-gherkin';

const feature = loadFeature('./__tests__/features/testGoogleSheets.feature');

defineFeature(feature, (test) => {
  let calculationString;
  let result;

  test('Valid arithmetic calculations', ({ given, when, then }) => {
    given(/^I have the calculation string (.*)$/, (arg0) => {
      calculationString = decode(arg0);
    });

    when('I calculate the result', () => {
      result = eval(calculationString).toString();
    });

    then(/^I should see the result (.*)$/, (arg1) => {
      expect(result).toEqual(decode(arg1));
    });
  });

  test('Invalid arithmetic calculations', ({ given, then }) => {
    given(/^I have the calculation string (.*)$/, (arg0) => {
      calculationString = d(arg0);
    });

    then(/^I should receive an error (.*)$/, (arg1) => {
      expect(() => eval(calculationString)).toThrow(d(arg1));
    });
  });
});

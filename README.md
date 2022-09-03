![Bitloops](https://storage.googleapis.com/wwwbitloopscom/bitloops-logo_320x80.png)
# bitloops-gherkin

[![npm version][npmimg]][npm]
[![Known Vulnerabilities][snyk-image]][snyk-url]

node.js package that allows you to generate gherkin tables in Cucumber feature files using Google Sheets

![Demo](https://storage.googleapis.com/bitloops-github-assets/bitloops-gherkin.gif)

## Installation

> Only yarn or npm is necessary! Don't do both!

If you install the global CLI, then you can fill your feature files by using the **bitloops-gherkin** command directly. If you only install it as a developer dependency add something like this in your scripts:

```json
"encode": "./node_modules/.bin/env-cmd --silent -f .env ./node_modules/.bin/bitloops-gherkin encode -t",
```

In any case, it is advisable to install the developer dependency in your projects in order to import the decode function in your tests ([see](#step-3))

### Yarn

To use as a developer dependency

```bash
yarn add -D bitloops-gherkin
```

Global package to run as a CLI

```bash
yarn global add bitloops-gherkin
```

### npm

To use as a developer dependency

```bash
npm install --save-dev bitloops-gherkin
```

Global package to run as a CLI

```bash
npm install -g bitloops-gherkin
```

## Usage

### Requirements

- A Google Cloud Platform project (if you don't have one it is free to create one)
- Node.js (>=12)
- Google Drive account

### Step 1 (Only need to do this once)

Enable the Google Sheets API and get an API credentials file from your Google Cloud Platform project.

See:
[Google Cloud Platform - Enable APIs](https://developers.google.com/workspace/guides/enable-apis)
[Google Cloud Platform - Create API Key](https://developers.google.com/workspace/guides/create-credentials#api-key)

Keep note of your API key.

You have two ways of using your API key. Either you include it in your command when you run the encode process ([see](#optional)) or just add it in a .env file as a parameter named **BITLOOPS_GHERKIN_GOOGLE_SHEETS_API_KEY**

### Step 2

Create your Google Sheet that will contain your tests. Name the tabs after your tests as can be found in your steps file. See this [example](https://docs.google.com/spreadsheets/d/1ILKwKeRaOEh7_uAVIyfDVqUPbEdCNIlAaOEFY-zdMzU/edit#gid=0).
> Make sure the Google Sheet has public read permissions.

First of all, we create our Cucumber feature file as normal but instead of including the usual ***Example*** table, we add the Google sheet that contains our tests.

**Feature file** (*e.g. testGoogleSheets.feature*)

```feature
# https://docs.google.com/spreadsheets/d/1ILKwKeRaOEh7_uAVIyfDVqUPbEdCNIlAaOEFY-zdMzU/edit#gid=0
Feature: Test Google Sheets test generation using Bitloops

  Scenario Template: Valid arithmetic calculations
    Given I have the calculation string <calculationString>
    When I calculate the result
    Then I should see the result <output>

  Scenario Template: Invalid arithmetic calculations
    Given I have the calculation string <calculationString>
    Then I should receive an error <output>
```

### Step 3

In your steps.ts file make sure you import **bitloops-gherkin** and wrap all test data with the **decode** or **d** functions.

```typescript
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
      console.log(decoder(arg1));
      expect(() => eval(calculationString)).toThrow(d(arg1));
    });
  });
});
```

### Step 4

Using an terminal command you can run the following:

>./node_modules/.bin/env-cmd -f .env bitloops-gherkin encode -t ./\_\_tests\_\_/step-definitions/testGoogleSheets.step.ts -k y0urAP1KeyHere

Using a .env file you can run the following:

> ./node_modules/.bin/env-cmd -f .env bitloops-gherkin encode -t ./\_\_tests\_\_/step-definitions/testGoogleSheets.step.ts

### That's it!

You should see your feature file automatically populated like below:

```feature
# https://docs.google.com/spreadsheets/d/1ILKwKeRaOEh7_uAVIyfDVqUPbEdCNIlAaOEFY-zdMzU/edit#gid=0
Feature: Test Google Sheets test generation using Bitloops

  Scenario Template: Valid arithmetic calculations
    Given I have the calculation string <calculationString>
    When I calculate the result
    Then I should see the result <output>

   # Examples: # @bitloops-auto-generated
       # | calculationString | output | @bitloops-auto-generated |
       # | 3 + 3 | 6 | @bitloops-auto-generated |
       # | 2 * 7 | 14 | @bitloops-auto-generated |
       # | 3 + 5 * 8 | 43 | @bitloops-auto-generated |
  
    Examples: # @bitloops-auto-generated
        | calculationString | output | @bitloops-auto-generated |
        | 51,32,43,32,51 | 54 | @bitloops-auto-generated |
        | 50,32,42,32,55 | 49,52 | @bitloops-auto-generated |
        | 51,32,43,32,53,32,42,32,56 | 52,51 | @bitloops-auto-generated |
  
  Scenario Template: Invalid arithmetic calculations
    Given I have the calculation string <calculationString>
    Then I should receive an error <output>

   # Examples: # @bitloops-auto-generated
       # | calculationString | output | @bitloops-auto-generated |
       # | 3 + hello | hello is not defined | @bitloops-auto-generated |
       # | 2 * world | world is not defined | @bitloops-auto-generated |
  
    Examples: # @bitloops-auto-generated
        | calculationString | output | @bitloops-auto-generated |
        | 51,32,43,32,104,101,108,108,111 | 104,101,108,108,111,32,105,115,32,110,111,116,32,100,101,102,105,110,101,100 | @bitloops-auto-generated |
        | 50,32,42,32,119,111,114,108,100 | 119,111,114,108,100,32,105,115,32,110,111,116,32,100,101,102,105,110,101,100 | @bitloops-auto-generated |
  
```

As you can see, your feature file now contains two sets of examples: one that is commented using # with your actual data for readability, and one with numbers that represent the Buffer encoded values of your data, allowing you to put any kind of data in your Gherkin tables.

> PRO Tip: you can use structured JSON data to add any kind of test data in your tables.

### Optional

To make it easier to run your command, while loading your **.env** file, you can create a script to place in your **package.json** file like the following:

```json
"encode": "./node_modules/.bin/env-cmd --silent -f .env bitloops-gherkin encode -t",
```

Then to download and encode your tests into your **feature** file you can just run this (***note that you pass the step.ts file not the feature file***):

```bash
yarn encode ./__tests__/step-definitions/testGoogleSheets.step.ts
```

Finally, if you do not want to install the global CLI, you can add the following command to your **package.json**:

```json
"encode": "./node_modules/.bin/env-cmd --silent -f .env ./node_modules/.bin/bitloops-gherkin encode -t",
```

## Limitations

Currently, bitloops-gherkins supports API keys and public Google Sheet files. In the future, private sheets will also be supported.

# Like what you see? Don't forget to star ⭐ our repo!

[snyk-image]: https://snyk.io/test/github/bitloops/bitloops-gherkin-ts/badge.svg
[snyk-url]: https://snyk.io/test/github/bitloops/bitloops-gherkin-ts
[npmimg]: https://img.shields.io/npm/v/bitloops-gherkin.svg
[npm]: https://www.npmjs.org/package/bitloops-gherkin
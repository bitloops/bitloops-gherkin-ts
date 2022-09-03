![Bitloops](https://storage.googleapis.com/wwwbitloopscom/bitloops-logo_320x80.png)

# bitloops-gherkin Demo

Example of usage of bitloops-gherkin

![Demo](https://storage.googleapis.com/bitloops-github-assets/bitloops-gherkin.gif)

Run the following commands to run this project locally:

## 1. Clone the repo

```bash
git clone git@github.com:bitloops/bitloops-gherkin-ts.git
```

## 2. Go to the examples folder

```bash
cd bitloops-gherkin-ts/examples
```

### 3. Install packages

```bash
yarn
```

### 4. Run the encoding process

#### 4a. Get your Google API key

Follow these instructions to get an API key:
[Google Cloud Platform - Enable APIs](https://developers.google.com/workspace/guides/enable-apis)
[Google Cloud Platform - Create API Key](https://developers.google.com/workspace/guides/create-credentials#api-key)

#### 4b. Run the encoding!

Place it in a .env file in the root of the examples project (see the [.env.template](https://github.com/bitloops/bitloops-gherkin-ts/blob/main/examples/.env.template) file)

```bash
yarn encode ./__tests__/step-definitions/testGoogleSheets.step.ts
```

or add the -k flag at the end of the encode command

```bash
yarn encode ./__tests__/step-definitions/testGoogleSheets.step.ts -k yourAPIkeyHere
```

(You need to get your API key from Google and you can either put)

Run your tests

```bash
yarn test ./__tests__/step-definitions/testGoogleSheets.step.ts
```

### Done!
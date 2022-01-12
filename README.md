# Parse PDF -> JSON -> CSV
![titleimge](https://user-images.githubusercontent.com/34210193/149134610-bdd6f822-a897-4986-877a-6c27522b03cd.jpg)

## How to use

Before the first run you should ensure you have following tools installed:

### Dependencies

To run this code you need the following dependencies:

- [yarn](https://www.npmjs.com/package/yarn) or [npm](npmjs.com)
- [node](https://nodejs.org/en/) (I recommend using [nvm](https://github.com/nvm-sh/nvm) for this)

Afterwards you should be able to install the project specific node packages with `yarn` / `npm i`

### Running the parser

For every run the [config file](./src/config.js) needs to be adjusted like so:

```
{
    PDF_INPUT_DIRECTORY: PUT_PDF_INPUT_DIRECTORY_HERE,
    JSON_OUTPUT_DIRECTORY: PUT_JSON_OUTPUT_DIRECTORY_HERE
    CSV_OUTPUT_DIRECTORY: PUT_CSV_OUTPUT_DIRECTORY_HERE
}
```

Then run this command in your Terminal from the root directory
`yarn run-parser` / `npm run-parser`

## Background

This tool helps employees of the [Department of Experimental Neurology](https://expneuro.charite.de/en/) to process the data from an auto-generated PDF into CSV, which was done by hand before. Because of the PDF being auto-generated this code is very static and depends heavily on the structure of that PDF being consistent.

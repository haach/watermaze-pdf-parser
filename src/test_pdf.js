const fs = require('fs');
PDFParser = require('pdf2json');
const {config} = require('./config');

console.log('testing first PDF');

const directory = `${config.PDF_INPUT_DIRECTORY}/Tag 1/Gruppe 1/`;
const arrayOfRunFiles = fs.readdirSync(directory);

// Set up the pdf parser
let pdfParser = new PDFParser(this, 1);

// Load the pdf document
pdfParser.loadPDF(`${directory}/${arrayOfRunFiles[1]}`);
pdfParser.on('pdfParser_dataReady', (_pdfData) => {
  // Return the parsed data
  console.log('PDF data', JSON.stringify(_pdfData));
});

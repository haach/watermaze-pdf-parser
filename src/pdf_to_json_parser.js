const fs = require('fs');
PDFParser = require('pdf2json');
const {emptyRun} = require('./emptyStructure');
const {index} = require('./fileIndexer');
const {config} = require('./config');

console.log('... 🤖 processing PDFs ');

function clone(a) {
  return JSON.parse(JSON.stringify(a));
}

const writeJsonFileToFS = (name, json) => {
  fs.writeFile(`${config.JSON_OUTPUT_DIRECTORY}/${name}.json`, JSON.stringify(json), {flag: 'wx'}, (err) => {
    if (err) console.error('error', err);
  });
};

const getAllIndexes = (arr, val) => {
  var indexes = [],
    i;
  for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
  return indexes;
};

const writeRunToData = (decodedArray) => {
  const dataSet = clone(emptyRun);
  // Take first 4 keys of empty object
  Object.keys(dataSet).forEach((key, idx) => {
    if (idx < 4) {
      const indexOfCurrent = getAllIndexes(decodedArray, key)[1];
      // Find them in the decodedArray
      dataSet[key].ZeitMs = decodedArray[indexOfCurrent + 1];
      dataSet[key].Besuche = decodedArray[indexOfCurrent + 2];
      dataSet[key].Strecke = decodedArray[indexOfCurrent + 3];
      dataSet[key].ZeitTotal = decodedArray[indexOfCurrent + 4];
      dataSet[key].Latenz = decodedArray[indexOfCurrent + 5];
    }
  });
  // Manually map "Total"
  const indexOfTotal = getAllIndexes(decodedArray, 'Total')[0];
  dataSet.Total.ZeitMs = decodedArray[indexOfTotal + 1];
  dataSet.Total.Besuche = decodedArray[indexOfTotal + 2];
  dataSet.Total.Strecke = decodedArray[indexOfTotal + 3];
  dataSet.Total.Geschw = decodedArray[indexOfTotal + 4];

  return dataSet;
};

const identifyRun = (decodedArray) => {
  // Fixed indices on the pdf
  return {
    group: decodedArray[30],
    mouse: decodedArray[29],
    run: decodedArray[31].includes('run ') ? decodedArray[31].split('run ')[1] : decodedArray[31].split('run')[1], // 31
  };
};

const jsonIntoEmpty = (existingResult, json) => {
  let content = JSON.parse(json);
  let textPerPage = content['formImage']['Pages'].flatMap((page) => page['Texts']);
  let textObjects = textPerPage.flatMap((textObject) => textObject && textObject.R);
  let decodedArray = textObjects.map((obj) => decodeURIComponent(obj.T).trim());
  console.log(
    `decodedArray`,
    decodedArray.reduce((acc, val, idx) => {
      acc[idx] = val;
      return acc;
    }, {})
  );
  const runData = identifyRun(decodedArray);
  existingResult[`group${runData.group}`][`mouse${runData.mouse}`][`run${runData.run}`] = writeRunToData(decodedArray);
};

const parsePDFs = async (day) => {
  const emptyfileContent = fs.readFileSync(`src/output/empty-day.json`);
  const existingResult = JSON.parse(emptyfileContent);

  for (const group of index.groups) {
    const directory = `${config.PDF_INPUT_DIRECTORY}/Tag ${day}/Gruppe ${group}/`;
    const arrayOfRunFiles = fs.readdirSync(directory).filter((el) => el !== '.DS_Store');
    let pdfs = [];

    for (const fileName of arrayOfRunFiles) {
      await (async () => {
        try {
          // Set up the pdf parser
          let pdfParser = new PDFParser(this, 1);

          // Load the pdf document
          pdfParser.loadPDF(`${directory}/${fileName}`);

          let pdfData = await new Promise(async (resolve, reject) => {
            // On data ready
            pdfParser.on('pdfParser_dataReady', (_pdfData) => {
              // Return the parsed data
              resolve(JSON.stringify(_pdfData));
            });
          });
          // Add the pdfData to the pdfs array
          pdfs.push(pdfData);
          return 'success';
        } catch (err) {
          console.log('Error parsing pdf', fileName, '\n', err);
        }
      })();
    }

    for (const pdfJSON of pdfs) {
      jsonIntoEmpty(existingResult, pdfJSON);
    }
    writeJsonFileToFS(`results-day-${day}`, existingResult);
  }
  return 'success';
};

const generateJSON = async () => {
  if (!index.days) {
    console.error('\x1b[31m', 'ERR: Wrong input path defined');
    return;
  }
  for (const day of index.days) {
    await parsePDFs(day);
    console.log(`🧡 Data for day ${day} written to "${config.JSON_OUTPUT_DIRECTORY}/results-day-${day}.json"`);
  }
};

generateJSON();

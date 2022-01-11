const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const {config} = require('./config');
const {index} = require('./fileIndexer');
const header = [
  {id: 'group', title: 'Gruppe'},
  {id: 'mouse', title: 'Mausnr'},

  {id: 's1', title: 's1'},
  {id: 's2', title: 's2'},
  {id: 's3', title: 's3'},

  {id: 'speed_Run1', title: 'speed in cm/s run 1'},
  {id: 'speed_Run2', title: 'speed in cm/s run 2'},
  {id: 'speed_Run3', title: 'speed in cm/s run 3'},

  {id: 't1', title: 't1'},
  {id: 't2', title: 't2'},
  {id: 't3', title: 't3'},

  // Strecke
  {id: 'Q1_Run1_Strecke', title: 'in cm Q1/Run1'},
  {id: 'Q1_Run2_Strecke', title: 'Q1/Run2'},
  {id: 'Q1_Run3_Strecke', title: 'Q1/Run3'},

  {id: 'Q2_Run1_Strecke', title: 'in cm Q2/Run1'},
  {id: 'Q2_Run2_Strecke', title: 'Q2/Run2'},
  {id: 'Q2_Run3_Strecke', title: 'Q2/Run3'},

  {id: 'Q3_Run1_Strecke', title: 'in cm Q3/Run1'},
  {id: 'Q3_Run2_Strecke', title: 'Q3/Run2'},
  {id: 'Q3_Run3_Strecke', title: 'Q3/Run3'},

  {id: 'Q4_Run1_Strecke', title: 'in cm Q4/Run1'},
  {id: 'Q4_Run2_Strecke', title: 'Q4/Run2'},
  {id: 'Q4_Run3_Strecke', title: 'Q4/Run3'},

  // Besuche
  {id: 'Q1_Run1_Besuche', title: 'Q1/Run1 visits'},
  {id: 'Q1_Run2_Besuche', title: 'Q1/Run2 visits'},
  {id: 'Q1_Run3_Besuche', title: 'Q1/Run3 visits'},

  {id: 'Q2_Run1_Besuche', title: 'Q2/Run1 visits'},
  {id: 'Q2_Run2_Besuche', title: 'Q2/Run2 visits'},
  {id: 'Q2_Run3_Besuche', title: 'Q2/Run3 visits'},

  {id: 'Q3_Run1_Besuche', title: 'Q3/Run1 visits'},
  {id: 'Q3_Run2_Besuche', title: 'Q3/Run2 visits'},
  {id: 'Q3_Run3_Besuche', title: 'Q3/Run3 visits'},

  {id: 'Q4_Run1_Besuche', title: 'Q4/Run1 visits'},
  {id: 'Q4_Run2_Besuche', title: 'Q4/Run2 visits'},
  {id: 'Q4_Run3_Besuche', title: 'Q4/Run3 visits'},

  // ZeitTotal
  {id: 'Q1_Run1_ZeitTotal', title: 'Q1/run1 Zeit total in %'},
  {id: 'Q1_Run2_ZeitTotal', title: 'Q1/Run2 Zeit total in %'},
  {id: 'Q1_Run3_ZeitTotal', title: 'Q1/Run3 Zeit total in %'},

  {id: 'Q2_Run1_ZeitTotal', title: 'Q2/Run1 Zeit total in %'},
  {id: 'Q2_Run2_ZeitTotal', title: 'Q2/Run2 Zeit total in %'},
  {id: 'Q2_Run3_ZeitTotal', title: 'Q2/Run3 Zeit total in %'},

  {id: 'Q3_Run1_ZeitTotal', title: 'Q3/Run1 Zeit total in %'},
  {id: 'Q3_Run2_ZeitTotal', title: 'Q3/Run2 Zeit total in %'},
  {id: 'Q3_Run3_ZeitTotal', title: 'Q3/Run3 Zeit total in %'},

  {id: 'Q4_Run1_ZeitTotal', title: 'Q4/Run1 Zeit total in %'},
  {id: 'Q4_Run2_ZeitTotal', title: 'Q4/Run2 Zeit total in %'},
  {id: 'Q4_Run3_ZeitTotal', title: 'Q4/Run3 Zeit total in %'},
];
const mapFileToCSV = (json, day) => {
  const records = [];
  let mouseNr = 1;
  const groups = Object.keys(json);
  groups.map((group) => {
    // map over group
    const mice = Object.keys(json[group]);
    mice.map((mouse) => {
      const mouseData = json[group][mouse];
      const record = {
        group: group.split('group')[1], // "group1" --> "1",
        mouse: mouseNr++,

        s1: mouseData.run1.Total.Strecke,
        s2: mouseData.run2.Total.Strecke,
        s3: mouseData.run3.Total.Strecke,

        speed_Run1: mouseData.run1.Total.Geschw,
        speed_Run2: mouseData.run2.Total.Geschw,
        speed_Run3: mouseData.run3.Total.Geschw,

        t1: mouseData.run1.Total.ZeitMs,
        t2: mouseData.run2.Total.ZeitMs,
        t3: mouseData.run3.Total.ZeitMs,

        // Strecke
        Q1_Run1_Strecke: mouseData.run1['Quadrant 1'].Strecke,
        Q1_Run2_Strecke: mouseData.run2['Quadrant 1'].Strecke,
        Q1_Run3_Strecke: mouseData.run3['Quadrant 1'].Strecke,

        Q2_Run1_Strecke: mouseData.run1['Quadrant 2'].Strecke,
        Q2_Run2_Strecke: mouseData.run2['Quadrant 2'].Strecke,
        Q2_Run3_Strecke: mouseData.run3['Quadrant 2'].Strecke,

        Q3_Run1_Strecke: mouseData.run1['Quadrant 3'].Strecke,
        Q3_Run2_Strecke: mouseData.run2['Quadrant 3'].Strecke,
        Q3_Run3_Strecke: mouseData.run3['Quadrant 3'].Strecke,

        Q4_Run1_Strecke: mouseData.run1['Quadrant 4'].Strecke,
        Q4_Run2_Strecke: mouseData.run2['Quadrant 4'].Strecke,
        Q4_Run3_Strecke: mouseData.run3['Quadrant 4'].Strecke,

        // Besuche
        Q1_Run1_Besuche: mouseData.run1['Quadrant 1'].Besuche,
        Q1_Run2_Besuche: mouseData.run2['Quadrant 1'].Besuche,
        Q1_Run3_Besuche: mouseData.run3['Quadrant 1'].Besuche,

        Q2_Run1_Besuche: mouseData.run1['Quadrant 2'].Besuche,
        Q2_Run2_Besuche: mouseData.run2['Quadrant 2'].Besuche,
        Q2_Run3_Besuche: mouseData.run3['Quadrant 2'].Besuche,

        Q3_Run1_Besuche: mouseData.run1['Quadrant 3'].Besuche,
        Q3_Run2_Besuche: mouseData.run2['Quadrant 3'].Besuche,
        Q3_Run3_Besuche: mouseData.run3['Quadrant 3'].Besuche,

        Q4_Run1_Besuche: mouseData.run1['Quadrant 4'].Besuche,
        Q4_Run2_Besuche: mouseData.run2['Quadrant 4'].Besuche,
        Q4_Run3_Besuche: mouseData.run3['Quadrant 4'].Besuche,

        // ZeitTotal
        Q1_Run1_ZeitTotal: mouseData.run1['Quadrant 1'].ZeitTotal,
        Q1_Run2_ZeitTotal: mouseData.run2['Quadrant 1'].ZeitTotal,
        Q1_Run3_ZeitTotal: mouseData.run3['Quadrant 1'].ZeitTotal,

        Q2_Run1_ZeitTotal: mouseData.run1['Quadrant 2'].ZeitTotal,
        Q2_Run2_ZeitTotal: mouseData.run2['Quadrant 2'].ZeitTotal,
        Q2_Run3_ZeitTotal: mouseData.run3['Quadrant 2'].ZeitTotal,

        Q3_Run1_ZeitTotal: mouseData.run1['Quadrant 3'].ZeitTotal,
        Q3_Run2_ZeitTotal: mouseData.run2['Quadrant 3'].ZeitTotal,
        Q3_Run3_ZeitTotal: mouseData.run3['Quadrant 3'].ZeitTotal,

        Q4_Run1_ZeitTotal: mouseData.run1['Quadrant 4'].ZeitTotal,
        Q4_Run2_ZeitTotal: mouseData.run2['Quadrant 4'].ZeitTotal,
        Q4_Run3_ZeitTotal: mouseData.run3['Quadrant 4'].ZeitTotal,
      };
      records.push(record);
    });
  });

  var csvWriter = new createCsvWriter({
    path: `${config.CSV_OUTPUT_DIRECTORY}/results-day-${day}.csv`,
    header: header,
  });
  csvWriter.writeRecords(records).then(() => {
    return true;
  });
};

const readFileAndCreateCSV = async (day) => {
  try {
    fileContent = await fs.readFileSync(`${config.JSON_OUTPUT_DIRECTORY}/results-day-${day}.json`);
  } catch (err) {
    console.error(`Could not read file: ${config.JSON_OUTPUT_DIRECTORY}/results-day-${day}.json`);
  }
  if (fileContent) {
    mapFileToCSV(JSON.parse(fileContent), day);
    return 'sucess';
  }
};

const generateCSV = async () => {
  for (const day of index.days) {
    await readFileAndCreateCSV(day);
    console.log(`Your CSV file for day ${day} is here: ${config.CSV_OUTPUT_DIRECTORY}/results-day-${day}.json`);
  }
  console.log('✅ Done');
};

generateCSV();

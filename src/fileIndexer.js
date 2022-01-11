const fs = require('fs');
const {config} = require('./config');
const index = {};

const recursiveFolderRead = (path, prefix) => {
  return fs
    .readdirSync(path)
    .filter((el) => el.includes(prefix))
    .map((el) => el.split(prefix)[1]);
};

const indexDirectoriesInSourcePath = () => {
  const path = `${config.PDF_INPUT_DIRECTORY}`;
  try {
    days = recursiveFolderRead(path, 'Tag ');
    index.days = days;
    groups = recursiveFolderRead(`${path}/Tag ${days[0]}`, 'Gruppe ');
    index.groups = groups;
    return index;
  } catch (err) {
    console.log(err);
  }
};

indexDirectoriesInSourcePath();

module.exports = {index, recursiveFolderRead};

const fs = require('fs');
const path = require('path');
const {config} = require('./config');
const index = {};

const recursiveFolderRead = (_path, prefix) => {
  return fs
    .readdirSync(_path)
    .filter((el) => el.includes(prefix))
    .map((el) => el.split(prefix)[1]);
};

const indexDirectoriesInSourcePath = () => {
  const _path = path.join(__dirname, `/input/${config.EXPERIMENT_ID}`);
  try {
    days = recursiveFolderRead(_path, 'Tag ');
    index.days = days;
    groups = recursiveFolderRead(`${_path}/Tag ${days[0]}`, 'Gruppe ');
    index.groups = groups;
    return index;
  } catch (err) {
    console.log(err);
  }
};

indexDirectoriesInSourcePath();

module.exports = {index, recursiveFolderRead};

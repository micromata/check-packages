'use strict';

const loadJsonFile = require('load-json-file');
const transformListEntry = require('./transform-list-entry');

const hasArrayNonStringEntry = array => array.filter(item => typeof item !== 'string').length > 0;

const readChecklistFile = path => {
  const fileContent = loadJsonFile.sync(path);

  if (!Array.isArray(fileContent) || hasArrayNonStringEntry(fileContent)) {
    throw new Error('Invalid content of checklist JSON file.');
  }

  return fileContent.
    map(transformListEntry).
    filter(item => item);
};

module.exports = readChecklistFile;

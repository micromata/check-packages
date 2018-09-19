'use strict';

const loadJsonFile = require('load-json-file');

const hasArrayNonStringEntry = array => array.filter(item => typeof item !== 'string').length > 0;

const readWhitelistFile = path => {
  const fileContent = loadJsonFile.sync(path);

  if (!Array.isArray(fileContent) || hasArrayNonStringEntry(fileContent)) {
    throw new Error('Invalid content of whitelist JSON file.');
  }

  return fileContent;
};

module.exports = readWhitelistFile;

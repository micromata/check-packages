'use strict';

const childProcess = require('child_process');

const readDependencyTree = mode => {
  mode = mode ? ` --${mode}` : '';
  const result = childProcess.execSync(`npm ls --json${mode}`);

  return JSON.parse(result);
};

module.exports = readDependencyTree;

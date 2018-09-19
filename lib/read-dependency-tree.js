'use strict';

const childProcess = require('child_process');

const readDependencyTree = mode => {
  const args = [ 'ls', '--json' ];

  if (mode) {
    args.push(`--${mode}`);
  }

  const result = childProcess.spawnSync('npm', args);

  return JSON.parse(result.stdout);
};

module.exports = readDependencyTree;

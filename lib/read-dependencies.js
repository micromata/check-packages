'use strict';

const childProcess = require('child_process');

const readDependenies = mode => {
  const args = [ 'ls', '--json' ];

  if (mode) {
    args.push(`--${mode}`);
  }

  const result = childProcess.spawnSync('npm', args);

  return {
    tree: JSON.parse(result.stdout),
    problems: result.stderr ? result.stderr.toString() : ''
  };
};

module.exports = readDependenies;

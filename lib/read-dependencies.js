'use strict';

const childProcess = require('child_process');

const readDependencies = (options = []) => {
  const args = [ 'ls', '--json' ];

  options.forEach(option => args.push(`--${option}`));

  const result = childProcess.spawnSync('npm', args);

  return {
    tree: JSON.parse(result.stdout),
    problems: result.stderr ? result.stderr.toString() : ''
  };
};

module.exports = readDependencies;

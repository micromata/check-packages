'use strict';

const childProcess = require('child_process');

const readDependencies = (options = []) => {
  const args = [ 'ls', '--json' ];

  options.forEach(option => args.push(`--${option}`));

  const result = childProcess.spawnSync('npm', args);
  const tree = JSON.parse(result.stdout);

  // mark root level -> we want to exclude this level from analysis
  tree.isRoot = true;

  return {
    tree,
    problems: result.stderr ? result.stderr.toString() : ''
  };
};

module.exports = readDependencies;

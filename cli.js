#!/usr/bin/env node
'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const chalk = require('chalk');

const readWhitelistFile = require('./lib/read-whitelist-file');
const readDependencies = require('./lib/read-dependencies');
const flattenDependencyTree = require('./lib/flatten-dependency-tree');

const cli = meow(`
  Usage
    $ check-pkg-whitelist <list.json> [options]

  Options
    --blacklist    -black  Interpret list.json content as blacklisted dependency names.
    --depth               Max depth of the dependency tree analysis.
    --development  -dev   Analyze the dependency tree for packages in devDependencies.
    --production   -prod  Analyze the dependency tree for packages in dependencies.
    --version      -v     Displays the version number.
    --help         -h     Displays the help.

  Examples
    $ package "check-pkg-whitelist whitelist.json --dev --depth=10"
`, {
  alias: {
    dev: 'development',
    prod: 'production',
    h: 'help',    // eslint-disable-line
    v: 'version'  // eslint-disable-line
  },
  flags: {
    blacklist: {
      type: 'boolean',
      alias: 'black'
    },
    depth: {
      type: 'number'
    },
    development: {
      type: 'boolean',
      alias: 'dev'
    },
    production: {
      type: 'boolean',
      alias: 'prod'
    }
  }
});

updateNotifier({ pkg }).notify();

if (cli.input.length === 0 && cli.flags.v === true) {
  cli.showVersion();
}

if (cli.input.length === 0 && cli.flags.h === true) {
  cli.showHelp(0);
}

const pathToWhitelistFile = cli.input[0];

if (!pathToWhitelistFile) {
  console.log(chalk.red('Path to whitelist json file is required. Please check the help below:'));
  cli.showHelp();
}

const optionsForReadDeps = [];

if (cli.flags.dev) {
  optionsForReadDeps.push('dev');
}
if (cli.flags.prod) {
  optionsForReadDeps.push('prod');
}

if (cli.flags.hasOwnProperty('depth')) {
  optionsForReadDeps.push(`depth=${cli.flags.depth}`);
}

let installedPackages,
    listedPackages;

try {
  listedPackages = readWhitelistFile(pathToWhitelistFile);
} catch (error) {
  console.error(chalk.red('reading whitelist failed!', error));
  process.exit(1);
}

try {
  const dependencies = readDependencies(optionsForReadDeps);

  if (dependencies.problems) {
    console.warn(chalk.black(chalk.bgYellow(dependencies.problems)));
  }

  installedPackages = flattenDependencyTree(dependencies.tree);
} catch (error) {
  console.error(chalk.red('reading installed packages failed!', error));
  process.exit(1);
}

const whitelistCheck = pkgName => listedPackages.includes(pkgName) === false;
const blacklistCheck = pkgName => listedPackages.includes(pkgName) === true;
const unallowedPackages = Object.keys(installedPackages).filter(cli.flags.blacklist ? blacklistCheck : whitelistCheck);

if (unallowedPackages.length === 0) {
  console.log(chalk.green('Congratulations, all dependencies are allowed!'));
  process.exit(0);
}

console.log(chalk.red(`Number of unallowed dependencies: ${unallowedPackages.length}`));
process.exit(1);

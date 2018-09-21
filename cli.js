#!/usr/bin/env node
'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const chalk = require('chalk');

const readCliOptions = require('./lib/read-cli-options');
const analyzeDependencies = require('./lib/analyze-dependencies');

const cli = meow(`
  Usage
    $ check-pkg-whitelist <list.json> [options]

  Options
    --blacklist    -black  Interpret list.json content as blacklisted dependency names.
    --depth                Max depth of the dependency tree analysis.
    --development  -dev    Analyze the dependency tree for packages in devDependencies.
    --production   -prod   Analyze the dependency tree for packages in dependencies.
    --verbose              Lists dependency names that are not whitelisted.
    --version      -v      Displays the version number.
    --help         -h      Displays the help.

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
    },
    verbose: {
      type: 'boolean'
    }
  }
});

updateNotifier({ pkg }).notify();

const options = readCliOptions(cli.input, cli.flags);

if (options.valid && options.nextCliAction) {
  cli[options.nextCliAction]();
}

if (!options.valid) {
  console.log(chalk.red(`${options.error} Please check the help below:`));
  cli.showHelp();
}

const result = analyzeDependencies(options);

if (result.warning) {
  console.log(chalk.black(chalk.bgYellow(result.warning)));
}

if (result.error) {
  console.log(chalk.red(chalk.bgBlack(result.error)));
}

if (!result.error && result.unallowedPackages.length === 0) {
  console.log(chalk.green('Congratulations, all dependencies are allowed!'));
  process.exit(0);
}

if (result.unallowedPackages.length) {
  console.log(chalk.red(`Number of unallowed dependencies: ${result.unallowedPackages.length}`));

  if (options.verbose) {
    console.log(chalk.red(result.verboseOutput));
  }
}

process.exit(1);

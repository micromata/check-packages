#!/usr/bin/env node
'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const chalk = require('chalk');
const ora = require('ora');

const readCliOptions = require('./lib/read-cli-options');
const analyzeDependencies = require('./lib/analyze-dependencies');

const cli = meow(`
  Usage
    $ check-pkg-whitelist <list.json> [options]

  Options
    --topLevelOnly         Checks only direct dependencies listed in the top level package.json.
                           Is equivalent to depth=0.
                           default: false
                           Note: You cannot use "depth" together with topLevelOnly
    --depth                Max depth of the dependency tree analysis.
                           default: Infinity
                           Note: You cannot use "depth" together with topLevelOnly.
    --blacklist    -black  Interpret list.json content as blacklisted dependency names.
    --development  -dev    Analyze the dependency tree for packages in devDependencies.
    --production   -prod   Analyze the dependency tree for packages in dependencies.
    --verbose              Lists unallowed dependencies.
    --version      -v      Displays the version number.
    --help         -h      Displays the help.

  Examples
    $ package "check-pkg-whitelist whitelist.json --dev --depth=10"
    $ package "check-pkg-whitelist whitelist.json --dev --topLevelOnly --verbose"
    $ package "check-pkg-whitelist blacklist.json --prod --blacklist
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
    topLevelOnly: {
      type: 'boolean'
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

const spinner = ora('analysing dependencies...').start();
const result = analyzeDependencies(options);

if (result.error) {
  spinner.fail(`Dependency analysis error: ${result.error}`);
} else {
  spinner.succeed('Dependencies analysed');
}

if (result.warning) {
  console.log(chalk.black(chalk.bgYellow(result.warning)));
}

if (!result.error && result.unallowedPackages.length === 0) {
  spinner.succeed('Congratulations, all dependencies are allowed!');
  process.exit(0);
}

if (result.unallowedPackages.length) {
  spinner.fail(`Found ${result.unallowedPackages.length} unallowed dependencies!`);

  if (options.verbose) {
    console.log(chalk.red(result.verboseOutput));
  }
}

process.exit(1);

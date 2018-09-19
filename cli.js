#!/usr/bin/env node
'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const chalk = require('chalk');

const cli = meow(`
	Usage
	  $ check-pkg-whitelist [options]

	Options
	  --whitelist -w  path to the whitelist file which contains
	                  an array with allowed package names
	  --mode      -m  prod(uction), dev(elopment).
	                  Default: "all"
	  --version   -v  Displays the version number.
	  --help      -h  Displays the help.

	Examples
	  $ package "check-pkg-whitelist -m 'prod' whitelist.json"
`, {
  alias: {
    h: 'help',    // eslint-disable-line
    v: 'version'  // eslint-disable-line
  },
  flags: {
    mode: {
      type: 'string',
      alias: 'm'
    },
    whitelist: {
      type: 'string',
      alias: 'w'
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

if (!cli.flags.whitelist) {
  console.log(chalk.red('Option "whitelist" is required. Please check the help below:'));
  cli.showHelp();
}

if (Object.keys(cli.flags).map(key => typeof cli.flags[key]).
  some(type => type === 'boolean')) {
  console.log(chalk.red('Wrong option(s) provided. Please check the help below:'));
  cli.showHelp();
}

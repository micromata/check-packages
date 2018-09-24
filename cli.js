#!/usr/bin/env node
'use strict';

const meow = require('meow');
const run = require('./lib/run-cli');

const cli = meow(`
  Usage
    $ check-packages <list.json> [options]

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
    $ package "check-packages whitelist.json --dev --depth=10"
    $ package "check-packages whitelist.json --dev --topLevelOnly --verbose"
    $ package "check-packages blacklist.json --prod --blacklist
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

run(cli);

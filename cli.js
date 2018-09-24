#!/usr/bin/env node
'use strict';

const meow = require('meow');
const run = require('./lib/run-cli');

const cli = meow(`
  Usage
    $ check-packages <checklist.json> [options]

  Run 'check-packages' without checklist path and it will use the default
  path 'packages-whitelist.json' (or 'packages-blacklist.json' when called
  with flag --blacklist).
  The content of the checklist file must be an array of package names
  (e.g. [ 'react', 'react-dom', 'redux', 'react-redux' ]).

  Options
    --topLevelOnly         Checks only direct dependencies listed in the
                           top level package.json (equivalent to depth=0).
                           Note: You cannot use --topLevelOnly together
                           with --depth.
    --depth                Max depth of the dependency tree analysis.
                           default: Infinity
                           Note: You cannot use --depth together
                           with --topLevelOnly.
    --blacklist    -black  Interpret content of checklist as blacklist.
    --development  -dev    Analyze the dependency tree for devDependencies.
    --production   -prod   Analyze the dependency tree for dependencies.
    --verbose              Lists unallowed dependencies.
    --version      -v      Displays the version number.
    --help         -h      Displays the help.

  Examples
    $ package "check-packages"
    $ package "check-packages --blacklist"
    $ package "check-packages my-whitelist.json --dev --depth=10"
    $ package "check-packages my-whitelist.json --dev --topLevelOnly --verbose"
    $ package "check-packages my-blacklist.json --prod --blacklist
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

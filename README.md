[![npm version](https://img.shields.io/npm/v/check-packages.svg?style=flat)](https://www.npmjs.org/package/check-packages)
[![Dependency Status](https://david-dm.org/micromata/check-packages.svg)](https://david-dm.org/micromata/check-packages)
[![devDependency Status](https://david-dm.org/micromata/check-packages/dev-status.svg)](https://david-dm.org/micromata/check-packages#info=devDependencies)
[![Build Status](https://travis-ci.org/micromata/check-packages.svg?branch=master)](https://travis-ci.org/micromata/check-packages)
[![Coverage](https://coveralls.io/repos/github/micromata/check-packages/badge.svg?branch=master)](https://coveralls.io/github/micromata/check-packages?branch=master)

# check-packages
> Checks the dependencies inside package.json against a list
> of allowed/forbidden packages.

## Install

To use it in your project:
```shell
$ npm install --save-dev check-packages
```

To use it globally:
```shell
$ npm install --global check-packages
```

## General usage

```shell
$ check-packages --help

  Checks the dependencies inside package.json against a list of allowed/forbidden packages.

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
```

## License

MIT © [Christian Kühl](https://micromata.de)

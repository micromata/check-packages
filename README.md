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
    $ check-packages <list.json> [options]

  The content of the <list.json> file (or however you will name it) must be an array of package names (e.g. [ 'react', 'react-dom', 'redux', 'react-redux' ]).

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
```

## License

MIT © [Christian Kühl](https://micromata.de)

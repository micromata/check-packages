[![npm version](https://img.shields.io/npm/v/check-packages.svg?style=flat)](https://www.npmjs.org/package/check-packages)
[![Dependency Status](https://david-dm.org/micromata/check-packages.svg)](https://david-dm.org/micromata/check-packages)
[![devDependency Status](https://david-dm.org/micromata/check-packages/dev-status.svg)](https://david-dm.org/micromata/check-packages#info=devDependencies)
[![Build Status](https://travis-ci.org/micromata/check-packages.svg?branch=master)](https://travis-ci.org/micromata/check-packages)
[![Coverage](https://coveralls.io/repos/github/micromata/check-packages/badge.svg?branch=master)](https://coveralls.io/github/micromata/check-packages?branch=master)

# check-packages

> CLI tool to check your npm dependencies against a list of allowed/forbidden packages.

## Install

To use it in your project:
```shell
$ npm install --save-dev check-packages
```

To use it globally:
```shell
$ npm install --global check-packages
```

*It requires Node.js (v6 or higher).*

## Usage

```shell
$ check-packages <checklist.json> [options]
```

### Checklist JSON File

The content of the checklist file must be an array of package names, e.g.:
```json
[ "react", "react-dom", "redux", "react-redux" ]
```

By default `check-packages` uses the checklist path `packages-whitelist.json`
(respectively `packages-blacklist.json` when called with option `--blacklist`),
but you can also call `check-packages` with a different checklist path as
first argument, e.g.:
```shell
$ check-packages "./config/whitelisted-dev-dependencies.json" --dev
```

### Options

| Option         | Alias   | Description                                                                                                                                                     |
|----------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `topLevelOnly` |         | Checks only direct dependencies listed in the top level package.json (equivalent to `depth=0`).<br />Note: You cannot use `topLevelOnly` together with `depth`. |
| `depth`        |         | Max depth of the dependency tree analysis (default: inifity).<br />Note: You cannot use `depth` together with `topLevelOnly`.                                   |
| `blacklist`    | `black` | Interpret content of checklist as blacklist.                                                                                                                    |
| `development`  | `dev`   | Analyze the dependency tree for devDependencies.                                                                                                                |
| `production`   | `prod`  | Analyze the dependency tree for dependencies.                                                                                                                   |
| `verbose`      |         | Lists unallowed dependencies.                                                                                                                                   |
| `version`      | `v`     | Displays the version number.                                                                                                                                    |
| `help`         | `h`     | Displays the help.                                                                                                                                              |

### Examples

```shell
$ check-packages
$ check-packages --blacklist
$ check-packages my-whitelist.json --dev --depth=10
$ check-packages my-whitelist.json --dev --topLevelOnly --verbose
$ check-packages my-blacklist.json --prod --blacklist
```

## License

MIT © [Christian Kühl](https://micromata.de)

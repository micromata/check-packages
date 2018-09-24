# check-packages
> Checks the dependencies inside package.json against a list of allowed/forbidden packages.

## Install

To use it in your project:
```
$ npm install --save-dev check-packages
```

To use it globally:
```
$ npm install --global check-packages
```

## General usage

```
$ check-packages --help

  Checks the dependencies inside package.json against a list of allowed/forbidden packages.

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
```

## License

MIT © [Christian Kühl](https://micromata.de)

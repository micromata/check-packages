'use strict';

const readCliOptions = (input, flags) => {
  const result = {
    valid: true,
    optionsForReadDeps: [],
    blacklist: Boolean(flags && flags.blacklist),
    verbose: Boolean(flags && flags.verbose)
  };

  if (!input || !Array.isArray(input) || !flags) {
    result.valid = false;
    result.error = 'input and flags must not be null nor undefined.';

    return result;
  }

  const defaultListFile = result.blacklist ?
    'packages-blacklist.json' :
    'packages-whitelist.json';
  const pathToChecklistFile = input[0] || defaultListFile;

  if (input.length === 0 && flags.version === true) {
    result.nextCliAction = 'showVersion';

    return result;
  }

  if (input.length === 0 && flags.help === true) {
    result.nextCliAction = 'showHelp';

    return result;
  }

  if (flags.hasOwnProperty('depth') && typeof flags.depth !== 'number') {
    result.valid = false;
    result.error = 'Invalid value for option "depth".';

    return result;
  }

  if (flags.hasOwnProperty('depth') && flags.topLevelOnly) {
    result.valid = false;
    result.error = 'Options "depth" and "topLevelOnly" cannot be used together.';

    return result;
  }

  result.pathToChecklistFile = pathToChecklistFile;
  if (flags.dev && !flags.prod) {
    result.optionsForReadDeps.push('dev');
  }
  if (flags.prod && !flags.dev) {
    result.optionsForReadDeps.push('prod');
  }

  if (flags.hasOwnProperty('depth')) {
    result.optionsForReadDeps.push(`depth=${flags.depth}`);
  }

  if (flags.topLevelOnly) {
    result.optionsForReadDeps.push('depth=0');
  }

  return result;
};

module.exports = readCliOptions;

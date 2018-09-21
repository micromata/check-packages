'use strict';

const readCliOptions = (input, flags) => {
  const result = {
    valid: true,
    optionsForReadDeps: [],
    blacklist: flags.blacklist,
    verbose: flags.verbose
  };
  const pathToWhitelistFile = input[0];

  if (input.length === 0 && flags.version === true) {
    result.nextCliAction = 'showVersion';

    return result;
  }

  if (input.length === 0 && flags.help === true) {
    result.nextCliAction = 'showHelp';

    return result;
  }

  if (!pathToWhitelistFile) {
    result.valid = false;
    result.error = 'Path to whitelist json file is required.';

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

  result.pathToWhitelistFile = pathToWhitelistFile;
  if (flags.dev) {
    result.optionsForReadDeps.push('dev');
  }
  if (flags.prod) {
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

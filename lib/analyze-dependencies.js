'use strict';

const readWhitelistFile = require('./read-whitelist-file');
const readDependencies = require('./read-dependencies');
const flattenDependencyTree = require('./flatten-dependency-tree');

const analyzeDependencies = options => {
  const result = {
    unallowedPackages: [],
    warning: '',
    error: ''
  };

  if (!options) {
    result.error = 'Options must not be null or undefined.';

    return result;
  }

  let installedPackages,
      listedPackages;

  try {
    listedPackages = readWhitelistFile(options.pathToWhitelistFile);
  } catch (error) {
    result.error = `Reading whitelist failed! ${error}`;

    return result;
  }

  try {
    const dependencies = readDependencies(options.optionsForReadDeps);

    if (dependencies.problems) {
      result.warning = dependencies.problems;
    }

    installedPackages = flattenDependencyTree(dependencies.tree);
  } catch (error) {
    result.error = `Reading installed packages failed! ${error}`;

    return result;
  }

  const whitelistCheck = pkgName => listedPackages.includes(pkgName) === false;
  const blacklistCheck = pkgName => listedPackages.includes(pkgName) === true;

  result.unallowedPackages = Object.keys(installedPackages).filter(options.blacklist ? blacklistCheck : whitelistCheck);

  result.verboseOutput = result.unallowedPackages.
    sort().
    map(pkgName => `- ${pkgName} [${installedPackages[pkgName].sort().join(', ')}]`).
    join('\n');

  return result;
};

module.exports = analyzeDependencies;

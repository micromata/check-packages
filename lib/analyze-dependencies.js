'use strict';

const readChecklistFile = require('./read-checklist-file');
const readDependencies = require('./read-dependencies');
const flattenDependencyTree = require('./flatten-dependency-tree');
const semver = require('semver');

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
    listedPackages = readChecklistFile(options.pathToChecklistFile);
  } catch (error) {
    result.error = `Reading checklist failed! ${error}`;

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

  const isUnallowed = pkgName => {
    const installedVersions = installedPackages[pkgName];
    const listedPackage = listedPackages.find(item => item.packageName === pkgName);

    if (!listedPackage) {
      return false;
    }

    if (listedPackage && !listedPackage.versionRange) {
      return true;
    }

    return installedVersions.
      some(version => semver.satisfies(version, listedPackage.versionRange));
  };

  const whitelistCheck = pkgName => isUnallowed(pkgName) === false;
  const blacklistCheck = pkgName => isUnallowed(pkgName) === true;

  result.unallowedPackages = Object.keys(installedPackages).
    filter(options.blacklist ? blacklistCheck : whitelistCheck);

  result.verboseOutput = result.unallowedPackages.
    sort().
    map(pkgName => `- ${pkgName} [${installedPackages[pkgName].sort().join(', ')}]`).
    join('\n');

  return result;
};

module.exports = analyzeDependencies;

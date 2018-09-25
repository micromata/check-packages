'use strict';

const hasPgkWithVersion = (result, pkgName, version) => result[pkgName] && result[pkgName].includes(version);

const flattenDependencyTree = tree => {
  const result = {};

  if (!tree || !tree.name || !tree.version) {
    return result;
  }

  /* istanbul ignore if */
  if (hasPgkWithVersion(result, tree.name, tree.version)) {
    return result;
  }

  if (!tree.isRoot) {
    result[tree.name] = result[tree.name] || [];
    result[tree.name].push(tree.version);
  }

  if (tree.dependencies) {
    Object.keys(tree.dependencies).
      forEach(key => {
        const child = {
          name: key,
          version: tree.dependencies[key].version,
          dependencies: tree.dependencies[key].dependencies
        };

        /* istanbul ignore if */
        if (hasPgkWithVersion(result, child.name, child.version)) {
          return result;
        }

        const childResult = flattenDependencyTree(child);

        Object.keys(childResult).forEach(childKey => {
          result[childKey] = result[childKey] || childResult[childKey];

          result[childKey] = [ ...result[childKey], ...childResult[childKey] ].
            sort().
            reduce((acc, curr) => {
              if (!acc.includes(curr)) {
                acc.push(curr);
              }

              return acc;
            }, []);
        });
      });
  }

  return result;
};

module.exports = flattenDependencyTree;

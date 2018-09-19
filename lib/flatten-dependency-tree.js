'use strict';

const pkgNameAndVersionSeparator = '*~*';

const dedupe = arr => arr.
  map(item => item.split(pkgNameAndVersionSeparator)[0]).
  reduce((acc, curr) => {
    if (!acc.includes(curr)) {
      acc.push(curr);
    }

    return acc;
  }, []);

const flatten = (tree, maxDepth, depth = 0) => {
  const result = [];

  if (!tree || !tree.name || !tree.version) {
    return result;
  }
  const name = `${tree.name}${pkgNameAndVersionSeparator}${tree.version}`;

  /* istanbul ignore if */
  if (result.includes(name)) {
    return result;
  }

  result.push(name);

  if (tree.dependencies && depth < maxDepth) {
    Object.keys(tree.dependencies).
      forEach(key => {
        const child = {
          name: key,
          version: tree.dependencies[key].version,
          dependencies: tree.dependencies[key].dependencies
        };

        const childName = `${child.name}${pkgNameAndVersionSeparator}${child.version}`;

        /* istanbul ignore if */
        if (result.includes(childName)) {
          return;
        }

        flatten(child, maxDepth, depth + 1).
          forEach(item => {
            /* istanbul ignore if */
            if (result.includes(item)) {
              return;
            }
            result.push(item);
          });
      });
  }

  return result;
};

const flattenDependencyTree = (tree, maxDepth) => {
  const flattened = flatten(tree, maxDepth);
  const deduped = dedupe(flattened);

  return deduped.sort();
};

module.exports = flattenDependencyTree;

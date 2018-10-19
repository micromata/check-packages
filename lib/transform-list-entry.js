'use strict';

const sanitize = entry => ( // eslint-disable-line
  typeof entry !== 'string' ?
    '' :
    entry.trim()
);

const transformListEntry = entry => {
  const sanitizedEntry = sanitize(entry);

  if (!sanitizedEntry) {
    return null;
  }

  const parts = sanitizedEntry.split('@');

  if (sanitizedEntry.startsWith('@')) {
    const [ , second, ...rest ] = parts;

    return {
      packageName: `@${second}`,
      versionRange: rest.join('') || undefined // eslint-disable-line
    };
  }

  const [ first, ...rest ] = parts;

  return {
    packageName: first,
    versionRange: rest.join('') || undefined // eslint-disable-line
  };
};

module.exports = transformListEntry;

'use strict';

const readWhitelistFile = require('./read-whitelist-file');
const readDependencies = require('./read-dependencies');

const analyzeDependencies = require('./analyze-dependencies');

jest.mock('./read-whitelist-file', () => jest.fn());
jest.mock('./read-dependencies', () => jest.fn());

const exampleDependencyTree = {
  name: 'A',
  version: 'v1.0.0',
  dependencies: {
    AA: {
      version: 'v1.1.0',
      dependencies: {
        AAA: {
          version: 'v1.1.1',
          dependencies: {
            AB: {
              version: 'v1.1.5'
            }
          }
        }
      }
    },
    AB: {
      version: 'v1.1.1',
      dependencies: {
        AABB: {
          version: 'v1.1.3'
        }
      }
    }
  }
};

describe('analyzeDependencies', () => {
  beforeEach(() => {
    readWhitelistFile.mockReset();
    readDependencies.mockReset();
  });

  it('does not crash when options null', () => {
    const expected = { error: 'Options must not be null or undefined.', unallowedPackages: [], warning: '' };
    const actual = analyzeDependencies(null);

    expect(actual).toEqual(expected);
  });

  it('does not crash when reading of white-/blacklist file failed null', () => {
    readWhitelistFile.mockImplementation(() => {
      throw new Error('File not found!');
    });
    const options = {
      pathToWhitelistFile: './path/to/whitelist.json'
    };
    const expected = { error: 'Reading whitelist failed! Error: File not found!', unallowedPackages: [], warning: '' };
    const actual = analyzeDependencies(options);

    expect(actual).toEqual(expected);
  });

  it('does not crash when reading of installed packages failed', () => {
    readDependencies.mockImplementation(() => {
      throw new Error('Fatal npm ls error.');
    });
    const options = {
      pathToWhitelistFile: './path/to/whitelist.json'
    };
    const expected = { error: 'Reading installed packages failed! Error: Fatal npm ls error.', unallowedPackages: [], warning: '' };
    const actual = analyzeDependencies(options);

    expect(actual).toEqual(expected);
  });

  it('adopts warnings from readDependencies', () => {
    readWhitelistFile.mockImplementation(() => []);
    readDependencies.mockImplementation(() => ({
      tree: {},
      problems: 'peer dependencies missing!'
    }));

    const options = {
      pathToWhitelistFile: './path/to/whitelist.json'
    };
    const expected = {
      error: '',
      unallowedPackages: [],
      verboseOutput: '',
      warning: 'peer dependencies missing!'
    };
    const actual = analyzeDependencies(options);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when packages whitelisting analyzed successfully', () => {
    readWhitelistFile.mockImplementation(() => [ 'A', 'AA' ]);
    readDependencies.mockImplementation(() => ({
      tree: exampleDependencyTree
    }));

    const options = {
      pathToWhitelistFile: './path/to/whitelist.json'
    };
    const expected = {
      error: '',
      unallowedPackages: [ 'AAA', 'AABB', 'AB' ],
      verboseOutput: '- AAA [v1.1.1]\n- AABB [v1.1.3]\n- AB [v1.1.1, v1.1.5]',
      warning: ''
    };
    const actual = analyzeDependencies(options);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when packages blacklisting analyzed successfully', () => {
    readWhitelistFile.mockImplementation(() => [ 'AAA', 'AABB', 'AB' ]);
    readDependencies.mockImplementation(() => ({
      tree: exampleDependencyTree
    }));

    const options = {
      pathToWhitelistFile: './path/to/whitelist.json',
      blacklist: true
    };
    const expected = {
      error: '',
      unallowedPackages: [ 'AAA', 'AABB', 'AB' ],
      verboseOutput: '- AAA [v1.1.1]\n- AABB [v1.1.3]\n- AB [v1.1.1, v1.1.5]',
      warning: ''
    };
    const actual = analyzeDependencies(options);

    expect(actual).toEqual(expected);
  });
});

'use strict';

const readChecklistFile = require('./read-checklist-file');
const readDependencies = require('./read-dependencies');

const analyzeDependencies = require('./analyze-dependencies');

jest.mock('./read-checklist-file', () => jest.fn());
jest.mock('./read-dependencies', () => jest.fn());

const exampleDependencyTree = {
  name: 'A',
  version: '1.0.0',
  dependencies: {
    AA: {
      version: '1.1.0',
      dependencies: {
        AAA: {
          version: '1.1.1',
          dependencies: {
            AB: {
              version: '1.1.5'
            }
          }
        }
      }
    },
    AB: {
      version: '1.1.1',
      dependencies: {
        AABB: {
          version: '1.1.3'
        }
      }
    }
  }
};

describe('analyzeDependencies', () => {
  beforeEach(() => {
    readChecklistFile.mockReset();
    readDependencies.mockReset();
  });

  it('does not crash when options null', () => {
    const expected = { error: 'Options must not be null or undefined.', unallowedPackages: [], warning: '' };
    const actual = analyzeDependencies(null);

    expect(actual).toEqual(expected);
  });

  it('does not crash when reading of checklist file failed', () => {
    readChecklistFile.mockImplementation(() => {
      throw new Error('File not found!');
    });
    const options = {
      pathToChecklistFile: './path/to/whitelist.json'
    };
    const expected = { error: 'Reading checklist failed! Error: File not found!', unallowedPackages: [], warning: '' };
    const actual = analyzeDependencies(options);

    expect(actual).toEqual(expected);
  });

  it('does not crash when reading of installed packages failed', () => {
    readDependencies.mockImplementation(() => {
      throw new Error('Fatal npm ls error.');
    });
    const options = {
      pathToChecklistFile: './path/to/whitelist.json'
    };
    const expected = { error: 'Reading installed packages failed! Error: Fatal npm ls error.', unallowedPackages: [], warning: '' };
    const actual = analyzeDependencies(options);

    expect(actual).toEqual(expected);
  });

  it('takes warnings from readDependencies', () => {
    readChecklistFile.mockImplementation(() => []);
    readDependencies.mockImplementation(() => ({
      tree: {},
      problems: 'peer dependencies missing!'
    }));

    const options = {
      pathToChecklistFile: './path/to/whitelist.json'
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
    readChecklistFile.mockImplementation(() => [{ packageName: 'A' }, { packageName: 'AA' }]);
    readDependencies.mockImplementation(() => ({
      tree: exampleDependencyTree
    }));

    const options = {
      pathToChecklistFile: './path/to/whitelist.json'
    };
    const expected = {
      error: '',
      unallowedPackages: [ 'AAA', 'AABB', 'AB' ],
      verboseOutput: '- AAA [1.1.1]\n- AABB [1.1.3]\n- AB [1.1.1, 1.1.5]',
      warning: ''
    };
    const actual = analyzeDependencies(options);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when packages blacklisting analyzed successfully', () => {
    readChecklistFile.mockImplementation(() => [{ packageName: 'AAA' }, { packageName: 'AABB' }, { packageName: 'AB' }]);
    readDependencies.mockImplementation(() => ({
      tree: exampleDependencyTree
    }));

    const options = {
      pathToChecklistFile: './path/to/whitelist.json',
      blacklist: true
    };
    const expected = {
      error: '',
      unallowedPackages: [ 'AAA', 'AABB', 'AB' ],
      verboseOutput: '- AAA [1.1.1]\n- AABB [1.1.3]\n- AB [1.1.1, 1.1.5]',
      warning: ''
    };
    const actual = analyzeDependencies(options);

    expect(actual).toEqual(expected);
  });
});

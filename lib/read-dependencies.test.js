'use strict';

const childProcess = require('child_process');
const readDependencies = require('./read-dependencies');

jest.mock('child_process', () => ({
  spawnSync: jest.fn()
}));

const stringifiedTree = JSON.stringify({
  name: 'A',
  version: '1.0.0',
  isRoot: true,
  dependencies: {
    AA: {
      version: '1.1.0',
      dependencies: {
        AAA: { version: '1.1.1' },
        AAB: { version: '1.1.2' },
        AAC: { version: '1.1.3' }
      }
    },
    AB: {
      version: '1.2.0',
      dependencies: {
        ABA: { version: '1.2.1' },
        ABB: { version: '1.2.2' },
        ABC: { version: '1.2.3' }
      }
    }
  }
});

describe('readDependencies', () => {
  beforeEach(() => {
    childProcess.spawnSync.mockReset();
    childProcess.spawnSync.mockImplementation(() => ({ stdout: stringifiedTree }));
  });

  describe('when called with empty options', () => {
    it('calls child_process.spawnSync "npm ls --json"', () => {
      readDependencies();

      expect(childProcess.spawnSync).toHaveBeenCalledWith('npm', [ 'ls', '--json' ], { shell: true });
    });

    it('returns parsed json returned by child process', () => {
      const expected = {
        tree: JSON.parse(stringifiedTree),
        problems: ''
      };
      const actual = readDependencies();

      expect(actual).toEqual(expected);
    });
  });

  describe('when called with option=["production"]', () => {
    it('calls child_process.spawnSync "npm ls --json --production"', () => {
      readDependencies([ 'production' ]);

      expect(childProcess.spawnSync).toHaveBeenCalledWith('npm', [ 'ls', '--json', '--production' ], { shell: true });
    });

    it('returns parsed json returned by child process', () => {
      const expected = {
        tree: JSON.parse(stringifiedTree),
        problems: ''
      };
      const actual = readDependencies([ 'production' ]);

      expect(actual).toEqual(expected);
    });
  });

  describe('when called with options=["development"]', () => {
    it('calls child_process.spawnSync "npm ls --json --development"', () => {
      readDependencies([ 'development' ]);

      expect(childProcess.spawnSync).toHaveBeenCalledWith('npm', [ 'ls', '--json', '--development' ], { shell: true });
    });

    it('returns parsed json returned by child process', () => {
      const expected = {
        tree: JSON.parse(stringifiedTree),
        problems: ''
      };
      const actual = readDependencies([ 'development' ]);

      expect(actual).toEqual(expected);
    });
  });

  it('throws when parsed tree is null', () => {
    childProcess.spawnSync.mockImplementation(() => ({ stdout: null }));

    expect(readDependencies).toThrow('Failed to read dependencies');
  });

  it('returns problems found by npm ls', () => {
    childProcess.spawnSync.mockImplementation(() => ({ stdout: stringifiedTree, stderr: 'missing peer dependencies' }));

    const expected = {
      tree: JSON.parse(stringifiedTree),
      problems: 'missing peer dependencies'
    };
    const actual = readDependencies([ 'development' ]);

    expect(actual).toEqual(expected);
  });
});

'use strict';

const childProcess = require('child_process');
const readDependencyTree = require('./read-dependency-tree');

jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

const stringifiedTree = JSON.stringify({
  name: 'A',
  version: '1.0.0',
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

describe('readDependencyTree', () => {
  beforeEach(() => {
    childProcess.execSync.mockReset();
    childProcess.execSync.mockImplementation(() => stringifiedTree);
  });

  describe('when called with falsy mode', () => {
    it('calls child_process.execSync "npm ls --json"', () => {
      readDependencyTree();

      expect(childProcess.execSync).toHaveBeenCalledWith('npm ls --json');
    });

    it('returns parsed json returned by child process', () => {
      const expected = JSON.parse(stringifiedTree);
      const actual = readDependencyTree();

      expect(actual).toEqual(expected);
    });
  });

  describe('when called with mode="production"', () => {
    it('calls child_process.execSync "npm ls --json --production"', () => {
      readDependencyTree('production');

      expect(childProcess.execSync).toHaveBeenCalledWith('npm ls --json --production');
    });

    it('returns parsed json returned by child process', () => {
      const expected = JSON.parse(stringifiedTree);
      const actual = readDependencyTree('production');

      expect(actual).toEqual(expected);
    });
  });

  describe('when called with mode="development"', () => {
    it('calls child_process.execSync "npm ls --json --development"', () => {
      readDependencyTree('development');

      expect(childProcess.execSync).toHaveBeenCalledWith('npm ls --json --development');
    });

    it('returns parsed json returned by child process', () => {
      const expected = JSON.parse(stringifiedTree);
      const actual = readDependencyTree('development');

      expect(actual).toEqual(expected);
    });
  });
});

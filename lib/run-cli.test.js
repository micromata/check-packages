'use strict';

const ora = require('ora');
const updateNotifier = require('update-notifier');
const run = require('./run-cli');
const readChecklistFile = require('./read-checklist-file');
const readDependencies = require('./read-dependencies');

jest.mock('update-notifier', () => jest.fn());
jest.mock('ora', () => jest.fn());
jest.mock('./read-checklist-file', () => jest.fn());
jest.mock('./read-dependencies', () => jest.fn());

const updateNotifierNotify = jest.fn();
const cliShowHelp = jest.fn();
const cliShowVersion = jest.fn();
const processExit = jest.spyOn(process, 'exit').mockImplementation(number => number);
const spinnerSucceed = jest.fn();
const spinnerFail = jest.fn();

describe('run(cli)', () => {
  beforeEach(() => {
    processExit.mockReset();
    cliShowHelp.mockReset();
    cliShowVersion.mockReset();

    updateNotifierNotify.mockReset();
    updateNotifier.mockReturnValue({
      notify: updateNotifierNotify
    });

    spinnerSucceed.mockReset();
    spinnerFail.mockReset();
    ora.mockReturnValue({
      start: () => ({
        succeed: spinnerSucceed,
        fail: spinnerFail
      })
    });

    readChecklistFile.mockReturnValue([]);
    readDependencies.mockReturnValue([]);
  });

  it('calls updateNotifier.notify', () => {
    const cli = {
      input: [],
      flags: {},
      showHelp: cliShowHelp,
      showVersion: cliShowVersion
    };

    run(cli);

    expect(updateNotifierNotify).toHaveBeenCalled();
  });

  it('shows help when called with flag "help"', () => {
    const cli = {
      input: [ ],
      flags: { help: true },
      showHelp: cliShowHelp
    };

    run(cli);

    expect(cliShowHelp).toHaveBeenCalled();
  });

  it('shows help when options/flags invalid', () => {
    const cli = {
      input: [ ],
      flags: { depth: 'aaa' },
      showHelp: cliShowHelp
    };

    run(cli);

    expect(cliShowHelp).toHaveBeenCalled();
  });

  it('shows version when called with flag "version"', () => {
    const cli = {
      input: [ ],
      flags: { version: true },
      showVersion: cliShowVersion
    };

    run(cli);

    expect(cliShowVersion).toHaveBeenCalled();
  });

  describe('when analysis crashed', () => {
    beforeEach(() => {
      readChecklistFile.mockImplementation(() => {
        throw new Error('file not found');
      });
    });

    it('calls spinner.fail', () => {
      const cli = {
        input: [ ],
        flags: { version: true },
        showVersion: cliShowVersion
      };

      run(cli);

      expect(spinnerFail).toHaveBeenCalledWith('Dependency analysis error: Reading checklist failed! Error: file not found');
    });

    it('calls process.exit(1)', () => {
      const cli = {
        input: [ ],
        flags: { version: true },
        showVersion: cliShowVersion
      };

      run(cli);

      expect(processExit).toHaveBeenCalledWith(1);
    });
  });

  describe('when analysis failed', () => {
    beforeEach(() => {
      readChecklistFile.mockReturnValue([{ packageName: 'react', versionRange: '>=15.0.0 < 16.4.0' }]);
      readDependencies.mockReturnValue({
        tree: {
          name: 'react',
          version: '16.4.1'
        },
        problems: 'missing peer dependency foobar'
      });
    });

    it('calls spinner.fail', () => {
      const cli = {
        input: [ './path/to/checklist.json' ],
        flags: { verbose: true }
      };

      run(cli);

      expect(spinnerFail).toHaveBeenCalledWith('Found 1 unallowed dependencies!');
    });

    it('calls process.exit(1)', () => {
      const cli = {
        input: [ './path/to/checklist.json' ],
        flags: { }
      };

      run(cli);

      expect(processExit).toHaveBeenCalledWith(1);
    });
  });

  describe('when analysis succeeded', () => {
    beforeEach(() => {
      readChecklistFile.mockReturnValue([{ packageName: 'react', versionRange: '^16.0.0' }]);
      readDependencies.mockReturnValue({
        tree: {
          name: 'react',
          version: '16.4.0'
        },
        problems: ''
      });
    });

    it('calls spinner.succeed', () => {
      const cli = {
        input: [ './path/to/checklist.json' ],
        flags: { verbose: true }
      };

      run(cli);

      expect(spinnerSucceed).toHaveBeenCalledWith('Dependencies analysed');
      expect(spinnerSucceed).toHaveBeenCalledWith('Congratulations, all dependencies are allowed!');
    });

    it('calls process.exit(0)', () => {
      const cli = {
        input: [ './path/to/checklist.json' ],
        flags: { }
      };

      run(cli);

      expect(processExit).toHaveBeenCalledWith(0);
    });
  });
});

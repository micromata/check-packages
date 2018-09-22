'use strict';

const readCliOptions = require('./read-cli-options');

describe('readCliOptions', () => {
  it('does not crash when input and flags undefined', () => {
    const expected = {
      blacklist: false,
      error: 'input and flags must not be null nor undefined.',
      optionsForReadDeps: [],
      valid: false,
      verbose: false
    };
    const actual = readCliOptions();

    expect(actual).toEqual(expected);
  });

  it('returns expected object when flags.version=true', () => {
    const expected = {
      blacklist: false,
      nextCliAction: 'showVersion',
      optionsForReadDeps: [],
      valid: true,
      verbose: false
    };

    const flags = { version: true };
    const actual = readCliOptions([], flags);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when flags.help=true', () => {
    const expected = {
      blacklist: false,
      nextCliAction: 'showHelp',
      optionsForReadDeps: [],
      valid: true,
      verbose: false
    };

    const flags = { help: true };
    const actual = readCliOptions([], flags);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when input[0] not a string', () => {
    const expected = {
      blacklist: false,
      error: 'Path to whitelist json file is required.',
      optionsForReadDeps: [],
      valid: false,
      verbose: false
    };

    const input = [ ];
    const flags = { };
    const actual = readCliOptions(input, flags);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when flags.depth available but not a number', () => {
    const expected = {
      blacklist: false,
      error: 'Invalid value for option "depth".',
      optionsForReadDeps: [],
      valid: false,
      verbose: false
    };

    const input = [ './path/to/list.json' ];
    const flags = { depth: 'not a number' };
    const actual = readCliOptions(input, flags);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when flags.depth valid and flags.topLevelOnly=true available', () => {
    const expected = {
      blacklist: false,
      error: 'Options "depth" and "topLevelOnly" cannot be used together.',
      optionsForReadDeps: [],
      valid: false,
      verbose: false
    };

    const input = [ './path/to/list.json' ];
    const flags = { depth: 10, topLevelOnly: true };
    const actual = readCliOptions(input, flags);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when flags.dev=true', () => {
    const expected = {
      blacklist: true,
      optionsForReadDeps: [ 'dev', 'depth=42' ],
      pathToWhitelistFile: './path/to/list.json',
      valid: true,
      verbose: false
    };

    const input = [ './path/to/list.json' ];
    const flags = { dev: true, blacklist: true, depth: 42 };
    const actual = readCliOptions(input, flags);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when flags.prod=true', () => {
    const expected = {
      blacklist: true,
      optionsForReadDeps: [ 'prod', 'depth=42' ],
      pathToWhitelistFile: './path/to/list.json',
      valid: true,
      verbose: false
    };

    const input = [ './path/to/list.json' ];
    const flags = { prod: true, blacklist: true, depth: 42 };
    const actual = readCliOptions(input, flags);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when flags.prod=true and flags.dev=true', () => {
    const expected = {
      blacklist: true,
      optionsForReadDeps: [ 'depth=42' ],
      pathToWhitelistFile: './path/to/list.json',
      valid: true,
      verbose: false
    };

    const input = [ './path/to/list.json' ];
    const flags = { prod: true, dev: true, blacklist: true, depth: 42 };
    const actual = readCliOptions(input, flags);

    expect(actual).toEqual(expected);
  });

  it('returns expected object when flags.topLevel=true', () => {
    const expected = {
      blacklist: false,
      optionsForReadDeps: [ 'depth=0' ],
      pathToWhitelistFile: './path/to/list.json',
      valid: true,
      verbose: false
    };

    const input = [ './path/to/list.json' ];
    const flags = { topLevelOnly: true };
    const actual = readCliOptions(input, flags);

    expect(actual).toEqual(expected);
  });
});

'use strict';

const loadJsonFile = require('load-json-file');
const readWhitelistFile = require('./read-whitelist-file');

jest.mock('load-json-file', () => ({
  sync: jest.fn()
}));

describe('readWhitelistFile', () => {
  beforeEach(() => {
    loadJsonFile.sync.mockReset();
  });

  it('throws when load-json-file.sync() throws', () => {
    loadJsonFile.sync.mockImplementation(() => {
      throw new Error('file not found');
    });

    expect(readWhitelistFile).toThrow(new Error('file not found'));
  });

  it('throws when whitelist content is not an array', () => {
    const whitelistContent = { id: '4177', description: 'not an array' };

    loadJsonFile.sync.mockImplementation(() => whitelistContent);

    expect(readWhitelistFile).toThrow(new Error('Invalid content of whitelist JSON file.'));
  });

  it('throws when whitelist content is not an array of strings', () => {
    const whitelistContent = [ 'react', 'other-string', 666, 'foobar' ];

    loadJsonFile.sync.mockImplementation(() => whitelistContent);

    expect(readWhitelistFile).toThrow(new Error('Invalid content of whitelist JSON file.'));
  });

  it('returns whitelist content when it is an array of strings', () => {
    const whitelistContent = [ 'react', 'other-string', 'foobar' ];

    loadJsonFile.sync.mockImplementation(() => whitelistContent);

    const actual = readWhitelistFile();

    expect(actual).toEqual(whitelistContent);
  });
});

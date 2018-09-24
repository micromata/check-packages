'use strict';

const loadJsonFile = require('load-json-file');
const readChecklistFile = require('./read-checklist-file');

jest.mock('load-json-file', () => ({
  sync: jest.fn()
}));

describe('readChecklistFile', () => {
  beforeEach(() => {
    loadJsonFile.sync.mockReset();
  });

  it('throws when load-json-file.sync() throws', () => {
    loadJsonFile.sync.mockImplementation(() => {
      throw new Error('file not found');
    });

    expect(readChecklistFile).toThrow(new Error('file not found'));
  });

  it('throws when checklist content is not an array', () => {
    const checklistContent = { id: '4177', description: 'not an array' };

    loadJsonFile.sync.mockImplementation(() => checklistContent);

    expect(readChecklistFile).toThrow(new Error('Invalid content of checklist JSON file.'));
  });

  it('throws when checklist content is not an array of strings', () => {
    const checklistContent = [ 'react', 'other-string', 666, 'foobar' ];

    loadJsonFile.sync.mockImplementation(() => checklistContent);

    expect(readChecklistFile).toThrow(new Error('Invalid content of checklist JSON file.'));
  });

  it('returns checklist content when it is an array of strings', () => {
    const checklistContent = [ 'react', 'other-string', 'foobar' ];

    loadJsonFile.sync.mockImplementation(() => checklistContent);

    const actual = readChecklistFile();

    expect(actual).toEqual(checklistContent);
  });
});

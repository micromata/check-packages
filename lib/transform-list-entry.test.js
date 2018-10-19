'use strict';

const transformListEntry = require('./transform-list-entry');

describe('transformListEntry', () => {
  it('transforms null', () => {
    const entry = null;
    const expected = null;
    const actual = transformListEntry(entry);

    expect(actual).toEqual(expected);
  });

  it('transforms empty string', () => {
    const entry = '';
    const expected = null;
    const actual = transformListEntry(entry);

    expect(actual).toEqual(expected);
  });

  it('transforms non string arg', () => {
    const entry = 42;
    const expected = null;
    const actual = transformListEntry(entry);

    expect(actual).toEqual(expected);
  });

  it('transforms string "react"', () => {
    const entry = 'react';
    const expected = { packageName: 'react', versionRange: undefined };
    const actual = transformListEntry(entry);

    expect(actual).toEqual(expected);
  });

  it('transforms string "react@2.1"', () => {
    const entry = 'react@2.1';
    const expected = { packageName: 'react', versionRange: '2.1' };
    const actual = transformListEntry(entry);

    expect(actual).toEqual(expected);
  });

  it('transforms string "@babel/core@7.0.0"', () => {
    const entry = '@babel/core@7.0.0';
    const expected = { packageName: '@babel/core', versionRange: '7.0.0' };
    const actual = transformListEntry(entry);

    expect(actual).toEqual(expected);
  });

  it('transforms string "@babel/core"', () => {
    const entry = '@babel/core';
    const expected = { packageName: '@babel/core', versionRange: undefined };
    const actual = transformListEntry(entry);

    expect(actual).toEqual(expected);
  });
});

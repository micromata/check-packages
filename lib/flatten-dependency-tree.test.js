'use strict';

const flattenDependencyTree = require('./flatten-dependency-tree');

const tree = {
  name: 'A',
  version: 'v1.0.0',
  dependencies: {
    AA: {
      version: 'v1.1.0',
      dependencies: {
        AAA: {
          version: 'v1.1.1',
          dependencies: {
            AAAA: {
              version: 'v1.1.2'
            },
            AB: {
              version: 'v1.1.5'
            }
          }
        },
        AAB: {
          version: 'v1.1.1',
          dependencies: {
            AAAA: {
              version: 'v1.1.1'
            },
            AABA: {
              version: 'v1.1.2'
            },
            AABB: {
              version: 'v1.1.3'
            }
          }
        },
        AAC: {
          version: 'v1.1.1',
          dependencies: {
            AACA: {
              version: 'v1.9.2'
            },
            AACB: {
              version: 'v1.0.3'
            },
            AABA: {
              version: 'v1.5.2'
            }
          }
        }
      }
    },
    AB: {
      version: 'v2.0.1'
    }
  }
};

describe('flattenDependencyTree', () => {
  it('returns empty object for null tree', () => {
    expect(flattenDependencyTree(null)).toEqual({});
  });

  it('returns empty object for empty tree', () => {
    expect(flattenDependencyTree({})).toEqual({});
  });

  it('returns expected result for given tree', () => {
    const expected = {
      A: [ 'v1.0.0' ], // eslint-disable-line
      AA: [ 'v1.1.0' ],
      AAA: [ 'v1.1.1' ],
      AAAA: [ 'v1.1.1', 'v1.1.2' ],
      AAB: [ 'v1.1.1' ],
      AABA: [ 'v1.1.2', 'v1.5.2' ],
      AABB: [ 'v1.1.3' ],
      AAC: [ 'v1.1.1' ],
      AACA: [ 'v1.9.2' ],
      AACB: [ 'v1.0.3' ],
      AB: [ 'v1.1.5', 'v2.0.1' ]
    };

    expect(flattenDependencyTree(tree)).toEqual(expected);
  });
});

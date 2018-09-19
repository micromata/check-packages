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
            AAAB: {
              version: 'v1.1.3',
              dependencies: {
                AAB: {
                  version: 'v1.1.1',
                  dependencies: {
                    AAA: {
                      version: 'v1.1.1'
                    },
                    AABA: {
                      version: 'v1.1.2'
                    },
                    AABB: {
                      version: 'v1.1.3'
                    }
                  }
                }
              }
            }
          },
          AB: {
            version: 'v1.1.0'
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
              version: 'v1.1.2'
            },
            AACB: {
              version: 'v1.1.3'
            },
            AABA: {
              version: 'v1.1.2'
            }
          }
        }
      }
    },
    AB: {
      version: 'v1.1.0',
      dependencies: {
        ABA: {
          version: 'v1.1.1',
          dependencies: {
            ABAA: {
              version: 'v1.1.2'
            },
            ABAB: {
              version: 'v1.1.3'
            },
            AA: {
              version: 'v1.1.0'
            }
          }
        },
        ABB: {
          version: 'v1.1.1',
          dependencies: {
            ABBA: {
              version: 'v1.1.2'
            },
            ABBB: {
              version: 'v1.1.3'
            }
          }
        },
        ABC: {
          version: 'v1.1.1',
          dependencies: {
            AAAA: {
              version: 'v1.1.3'
            },
            ABCA: {
              version: 'v1.1.2'
            },
            ABCB: {
              version: 'v1.1.3'
            }
          }
        }
      }
    }
  }
};

describe('flattenDependencyTree', () => {
  it('returns empty array for null tree', () => {
    expect(flattenDependencyTree(null)).toEqual([]);
  });

  it('returns empty array for empty tree', () => {
    expect(flattenDependencyTree({})).toEqual([]);
  });

  it('returns expected result for given tree and undefined maxDepth', () => {
    const expected = [ 'A' ];

    expect(flattenDependencyTree(tree)).toEqual(expected);
  });

  it('returns expected result for given tree and maxDepth=1', () => {
    const expected = [ 'A', 'AA', 'AB' ];

    expect(flattenDependencyTree(tree, 1)).toEqual(expected);
  });

  it('returns expected result for given tree and maxDepth=2', () => {
    const expected = [ 'A', 'AA', 'AAA', 'AAB', 'AAC', 'AB', 'ABA', 'ABB', 'ABC' ];

    expect(flattenDependencyTree(tree, 2)).toEqual(expected);
  });
});

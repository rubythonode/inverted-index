/**
 * Check Point 1.
 *
 * Tests for BookIndexer.
 */

// Detect whether we are running on NodeJS and require relevant module.
var RUNNING_ON_NODE = (
  typeof module !== 'undefined' && typeof module.exports !== 'undefined');

if (RUNNING_ON_NODE) {
  var BookIndexer = require('../src/inverted-index');
}

describe('BookIndexer tests', function() {

  var indexer = new BookIndexer();

  beforeEach(function(done) {
    /**
     * Re-read the books data before every spec.
     * When we are not running on node, wait for the `fetch` Promise to
     * resolve before running tests.
     */
    if (RUNNING_ON_NODE) {
      indexer.createIndex('books.json');
      done();
    } else {
      indexer.createIndex('books.json').then(done);
    }
  });

  describe('Read books data', function() {
    it('"books.json" should not be empty', function() {
      expect(Array.isArray(indexer.rawData)).toBe(true);
      expect(indexer.rawData.length).toBeTruthy();
    });
  });

  describe('Populate Index', function() {

    it('should create an index after reading the data', function() {
      expect(indexer.index).toBeDefined();
      expect(Object.keys(indexer.index).length).toBeTruthy();
    });
  });
});

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

    it('should map the string keys to the correct objects in the JSON array.', function() {
      expect(indexer.index.alice).toEqual([0]);
      expect(indexer.index.dwarf).toEqual([1]);
    });

  });

  describe('Search Index', function() {

    it('should return the correct index for searched items', function() {
      expect(indexer.searchIndex('alice').alice).toEqual([0]);
      expect(indexer.searchIndex('ring').ring).toEqual([1]);
    });

    it('should be able to handle a string of arguments', function() {
      var searchString = 'James and Alice are in love';
      var keyWords = ['james', 'alice', 'love'];
      var searchResult = indexer.searchIndex(searchString);

      expect(Object.keys(searchResult).sort()).toEqual(keyWords.sort());
    });

    it('should be able to handle an array of search terms', function() {
      var searchTerms = ['james', 'alice', 'dwarf', 'ring', 'king'];
      var result = indexer.searchIndex(searchTerms);

      expect(Object.keys(result).sort()).toEqual(searchTerms.sort());
    });

    it('should be able to take a varied number of search terms', function() {
      var result = indexer.searchIndex('alice', 'dwarf', 'wonderland', ['king', 'land']);

      expect(Object.keys(result).sort())
        .toEqual(['alice', 'dwarf', 'king', 'land', 'wonderland']);

      // Ensure that
      expect(result.dwarf).toEqual([1]);
      expect(result.king).toEqual('Not found');
    });

    it('should return correct search results for varied search terms', function() {
      var result = indexer.searchIndex('alice', 'dwarf', 'wonderland', ['king', 'land']);

      expect(result.dwarf).toEqual([1]);
      expect(result.king).toEqual('Not found');
    });

  });

  describe('Get Index', function() {

    it('should return an accurate index of the contents of the JSON file', function() {
      expect(indexer.getIndex()).toEqual(indexer.index);
    });

    it(
      'should return an index of a particular book when given that book\'s index as a parameter',
      function() {
        var index = indexer.getIndex('1');

        for (var prop in index) {
          if (index.hasOwnProperty(prop)) {
            expect(index[prop]).toEqual([1]);
          }
        }
      });
  });
});

/**
 * An Books Inverted Index.
 *
 * Contains an index of books data read from a file.
 */

(function() {
  'use strict';

  var RUNNING_ON_NODE = (
    typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  function Indexer() {

    // alias `this` to _this.
    var _this = this;

    // Define the variables this indexer will need.
    _this.rawData = [];
    _this.index = {};

    // A list of words that have no impact on general meaning of the sentence.
    // http://www.ranks.nl/stopwords
    var stopWords = ['a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an',
      'and', 'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before',
      'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could',
      'couldn\'t',
      'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
      'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t',
      'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself',
      'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
      'in',
      'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most',
      'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
      'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
      'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some',
      'such',
      'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
      'there',
      'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this',
      'those',
      'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d',
      'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
      'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with',
      'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your',
      'yours', 'yourself', 'yourselves'
    ];

    _this.createIndex = function(file) {
      // Read a data file and create an index from it.
      //
      // TODO: Make this function return a Promise to attain a uniform API.
      return readData(file);
    };

    _this.getIndex = function(docIndex) {
      docIndex = docIndex || null;
      docIndex = docIndex ? Number(docIndex) : null;

      // If no doc was given, return the whole index.
      if (docIndex === null) {
        return _this.index;
      } else {
        // If a particular doc's index was given, create a subIndex with the words that appear in
        // the specified doc and return that.
        var keys = Object.keys(_this.index);
        var subIndex = {};
        var itemLocations;

        keys.forEach(function(key) {
          itemLocations = _this.index[key];
          if (itemLocations.indexOf(docIndex) !== -1) {
            subIndex[key] = itemLocations;
          }
        });

        return subIndex;
      }
    };

    _this.searchIndex = function( /* arguments */ ) {

      // Create an `Array` query from the arguments.
      var query = processSearchTerms(arguments);
      if (!query.length) {
        return {};
      }

      // Process the query the same way raw data is processed,
      // then search for the clean query in  the index.

      var foundItems = {};
      var itemLocations;

      processData(query)
        .filter(function(item) {
          // Filter out any empty strings.
          return !!item;
        })
        .forEach(function(item) {
          itemLocations = _this.index[item] || false;

          if (itemLocations) {
            if (!foundItems.hasOwnProperty(item)) {

              // Only add an item if you didn't already add it.
              foundItems[item] = itemLocations;
            }
          } else {
            foundItems[item] = 'Not found';
          }
        });

      return foundItems;
    };

    function readData(file) {
      /**
       * Read a JSON file and store it's contents.
       * If we are running on NodeJS, read the file synchronously.
       * If not, we must be running on the browser.
       * Utilise the relatively new `fetch` API to fetch and parse the JSON file.
       * Call `makeIndex` after a successful read.
       *
       * @param  {String} file path to file that's to be read.
       */

      if (RUNNING_ON_NODE) {
        var fs = require('fs');
        _this.rawData = JSON.parse(fs.readFileSync(file).toString());
        makeIndex();
      } else {
        return fetch(file)
          .then(function(response) {

            // Convert the response to a JSON object.
            return response.json();
          })
          .then(function(data) {
            _this.rawData = data;
            makeIndex();
          })
          .catch(function(err) {
            throw err;
          });
      }
    }

    function makeIndex() {
      /**
       * Create an index of the data read.
       *
       * TODO: Make this function return Promise objects.
       */

      // Create the index.
      _this.rawData.forEach(function(doc, docIndex) {

        // Hold all elements of this doc in an array and index them all at once.
        var completeData = [];
        for (var element in doc) {
          if (doc.hasOwnProperty(element)) {
            completeData.push(doc[element]);
          }
        }

        processData(completeData)
          .forEach(function(item) {
            if (!_this.index.hasOwnProperty(item)) {

              // If this word is not already in the index, add it.
              _this.index[item] = [docIndex];
            } else {

              // Add the word's location to the index if the location is not already
              // associated with this word. Otherwise ignore it.
              if (_this.index[item].indexOf(docIndex) === -1) {
                _this.index[item].push(docIndex);
              }
            }
          });
      });
    }

    function processData(data) {
      /**
       * Process data.
       *
       * If data is a `String`:
       *     - Lowercase the string
       *     - Remove punctuations.
       *     - Convert it into an array.
       *     - Remove stop words from that array.
       *     - Return an Array of strings.
       *
       * If data is an `Array` or is Array-like:
       * 		- Join up it's elements and proceed to Case String.
       */

      if (Array.isArray(data)) {
        // If this data in an array, join it up to a long string and process that.
        data = data.join(' ');
      }

      return data
        .toLowerCase()
        .replace(/[,.;:!@#$%^&*()]/g, '')
        .split(' ')
        .filter(function(item) {
          return stopWords.indexOf(item) === -1;
        });
    }

    function processSearchTerms(args) {
      /**
       * Process the `arguments` array-like object.
       * This may contain a mixture of `String`s and `Array`s.
       * Start by converting `arguments` into a real JS `Array`.
       *
       * Quick, dirty way of flattening a nested array:
       * 		- turn it into a string.
       * 		- split using a comma as the delimiter
       * 		- Smile :)
       */

      return Array.prototype
        .slice.call(args) // Transform into a real JS array.
        .toString()
        .split(',');
    }
  }

  // If on Node, export the module.
  if (RUNNING_ON_NODE) {
    module.exports = Indexer;
  } else {
    // Else, attach it to the window namespace.
    window.Indexer = Indexer;
  }
})();

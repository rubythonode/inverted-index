/**
 * An Books Inverted Index.
 *
 * Contains an index of books data read from a file.
 */

(function() {
  'use strict';

  var RUNNING_ON_NODE = (
    typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  function BookIndexer() {

    // alias `this` to self.
    var self = this;

    self.rawData = [];
    self.index = {};

    this.readData = function(file) {
      /**
       * Read a JSON file and store it's contents.
       * If we are running on NodeJS, read the file synchronously.
       * If not, we must be running on the browser.
       * Utilise the relatively new `fetch` API to fetch and parse the JSON file.
       *
       * @param  {String} file path to file that's to be read.
       */

      if (RUNNING_ON_NODE) {
        var fs = require('fs');
        self.rawData = JSON.parse(fs.readFileSync(file).toString());
      } else {
        return fetch(file)
          .then(function(response) {

            // Convert the response to a JSON object.
            return response.json();
          })
          .then(function(data) {
            self.rawData = data;
          })
          .catch(function(err) {
            throw err;
          });
      }
    };
  }

  // If on Node, export the module.
  console.log(RUNNING_ON_NODE);
  if (RUNNING_ON_NODE) {
    module.exports = BookIndexer;
  } else {
    // Else, attach it to the window namespace.
    window.BookIndexer = BookIndexer;
  }
})();

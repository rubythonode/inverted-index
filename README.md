# inverted-index
This `Indexer` module reads a JSON file and creates an index of it's contents.
The created index contains all important words in the JSON document with each word being associated with a list of indices of the documents where it appears.
`Stop words`, such as conjunctions, prepositions and words with little or no impact to the general meaning of the sentence are not indexed.

## Getting Started
To use the `Indexer` module in your JavaScript programs in the browser, you need to include `inverted-index.js` into your HTML file. You can then create an `Indexer` instance by using:

```javascript
var indexer = new Indexer();
```

To use this module on the NodeJS console,

1. Clone this repository.

2. Change your working directory into `inverted-index/jasmine`

    ```
    $ cd inverted-index/jasmine
    ```

3. Open up a NodeJS console and require this module.

   ```
   $ node
   > var Indexer = require('./src/inverted-index')
   > var indexer = new Indexer()
   > ...
   ```

You can then follow along with the usage examples.


## Usage
The `Indexer` module enables you to **create**, **search** and **get** a document's index.

### Creating an index
To create a document's index, call the `createIndex` method of the `Indexer` module instance
with a string parameter that is the document to be indexed.


For instance, assuming that the document that needs indexing is `books.json` with the
following structure:
```javascript
[
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
]
```
Doing

```javascript
indexer.createIndex('books.json');
```

will read the document and index it.

### Getting the index
To retrieve the full document's index, use:
```javascript
var index = indexer.getIndex();
console.log(index);
// logs:
// {
//   alice: [ 0 ],
//   wonderland: [ 0 ],
//   ...(snipped),
//   lord: [ 1 ],
//   rings: [ 1 ],
//   fellowship: [ 1 ],
//   ...(snipped),
// }
```

If you know the location (in the array) of the document whose Index you need, passing that location as a `String` to `getIndex` will return an index of the words contained only in that specific document.
This index will however, also indicate other locations of that same word in the general index.

```javascript
var index = indexer.getIndex('0');
console.log(index);
// logs:
// { alice: [ 0 ],
//   wonderland: [ 0 ],
//   falls: [ 0 ],
//   ..., (snipped)
// }
```

### Searching the Index.
The `Indexer` module exposes a `searchIndex` method that can be used to search the index.

The `searchIndex` method can take in a varied number of string search terms or an array, or a mixture of both.

Consider the following use case:
```javascript
// Searching a single term
indexer.searchIndex('alice');
// => { alice: [ 0 ] }

// Searching for two terms that are basically similar.
indexer.searchIndex('alice', 'Alice');  // But don't do this.
// => { alice: [ 0 ] }

// Searching with an array of search strings.
indexer.searchIndex(['alice', 'ring', 'hobbit', 'land']);
//=> { alice: [ 0 ], ring: [ 1 ], hobbit: [ 1 ], land: 'Not found' }

// Searching with mixture of strings and arrays.
indexer.searchIndex('alice', 'wonderland', ['hobbit', 'elf', 'dwarf'], 'lord');
// => { alice: [ 0 ], wonderland: [ 0 ], hobbit: [ 1 ], elf: [ 1 ], dwarf: [ 1 ], lord: [ 1 ] }

// Searching with a mixture of nested arrays and strings.
indexer.searchIndex(
    ['rings', ['fellowship', ['evil', 'people', ['are', 'bad']]], 'some', 'James, alice and joan'])
// => {
//      rings: [ 1 ], fellowship: [ 1 ], evil: 'Not found',
//      people: 'Not found', bad: 'Not found', james: 'Not found',
//      alice: [ 0 ], joan: 'Not found'
//    }
```


## Testing
To run the test suite that comes bundled with this module, you will need to follow the following
steps:

1. Clone this repository

2. Change the working directory into `jasmine`.
  ```
    $ cd inverted-index/jasmine
  ```
3. To run these tests on the browser:
    * Start a http server in this directory.
        - If you have the `http-server` npm module installed, you can simply do:
        (_needs nodejs and npm to be installed_)

        ```
            $ http-server
        ```
        - If you do not have the module, you can easily install it.

        ```
            $ npm install -g http-server
        ```
        - Alternatively, you can start a Python server inside this working directory:
          (_requires an active Python3 interpreter to be installed in the system_)

        ```
            $ python3 -m http.server --bind 127.0.0.1 8080
        ```
    Visit http://127.0.0.1:8080/ Then open `SpecRunner.html`.

    Running this server is essential - the data file will be fetched asynchronously.

4. If you prefer running the tests on your terminal,
    * Install gulp and gulp-jasmine (_requires globally installed gulp and jasmine_)
    ```
        $ npm install gulp gulp-jasmine
    ```
    * Run the tests.
    ```
        $ gulp
    ```
   Hit `Ctrl-C` to quit.

## Caveats
The `Indexer` module only does simple indexing. It does not handle decomposition of words into their
root words (_searching for `land` yields `Not found` yet there's `land` in `wonderland`_).


The `getIndex` method parameter has to be a string. Otherwise, you will not be able to obtain
and index of the document at index 0.

```javascript
indexer.getIndex(0)
// Returns the full index

indexer.getIndex('0')
// Returns the index of the document at index 0.
```


##### Have Fun.

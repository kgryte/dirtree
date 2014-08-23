DirTree
====
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Translate a directory structure into a tree object.

This module translates a directory structure into a tree object and provides an interface to search and load leaves (files) within that tree.


## Installation

``` bash
$ npm install dirtree
```

## Usage

To create a new tree generator,

``` javascript
var createTree = require( 'dirtree' );

var tree = createTree();
```

A `tree` is configurable and has the following methods...

#### tree.root( [root] )

This method is a setter/getter.


## Examples 

``` javascript
var createTree = require( 'dirtree' );

// Create a new tree generator:
var tree = createTree();

// Configure and create a tree:
tree
	.root( __dirname )
	.exclude( 'dirs', /^\./ )
	.exclude( 'files', /^\./ )
	.create();

// Serialize the tree:
console.log( tree.toJSON() );

// List the leaves:
console.log( tree.leaves() );

// Search the leaves:
console.log( tree.search( /index.js/ ) );

// Read the leaves:
console.log(
	tree.read({
		'include': /\.txt$/,
		'encoding': 'utf8',
		'concat': true
	},
	function onRead( text ) {
		console.log( text );
	})
);
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Notes

This module currently only supports directories and files. __No__ support for symlinks, devices, FIFO, or sockets.


---
## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ open reports/coverage/lcov-report/index.html
```


---
## Prior Art

Event-emitters:

* 	[findit](https://github.com/substack/node-findit)
*	[walker](https://github.com/daaku/nodejs-walker)
*	[walkdir](https://github.com/soldair/node-walkdir)
* 	[walk](https://github.com/coolaj86/node-walk)
* 	[filewalker](https://github.com/oleics/node-filewalker).

Filesystem:

* 	[fs-walk](https://github.com/confcompass/fs-walk)
* 	[jsondir](https://github.com/dwieeb/node-jsondir)
*	[node-dir](https://github.com/fshost/node-dir)
* 	[glob](https://github.com/isaacs/node-glob)
* 	[glob-stream](https://github.com/wearefractal/glob-stream)


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/dirtree.svg
[npm-url]: https://npmjs.org/package/dirtree

[travis-image]: http://img.shields.io/travis/kgryte/dirtree/master.svg
[travis-url]: https://travis-ci.org/kgryte/dirtree

[coveralls-image]: https://img.shields.io/coveralls/kgryte/dirtree/master.svg
[coveralls-url]: https://coveralls.io/r/kgryte/dirtree?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/dirtree.svg
[dependencies-url]: https://david-dm.org/kgryte/dirtree

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/dirtree.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/dirtree

[github-issues-image]: http://img.shields.io/github/issues/kgryte/dirtree.svg
[github-issues-url]: https://github.com/kgryte/dirtree/issues
DirTree
====
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Compile a directory structure into a searchable tree.


## Installation

``` bash
$ npm install dirtree
```

## Usage

``` javascript
var createTree = require( 'dirtree' );
```

#### createTree()

Creates a new `Tree` instance.

``` javascript
var tree = createTree();
```

A `tree` is configurable and has the following methods...


##### tree.root( [root] )

This method is a setter/getter. If no `root` directory is provided, returns the tree `root`. To set the tree `root`,

``` javascript
tree.root( __dirname );

var root = tree.root();
// returns '/absolute/directory/path/'
```

__Note__: the `root` should be an __absolute__ path.


##### tree.include( type[, filter] )

This method is a setter/getter for regular expression filters to __include__ particular files and directories. The method accepts two types: `files` and `dirs`. If no `filter` is provided, returns the inclusion `filter` for the specified `type`. To set an inclusion `filter`,

``` javascript
// Only include CSS files from build or styles directories:
tree.include( 'dirs', /build|styles/ ); // /build, /styles, /styles/build, /build/styles
tree.include( 'files', /.+\.css/ );
```


##### tree.exclude( type[, filter] )

This method is a setter/getter for regular expression filters to __exclude__ particular files and directories. The method accepts two types: `files` and `dirs`. If no `filter` is provided, returns the exclusion `filter` for the specified `type`. To set an exclusion `filter`,

``` javascript
// Exclude any hidden directories and dot files:
tree.exclude( 'dirs', /^\./ );
tree.exclude( 'files', /^\./ );
```


##### tree.create()

Compile a directory into a searchable tree.

``` javascript
tree.create();
```

__Note__: you __must__ first set a `root` directory __before__ running this method.


##### tree.leaves()

Returns all tree leaves. If a tree has not been created, `leaves` will be an empty array. To return all tree leaves,

``` javascript
tree.leaves();
// returns [...]
```

__Note__: the `array` elements will be __relative__ paths from the `root` directory.


##### tree.search( include[, exclude] )

Searches a tree for leaves matching the provided regular expression filters. Either an `include` or `exclude` or both filters are __required__. To only specify an `exclude` filter, set the `include` filter to `null`. To perform a search,

``` javascript
// Search inclusively for `*.md` files:
tree.search( /+.\.md$/ );
// returns {...}

// Search for any files which are not `*.txt` files:
tree.search( null, /.+\.txt$/ );
// returns {...}

// Search both inclusively and exclusively for all files having `foo` but not `bar` in their relative paths:
tree.search( /foo/, /bar/ );
// returns {...}
```


##### tree.read( [options,] clbk )

Searches a tree for leaves matching provided filters and reads the leaves ( files), returning the file content.

``` javascript
tree.read( onRead );

function onRead( error, content ) {
	if ( error ) {
		console.error( error );
		return;
	}
	console.log( content );
}
```

The method accepts the following `options`:

*	__include__: inclusion filter (same as for `tree.search()`).
*	__exclude__: exclusion filter (same as for `tree.search()`).
*	__encoding__: file [encoding](http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback). Default: `'utf8'`.
*	__concat__: `boolean` flag indicating whether the file content should be concatenated and returned as a `string`. If `false`, the file content is returned as an `object`, where each filed is the absolute file path and each value is the corresponding file content. Default: `false`.

``` javascript
var options = {
	'include': /.+\.css$/,
	'exclude': /src/,
	'encoding': 'utf8',
	'concat': true
};

// Read and concatenate all CSS files not in a `src` directory:
tree.read( options, onRead );

function onRead( error, content ) {
	if ( error ) {
		console.error( error );
		return;
	}
	console.log( content );
}
```


##### tree.toJSON()

Serializes a directory tree as JSON.

``` javascript
tree.toJSON();
// returns {...}
```


## Notes

This module currently __only__ supports _directories_ and _files_ and does __not__ support _symlinks_, _devices_, _FIFO_, or _sockets_.




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

// Read the leaves...
var opts = {
	'include': /\.txt$/,
	'encoding': 'utf8',
	'concat': true
};

tree.read( opts, onRead );

function onRead( error, text ) {
	if ( error ) {
		throw error;
	}
	console.log( text );
}
```

To run example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

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
$ make view-cov
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


## Copyright

Copyright &copy; 2014-2015. Athan Reines.


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

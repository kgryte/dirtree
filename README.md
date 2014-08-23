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

This method is a setter/getter. If no `root` directory is provided, returns the tree `root`. To set the tree `root`,

``` javascript
tree.root( __dirname );
```

The `root` should be an __absolute__ path.


#### tree.include( type[, filter] )

This method is a setter/getter for regular expression filters to include particular files and directories. The method accepts two types: `files` and `dirs`. If no `filter` is provided, returns the inclusion `filter` for the specified `type`. To set an inclusion `filter`,

``` javascript
// Only include CSS files from build or styles directories:
tree.include( 'dirs', /build|styles/ ); // /build, /styles, /styles/build, /build/styles
tree.include( 'files', /.+\.css/ );
```


#### tree.exclude( type[, filter] )

This method is a setter/getter for regular expression filters to exclude particular files and directories. The method accepts two types: `files` and `dirs`. If no `filter` is provided, returns the exclusion `filter` for the specified `type`. To set an exclusion `filter`,

``` javascript
// Exclude any hidden directories and dot files:
tree.exclude( 'dirs', /^\./ );
tree.exclude( 'files', /^\./ );
```


#### tree.create()

This method creates a directory tree. To create a tree,

``` javascript
tree.create();
```

You __must__ first set a `root` directory __before__ running this method.


#### tree.leaves()

This method returns all tree leaves. If a tree has not been created, `leaves` will be an empty array. To return all tree leaves,

``` javascript
tree.leaves();
```

Note: the array elements will be relative paths from the `root` directory.


#### tree.search( include[, exclude] )

This method searches a tree for leaves matching the provided regular expression filters. Either an `include` or `exclude` or both filters are __required__. To only specify an `exclude` filter, set the `include` filter to `null`. To perform a search,

``` javascript
// Search inclusively for `*.md` files:
tree.search( /+.\.md$/ );

// Search for any files which are not `*.txt` files:
tree.search( null, /.+\.txt$/ );

// Search both inclusively and exclusively for all files having `foo` but not `bar` in their relative paths:
tree.search( /foo/, /bar/ );
```


#### tree.read( [options,] clbk )

This method searches a tree for leaves matching provided filters and reads the leaves ( files), returning the file content. The `options` object may have one or more of the following fields:

``` javascript
var options = {
		'include': /foo/,
		'exclude': /bar/,
		'encoding': 'utf8',
		'concat': true
	};
```

The filters are the same as for `tree.search()`. The `encoding` option is the file [encoding](http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback). The `concat` flag indicates whether the file content should be concatenated and returned as a `string`. If set to `false`, the file content is returned as an `object`, where each field is the absolute file path and each value is the corresponding file content.

To read leaves and concatentate the file content into a single string,

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


#### tree.toJSON()

This method serializes a directory tree as JSON. To get the JSON tree,

``` javascript
tree.toJSON();
```


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

To run example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Notes

This module currently __only__ supports _directories_ and _files_ and does __not__ support _symlinks_, _devices_, _FIFO_, or _sockets_.


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
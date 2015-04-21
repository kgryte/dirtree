'use strict';

// MODULES //

var path = require( 'path' ),
	createTree = require( './../lib' );


// TREE //

var tree = createTree();

tree
	.root( path.resolve( __dirname, '../' ) )
	.exclude( 'dirs', /^\.|node_modules|reports|test/ )
	.exclude( 'files', /^\./ )
	.include( 'files', /index.js/ )
	.create();

// Serialize the tree to JSON:
console.log( tree.toJSON() );
/* returns:
	{
		'examples': {
			'index.js': '/path/to/dirtree/examples/index.js'
		},
		'lib': {
			'index.js': '/path/to/dirtree/lib/index.js'
		}
	}
*/

// Get the tree leaves:
console.log( tree.leaves() );
/* returns:
	[
		'examples/index.js',
		'lib/index.js'
	]
*/

// Search the leaves:
console.log( tree.search( /index.js/, /examples/ ) );
/* returns:
	{
		'lib/index.js': '/path/to/dirtree/lib/index.js'
	}
*/

// Read leaf files...
var opts = {
	'include': /index.js/,
	'exclude': /examples/,
	'encoding': 'utf8',
	'concat': true
};

tree.read( opts, onRead );

function onRead( error, data ) {
	if ( error ) {
		throw error;
	}
	console.log( data );
	// returns `lib/index.js` file content
}

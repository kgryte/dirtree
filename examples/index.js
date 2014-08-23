

// MODULES //

var path = require( 'path' ),
	createTree = require( './../lib' );


// VARIABLES //

var root = path.resolve( __dirname, '../' );


// TREE //

var tree = createTree();

tree
	.root( root )
	.exclude( 'dirs', /^\.|node_modules/ )
	.exclude( 'files', /^\./ )
	.include( 'files', /index.js/ )
	.create();

// Serialize the tree to JSON:
console.log( tree.toJSON() );

/**
* Returns:
*
*/

// Get the tree leaves:
console.log( tree.leaves() );

/**
* Returns:
*
*/

// Search the leaves:
console.log( tree.search( /index.js/, /examples/ ) );

/**
* Returns:
*
*/

// Read leaf files:
var data = tree.read(
	{
		'include': /index.js/,
		'exclude': /examples/,
		'encoding': 'utf8',
		'concat': true
	},
	function onRead( data ) {
		// console.log( data );
	}
);

/**
* Returns:
*
*/
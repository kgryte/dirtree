

// MODULES //

var path = require( 'path' ),
	createTree = require( './../lib' );


// VARIABLES //

var root = path.resolve( __dirname, '../' );


// TREE //

var tree = createTree();

tree
	.root( root )
	.filter( /^\.|node_modules|\.md$/ )
	.create();

console.log( tree._tree );
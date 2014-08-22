/**
*
*	TREE
*
*
*	DESCRIPTION:
*		- Creates a directory tree interface for all directory and file descendents.
*
*
*	NOTES:
*		[1] Only directories and files are included in the tree.
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*
*	Copyright (c) Athan Reines. 2014.
*
*/


(function() {
	'use strict';

	// MODULES //

	var // Filesystem module:
		fs = require( 'fs' ),

		// Path module:
		path = require( 'path' ),

		// Module to flatten and unflatten objects:
		flatten = require( 'flat' ).flatten;


	// FUNCTIONS //

	/**
	* FUNCTION: dir2json( root, filter )
	*	Maps a directory structure to a JSON object. Note: only includes directories and files.
	*
	* @param {String} root - root directory path
	* @param {RegExp|null} filter - regular expresion used to exclude leaves from the walk.
	*/
	function dir2json( root, filter ) {
		var leaves = fs.readdirSync( root ),
			tree = {},
			name,
			leaf,
			stats;

		for ( var i = 0; i < leaves.length; i++ ) {
			name = leaves[ i ];
			if ( filter && filter.test( name ) ) {
				continue;
			}
			leaf = path.join( root, name );
			stats = fs.lstatSync( leaf );
			if ( stats.isDirectory() ) {
				tree[ name ] = dir2json( leaf, filter );
			} else if ( stats.isFile() ) {
				tree[ name ] = leaf;
			}
		}
		return tree;
	} // end FUNCTION dir2json()


	// TREE //

	/**
	* FUNCTION: Tree()
	*	Tree constructor.
	*
	* @constructor
	* @returns {Tree} Tree instance
	*/
	function Tree( root ) {
		this._root = null;
		this._tree = {};
		this._flattened = {};
		this._filter = null;
		return this;
	} // end FUNCTION Tree()

	/**
	* METHOD: root( root )
	*	Root directory from which to build a tree.
	*
	* @param {String} [root] - root directory
	* @returns {Tree|String} Tree instance or root directory
	*/
	Tree.prototype.root = function( root ) {
		if ( !arguments.length ) {
			return this._root;
		}
		if ( typeof root !== 'string' ) {
			throw new TypeError( 'createTree()::invalid input argument. The root directory must be a string.' );
		}
		if ( !fs.existsSync( root ) ) {
			throw new Error( 'createTree()::invalid input argument. The root directory does not exist.' );
		}
		this._root = root;
		return this;
	}; // end METHOD root()

	/**
	* METHOD: filter( filter )
	*	Exclusion filter setter and getter. If a regular expression is provided, sets the exclusion filter. If no regular expression is provided, returns the exclusion filter.
	*
	* @param {RegExp} [filter] - regular expression to exclude files and directories.
	* @returns {Tree|RegExp|null} Tree instance or regular expression
	*/
	Tree.prototype.filter = function( filter ) {
		if ( !arguments.length ) {
			return this._filter;
		}
		if ( !( filter instanceof RegExp ) ) {
			throw new TypeError( 'create()::invalid input argument. Argument must be a regular expression.' );
		}
		this._filter = filter;
		return this;
	}; // end METHOD filter()

	/**
	* METHOD: create()
	*	Creates a tree.
	*
	* @returns {Tree} Tree instance
	*/
	Tree.prototype.create = function( exclude ) {
		if ( !this._root ) {
			throw new Error( 'create()::not initialized. Must first set a tree root before creating a tree.' );
		}
		
		// Walk the directory and transform it into a tree object:
		this._tree = dir2json( this._root, this._filter );

		// Flatten the tree to one-level deep:
		this._flattened = flatten( this._tree );

		return this;
	}; // end METHOD create()


	// EXPORTS //

	module.exports = function createTree() {
		return new Tree();
	};

})();




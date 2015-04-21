'use strict';

// MODULES //

var fs = require( 'fs' ),
	path = require( 'path' ),
	isString = require( 'validate.io-string-primitive' ),
	isRegExp = require( 'validate.io-regexp' ),
	isBoolean = require( 'validate.io-boolean-primitive' ),
	copy = require( 'utils-copy' ),
	flatten = require( 'flat' ).flatten;


// VARIABLES //

var FILTERTYPES = [
	'files',
	'dirs'
];


// FUNCTIONS //

/**
* FUNCTION: dir2json( root, filters )
*	Maps a directory structure to a JSON object. Note that the returned tree only includes directories and files.
*
* @private
* @param {String} root - root directory path
* @param {Object} filters - object containing regular expressions used to exclude branches and leaves while on the walk
* @returns {Object} directory tree
*/
function dir2json( root, filters ) {
	var leaves = fs.readdirSync( root ),
		tree = {},
		name,
		leaf,
		stats,
		len,
		i;

	len = leaves.length;
	for ( i = 0; i < len; i++ ) {
		name = leaves[ i ];
		leaf = path.join( root, name );
		stats = fs.lstatSync( leaf );

		// Directory:
		if ( stats.isDirectory() ) {
			// Filters:
			if ( filters.exDir && filters.exDir.test( name ) ) {
				continue;
			}
			if ( filters.inDir && !filters.inDir.test( name ) ) {
				continue;
			}
			// Continue walking...
			tree[ name ] = dir2json( leaf, filters );

			if ( !Object.keys( tree[ name ] ).length ) {
				// Do some pruning...
				delete tree[ name ];
			}
		}
		// File:
		else if ( stats.isFile() ) {
			// Filters:
			if ( filters.exFile && filters.exFile.test( name ) ) {
				continue;
			}
			if ( filters.inFile && !filters.inFile.test( name ) ) {
				continue;
			}
			// Store the leaf:
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
	this._leaves = [];
	this._include = {
		'files': null,
		'dirs': null
	};
	this._exclude = {
		'files': null,
		'dirs': null
	};
	return this;
} // end FUNCTION Tree()

/**
* METHOD: root( [root] )
*	Root directory from which to build a tree.
*
* @param {String} [root] - root directory (absolute path)
* @returns {Tree|String} Tree instance or root directory
*/
Tree.prototype.root = function( root ) {
	if ( !arguments.length ) {
		return this._root;
	}
	if ( !isString( root ) ) {
		throw new TypeError( 'root()::invalid input argument. The root directory must be a string primitive. Value: `' + root + '`.' );
	}
	if ( !fs.existsSync( root ) ) {
		throw new Error( 'root()::invalid input argument. The root directory does not exist. Value: `' + root + '`.' );
	}
	this._root = root;
	return this;
}; // end METHOD root()

/**
* METHOD: include( type[, filter] )
*	Inclusion filter setter and getter. If a regular expression is provided, sets an inclusion filter. If no regular expression is provided, returns an inclusion filter.
*
* @param {String} type - inclusion filter type; e.g., `files`, `dirs`.
* @param {RegExp} [filter] - regular expression used for file and directory inclusion
* @returns {Tree|RegExp|null} Tree instance or regular expression
*/
Tree.prototype.include = function( type, filter ) {
	if ( !arguments.length ) {
		throw new Error( 'include()::insufficient input arguments. Must provide an inclusion filter type.' );
	}
	if ( FILTERTYPES.indexOf( type ) === -1 ) {
		throw new Error( 'include()::invalid input argument. Filter type is not recognized: `' + type + '`. Type must be one of the following: `' + FILTERTYPES.join( ', ' ) + '`.' );
	}
	if ( arguments.length === 1 ) {
		return this._include[ type ];
	}
	if ( !isRegExp( filter ) ) {
		throw new TypeError( 'include()::invalid input argument. Filter must be a regular expression. Value: `' + filter + '`.' );
	}
	this._include[ type ] = filter;
	return this;
}; // end METHOD include()

/**
* METHOD: exclude( type[, filter] )
*	Exclusion filter setter and getter. If a regular expression is provided, sets an exclusion filter. If no regular expression is provided, returns an exclusion filter.
*
* @param {String} type - exclusion filter type; e.g., `files`, `dirs`.
* @param {RegExp} [filter] - regular expression to exclude files and directories.
* @returns {Tree|RegExp|null} Tree instance or regular expression
*/
Tree.prototype.exclude = function( type, filter ) {
	if ( !arguments.length ) {
		throw new Error( 'exclude()::insufficient input arguments. Must provide an exclusion filter type.' );
	}
	if ( FILTERTYPES.indexOf( type ) === -1 ) {
		throw new Error( 'include()::invalid input argument. Filter type is not recognized: `' + type + '`. Type must be one of the following: `' + FILTERTYPES.join( ', ' ) + '`.' );
	}
	if ( arguments.length === 1 ) {
		return this._exclude[ type ];
	}
	if ( !isRegExp( filter ) ) {
		throw new TypeError( 'exclude()::invalid input argument. Filter must be a regular expression. Value: `' + filter + '`.' );
	}
	this._exclude[ type ] = filter;
	return this;
}; // end METHOD exclude()

/**
* METHOD: create()
*	Creates a tree.
*
* @returns {Tree} Tree instance
*/
Tree.prototype.create = function() {
	if ( !this._root ) {
		throw new Error( 'create()::not initialized. Must first set a tree root before creating a tree.' );
	}
	// Walk the directory and transform it into a tree object:
	this._tree = dir2json( this._root, {
		'inFile': this._include.files,
		'exFile': this._exclude.files,
		'inDir': this._include.dirs,
		'exDir': this._exclude.dirs
	});

	// Flatten the tree to one-level deep:
	this._flattened = flatten( this._tree, { 'delimiter': '/' } );

	// Cache all the leaves:
	this._leaves = Object.keys( this._flattened );

	return this;
}; // end METHOD create()

/**
* METHOD: leaves()
*	Returns a list of leaves. Each leaf entry includes its branch path; e.g., 'branch/branch/leaf.ext'.
*
* @returns {String[]} tree leaves
*/
Tree.prototype.leaves = function() {
	var arr = this._leaves,
		out,
		len,
		i;

	len = arr.length;
	out = new Array( len );
	for ( i = 0; i < len; i++ ) {
		out[ i ] = arr[ i ];
	}
	return out;
}; // end METHOD leaves()

/**
* METHOD: search( include[, exclude] )
*	Search a tree for leaves matching the provided regular expression filters.
*
* @param {RegExp|null} include - regular expression for leaf inclusion
* @param {RegExp|null} [exclude] - regular expression for leaf exclusion
* @returns {Object} leaves matching the filters along with their absolute filepaths
*/
Tree.prototype.search = function( include, exclude ) {
	var leaves = this._leaves,
		tree = this._flattened,
		numLeaves = leaves.length,
		matches = {},
		leaf,
		i;

	if ( arguments.length < 1 ) {
		throw new Error( 'search()::insufficient input arguments. Must provide regular expression filters.' );
	}
	if ( !include && !exclude ) {
		throw new Error( 'search()::invalid input arguments. Must at least provide either an inclusion or an exclusion filter.' );
	}
	if ( include && !isRegExp( include ) ) {
		throw new TypeError( 'search()::invalid input argument. Include filters must be regular expressions. Value: `' + include + '`.' );
	}
	if ( exclude && !isRegExp( exclude ) ) {
		throw new TypeError( 'search()::invalid input argument. Exclude filters must be regular expressions. Value: `' + exclude + '`.' );
	}
	for ( i = 0; i < numLeaves; i++ ) {
		leaf = leaves[ i ];
		if ( exclude && exclude.test( leaf ) ) {
			continue;
		}
		if( include && !include.test( leaf ) ) {
			continue;
		}
		matches[ leaf ] = tree[ leaf ];
	}
	return matches;
}; // end METHOD search()

/**
* METHOD: read( [options,] clbk )
*	Search a tree for leaves matching input filters and reads the leaves.
*
* @param {Object} [options] - read options:
*	@property {RegExp} [include] - regular expression for leaf inclusion
*	@property {RegExp} [exclude] - regular expression for leaf exclusion
*	@property {Boolean} [concat] - option flag indicating whether to concatenate leaf content
*	@property {String} [encoding='utf8'] - file encoding
* @param {Function} clbk - callback to invoke after reading leaves. Function should take one argument: [ data ]. If no leaves are found which match the filters, data is `null`.
* @returns {Tree} Tree instance
*/
Tree.prototype.read = function() {
	var leaves = this._leaves,
		tree = this._flattened,
		numLeaves = leaves.length,
		matches = [],
		content = {},
		counter = 0,
		clbk,
		options,
		include,
		exclude,
		concat,
		encoding,
		leaf,
		numMatches,
		i;

	if ( !arguments.length ) {
		throw new Error( 'read()::insufficient input arguments. Must provide a callback.' );
	}
	if ( arguments.length === 1 ) {
		options = {};
		clbk = arguments[ 0 ];
	} else {
		options = arguments[ 0 ];
		clbk = arguments[ 1 ];
	}
	// Options...
	include = options.include || null;
	exclude = options.exclude || null;
	concat = options.concat || null;
	encoding = options.encoding || 'utf8';

	// Checks...
	if ( typeof clbk !== 'function' ) {
		throw new TypeError( 'read()::invalid input argument. Callback must be a function. Value: `' + clbk + '`.' );
	}
	if ( include && !isRegExp( include ) ) {
		throw new TypeError( 'read()::invalid option. Include filters must be regular expressions. Option: `' + include + '`.' );
	}
	if ( exclude && !isRegExp( exclude ) ) {
		throw new TypeError( 'read()::invalid option. Exclude filters must be regular expressions. Option: `' + exclude + '`.' );
	}
	if( encoding && !isString( encoding ) ) {
		throw new TypeError( 'read()::invalid option. Encoding option must be a string. Option: `' + encoding + '`.' );
	}
	if ( concat && !isBoolean( concat ) ) {
		throw new TypeError( 'read()::invalid option. Concatenation flag must be boolean primitive. Option: `' + concat + '`.' );
	}

	// Find the leaves...
	for ( i = 0; i < numLeaves; i++ ) {
		leaf = leaves[ i ];
		if ( exclude && exclude.test( leaf ) ) {
			continue;
		}
		if( include && include.test( leaf ) ) {
			matches.push( tree[ leaf ] );
		}
	}
	// Did we find any matches?
	numMatches = matches.length;
	if ( !numMatches ) {
		clbk( null );
	}
	// Read all matched files...
	for ( i = 0; i < numMatches; i++ ) {
		fs.readFile(
			matches[ i ],
			{'encoding': encoding},
			onFile( matches[ i ] )
		);
	}
	return this;

	/**
	* FUNCTION: onFile( key )
	*	Returns a callback to be invoked upon reading a file.
	*
	* @private
	* @param {String} key - filename
	*/
	function onFile( key ) {
		/**
		* FUNCTION: onFile( error, data )
		*	Callback invoked upon reading a file.
		*
		* @private
		* @param {Object} error - error object
		* @param {String} data - file content
		*/
		return function onFile( error, data ) {
			if ( error ) {
				clbk( error );
				return;
			}
			content[ key ] = data;
			if ( ++counter === numMatches ) {
				done();
			}
		}; // end FUNCTION onFile()
	} // end FUNCTION onFile()

	/**
	* FUNCTION: done()
	*	Invoked upon reading all matched files.
	*
	* @private
	*/
	function done() {
		var str = '',
			keys,
			i;
		if ( !concat ) {
			clbk( null, content );
			return;
		}
		keys = Object.keys( content );
		for ( i = 0; i < keys.length; i++ ) {
			str += content[ keys[i] ];
		}
		clbk( null, str );
	} // end FUNCTION done()
}; // end METHOD read()

/**
* METHOD: toJSON()
*	Serializes a tree as JSON.
*
* @returns {Object} JSON tree
*/
Tree.prototype.toJSON = function() {
	return copy( this._tree );
}; // end METHOD toJSON()


// EXPORTS //

module.exports = function createTree() {
	return new Tree();
};




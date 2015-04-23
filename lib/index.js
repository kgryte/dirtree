'use strict';

// MODULES //

var fs = require( 'fs' ),
	path = require( 'path' ),
	isObject = require( 'validate.io-object' ),
	isString = require( 'validate.io-string-primitive' ),
	isRegExp = require( 'validate.io-regexp' ),
	isBoolean = require( 'validate.io-boolean-primitive' ),
	copy = require( 'utils-copy' ),
	createMergeFcn = require( 'utils-merge2' ),
	flatten = require( 'flat' ).flatten;


// VARIABLES //

var filters = [
	'inFile',
	'exFile',
	'inDir',
	'exDir',
	'inContent',
	'exContent'
];


// FUNCTIONS //

var merge = createMergeFcn({
	'extend': false
});

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

		if ( stats.isDirectory() ) {
			if ( filters.exDir && filters.exDir.test( name ) ) {
				continue;
			}
			if ( filters.inDir && !filters.inDir.test( name ) ) {
				continue;
			}
			// Continue walking...
			tree[ name ] = dir2json( leaf, filters );

			if ( !Object.keys( tree[ name ] ).length ) {
				// Do some pruning (empty directory)...
				delete tree[ name ];
			}
		} else if ( stats.isFile() ) {
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
* FUNCTION: Tree( root[, opts] )
*	Tree constructor.
*
* @constructor
* @param {String} root - root directory from which to build a tree
* @param {Object} [opts] - Tree options
* @param {RegExp} [opts.inFile] - inclusion filter based on file name
* @param {RegExp} [opts.exFile] - exclusion filter based on file name
* @param {RegExp} [opts.inDir] - inclusion filter based on directory name
* @param {RegExp} [opts.exDir] - exclusion filter based on directory name
* @param {RegExp} [opts.inContent] - inclusion filter based on file content
* @param {RegExp} [opts.exContent] - exclusion filter based on file content
* @returns {Tree} Tree instance
*/
function Tree( root, options ) {
	var nargs = arguments.length,
		opts,
		tmp,
		key,
		i;
	if ( nargs < 2 ) {
		opts = {};
	} else {
		opts = options;
	}
	if ( !( this instanceof Tree ) ) {
		return new Tree( root, opts );
	}
	if ( !isString( root ) ) {
		throw new TypeError( 'Tree()::invalid input argument. The root directory argument must be a string primitive. Value: `' + root + '`.' );
	}
	if ( !fs.existsSync( root ) ) {
		throw new Error( 'Tree()::invalid input argument. The root directory does not exist. Value: `' + root + '`.' );
	}
	if ( !isObject( opts ) ) {
		throw new TypeError( 'Tree()::invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
	}
	for ( i = 0; i < filters.length; i++ ) {
		key = filters[ i ];
		if ( opts.hasOwnProperty( key ) && !isRegExp( opts[ key ] ) ) {
			throw new TypeError( 'Tree()::invalid option. Filters must be regular expressions. Filter: `' + key + '`. Option: `' + opts[ key ] + '`.' );
		}
	}
	this._root = root;

	this._opts = {
		'inFile': null,
		'exFile': null,
		'inDir': null,
		'exDir': null,
		'inContent': null,
		'exContent': null
	};
	merge( this._opts, opts );

	// Walk the directory and transform it into a tree object...
	this._tree = dir2json( this._root, this._opts );

	// Flatten the tree to one-level deep:
	this._flattened = flatten( this._tree, {
		'delimiter': '/'
	});

	// Cache all the leaves:
	this._leaves = Object.keys( this._flattened );

	// Cache all the branches...
	this._branches = {};
	for ( i = 0; i < this._leaves.length; i++ ) {
		tmp = this._leaves[ i ].split( '/' );

		// Extract the file path:
		key = tmp.slice( 0, tmp.length-1 )
			.join( '/' );

		// Isolate the file name:
		tmp = {
			'name': tmp[ tmp.length-1 ],
			'idx': i
		};
		// Add the file name to the branch hash...
		if ( this._branches.hasOwnProperty( key ) ) {
			this._branches[ key ].push( tmp );
		} else {
			this._branches[ key ] = [ tmp ];
		}
	}
	return this;
} // end FUNCTION Tree()

/**
* METHOD: search( [opts] )
*	Search a tree.
*
* @param {Object} [opts] - search options
* @param {RegExp} [opts.inFile] - inclusion filter based on file name
* @param {RegExp} [opts.exFile] - exclusion filter based on file name
* @param {RegExp} [opts.inDir] - inclusion filter based on directory name
* @param {RegExp} [opts.exDir] - exclusion filter based on directory name
* @param {RegExp} [opts.inContent] - inclusion filter based on file content
* @param {RegExp} [opts.exContent] - exclusion filter based on file content
* @returns {Object} leaves satisfying the filters along with their absolute file paths
*/
Tree.prototype.search = function( opts ) {
	var tree = this._flattened,
		branches = this._branches,
		leaves = this._leaves,
		matches = {},
		re = {},
		dpaths,
		leaf,
		name,
		list,
		len,
		tmp,
		key,
		i, j, k;

	// [0] Validate input arguments...
	if ( arguments.length ) {
		if ( !isObject( opts ) ) {
			throw new TypeError( 'search()::invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
		}
		for ( i = 0; i < filters.length; i++ ) {
			key = filters[ i ];
			if ( opts.hasOwnProperty( key ) ) {
				if ( !isRegExp( opts[ key ] ) ) {
					throw new TypeError( 'search()::invalid option. Filters must be regular expressions. Filter: `' + key + '`. Option: `' + opts[ key ] + '`.' );
				}
				re[ key ] = opts[ key ];
			} else {
				re[ key ] = null;
			}
		}
	} else {
		for ( i = 0; i < filters.length; i++ ) {
			re[ filters[ i ] ] = null;
		}
	}
	// [1] Get the branch paths...
	dpaths = Object.keys( branches );
	len = dpaths.length;

	// Note that the approach which follows seeks to maintain a `dpaths` array of only 'good' branches. Any branches not satisfying filter criteria are not reassigned in the array. Accordingly, 'good' branches will overwrite 'bad' branches and we explicitly set the length to truncate the `dpaths` array.
	k = 0;

	// [2] Filter based on an exclusion directory filter...
	if ( re.exDir ) {
		for ( i = 0; i < len; i++ ) {
			name = dpaths[ i ];
			if ( !re.exDir.test( name ) ) {
				dpaths[ k ] = name;
				k += 1;
			}
		}
		len = k;
		dpaths.length = len;
		k = 0;
	}
	// [3] Filter based on an inclusion directory filter...
	if ( re.inDir ) {
		for ( i = 0; i < len; i++ ) {
			name = dpaths[ i ];
			if ( re.inDir.test( name ) ) {
				dpaths[ k ] = name;
				k += 1;
			}
		}
		len = k;
		dpaths.length = len;
	}
	// [4] Assemble a list of leaves...
	list = [];
	for ( i = 0; i < len; i++ ) {
		tmp = branches[ dpaths[ i ] ];
		k = tmp.length;
		for ( j = 0; j < k; j++ ) {
			list.push( tmp[ j ] );
		}
	}
	len = list.length;

	// Note that we follow a similar strategy as that employed above for the `dpaths` array but now for leaves...
	k = 0;

	// [5] Filter based on an exclusion file filter...
	if ( re.exFile ) {
		for ( i = 0; i < len; i++ ) {
			name = list[ i ].name;
			if ( !re.exFile.test( name ) ) {
				list[ k ] = list[ i ];
				k += 1;
			}
		}
		len = k;
		list.length = len;
		k = 0;
	}
	// [6] Filter based on an inclusion file filter...
	if ( re.inFile ) {
		for ( i = 0; i < len; i++ ) {
			name = list[ i ].name;
			if ( re.inFile.test( name ) ) {
				list[ k ] = list[ i ];
				k += 1;
			}
		}
		len = k;
		list.length = len;
	}
	// [7] Assemble the absolute file paths for the remaining leaves...
	for ( i = 0; i < len; i++ ) {
		leaf = leaves[ list[i].idx ];
		list[ i ] = {
			'name': leaf, // relative path
			'path': tree[ leaf ] // absolute path
		};
	}
	// [8] Filter based on file content...
	if ( re.exContent || re.inContent ) {
		for ( i = 0; i < len; i++ ) {
			// TODO: basically do grep. Streams!!! Will probably need to be asynchronous to allow for simultaneous file streams. Thus, the fcn will need to accept a callback to receive search results. Similar to `read`.
		}
	}
	// [9] Format the output...
	for ( i = 0; i < len; i++ ) {
		tmp = list[ i ];
		matches[ tmp.name ] = tmp.path;
	}
	// [10] Return the matches:
	return matches;
}; // end METHOD search()

/**
* METHOD: read( [options,] clbk )
*	Search a tree for leaves matching input filters and reads the leaves.
*
* @param {Object} [options] - read options:
* @param {RegExp} [options.include] - regular expression for leaf inclusion
* @param {RegExp} [options.exclude] - regular expression for leaf exclusion
* @parma {Boolean} [options.concat=false] - option flag indicating whether to concatenate leaf content
* @param {String} [options.encoding='utf8'] - file encoding
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
* METHOD: branches()
*	Returns a list of branches; i.e., directory paths.
*
* @returns {String[]} tree branches
*/
Tree.prototype.branches = function() {
	return Object.keys( this._branches );
}; // end METHOD leaves()

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

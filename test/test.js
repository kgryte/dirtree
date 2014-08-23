
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Path module:
	path = require( 'path' ),

	// Module to be tested:
	createTree = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'tree', function tests() {
	'use strict';

	// SETUP //

	var TREE, LEAVES;

	TREE = {
		'README.md': path.join( __dirname, 'test_dir/README.md' ),
		'foo': {
			'index.js': path.join( __dirname, 'test_dir/foo/index.js' ),
			'bar': {
				'css': {
					'styles.1.css': path.join( __dirname, 'test_dir/foo/bar/css/styles.1.css' ),
					'styles.2.css': path.join( __dirname, 'test_dir/foo/bar/css/styles.2.css' )
				},
				'js': {
					'script.1.js': path.join( __dirname, 'test_dir/foo/bar/js/script.1.js' ),
					'script.2.js': path.join( __dirname, 'test_dir/foo/bar/js/script.2.js' )
				},
				'text': {
					'bar.txt': path.join( __dirname, 'test_dir/foo/bar/text/bar.txt' ),
					'foo.txt': path.join( __dirname, 'test_dir/foo/bar/text/foo.txt' )
				}
			}
		}
	};

	LEAVES = [
		'README.md',
		'foo/index.js',
		'foo/bar/css/styles.1.css',
		'foo/bar/css/styles.2.css',
		'foo/bar/js/script.1.js',
		'foo/bar/js/script.2.js',
		'foo/bar/text/bar.txt',
		'foo/bar/text/foo.txt'
	];


	// TESTS //

	it( 'should export a factory function', function test() {
		expect( createTree ).to.be.a( 'function' );
	});

	describe( 'root', function tests() {

		it( 'should provide a method to set/get the tree root', function test() {
			var tree = createTree();
			expect( tree.root ).to.be.a( 'function' );
		});

		it( 'should not allow a non-string root', function test() {
			var tree = createTree(),
				values = [
					5,
					[],
					{},
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					tree.root( value );
				};
			}
		});

		it( 'should throw an error if the root does not exist', function test() {
			var tree = createTree();
			expect( foo ).to.throw( Error );
			function foo() {
				tree.root( '/directory/does/not/exist/beep/boop/foo/bar/1/2/3' );
			}
		});

		it( 'should set the root directory', function test() {
			var tree = createTree();
			tree.root( __dirname );
			assert.strictEqual( tree.root(), __dirname );
		});

	}); // end TESTS root

	describe( 'include', function tests() {

		it( 'should provide a method to set/get directory and file inclusion filters', function test() {
			var tree = createTree();
			expect( tree.include ).to.be.a( 'function' );
		});

		it( 'should require a filter type', function test() {
			var tree = createTree();
			expect( tree.include ).to.throw( Error );
		});

		it( 'should not allow filter types other than for `files` and `dirs`', function test() {
			var tree = createTree();
			expect( bad ).to.throw( Error );
			expect( good ).to.not.throw( Error );
			function bad() {
				tree.include( 'sym' );
			}
			function good() {
				tree.include( 'dirs' );
				tree.include( 'files' );
			}
		});

		it( 'should not allow a non-regexp filter', function test() {
			var tree = createTree(),
				values = [
					'5',
					5,
					[],
					{},
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					tree.include( 'dirs', value );
				};
			}
		});

		it( 'should set an inclusion filter', function test() {
			var tree = createTree(),
				dirs = /foo/,
				files = /bar/;

			tree
				.include( 'dirs', dirs )
				.include( 'files', files );

			assert.strictEqual( tree.include( 'dirs' ), dirs );
			assert.strictEqual( tree.include( 'files' ), files );
		});

	}); // end TESTS include

	describe( 'exclude', function tests() {

		it( 'should provide a method to set/get directory and file exclusion filters', function test() {
			var tree = createTree();
			expect( tree.exclude ).to.be.a( 'function' );
		});

		it( 'should require a filter type', function test() {
			var tree = createTree();
			expect( tree.exclude ).to.throw( Error );
		});

		it( 'should not allow filter types other than for `files` and `dirs`', function test() {
			var tree = createTree();
			expect( bad ).to.throw( Error );
			expect( good ).to.not.throw( Error );
			function bad() {
				tree.exclude( 'sym' );
			}
			function good() {
				tree.exclude( 'dirs' );
				tree.exclude( 'files' );
			}
		});

		it( 'should not allow a non-regexp filter', function test() {
			var tree = createTree(),
				values = [
					'5',
					5,
					[],
					{},
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					tree.exclude( 'dirs', value );
				};
			}
		});

		it( 'should set an exclusion filter', function test() {
			var tree = createTree(),
				dirs = /foo/,
				files = /bar/;

			tree
				.exclude( 'dirs', dirs )
				.exclude( 'files', files );

			assert.strictEqual( tree.exclude( 'dirs' ), dirs );
			assert.strictEqual( tree.exclude( 'files' ), files );
		});

	}); // end TESTS exclude

	describe( 'create', function tests() {

		it( 'should provide a method to create a directory tree', function test() {
			var tree = createTree();
			expect( tree.create ).to.be.a( 'function' );
		});

		it( 'should throw an error if the tree has no root', function test() {
			var tree = createTree();
			expect( foo ).to.throw( Error );
			function foo() {
				tree.create();
			}
		});

		it( 'should create a directory tree', function test( done ) {
			var tree = createTree();

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			assert.deepEqual( tree.toJSON(), TREE );

			done();
		});

		it( 'should create a directory tree using inclusion file filters', function test( done ) {
			var tree = createTree(),
				expected = {
					'README.md': TREE[ 'README.md' ]
				};

			tree
				.include( 'files', /.+\.md/ )
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			assert.deepEqual( tree.toJSON(), expected );

			done();
		});

		it( 'should create a directory tree using exlusion file filters', function test( done ) {
			var tree = createTree(),
				expected = {
					'README.md': TREE[ 'README.md' ],
					'foo': {
						'bar': {
							'text': {
								'bar.txt': TREE['foo']['bar']['text']['bar.txt'],
								'foo.txt': TREE['foo']['bar']['text']['foo.txt']
							}
						}
					}
				};

			tree
				.exclude( 'files', /.+\.js|.+\.css/ )
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			assert.deepEqual( tree.toJSON(), expected );

			done();
		});

		it( 'should create a directory tree using inclusion directory filters', function test( done ) {
			var tree = createTree(),
				expected = {
					'README.md': TREE[ 'README.md' ],
					'foo': {
						'bar': {
							'text': {
								'bar.txt': TREE['foo']['bar']['text']['bar.txt'],
								'foo.txt': TREE['foo']['bar']['text']['foo.txt']
							}
						},
						'index.js': TREE['foo']['index.js']
					}
				};

			tree
				.include( 'dirs', /foo|bar|text/ )
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			assert.deepEqual( tree.toJSON(), expected );

			done();
		});

		it( 'should create a directory tree using exclusion directory filters', function test( done ) {
			var tree = createTree(),
				expected = {
					'README.md': TREE[ 'README.md' ]
				};

			tree
				.exclude( 'dirs', /foo/ )
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			assert.deepEqual( tree.toJSON(), expected );

			done();
		});

		it( 'should create a directory tree using a combination of inclusion/exclusion file and directory filters', function test( done ) {
			var tree = createTree(),
				expected = {
					'foo': {
						'bar': {
							'text': {
								'bar.txt': TREE['foo']['bar']['text']['bar.txt']
							}
						}
					}
				};

			tree
				.include( 'files', /.+\.txt/ )
				.include( 'dirs', /./ )
				.exclude( 'files', /foo/ )
				.exclude( 'dirs', /css/ )
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			assert.deepEqual( tree.toJSON(), expected );

			done();
		});

	}); // end TESTS create

	describe( 'leaves', function tests() {

		it( 'should provide a method to list all tree leaves (files)', function test() {
			var tree = createTree();
			expect( tree.leaves ).to.be.a( 'function' );
		});

		it( 'should list all tree leaves (files)', function test() {
			var tree = createTree(),
				leaves;

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			leaves = tree.leaves();

			assert.strictEqual( leaves.length, LEAVES.length );

			for ( var i = 0; i < LEAVES.length; i++ ) {
				assert.notEqual( leaves.indexOf( LEAVES[i] ), -1 );
			}
		});

	}); // end TESTS leaves

	describe( 'search', function tests() {

		it( 'should provide a method to search a directory tree', function test() {
			var tree = createTree();
			expect( tree.search ).to.be.a( 'function' );
		});

		it( 'should require a filter', function test() {
			var tree = createTree();
			
			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			expect( foo ).to.throw( Error );

			function foo() {
				tree.search();
			}
		});

		it( 'should require either an inclusion or exclusion filter or both', function test() {
			var tree = createTree();

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			expect( foo ).to.throw( Error );

			function foo() {
				tree.search( null );
			}
		});

		it( 'should not allow a non-regexp filter', function test() {
			var tree = createTree(),
				values = [
					'5',
					5,
					[],
					{},
					true,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badInclude( values[i] ) ).to.throw( TypeError );
				expect( badExclude( values[i] ) ).to.throw( TypeError );
			}

			function badInclude( value ) {
				return function() {
					tree.search( value );
				};
			}
			function badExclude( value ) {
				return function() {
					tree.search( /\./, value );
				};
			}
		});

		it( 'should search via an include filter', function test() {
			var tree = createTree(),
				expected = {
					'foo/index.js': TREE[ 'foo' ][ 'index.js' ]
				},
				matches;

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			matches = tree.search( /index.js/ );

			expect( matches ).to.be.an( 'object' );
			assert.deepEqual( matches, expected );
		});

		it( 'should search via an exclude filter', function test() {
			var tree = createTree(),
				expected = {
					'foo/index.js': TREE[ 'foo' ][ 'index.js' ],
					'README.md': TREE[ 'README.md' ]
				},
				matches;

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			matches = tree.search( null, /bar/ );

			expect( matches ).to.be.an( 'object' );
			assert.deepEqual( matches, expected );
		});

		it( 'should search using both an include and an exclude filter', function test() {
			var tree = createTree(),
				expected = {
					'foo/index.js': TREE[ 'foo' ][ 'index.js' ]
				},
				matches;

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			matches = tree.search( /foo/, /bar/ );

			expect( matches ).to.be.an( 'object' );
			assert.deepEqual( matches, expected );
		});

		it( 'should return an empty object if no matches are found', function test() {
			var tree = createTree(),
				expected = {},
				matches;

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			matches = tree.search( /baz/, /bar/ );

			expect( matches ).to.be.an( 'object' );
			assert.deepEqual( matches, expected );
		});

	}); // end TESTS search

	describe( 'read', function tests() {

		it( 'should provide a method to read in tree leaves (files)', function test() {
			var tree = createTree();
			expect( tree.read ).to.be.a( 'function' );
		});

		it( 'should require a callback', function test() {
			var tree = createTree();

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			expect( foo ).to.throw( Error );

			function foo() {
				tree.read();
			}
		});

		it( 'should ensure that the callback is a function', function test() {
			var tree = createTree(),
				values = [
					'5',
					5,
					[],
					{},
					true,
					null,
					undefined,
					NaN
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue1( values[i] ) ).to.throw( TypeError );
				expect( badValue2( values[i] ) ).to.throw( TypeError );
			}

			function badValue1( value ) {
				return function() {
					tree.read( value );
				};
			}

			function badValue2( value ) {
				return function() {
					tree.read( {}, value );
				};
			}

		});

		it( 'should not allow a non-regexp filter', function test() {
			var tree = createTree(),
				values = [
					'5',
					5,
					[],
					{},
					true,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badInclude( values[i] ) ).to.throw( TypeError );
				expect( badExclude( values[i] ) ).to.throw( TypeError );
			}

			function badInclude( value ) {
				return function() {
					tree.read({
						'include': value
					}, function(){} );
				};
			}
			function badExclude( value ) {
				return function() {
					tree.read({
						'exclude': value
					}, function(){} );
				};
			}
		});

		it( 'should not allow a non-string encoding', function test() {
			var tree = createTree(),
				values = [
					5,
					[],
					{},
					true,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					tree.read({
						'encoding': value
					}, function(){} );
				};
			}
		});

		it( 'should not allow a non-boolean concatentation flag', function test() {
			var tree = createTree(),
				values = [
					5,
					[],
					{},
					'5',
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					tree.read({
						'concat': value
					}, function(){} );
				};
			}
		});

		it( 'should return null if no found matches', function test( done ) {
			var tree = createTree();

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create()
				.read({
					'include': /baz/,
					'exclude': /bar/
				}, onRead );

			function onRead( content ) {
				assert.isNull( content );
				done();
			}
		});

		it( 'should throw an error if any errors are encountered when reading file content' );

		it( 'should return file content', function test( done ) {
			var tree = createTree(),
				expected = {},
				foo,
				bar;

			bar = path.join( __dirname, 'test_dir/foo/bar/text/bar.txt' );
			foo = path.join( __dirname, 'test_dir/foo/bar/text/foo.txt' );

			expected[ bar ] = 'Hello.';
			expected[ foo ] = 'Beep.';

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create()
				.read({
					'include': /.+\.txt/
				}, onRead );

			function onRead( error, content ) {
				if ( error ) {
					assert.notOk( true );
					done();
					return;
				}
				assert.deepEqual( content, expected );
				done();
			}
		});

		it( 'should return concatentated file content', function test( done ) {
			var tree = createTree(),
				styles1,
				styles2;

			styles1 = /\.beep{width:100%;height:100%;}/;
			styles2 = /\.boop{width:50%;height:50%;}/;

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create()
				.read({
					'include': /.+\.css/,
					'concat': true
				}, onRead );

			function onRead( error, content ) {
				if ( error ) {
					assert.notOk( true );
					done();
					return;
				}
				expect( content ).to.be.a( 'string' );
				assert.ok( styles1.test( content ) );
				assert.ok( styles2.test( content ) );
				done();
			}
		});

	}); // end TESTS read

	describe( 'toJSON', function tests() {

		it( 'should provide a method to serialize a directory tree as JSON', function test() {
			var tree = createTree();
			expect( tree.toJSON ).to.be.a( 'function' );
		});

		it( 'should serialize a directory tree as JSON', function test() {
			var tree = createTree();

			tree
				.root( path.join( __dirname, 'test_dir' ) )
				.create();

			assert.deepEqual( tree.toJSON(), TREE );
		});

	}); // end TESTS toJSON

});
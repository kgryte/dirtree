
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	createTree = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'tree', function tests() {
	'use strict';

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
			expect( tree.create ).to.throw( Error );
		});

	}); // end TESTS create

	describe( 'leaves', function tests() {

		it( 'should provide a method to list all tree leaves (files)', function test() {
			var tree = createTree();
			expect( tree.leaves ).to.be.a( 'function' );
		});

	}); // end TESTS leaves

	describe( 'search', function tests() {

		it( 'should provide a method to search a directory tree', function test() {
			var tree = createTree();
			expect( tree.search ).to.be.a( 'function' );
		});

		it( 'should require a filter', function test() {
			var tree = createTree();
			expect( tree.search ).to.throw( Error );
		});

		it( 'should require either an inclusion or exclusion filter or both', function test() {
			var tree = createTree();
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

		it( 'should search' );

	}); // end TESTS search

	describe( 'read', function tests() {

		it( 'should provide a method to read in tree leaves (files)', function test() {
			var tree = createTree();
			expect( tree.read ).to.be.a( 'function' );
		});

		it( 'should require a callback', function test() {
			var tree = createTree();
			expect( tree.read ).to.throw( Error );
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

		it( 'should return null if no found matches' );

		it( 'should read' );

	}); // end TESTS read

	describe( 'toJSON', function tests() {

		it( 'should provide a method to serialize a directory tree as JSON', function test() {
			var tree = createTree();
			expect( tree.toJSON ).to.be.a( 'function' );
		});

		it( 'should serialize a directory tree' );

	}); // end TESTS toJSON

});
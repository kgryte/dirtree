
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
		
	});

});
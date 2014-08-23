
/**
* FUNCTION: beep( boop )
*	Beeping and booping.
*
* @param {String} boop
*/
function beep( boop ) {
	if ( typeof boop !== 'string' ) {
		throw new TypeError( 'beep()::invalid input argument. Boop must be a string.' );
	}
	console.log( boop );
} // end FUNCTION beep()


// EXPORTS //

module.exports = beep;
Tree
====

> Does something.


## Installation

``` bash
$ npm install
```


## Usage


## Examples 

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Notes

This module currently only supports directories and files. __No__ support for symlinks, devices, FIFO, or sockets.


---
## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ open reports/coverage/lcov-report/index.html
```


---
## Prior Art

Event-emitters:

* 	[findit](https://github.com/substack/node-findit)
*	[walker](https://github.com/daaku/nodejs-walker)
*	[walkdir](https://github.com/soldair/node-walkdir)
* 	[walk](https://github.com/coolaj86/node-walk)
* 	[filewalker](https://github.com/oleics/node-filewalker).

Filesystem:

* 	[fs-walk](https://github.com/confcompass/fs-walk).
* 	[jsondir](https://github.com/dwieeb/node-jsondir).


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/{{}}.svg
[npm-url]: https://npmjs.org/package/{{}}

[travis-image]: http://img.shields.io/travis/kgryte/{{}}/master.svg
[travis-url]: https://travis-ci.org/kgryte/{{}}

[coveralls-image]: https://img.shields.io/coveralls/kgryte/{{}}/master.svg
[coveralls-url]: https://coveralls.io/r/kgryte/{{}}?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/{{}}.svg
[dependencies-url]: https://david-dm.org/kgryte/{{}}

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/{{}}.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/{{}}

[github-issues-image]: http://img.shields.io/github/issues/kgryte/{{}}.svg
[github-issues-url]: https://github.com/kgryte/{{}}/issues
'use strict';

var assert = require('assert'),
	path = require('path'),
	gutil = require('gulp-util'),
	testExample = require('./test-example')(),
	content = testExample.createContents(),
	fcount = require('./../index');

describe('Should handle file contents', function (cb) {
	var stream = fcount();

	stream.write(new gutil.File({
		path: path.join(__dirname, 'fixture.js'),
		contents: new Buffer(content.file)
	}));

	stream.end();

	it('Should set line25 results', function () {
		stream.on('finish', function () {
			assert.strictEqual(stream.result.line25, content.result.line25);
		});
	});

	it('Should set line50 results', function () {
		stream.on('finish', function () {
			assert.strictEqual(stream.result.line50, content.result.line50);
		});
	});

	it('Should set line75 results', function () {
		stream.on('finish', function () {
			assert.strictEqual(stream.result.line75, content.result.line75);
		});
	});

	it('Should set line76 results', function () {
		stream.on('finish', function () {
			assert.strictEqual(stream.result.line75, content.result.line75);
			cb();
		});
	});
});

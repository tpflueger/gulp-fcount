'use strict';

var assert = require('assert'),
	path = require('path'),
	gutil = require('gulp-util'),
	testExample = require('./test-example')(),
	content = testExample.createContents(),
	fcount = require('./../index'),
    File = require('vinyl'),
    sinon = require('sinon');

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

describe('NEW - Should handle file contents', function() {
    function fakeFile(contents) {
        return new File({
            path: __dirname,
            contents: new Buffer(contents)
        });
    }

    function processFile(contents, cb) {
        var file = fakeFile(contents);
        plugin.write(file);
        plugin.end();
        plugin.on('finish', cb);
    }
    
    var plugin = fcount();
    
    beforeEach(function() {
        String.prototype.contains = function(substring) {
            return this.indexOf(substring) != -1;
        };
        gutil.log = sinon.spy();
    });
    
    it('Should count single-line functions', function(done) {
        var fileContents = [
                'function inline() { }',
                'function inline() { }'
            ].join('\n');
        
        processFile(fileContents, function() {
            var output = gutil.log.getCall(1).args[0];
            assert(output.contains('Function Count: 2'));
            done();
        });
    });
});

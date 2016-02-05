'use strict';

var assert = require('assert'),
	gutil = require('gulp-util'),
	fcount = require('./../index'),
    File = require('vinyl'),
    sinon = require('sinon'),
    _ = require('lodash'),
    stream;

function fakeFile(contents) {
    return new File({
        path: __dirname,
        contents: new Buffer(contents)
    });
}

function processFile(contents, cb) {
    var file = fakeFile(contents);
    stream.write(file);
    stream.end();
    stream.on('finish', cb);
}

function genFunc(lineCount) {
    var linesStr = lineCount ? _.repeat('\n', lineCount + 1) : '',
        funcStr = '';
    
    switch (Math.floor(Math.random() * 2)) {
        case 0: funcStr = 'function name() {' + linesStr + '}'; break;
        case 1: funcStr = 'function() {' + linesStr + '}'; break;
    }
    return funcStr;
}

describe('fcount', function() {        
    beforeEach(function() {
        stream  = fcount();
        gutil.log = sinon.spy();
        String.prototype.contains = function(substring) {
            return this.indexOf(substring) != -1;
        };
    });
    
    describe('When given file', function() {
        var fileContents;
        
        beforeEach(function() {
            fileContents = [
                genFunc(76),
                genFunc(51), genFunc(75),
                genFunc(26), genFunc(50), genFunc(49),
                genFunc(1), genFunc(25), genFunc(24), genFunc(23)
            ].join('\n');
        });
        
        it('Should count number of functions', function(done) {
            processFile(fileContents, function() {
                var output = gutil.log.args[1][0];
                assert(output.contains('Function Count: 8'));
            });
            done();
        });
        
        it('Should count and categorize function lengths', function(done) {
            processFile(fileContents, function() {
                var output = {
                    lines76: gutil.log.args[2][0],
                    lines75: gutil.log.args[3][0],
                    lines50: gutil.log.args[4][0],
                    lines25: gutil.log.args[5][0]
                };
                assert(output.lines76.contains('76+ lines: 10%'));
                assert(output.lines75.contains('51 - 75  lines: 20%'));
                assert(output.lines50.contains('26 - 50  lines: 30%'));
                assert(output.lines25.contains('1 - 25  lines: 40%'));
                done();
            });
        });
    });
    
    describe('When passed file with inline functions', function() {
        var fileContents;
        
        beforeEach(function() {
            fileContents = [
                genFunc(),
                genFunc()
            ].join('\n');
        });

        it('Should count number of functions', function(done) {
            processFile(fileContents, function() {
                var output = gutil.log.args[1][0];
                assert(output.contains('Function Count: 2'));
                done();
            });
        });
        
        it('Should categorize function lengths as one', function(done) {
            processFile(fileContents, function() {
                var output = gutil.log.args[5][0];
                assert(output.contains('1 - 25  lines: 100%'));
                done();
            });
        });
    });
});

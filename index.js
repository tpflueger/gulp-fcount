'use strict';
var through = require('through2'),
    chalk = require('chalk'),
    gutil = require('gulp-util'),
    fs = require('fs');

module.exports = function (opts) {
    var completedArray  = [];
    opts = opts || {};


    return through.obj(transform, finishCount);

    function transform(file, enc, cb) {
        var fileArray = [];

        if(file.isNull()) {
            return cb(null, file);
        }
        var fileContent = file.contents.toString('ascii').split('\n');

        fileContent.forEach(function (line, i) {
            if(line.match(/function(.)*?\((.)*?\)\s*\{\s*$/)) {
                incrementLineCount();
                fileArray.push(new FunctionClass(file.base, ++i, getFunctionSignature(line), 0, file.relative));
                return;
            } else if(line.match(/function(.)*?\((.)*?\)\s*\{(.)*?\}\s*$/)) {
                incrementLineCount();
                completedArray.push(new FunctionClass(file.base,i, getFunctionSignature(line), 1, file.relative));
            } else {
                checkLineCharacters(line, i);
                incrementLineCount();
            }
        });

        cb(null, file);

        function getFunctionSignature(line) {
            return line.match(/function(.)*?\((.)*?\)/)[0];
        }

        function checkLineCharacters(line, i) {
            for(var a = 0; a < line.length; a++) {
                if(line.charAt(a).match(/{/)) {
                    fileArray.push('{');
                } else if(line.charAt(a).match(/}/)) {
                    popArray(i);
                }
            }
        }

        function popArray(i) {
            var element = fileArray.pop();
            if(element instanceof FunctionClass) {
                element.end = ++i;
                completedArray.push(element);
            }
        }

        function incrementLineCount() {
            fileArray.forEach(function (item) {
                if(item === '{') { return;}
                item.count++;
            });
        }
    }

    function finishCount(cb) {
        var result = calculateResults(),
            converter = new PercentConverter(result.total),
            lines = [
                chalk.underline.bold.magenta('Total Function Sizes'),
                chalk.blue('Function Count:', result.total),
                chalk.red('\t76+ lines:', converter.percent(result.line76)),
                chalk.yellow('51 - 75  lines:', converter.percent(result.line75)),
                chalk.blue('26 - 50  lines:', converter.percent(result.line50)),
                chalk.green(' 1 - 25  lines:', converter.percent(result.line25))
            ];

        lines.forEach(function(line) { gutil.log(line); });
        cb();
    }

    function calculateResults() {
        var result = {
            line25: 0,
            line50: 0,
            line75: 0,
            line76: 0,
            total: 0
        };

        completedArray.forEach(function(item) {
            if(item.count <= 25) {
                result.line25++;
            } else if(item.count <= 50) {
                result.line50++;
            } else if(item.count <= 75) {
                result.line75++;
            } else {
                result.line76++;
            }
            result.total++;

            if(opts.showFunctions) {
                gutil.log([item.path, '(', item.lineStart, ')','\t', item.functionSig, '\t\t', item.count, ' lines'].join(''));
            }
        });

        return result;
    }

    function PercentConverter(total) {
        var _total = total,
            obj = this;

        obj.percent = function(fraction) {
            var percent = Math.round((fraction / _total) * 100);
            return percent < 10 ? '0' + percent + '%' : percent + '%';
        };
    }

    function FunctionClass(base, lineStart, functionSig, count, fileName) {
        this.path = base + fileName;
        this.lineStart = lineStart;
        this.functionSig = functionSig;
        this.count = count;
        this.fileName = fileName;
    }
};

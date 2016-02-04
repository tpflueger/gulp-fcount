'use strict';
var through = require('through2'),
	chalk = require('chalk'),
	gutil = require('gulp-util'),
	fs = require('fs');

module.exports = function () {
	var completedArray  = [];

	return through.obj(transform, finishCount);

	function transform(file, enc, cb) {
		var fileArray = [];

		if(file.isNull()) {
			return cb(null, file);
		}
		var fileContent = file.contents.toString('ascii').split('\n');

		fileContent.forEach(function (line, i) {
			if(line.match(/function\s?\w*\((.)*\)/)) {
				incrementLineCount();
				fileArray.push(new FunctionClass(++i, getFunctionName(line), 0, file.relative));
				return;
			}

			checkLineCharacters(line, i);

			incrementLineCount();
		});

		cb(null, file);

		function getFunctionName(line) {
			var functionName = line.match(/function\s?(\w+)/);
			return functionName !== null ? functionName[1] : 'anonymous';
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
		var result = calculateResults();
        
        gutil.log(chalk.underline.bold.magenta('Total Function Sizes'));
		gutil.log(chalk.blue('Function Count:', result.total));
		gutil.log(chalk.red('\t76+ lines:', convertToPercentage(result.line76, result.total)));
		gutil.log(chalk.yellow('51 - 75  lines:', convertToPercentage(result.line75, result.total)));
		gutil.log(chalk.blue('26 - 50  lines:', convertToPercentage(result.line50, result.total)));
		gutil.log(chalk.green(' 1 - 25  lines:', convertToPercentage(result.line25, result.total)));
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
		});

		return result;
	}

	function convertToPercentage(number, total) {
		var result = Math.round((number / total) * 100);
		return result < 10 ? '0' + result  + '%' : result + '%';
	}

	function FunctionClass(lineStart, name, count, fileName) {
		this.lineStart = lineStart;
		this.name = name;
		this.count = count;
		this.fileName = fileName;
	}
};

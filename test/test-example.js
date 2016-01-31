module.exports = function () {
	var result = {
			line25: 0,
			line50: 0,
			line75: 0,
			line76: 0,
			total: 0
		};

	function createContents() {
		var file = '',
			count = generateNumber(1000, 5000);

		for(var i = 0; i < count; i++) {
			var line = generateNumber(1, 5),
				lineCount = getLineCount(line);

			file = file + createFunction(lineCount);

			if((lineCount - 1) <= 25) {
				result.line25++;
			} else if((lineCount - 1) >= 26 && (lineCount - 1) <= 50) {
				result.line50++;
			} else if ((lineCount - 1) >= 51 && (lineCount - 1) <= 75) {
				result.line75++;
			} else if((lineCount - 1) >= 76){
				result.line76++;
			}
			result.total++;
		}
		return {
			file: file,
			result: result
		};
	}

	function createFunction(numOfLines) {
		var functionString = 'function ' + Math.random().toString(36).slice(-5) + '() {';
		for(var i = 0; i < numOfLines; i++) {
            functionString = functionString + '\n';
		}
		functionString = functionString + '}\n';

		return functionString;
	}

	function getLineCount(value) {
		var lineNum = 0;
		switch(value) {
			case 1:
				lineNum = generateNumber(2, 25);
				break;
			case 2:
				lineNum = generateNumber(25, 50);
				break;
			case 3:
				lineNum = generateNumber(50, 75);
				break;
			default:
				lineNum = generateNumber(76, 1000);
				break;
		}

		return lineNum;
	}

	function generateNumber(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	return {
		createContents: createContents
	};
};

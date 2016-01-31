# gulp-fcount [![Build Status](https://travis-ci.org/tpflueger/gulp-fcount.svg?branch=master)](https://travis-ci.org/tpflueger/gulp-fcount)

> Display percent breakdown of project function line count

<img src="https://raw.githubusercontent.com/tpflueger/gulp-fcount/master/screenshot.png" width="350">

Logs out percentage of function sizes by line count.

## Install

Install package with NPM and add it to your development dependencies:

```
$ npm install --save-dev gulp-fcount
```

## Usage

```js
var fcount = require('gulp-fcount');

gulp.task('scripts', function () {
	return gulp.src('./app/*.js')
		.pipe(fcount())
		.pipe(gulp.dest('./dist/'));
});
```
## License

MIT © Tyler Pflueger

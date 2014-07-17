(PLUGIN AUTHOR: Please read [Plugin README conventions](https://github.com/wearefractal/gulp/wiki/Plugin-README-Conventions), then delete this line)

# gulp-aster
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

> [aster](https://github.com/asterjs/aster) binding for [gulp](https://github.com/wearefractal/gulp)

This is plugin that allows to integrate code building with aster into gulp's pipeline. This allows you to use aster plugins for easy, proper, source maps-oriented code transformations right in your gulpfiles so all the other tasks like image processing, CSS building, serving files with livereload etc. are done by gulp plugins.

## Usage

First, install `gulp-aster` as a development dependency:

```shell
npm install --save-dev gulp-aster
```

Then, add it to your `gulpfile.js`:

```javascript
var aster = require("gulp-aster");
var equery = require("aster-equery");

gulp.src("./src/*.ext")
	.pipe(aster(function (src) {
		return src.map(equery({
			'if ($cond) { return $yes } else { return $no }': 'return <%= cond %> ? <%= yes %> : <%= no %>'
		}));
	}))
	.pipe(gulp.dest("./dist"));
```

## API

### aster(asterTransform)

#### asterTransform
Type: `Function`

Aster code building pipeline.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-aster
[npm-image]: https://badge.fury.io/js/gulp-aster.png

[travis-url]: http://travis-ci.org/asterjs/gulp-aster
[travis-image]: https://secure.travis-ci.org/asterjs/gulp-aster.png?branch=master

[coveralls-url]: https://coveralls.io/r/asterjs/gulp-aster
[coveralls-image]: https://coveralls.io/repos/asterjs/gulp-aster/badge.png

[depstat-url]: https://david-dm.org/asterjs/gulp-aster
[depstat-image]: https://david-dm.org/asterjs/gulp-aster.png

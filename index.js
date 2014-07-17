var gutil = require('gulp-util'),
	parse = require('aster-parse')(),
	sourceMapToAst = require('sourcemap-to-ast'),
	generate = require('escodegen').generate,
	Rx = require('rx'),
	ObservableStream = require('./ObservableStream');

module.exports = function (asterTransform) {
	'use strict';

	return new ObservableStream(function (observable) {
		var files = observable.map(function (file) {
			if (file.isNull()) {
				return {
					path: file.relative,
					contents: ''
				};
			}

			if (file.isStream()) {
				throw new gutil.PluginError('gulp-aster', 'Stream content is not supported');
			}

			if (file.isBuffer()) {
				return {
					path: file.relative,
					contents: String(file.contents)
				};
			}
		});

		files = parse(files).zip(observable.pluck('sourceMap'), function (file, sourceMap) {
			if (sourceMap) {
				sourceMapToAst(file.program, sourceMap);
			}

			return file;
		});

		files = asterTransform(Rx.Observable.return(files)).single().concatAll();

		files = files.map(function (file) {
			var output = generate(file.program, {
				sourceMap: true,
				sourceMapWithCode: true
			});

			file = new gutil.File({
				path: file.path,
				contents: new Buffer(output.code)
			});

			file.sourceMap = JSON.parse(output.map.toString());

			return file;
		});

		return files;
	});
};

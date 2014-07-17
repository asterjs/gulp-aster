/*global describe, it*/
'use strict';

var fs = require('fs'),
	es = require('event-stream'),
	should = require('should'),
	equery = require('aster-equery');

require('mocha');

delete require.cache[require.resolve('../')];

var gutil = require('gulp-util'),
	aster = require('../');

describe('gulp-aster', function () {

	var expectedFile = new gutil.File({
		path: 'test/expected/hello.js',
		cwd: 'test/',
		base: 'test/expected',
		contents: fs.readFileSync('test/expected/hello.js')
	});

	it('should produce expected file via buffer', function (done) {

		var srcFile = new gutil.File({
			path: 'test/fixtures/hello.js',
			cwd: 'test/',
			base: 'test/fixtures',
			contents: fs.readFileSync('test/fixtures/hello.js')
		});

		var stream = aster(function (src) {
			return src.map(equery({
				'if ($cond) { return $yes } else { return $no }': 'return <%= cond %> ? <%= yes %> : <%= no %>'
			}));
		});

		stream.on('error', function(err) {
			should.exist(err);
			done(err);
		});

		stream.on('data', function (newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);

			String(newFile.contents).should.equal(String(expectedFile.contents));
			done();
		});

		stream.write(srcFile);
		stream.end();
	});

	it('should error on stream', function (done) {

		var srcFile = new gutil.File({
			path: 'test/fixtures/hello.js',
			cwd: 'test/',
			base: 'test/fixtures',
			contents: fs.createReadStream('test/fixtures/hello.js')
		});

		var stream = aster(function (src) {
			return src.map(equery({
				'if ($cond) { return $yes } else { return $no }': 'return <%= cond %> ? <%= yes %> : <%= no %>',
				'console.__(_$)': ''
			}));
		});

		stream.on('error', function(err) {
			should.exist(err);
			done();
		});

		stream.on('data', function (newFile) {
			newFile.contents.pipe(es.wait(function(err, data) {
				done(err);
			}));
		});

		stream.write(srcFile);
		stream.end();
	});
});

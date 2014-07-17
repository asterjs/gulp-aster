var Duplex = require('stream').Duplex;
var Readable = require('stream').Readable;
var Rx = require('rx');
var util = require('util');
var gutil = require('gulp-util');

function ObservableStream(transform) {
	Duplex.call(this, {objectMode: true});

	this.subject = new Rx.Subject();
	this.observable = transform(this.subject);
	this.subscription = null;
}

util.inherits(ObservableStream, Duplex);

ObservableStream.prototype._read = function () {
	if (this.subscription) {
		return;
	}

	this.subscription = this.observable.subscribe(
		this.push.bind(this),
		this.emit.bind(this, 'error'),
		this.push.bind(this, null)
	);
};

ObservableStream.prototype._write = function (value, enc, callback) {
	this.subject.onNext(value);
	callback();
};

ObservableStream.prototype.end = function () {
	this.subject.onCompleted();
	this.subject.dispose();
};

module.exports = ObservableStream;
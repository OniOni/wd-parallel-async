var 
wd = require('wd'),
events = require('events');

var emitter = new events.EventEmitter();

var parallelizer = {
    run: function (desired, test) {
	var _this = this;
	for (var i in desired) {
	    test(wd.remote(_this.wd_args), desired[i]);
	}
    }
};

exports.parallelizer = function (wd_args) {
    return Object.create(
	parallelizer,
	{wd_args: {value: wd_args}}
    );
};
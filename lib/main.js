var 
wd = require('wd'),
events = require('events');

var emitter = new events.EventEmitter();

var parallizer = {
    run: function (desired, test) {
	var _this = this;
	for (var i in desired) {
	    test(wd.remote(_this.wd_args), desired[i]);
	}
    },

    done: function () {
    }
};

exports.parallizer = function (wd_args) {
    return Object.create(
	parallizer,
	{wd_args: {value: wd_args}}
    );
};
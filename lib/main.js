var wd = require('wd')
  , events = require('events')
  , util = require('util');

var pool = 5;

var parallelizer = function () {
  this.wd_args = [].slice.call(arguments, 0);
  events.EventEmitter.call(this);
};

util.inherits(parallelizer, events.EventEmitter);

parallelizer.prototype.run = function (desired, test) {
  var _this = this
    , max = (desired.length < pool ? desired.length : pool)
    , running = max;

  var runNextJob = function() {
    var driver = wd.remote.apply(wd, _this.wd_args);
    driver.on('status', function(info) {
      if (info.indexOf("Ending") != -1) {
        runNextJob();
      }
    });

    var caps = desired.pop();
    if (caps != null) {
      test(driver, caps);
    } else if (--running <= 0) {
        _this.emit('end');
    }
  };

  for (var i = 0; i < max; i++) {
    runNextJob();
  }
};

exports.parallelizer = function (wd_args) {
  return new parallelizer(wd_args);
};

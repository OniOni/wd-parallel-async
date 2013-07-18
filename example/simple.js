var wd = require("../lib/main")
  , assert = require("assert")
  , sauce = require("saucelabs")
  , csv = require("csv")
  , events = require("events");

var username = process.env.SAUCE_USERNAME
  , password = process.env.SAUCE_ACCESS_KEY
  , parallelizer = wd.parallelizer({
    host: "ondemand.saucelabs.com", 
    port: 80, 
    username: username, 
    password: password
  })
  , rest = new sauce({
    username: username,
    password: password
  }) 

var mark = function(jobId, status, cb) {
  rest.updateJob(jobId, {passed: status}, cb);
}

var testSite = function(url) {
 
  var testName = "sc4 " + url;
  parallelizer.run([
    {browserName:'firefox', tags: ["sc4", "https"], name: testName, platform: "LINUX"},
    {browserName:'chrome', tags: ["sc4", "https"], name: testName, platform: "LINUX"},
    {browserName:'firefox', tags: ["sc4", "https"], name: testName, platform: "MAC"},
    {browserName:'chrome', tags: ["sc4", "https"], name: testName, platform: "MAC"},
    {browserName:'opera', tags: ["sc4", "https"], name: testName, platform: "LINUX", version: '12'}
  ], function(driver, desired) {
    
    driver.on('status', function(info){
      console.log('\x1b[36m%s\x1b[0m', info);
    });
    
    driver.on('command', function(meth, path){
      console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
    });

    driver.on('error', function(err) {
      console.log("Errored!");
      console.log(err);
    });

    driver.init(desired, function() {
      var jobId = driver.sessionID;
      console.log(driver.sessionID);
      driver.get(url, function(err) {
        driver.title(function(err, title) {
          mark(jobId, (err == null), function () {
            driver.quit();
          });
        });
      });
    });
  });
}

if (process.argv.length > 2) {
  testSitesCount = process.argv[2];
} else {
  testSitesCount = 4;
}

csv()
.from.path(__dirname + "/top-1m.csv")
.to.array(function(data, count) {
  var websites = data.slice(0, testSitesCount);
  var run = function () {
    var w = websites.pop();
    if (w != null) {
      console.log(w);
      testSite("https://"+w[1]);
    }
  }

  parallelizer.on('end', function() {
    run();
  });
  
  run();
});





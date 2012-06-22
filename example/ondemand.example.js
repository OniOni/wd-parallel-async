var webdriver = require('../lib/main')
  , assert = require('assert');

// CONFIGURE SAUCE CREDENTIALS HERE
var username = "your-sauce-username",
accessKey = "your-sauce-acces-key";

var parallelizer = webdriver.parallelizer({
    host: "ondemand.saucelabs.com", 
    port: 80, 
    username: username,
    accessKey: accessKey
});

parallelizer.run([
    {browserName:'chrome', tags: ["examples"], name: "wd parallel async 1/4"},
    {browserName:'firefox', tags: ["examples"], name: "wd parallel async 2/4"},
    {browserName:'firefox', tags: ["examples"], name: "wd parallel async 3/4", platform: "LINUX"},
    {browserName:'firefox', tags: ["examples"], name: "wd parallel async 4/4", platform: "LINUX"}
], function(browser, desired) {

    browser.on('status', function(info){
	console.log('\x1b[36m%s\x1b[0m', info);
    });
    
    browser.on('command', function(meth, path){
	console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
    });
    
    browser.init(desired, function() {
	browser.get("http://saucelabs.com/test/guinea-pig", function() {
	    browser.title(function(err, title) {
		assert.ok(~title.indexOf('I am a page title - Sauce Labs'), 'Wrong title!');
		browser.elementById('submit', function(err, el) {
		    browser.clickElement(el, function() {
			browser.eval("window.location.href", function(err, title) {
			    assert.ok(~title.indexOf('#'), 'Wrong title!');
  			    browser.quit()
			})
		    })
		})
	    })
	})
    })
});

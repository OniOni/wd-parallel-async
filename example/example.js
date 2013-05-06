var webdriver = require('../lib/main'),
    assert = require('assert'),
    path = require('path');

var parallelizer = webdriver.parallelizer();

parallelizer.run([{ 
    browserName:'chrome',
    tags: ["examples"],
    name: "This is an example test"
},{
    browserName:'firefox',
    tags: ["examples"],
    name: "This is an example test"
}], function(browser, desired) {

    browser.on('status', function(info){
	console.log('\x1b[36m%s\x1b[0m', info);
    });
    
    browser.on('command', function(meth, path){
	console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
    });
    
    browser.init(desired, function() {
	var test_page = "file://" + path.resolve(__dirname, "test.html");
	browser.get(test_page, function() {
	    browser.title(function(err, title) {
		assert.ok(~title.indexOf('I am a page title'), 'Wrong title! ' + title);
		browser.elementById('click_me', function(err, el) {
		    el.click(function() {
			browser.elementById("target", function(err, target) {
			    target.text(function(err, text) {
				assert.equal(text, "Heya !!!");
				browser.quit();
			    });
			});
		    });
		});
	    });
	});
    });
});

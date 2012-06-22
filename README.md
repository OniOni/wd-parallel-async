# Run your WD.js driven tests in multiple browsers, at the same time ! 

## Update node to latest

http://nodejs.org/#download

## Install

```shell
npm install wd-parallel-async
```

## Authors

  - Mathieu Sabourin ([OniOni](http://github.com/OniOni))
  
## License

  * License - Apache 2: http://www.apache.org/licenses/LICENSE-2.0

## Writing a test!

Start by importing the required libraries.

```javascript
var webdriver = require('wd-parallel-async')
  , assert = require('assert');
```

Then create the parallelizer.

```javascript
var parallelizer = webdriver.parallelizer();
```

You can go ahead and call ```parallelizer.run(desired, test)```. 
Here is an example with chrome and firefox.
In your test function write your test as if you were writting it with [WD.js](https://github.com/admc/wd).

```javascript
parallelizer.run([{ 
    browserName:'chrome',
    tags: ["examples"],
    name: "This is an example test",
},{
    browserName:'firefox',
    tags: ["examples"],
    name: "This is an example test",
}], function(browser, desired) {

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

```

## Supported Methods
All tests are run with WD.js check the [docs](https://github.com/admc/wd) for information about available methods.

### Full JsonWireProtocol mapping:

[full mapping](https://github.com/sebv/wd/blob/master/doc/jsonwiremap-all.md)

## More docs!
<pre>
WD is simply implementing the Selenium JsonWireProtocol, for more details see the official docs:
 - <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol">http://code.google.com/p/selenium/wiki/JsonWireProtocol</a>
</pre>

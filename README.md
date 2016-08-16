# piwik-angular
An Angular Service implementation for the JavaScript async tracker of Piwik.
> This library was last tested with Piwik Version 2.16.2

## Installation
Via bower:
```
bower install piwik-angular --save
```

Or manually download the [piwik-angular.min.js file](https://github.com/carlomorgenstern/piwik-angular/blob/master/dist/piwik-angular.min.js) and include it in your index.html.

## Usage
First you have to include the piwik-angular module in your dependencies:
```javascript
var myApp = angular.module('myApp', ['piwik-angular']);
```

You can then use the 'PiwikTracker' service to setup the Piwik async tracker (this can be done only once, as the Async Tracker API only supports one instance).
This is equivalent to inserting the ['Piwik Tracking Code'](http://developer.piwik.org/guides/tracking-javascript-guide#finding-the-piwik-tracking-code) into your site (without initial tracking calls).
```javascript
myApp.controller('awesomeController', function(PiwikTracker) {

    PiwikTracker.setupPiwik(siteUrl, siteId);
    ...

})
```

After the setup, just use the 'PiwikTracker' service to make tracking configurations and calls. It supports the same methods like the ['Piwik JavaScript Tracking Client'](http://developer.piwik.org/api-reference/tracking-javascript).
```javascript
   ...
   PiwikTracker.trackPageView();
```

## Contributions
Feel free to raise any issues or submit pull requests with improvements and an appropriate test case.
As this was more of a side project, I might not have the time to reply in a timely manner.

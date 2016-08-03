(function(angular) {
    'use strict';

    var module = angular.module('piwik-angular', []);

    module.constant('PiwikActions', [
        // Tracker Object
        'trackEvent', 'trackPageView', 'trackSiteSearch', 'trackGoal', 'trackLink', 'trackAllContentImpressions', 'trackVisibleContentImpressions', 'trackContentImpressionsWithinNode', 'trackContentInteractionNode',
        'trackContentImpression', 'trackContentInteraction', 'logAllContentBlocksOnPage', 'enableLinkTracking', 'enableHeartBeatTimer',
        // Configuration of the Tracker Object
        'setDocumentTitle', 'setDomains', 'setCustomUrl', 'setReferrerUrl', 'setSiteId', 'setApiUrl', 'setTrackerUrl', 'setDownloadClasses', 'setDownloadExtensions', 'addDownloadExtensions', 'removeDownloadExtensions',
        'setIgnoreClasses', 'setLinkClasses', 'setLinkTrackingTimer', 'discardHashTag', 'setGenerationTimeMs', 'appendToTrackingUrl', 'setDoNotTrack', 'disableCookies', 'deleteCookies', 'killFrame', 'redirectFile',
        'setHeartBeatTimer', 'setUserId', 'setCustomVariable', 'deleteCustomVariable', 'storeCustomVariablesInCookie', 'setCustomDimension', 'deleteCustomDimension', 'setCampaignNameKey', 'setCampaignKeywordKey',
        'setConversionAttributionFirstReferrer',
        // Ecommerce
        'setEcommerceView', 'addEcommerceItem', 'trackEcommerceCartUpdate', 'trackEcommerceOrder',
        // Configuration of Tracking Cookies
        'setCookieNamePrefix', 'setCookieDomain', 'setCookiePath', 'setVisitorCookieTimeout', 'setReferralCookieTimeout', 'setSessionCookieTimeout',
        // Advanced uses
        'addListener', 'setRequestMethod', 'setCustomRequestProcessing', 'setRequestContentType',
        // Undocumented
        'setCustomData', 'setCountPreRendered', 'enableJSErrorTracking', 'disablePerformanceTracking'
    ]);

    module.constant('PiwikGets', [
        // Configuration of the Tracker Object
        'getVisitorId', 'getVisitorInfo', 'getAttributionInfo', 'getAttributionCampaignName', 'getAttributionCampaignKeyword', 'getAttributionReferrerTimestamp', 'getAttributionReferrerUrl',
        'getUserId', 'getCustomVariable', 'getCustomDimension',
        // Undocumented
        'getTrackerUrl', 'getSiteId', 'getRequest', 'getCustomData'
    ]);

    module.service('PiwikTracker', ['$q', '$window', 'PiwikActions', 'PiwikGets', function($q, $window, PiwikActions, PiwikGets) {
        /*jshint validthis: true */
        $window._paq = $window._paq || [];

        function addActionMethod(method, service) {
            service[method] = function() {
                var command = [method];
                for (var i = 0; i < arguments.length; i++) {
                    command.push(arguments[i]);
                }
                return $window._paq.push(command);
            };
        }

        function addGetMethod(method, service) {
            service[method] = function() {
                var deferred = $q.defer();
                var argumentArray = arguments;
                $window._paq.push(function() {
                    try {
                        return deferred.resolve(this[method].apply(this, argumentArray));
                    } catch (error) {
                        return deferred.reject(error);
                    }
                });
                return deferred.promise;
            };
        }

        var i;
        for (i = 0; i < PiwikActions.length; i++) {
            addActionMethod(PiwikActions[i], this);
        }

        for (i = 0; i < PiwikGets.length; i++) {
            addGetMethod(PiwikGets[i], this);
        }

        this.setupPiwik = (function() {
            var executed = false;
            return function(piwikUrl, siteId) {
                if (!executed) {
                    $window._paq.push(['setTrackerUrl', piwikUrl+'/piwik.php']);
                    $window._paq.push(['setSiteId', siteId]);
                    var script = angular.element('<script type="text/javascript" defer="" async="" src="' + piwikUrl +'/piwik.js"></script>');
                    angular.element(document.querySelector('head')).append(script);
                }
            };
        })();
    }]);
})(angular);

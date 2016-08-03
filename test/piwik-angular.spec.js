describe('PiwikActions', function() {
    var PiwikActions;

    beforeEach(angular.mock.module('piwik-angular'));
    beforeEach(angular.mock.inject(function(_PiwikActions_) {
        PiwikActions = _PiwikActions_;
    }));

    it('should be defined', function() {
        expect(PiwikActions).toBeDefined();
    });
});

describe('PiwikGets', function() {
    var PiwikGets;

    beforeEach(angular.mock.module('piwik-angular'));
    beforeEach(angular.mock.inject(function(_PiwikGets_) {
        PiwikGets = _PiwikGets_;
    }));

    it('should be defined', function() {
        expect(PiwikGets).toBeDefined();
    });
});

describe('PiwikTracker', function() {
    var PiwikTracker, PiwikActions, PiwikGets, qMock, windowMock;

    beforeEach(angular.mock.module('piwik-angular'));
    beforeEach(angular.mock.module(function($provide) {
        qMock = {};
        qMock.resolve = jasmine.createSpy('deferred.resolve');
        qMock.reject = jasmine.createSpy('deferred.reject');
        qMock.defer = function() {
          return {
            resolve: qMock.resolve,
            reject: qMock.reject,
            promise: 'pendingMock'
          };
        };
        spyOn(qMock, 'defer').and.callThrough();
        $provide.value('$q', qMock);

        windowMock = {};
        $provide.value('$window', windowMock);
    }));

    beforeEach(angular.mock.inject(function(_PiwikActions_, _PiwikGets_, _PiwikTracker_) {
        PiwikActions = _PiwikActions_;
        PiwikGets = _PiwikGets_;
        PiwikTracker = _PiwikTracker_;
    }));


    it('should create the async Piwik queue', function() {
        expect(windowMock._paq).toBeDefined();
        expect(windowMock._paq.length).toEqual(0);
    });

    it('should enqueue action commands', function() {
        PiwikTracker.setTrackerUrl('https://piwik.example.com');
        var queueEntry = windowMock._paq.pop();
        expect(queueEntry[0]).toEqual('setTrackerUrl');
        expect(queueEntry[1]).toEqual('https://piwik.example.com');
    });

    it('should resolve the promise from a get method with the correct value', function() {
        var getMethodMock = jasmine.createSpy('getVisitorId').and.returnValue(1);
        var MethodObjectMock = (function() {
            function MethodObject() {}
            MethodObject.prototype.getVisitorId = getMethodMock;
            return MethodObject;
        })();
        var promise = null;

        promise = PiwikTracker.getVisitorId();
        expect(qMock.defer).toHaveBeenCalled();
        expect(promise).toEqual('pendingMock');

        windowMock._paq.pop().apply(new MethodObjectMock());
        expect(getMethodMock).toHaveBeenCalled();
        expect(qMock.resolve).toHaveBeenCalledWith(1);
    });

    it('should reject error promises', function() {
        var getMethodMock = jasmine.createSpy('getVisitorId').and.throwError('error');
        var MethodObjectMock = (function() {
            function MethodObject() {}
            MethodObject.prototype.getVisitorId = getMethodMock;
            return MethodObject;
        })();
        var promise = null;

        promise = PiwikTracker.getVisitorId();
        expect(qMock.defer).toHaveBeenCalled();
        expect(promise).toEqual('pendingMock');

        windowMock._paq.pop().apply(new MethodObjectMock());
        expect(getMethodMock).toHaveBeenCalled();
        expect(qMock.reject).toHaveBeenCalledWith(new Error('error'));
    });

    it('should support all action methods', function() {
        for (var i = 0; i < PiwikActions.length; i++) {
            expect(typeof PiwikTracker[PiwikActions[i]]).toEqual('function');
        }
    });

    it('should support all get methods', function() {
        for (var i = 0; i < PiwikGets.length; i++) {
            expect(typeof PiwikTracker[PiwikGets[i]]).toEqual('function');
        }
    });
});

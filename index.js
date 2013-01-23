/*jslint node: true */

'use strict';

var Q = require('q');

var qelp = {};

/**
 * Returns a promise that with method `cancel` which stops the callbacks
 * from propagating.
 *
 * This is useful if you attach a promise callback to change UI elements,
 * but then the user decides they don't want to wait for the data to load,
 * and instead loads another object in that promise's place.
 *
 * @param {Promise} promise Promise to add ability to cancel
 * @return {Promise} promise Promise with `cancel({Boolean} allowSuccess, {Boolean} allowError)` method
 */
qelp.cancel = function (promise) {
    var defer = Q.defer(),
        cancel_success = false,
        cancel_error = false,
        key,
        p;

    promise.then(function () {
        if (!cancel_success) {
            defer.resolve.apply(defer, arguments);
        }
    }, function () {
        if (!cancel_error) {
            defer.reject.apply(defer, arguments);
        }
    });

    p = {};
    for (key in defer.promise) {
        p[key] = defer.promise[key];
    }

    p.cancel = function (allowSuccess, allowError) {
        cancel_success = cancel_success || !allowSuccess;
        cancel_error = cancel_error || !allowError;
    };

    return p;
};

/**
 * Tries to call the `fn` function multiple times in hopes that it will
 * resolve.  Calling an AJAX function may not resolve successfully the first
 * time due to network issues, so this function will retry calling it.
 * @param {Function} fn Function which creates a promise
 * @return {Promise} A promise to the data we're retrying to resolve
 */
qelp.retryFn = function (fn, timings) {
    timings = timings || [3500, 3500, 3500];
    return (function next() {
        var p = qelp.timeout(timings.unshift(), fn());
        if (timings.length) {
            return p.then(null, next);
        }
        return p;
    }());
};

module.exports = qelp;

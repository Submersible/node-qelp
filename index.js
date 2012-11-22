/*jslint node: true */

'use strict';

var qelp = {};

/**
 * Returns a promise that with method `cancel` which stops the callbacks
 * from propagating.
 *
 * This is useful if you attach a promise callback to change UI elements,
 * but then the user decides they don't want to wait for the data to load,
 * and instead loads another object in that promise's place.
 *
 * @param {$.Promise} promise Promise to add ability to cancel
 * @return {$.Promise} promise Promise with `cancel({Boolean} allowSuccess, {Boolean} allowError)` method
 */
qelp.cancelPromise = function (promise) {
    var deferred = $.Deferred(),
        cancel_success = false,
        cancel_error = false;

    promise.then(function () {
        if (!cancel_success) {
            deferred.resolve.apply(deferred, arguments);
        }
    }, function () {
        if (!cancel_error) {
            deferred.reject.apply(deferred, arguments);
        }
    });

    return $.extend(deferred.promise(), {
        /**
         * @param {Boolean} allowSuccess Allow success callback to fire
         * @param {Boolean} allowError Allow error callback to fire
         */
        cancel: function (allowSuccess, allowError) {
            cancel_success = !allowSuccess;
            cancel_error = !allowError;
        }
    });
};

/**
 * Tries to call the `fn` function multiple times in hopes that it will
 * resolve.  Calling an AJAX function may not resolve successfully the first
 * time due to network issues, so this function will retry calling it.
 * @param {Function} fn Function which creates a promise
 * @return {$.Promise} A promise to the data we're retrying to resolve
 */
qelp.retryPromiseFn = function (fn) {
    return qelp.timeoutPromise(3500, fn()).pipe(null, function () {
        /* Try a second time if the promise doesn't resolve after 3.5 seconds */
        return qelp.timeoutPromise(3500, fn());
    }).pipe(null, function () {
        /* Try a third time if the promise doesn't resolve after 3.5 seconds, total 7 s */
        return qelp.timeoutPromise(3500, fn());
    });
};

/**
 * Creates a promise that will *reject* a promise if it doesn't resolve after a
 * specified delay.  If no promise is supplied, it will *resolve* after the
 * delay.
 * @param {Number} timeout Delay in milliseconds
 * @param {$.Promise Optional} promise Promise to add the timeout to
 * @return {$.Promise} Promise with a `cancel()` method
 */
qelp.timeoutPromise = function (timeout, promise) {
    var deferred = $.Deferred(),
        timer = setTimeout(promise ? deferred.reject : deferred.resolve, timeout);

    if (promise) {
        promise.then(deferred.resolve, deferred.reject);
    }

    return $.extend(deferred.promise(), {
        cancel: function () {
            clearTimeout(timer);
        }
    });
};

module.exports = qelp;

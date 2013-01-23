# qelp—Q helpers [![Build Status](https://travis-ci.org/Submersible/node-qelp.png?branch=master)](https://travis-ci.org/Submersible/node-qelp)

## qelp.cancel(promise) -> promise

Returns a promise that with method `cancel` which stops the callbacks
from propagating.

This is useful if you attach a promise callback to change UI elements,
but then the user decides they don't want to wait for the data to load,
and instead loads another object in that promise's place.

### Parameters

* `promise` — Promise to add ability to cancel

### Returns

Promise with `cancel({Boolean} allowSuccess, {Boolean} allowError)` method

----------

## qelp.retryFn(fn, timings) -> promise

Tries to call the `fn` function multiple times in hopes that it will
resolve.  Calling an AJAX function may not resolve successfully the first
time due to network issues, so this function will retry calling it.

### Parameters

* `fn` — Function which creates a promise

### Returns

A promise to the data we're retrying to resolve.

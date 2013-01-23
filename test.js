/*jslint node: true, vars: true */

'use strict';

var Q = require('q'),
    test = require('tap').test,
    qelp = require('./');

test('not cancelled', function (t) {
    t.plan(1);
    var d = Q.defer();

    var c = qelp.cancel(d.promise);

    c.then(function (data) {
        t.equal(data, 'meow', 'promise fired!');
    }).fail(function (data) {
        t.ok(false, 'woops');
    });

    d.resolve('meow');
});

test('cancelled', function (t) {
    var d = Q.defer();

    var c = qelp.cancel(d.promise);

    c.then(function (data) {
        t.ok(false, 'woops');
    }).fail(function (data) {
        t.ok(false, 'woops');
    });

    c.cancel();

    d.resolve('meow');

    setTimeout(function () {
        t.end();
    }, 100);
});

test('not cancelled error', function (t) {
    t.plan(1);
    var d = Q.defer();

    var c = qelp.cancel(d.promise);

    c.then(function (data) {
        t.ok(false, 'woops');
    }).fail(function (data) {
        t.equal(data, 'meow', 'promise fired!');
    });

    d.reject('meow');
});

test('cancelled error', function (t) {
    var d = Q.defer();

    var c = qelp.cancel(d.promise);

    c.then(function (data) {
        t.ok(false, 'woops');
    }).fail(function (data) {
        t.ok(false, 'woops');
    });

    c.cancel();

    d.reject('meow');

    setTimeout(function () {
        t.end();
    }, 100);
});

test('cancelled allow success', function (t) {
    t.plan(1);

    var d = Q.defer();

    var c = qelp.cancel(d.promise);

    c.then(function (data) {
        t.equal(data, 'meow', 'promise fired!');
    }).fail(function (data) {
        t.ok(false, 'woops');
    });

    c.cancel(true);

    d.resolve('meow');
});

test('cancelled error allow success', function (t) {
    var d = Q.defer();

    var c = qelp.cancel(d.promise);

    c.then(function (data) {
        t.ok(false, 'woops');
    }).fail(function (data) {
        t.ok(false, 'woops');
    });

    c.cancel(true);

    d.reject('meow');

    setTimeout(function () {
        t.end();
    }, 100);
});

test('cancelled allow error', function (t) {
    var d = Q.defer();

    var c = qelp.cancel(d.promise);

    c.then(function (data) {
        t.ok(false, 'woops');
    }).fail(function (data) {
        t.ok(false, 'woops');
    });

    c.cancel(false, true);

    d.resolve('meow');

    setTimeout(function () {
        t.end();
    }, 100);
});

test('cancelled error allow error', function (t) {
    t.plan(1);

    var d = Q.defer();

    var c = qelp.cancel(d.promise);

    c.then(function (data) {
        t.ok(false, 'woops');
    }).fail(function (data) {
        t.equal(data, 'meow', 'promise fired!');
    });

    c.cancel(false, true);

    d.reject('meow');
});

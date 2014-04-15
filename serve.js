#!/usr/bin/env node

'use strict';

var connect = require('connect');
var express = require('express');

var routes = require('./routes');


main();

function main() {
    var app = express();

    var port = process.env.PORT || 3000;
    var halfDay = 43200000;

    app.use(express['static'](__dirname + '/public'), {
        maxAge: halfDay
    });
    app.use(connect.urlencoded());

    var env = process.env.NODE_ENV || 'development';
    if(env === 'development') {
        app.use(connect.errorHandler());
    }

    app.get('/', routes.main.get);
    app.post('/', routes.main.post);

    process.on('exit', terminator);

    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
    'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
    ].forEach(function(element) {
        process.on(element, function() { terminator(element); });
    });

    app.listen(port, function() {
        console.log('%s: Node (version: %s) %s started on %d ...', Date(Date.now() ), process.version, process.argv[1], port);
    });
}

function terminator(sig) {
    if(typeof sig === 'string') {
        console.log('%s: Received %s - terminating Node server ...',
            Date(Date.now()), sig);

        process.exit(1);
    }

    console.log('%s: Node server stopped.', Date(Date.now()) );
}

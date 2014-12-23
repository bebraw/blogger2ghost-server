#!/usr/bin/env node
'use strict';

require('log-timestamp');

var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var config = require('./config');
var routes = require('./routes');


main();

function main() {
    var app = express();

    var ip = config.ip;
    var port = config.port;
    var halfDay = 43200000;

    app.use(serveStatic(__dirname + '/public', {
        maxAge: halfDay
    }));
    app.use(bodyParser.urlencoded({extended: true}));

    var env = process.env.NODE_ENV || 'development';
    if(env === 'development') {
        app.use(errorHandler());
    }

    app.get('/', routes.main.get);
    app.post('/', routes.main.post);

    process.on('exit', terminator);

    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
    'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
    ].forEach(function(element) {
        process.on(element, function() { terminator(element); });
    });

    app.listen(port, ip, function() {
        console.log('Node (version: %s) %s started on %s:%d ...', process.version, process.argv[1], ip, port);
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

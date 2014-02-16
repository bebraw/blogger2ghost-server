#!/usr/bin/env node

'use strict';

var express = require('express');
var blogger2ghost = require('blogger2ghost');
var is = require('annois');
var request = require('request');


main();

function main() {
    var app = express();
    var port = process.env.PORT || 3000;

    app.configure(function() {
        app.set('port', port);

        app.use(express.logger('dev'));

        app.use(app.router);
    });

    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    app.get('/:blog', function(req, res) {
        var blog = req.params.blog;

        request.get({
            url: 'http://' + blog + '.blogspot.com/feeds/posts/default?alt=json&max-results=10000',
            json: true
        }, function(err, _, data) {
            if(err) {
                return res.send(500, err);
            }

            if(is.string(data)) {
                return res.send(500, 'Failed to fetch data. Check blog name!');
            }

            res.send(blogger2ghost(data));
        });
    });

    app.get('/', function(req, res) {
        res.send(200, 'Please pass Blogger name as a parameter. Ie. /myblog. Once you are done, save the JSON and pass it to Ghost via `ghost/debug` at your new blog.');
    });

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

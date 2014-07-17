'use strict';

var parseEnv = require('parse-env');

var configTemplate = require('./config.template');
var config;

try {
    config = require('./config');
}
catch(e) {}

var conf = parseEnv(process.env, configTemplate, config);

var openshiftPort = process.env.OPENSHIFT_NODEJS_PORT;

if(openshiftPort) {
    conf.port = openshiftPort;
}

module.exports = conf;

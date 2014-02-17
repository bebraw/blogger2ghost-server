'use strict';

var suite = require('suite.js');

var getBlogUrl = require('../lib/get_blog_url');


suite(getBlogUrl, suite.multiple([
    'foo.info',
    'http://foo.info',
    'www.foo.info',
    'http://www.foo.info'
], 'http://www.foo.info/feeds/posts/default?alt=json&max-results=10000'));

suite(getBlogUrl, suite.multiple([
    'https://foo.info',
    'https://www.foo.info'
], 'https://www.foo.info/feeds/posts/default?alt=json&max-results=10000'));

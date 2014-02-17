'use strict';

var suite = require('suite.js');

var getBlogUrl = require('../lib/get_blog_url');


var suffix = '/feeds/posts/default?alt=json&max-results=10000';

suite(getBlogUrl, suite.multiple([
    'foo.info',
    'http://foo.info',
    'www.foo.info',
    'http://www.foo.info'
], 'http://www.foo.info' + suffix));

suite(getBlogUrl, suite.multiple([
    'https://foo.info',
    'https://www.foo.info'
], 'https://www.foo.info' + suffix));

suite(getBlogUrl, suite.multiple([
    'http://blog.jsdelivr.com',
    'blog.jsdelivr.com'
], 'http://blog.jsdelivr.com' + suffix));

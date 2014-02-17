'use strict';

var url = require('url');


module.exports = function(blog) {
    var parsed = url.parse(blog);
    var protocol = parsed.protocol || 'http:';

    blog = removeWWW(parsed.protocol? parsed.host: blog);
    blog = addWWW(blog);

    return url.resolve(protocol + '//' + blog, '/feeds/posts/default?alt=json&max-results=10000');
};

function removeWWW(str) {
    if(str.indexOf('www') === 0) {

        return str.split('.').slice(1).join('.');
    }

    return str;
}

function addWWW(str) {
    if(str.split('.').length <= 2) {
        return 'www.' + str;
    }

    return str;
}

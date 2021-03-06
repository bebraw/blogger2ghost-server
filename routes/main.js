'use strict';

var blogger2ghost = require('blogger2ghost');
var is = require('annois');
var request = require('superagent');

var getBlogUrl = require('../lib/get_blog_url');


module.exports = {
    get: function(req, res) {
        res.sendfile(__dirname + '/public/index.html');
    },
    post: function(req, res) {
        if(!req.body) {
            return res.redirect('/?error');
        }

        var blog = req.body.blog;

        if(!blog) {
            return res.redirect('/?error');
        }

        request.get(getBlogUrl(blog)).
            set('Accept', 'application/json').
            end(function(err, data) {
                var result;

                data = data.body;

                if(err) {
                    return res.redirect('/?error');
                }

                if(is.string(data)) {
                    return res.redirect('/?error');
                }

                try {
                    result = blogger2ghost(data);
                }
                catch(e) {
                    console.log('Failed to convert', blog);
                    return res.redirect('/?error');
                }

                res.setHeader('Content-Disposition', 'attachment; filename=ghost_data.json');
                res.setHeader('Content-Type', 'application/json; charset=utf-8');

                res.send(result);
            });
    }
};

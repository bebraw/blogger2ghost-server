var blogger2ghost = require('blogger2ghost');
var is = require('annois');
var request = require('request');

var getBlogUrl = require('../lib/get_blog_url');


module.exports = {
    get: function(req, res) {
        res.sendfile(__dirname + '/public/index.html');
    },
    post: function(req, res) {
        if(!req.body) {
            return res.send(404, 'Missing request body!');
        }

        var blog = req.body.blog;

        if(!blog) {
            return res.send(404, 'Blog parameter not provided!');
        }

        request.get({
            url: getBlogUrl(blog),
            json: true
        }, function(err, _, data) {
            var result;

            if(err) {
                return res.send(404, err);
            }

            if(is.string(data)) {
                return res.send(404, 'Failed to fetch data. Check blog name!');
            }

            try {
                result = blogger2ghost(data);
            }
            catch(e) {
                console.log('Failed to convert', blog);
                return res.send(404, 'Conversion failed');
            }

            res.setHeader('Content-Disposition', 'attachment; filename=ghost_data.json');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');

            res.send(result);
        });
    }
};

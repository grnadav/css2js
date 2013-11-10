var nodePhantom = require("node-phantom-simple"),
    phantomjs = require("phantomjs");


    function prepareTest(html, cssjs, cb) {
    nodePhantom.create(function (err, phantom) {
        if (err) {
            return cb(err);
        }
        return phantom.createPage(function (err, page) {
            if (err) {
                return cb(err);
            }
            page.open(html, function (err) {
                if (err) {
                    return cb(err);
                }
                page.injectJs(cssjs, function () {
                    cb(null, page);
                });
            });
        });
    }, {phantomPath: phantomjs.path});
}

exports.prepareTest = prepareTest;
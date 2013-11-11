var expect = require("expect.js"),
    spawn = require('child_process').spawn,
    util = require("../util.js"),
    css2jsPath = __dirname + "/../../app.js",
    css2js = require("../../app.js"),
    fs = require('fs');

var simpleCss = __dirname + "/../simple.css",
    quoteCss = __dirname + "/../quotes.css",
    testHtml = __dirname + "/../test.html",
    testRequireHtml = __dirname + "/../testRequire.html",
    outJs = __dirname + "/out.js";

describe("Test templates", function() {
    // loading phantomjs takes a LONG time :(
    this.timeout(15000);

    describe("Test vanilla_runner template", function() {
        afterEach(function() {
            // remove css.js compilation result to make sure we work with latest compiled file
            fs.unlinkSync(outJs);
        });

        it("should compile vanilla from CLI and compilation result run on injection and be valid - simple.css", function(done) {
            var ret = spawn("node", [css2jsPath, "--css="+simpleCss, "--template=vanilla_runner", "--out="+outJs]);
            ret.on('close', function (code) {
                if (code !== 0) {
                    throw "Unable to compile css2js:"+code;
                }
                util.prepareTest(testHtml, outJs, function(err ,page) {
                    if (err) {
                        throw err;
                    }
                    page.evaluate(function (selector, prop) {
                        var el = document.querySelector(selector);
                        return window.getComputedStyle(el)[prop];
                    }, function (err, color) {
                        expect(color).to.eql('rgb(10, 20, 30)');
                        done();
                    }, '#x', 'color');
                });
            });
        });

        it("should compile vanilla from CLI and compilation result run on injection and be valid - quotes.css", function(done) {
            var ret = spawn("node", [css2jsPath, "--css="+quoteCss, "--template=vanilla_runner", "--out="+outJs]);
            ret.on('close', function (code) {
                if (code !== 0) {
                    throw "Unable to compile css2js:"+code;
                }
                util.prepareTest(testHtml, outJs, function(err ,page) {
                    if (err) {
                        throw err;
                    }
                    page.evaluate(function (selector, prop) {
                        var el = document.querySelector(selector);
                        return window.getComputedStyle(el)[prop];
                    }, function (err, fontFamily) {
                        expect(fontFamily).to.eql('Tahoma');
                        done();
                    }, '#x', 'font-family');
                });
            });
        });
    });


    describe("Test requirejs_runner template", function() {
        afterEach(function() {
            // remove css.js compilation result to make sure we work with latest compiled file
            fs.unlinkSync(outJs);
        });

        it("should compile requirejs_runner from CLI and compilation result run when required and be valid - simple.css", function(done) {
            var ret = spawn("node", [css2jsPath, "--css="+simpleCss, "--template=requirejs_runner", "--out="+outJs]);
            ret.on('close', function (code) {
                if (code !== 0) {
                    throw "Unable to compile css2js:"+code;
                }
                // don't inject any script. let requirejs do it
                util.prepareTest(testRequireHtml, '', function(err ,page) {
                    if (err) {
                        throw err;
                    }
                    page.evaluate(function () {
                        window.require(['testTemplates/out'], function() {
                        });
                    }, function (err, color) {
                        // wait a little to let requirejs load the file
                        setTimeout(function() {
                            page.evaluate(function (selector, prop) {
                                var el = document.querySelector(selector);
                                return window.getComputedStyle(el)[prop];
                            }, function (err, color) {
                                expect(color).to.eql('rgb(10, 20, 30)');
                                done();
                            }, '#x', 'color');
                        }, 500);
                    });
                });
            });
        });
    });


    describe("Test requirejs_inject template", function() {
        afterEach(function() {
            // remove css.js compilation result to make sure we work with latest compiled file
            fs.unlinkSync(outJs);
        });

        it("should compile requirejs_inject from CLI and compilation result run when inject() and be valid - simple.css", function(done) {
            var ret = spawn("node", [css2jsPath, "--css="+simpleCss, "--template=requirejs_inject", "--out="+outJs]);
            ret.on('close', function (code) {
                if (code !== 0) {
                    throw "Unable to compile css2js:"+code;
                }
                // don't inject any script. let requirejs do it
                util.prepareTest(testRequireHtml, '', function(err ,page) {
                    if (err) {
                        throw err;
                    }
                    page.evaluate(function () {
                        window.require(['testTemplates/out'], function() {
                        });
                    }, function (err, color) {
                        // wait a little to let requirejs load the file
                        setTimeout(function() {
                            page.evaluate(function (selector, prop) {
                                var el = document.querySelector(selector);
                                return window.getComputedStyle(el)[prop];
                            }, function (err, color) {
                                // make sure css.js not ran until inject()
                                expect(color).to.eql('rgb(0, 0, 0)');


                                // test inject()
                                page.evaluate(function () {
                                    window.require(['testTemplates/out'], function(cssjs) {
                                        cssjs.inject();
                                    });
                                }, function (err, color) {
                                    // wait a little to let requirejs load the file
                                    setTimeout(function() {
                                        page.evaluate(function (selector, prop) {
                                            var el = document.querySelector(selector);
                                            return window.getComputedStyle(el)[prop];
                                        }, function (err, color) {
                                            expect(color).to.eql('rgb(10, 20, 30)');
                                            done();
                                        }, '#x', 'color');
                                    }, 500);

                                });

                            }, '#x', 'color');
                        }, 500);
                    });
                });
            });
        });
    });
});
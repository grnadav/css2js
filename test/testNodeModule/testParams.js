var expect = require("expect.js"),
    spawn = require('child_process').spawn;

var css2js = __dirname + "/../../app.js",
    simpleCss = __dirname + "/../simple.css";

describe("Test invalid parameter receiving behaviour", function() {
    it("should alert missing css parameter", function(done) {
        var ret = spawn('node', [css2js]);
        ret.on('close', function (code) {
            expect(code).to.be(1);
            done();
        });
    });

    it("should alert missing input css file", function(done) {
        var ret = spawn('node', [css2js, "nonExistent.css"]);
        ret.on('close', function (code) {
            expect(code).to.be(1);
            done();
        });
    });

    it("should alert missing template parameter", function(done) {
        var ret = spawn('node', [css2js, simpleCss]);
        ret.on('close', function (code) {
            expect(code).to.be(1);
            done();
        });
    });

    it("should alert missing input template file", function(done) {
        var ret = spawn('node', [css2js, simpleCss, "invalidTemplateName"]);
        ret.on('close', function (code) {
            expect(code).to.be(1);
            done();
        });
    });

});
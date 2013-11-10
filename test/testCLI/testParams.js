var expect = require("expect.js"),
    util = require("../util.js"),
    css2js = require("../../app.js");

var simpleCss = __dirname + "/../simple.css";

describe("Test invalid parameter receiving behaviour", function() {
    it("should alert missing css parameter", function() {
        var ret = css2js.convert();
        expect(ret).to.be(-1);
    });

    it("should alert missing input css file", function() {
        var ret = css2js.convert("fileDoesntExist.css");
        expect(ret).to.be(-1);
    });

    it("should alert missing template parameter", function() {
        var ret = css2js.convert(simpleCss);
        expect(ret).to.be(-2);
    });

    it("should alert missing input template file", function() {
        var ret = css2js.convert(simpleCss, "invalidTemplateName");
        expect(ret).to.be(-2);
    });
});
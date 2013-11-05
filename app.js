var fs = require('fs');
var lineReader = require('line-reader');
var tinytim = require('tinytim');

var cssFileUri = 'x.css';
var outputFile = 'out.js';
var template = 'vanila_runner';

//var cssContent = fs.readFileSync(cssFileUri, {encoding: 'utf8'});
var cssContent = '';
// read all lines:
lineReader.eachLine(cssFileUri,function (line) {
        cssContent += line + ' ';
    }).then(function () {
        cssContent = cssContent.replace(/"/g,'\'');
        cssContent = '"' + cssContent + '"';

        var injectCssFn = tinytim.renderFile('templates/css_injector.js.tim', {});
        var res = tinytim.renderFile('templates/'+template+'.js.tim', {cssContent: cssContent, injectCssFn: injectCssFn});

        console.log(cssContent);
        console.log(res);
        writeToFile(outputFile, res);
    });


function writeToFile(outUri, content) {
    fs.writeFileSync(outUri, content, {encoding: 'utf8'});
}
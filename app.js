var fs = require('fs');
var lineReader = require('line-reader');
var tinytim = require('tinytim');

var cssFileUri = 'xxx.css';
var outputFile = 'out.js';

//var cssContent = fs.readFileSync(cssFileUri, {encoding: 'utf8'});
var cssContent = '';
// read all lines:
lineReader.eachLine(cssFileUri,function (line) {
        cssContent += line + ' ';
    }).then(function () {
        cssContent = cssContent.replace(/"/g,'\'');
        cssContent = '"' + cssContent + '"';

        var res = tinytim.renderFile('templates/vanila_runner.js.tim', {cssContent: cssContent});

        console.log(cssContent);
        console.log(res);
        writeToFile(outputFile, res);
    });


function writeToFile(outUri, content) {
    fs.writeFileSync(outUri, content, {encoding: 'utf8'});
}
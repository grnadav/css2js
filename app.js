var fs = require('fs');
var lineReader = require('line-reader');

var cssFileUri = 'x.css';

//var cssContent = fs.readFileSync(cssFileUri, {encoding: 'utf8'});
var cssContent = '';
// read all lines:
lineReader.eachLine(cssFileUri,function (line) {
        cssContent += line + ' ';
    }).then(function () {
        cssContent = cssContent.replace(/"/g,'\'');
        cssContent = '"' + cssContent + '"';

        console.log(cssContent);
    });



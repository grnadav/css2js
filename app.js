var fs = require('fs');
var lineReader = require('line-reader');
var tinytim = require('tinytim');
var argv = require('optimist')
    .usage('Usage: $0 -css [path/to/input/css] -out [path/to/out/js] -template [vanila_runner|requirejs_inject|requirejs_runner|<yours!>]')
    .demand(['css','out','template'])
    .argv;

var cssFileUri = argv.css;
var outputFile = argv.out;
var template = argv.template;
var templatePath = 'templates/'+template+'.js.tim';

// verify files exists
if (!fs.existsSync(cssFileUri)) {
    console.error('Missing input css file:'+cssFileUri);
    return -1;
}
if (!fs.existsSync(templatePath)) {
    console.error('Missing input template file:'+templatePath);
    return -1;
}

// read the input css and build the output js files
var cssContent = '';
lineReader.eachLine(cssFileUri,function (line) {
    // add space after each line to make sure you get a valid single line css string
    cssContent += line + ' ';
}).then(function () {
    // replace ' with " before wrapping with
    cssContent = cssContent.replace(/'/g,"\'");
    cssContent = "'" + cssContent + "'";

    // get the injection method so it is injectable to the other templates
    var injectCssFn = tinytim.renderFile('templates/css_injector.js.tim', {});
    // render the output template with the css content and the injection method
    var res = tinytim.renderFile(templatePath, {cssContent: cssContent, injectCssFn: injectCssFn});

    // write output file
    fs.writeFileSync(outputFile, res, {encoding: 'utf8'});
});

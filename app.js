var fs = require('fs'),
    path = require('path'),
    rootPath = path.dirname(fs.realpathSync(__filename)),
    tinytim = require('tinytim'),
    optimist = require('optimist');


if (require.main === module) {
    // loaded from command line - require arguments, if fails returns 1
    var argv = optimist
            .usage('Usage: $0 --css=[path/to/input/css] --out=[path/to/out/js] --template=[vanilla_runner|requirejs_inject|requirejs_runner|<yours!>]')
            .demand(['css', 'out', 'template'])
            .argv,


        cssFileUri = argv.css,
        outputFile = argv.out,
        template = argv.template,
        templatePath = path.join(rootPath, 'templates/' + template + '.js.tim');

    return convert(cssFileUri, templatePath, outputFile);

} else {
    // loaded from another module, export the functionality
    exports.convert = convert;
}

/**
 * Convert CSS file to Javascript output
 * @param {string} cssFileUri - path to css to convert, e.g. /my/awesome/all.css, or ../all.css
 * @param {string} templatePath - [vanilla_runner|requirejs_inject|requirejs_runner|<yours (see readme)!>]
 * @param {string} outputFile - path to output JS file, e.g. /my/awesome/css.js, or ../css.js
 * @returns {number} - 0 success, -1 missing css input file, -2 missing template file
 */
function convert(cssFileUri, templatePath, outputFile) {

    // verify files exists
    if (!cssFileUri || !fs.existsSync(cssFileUri)) {
        console.error('Missing input css file:' + cssFileUri);
        return -1;
    }
    if (!templatePath || !fs.existsSync(templatePath)) {
        console.error('Missing input template file:' + templatePath);
        return -2;
    }

    // read the input css and build the output js files
    var cssContent = fs.readFileSync(cssFileUri, {encoding: 'utf8'});
    cssContent = cssContent.replace(/[\n|\r]/g, " ");
    cssContent = cssContent.replace(/'/g, '\"');
    cssContent = "'" + cssContent + "'";

    // get the injection method so it is injectable to the other templates
    var injectJsPath = path.join(rootPath, 'templates/css_injector.js.tim');
    var injectCssFn = tinytim.renderFile(injectJsPath, {});
    // render the output template with the css content and the injection method
    var res = tinytim.renderFile(templatePath, {cssContent: cssContent, injectCssFn: injectCssFn});

    // write output file
    fs.writeFileSync(outputFile, res, {encoding: 'utf8'});

    return 0;
}
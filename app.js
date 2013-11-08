var fs = require('fs'),
    tinytim = require('tinytim'),
    optimist = require('optimist');


if (require.main === module) {
    // loaded from command line - require arguments
    var argv = optimist
        .usage('Usage: $0 -css [path/to/input/css] -out [path/to/out/js] -template [vanilla_runner|requirejs_inject|requirejs_runner|<yours!>]')
        .demand(['css', 'out', 'template'])
        .argv,


        cssFileUri = argv.css,
        outputFile = argv.out,
        template = argv.template,
        templatePath = 'templates/' + template + '.js.tim';

    return convert(cssFileUri, outputFile, templatePath);

} else {
    // loaded from another module, export the functionality
    exports.convert = convert;
}

/**
 * Convert CSS file to Javascript output
 * @param {string} cssFileUri - path to css to convert, e.g. /my/awesome/all.css, or ../all.css
 * @param {string} outputFile - path to output JS file, e.g. /my/awesome/css.js, or ../css.js
 * @param {string} templatePath - [vanilla_runner|requirejs_inject|requirejs_runner|<yours (see readme)!>]
 * @returns {number} - 0 success, -1 missing css input file, -2 missing template file
 */
function convert(cssFileUri, outputFile, templatePath) {

    // verify files exists
    if (!fs.existsSync(cssFileUri)) {
        console.error('Missing input css file:' + cssFileUri);
        return -1;
    }
    if (!fs.existsSync(templatePath)) {
        console.error('Missing input template file:' + templatePath);
        return -1;
    }

    // read the input css and build the output js files
    var cssContent = fs.readFileSync(cssFileUri, {encoding: 'utf8'});
    cssContent = cssContent.replace(/\n/g, " ");
    cssContent = cssContent.replace(/'/g, '\"');
    cssContent = "'" + cssContent + "'";

    // get the injection method so it is injectable to the other templates
    var injectCssFn = tinytim.renderFile('templates/css_injector.js.tim', {});
    // render the output template with the css content and the injection method
    var res = tinytim.renderFile(templatePath, {cssContent: cssContent, injectCssFn: injectCssFn});

    // write output file
    fs.writeFileSync(outputFile, res, {encoding: 'utf8'});

    return 0;
}
# CSS2JS - Compile your CSS into Javascript

Why would you want to convert your perfectly fine CSS into a Javascript file?

1. If you want to create a project that output a single runnable file -  with no external dependencies, you can now embed your static resources in the CSS (or compile them there via SASS\LESS), convert that CSS into JS and compile it into your .min output
2. Minimize network roundtrips

## Example usage
node app.js --css=mycss.css --out=out.js --template=vanila_runner

## Templates
There are 3 included templates to match your needs:  

1. vanila_runner - outputs a vanilla javascript files, that when loaded injects the CSS automatically
2. requirejs_runner - outputs a requirejs module, that when loaded (via requirejs) injects the CSS automatically
3. requirejs_inject - outputs a requirejs module, exposes one method: 'inject()' which inject the CSS when called

### You can build your own templates
Te use your own template, add a .js.tim file to the templates folder.
The CSS string contents will be injected into wherever you put a {{cssContent}} tag

## Things missing
There are a couple of features I wish were here (via contribution say... ;) )

1. NodeJS support - enable loading css2js as Node module, and provide parameters not via arguments
2. CommonJS template - Both auto-runnable and inject() function
3. Tests - :(



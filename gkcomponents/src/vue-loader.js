let babel = require("@babel/core");
let path = require("path");
let Tools = require("./file");
let gulp = require("gulp");
let sass = require('gulp-sass');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
const htmlURL = require("D:/PrivateConfings/work/configs").htmlURL;
const jsURL = require("D:/PrivateConfings/work/configs").jsURL;
const cssURL = require("D:/PrivateConfings/work/configs").cssURL;


function getSource(source, type) {
    const regex = new RegExp(`<${type}[^>]*>`);
    let openingTag = source.match(regex);
    if (!openingTag) return "";
    else openingTag = openingTag[0];
    return source.slice(source.indexOf(openingTag) + openingTag.length, source.lastIndexOf(`</${type}>`));
}


const Loader = function (code, fileName) {
    let js = getSource(code, "script");
    let css = getSource(code, "style");
    let html = getSource(code, "template");
    const regex = new RegExp(`template: "#template",`);

    js = js.replace(regex,
        () => {
            return `name: \`${fileName}\`,template: \`<mytemplate>${html}</mytemplate>\`,`;
        });

    return {
        js,
        css,
        html
    };
};

exports.getCssJs = async (fileName) => {
    try {
        let res = await Tools.readFile(path.resolve(__dirname, `app/vue/${fileName}.vue`));
        let loader = new Loader(res, fileName);
        /* css */
        let scssPath = path.resolve(__dirname, `app/vue/scss/${fileName}.scss`);
        await Tools.writeFile(scssPath, `@import "./variables";\n${loader.css}`);
        let plugins = [autoprefixer({
            browsers: ['last 2 versions', 'last 2 Explorer versions'],
        })];
        await gulp.src([scssPath])
            .pipe(sass())
            .pipe(postcss(plugins))
            .pipe(gulp.dest(path.resolve(cssURL)));
        // .pipe(gulp.dest(path.resolve(__dirname, `app/style/vue`)));
        /* html */
        /*         
            let htmlTemplate = await Tools.readFile(path.resolve(__dirname, `htmlTemplate.html`));
            const regex = new RegExp(`{{{htmlTemplate}}}`);
            loader.html = htmlTemplate.replace(regex, `${loader.html}`);
            console.log(loader.html);
         */
        await Tools.writeFile(path.resolve(htmlURL, `${fileName}.html`), loader.html);
        // await Tools.writeFile(path.resolve(__dirname, `app/html/template/${fileName}.html`), loader.html);
        /* JavaScript */
        /* es6=>es5 */
        let {
            code
        } = await babel.transformAsync(loader.js, {
            "presets": [
                ["@babel/preset-env", {
                    "useBuiltIns": "entry"
                }]
            ]
        });

        const regex = new RegExp(`<mytemplate>(.*)</mytemplate>`, "igm");
        let templateContent = regex.exec(code)[1];
        templateContent = templateContent.replace(/(\\n\s)/g, `"+\n"`);
        code = code.replace(regex, templateContent);
        await Tools.writeFile(path.resolve(jsURL, `${fileName}.js`), code);
        // let resa = await Tools.writeFile(path.resolve(__dirname, `app/js/lib/vue/${fileName}.js`), code);
        // console.log(resa);
    } catch (error) {
        console.warn(error);
    }
};
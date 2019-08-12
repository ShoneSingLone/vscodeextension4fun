const path = require("path");
const fs = require("fs-extra")
const targetFileDirectory = path.resolve("g:/GitHub/vscodeextension4fun/gkcomponents/src");


async function creatComponent(targetFileDirectory, fileName) {
    let res = await Promise.all([await fs.outputFile(path.resolve(targetFileDirectory, `${fileName}.html`), 'hello!'), await fs.outputFile(path.resolve(targetFileDirectory, `${fileName}.js`), 'hello!'), await fs.outputFile(path.resolve(targetFileDirectory, `${fileName}.scss`), 'hello!')]);
    console.log(res);
}

(async () => {
    try {
        let stats = await fs.stat(targetFileDirectory);
        if (stats.isFile()) {
            /* 如果是file，则取文件的父级目录 */
            targetFileDirectory = path.resolve(targetFileDirectory, "..")
        }
        creatComponent(targetFileDirectory, "fileName")
    } catch (error) {
        console.error(error);
    }
})()
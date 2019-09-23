import * as fs from 'fs-extra';
import * as path from "path";


function getJSTemplate(name: string): string {
	return `/**
 * vue component: ${name} 
 * lazyLoadComponents([], Vue.resolvePath("statics/components"));
 * Vue.loadJS([ [ "vue-easy-lightbox", Vue.resolvePath("statics/plugins/vue-2.6.10/vue-easy-lightbox.umd.min.js") ] ]),
 */
(function (Vue) {
	var COMPONENT_NAME = '${name}';
	Vue.componentList[COMPONENT_NAME] =
		Promise.resolve({
			name: COMPONENT_NAME,
			props: {},
			computed: {},
			methods: {}
		});
})(window.Vue);`;
}

export async function createComponent(targetFileDirectory: string, fileName: string) {
	let stats = await fs.stat(targetFileDirectory);
	if (stats.isFile()) {
		/* 如果是file，则取文件的父级目录 */
		targetFileDirectory = path.resolve(targetFileDirectory, "..")
	}
	let res = await Promise.all([
		await fs.outputFile(path.resolve(targetFileDirectory, fileName, `${fileName}.html`), `<h1>${fileName}</h1>`),
		await fs.outputFile(path.resolve(targetFileDirectory, fileName, `${fileName}.js`), getJSTemplate(fileName)),
		await fs.outputFile(path.resolve(targetFileDirectory, fileName, `${fileName}.scss`), '')
	]);
	console.log("res", res);
}
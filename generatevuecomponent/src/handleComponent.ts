import * as fs from 'fs-extra';
import * as path from "path";


function getJSTemplate(name: string): string {
	return `
	/**
	 * vue component: ${name} 
	 */
	(function (Vue) {
		var COMPONENT_NAME = '${name}';
		var self = null;
		Vue.componentList[COMPONENT_NAME] =
			Promise.resolve({
				name: COMPONENT_NAME,
				props: {},
				computed: {},
				beforeCreate: function () {
					self = this;
				},
				methods: {}
			});
	})(window.Vue);
	`;
}

export async function createComponent(targetFileDirectory: string, fileName: string) {
	let stats = await fs.stat(targetFileDirectory);
	if (stats.isFile()) {
		/* 如果是file，则取文件的父级目录 */
		targetFileDirectory = path.resolve(targetFileDirectory, "..")
	}
	let res = await Promise.all([
		await fs.outputFile(path.resolve(targetFileDirectory, fileName, `${fileName}.html`), ''),
		await fs.outputFile(path.resolve(targetFileDirectory, fileName, `${fileName}.js`), getJSTemplate(fileName)),
		await fs.outputFile(path.resolve(targetFileDirectory, fileName, `${fileName}.scss`), '')
	]);
	console.log("res", res);
}
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var Local = require('./Local');
var getCssJs = require('./vue-loader').getCssJs;
var {
	INPUT_PROMPT
} = require('./config');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "getComponent" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('shone.sing.lone.getComponents', function () {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Test by ShoneSingLone');

		var files = vscode.workspace.textDocuments; // 获取当前打开的文件路径
		console.log("files:\n", files);
		if (files.length) {
			debugger;
			var last = files.length - 1;
			this.handlePath(path.dirname(files[last].fileName)); // 取最后打开的文件目录，基于这个路径去查找node_modules目录
		} else {
			vscode.window.showInformationMessage(NO_FILE); // 弹出提示信息
		}

		vscode.window.showInputBox({ // 调出输入框
			prompt: INPUT_PROMPT
		}).then(function (moduleName) {
			new Local(moduleName); // 回车后执行
		});

	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
	vscode.window.showInformationMessage('???');
}

module.exports = {
	activate,
	deactivate
}
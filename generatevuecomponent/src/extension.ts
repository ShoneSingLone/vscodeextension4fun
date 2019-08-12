// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createComponent } from "./handleComponent"

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('shone.sing.lone.gnvc', async (selectedFile: vscode.Uri) => {
		if (selectedFile) {
			let { fsPath } = selectedFile;
			let name = await vscode.window.showInputBox({ prompt: "input name of new  component" });
			if (name) createComponent(fsPath, name);
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }

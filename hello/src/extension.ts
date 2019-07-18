// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { compile as PugCompile } from 'pug';


async function getImg(name: string) {
	return await fs.readFile(resolve(__dirname, `./imgs/${name}`), 'utf8');
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let imgCoding = await getImg('Coding.webp');
	let imgCompiling = await getImg('Compiling.webp');
	const cats = { 'Compiling Cat': imgCompiling, 'Coding Cat': imgCoding };
	
	// Track currently webview panel
	let currentPanel: vscode.WebviewPanel | undefined = undefined;
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hello" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// /* registerCommand Lifecycle onDidDispose 处理垃圾回收 */
	let disposable = vscode.commands.registerCommand('extension.Shone.sing.lone', async () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');

		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
			'catCoding', // Identifies the type of the webview. Used internally
			'Cat Coding', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{} // Webview options. More on these later.
		);



		/* production cache */
		// let pugContent = await fs.readFile(resolve(__dirname, "./content.pug"), "utf8");
		async function getWebviewContent(cat: keyof typeof cats) {
			/* dev */
			let pugContent = await fs.readFile(resolve(__dirname, "./content.pug"), "utf8");
			let pugData = cats[cat];
			let pugScriptJQuery = await fs.readFile(resolve(__dirname, "./js/jquery.js"), "utf8");
			let pugScriptMain = await fs.readFile(resolve(__dirname, "./js/main.js"), "utf8");
			let pugHTMLString = PugCompile(pugContent)({ imgSrc: pugData })
			pugHTMLString = pugHTMLString.replace("##jquery##", pugScriptJQuery).replace("##main##", pugScriptMain)
			return pugHTMLString;
		}
		/*  */
		let iteration = 0;
		const updateWebview = async () => {
			const cat = iteration++ % 2 ? "Compiling Cat" : "Coding Cat";
			panel.title = cat;
			panel.webview.html = await getWebviewContent(cat);
			console.log(panel.webview.html);
			// Handle messages from the webview
			panel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'alert':
							vscode.window.showErrorMessage(message.text);
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		};
		// Set initial content
		updateWebview();
		// And schedule updates to the content every second
		// let interval = setInterval(updateWebview, 1000 * 3);

		panel.onDidDispose(
			(event) => {
				console.log("onDidDispose", event);
				// When the panel is closed, cancel any future updates to the webview content
				vscode.window.showInformationMessage(`dispose`);
				// clearInterval(interval);
			},
			undefined,
			context.subscriptions
		)
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

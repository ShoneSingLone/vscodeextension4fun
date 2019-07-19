// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import { compile as PugCompile } from 'pug';
import { getLR } from './utils'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	const cats = {
		'Compiling Cat': getLR('imgs/Coding.webp'),
		'Coding Cat': getLR('imgs/Compiling.webp'),
		'Testing Cat': getLR('imgs/Testing.webp')
	};

	// Track currently webview panel
	let currentPanel: vscode.WebviewPanel;
	let isCurrentPanelDidDispose = true
	let columnToShowIn = vscode.window.activeTextEditor
		? vscode.window.activeTextEditor.viewColumn
		: undefined;

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "VSCB" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// /* registerCommand Lifecycle onDidDispose 处理垃圾回收 */
	let disposable = vscode.commands.registerCommand('extension.shone.sing.lone.VSCB', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('VSCB World!');

		if (!isCurrentPanelDidDispose) {
			// If we already have a panel, show it in the target column
			currentPanel.reveal(2);
		} else {
			// Otherwise, create a new panel
			currentPanel = vscode.window.createWebviewPanel(
				'catCoding',
				'Cat Coding',
				columnToShowIn || vscode.ViewColumn.One,
				{
					// Enable scripts in the webview
					enableScripts: true
				}
			);
			isCurrentPanelDidDispose = false

			/* production cache */
			// let pugContent = await fs.readFile(resolve(__dirname, "./content.pug"), "utf8");
			async function getWebviewContent(cat: keyof typeof cats) {
				/* dev */
				let pugContent = await fs.readFile(resolve(__dirname, "./content.pug"), "utf8");

				/*  */
				// Get path to resource on disk
				const onDiskPath = vscode.Uri.file(
					join(context.extensionPath, 'README.md')
				);
				// And get the special URI to use with the webview
				const catGifSrc = onDiskPath.with({ scheme: 'vscode-resource' });
				console.log('catGifSrc', catGifSrc);

				return PugCompile(pugContent)((() => {
					let scriptNameArray = ['jquery', 'main'];
					return {
						imgSrc: cats[cat],
						scriptArray: scriptNameArray.map(name => ({
							id: `script-${name}`,
							src: getLR(`js/${name}.js`)
						}))
					}
				})());
			}

			async function updateWebviewForCat(panel: vscode.WebviewPanel, catName: keyof typeof cats) {
				panel.title = catName;
				panel.webview.html = await getWebviewContent(catName);
			}
			/*  */
			let iteration = 0;
			const updateWebview = async () => {
				const cat = iteration++ % 2 ? "Compiling Cat" : "Coding Cat";
				currentPanel.title = cat;
				currentPanel.webview.html = await getWebviewContent(cat);
				setInterval(() => {
					const cat = iteration++ % 2 ? "Compiling Cat" : "Coding Cat";
					currentPanel.webview.postMessage({ command: 'changeImg', cat: { name: cat, src: cats[cat] } });
				}, 1000 * 3);
				// Handle messages from the webview
				interface StrategyMap {
					[prop: string]: (message: any) => any
				}
				const strategyhandleReceiveMessage: StrategyMap = {
					alert: (message: any) => {
						vscode.window.showErrorMessage(message.text);
					},
					closePanel: (message: any) => {
						currentPanel.dispose();
					}
				}

				currentPanel.webview.onDidReceiveMessage(
					message => {
						const fn = strategyhandleReceiveMessage[message.command];
						fn && fn(message);
					},
					undefined,
					context.subscriptions
				);
			};
			// Set initial content
			updateWebview();
			// Update contents based on view state changes
			currentPanel.onDidChangeViewState(
				e => {
					const panel = e.webviewPanel;
					switch (panel.viewColumn) {
						case vscode.ViewColumn.One:
							updateWebviewForCat(panel, 'Coding Cat');
							return;

						case vscode.ViewColumn.Two:
							updateWebviewForCat(panel, 'Compiling Cat');
							return;

						case vscode.ViewColumn.Three:
							updateWebviewForCat(panel, 'Testing Cat');
							return;
					}
				},
				null,
				context.subscriptions
			);

			// And schedule updates to the content every second
			// let interval = setInterval(updateWebview, 1000 * 3);
			currentPanel.onDidDispose(
				(event) => {
					console.log("onDidDispose", event);
					// When the panel is closed, cancel any future updates to the webview content
					vscode.window.showInformationMessage(`dispose`);
					// clearInterval(interval);
					isCurrentPanelDidDispose = true;
				},
				undefined,
				context.subscriptions
			)
		}
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }



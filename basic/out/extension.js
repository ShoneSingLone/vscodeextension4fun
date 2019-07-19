"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs_1 = require("fs");
const path_1 = require("path");
const pug_1 = require("pug");
const utils_1 = require("./utils");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const cats = {
            'Compiling Cat': utils_1.getLR('imgs/Coding.webp'),
            'Coding Cat': utils_1.getLR('imgs/Compiling.webp'),
            'Testing Cat': utils_1.getLR('imgs/Testing.webp')
        };
        // Track currently webview panel
        let currentPanel;
        let isCurrentPanelDidDispose = true;
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
        let disposable = vscode.commands.registerCommand('extension.shone.sing.lone.VSCB', () => __awaiter(this, void 0, void 0, function* () {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage('VSCB World!');
            if (!isCurrentPanelDidDispose) {
                // If we already have a panel, show it in the target column
                currentPanel.reveal(2);
            }
            else {
                // Otherwise, create a new panel
                currentPanel = vscode.window.createWebviewPanel('catCoding', 'Cat Coding', columnToShowIn || vscode.ViewColumn.One, {
                    // Enable scripts in the webview
                    enableScripts: true
                });
                isCurrentPanelDidDispose = false;
                /* production cache */
                // let pugContent = await fs.readFile(resolve(__dirname, "./content.pug"), "utf8");
                function getWebviewContent(cat) {
                    return __awaiter(this, void 0, void 0, function* () {
                        /* dev */
                        let pugContent = yield fs_1.promises.readFile(path_1.resolve(__dirname, "./content.pug"), "utf8");
                        /*  */
                        // Get path to resource on disk
                        const onDiskPath = vscode.Uri.file(path_1.join(context.extensionPath, 'README.md'));
                        // And get the special URI to use with the webview
                        const catGifSrc = onDiskPath.with({ scheme: 'vscode-resource' });
                        console.log('catGifSrc', catGifSrc);
                        return pug_1.compile(pugContent)((() => {
                            let scriptNameArray = ['jquery', 'main'];
                            return {
                                imgSrc: cats[cat],
                                scriptArray: scriptNameArray.map(name => ({
                                    id: `script-${name}`,
                                    src: utils_1.getLR(`js/${name}.js`)
                                }))
                            };
                        })());
                    });
                }
                function updateWebviewForCat(panel, catName) {
                    return __awaiter(this, void 0, void 0, function* () {
                        panel.title = catName;
                        panel.webview.html = yield getWebviewContent(catName);
                    });
                }
                /*  */
                let iteration = 0;
                const updateWebview = () => __awaiter(this, void 0, void 0, function* () {
                    const cat = iteration++ % 2 ? "Compiling Cat" : "Coding Cat";
                    currentPanel.title = cat;
                    currentPanel.webview.html = yield getWebviewContent(cat);
                    setInterval(() => {
                        const cat = iteration++ % 2 ? "Compiling Cat" : "Coding Cat";
                        currentPanel.webview.postMessage({ command: 'changeImg', cat: { name: cat, src: cats[cat] } });
                    }, 1000 * 3);
                    const strategyhandleReceiveMessage = {
                        alert: (message) => {
                            vscode.window.showErrorMessage(message.text);
                        },
                        closePanel: (message) => {
                            currentPanel.dispose();
                        }
                    };
                    currentPanel.webview.onDidReceiveMessage(message => {
                        const fn = strategyhandleReceiveMessage[message.command];
                        fn && fn(message);
                    }, undefined, context.subscriptions);
                });
                // Set initial content
                updateWebview();
                // Update contents based on view state changes
                currentPanel.onDidChangeViewState(e => {
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
                }, null, context.subscriptions);
                // And schedule updates to the content every second
                // let interval = setInterval(updateWebview, 1000 * 3);
                currentPanel.onDidDispose((event) => {
                    console.log("onDidDispose", event);
                    // When the panel is closed, cancel any future updates to the webview content
                    vscode.window.showInformationMessage(`dispose`);
                    // clearInterval(interval);
                    isCurrentPanelDidDispose = true;
                }, undefined, context.subscriptions);
            }
        }));
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
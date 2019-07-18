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
function getImg(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fs_1.promises.readFile(path_1.resolve(__dirname, `./imgs/${name}`), 'utf8');
    });
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let imgCoding = yield getImg('Coding.webp');
        let imgCompiling = yield getImg('Compiling.webp');
        const cats = {
            'Compiling Cat': imgCompiling,
            'Coding Cat': imgCoding,
            'Testing Cat': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
        };
        // Track currently webview panel
        let currentPanel;
        let isCurrentPanelDidDispose = true;
        let columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // Use the console to output diagnostic information (console.log) and errors (console.error)
        // This line of code will only be executed once when your extension is activated
        console.log('Congratulations, your extension "hello" is now active!');
        // The command has been defined in the package.json file
        // Now provide the implementation of the command with registerCommand
        // The commandId parameter must match the command field in package.json
        // /* registerCommand Lifecycle onDidDispose 处理垃圾回收 */
        let disposable = vscode.commands.registerCommand('extension.Shone.sing.lone', () => __awaiter(this, void 0, void 0, function* () {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage('Hello World!');
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
                        let pugData = cats[cat];
                        let pugScriptJQuery = yield fs_1.promises.readFile(path_1.resolve(__dirname, "./js/jquery.js"), "utf8");
                        let pugScriptMain = yield fs_1.promises.readFile(path_1.resolve(__dirname, "./js/main.js"), "utf8");
                        let pugHTMLString = pug_1.compile(pugContent)({ imgSrc: pugData });
                        pugHTMLString = pugHTMLString.replace("##jquery##", pugScriptJQuery).replace("##main##", pugScriptMain);
                        return pugHTMLString;
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
var fs = require('fs');
var path = require('path');
var vscode = require('vscode');
var {
    MARKDOWN_PREVIEW,
    README_NAMES,
    NO_FILE,
    NOT_FOUND
} = require('./config');

function Local(moduleName) {
    this.moduleName = moduleName;
    moduleName && this.init();
}

Local.prototype = {
    init: function () {
        var files = vscode.workspace.textDocuments; // 获取当前打开的文件路径
        console.dir(files);

        if (files.length) {
            var last = files.length - 1;
            this.handlePath(path.dirname(files[last].fileName)); // 取最后打开的文件目录，基于这个路径去查找node_modules目录
        } else {
            vscode.window.showInformationMessage(NO_FILE); // 弹出提示信息
        }
    },
    handlePath: function (dir) {
        if (dir === '/') { // 已到达根目录
            vscode.window.showInformationMessage(NOT_FOUND);
            return;
        }

        var modulePath = path.join(dir, 'node_modules', this.moduleName);
        if (fs.existsSync(modulePath)) {
            this.handleReadme(modulePath); // 找到了模块目录
        } else {
            this.handlePath(path.dirname(dir)); // 未找到则继续向上查找
        }
    },
    handleReadme: function (modulePath) {
        var readmeName = README_NAMES.find(function (name) {
            return fs.existsSync(path.join(modulePath, name));
        });

        if (readmeName) {
            var readmePath = path.join(modulePath, readmeName);
            vscode.commands.executeCommand(MARKDOWN_PREVIEW, vscode.Uri.parse('file://' + readmePath)); // 执行markdown命令，打开文件
        } else {
            vscode.window.showInformationMessage(NOT_FOUND);
        }
    }
};

module.exports = Local;
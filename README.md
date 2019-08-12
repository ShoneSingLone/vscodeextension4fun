# 搞个小玩意儿 make a toy

`code --extensions-dir 你的目标文件夹`

- [Extension Anatomy](https://code.visualstudio.com/api/get-started/extension-anatomy)
- [中文辅导理解](https://www.cnblogs.com/caipeiyu/p/5507252.html)

basic and important
in package.json  that

```js
    "activationEvents": [
        "onCommand:extension.Shone.sing.lone"//监听commoand 如果是extension.Shone.sing.lone
    ],
    "main": "./out/extension.js",
    "contributes": {
        "commands": [{
            "command": "extension.Shone.sing.lone",// 触发command
            "title": "Shone"//panel 控制面板输入
        }]
    },
    ...
    /* 注册，可以理解为[【事件】 =>callback function]调用各种API */
let disposable = vscode.commands.registerCommand('extension.Shone.sing.lone',function(){})

```

- [extension-capabilities overview](https://code.visualstudio.com/api/extension-capabilities/overview):
  - extension,能干嘛
  - 主要分类
  - 核心功能

---

## Webview API

[webview](https://code.visualstudio.com/api/extension-guides/webview)

在vs code内完全可自定的user interface；
complex也可以。可以理解为有完全操作权限的iframe(＾＿－)。除了HTML 能干的，还能通过message passing与extensions通信
incredibly令人难以置信的powerful。

虽然强大，但是不要放肆，要sparingly保守使用。

1. 非要加进来，独立出去行不行？
1. 现有的API满足不了？
1. 是不是家里有矿，闲着没事非要造作？

```js
// Create and show a new webview添加一个webview
const panel = vscode.window.createWebviewPanel(
    'catCoding', // Identifies the type of the webview. Used internally
    'Cat Coding', // Title of the panel displayed to the user
    vscode.ViewColumn.One, // Editor column to show the new webview panel in.
    {} // Webview options. More on these later.
);
```

```js
// And set its HTML content
panel.webview.html = getWebviewContent();
panel.title = "panelTitle";
panel.dispose()//programmatically close webviews
```

>should always be complate HTML **NOT** HTML fragments or malformed HTML

**watch out!:** 因为 `panel.webview.html` 就是一个完整的`iframe`，如果给`panel.webview.html`重新赋值，就相当于刷新`iframe`，那么js里的各种状态当然也就荡然无存了。

- 开启调试页面的command panel：`Developer: Open Webview Developer Tools`

```js
currentPanel = vscode.window.createWebviewPanel(
    'catCoding',
    'Cat Coding',
    columnToShowIn || vscode.ViewColumn.One,
    {
        // Enable scripts in the webview这样才能再webView里运行JS
        enableScripts: true
    }
);
```



```js
webview.postMessage()

window.addEventListener('message', event => { ... })
```

- `context.extensionPath`获取当前extension所在文件夹而非workspace

## 安全性

>set `localResourceRoots` to `[vscode.Uri.file(extensionContext.extensionPath)]` or even `[]` to **disallow** access to all local resources.

1. 不需要就不要开`enableScripts: true`
1. 开了就不给访问所有路径的权限
1. [内容安全政策](https://developers.google.com/web/fundamentals/security/csp/)
1. https
1. Sanitize all user input 防止injections

## publish

> `prepublish`: 在包发布之前运行，也会在npm install安装到本地时运行

extension有依赖，会在安装之后install依赖包


vsce package 的时候需要单独一个工作空间

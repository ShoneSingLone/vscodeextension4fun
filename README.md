# 搞个小玩意儿 make a toy

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

- `context.extensionPath`获取当前extension所在文件夹而非workspace


```js
webview.postMessage()

window.addEventListener('message', event => { ... })
```

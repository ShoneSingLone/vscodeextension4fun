"use strict";
declare var acquireVsCodeApi: any;
declare var document: any;
declare var $: any;

const vscode = acquireVsCodeApi();
() => {
    vscode.postMessage({
        command: 'alert',
        text: 'bingo'
    });

    function closePanel() {
        vscode.postMessage({
            command: 'closePanel',
            text: 'closePanel'
        });
    }
    let count = 1;

    function changeCount() {
        const counter = document.getElementById('lines-of-code-counter');
        counter.value = count++;
    }

    {
        document.getElementById('closePanel').addEventListener("click", closePanel);
        document.getElementById('changeCount').addEventListener("click", changeCount);
    }

    setInterval(changeCount, 1000 * 3)
}
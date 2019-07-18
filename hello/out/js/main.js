"use strict";
const vscode = acquireVsCodeApi();
window.addEventListener('message', (event) => {
    console.log(event);
    debugger;
});
function postMSG(msg) {
    let text = typeof msg == "string" ? msg : "" || $('#msg').val();
    vscode.postMessage({
        command: 'alert',
        text
    });
}
function closePanel() {
    debugger;
    vscode.postMessage({
        command: 'closePanel',
        text: 'closePanel'
    });
}
let count = 1;
function changeCount() {
    debugger;
    const counter = document.getElementById('msg');
    counter.value = count++;
}
$('#closePanel').on("click", closePanel);
$('#changeCount').on("click", changeCount);
$('#postMSG').on("click", postMSG);
//# sourceMappingURL=main.js.map
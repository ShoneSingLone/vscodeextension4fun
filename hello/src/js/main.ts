"use strict";
declare var acquireVsCodeApi: any;
declare var window: any;
declare var document: any;
declare var $: any;

const vscode = acquireVsCodeApi();

window.addEventListener('message', (event: any) => {
    let { data } = event;
    if (data) {
        console.log(data);
        let { command } = data;
        if (command) {
            if (command === "changeImg") {
                $('#catImg').attr('src', data.cat.src);
            }
        }
    } else {
        debugger;
    }
})

function postMSG(msg: any) {
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
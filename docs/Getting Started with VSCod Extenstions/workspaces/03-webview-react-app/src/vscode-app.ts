import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const REACT_APP_NAME = 'reat-app';
const REACT_APP_TITLE = 'React App';

//  allow only one instance of webview at a time
let panel: vscode.WebviewPanel | undefined = undefined;

export const render = (context: vscode.ExtensionContext) => {
    if (panel) {
        panel.reveal(vscode.ViewColumn.Beside);
        panel.webview.postMessage({ messageId: 'retried' });
        return;
    }

    panel = vscode.window.createWebviewPanel(
        REACT_APP_NAME,
        REACT_APP_TITLE,
        vscode.ViewColumn.Beside,
        { enableScripts: true, enableCommandUris: true, }
    );

    const html = fs.readFileSync(path.join(context.extensionPath, 'out', 'ui', 'index.html'), 'utf-8');
    // And set its HTML content
    panel.webview.html = html;

    panel.onDidDispose(
        () => {
            panel = undefined;
            vscode.window.showInformationMessage("You closed the webview !");
        },
        null,
        context.subscriptions
    );
    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.messageId) {
                case 'quit':
                    vscode.window.showWarningMessage("Closed by clicking on quit.");
                    panel?.dispose();
                    return;
            }
        },
        undefined,
        context.subscriptions
    );
};
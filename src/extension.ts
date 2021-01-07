// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export const greetingViewType = 'greeting';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('openurl-extension.open-webview', () => {
		openUrlList();
	});

	context.subscriptions.push(disposable);

	openUrlList();
}

function openUrlList() {

	let items: vscode.QuickPickItem[] = [];

	var commands: any[] = [];

	// Get variables set
	var child_process = require("child_process");
	var env_vars = child_process.execSync("env | grep CUSTOM_OPEN_URL_");
	var env_vars_arr: any[];
	var conf_arr = [];
	var  key = ""
	var value = ""

	env_vars_arr = env_vars.toString().split(/\r?\n/);
	env_vars_arr.pop();
	console.log(env_vars_arr.length)
	console.log(env_vars_arr)

	for (let index = 0; index < env_vars_arr.length; index++) {

		value = env_vars_arr[index].split("=")[1]
		console.log(value)
		conf_arr = value.split("|")
		key = conf_arr[0].toString()

		items.push({
			label: conf_arr[0],
			description: conf_arr[1],
		})

		// @ts-ignore
		commands[key] = {
			description: conf_arr[1],
			url: conf_arr[2]
		};
	}
	// @ts-ignore
	console.log(commands)

	vscode.window.showQuickPick(items).then(selection => {
		// the user canceled the selection
		if (!selection) {
			return;
		}
		else {
			// @ts-ignore
			const url = commands[selection.label.toString()].url;
			// @ts-ignore
			const title = commands[selection.label.toString()].description;
			const style = "position: absolute; width: calc(100% - 30px); height: calc(100% - 10px);";
			const panel = vscode.window.createWebviewPanel(greetingViewType, title,
				{
					viewColumn: vscode.ViewColumn.One,
					preserveFocus: false
				},
				{
				});
			panel.webview.html = `<iframe src='${url}' style='${style}'></iframe>`;
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}

export class GreetingPageSerializer implements vscode.WebviewPanelSerializer {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any): Thenable<void> {
		webviewPanel.webview.html = "Restored"
		return Promise.resolve();
	}

}

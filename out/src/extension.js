// Copyright (c) 2016 Nisheet Jain
// Released under the MIT license
// https://github.com/nisheetjain/vscode-emacs/blob/master/LICENSE.txt
'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var RegionMode;
(function (RegionMode) {
    RegionMode[RegionMode["None"] = 0] = "None";
    RegionMode[RegionMode["RegionMode"] = 1] = "RegionMode";
    RegionMode[RegionMode["ColumnRegionMode"] = 2] = "ColumnRegionMode";
})(RegionMode || (RegionMode = {}));
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    setRegionMode(RegionMode.None);
    context.subscriptions.push(vscode.commands.registerCommand('emacs.startRegionMode', function () {
        startRegionMode();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('emacs.startColumnRegionMode', function () {
        startColumnRegionMode();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('emacs.exitRegionMode', function () {
        exitRegionMode();
    }));
    var selectionActions = ["action.clipboardCopyAction", "action.clipboardPasteAction", "action.clipboardCutAction"];
    selectionActions.forEach(function (selectionAction) {
        context.subscriptions.push(vscode.commands.registerCommand("emacs." + selectionAction, function () {
            vscode.commands.executeCommand("editor." + selectionAction).then(exitRegionMode);
        }));
    });
    var deletionActions = ["deleteLeft", "deleteRight"];
    deletionActions.forEach(function (deletionAction) {
        context.subscriptions.push(vscode.commands.registerCommand("emacs." + deletionAction, function () {
            vscode.commands.executeCommand(deletionAction).then(exitRegionMode);
        }));
    });
}
exports.activate = activate;
function startRegionMode() {
    setRegionMode(RegionMode.RegionMode).then(removeSelection);
}
function startColumnRegionMode() {
    setRegionMode(RegionMode.ColumnRegionMode).then(removeSelection);
}
function exitRegionMode() {
    setRegionMode(RegionMode.None).then(removeSelection);
}
function setRegionMode(value) {
    return vscode.commands.executeCommand('setContext', 'inRegionMode', value != RegionMode.None).then(function () {
        return vscode.commands.executeCommand('setContext', 'inColumnRegionMode', value == RegionMode.ColumnRegionMode);
    });
}
function removeSelection() {
    var pos = vscode.window.activeTextEditor.selection.active;
    vscode.window.activeTextEditor.selection = new vscode.Selection(pos, pos);
}
// this method is called when your extension is deactivated
function deactivate() {
    setRegionMode(RegionMode.None);
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
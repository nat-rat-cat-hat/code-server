const vscode = require('vscode');

function findCodexTab() {
  for (const group of vscode.window.tabGroups.all) {
    for (const tab of group.tabs) {
      const input = tab.input;
      if (input instanceof vscode.TabInputWebview && /chatgpt|codex/i.test(input.viewType)) {
        return tab;
      }
    }
  }
  return undefined;
}

async function openMain() {
  const cfg = vscode.workspace.getConfiguration('ntch.codex');
  const existing = findCodexTab();
  if (existing) {
    const idx = existing.group.tabs.indexOf(existing);
    await vscode.commands.executeCommand('workbench.action.focusEditorGroup', existing.group.viewColumn);
    await vscode.commands.executeCommand('workbench.action.openEditorAtIndex', idx);
  } else {
    await vscode.commands.executeCommand('chatgpt.newCodexPanel');
  }
  if (cfg.get('hideSidebarPanel', true)) {
    await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
  }
}

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('ntch.codex.openMain', openMain));
  if (vscode.workspace.getConfiguration('ntch.codex').get('openOnStartup', true)) {
    setTimeout(() => { openMain().catch(err => console.error('[codex-main-window]', err)); }, 1500);
  }
}

function deactivate() {}

module.exports = { activate, deactivate };

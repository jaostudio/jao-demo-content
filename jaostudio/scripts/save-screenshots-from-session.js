const fs = require('fs');
const path = require('path');

const inputs = [
  path.join(process.env.APPDATA || 'C:\\Users\\Public', 'Code', 'User', 'workspaceStorage', '0d7abe0032ab622992cb10cdc05d194b', 'GitHub.copilot-chat', 'chat-session-resources', 'ac7dd1fa-c99d-4a4f-a469-368401eb9383', 'call_85bagNElSG1fRQakdlxjtnON__vscode-1780118350599', 'content.txt'),
  path.join(process.env.APPDATA || 'C:\\Users\\Public', 'Code', 'User', 'workspaceStorage', '0d7abe0032ab622992cb10cdc05d194b', 'GitHub.copilot-chat', 'chat-session-resources', 'ac7dd1fa-c99d-4a4f-a469-368401eb9383', 'call_G9XkfMZeKAJINdHwnQHO1gAP__vscode-1780118350601', 'content.txt')
];

const outDir = path.join(__dirname, '..', '.opencode', 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const inPath of inputs) {
  try {
    if (!fs.existsSync(inPath)) {
      console.error('Missing input:', inPath);
      continue;
    }
    let raw = fs.readFileSync(inPath, 'utf8');
    // Some session outputs include a leading 'Result: ' prefix; strip up to first '['
    const firstBracket = raw.indexOf('[');
    if (firstBracket > 0) raw = raw.slice(firstBracket);
    const arr = JSON.parse(raw);
    for (const item of arr) {
      const outPath = path.join(outDir, item.name);
      fs.writeFileSync(outPath, Buffer.from(item.data, 'base64'));
      console.log('Wrote', outPath);
    }
  } catch (err) {
    console.error('Error processing', inPath, err.message);
  }
}

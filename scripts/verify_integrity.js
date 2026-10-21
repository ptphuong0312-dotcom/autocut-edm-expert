const fs = require('fs');
const path = require('path');

const wsDir = path.join(__dirname, '..');
const appJs = fs.readFileSync(path.join(wsDir, 'app.js'), 'utf8');

// 1. Bracket and stack check
let clean = appJs.replace(/\/\*[\s\S]*?\*\//g, '');
clean = clean.replace(/\/\/.*$/gm, '');
clean = clean.replace(/`(?:\\[\s\S]|[^`])*`/g, '""');
clean = clean.replace(/"(?:\\[\s\S]|[^"\\])*"/g, '""');
clean = clean.replace(/'(?:\\[\s\S]|[^'\\])*'/g, "''");

const stack = [];
const pairs = { ')': '(', '}': '{', ']': '[' };
for (let idx = 0; idx < clean.length; idx++) {
    const ch = clean[idx];
    if (ch === '(' || ch === '{' || ch === '[') {
        stack.push({ ch, idx });
    } else if (ch === ')' || ch === '}' || ch === ']') {
        if (stack.length === 0) {
            console.error(`SYNTAX ERROR: Unmatched closing ${ch} at index ${idx}`);
            process.exit(1);
        }
        const top = stack.pop();
        if (top.ch !== pairs[ch]) {
            console.error(`SYNTAX ERROR: Mismatched ${top.ch} at ${top.idx} with ${ch} at ${idx}`);
            process.exit(1);
        }
    }
}

if (stack.length > 0) {
    console.error(`SYNTAX ERROR: Unmatched opening ${stack[stack.length - 1].ch} at index ${stack[stack.length - 1].idx}`);
    process.exit(1);
}
console.log("  [OK] Bracket balance and syntax integrity: PASSED");

// 2. Anti-Lookup-Table Law Check
const forbidden = ['anchorOffsetTarget', 'anchorOffset'];
for (const p of forbidden) {
    if (appJs.includes(p)) {
        console.error(`INTEGRITY VIOLATION: Forbidden pattern '${p}' found in app.js!`);
        process.exit(1);
    }
}
const required = ['C0', 'K_ELEC', 'DELTA_LOW', 'K_SLAG', 'K_VIBR', 'K_RZ'];
for (const c of required) {
    if (!appJs.includes(c)) {
        console.error(`INTEGRITY VIOLATION: Required constant '${c}' missing in app.js!`);
        process.exit(1);
    }
}
console.log("  [OK] Anti-Lookup-Table Law and Pure Physics Engine: PASSED");

// 3. Version synchronization check
const versionData = JSON.parse(fs.readFileSync(path.join(wsDir, 'version.json'), 'utf8'));
const ver = versionData.version;
const indexHtml = fs.readFileSync(path.join(wsDir, 'index.html'), 'utf8');
const swJs = fs.readFileSync(path.join(wsDir, 'sw.js'), 'utf8');

if (!indexHtml.includes(`v=${ver}`) && !indexHtml.includes(`v${ver}`)) {
    console.error(`Version mismatch in index.html! Expected ${ver}`);
    process.exit(1);
}
if (!swJs.includes(`autocut-v${ver}`)) {
    console.error(`Version mismatch in sw.js! Expected autocut-v${ver}`);
    process.exit(1);
}
console.log(`  [OK] Version synchronization (v${ver}): PASSED`);
console.log("=== ALL INTEGRITY CHECKS PASSED 100% ===");

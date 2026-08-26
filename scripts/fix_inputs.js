const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// Add variables for Tab 2 custom inputs
content = content.replace(
    /const customWireInput = document.getElementById\('custom-wire'\);/,
    `const customWireInput = document.getElementById('custom-wire');
    const wsBtnAnalyzeCustom = document.getElementById('ws-btn-analyze-custom');
    const wsCustomTiInput = document.getElementById('ws-custom-ti');
    const wsCustomPoInput = document.getElementById('ws-custom-po');
    const wsCustomIpInput = document.getElementById('ws-custom-ip');
    const wsCustomVoltInput = document.getElementById('ws-custom-volt');
    const wsCustomVfInput = document.getElementById('ws-custom-vf');
    const wsCustomWireInput = document.getElementById('ws-custom-wire');`
);

// Sync custom inputs
const customInputSyncCode = `
    function syncCustomInputs(sourceTab) {
        if (sourceTab === 'tab1') {
            if (wsCustomTiInput) wsCustomTiInput.value = customTiInput.value;
            if (wsCustomPoInput) wsCustomPoInput.value = customPoInput.value;
            if (wsCustomIpInput) wsCustomIpInput.value = customIpInput.value;
            if (wsCustomVoltInput) wsCustomVoltInput.value = customVoltInput.value;
            if (wsCustomVfInput) wsCustomVfInput.value = customVfInput.value;
            if (wsCustomWireInput) wsCustomWireInput.value = customWireInput.value;
        } else {
            if (customTiInput) customTiInput.value = wsCustomTiInput.value;
            if (customPoInput) customPoInput.value = wsCustomPoInput.value;
            if (customIpInput) customIpInput.value = wsCustomIpInput.value;
            if (customVoltInput) customVoltInput.value = wsCustomVoltInput.value;
            if (customVfInput) customVfInput.value = wsCustomVfInput.value;
            if (customWireInput) customWireInput.value = wsCustomWireInput.value;
        }
    }
`;

content = content.replace(
    /\[customTiInput, customPoInput, customIpInput, customVoltInput, customVfInput, customWireInput\]\.forEach\(inp => \{/,
    customInputSyncCode + `
    [customTiInput, customPoInput, customIpInput, customVoltInput, customVfInput, customWireInput].forEach(inp => {
        if (inp) {
            const handler = () => {
                syncCustomInputs('tab1');
                state.isCustomUserEdited = true;
                state.compareMode = 'custom';
                runCustomAnalysis(false);
            };
            inp.addEventListener('input', handler);
            inp.addEventListener('change', handler);
        }
    });
    [wsCustomTiInput, wsCustomPoInput, wsCustomIpInput, wsCustomVoltInput, wsCustomVfInput, wsCustomWireInput].forEach(inp => {
        if (inp) {
            const handler = () => {
                syncCustomInputs('tab2');
                state.isCustomUserEdited = true;
                state.compareMode = 'custom';
                runCustomAnalysis(false);
            };
            inp.addEventListener('input', handler);
            inp.addEventListener('change', handler);
        }
    });

    if (wsBtnAnalyzeCustom) {
        wsBtnAnalyzeCustom.addEventListener('click', () => {
            state.isCustomUserEdited = true;
            state.compareMode = 'custom';
            runCustomAnalysis(true);
        });
    }

    // Replace old handler
    /*`
);

content = content.replace(
    /        if \(inp\) \{\n            inp\.addEventListener\('input', \(\) => \{\n                state\.isCustomUserEdited = true;\n                state\.compareMode = 'custom';\n                runCustomAnalysis\(false\);\n            \}\);\n            inp\.addEventListener\('change', \(\) => \{\n                state\.isCustomUserEdited = true;\n                state\.compareMode = 'custom';\n                runCustomAnalysis\(false\);\n            \}\);\n        \}\n    \}\);/,
    `    */`
);

// We need to fix the replace above, it's safer to just do string manipulation.
fs.writeFileSync('fix.js', content);

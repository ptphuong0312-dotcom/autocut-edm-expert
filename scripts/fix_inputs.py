import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add variable declarations
add_vars = """const customWireInput = document.getElementById('custom-wire');
    const wsBtnAnalyzeCustom = document.getElementById('ws-btn-analyze-custom');
    const wsCustomTiInput = document.getElementById('ws-custom-ti');
    const wsCustomPoInput = document.getElementById('ws-custom-po');
    const wsCustomIpInput = document.getElementById('ws-custom-ip');
    const wsCustomVoltInput = document.getElementById('ws-custom-volt');
    const wsCustomVfInput = document.getElementById('ws-custom-vf');
    const wsCustomWireInput = document.getElementById('ws-custom-wire');"""
content = re.sub(r"const customWireInput = document.getElementById\('custom-wire'\);", add_vars, content)

# 2. Add populateSmoothCustomDefaults sync
smooth_defaults = """            customTiInput.value = smoothRow.ti;
            customPoInput.value = smoothRow.Po;
            customIpInput.value = smoothRow.IP;
            customVoltInput.value = smoothRow.Voltage;
            customVfInput.value = smoothRow.VF;
            customWireInput.value = smoothRow.Wire;
            
            if (wsCustomTiInput) wsCustomTiInput.value = smoothRow.ti;
            if (wsCustomPoInput) wsCustomPoInput.value = smoothRow.Po;
            if (wsCustomIpInput) wsCustomIpInput.value = smoothRow.IP;
            if (wsCustomVoltInput) wsCustomVoltInput.value = smoothRow.Voltage;
            if (wsCustomVfInput) wsCustomVfInput.value = smoothRow.VF;
            if (wsCustomWireInput) wsCustomWireInput.value = smoothRow.Wire;"""
content = re.sub(r"            customTiInput\.value = smoothRow\.ti;\n.*?customWireInput\.value = smoothRow\.Wire;", smooth_defaults, content, flags=re.DOTALL)

# 3. Replace the input event listeners
old_listeners = """    \[customTiInput, customPoInput, customIpInput, customVoltInput, customVfInput, customWireInput\].forEach\(inp => \{
        if \(inp\) \{
            inp.addEventListener\('input', \(\) => \{
                state.isCustomUserEdited = true;
                state.compareMode = 'custom';
                runCustomAnalysis\(false\);
            \}\);
            inp.addEventListener\('change', \(\) => \{
                state.isCustomUserEdited = true;
                state.compareMode = 'custom';
                runCustomAnalysis\(false\);
            \}\);
        \}
    \}\);"""

new_listeners = """    function syncCustomInputs(sourceTab) {
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
    }"""
content = re.sub(old_listeners, new_listeners, content)

# 4. Bump version from 3.4.1 to 3.4.2
content = content.replace("3.4.1", "3.4.2")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

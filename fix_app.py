import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. We will replace the wsTableBody.innerHTML block in render()
# First find the wsTableBody.innerHTML block
old_ws_block_pattern = re.compile(r"wsTableBody\.innerHTML = rows\.map\(\(r, idx\) => \{.*?\}\)\.join\(''\);", re.DOTALL)

new_ws_block = r"""wsTableBody.innerHTML = rows.map((r, idx) => {
                // Workshop Logic mapping from standard row
                const ti = parseFloat(r.ti);
                const Po = parseFloat(r.Po);
                const IP = parseFloat(r.IP);
                const isPass1 = (idx === 0);
                
                // Offset: Workshop machine vibrates more, kerf is wider. Add 0.011mm to offset.
                const stdOffset = parseFloat(r.offsetText);
                const wsOffset = (stdOffset + 0.011).toFixed(3);
                
                // Fc & Ft: Workshop machine is ~15% slower due to flushing efficiency
                const wsSpeedArea = Math.round(r.speedArea * 0.85);
                const wsFeedRate = (wsSpeedArea / state.thickness).toFixed(2);
                
                // Hz: User specified 200Hz ~ 480mm2/min => Hz = Fc / 2.4
                const wsHz = Math.round(wsSpeedArea / 2.4);
                
                // Ampe: Standard peak current, but Workshop uses a different ammeter calibration (~2.28)
                const toff = ti * Po;
                const cycle = ti + toff;
                const duty = ti / cycle;
                const i_peak = IP * 2.8;
                // kAmpe = 2.2857 (from WORKSHOP_CALIBRATION_MODEL)
                const wsAmpe = (i_peak * duty * 2.2857).toFixed(1);
                
                // Ra: slightly rougher
                let wsRa = r.Ra;
                const raParts = r.Ra.split(' - ');
                if (raParts.length === 2) {
                    wsRa = (parseFloat(raParts[0]) + 0.2).toFixed(1) + ' - ' + (parseFloat(raParts[1]) + 0.2).toFixed(1);
                }

                return `
                    <tr>
                        <td class="pass-cell sticky-col"><span class="pass-badge ${r.badgeClass}">${r.passName}</span></td>
                        <td><strong>${r.ti}</strong></td>
                        <td>${r.Po}</td>
                        <td><span class="badge-ip">${r.IP}</span></td>
                        <td><span class="${r.Voltage === 'High' ? 'val-volt-high' : 'val-volt-low'}">${r.Voltage}</span></td>
                        <td>${r.VF}</td>
                        <td>${r.Wire}</td>
                        <td class="val-offset" style="color:var(--accent-amber);">${wsOffset}mm</td>
                        <td><span style="color:var(--accent-amber);">${wsSpeedArea}</span></td>
                        <td><strong style="color:var(--accent-amber);">${wsFeedRate}</strong></td>
                        <td><strong style="color:var(--accent-amber);">${wsHz} Hz</strong></td>
                        <td><strong style="color:var(--accent-amber);">${isPass1 ? wsAmpe : '< 0.1'}</strong></td>
                        <td class="val-ra">${wsRa}</td>
                    </tr>
                `;
            }).join('');"""

content = old_ws_block_pattern.sub(new_ws_block, content)

# 2. Fix the comparison table part in runCustomAnalysis.
# Since ws-analysis-container is removed, we can just remove the code trying to render to workshopTableElement
# It's inside `if (workshopTableElement) { ... }`
# We'll just leave it be, as `workshopTableElement` will be null and it won't crash.

# 3. Bump version to 3.4.3
content = content.replace("3.4.2", "3.4.3")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

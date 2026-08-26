import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the entire render() function and replace it.
# The render function starts at `function render() {`
# And ends before `    // ==========================================\n    // 6. COPY TABLE TO CLIPBOARD`

start_marker = "    function render() {"
end_marker = "    // ==========================================\n    // 6. COPY TABLE TO CLIPBOARD"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    exit(1)

new_render = """    function render() {
        const strat = STRATEGY_CONFIGS[state.strategyLevel] || STRATEGY_CONFIGS[6];
        const passLabel = state.passCount === 1 ? '1 Pass' : `${state.passCount} Pass (Multi-Cut)`;
        const matNames = {
            'SCM420': 'Thép SCM420 (Thép mềm)',
            'SCM440': 'Thép tôi SCM440 (Thép cứng)',
            'COPPER': 'Đồng (Cu / Đồng thau)',
            'ALUMINUM': 'Nhôm (Al 6061 / 7075)'
        };
        const matLabel = matNames[state.material] || state.material;

        if (typeof configSummary !== 'undefined' && configSummary) {
            configSummary.textContent = `${matLabel} | H = ${state.thickness} mm | ${passLabel} | Chiến lược: ${strat.name}`;
        }
        if (typeof wsConfigSummary !== 'undefined' && wsConfigSummary) {
            wsConfigSummary.textContent = `Hiệu chuẩn theo máy thực tế xưởng | ${matLabel} | H = ${state.thickness} mm | ${passLabel} | Chiến lược: ${strat.name}`;
        }

        // Compute parameters
        const { rows, totalMinutes, notices } = calculateEDM(state);
        const wsCalc = calculateWorkshopEDM(state);

        // Render Table Body (Tab 1)
        if (typeof tableBody !== 'undefined' && tableBody) {
            tableBody.innerHTML = rows.map(r => `
                <tr>
                    <td class="pass-cell sticky-col"><span class="pass-badge ${r.badgeClass}">${r.passName}</span></td>
                    <td><strong>${r.ti}</strong></td>
                    <td>${r.Po}</td>
                    <td><span class="badge-ip">${r.IP}</span></td>
                    <td><span class="${r.Voltage === 'High' ? 'val-volt-high' : 'val-volt-low'}">${r.Voltage}</span></td>
                    <td>${r.VF}</td>
                    <td>${r.Wire}</td>
                    <td class="val-offset">${r.offsetText}</td>
                    <td>${r.speedArea}</td>
                    <td><strong>${r.feedRate}</strong></td>
                    <td class="val-ra">${r.Ra}</td>
                    <td class="val-tolerance">${r.tolerance}</td>
                </tr>
            `).join('');
        }

        // Render Workshop Table Body (Tab 2)
        if (typeof wsTableBody !== 'undefined' && wsTableBody) {
            wsTableBody.innerHTML = rows.map((r, idx) => {
                if (idx === 0) {
                    // Pass 1: Use Workshop specific data
                    return `
                        <tr>
                            <td class="pass-cell sticky-col"><span class="pass-badge ${r.badgeClass}">${r.passName}</span></td>
                            <td><strong>${wsCalc.ti}</strong></td>
                            <td>${wsCalc.Po}</td>
                            <td><span class="badge-ip">${wsCalc.IP}</span></td>
                            <td><span class="${wsCalc.Voltage === 'High' ? 'val-volt-high' : 'val-volt-low'}">${wsCalc.Voltage}</span></td>
                            <td>${wsCalc.VF}</td>
                            <td>${wsCalc.Wire}</td>
                            <td class="val-offset" style="color:var(--accent-amber);">${wsCalc.offset}mm</td>
                            <td><span style="color:var(--accent-amber);">${wsCalc.speedArea}</span></td>
                            <td><strong style="color:var(--accent-amber);">${wsCalc.feedRate}</strong></td>
                            <td><strong style="color:var(--accent-amber);">${wsCalc.i_tb_high}A</strong></td>
                            <td class="val-ra">${wsCalc.Ra}</td>
                        </tr>
                    `;
                } else {
                    // Pass > 1: Use standard calculation but adjust presentation
                    const ampe = idx === 1 ? '0.1-0.2A' : '<0.1A';
                    return `
                        <tr>
                            <td class="pass-cell sticky-col"><span class="pass-badge ${r.badgeClass}">${r.passName}</span></td>
                            <td><strong>${r.ti}</strong></td>
                            <td>${r.Po}</td>
                            <td><span class="badge-ip">${r.IP}</span></td>
                            <td><span class="${r.Voltage === 'High' ? 'val-volt-high' : 'val-volt-low'}">${r.Voltage}</span></td>
                            <td>${r.VF}</td>
                            <td>${r.Wire}</td>
                            <td class="val-offset">${r.offsetText}</td>
                            <td>${r.speedArea}</td>
                            <td><strong>${r.feedRate}</strong></td>
                            <td>${ampe}</td>
                            <td class="val-ra">${r.Ra}</td>
                        </tr>
                    `;
                }
            }).join('');
        }

        // Render Notices
        if (typeof noticeList !== 'undefined' && noticeList) {
            noticeList.innerHTML = notices.map(n => `<li>${n}</li>`).join('');
        }
        
        // Render Workshop Notices
        const wsNoticeList = document.getElementById('ws-notice-list');
        if (typeof wsNoticeList !== 'undefined' && wsNoticeList) {
            wsNoticeList.innerHTML = notices.map(n => `<li>${n}</li>`).join('');
        }

        // Render Total Time
        if (typeof totalTimeText !== 'undefined' && totalTimeText) {
            if (totalMinutes < 60) {
                totalTimeText.textContent = `${totalMinutes.toFixed(1)} phút`;
            } else {
                const hrs = Math.floor(totalMinutes / 60);
                const mins = Math.round(totalMinutes % 60);
                totalTimeText.textContent = `${hrs} giờ ${mins} phút (~${totalMinutes.toFixed(0)}p)`;
            }
        }

        if (typeof wsTotalTimeText !== 'undefined' && wsTotalTimeText) {
            const wsTimeMins = parseFloat(wsCalc.time_min);
            if (wsTimeMins < 60) {
                wsTotalTimeText.textContent = `${wsTimeMins.toFixed(1)} phút`;
            } else {
                const hrs = Math.floor(wsTimeMins / 60);
                const mins = Math.round(wsTimeMins % 60);
                wsTotalTimeText.textContent = `${hrs} giờ ${mins} phút (~${wsTimeMins.toFixed(0)}p)`;
            }
        }

        // Tự động nạp chế độ bề mặt mịn tương ứng vào ô nhập riêng & Chạy phân tích so sánh mặc định
        populateSmoothCustomDefaults();
        runCustomAnalysis(false);
    }

"""

new_content = content[:start_idx] + new_render + content[end_idx:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Render fixed")

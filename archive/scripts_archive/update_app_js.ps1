[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$appPath = "app.js"
$content = [System.IO.File]::ReadAllText($appPath, [System.Text.Encoding]::UTF8)

# 1. Thêm hàm calcTheoreticalAmpe ngay trên generateWorkshopRows
$targetAmpeFn = "    // ==========================================
    // WORKSHOP CALIBRATION LOGIC (TAB 2)
    // =========================================="

$replacementAmpeFn = @"
    // ==========================================
    // WORKSHOP CALIBRATION LOGIC (TAB 2)
    // ==========================================

    // HÀM TÍNH TOÁN DÒNG ĐIỆN AMPE KẾ MODEL VÒNG 5 (CHUẨN HÓA THỰC NGHIỆM XƯỞNG)
    function calcTheoreticalAmpe(IP, Po, H, Volt) {
        const duty = 1.0 / (Po + 2.0);
        const u_arc = (Volt === 'Low' || Volt === 'L') ? 22.0 : 27.0;
        const eta_po = 1.0 - 0.33 * ((Po - 5.0) / 10.0);
        const eta_h = 1.0 - 0.08 * (H / (H + 20.0));
        const k_scale = 8.55;
        const ampe = IP * duty * k_scale * eta_po * (u_arc / 27.0) * eta_h;
        return Math.max(0.2, ampe);
    }
"@

if ($content.Contains($targetAmpeFn)) {
    $content = $content.Replace($targetAmpeFn, $replacementAmpeFn)
    Write-Host "Success: calcTheoreticalAmpe function injected."
} else {
    Write-Host "Warning: targetAmpeFn not found."
}

# 2. Cập nhật row.ampe trong generateWorkshopRows
$targetAmpeRow = @"
                let calculatedAmpe = i_peak * duty * 2.6667 * (u_arc / 27);
                if (IP === 5 && Po === 8 && Volt === 'High') {
                    row.ampe = '3.5'; // Khóa chuẩn ngưỡng trên 3.5A cho dải H100-H160 theo quy tắc Ampe
                } else {
                    row.ampe = calculatedAmpe.toFixed(1);
                }
"@

$replacementAmpeRow = @"
                let calculatedAmpe = calcTheoreticalAmpe(IP, Po, H, Volt);
                row.ampe = calculatedAmpe.toFixed(1);
"@

if ($content.Contains($targetAmpeRow)) {
    $content = $content.Replace($targetAmpeRow, $replacementAmpeRow)
    Write-Host "Success: row.ampe updated with Model Round 5."
} else {
    Write-Host "Warning: targetAmpeRow not found."
}

# 3. Cập nhật calcVFSparkGap
$targetVFAmpe = "        const calculatedAmpe = i_peak * duty * 2.6667 * (u_arc / 27);"
$replacementVFAmpe = "        const calculatedAmpe = calcTheoreticalAmpe(IP, Po, H, Volt);"

if ($content.Contains($targetVFAmpe)) {
    $content = $content.Replace($targetVFAmpe, $replacementVFAmpe)
    Write-Host "Success: calcVFSparkGap ampe updated."
} else {
    Write-Host "Warning: targetVFAmpe not found."
}

# 4. Guard cho populateSmoothCustomDefaults
$targetPopulate = "    function populateSmoothCustomDefaults(force = false) {
        if (!force && state.isCustomUserEdited) return;"

$replacementPopulate = "    function populateSmoothCustomDefaults(force = false) {
        if (!customTiInput) return;
        if (!force && state.isCustomUserEdited) return;"

if ($content.Contains($targetPopulate)) {
    $content = $content.Replace($targetPopulate, $replacementPopulate)
    Write-Host "Success: populateSmoothCustomDefaults guard added."
}

# 5. Guard cho runCustomAnalysis
$targetRunAnalysis = "    function runCustomAnalysis(shouldScroll = false) {
        const H = state.thickness;"

$replacementRunAnalysis = "    function runCustomAnalysis(shouldScroll = false) {
        if (!customTiInput) return;
        const H = state.thickness;"

if ($content.Contains($targetRunAnalysis)) {
    $content = $content.Replace($targetRunAnalysis, $replacementRunAnalysis)
    Write-Host "Success: runCustomAnalysis guard added."
}

# 6. Guard cho analysisContainer
$targetAnalysisContainer = "        // Luôn hiển thị khung so sánh mặc định
        analysisContainer.style.display = 'block';
        if (shouldScroll) {
            analysisContainer.scrollIntoView({ behavior: 'smooth' });
        }"

$replacementAnalysisContainer = "        // Luôn hiển thị khung so sánh mặc định nếu tồn tại
        if (analysisContainer) {
            analysisContainer.style.display = 'block';
            if (shouldScroll) {
                analysisContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }"

if ($content.Contains($targetAnalysisContainer)) {
    $content = $content.Replace($targetAnalysisContainer, $replacementAnalysisContainer)
    Write-Host "Success: analysisContainer guard added."
}

# 7. Cập nhật ô "6 Chế Độ Cắt" với SVG mũi tên hướng xuống
$targetBadge = '<span class="lib-offline-badge" style="display: inline-flex; align-items: center; gap: 6px;">6 Chế Độ Cắt <span id="ws-lib-toggle-icon" style="color: var(--accent-cyan); font-size: 11px; transition: transform 0.3s; transform: rotate(0deg); display: inline-block;">▼</span></span>'

$replacementBadge = '<span class="lib-offline-badge" style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px 10px; border-radius: 14px; background: rgba(192, 132, 252, 0.18); border: 1px solid rgba(192, 132, 252, 0.45); color: #d8b4fe; font-weight: 600; font-size: 11px;"><span>6 Chế Độ Cắt</span><svg id="ws-lib-toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform: rotate(0deg); color: #c084fc; display: inline-block;"><polyline points="6 9 12 15 18 9"></polyline></svg></span>'

if ($content.Contains($targetBadge)) {
    $content = $content.Replace($targetBadge, $replacementBadge)
    Write-Host "Success: 6 Chế Độ Cắt badge updated with SVG chevron."
} else {
    Write-Host "Warning: targetBadge not found."
}

# 8. Cập nhật version trong app.js
$content = $content.Replace('const CURRENT_VERSION = "3.5.55";', 'const CURRENT_VERSION = "3.5.56";')

# 9. Ghi file app.js
[System.IO.File]::WriteAllText($appPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "All basic replacements in app.js finished."

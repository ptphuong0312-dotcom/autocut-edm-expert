$appPath = "app.js"
$text = [System.IO.File]::ReadAllText($appPath, [System.Text.Encoding]::UTF8)

# 1. ChÃ¨n hÃ m calcTheoreticalAmpe trÆ°á»›c generateWorkshopRows náº¿u chÆ°a cÃ³
if (-not $text.Contains("function calcTheoreticalAmpe(")) {
    $targetAmpe = "    // Há»† THá»NG LAI Táº O Dá»® LIá»†U & NHÃ‚N QUáº¢ BÃ™ DAO (RULE 06, 07, 08)"
    $replaceAmpe = @"
    // =========================================================================
    // HÃ€M TÃNH TOÃN DÃ’NG ÄIá»†N AMPE Káº¾ MODEL VÃ’NG 5 (CHUáº¨N HÃ“A THá»°C NGHIá»†M XÆ¯á»žNG)
    // =========================================================================
    function calcTheoreticalAmpe(IP, Po, H, Volt) {
        const duty = 1.0 / (Po + 2.0);
        const u_arc = (Volt === 'Low' || Volt === 'L') ? 22.0 : 27.0;
        const eta_po = 1.0 - 0.33 * ((Po - 5.0) / 10.0);
        const eta_h = 1.0 - 0.08 * (H / (H + 20.0));
        const k_scale = 8.55;
        const ampe = IP * duty * k_scale * eta_po * (u_arc / 27.0) * eta_h;
        return Math.max(0.2, ampe);
    }

    // Há»† THá»NG LAI Táº O Dá»® LIá»†U & NHÃ‚N QUáº¢ BÃ™ DAO (RULE 06, 07, 08)
"@
    $text = $text.Replace($targetAmpe, $replaceAmpe)
    Write-Host "Success: Injected calcTheoreticalAmpe before generateWorkshopRows."
} else {
    Write-Host "Notice: calcTheoreticalAmpe already present."
}

# 2. Cáº­p nháº­t Ã´ 6 Cháº¿ Äá»™ Cáº¯t vá»›i SVG chevron rÃµ nÃ©t
$badBadgePattern = '<span class="lib-offline-badge"[^>]*>.*?<\/span><\/span>'
$replacementBadge = '<span class="lib-offline-badge" style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px 10px; border-radius: 14px; background: rgba(192, 132, 252, 0.18); border: 1px solid rgba(192, 132, 252, 0.45); color: #d8b4fe; font-weight: 600; font-size: 11px;"><span>6 Cháº¿ Äá»™ Cáº¯t</span><svg id="ws-lib-toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform: rotate(0deg); color: #c084fc; display: inline-block;"><polyline points="6 9 12 15 18 9"></polyline></svg></span>'

$text = [System.Text.RegularExpressions.Regex]::Replace($text, $badBadgePattern, $replacementBadge)

# 3. Cáº­p nháº­t cÃ¡c giÃ¡ trá»‹ calcAmpe trong WS_LIB_BENCHMARK_JOBS
# 1 Pass
$text = $text.Replace('calcAmpe: "3.2A", actualSpeed: "275-285 mm', 'calcAmpe: "3.6A", actualSpeed: "275-285 mm') # 1P-5P01
$text = $text.Replace('calcAmpe: "2.3A", actualSpeed: "--", calcSpeedH40: "143', 'calcAmpe: "2.5A", actualSpeed: "--", calcSpeedH40: "143') # STT 22
$text = $text.Replace('calcAmpe: "4.3A", actualSpeed: "165-175 mm', 'calcAmpe: "4.7A", actualSpeed: "165-175 mm') # STT 1
$text = $text.Replace('calcAmpe: "4.3A", actualSpeed: "130-140 mm', 'calcAmpe: "4.6A", actualSpeed: "130-140 mm') # STT 2
$text = $text.Replace('calcAmpe: "4.1A", actualSpeed: "75-85 mm', 'calcAmpe: "4.2A", actualSpeed: "75-85 mm') # STT 3
$text = $text.Replace('calcAmpe: "3.0A", actualSpeed: "50-65 mm', 'calcAmpe: "2.9A", actualSpeed: "50-65 mm') # STT 18
$text = $text.Replace('calcAmpe: "3.7A", actualSpeed: "55-65 mm', 'calcAmpe: "3.6A", actualSpeed: "55-65 mm') # 1P-2P10
$text = $text.Replace('calcAmpe: "3.1A", actualSpeed: "30-40 mm', 'calcAmpe: "2.8A", actualSpeed: "30-40 mm') # STT 19
$text = $text.Replace('calcAmpe: "3.7A", actualSpeed: "--", calcSpeedH40: "31', 'calcAmpe: "3.6A", actualSpeed: "--", calcSpeedH40: "31') # STT 7
$text = $text.Replace('calcAmpe: "4.1A", actualSpeed: "30-40 mm', 'calcAmpe: "3.8A", actualSpeed: "30-40 mm') # STT 12
$text = $text.Replace('calcAmpe: "3.4A", actualSpeed: "18-28 mm', 'calcAmpe: "2.9A", actualSpeed: "18-28 mm') # STT 15
$text = $text.Replace('calcAmpe: "3.4A", actualSpeed: "15-35 mm', 'calcAmpe: "2.9A", actualSpeed: "15-35 mm') # 1P-2P12
$text = $text.Replace('calcAmpe: "3.7A", actualSpeed: "--", calcSpeedH40: "19', 'calcAmpe: "3.5A", actualSpeed: "--", calcSpeedH40: "19') # STT 23
$text = $text.Replace('calcAmpe: "3.7A", actualSpeed: "--", calcSpeedH40: "14', 'calcAmpe: "3.4A", actualSpeed: "--", calcSpeedH40: "14') # STT 20
$text = $text.Replace('calcAmpe: "4.1A", actualSpeed: "12-20 mm', 'calcAmpe: "3.7A", actualSpeed: "12-20 mm') # STT 14

# 2 Pass - Pass 1
$text = $text.Replace('calcAmpe: "3.7A", actualSpeed: "140-150 mm', 'calcAmpe: "4.0A", actualSpeed: "140-150 mm') # H=30 P1
$text = $text.Replace('calcAmpe: "3.2A", actualSpeed: "65-75 mm', 'calcAmpe: "3.3A", actualSpeed: "65-75 mm') # H=60 P1
$text = $text.Replace('calcAmpe: "3.2A", actualSpeed: "--", calcSpeedH40: "85', 'calcAmpe: "3.3A", actualSpeed: "--", calcSpeedH40: "85') # H=62 P1
$text = $text.Replace('calcAmpe: "4.0A", actualSpeed: "75-85 mm', 'calcAmpe: "4.2A", actualSpeed: "75-85 mm') # H=63 P1
$text = $text.Replace('calcAmpe: "3.2A", actualSpeed: "50-65 mm', 'calcAmpe: "3.3A", actualSpeed: "50-65 mm') # H=75 P1
$text = $text.Replace('calcAmpe: "3.6A", actualSpeed: "--", calcSpeedH40: "34', 'calcAmpe: "3.6A", actualSpeed: "--", calcSpeedH40: "34') # H=140 P1
$text = $text.Replace('calcAmpe: "3.2A", actualSpeed: "15-35 mm', 'calcAmpe: "2.9A", actualSpeed: "15-35 mm') # H=165 P1

# LÆ°u file vá»›i UTF-8 chuáº©n
[System.IO.File]::WriteAllText($appPath, $text, [System.Text.Encoding]::UTF8)
Write-Host "Success: All updates committed to app.js."
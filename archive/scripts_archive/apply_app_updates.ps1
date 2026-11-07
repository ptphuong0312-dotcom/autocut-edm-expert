$lines = [System.IO.File]::ReadAllLines("app.js", [System.Text.Encoding]::UTF8)
$newLines = [System.Collections.Generic.List[string]]::new()

$i = 0
while ($i -lt $lines.Length) {
    $line = $lines[$i]

    # 1. Inject calcTheoreticalAmpe before generateWorkshopRows
    if ($line.Contains("WORKSHOP CALIBRATION LOGIC (TAB 2)")) {
        $newLines.Add($line)
        $newLines.Add("    // ==========================================")
        $newLines.Add("")
        $newLines.Add("    // HAM TINH TOAN DONG DIEN AMPE KE MODEL VONG 5 (CHUAN HOA THUC NGHIEM XUONG)")
        $newLines.Add("    function calcTheoreticalAmpe(IP, Po, H, Volt) {")
        $newLines.Add("        const duty = 1.0 / (Po + 2.0);")
        $newLines.Add("        const u_arc = (Volt === 'Low' || Volt === 'L') ? 22.0 : 27.0;")
        $newLines.Add("        const eta_po = 1.0 - 0.33 * ((Po - 5.0) / 10.0);")
        $newLines.Add("        const eta_h = 1.0 - 0.08 * (H / (H + 20.0));")
        $newLines.Add("        const k_scale = 8.55;")
        $newLines.Add("        const ampe = IP * duty * k_scale * eta_po * (u_arc / 27.0) * eta_h;")
        $newLines.Add("        return Math.max(0.2, ampe);")
        $newLines.Add("    }")
        $i++ # skip next comment line if it was border
        if ($i -lt $lines.Length -and $lines[$i].Contains("========")) {
            # skipped
        } else {
            $newLines.Add($lines[$i])
        }
        $i++
        continue
    }

    # 2. Update row.ampe in generateWorkshopRows
    if ($line.Contains("let calculatedAmpe = i_peak * duty * 2.6667 * (u_arc / 27);")) {
        $newLines.Add("                let calculatedAmpe = calcTheoreticalAmpe(IP, Po, H, Volt);")
        $newLines.Add("                row.ampe = calculatedAmpe.toFixed(1);")
        # skip until after row.ampe = calculatedAmpe.toFixed(1); }
        while ($i -lt $lines.Length -and -not $lines[$i].Contains("row.ampe = calculatedAmpe.toFixed(1);")) {
            $i++
        }
        if ($i -lt $lines.Length -and $lines[$i+1].Trim() -eq "}") {
            $i++ # skip the closing bracket of if-else
        }
        $i++
        continue
    }

    # 3. Update calcVFSparkGap ampe
    if ($line.Contains("const calculatedAmpe = i_peak * duty * 2.6667 * (u_arc / 27);")) {
        $newLines.Add("        const calculatedAmpe = calcTheoreticalAmpe(IP, Po, H, Volt);")
        $i++
        continue
    }

    # 4. Guard in populateSmoothCustomDefaults
    if ($line.Contains("function populateSmoothCustomDefaults(force = false) {")) {
        $newLines.Add($line)
        $newLines.Add("        if (!customTiInput) return;")
        $i++
        continue
    }

    # 5. Guard in runCustomAnalysis
    if ($line.Contains("function runCustomAnalysis(shouldScroll = false) {")) {
        $newLines.Add($line)
        $newLines.Add("        if (!customTiInput) return;")
        $i++
        continue
    }

    # 6. Guard for analysisContainer
    if ($line.Trim() -eq "analysisContainer.style.display = 'block';") {
        $newLines.Add("        if (analysisContainer) {")
        $newLines.Add("            analysisContainer.style.display = 'block';")
        $newLines.Add("            if (shouldScroll) {")
        $newLines.Add("                analysisContainer.scrollIntoView({ behavior: 'smooth' });")
        $newLines.Add("            }")
        $newLines.Add("        }")
        # skip the following if (shouldScroll) { analysisContainer... } block
        while ($i -lt $lines.Length -and -not $lines[$i].Contains("scrollIntoView")) {
            $i++
        }
        if ($i -lt $lines.Length -and $lines[$i+1].Trim() -eq "}") {
            $i++ # skip closing brace of shouldScroll
        }
        $i++
        continue
    }

    # 7. Update 6 Che Do Cat badge with SVG chevron
    if ($line.Contains("6 Ch") -and $line.Contains("ws-lib-toggle-icon")) {
        $svgBadge = '                            <span class="lib-offline-badge" style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px 10px; border-radius: 14px; background: rgba(192, 132, 252, 0.18); border: 1px solid rgba(192, 132, 252, 0.45); color: #d8b4fe; font-weight: 600; font-size: 11px;"><span>6 Chế Độ Cắt</span><svg id="ws-lib-toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform: rotate(0deg); color: #c084fc; display: inline-block;"><polyline points="6 9 12 15 18 9"></polyline></svg></span>'
        $newLines.Add($svgBadge)
        $i++
        continue
    }

    # 8. Version bump
    if ($line.Contains('const CURRENT_VERSION = "3.5.55";')) {
        $newLines.Add('    const CURRENT_VERSION = "3.5.56";')
        $i++
        continue
    }

    $newLines.Add($line)
    $i++
}

[System.IO.File]::WriteAllLines("app.js", $newLines, [System.Text.Encoding]::UTF8)
Write-Host "app.js successfully updated. Total lines: $($newLines.Count)"

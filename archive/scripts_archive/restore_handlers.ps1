$lines = [System.IO.File]::ReadAllLines("app.js", [System.Text.Encoding]::UTF8)
$newLines = [System.Collections.Generic.List[string]]::new()

$i = 0
while ($i -lt $lines.Length) {
    # 1. Fix btnModeCustom and btnModeTheory
    if ($lines[$i].Contains("// Mode Switch Buttons")) {
        $newLines.Add($lines[$i])
        $newLines.Add("    if (btnModeCustom) {")
        $newLines.Add("        btnModeCustom.addEventListener('click', () => {")
        $newLines.Add("            state.compareMode = 'custom';")
        $newLines.Add("            runCustomAnalysis(false);")
        $newLines.Add("        });")
        $newLines.Add("    }")
        $newLines.Add("")
        $newLines.Add("    if (btnModeTheory) {")
        $newLines.Add("        btnModeTheory.addEventListener('click', () => {")
        $newLines.Add("            state.compareMode = 'theory';")
        $newLines.Add("            runCustomAnalysis(false);")
        $newLines.Add("        });")
        $newLines.Add("    }")
        $newLines.Add("")
        # Skip until btnAnalyzeCustom
        while ($i -lt $lines.Length -and -not $lines[$i].Contains("if (btnAnalyzeCustom)")) {
            $i++
        }
        continue
    }

    # 2. Fix btnToggleCompact
    if ($lines[$i].Contains("if (btnToggleCompact)")) {
        $newLines.Add("    if (btnToggleCompact) {")
        $newLines.Add("        btnToggleCompact.addEventListener('click', () => {")
        $newLines.Add("            state.compactMetrics = !state.compactMetrics;")
        $newLines.Add("            if (state.compactMetrics) {")
        $newLines.Add("                compactText.innerHTML = 'Ký hiệu viết tắt: <strong>BẬT</strong>';")
        $newLines.Add("                comparisonTableElement.classList.add('compact-mode');")
        $newLines.Add("            } else {")
        $newLines.Add("                compactText.innerHTML = 'Ký hiệu viết tắt: <strong>TẮT (Hiện đủ)</strong>';")
        $newLines.Add("                comparisonTableElement.classList.remove('compact-mode');")
        $newLines.Add("            }")
        $newLines.Add("            runCustomAnalysis(false);")
        $newLines.Add("        });")
        $newLines.Add("    }")
        # Skip until btnToggleWorkshop
        while ($i -lt $lines.Length -and -not $lines[$i].Contains("if (btnToggleWorkshop")) {
            $i++
        }
        continue
    }

    $newLines.Add($lines[$i])
    $i++
}

[System.IO.File]::WriteAllLines("app.js", $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Restored 3 handlers successfully."

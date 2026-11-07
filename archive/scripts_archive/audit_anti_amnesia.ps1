# Forensic Audit for Anti-Amnesia Architecture

Write-Host "=== 1. CORE BRAIN & RULE FILES METRICS ===" -ForegroundColor Cyan
$brainFiles = @(
    'GEMINI.md',
    'AGENTS.md',
    'CURRENT_STATE.md',
    'WORKSHOP_DATA_BANK.md',
    'TUDIEN_EDM.md',
    'SOP_NEW_DATA_INTEGRATION.md'
)

foreach ($f in $brainFiles) {
    if (Test-Path $f) {
        $item = Get-Item $f
        $lines = (Get-Content $f -Encoding UTF8).Count
        $bytes = $item.Length
        $kb = [math]::Round($bytes / 1024, 2)
        $status = "OK"
        if ($f -eq 'GEMINI.md' -and $bytes -gt 10240) { $status = "OVERSIZED (>10KB)" }
        elseif ($bytes -gt 46080) { $status = "OVERSIZED (>46KB read_file limit)" }
        Write-Host ("{0,-30} | {1,6} lines | {2,8} KB | {3}" -f $f, $lines, $kb, $status)
    } else {
        Write-Host ("{0,-30} | NOT FOUND" -f $f)
    }
}

Write-Host "`n=== 2. DOCS DIRECTORY METRICS ===" -ForegroundColor Cyan
$docFiles = Get-ChildItem -Path docs -Filter *.md -Recurse -File
foreach ($f in $docFiles) {
    $lines = (Get-Content $f.FullName -Encoding UTF8).Count
    $bytes = $f.Length
    $kb = [math]::Round($bytes / 1024, 2)
    $status = if ($bytes -gt 46080) { "EXCEEDS READ_FILE (46KB)!" } else { "OK" }
    Write-Host ("{0,-40} | {1,6} lines | {2,8} KB | {3}" -f ($f.FullName.Substring((Get-Location).Path.Length + 1)), $lines, $kb, $status)
}

Write-Host "`n=== 3. .AGENTS/RULES METRICS ===" -ForegroundColor Cyan
$ruleFiles = Get-ChildItem -Path .agents/rules -Filter *.md -File
foreach ($f in $ruleFiles) {
    $lines = (Get-Content $f.FullName -Encoding UTF8).Count
    $bytes = $f.Length
    $kb = [math]::Round($bytes / 1024, 2)
    $status = if ($bytes -gt 15360) { "HEAVY (>15KB)" } else { "OK" }
    Write-Host ("{0,-50} | {1,6} lines | {2,8} KB | {3}" -f $f.Name, $lines, $kb, $status)
}

Write-Host "`n=== 4. NULL BYTE (0x00) CHECK ACROSS ALL MD FILES ===" -ForegroundColor Cyan
$allMd = Get-ChildItem -Path . -Filter *.md -Recurse -File | Where-Object { $_.FullName -notmatch '\\\.git\\' }
$corruptedCount = 0
foreach ($f in $allMd) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    if ($bytes -contains 0) {
        Write-Host ("[CORRUPTED - NULL BYTES DETECTED]: " + $f.FullName) -ForegroundColor Red
        $corruptedCount++
    }
}
if ($corruptedCount -eq 0) {
    Write-Host "All $($allMd.Count) markdown files are clean of NULL (0x00) bytes!" -ForegroundColor Green
}

Write-Host "`n=== 5. SCRIPTS INVENTORY & CLUTTER ===" -ForegroundColor Cyan
$scripts = Get-ChildItem -Path scripts -File
Write-Host "Total files in scripts/: $($scripts.Count)"
$oneOffScripts = $scripts | Where-Object { $_.Name -match '^(test_|fit_|extract_|eval_|debug_|clean_|audit_|fix_|find_|apply_|update_|insert_|inject_|remove_|create_)' }
Write-Host "One-off / debug / temp scripts count: $($oneOffScripts.Count)"

Write-Host "`n=== 6. ROOT CLUTTER & UNTRACKED FILES ===" -ForegroundColor Cyan
$gitStatus = git status -s
$gitStatus

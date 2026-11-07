$utf8 = [System.Text.Encoding]::UTF8
$appPath = "$PSScriptRoot\..\app.js"
$appCode = [System.IO.File]::ReadAllText($appPath, $utf8)
$appNorm = $appCode.Replace("`r`n", "`n")

# 1. Remove calls to updateTab1SyncPreview in navTabs
$targetNav = @"
            if (target === 'tab-vf-research' && typeof updateTab1SyncPreview === 'function') {
                updateTab1SyncPreview();
            }
"@.Replace("`r`n", "`n")

if ($appNorm.Contains($targetNav)) {
    $appNorm = $appNorm.Replace($targetNav, "")
    Write-Host "[OK] Removed targetNav"
}

# 2. Remove other calls to updateTab1SyncPreview
$targetCall = @"
            if (typeof updateTab1SyncPreview === 'function') {
                updateTab1SyncPreview();
            }
"@.Replace("`r`n", "`n")

while ($appNorm.Contains($targetCall)) {
    $appNorm = $appNorm.Replace($targetCall, "")
    Write-Host "[OK] Removed a targetCall"
}

$targetCallIndent = @"
                    if (typeof updateTab1SyncPreview === 'function') {
                        updateTab1SyncPreview();
                    }
"@.Replace("`r`n", "`n")

while ($appNorm.Contains($targetCallIndent)) {
    $appNorm = $appNorm.Replace($targetCallIndent, "")
    Write-Host "[OK] Removed a targetCallIndent"
}

# 3. Remove from function renderResearchVF() down to initResearchVF();
$idxStart = $appNorm.IndexOf("function renderResearchVF() {")
$idxEnd = $appNorm.IndexOf("initResearchVF();")

if ($idxStart -ge 0 -and $idxEnd -ge 0) {
    $lenToEnd = ($idxEnd + "initResearchVF();".Length) - $idxStart
    $appNorm = $appNorm.Substring(0, $idxStart) + "// Tab 2 (Nhập thông số cắt tự do) đã loại bỏ theo yêu cầu của SirPhuong`n    " + $appNorm.Substring($idxEnd + "initResearchVF();".Length)
    Write-Host "[OK] Removed renderResearchVF through initResearchVF()"
}

$cFinal = $appNorm.Replace("`n", "`r`n")
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($appPath, $cFinal, $utf8NoBom)
Write-Host "[SUCCESS] app.js cleaned of tab-vf-research logic!"

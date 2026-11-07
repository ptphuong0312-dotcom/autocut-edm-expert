# ==============================================================================
# CONG GAC TOAN NANG: VERIFY GATEKEEPER (POWERSHELL NATIVE - 0 DEPENDENCIES)
# DU AN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - SIRPHUONG
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$rootDir = Split-Path -Parent $PSScriptRoot
if (-not $rootDir) { $rootDir = $PWD }

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "               AUTOCUT SERVO EDM EXPERT - PRE-FLIGHT GATEKEEPER                 " -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan

$allPassed = $true

# ------------------------------------------------------------------------------
# GATE 1: AST, BRACKETS & BACKTICKS INTEGRITY
# ------------------------------------------------------------------------------
Write-Host "[GATE 1/7] AST and Bracket Balance Integrity Check..." -NoNewline
$appJsPath = Join-Path $rootDir "app.js"
if (-not (Test-Path $appJsPath)) {
    Write-Host " FAILED! app.js not found." -ForegroundColor Red
    exit 1
}

$appJs = [IO.File]::ReadAllText($appJsPath, [Text.Encoding]::UTF8)

# Strip comments and strings for AST bracket verification
$clean = [regex]::Replace($appJs, '/\*[\s\S]*?\*/', '')
$clean = [regex]::Replace($clean, '//.*$', '', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$clean = [regex]::Replace($clean, '`(?:\\[\s\S]|[^`])*`', '""')
$clean = [regex]::Replace($clean, '"(?:\\[\s\S]|[^"\\])*"', '""')
$clean = [regex]::Replace($clean, "'(?:\\[\s\S]|[^'\\])*'", "''")

$stack = New-Object System.Collections.Generic.Stack[string]
$pairs = @{ ')' = '('; '}' = '{'; ']' = '[' }
$bracketErr = $false

for ($i = 0; $i -lt $clean.Length; $i++) {
    $c = "$($clean[$i])"
    if ($c -eq '(' -or $c -eq '{' -or $c -eq '[') {
        $stack.Push($c)
    } elseif ($c -eq ')' -or $c -eq '}' -or $c -eq ']') {
        if ($stack.Count -eq 0) {
            $bracketErr = $true; break
        }
        $top = $stack.Pop()
        if ($top -ne $pairs[$c]) {
            $bracketErr = $true; break
        }
    }
}

if ($bracketErr -or $stack.Count -ne 0) {
    Write-Host " FAILED! Unmatched brackets in app.js." -ForegroundColor Red
    $allPassed = $false
} else {
    Write-Host " PASSED [100%]" -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# GATE 2: ANTI-PIECEWISE & PURE PHYSICS ENGINE (RULE 16 & RULE 17)
# ------------------------------------------------------------------------------
Write-Host "[GATE 2/7] Anti-Piecewise and Dual-Regime Physics Law..." -NoNewline
$forbidden = @('anchorOffsetTarget', 'anchorOffset')
$hasForbidden = $false
foreach ($p in $forbidden) {
    if ($appJs.Contains($p)) {
        $hasForbidden = $true; break
    }
}

$requiredConsts = @('C0', 'K_ELEC', 'DELTA_LOW', 'K_SLAG', 'K_VIBR', 'K_RZ')
$missingConsts = @()
foreach ($c in $requiredConsts) {
    if (-not $appJs.Contains($c)) {
        $missingConsts += $c
    }
}

if ($hasForbidden -or $missingConsts.Count -gt 0) {
    Write-Host " FAILED! Violation of Rule 16." -ForegroundColor Red
    $allPassed = $false
} else {
    Write-Host " PASSED [100%]" -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# GATE 3: EXPORT CONTRACT CHECK [SPEC-LOCK: CLIPBOARD_EXPORT_CONTRACT_V66]
# ------------------------------------------------------------------------------
Write-Host "[GATE 3/7] Clipboard Export Contract Specification..." -NoNewline
$hasSpecLock = $appJs.Contains("SPEC-LOCK: CLIPBOARD_EXPORT_CONTRACT_V66")
$hasNewlineFormat = $appJs.Contains("passLines.join('\n\n')")

if ($hasSpecLock -and $hasNewlineFormat) {
    Write-Host " PASSED [100%]" -ForegroundColor Green
} else {
    Write-Host " FAILED! Export format contract broken." -ForegroundColor Red
    $allPassed = $false
}

# ------------------------------------------------------------------------------
# GATE 4: DUAL-CARD UI INTEGRITY & QUICK CHIPS TO 200MM
# ------------------------------------------------------------------------------
Write-Host "[GATE 4/7] Dual-Card UI and Quick Chips to 200mm..." -NoNewline
$indexHtmlPath = Join-Path $rootDir "index.html"
$indexHtml = [IO.File]::ReadAllText($indexHtmlPath, [Text.Encoding]::UTF8)

$hasVung1 = $indexHtml.Contains("ws-edm-table-vung1")
$hasVung2 = $indexHtml.Contains("ws-edm-table-vung2")
$hasChip200 = $indexHtml.Contains('data-h="200">200</button>')

$cssPath = Join-Path $rootDir "style.css"
$css = [IO.File]::ReadAllText($cssPath, [Text.Encoding]::UTF8)
$hasChipWrap = $css.Contains("flex-wrap: wrap !important")

if ($hasVung1 -and $hasVung2 -and $hasChip200 -and $hasChipWrap) {
    Write-Host " PASSED [100%]" -ForegroundColor Green
} else {
    Write-Host " FAILED! UI cards or chips incomplete." -ForegroundColor Red
    $allPassed = $false
}

# ------------------------------------------------------------------------------
# GATE 5: 5-FILE VERSION & CACHE SYNCHRONIZATION
# ------------------------------------------------------------------------------
Write-Host "[GATE 5/7] 5-File Version and Service Worker Cache Sync..." -NoNewline
$verJsonPath = Join-Path $rootDir "version.json"
$verData = Get-Content $verJsonPath -Raw | ConvertFrom-Json
$ver = $verData.version

$swPath = Join-Path $rootDir "sw.js"
$swJs = [IO.File]::ReadAllText($swPath, [Text.Encoding]::UTF8)

$vHtml = $indexHtml.Contains("style.css?v=$ver") -and $indexHtml.Contains("app.js?v=$ver")
$vSw = $swJs.Contains("autocut-v$ver")
$vApp = $appJs.Contains("const CURRENT_VERSION = `"$ver`"")
$vCss = $css.Contains("v$ver")

if ($vHtml -and $vSw -and $vApp -and $vCss) {
    Write-Host " PASSED [v$ver]" -ForegroundColor Green
} else {
    Write-Host " FAILED! Version mismatch across files." -ForegroundColor Red
    Write-Host "  HTML: $vHtml | SW: $vSw | APP: $vApp | CSS: $vCss" -ForegroundColor Yellow
    $allPassed = $false
}

# ------------------------------------------------------------------------------
# GATE 6: PWA OFFLINE INTEGRITY (ZERO 404 PHANTOM ASSETS)
# ------------------------------------------------------------------------------
Write-Host "[GATE 6/7] PWA Offline Cache Pre-cache Check..." -NoNewline
$hasTailieu404 = $swJs.Contains("tailieu.txt")
$hasProjRules404 = $swJs.Contains("PROJECT_RULES.md")

if (-not $hasTailieu404 -and -not $hasProjRules404) {
    Write-Host " PASSED [0 phantom 404s]" -ForegroundColor Green
} else {
    Write-Host " FAILED! sw.js contains 404 phantom assets." -ForegroundColor Red
    $allPassed = $false
}

# ------------------------------------------------------------------------------
# GATE 7: FILE SIZE, CLEANLINESS & RULES HEALTH GUARD
# ------------------------------------------------------------------------------
Write-Host "[GATE 7/7] Master Map Size and Rules Health Guard..." -NoNewline
$geminiPath = Join-Path $rootDir "GEMINI.md"
$geminiLines = (Get-Content $geminiPath | Measure-Object -Line).Lines
$geminiBytes = (Get-Item $geminiPath).Length

$geminiOk = ($geminiLines -le 160) -and ($geminiBytes -le 10240)

# Check docs/rules handbooks
$ruleFiles = Get-ChildItem -Path (Join-Path $rootDir "docs\rules") -Filter "*.md"
$rulesOk = $true
foreach ($rf in $ruleFiles) {
    if ($rf.Length -gt 15360) {
        $rulesOk = $false; break
    }
}

if ($geminiOk -and $rulesOk) {
    Write-Host " PASSED [GEMINI: $geminiLines lines, $geminiBytes Bytes]" -ForegroundColor Green
} else {
    Write-Host " FAILED! GEMINI.md or rules file exceeds limit." -ForegroundColor Red
    $allPassed = $false
}

# ------------------------------------------------------------------------------
# SUMMARY
# ------------------------------------------------------------------------------
Write-Host "================================================================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "               ALL 7 GATES PASSED! SYSTEM READY FOR RELEASE                     " -ForegroundColor Green
    Write-Host "================================================================================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "               ONE OR MORE GATES FAILED! ACTION REQUIRED!                       " -ForegroundColor Red
    Write-Host "================================================================================" -ForegroundColor Cyan
    exit 1
}

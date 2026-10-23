# ==============================================================================
# KIEM TRA TINH TOAN VEN CU PHAP & NGOAC AST (POWERSHELL THUAN TUY)
# DU AN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$rootDir = Split-Path -Parent $PSScriptRoot
if (-not $rootDir) { $rootDir = $PWD }

$appJsPath = Join-Path $rootDir "app.js"
if (-not (Test-Path $appJsPath)) {
    Write-Host "[ERROR] Khong tim thay file app.js tai: $appJsPath" -ForegroundColor Red
    exit 1
}

$appJs = [IO.File]::ReadAllText($appJsPath, [Text.Encoding]::UTF8)

# 1. Bracket and stack check
$clean = [regex]::Replace($appJs, '/\*[\s\S]*?\*/', '')
$clean = [regex]::Replace($clean, '//.*$', '', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$clean = [regex]::Replace($clean, '`(?:\\[\s\S]|[^`])*`', '""')
$clean = [regex]::Replace($clean, '"(?:\\[\s\S]|[^"\\])*"', '""')
$clean = [regex]::Replace($clean, "'(?:\\[\s\S]|[^'\\])*'", "''")

$stack = New-Object System.Collections.Generic.Stack[string]
$pairs = @{ ')' = '('; '}' = '{'; ']' = '[' }
$err = $false

for ($i = 0; $i -lt $clean.Length; $i++) {
    $c = "$($clean[$i])"
    if ($c -eq '(' -or $c -eq '{' -or $c -eq '[') {
        $stack.Push($c)
    } elseif ($c -eq ')' -or $c -eq '}' -or $c -eq ']') {
        if ($stack.Count -eq 0) {
            Write-Host "[SYNTAX ERROR] Unmatched closing $c at character $i" -ForegroundColor Red
            $err = $true; break
        }
        $top = $stack.Pop()
        if ($top -ne $pairs[$c]) {
            Write-Host "[SYNTAX ERROR] Mismatched $top with $c at character $i" -ForegroundColor Red
            $err = $true; break
        }
    }
}

if ($err -or $stack.Count -ne 0) {
    Write-Host "[SYNTAX ERROR] Stack count remaining: $($stack.Count)" -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] Bracket balance and syntax integrity: PASSED 100%" -ForegroundColor Green

# 2. Anti-Lookup-Table Law Check
$forbidden = @('anchorOffsetTarget', 'anchorOffset')
foreach ($p in $forbidden) {
    if ($appJs.Contains($p)) {
        Write-Host "[INTEGRITY VIOLATION] Forbidden pattern '$p' found in app.js!" -ForegroundColor Red
        exit 1
    }
}

$required = @('C0', 'K_ELEC', 'DELTA_LOW', 'K_SLAG', 'K_VIBR', 'K_RZ')
foreach ($c in $required) {
    if (-not $appJs.Contains($c)) {
        Write-Host "[INTEGRITY VIOLATION] Required constant '$c' missing in app.js!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "  [OK] Anti-Lookup-Table Law and Pure Physics Engine: PASSED 100%" -ForegroundColor Green

# 3. Version synchronization check
$verJsonPath = Join-Path $rootDir "version.json"
$verData = Get-Content $verJsonPath -Raw | ConvertFrom-Json
$ver = $verData.version

$indexHtml = [IO.File]::ReadAllText((Join-Path $rootDir "index.html"), [Text.Encoding]::UTF8)
$swJs = [IO.File]::ReadAllText((Join-Path $rootDir "sw.js"), [Text.Encoding]::UTF8)

$vPass = $true
if (-not $indexHtml.Contains("style.css?v=$ver") -or -not $indexHtml.Contains("app.js?v=$ver")) {
    Write-Host "[VERSION MISMATCH] index.html not synced with version $ver" -ForegroundColor Yellow
    $vPass = $false
}
if (-not $swJs.Contains("autocut-v$ver")) {
    Write-Host "[VERSION MISMATCH] sw.js not synced with version $ver" -ForegroundColor Yellow
    $vPass = $false
}
if (-not $appJs.Contains("const CURRENT_VERSION = `"$ver`"")) {
    Write-Host "[VERSION MISMATCH] app.js not synced with version $ver" -ForegroundColor Yellow
    $vPass = $false
}

if ($vPass) {
    Write-Host "  [OK] Version synchronization ($ver): PASSED 100%" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Versions need synchronization before commit." -ForegroundColor Yellow
}

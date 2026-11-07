$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edge)) { $edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe' }

$indexPath = (Resolve-Path "$PSScriptRoot\..\index.html").Path.Replace('\', '/')
$url = "file:///$indexPath"
$outTxt = "$PSScriptRoot\dom_out.txt"

Start-Process -FilePath $edge -ArgumentList '--headless=new', '--disable-gpu', '--dump-dom', $url -NoNewWindow -Wait -RedirectStandardOutput $outTxt

if (Test-Path $outTxt) {
    $dom = [System.IO.File]::ReadAllText($outTxt, [System.Text.Encoding]::UTF8)
    Remove-Item $outTxt -Force -ErrorAction SilentlyContinue

    $pass1 = $dom.Contains('Pass 1')
    $vung1 = $dom.Contains('ws-edm-table-vung1')
    $vung2 = $dom.Contains('ws-edm-table-vung2')
    $hasOldTab = $dom.Contains('tab-vf-research')
    $hasOffsetInVung1 = $dom.Contains('ws-dyn-offset-0')
    $hasArrow = $dom.Contains('ws-lib-toggle-arrow')

    Write-Host "DOM length: $($dom.Length)"
    Write-Host "Contains Pass 1: $pass1"
    Write-Host "Contains Vung 1 table: $vung1"
    Write-Host "Contains Vung 2 table: $vung2"
    Write-Host "Contains OFFSET in Vung 1: $hasOffsetInVung1"
    Write-Host "Contains 6 Che Do Cat arrow: $hasArrow"
    Write-Host "Contains removed tab-vf-research: $hasOldTab"

    if ($pass1 -and $vung1 -and $vung2 -and $hasOffsetInVung1 -and $hasArrow -and (-not $hasOldTab)) {
        Write-Host "[OK] LIVE BROWSER RENDER PASSED 100%!" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] BROWSER RENDER FAILED!" -ForegroundColor Red
    }
} else {
    Write-Host "[FAIL] dom_out.txt not created" -ForegroundColor Red
}

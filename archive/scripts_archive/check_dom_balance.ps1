$html = [System.IO.File]::ReadAllText("index.html", [Text.Encoding]::UTF8)

# Check div tag balance
$openDivs = [regex]::Matches($html, '<div\b[^>]*>').Count
$closeDivs = [regex]::Matches($html, '<\/div>').Count

Write-Host "Open divs: $openDivs"
Write-Host "Close divs: $closeDivs"

if ($openDivs -eq $closeDivs) {
    Write-Host "[OK] HTML div balance: PERFECT!" -ForegroundColor Green
} else {
    Write-Host "[WARN] HTML div mismatch: diff = $($openDivs - $closeDivs)" -ForegroundColor Red
}

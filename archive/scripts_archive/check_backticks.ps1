$text = [System.IO.File]::ReadAllText("app.js")
$bt = [char]96
$count = 0
$lines = $text.Split([char]10)
for ($i = 0; $i -lt $lines.Length; $i++) {
    $c = ($lines[$i].ToCharArray() | Where-Object { $_ -eq $bt }).Count
    if ($c % 2 -ne 0) {
        Write-Host "Line $($i+1) has odd backticks: $c ($($lines[$i].Trim()))"
    }
    $count += $c
}
Write-Host "Total backticks: $count"

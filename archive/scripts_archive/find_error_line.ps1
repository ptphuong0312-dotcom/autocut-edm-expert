$text = [System.IO.File]::ReadAllText("app.js")
$pos = 18297
$sub = $text.Substring(0, [Math]::Min($pos, $text.Length))
$lines = $sub.Split([char]10)
Write-Host "Position $pos is around line $($lines.Length)"
$start = [Math]::Max(0, $lines.Length - 10)
$end = [Math]::Min($lines.Length + 5, $lines.Length)
for ($i = $start; $i -lt $lines.Length; $i++) {
    Write-Host "$($i + 1): $($lines[$i])"
}

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$lines = [IO.File]::ReadAllLines("index.html", [Text.Encoding]::UTF8)

$idx1 = -1
$idx2 = -1

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'id="tab-calculator"') {
        $idx1 = $i - 1 # include the comment line before it
    }
    if ($lines[$i] -match 'id="tab-workshop"') {
        $idx2 = $i - 1 # include the comment line before it
        break
    }
}

Write-Host "Found idx1=$idx1, idx2=$idx2"

if ($idx1 -ge 0 -and $idx2 -gt $idx1) {
    $newLines = [System.Collections.Generic.List[string]]::new()
    for ($i = 0; $i -lt $idx1; $i++) {
        $newLines.Add($lines[$i])
    }
    for ($i = $idx2; $i -lt $lines.Length; $i++) {
        $newLines.Add($lines[$i])
    }
    [IO.File]::WriteAllLines("index.html", $newLines, [Text.Encoding]::UTF8)
    Write-Host "Successfully removed lines $idx1 to $($idx2-1) from index.html"
} else {
    Write-Host "ERROR: Markers not found!"
}

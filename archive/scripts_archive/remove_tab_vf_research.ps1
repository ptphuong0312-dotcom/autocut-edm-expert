$utf8 = [System.Text.Encoding]::UTF8
$indexPath = "$PSScriptRoot\..\index.html"
$lines = [System.IO.File]::ReadAllLines($indexPath, $utf8)

$newLines = [System.Collections.Generic.List[string]]::new()
$skipping = $false

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]

    if ($line.Contains('data-tab="tab-vf-research"')) {
        continue
    }

    if ($line.Contains('id="tab-vf-research"')) {
        # If previous line was a comment, remove it from newLines
        if ($newLines.Count -gt 0 -and $newLines[$newLines.Count - 1].Contains('<!--')) {
            $newLines.RemoveAt($newLines.Count - 1)
        }
        $skipping = $true
        continue
    }

    if ($line.Contains('id="tab-knowledge"')) {
        $skipping = $false
    }

    if (-not $skipping) {
        $newLines.Add($line)
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines($indexPath, $newLines.ToArray(), $utf8NoBom)
Write-Host "Removed tab-vf-research from index.html successfully!" -ForegroundColor Green

$lines = [System.IO.File]::ReadAllLines("app.js", [System.Text.Encoding]::UTF8)

$level = 0
for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    # Simple count of { and } ignoring strings approximately
    $cleanLine = [regex]::Replace($line, '//.*$', '')
    $cleanLine = [regex]::Replace($cleanLine, '"(?:\\[\s\S]|[^"\\])*"', '""')
    $cleanLine = [regex]::Replace($cleanLine, "'(?:\\[\s\S]|[^'\\])*'", "''")
    $openCount = ($cleanLine.ToCharArray() | Where-Object { $_ -eq '{' }).Count
    $closeCount = ($cleanLine.ToCharArray() | Where-Object { $_ -eq '}' }).Count
    $level += ($openCount - $closeCount)
    if ($level -eq 0 -and $i -gt 10 -and $i -lt ($lines.Length - 20)) {
        Write-Host "Warning: Level hit 0 early at line $($i+1): $line"
    }
}
Write-Host "Final level at end of file: $level"

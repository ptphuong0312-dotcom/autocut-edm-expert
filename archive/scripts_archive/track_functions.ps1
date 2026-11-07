$appJs = [IO.File]::ReadAllText("app.js", [Text.Encoding]::UTF8)
$clean = [regex]::Replace($appJs, '/\*[\s\S]*?\*/', '')
$clean = [regex]::Replace($clean, '//.*$', '', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$clean = [regex]::Replace($clean, '`(?:\\[\s\S]|[^`])*`', '""')
$clean = [regex]::Replace($clean, '"(?:\\[\s\S]|[^"\\])*"', '""')
$clean = [regex]::Replace($clean, "'(?:\\[\s\S]|[^'\\])*'", "''")

$lines = $clean.Split([char]10)
$level = 0
for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    $opens = ($line.ToCharArray() | Where-Object { $_ -eq '{' }).Count
    $closes = ($line.ToCharArray() | Where-Object { $_ -eq '}' }).Count
    $diff = $opens - $closes
    $level += $diff
    if ($diff -ne 0) {
        # Check if line looks like function definition at top level
        if ($line -match 'function\s+([a-zA-Z0-9_]+)') {
            Write-Host "Line $($i+1): level=$level function $($matches[1])"
        }
    }
}

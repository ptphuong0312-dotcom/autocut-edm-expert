$appJs = [IO.File]::ReadAllText("app.js", [Text.Encoding]::UTF8)
$clean = [regex]::Replace($appJs, '/\*[\s\S]*?\*/', '')
$clean = [regex]::Replace($clean, '//.*$', '', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$clean = [regex]::Replace($clean, '`(?:\\[\s\S]|[^`])*`', '""')
$clean = [regex]::Replace($clean, '"(?:\\[\s\S]|[^"\\])*"', '""')
$clean = [regex]::Replace($clean, "'(?:\\[\s\S]|[^'\\])*'", "''")

$lines = $clean.Split([char]10)
for ($i = 280; $i -lt 380; $i++) {
    if ($i -lt $lines.Length) {
        Write-Host "$($i+1): $($lines[$i])"
    }
}

$appJs = [IO.File]::ReadAllText("app.js", [Text.Encoding]::UTF8)
$clean = [regex]::Replace($appJs, '/\*[\s\S]*?\*/', '')
$clean = [regex]::Replace($clean, '//.*$', '', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$clean = [regex]::Replace($clean, '`(?:\\[\s\S]|[^`])*`', '""')
$clean = [regex]::Replace($clean, '"(?:\\[\s\S]|[^"\\])*"', '""')
$clean = [regex]::Replace($clean, "'(?:\\[\s\S]|[^'\\])*'", "''")

$pos = 18297
$start = [Math]::Max(0, $pos - 100)
$len = [Math]::Min(200, $clean.Length - $start)
Write-Host "Context in clean around pos:"
Write-Host $pos
Write-Host $clean.Substring($start, $len)

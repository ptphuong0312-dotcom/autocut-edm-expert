$appJs = [IO.File]::ReadAllText("app.js", [Text.Encoding]::UTF8)
$clean = [regex]::Replace($appJs, '/\*[\s\S]*?\*/', '')
$clean = [regex]::Replace($clean, '//.*$', '', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$clean = [regex]::Replace($clean, '`(?:\\[\s\S]|[^`])*`', '""')
$clean = [regex]::Replace($clean, '"(?:\\[\s\S]|[^"\\])*"', '""')
$clean = [regex]::Replace($clean, "'(?:\\[\s\S]|[^'\\])*'", "''")

$stack = New-Object System.Collections.Generic.Stack[PSCustomObject]
$pairs = @{ ')' = '('; '}' = '{'; ']' = '[' }

for ($i = 0; $i -lt $clean.Length; $i++) {
    $c = "$($clean[$i])"
    if ($c -eq '(' -or $c -eq '{' -or $c -eq '[') {
        $stack.Push([PSCustomObject]@{ Char = $c; Pos = $i })
    } elseif ($c -eq ')' -or $c -eq '}' -or $c -eq ']') {
        if ($stack.Count -eq 0) {
            Write-Host "Unmatched closing $c at clean pos $i"
            break
        }
        $top = $stack.Pop()
        if ($top.Char -ne $pairs[$c]) {
            Write-Host "Mismatched $($top.Char) at clean pos $($top.Pos) with $c at clean pos $i"
            $start = [Math]::Max(0, $i - 80)
            $len = [Math]::Min(160, $clean.Length - $start)
            Write-Host "Context:"
            Write-Host $clean.Substring($start, $len)
            break
        }
    }
}

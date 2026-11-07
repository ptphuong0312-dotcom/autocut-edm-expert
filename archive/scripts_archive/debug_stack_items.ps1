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
        if ($stack.Count -gt 0) {
            $top = $stack.Peek()
            if ($top.Char -eq $pairs[$c]) {
                $stack.Pop() | Out-Null
            }
        }
    }
}

Write-Host "Remaining in stack: $($stack.Count)"
$arr = $stack.ToArray()
for ($j = 0; $j -lt $arr.Length; $j++) {
    $item = $arr[$j]
    $start = [Math]::Max(0, $item.Pos - 20)
    $len = [Math]::Min(50, $clean.Length - $start)
    Write-Host "[$j] $($item.Char) at clean pos $($item.Pos):"
    Write-Host "   '$($clean.Substring($start, $len).Replace("`n", " "))'"
}

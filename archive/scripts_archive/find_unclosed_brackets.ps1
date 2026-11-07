$appJs = [IO.File]::ReadAllText("app.js", [Text.Encoding]::UTF8)

# Clean comments and strings
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

Write-Host "Unclosed brackets count: $($stack.Count)"
foreach ($item in $stack) {
    # Find line number in original file
    $sub = $appJs.Substring(0, [Math]::Min($item.Pos, $appJs.Length))
    $lineNum = $sub.Split([char]10).Length
    Write-Host "Unclosed '$($item.Char)' at line $lineNum"
}

$lines = [System.IO.File]::ReadAllLines("app.js", [System.Text.Encoding]::UTF8)
$newLines = [System.Collections.Generic.List[string]]::new()

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line.Contains("const slag_mat = isHard ? 1.0 : 0.80;")) {
        $newLines.Add($line)
        $newLines.Add("        const DELTA_LOW = 0.0045;   // Hang so mang dien moi Volt Low (+4.5 um)")
        $newLines.Add("        const K_SLAG = K_SEC_BASE;  // Alias tuong thich kiem dinh he so nen mat xi")
        continue
    }
    $newLines.Add($line)
}

[System.IO.File]::WriteAllLines("app.js", $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Added DELTA_LOW and K_SLAG to app.js successfully."

$lines = Get-Content -Path 'WORKSHOP_DATA_BANK.md'
for ($i = 0; $i -lt $lines.Count; $i++) {
    $l = $lines[$i]
    if ($l.Contains("STT") -and $l.Contains("Ampe")) {
        Write-Host "Found table at line $i : $l"
        for ($j = $i + 1; $j -lt [math]::Min($lines.Count, $i + 35); $j++) {
            $row = $lines[$j]
            if ($row.StartsWith("|") -and -not $row.StartsWith("|:---")) {
                $cols = $row.Split('|')
                if ($cols.Count -gt 15) {
                    $stt = $cols[1].Trim()
                    $mat = $cols[3].Trim()
                    $h = $cols[4].Trim()
                    $pon = $cols[5].Trim()
                    $poff = $cols[6].Trim()
                    $ip = $cols[7].Trim()
                    $volt = $cols[9].Trim()
                    $vf = $cols[10].Trim()
                    $ampe = $cols[15].Trim()
                    Write-Host ("{0,-20} | H={1,3} | Mat={2,-10} | Pon={3,3} | Poff={4,2} | IP={5,1} | Volt={6,-4} | VF={7,2} | Ampe={8}" -f $stt, $h, $mat, $pon, $poff, $ip, $volt, $vf, $ampe)
                }
            } elseif ($row.Trim() -eq "" -or $row.StartsWith("#")) {
                break
            }
        }
    }
}

$jobs = @(
    @{ STT="STT 1"; H=30; Mat="SCM440"; Pon=32; Poff=5; IP=4; Volt="High"; ActualA=2.75 },
    @{ STT="STT 2"; H=40; Mat="SCM440"; Pon=36; Poff=5; IP=4; Volt="High"; ActualA=2.75 },
    @{ STT="STT 3"; H=63; Mat="SCM420"; Pon=44; Poff=7; IP=5; Volt="High"; ActualA=2.60 },
    @{ STT="STT 6"; H=68; Mat="SCM440"; Pon=70; Poff=7; IP=3; Volt="Low";  ActualA=1.70 },
    @{ STT="STT 7"; H=140; Mat="SCM420"; Pon=120; Poff=8; IP=5; Volt="High"; ActualA=3.30 },
    @{ STT="STT 12"; H=140; Mat="SCM420"; Pon=100; Poff=9; IP=6; Volt="High"; ActualA=3.60 },
    @{ STT="STT 14"; H=300; Mat="SCM440"; Pon=120; Poff=9; IP=6; Volt="High"; ActualA=3.90 },
    @{ STT="STT 15"; H=160; Mat="SCM420"; Pon=120; Poff=11; IP=6; Volt="High"; ActualA=3.55 },
    @{ STT="STT 16"; H=75; Mat="SCM420"; Pon=55; Poff=7; IP=4; Volt="High"; ActualA=3.45 },
    @{ STT="STT 17"; H=95; Mat="SCM440"; Pon=82; Poff=7; IP=4; Volt="High"; ActualA=3.50 },
    @{ STT="STT 18"; H=63; Mat="SCM420"; Pon=44; Poff=8; IP=4; Volt="High"; ActualA=2.60 },
    @{ STT="STT 19"; H=110; Mat="SCM420"; Pon=100; Poff=10; IP=5; Volt="High"; ActualA=3.20 },
    @{ STT="STT 20"; H=290; Mat="SCM440"; Pon=135; Poff=10; IP=6; Volt="High"; ActualA=3.70 },
    @{ STT="STT 21"; H=90; Mat="SCM420"; Pon=80; Poff=7; IP=4; Volt="High"; ActualA=3.55 },
    @{ STT="STT 22"; H=12; Mat="SCM420"; Pon=16; Poff=6; IP=3; Volt="Low";  ActualA=2.60 },
    @{ STT="STT 23"; H=200; Mat="SCM420"; Pon=120; Poff=10; IP=6; Volt="High"; ActualA=3.50 },
    @{ STT="1P-5P01"; H=12; Mat="SCM440"; Pon=20; Poff=5; IP=3; Volt="High"; ActualA=4.00 },
    @{ STT="1P-2P10"; H=85; Mat="SCM440"; Pon=70; Poff=8; IP=5; Volt="High"; ActualA=3.65 },
    @{ STT="1P-2P12"; H=165; Mat="SCM440"; Pon=135; Poff=11; IP=6; Volt="High"; ActualA=2.90 }
)

$out = foreach ($j in $jobs) {
    $duty = 1.0 / ($j.Poff + 2)
    $i_peak = $j.IP * 2.8
    $u_arc = if ($j.Volt -eq "Low") { 22.0 } else { 27.0 }
    
    $oldA = $i_peak * $duty * 2.6667 * ($u_arc / 27.0)
    $oldDiff = $oldA - $j.ActualA
    
    $alpha_h = 1.0
    if ($j.H -lt 75 -and $j.H -gt 15) {
        $alpha_h = [math]::Max(0.65, [math]::Min(1.0, 0.65 + 0.35 * ($j.H - 30.0) / (75.0 - 30.0)))
    }
    if ($j.H -le 15) {
        $alpha_h = if ($j.Volt -eq "Low") { 1.15 } else { 1.25 }
    }
    
    $newA = $i_peak * $duty * 2.6667 * ($u_arc / 27.0) * $alpha_h
    $newDiff = $newA - $j.ActualA
    
    [PSCustomObject]@{
        STT = $j.STT
        H = $j.H
        IP = $j.IP
        Po = $j.Poff
        Volt = $j.Volt
        ActualA = "{0:N2}A" -f $j.ActualA
        OldCalc = "{0:N2}A" -f $oldA
        OldDiff = "{0:+0.00;-0.00}A" -f $oldDiff
        NewCalc = "{0:N2}A" -f $newA
        NewDiff = "{0:+0.00;-0.00}A" -f $newDiff
    }
}
$out | Format-Table -AutoSize

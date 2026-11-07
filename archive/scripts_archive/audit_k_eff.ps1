$jobs = @(
    @{ STT="STT 1"; H=30; Mat="SCM440"; Pon=32; Poff=5; IP=4; Volt="High"; ActualA="2.7A - 2.8A"; ActualMid=2.75 },
    @{ STT="STT 2"; H=40; Mat="SCM440"; Pon=36; Poff=5; IP=4; Volt="High"; ActualA="2.7A - 2.8A"; ActualMid=2.75 },
    @{ STT="STT 3"; H=63; Mat="SCM420"; Pon=44; Poff=7; IP=5; Volt="High"; ActualA="2.5A - 2.7A"; ActualMid=2.60 },
    @{ STT="STT 6"; H=68; Mat="SCM440"; Pon=70; Poff=7; IP=3; Volt="Low";  ActualA="1.6A - 1.8A"; ActualMid=1.70 },
    @{ STT="STT 7"; H=140; Mat="SCM420"; Pon=120; Poff=8; IP=5; Volt="High"; ActualA="3.2A - 3.4A"; ActualMid=3.30 },
    @{ STT="STT 12"; H=140; Mat="SCM420"; Pon=100; Poff=9; IP=6; Volt="High"; ActualA="3.5A - 3.7A"; ActualMid=3.60 },
    @{ STT="STT 14"; H=300; Mat="SCM440"; Pon=120; Poff=9; IP=6; Volt="High"; ActualA="3.8A - 4.0A"; ActualMid=3.90 },
    @{ STT="STT 15"; H=160; Mat="SCM420"; Pon=120; Poff=11; IP=6; Volt="High"; ActualA="3.5A - 3.6A"; ActualMid=3.55 },
    @{ STT="STT 16"; H=75; Mat="SCM420"; Pon=55; Poff=7; IP=4; Volt="High"; ActualA="3.4A - 3.5A"; ActualMid=3.45 },
    @{ STT="STT 17"; H=95; Mat="SCM440"; Pon=82; Poff=7; IP=4; Volt="High"; ActualA="3.5A"; ActualMid=3.50 },
    @{ STT="STT 18"; H=63; Mat="SCM420"; Pon=44; Poff=8; IP=4; Volt="High"; ActualA="2.5A - 2.7A"; ActualMid=2.60 },
    @{ STT="STT 19"; H=110; Mat="SCM420"; Pon=100; Poff=10; IP=5; Volt="High"; ActualA="3.2A"; ActualMid=3.20 },
    @{ STT="STT 20"; H=290; Mat="SCM440"; Pon=135; Poff=10; IP=6; Volt="High"; ActualA="3.6A - 3.8A"; ActualMid=3.70 },
    @{ STT="STT 21"; H=90; Mat="SCM420"; Pon=80; Poff=7; IP=4; Volt="High"; ActualA="3.5A - 3.6A"; ActualMid=3.55 },
    @{ STT="STT 22"; H=12; Mat="SCM420"; Pon=16; Poff=6; IP=3; Volt="Low";  ActualA="2.5A - 2.7A"; ActualMid=2.60 },
    @{ STT="STT 23"; H=200; Mat="SCM420"; Pon=120; Poff=10; IP=6; Volt="High"; ActualA="3.5A"; ActualMid=3.50 },
    @{ STT="1P-5P01"; H=12; Mat="SCM440"; Pon=20; Poff=5; IP=3; Volt="High"; ActualA="4.0A"; ActualMid=4.00 },
    @{ STT="1P-2P10"; H=85; Mat="SCM440"; Pon=70; Poff=8; IP=5; Volt="High"; ActualA="3.6A - 3.7A"; ActualMid=3.65 },
    @{ STT="1P-2P12"; H=165; Mat="SCM440"; Pon=135; Poff=11; IP=6; Volt="High"; ActualA="2.8A - 3.0A"; ActualMid=2.90 }
)

foreach ($j in $jobs) {
    $toff = $j.Pon * ($j.Poff + 1)
    $cycle = $j.Pon + $toff
    $duty = $j.Pon / $cycle
    $i_peak = $j.IP * 2.8
    $u_arc = if ($j.Volt -eq "Low") { 22 } else { 27 }
    $raw_mean = $i_peak * $duty * ($u_arc / 27.0)
    $k_eff = $j.ActualMid / $raw_mean
    Write-Host ($j.STT + " | H=" + $j.H + " | " + $j.Mat + " | IP=" + $j.IP + " Po=" + $j.Poff + " | Actual=" + $j.ActualMid + "A | Raw=" + [math]::Round($raw_mean,2) + "A | k_eff=" + [math]::Round($k_eff,2))
}

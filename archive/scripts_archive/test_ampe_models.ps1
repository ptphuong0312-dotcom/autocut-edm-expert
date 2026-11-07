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

Write-Host "Khao sat cac mo hinh tinh Ampe:"
# Mo hinh 1: Hien tai (K = 2.6667)
$mae1 = 0
foreach ($j in $jobs) {
    $duty = $j.Pon / ($j.Pon * ($j.Poff + 2))
    $u_arc = if ($j.Volt -eq "Low") { 22 } else { 27 }
    $a1 = $j.IP * 2.8 * $duty * 2.6667 * ($u_arc / 27.0)
    $mae1 += [math]::Abs($a1 - $j.ActualA)
}
Write-Host ("Mo hinh 1 (Hien tai): MAE = {0:N3}A" -f ($mae1 / $jobs.Count))

# Mo hinh 2: Hieu chinh theo H (H mong k_eff giam ve 1.7, H day k_eff len 2.65)
# k_eff(H) = 1.70 + 0.95 * min(1.0, max(0.0, (H - 30) / (75 - 30)))
$mae2 = 0
foreach ($j in $jobs) {
    $duty = $j.Pon / ($j.Pon * ($j.Poff + 2))
    $u_arc = if ($j.Volt -eq "Low") { 22 } else { 27 }
    $h_factor = [math]::Min(1.0, [math]::Max(0.0, ($j.H - 30.0) / 45.0))
    $k_h = 1.72 + 0.95 * $h_factor
    $a2 = $j.IP * 2.8 * $duty * $k_h * ($u_arc / 27.0)
    $mae2 += [math]::Abs($a2 - $j.ActualA)
}
Write-Host ("Mo hinh 2 (k_eff bien thien theo H tu 1.72 len 2.67): MAE = {0:N3}A" -f ($mae2 / $jobs.Count))

# Mo hinh 3: Mo hinh phi tuyen theo IP va Po (Cong thuc thuc chien cua tu nguon)
# Ampe = (IP * 0.70) * (1 - Po * 0.04) * (u_arc / 27) + f(H)

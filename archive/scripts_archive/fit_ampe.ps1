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

# Test grid search for optimal parameters:
# Formula candidate:
# Ampe = (A_base + A_ip * IP) * (1 - A_po * (Poff - 5)) * (Volt_ratio) * (H_factor)
# Let's test a simple physical formulation:
# Ampe = IP * 0.75 * [1.0 / (Poff + 2)^alpha] * ...

# Let's test: Ampe = K_a * IP^p * (1 / (Poff + 2))^d * (u_arc / 27)^v * (H / 100)^h
# Let's find best fit using powershell
$bestMae = 999
$bestParams = @{}

for ($k = 10; $k -le 35; $k += 2) {
    $kval = $k / 10.0
    for ($p_ip = 5; $p_ip -le 10; $p_ip += 1) {
        $pip = $p_ip / 10.0
        for ($p_d = 2; $p_d -le 6; $p_d += 1) {
            $pd = $p_d / 10.0
            for ($p_h = 0; $p_h -le 3; $p_h += 1) {
                $ph = $p_h / 10.0
                
                $mae = 0
                foreach ($j in $jobs) {
                    $duty = 1.0 / ($j.Poff + 2)
                    $u_arc = if ($j.Volt -eq "Low") { 22.0 } else { 27.0 }
                    $h_rat = [math]::Max(0.2, [math]::Min(2.5, $j.H / 100.0))
                    
                    $calcA = $kval * [math]::Pow($j.IP, $pip) * [math]::Pow($duty, $pd) * [math]::Pow($u_arc / 27.0, 0.8) * [math]::Pow($h_rat, $ph)
                    $mae += [math]::Abs($calcA - $j.ActualA)
                }
                $mae = $mae / $jobs.Count
                if ($mae -lt $bestMae) {
                    $bestMae = $mae
                    $bestParams = @{ k=$kval; pip=$pip; pd=$pd; ph=$ph; mae=$mae }
                }
            }
        }
    }
}

Write-Host "Best Fit Result:"
$bestParams | Format-List

$benchmark = @(
    @{ id="STT 1";  H=30;  mat="SCM440"; Pon=32;  Poff=5;  IP=4; Volt="High"; VF=65; ampe_min=4.45; ampe_max=4.50; ampe_mid=4.475 },
    @{ id="STT 2";  H=40;  mat="SCM440"; Pon=36;  Poff=5;  IP=4; Volt="High"; VF=65; ampe_min=4.35; ampe_max=4.40; ampe_mid=4.375 },
    @{ id="STT 3";  H=63;  mat="SCM420"; Pon=44;  Poff=7;  IP=5; Volt="High"; VF=55; ampe_min=4.10; ampe_max=4.20; ampe_mid=4.150 },
    @{ id="STT 12"; H=140; mat="SCM420"; Pon=100; Poff=9;  IP=6; Volt="High"; VF=60; ampe_min=3.70; ampe_max=3.80; ampe_mid=3.750 },
    @{ id="STT 14"; H=300; mat="SCM440"; Pon=120; Poff=9;  IP=6; Volt="High"; VF=65; ampe_min=3.70; ampe_max=3.90; ampe_mid=3.800 },
    @{ id="STT 15"; H=160; mat="SCM420"; Pon=120; Poff=11; IP=6; Volt="High"; VF=70; ampe_min=2.80; ampe_max=3.00; ampe_mid=2.900 },
    @{ id="STT 16"; H=75;  mat="SCM420"; Pon=55;  Poff=7;  IP=4; Volt="High"; VF=54; ampe_min=3.40; ampe_max=3.50; ampe_mid=3.450 },
    @{ id="STT 17"; H=95;  mat="SCM440"; Pon=82;  Poff=7;  IP=4; Volt="High"; VF=55; ampe_min=3.60; ampe_max=3.70; ampe_mid=3.650 },
    @{ id="STT 18"; H=63;  mat="SCM420"; Pon=44;  Poff=8;  IP=4; Volt="High"; VF=57; ampe_min=3.30; ampe_max=3.40; ampe_mid=3.350 },
    @{ id="STT 19"; H=110; mat="SCM420"; Pon=100; Poff=10; IP=5; Volt="High"; VF=65; ampe_min=2.70; ampe_max=2.80; ampe_mid=2.750 },
    @{ id="STT 21"; H=90;  mat="SCM420"; Pon=80;  Poff=7;  IP=4; Volt="High"; VF=54; ampe_min=3.50; ampe_max=3.60; ampe_mid=3.550 },
    @{ id="STT 22"; H=12;  mat="SCM420"; Pon=16;  Poff=6;  IP=3; Volt="Low";  VF=60; ampe_min=2.50; ampe_max=2.70; ampe_mid=2.600 },
    @{ id="1P-5P01";H=12;  mat="SCM440"; Pon=20;  Poff=5;  IP=3; Volt="High"; VF=65; ampe_min=4.00; ampe_max=4.00; ampe_mid=4.000 },
    @{ id="1P-2P10";H=85;  mat="SCM440"; Pon=70;  Poff=8;  IP=5; Volt="High"; VF=61; ampe_min=3.60; ampe_max=3.70; ampe_mid=3.650 },
    @{ id="1P-2P12";H=165; mat="SCM440"; Pon=135; Poff=11; IP=6; Volt="High"; VF=70; ampe_min=2.80; ampe_max=3.00; ampe_mid=2.900 }
)

Write-Host "TESTING SATURATION MODEL FOR DEPTH ATTENUATION:"
$best_mae = 999.0
$best_rmse = 999.0
$best_max = 999.0
$best_p = @{}

for ($k_scale = 7.5; $k_scale -le 9.5; $k_scale += 0.1) {
    for ($k_sat = 0.10; $k_sat -le 0.35; $k_sat += 0.02) {
        for ($h0 = 30.0; $h0 -le 120.0; $h0 += 10.0) {
            for ($alpha = 1.6; $alpha -le 2.2; $alpha += 0.2) {
                $mae = 0.0
                $sse = 0.0
                $max_err = 0.0
                foreach ($j in $benchmark) {
                    $duty = 1.0 / ($j.Poff + $alpha)
                    $u_arc = if ($j.Volt -eq 'Low') { 22.0 } else { 27.0 }
                    $eta_h = 1.0 - $k_sat * ($j.H / ($j.H + $h0))
                    $i_calc = $j.IP * $duty * $k_scale * ($u_arc / 27.0) * $eta_h
                    $err = $i_calc - $j.ampe_mid
                    $abs_err = [math]::Abs($err)
                    $mae += $abs_err
                    $sse += ($err * $err)
                    if ($abs_err -gt $max_err) { $max_err = $abs_err }
                }
                $mae = $mae / $benchmark.Count
                $rmse = [math]::Sqrt($sse / $benchmark.Count)
                if ($mae -lt $best_mae) {
                    $best_mae = $mae
                    $best_rmse = $rmse
                    $best_max = $max_err
                    $best_p = @{
                        k_scale = $k_scale
                        k_sat = $k_sat
                        h0 = $h0
                        alpha = $alpha
                    }
                }
            }
        }
    }
}

Write-Host ([string]::Format('BEST SATURATION MODEL: MAE={0:N3}A | RMSE={1:N3}A | MaxErr={2:N3}A', $best_mae, $best_rmse, $best_max))
Write-Host ([string]::Format('Parameters: K_scale={0:N2}, K_sat={1:N2}, H0={2:N1}, alpha={3:N1}', $best_p.k_scale, $best_p.k_sat, $best_p.h0, $best_p.alpha))

# Print details of the best saturation model
Write-Host '-----------------------------------------------------------------------------------------'
Write-Host 'CHI TIET TUNG BAI CAT:'
foreach ($j in $benchmark) {
    $duty = 1.0 / ($j.Poff + $best_p.alpha)
    $u_arc = if ($j.Volt -eq 'Low') { 22.0 } else { 27.0 }
    $eta_h = 1.0 - $best_p.k_sat * ($j.H / ($j.H + $best_p.h0))
    $i_calc = $j.IP * $duty * $best_p.k_scale * ($u_arc / 27.0) * $eta_h
    $err = $i_calc - $j.ampe_mid
    $sign = if ($err -ge 0) { '+' } else { '' }
    $line = [string]::Format('{0,-10} | H={1,3} | IP={2,1} | Po={3,2} | Thuc={4:N2}A | Tinh={5:N2}A | Sai={6}{7:N2}A', $j.id, $j.H, $j.IP, $j.Poff, $j.ampe_mid, $i_calc, $sign, $err)
    Write-Host $line
}

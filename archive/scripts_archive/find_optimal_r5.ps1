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

Write-Host "SEARCHING OPTIMAL ROUND 5 (PARETO OPTIMAL AMPE ENGINE):"

# Model 5A: Saturation Depth + Power Exponent of Duty
# I = IP * (1 / (Poff + 2))^beta * K_scale * (u_arc / 27) * (1 - k_sat * H / (H + H0))
$best_mae_5a = 999.0
$best_p_5a = @{}

for ($beta = 1.0; $beta -le 1.4; $beta += 0.05) {
    for ($k_scale = 6.0; $k_scale -le 12.0; $k_scale += 0.2) {
        for ($k_sat = 0.10; $k_sat -le 0.35; $k_sat += 0.03) {
            for ($h0 = 30.0; $h0 -le 80.0; $h0 += 15.0) {
                $mae = 0.0
                $sse = 0.0
                $max_err = 0.0
                foreach ($j in $benchmark) {
                    $duty = [math]::Pow(1.0 / ($j.Poff + 2.0), $beta)
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
                if ($mae -lt $best_mae_5a) {
                    $best_mae_5a = $mae
                    $best_p_5a = @{
                        beta = $beta
                        k_scale = $k_scale
                        k_sat = $k_sat
                        h0 = $h0
                        MAE = $mae
                        RMSE = $rmse
                        MaxErr = $max_err
                    }
                }
            }
        }
    }
}

Write-Host ([string]::Format('MODEL 5A (Duty^beta + Saturation): MAE={0:N3}A | RMSE={1:N3}A | MaxErr={2:N3}A', $best_p_5a.MAE, $best_p_5a.RMSE, $best_p_5a.MaxErr))
Write-Host ([string]::Format('Params: beta={0:N2}, K_scale={1:N2}, K_sat={2:N2}, H0={3:N1}', $best_p_5a.beta, $best_p_5a.k_scale, $best_p_5a.k_sat, $best_p_5a.h0))

# Model 5B: Duty + Pulse pause cooling factor + Saturation Depth + VF
# I = IP * [1 / (Poff + 2)] * K_scale * [1 - k_po * (Poff - 5)/10] * (1 - k_sat * H / (H + H0)) * (1 + kvf * (VF - 55)/10)
$best_mae_5b = 999.0
$best_p_5b = @{}

for ($k_scale = 7.0; $k_scale -le 10.0; $k_scale += 0.2) {
    for ($k_po = 0.10; $k_po -le 0.40; $k_po += 0.05) {
        for ($k_sat = 0.10; $k_sat -le 0.30; $k_sat += 0.05) {
            for ($h0 = 30.0; $h0 -le 70.0; $h0 += 20.0) {
                for ($kvf = 0.0; $kvf -le 0.08; $kvf += 0.02) {
                    $mae = 0.0
                    $sse = 0.0
                    $max_err = 0.0
                    foreach ($j in $benchmark) {
                        $duty = 1.0 / ($j.Poff + 2.0)
                        $u_arc = if ($j.Volt -eq 'Low') { 22.0 } else { 27.0 }
                        $eta_po = 1.0 - $k_po * (($j.Poff - 5.0) / 10.0)
                        $eta_h = 1.0 - $k_sat * ($j.H / ($j.H + $h0))
                        $f_vf = 1.0 + $kvf * (($j.VF - 55.0) / 10.0)
                        $i_calc = $j.IP * $duty * $k_scale * $eta_po * ($u_arc / 27.0) * $eta_h * $f_vf
                        $err = $i_calc - $j.ampe_mid
                        $abs_err = [math]::Abs($err)
                        $mae += $abs_err
                        $sse += ($err * $err)
                        if ($abs_err -gt $max_err) { $max_err = $abs_err }
                    }
                    $mae = $mae / $benchmark.Count
                    $rmse = [math]::Sqrt($sse / $benchmark.Count)
                    if ($mae -lt $best_mae_5b) {
                        $best_mae_5b = $mae
                        $best_p_5b = @{
                            k_scale = $k_scale
                            k_po = $k_po
                            k_sat = $k_sat
                            h0 = $h0
                            kvf = $kvf
                            MAE = $mae
                            RMSE = $rmse
                            MaxErr = $max_err
                        }
                    }
                }
            }
        }
    }
}

Write-Host ([string]::Format('MODEL 5B (Linear Cooling + Saturation + VF): MAE={0:N3}A | RMSE={1:N3}A | MaxErr={2:N3}A', $best_p_5b.MAE, $best_p_5b.RMSE, $best_p_5b.MaxErr))
Write-Host ([string]::Format('Params: K_scale={0:N2}, K_po={1:N2}, K_sat={2:N2}, H0={3:N1}, K_vf={4:N2}', $best_p_5b.k_scale, $best_p_5b.k_po, $best_p_5b.k_sat, $best_p_5b.h0, $best_p_5b.kvf))

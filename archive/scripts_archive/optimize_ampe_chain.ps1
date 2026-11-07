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

function Eval-Model($calcBlock) {
    $mae = 0.0
    $sse = 0.0
    $max_err = 0.0
    $results = @()
    foreach ($j in $benchmark) {
        $u_arc = if ($j.Volt -eq 'Low') { 22.0 } else { 27.0 }
        $calcA = & $calcBlock $j $u_arc
        $err = $calcA - $j.ampe_mid
        $abs_err = [math]::Abs($err)
        $mae += $abs_err
        $sse += ($err * $err)
        if ($abs_err -gt $max_err) { $max_err = $abs_err }
        $results += [PSCustomObject]@{
            id = $j.id
            H = $j.H
            act = $j.ampe_mid
            calc = $calcA
            err = $err
        }
    }
    $n = $benchmark.Count
    return [PSCustomObject]@{
        MAE = ($mae / $n)
        RMSE = [math]::Sqrt($sse / $n)
        MaxErr = $max_err
        Details = $results
    }
}

Write-Host '========================================================================'
Write-Host 'BAT DAU CHUOI TINH CHINH AMPE DA VONG (ROUND 1 TO ROUND 5)'
Write-Host '========================================================================'

# BASELINE
$base_res = Eval-Model {
    param($j, $u_arc)
    $duty = 1.0 / ($j.Poff + 2.0)
    return ($j.IP * 2.8 * $duty * 2.6667 * ($u_arc / 27.0))
}
Write-Host ([string]::Format('BASELINE: MAE={0:N3}A | RMSE={1:N3}A | MaxErr={2:N3}A', $base_res.MAE, $base_res.RMSE, $base_res.MaxErr))

# ROUND 1: Tim he so K_scale toi uu nhat cho mo hinh tuyen tinh don gian
# I = IP * duty * K * (u_arc / 27)
$best_k1 = 0
$best_r1 = $null
$min_mae1 = 999.0
for ($k = 6.0; $k -le 8.5; $k += 0.05) {
    $r = Eval-Model {
        param($j, $u_arc)
        $duty = 1.0 / ($j.Poff + 2.0)
        return ($j.IP * $duty * $k * ($u_arc / 27.0))
    }
    if ($r.MAE -lt $min_mae1) {
        $min_mae1 = $r.MAE
        $best_k1 = $k
        $best_r1 = $r
    }
}
Write-Host ([string]::Format('ROUND 1 (Toi uu K_scale={0:N2}): MAE={1:N3}A | RMSE={2:N3}A | MaxErr={3:N3}A', $best_k1, $best_r1.MAE, $best_r1.RMSE, $best_r1.MaxErr))

# ROUND 2: Bo sung he so suy giam dong ranh sau k_depth(H)
# O phoi day, tro ngai xoi rua lam tang xung khong tai: eta_h = 1.0 - k_h * (H / 100)
$best_kh2 = 0
$best_k2 = 0
$best_r2 = $null
$min_mae2 = 999.0
for ($k = 7.0; $k -le 9.5; $k += 0.1) {
    for ($kh = 0.05; $kh -le 0.35; $kh += 0.02) {
        $r = Eval-Model {
            param($j, $u_arc)
            $duty = 1.0 / ($j.Poff + 2.0)
            $eta_h = [math]::Max(0.65, 1.0 - $kh * [math]::Pow($j.H / 100.0, 0.75))
            return ($j.IP * $duty * $k * ($u_arc / 27.0) * $eta_h)
        }
        if ($r.MAE -lt $min_mae2) {
            $min_mae2 = $r.MAE
            $best_kh2 = $kh
            $best_k2 = $k
            $best_r2 = $r
        }
    }
}
Write-Host ([string]::Format('ROUND 2 (Bu suy giam ranh sau K={0:N1}, kh={1:N2}): MAE={2:N3}A | RMSE={3:N3}A | MaxErr={4:N3}A', $best_k2, $best_kh2, $best_r2.MAE, $best_r2.RMSE, $best_r2.MaxErr))

# ROUND 3: Hieu chinh dong hoc chu ky nghi xung Poff phi tuyen
# Duty_eff = 1.0 / (Poff + alpha) voi alpha < 2.0 hoac Duty^beta
$best_a3 = 0
$best_k3 = 0
$best_kh3 = 0
$best_r3 = $null
$min_mae3 = 999.0
for ($alpha = 0.5; $alpha -le 2.5; $alpha += 0.1) {
    for ($k = 6.0; $k -le 9.0; $k += 0.2) {
        for ($kh = 0.05; $kh -le 0.25; $kh += 0.03) {
            $r = Eval-Model {
                param($j, $u_arc)
                $duty = 1.0 / ($j.Poff + $alpha)
                $eta_h = [math]::Max(0.65, 1.0 - $kh * [math]::Pow($j.H / 100.0, 0.75))
                return ($j.IP * $duty * $k * ($u_arc / 27.0) * $eta_h)
            }
            if ($r.MAE -lt $min_mae3) {
                $min_mae3 = $r.MAE
                $best_a3 = $alpha
                $best_k3 = $k
                $best_kh3 = $kh
                $best_r3 = $r
            }
        }
    }
}
Write-Host ([string]::Format('ROUND 3 (Chu ky Poff phi tuyen alpha={0:N1}, K={1:N1}, kh={2:N2}): MAE={3:N3}A | RMSE={4:N3}A | MaxErr={5:N3}A', $best_a3, $best_k3, $best_kh3, $best_r3.MAE, $best_r3.RMSE, $best_r3.MaxErr))

# ROUND 4: Tich hop theo doi servo VF va he so dien ap U_arc
# Ampe tang nhe khi VF cao (servo bam sat hon): (1 + kvf * (VF - 55)/10)
$best_kvf4 = 0
$best_r4 = $null
$min_mae4 = 999.0
for ($kvf = 0.0; $kvf -le 0.10; $kvf += 0.01) {
    for ($u_pow = 0.6; $u_pow -le 1.2; $u_pow += 0.1) {
        $r = Eval-Model {
            param($j, $u_arc)
            $duty = 1.0 / ($j.Poff + $best_a3)
            $eta_h = [math]::Max(0.65, 1.0 - $best_kh3 * [math]::Pow($j.H / 100.0, 0.75))
            $f_vf = 1.0 + $kvf * (($j.VF - 55.0) / 10.0)
            $u_factor = [math]::Pow($u_arc / 27.0, $u_pow)
            return ($j.IP * $duty * $best_k3 * $u_factor * $eta_h * $f_vf)
        }
        if ($r.MAE -lt $min_mae4) {
            $min_mae4 = $r.MAE
            $best_kvf4 = $kvf
            $best_r4 = $r
        }
    }
}
Write-Host ([string]::Format('ROUND 4 (Tich hop VF={0:N2}): MAE={1:N3}A | RMSE={2:N3}A | MaxErr={3:N3}A', $best_kvf4, $best_r4.MAE, $best_r4.RMSE, $best_r4.MaxErr))


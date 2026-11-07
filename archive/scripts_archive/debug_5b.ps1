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

Write-Host "CHI TIET TUNG BAI CAT MO HINH 5B:"
Write-Host "STT        |   H | Thep   | Pon | Po | IP | Volt | VF | Thuc Te     | Tinh Toan |   Sai So"
Write-Host "-----------|-----|--------|-----|----|----|------|----|-------------|-----------|---------"

$mae = 0.0
$sse = 0.0
$max_err = 0.0

foreach ($j in $benchmark) {
    $duty = 1.0 / ($j.Poff + 2.0)
    $u_arc = if ($j.Volt -eq 'Low') { 22.0 } else { 27.0 }
    $eta_po = 1.0 - 0.40 * (($j.Poff - 5.0) / 10.0)
    $eta_h = 1.0 - 0.10 * ($j.H / ($j.H + 30.0))
    $i_calc = $j.IP * $duty * 9.0 * $eta_po * ($u_arc / 27.0) * $eta_h
    
    $err = $i_calc - $j.ampe_mid
    $abs_err = [math]::Abs($err)
    $mae += $abs_err
    $sse += ($err * $err)
    if ($abs_err -gt $max_err) { $max_err = $abs_err }
    
    $sign = if ($err -ge 0) { '+' } else { '' }
    $act_str = [string]::Format('{0:N2}-{1:N2}A', $j.ampe_min, $j.ampe_max)
    $calc_str = [string]::Format('{0:N2}A', $i_calc)
    $err_str = [string]::Format('{0}{1:N2}A', $sign, $err)
    
    $line = [string]::Format('{0,-10} | {1,3} | {2,-6} | {3,3} | {4,2} | {5,2} | {6,-4} | {7,2} | {8,-11} | {9,9} | {10,8}', $j.id, $j.H, $j.mat, $j.Pon, $j.Poff, $j.IP, $j.Volt, $j.VF, $act_str, $calc_str, $err_str)
    Write-Host $line
}

$n = $benchmark.Count
$mae = $mae / $n
$rmse = [math]::Sqrt($sse / $n)

Write-Host '-----------------------------------------------------------------------------------------'
$summary = [string]::Format('THONG KE MODEL 5B: MAE = {0:N3}A | RMSE = {1:N3}A | Max Error = {2:N3}A', $mae, $rmse, $max_err)
Write-Host $summary

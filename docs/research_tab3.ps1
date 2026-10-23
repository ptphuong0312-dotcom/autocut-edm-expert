[Console]::OutputEncoding = [Text.Encoding]::UTF8
# ============ DATASET (1-Pass thật + quy đổi Rule 15, H<=170, đã khử trùng lặp) ============
# name, mat(440/420), H, Ton, Po, IP, Volt, VF, type(0=chay,1=coi), delta(mm)
$raw = @(
 @('STT1',440,30,32,5,4,'H',65,0,0.0080),
 @('STT2',440,40,36,5,4,'H',65,0,0.0080),
 @('STT3',420,63,44,7,5,'H',55,0,0.0050),
 @('STT6',440,68,70,7,3,'L',50,0,0.0070),
 @('STT7',420,140,120,8,5,'H',55,0,0.0050),
 @('STT12',420,140,100,9,6,'H',60,0,0.0120),
 @('STT15',420,160,120,11,6,'H',70,1,0.0300),
 @('STT16/2P14',420,75,55,7,4,'H',54,1,0.02225),
 @('STT17',440,95,82,7,4,'H',55,1,0.0235),
 @('STT18',420,63,44,8,4,'H',57,0,0.0080),
 @('STT19',420,110,100,10,5,'H',65,0,0.0150),
 @('1P-5P01',440,12,20,5,3,'H',65,0,0.0110),
 @('1P-2P10',440,85,70,8,5,'H',61,1,0.0125),
 @('1P-2P12',440,165,135,11,6,'H',70,1,0.0225)
)
$D = @()
foreach($r in $raw){ $D += [pscustomobject]@{N=$r[0];Mat=$r[1];H=$r[2];Ton=$r[3];Po=$r[4];IP=$r[5];Volt=$r[6];VF=$r[7];Die=$r[8];d=$r[9]} }

function Tab3-Current($p){
  $u = if($p.Volt -eq 'H'){1.0}else{22.0/27.0}
  $dlow = if($p.Volt -eq 'L'){0.0045}else{0}
  $delec = 0.00092*[math]::Sqrt($p.Ton*$p.IP)*$u
  $ipf = [math]::Max(1.0,$p.IP/4.0)
  $sm = if($p.Mat -eq 440){1.0}else{1.10}
  $dslag = -0.02*($p.H/100.0)*$sm/$ipf
  $dvib = 0.0039*[math]::Pow($p.H/100.0,2)*($p.IP/5.0)
  $g = 0.0036+$delec+$dlow+$dslag+$dvib
  $dvf = 0.0021*(($p.VF-55.0)/10.0)
  $dpo = -0.0012*(($p.Po-5.0)/10.0)
  return @{base=$g; full=$g+$dvf+$dpo}
}

function Solve-Linear($A,$b){
  $n=$b.Count
  $M=@(); for($i=0;$i -lt $n;$i++){ $row=@(); for($j=0;$j -lt $n;$j++){ $row += [double]$A[$i][$j] }; $row += [double]$b[$i]; $M += ,$row }
  for($c=0;$c -lt $n;$c++){
    $piv=$c
    for($r=$c+1;$r -lt $n;$r++){ if([math]::Abs($M[$r][$c]) -gt [math]::Abs($M[$piv][$c])){ $piv=$r } }
    if($piv -ne $c){ $tmp=$M[$c]; $M[$c]=$M[$piv]; $M[$piv]=$tmp }
    for($r=0;$r -lt $n;$r++){
      if($r -ne $c){
        $f=$M[$r][$c]/$M[$c][$c]
        for($k=$c;$k -le $n;$k++){ $M[$r][$k] = $M[$r][$k] - $f*$M[$c][$k] }
      }
    }
  }
  $x=@(); for($i=0;$i -lt $n;$i++){ $x += ($M[$i][$n]/$M[$i][$i]) }
  return $x
}
# feature builders (hệ số nhân với các feature này; đơn vị mm)
function Feat($p,$set){
  $u = if($p.Volt -eq 'H'){1.0}else{22.0/27.0}
  $ipf = [math]::Max(1.0,$p.IP/4.0)
  $sm = if($p.Mat -eq 440){1.0}else{1.10}
  $f = @{}
  $f.c    = 1.0
  $f.elec = [math]::Sqrt($p.Ton*$p.IP)*$u
  $f.slag = -($p.H/100.0)*$sm/$ipf
  $f.vibr = [math]::Pow($p.H/100.0,2)*($p.IP/5.0)
  $f.vf   = ($p.VF-55.0)/10.0
  $f.po   = -($p.Po-5.0)/10.0
  $f.die  = [double]$p.Die
  $f.H    = $p.H/100.0
  $f.Hsq  = [math]::Pow($p.H/100.0,2)
  $f.ip   = $p.IP/5.0
  $f.ton  = $p.Ton/100.0
  $f.iavg = $p.IP/($p.Po+1.0)
  $f.logT = [math]::Log($p.Ton)
  $x=@(); foreach($k in $set){ $x += $f[$k] }
  return ,$x
}
function Fixed-Low($p){ if($p.Volt -eq 'L'){0.0045}else{0} }

# Ridge về prior beta0 (kéo hệ số về giá trị hiện tại của Tab 3), lambda theo từng feature
function Fit($train,$set,$beta0,$lam){
  $k=$set.Count
  $XtX=@(); for($i=0;$i -lt $k;$i++){ $XtX += ,(@(0.0)*$k) }
  $Xty=@(0.0)*$k
  foreach($p in $train){
    $x = Feat $p $set
    $y = $p.d - (Fixed-Low $p)
    # residual to prior
    $prior=0.0; for($i=0;$i -lt $k;$i++){ $prior += $beta0[$i]*$x[$i] }
    $yr = $y-$prior
    for($i=0;$i -lt $k;$i++){ for($j=0;$j -lt $k;$j++){ $XtX[$i][$j]+=$x[$i]*$x[$j] }; $Xty[$i]+=$x[$i]*$yr }
  }
  for($i=0;$i -lt $k;$i++){ $XtX[$i][$i]+=$lam[$i] }
  $db = Solve-Linear $XtX $Xty
  $b=@(); for($i=0;$i -lt $k;$i++){ $b += $beta0[$i]+$db[$i] }
  return ,$b
}
function Predict($p,$set,$b){
  $x = Feat $p $set; $s=0.0; for($i=0;$i -lt $set.Count;$i++){ $s += $b[$i]*$x[$i] }
  return $s + (Fixed-Low $p)
}
function Eval-Model($label,$set,$beta0,$lam,$showCoef){
  # in-sample
  $b = Fit $D $set $beta0 $lam
  $ins=@(); foreach($p in $D){ $ins += ([math]::Abs((Predict $p $set $b)-$p.d)*1000) }
  # LOOCV
  $lo=@(); $loRows=@()
  for($i=0;$i -lt $D.Count;$i++){
    $tr=@(); for($j=0;$j -lt $D.Count;$j++){ if($j -ne $i){$tr+=$D[$j]} }
    $bb = Fit $tr $set $beta0 $lam
    $e = ((Predict $D[$i] $set $bb)-$D[$i].d)*1000
    $lo += [math]::Abs($e); $loRows += $e
  }
  $mae = ($ins|Measure-Object -Average).Average
  $lmae = ($lo|Measure-Object -Average).Average
  $lrmse = [math]::Sqrt((($lo|ForEach-Object{$_*$_})|Measure-Object -Average).Average)
  $lmax = ($lo|Measure-Object -Maximum).Maximum
  Write-Host ("{0,-46} in-MAE={1,5:N2}  LOO-MAE={2,5:N2}  LOO-RMSE={3,5:N2}  LOO-Max={4,5:N2} µm" -f $label,$mae,$lmae,$lrmse,$lmax)
  if($showCoef){ $s=''; for($i=0;$i -lt $set.Count;$i++){ $s += ("{0}={1:N5} " -f $set[$i],$b[$i]) }; Write-Host "     coef: $s" }
  return ,$loRows
}

Write-Host "=== N =" $D.Count "điểm độc lập (H<=170) ==="
Write-Host "`n--- A. Tab 3 HIỆN TẠI (hệ số cố định, không fit) ---"
$eA=@();$eB=@()
foreach($p in $D){ $t=Tab3-Current $p; $eA += [math]::Abs($t.full-$p.d)*1000; $eB += [math]::Abs($t.base-$p.d)*1000 }
"Tab3 full (có VF+Po):  MAE={0:N2}  RMSE={1:N2}  Max={2:N2} µm" -f (($eA|Measure-Object -Average).Average),([math]::Sqrt((($eA|%{$_*$_})|Measure-Object -Average).Average)),(($eA|Measure-Object -Maximum).Maximum)
"Tab3 base (không VF/Po): MAE={0:N2}  RMSE={1:N2}  Max={2:N2} µm" -f (($eB|Measure-Object -Average).Average),([math]::Sqrt((($eB|%{$_*$_})|Measure-Object -Average).Average)),(($eB|Measure-Object -Maximum).Maximum)
Write-Host "`nChi tiết từng bài (Tab3 full): δ_thực vs δ_tính (µm)"
foreach($p in $D){ $t=Tab3-Current $p; "{0,-11} H={1,3} Ton={2,3} Po={3,2} IP={4} {5} VF={6} {7}  thực={8,6:N2} tính={9,6:N2} Δ={10,6:N2}" -f $p.N,$p.H,$p.Ton,$p.Po,$p.IP,$p.Volt,$p.VF,$(if($p.Die){'cối '}else{'chày'}),($p.d*1000),($t.full*1000),(($t.full-$p.d)*1000) }

$b0_6 = @(0.0036,0.00092,0.02,0.0039,0.0021,0.0012)
$set6 = @('c','elec','slag','vibr','vf','po')
Write-Host "`n--- So sánh mô hình (LOOCV = bỏ từng điểm, fit lại, dự đoán điểm bị bỏ) ---"
$null = Eval-Model "B1. Cấu trúc Tab3, fit tự do (OLS) 6 hệ số" $set6 $b0_6 @(0,0,0,0,0,0) $true
# ridge prior mạnh: lam theo thang feature^2
$lamS = @(0.0,0.0,0.0,0.0,0.0,0.0)
foreach($L in @(1e-3,1e-2,1e-1,1.0,10.0)){
  $null = Eval-Model ("B2. Ridge→prior Tab3 (lam={0})" -f $L) $set6 $b0_6 @($L,$L,$L,$L,$L,$L) $false
}
Write-Host ""
$set7 = @('c','elec','slag','vibr','vf','po','die')
$b0_7 = @(0.0036,0.00092,0.02,0.0039,0.0021,0.0012,0.0)
$null = Eval-Model "C1. + biến cối/chày (OLS 7 hệ số)" $set7 $b0_7 @(0,0,0,0,0,0,0) $true
foreach($L in @(1e-3,1e-2,1e-1,1.0)){
  $null = Eval-Model ("C2. + cối/chày, ridge→prior (lam={0})" -f $L) $set7 $b0_7 @($L,$L,$L,$L,$L,$L,0.0) $false
}
Write-Host ""
$set4 = @('c','elec','slag','vf')
$null = Eval-Model "D1. Rút gọn: c+elec+slag+vf (OLS)" $set4 @(0.0036,0.00092,0.02,0.0021) @(0,0,0,0) $true
$set5 = @('c','elec','slag','vf','die')
$null = Eval-Model "D2. Rút gọn + cối/chày: c+elec+slag+vf+die" $set5 @(0.0036,0.00092,0.02,0.0021,0) @(0,0,0,0,0) $true
$set5b = @('c','elec','H','vf','die')
$null = Eval-Model "D3. c+elec+H(tuyến tính)+vf+die" $set5b @(0.0036,0.00092,0,0.0021,0) @(0,0,0,0,0) $true
$set6b = @('c','elec','H','vf','po','die')
$null = Eval-Model "D4. c+elec+H+vf+po+die" $set6b @(0.0036,0.00092,0,0.0021,0.0012,0) @(0,0,0,0,0,0) $true
$set4b = @('c','H','vf','die')
$null = Eval-Model "D5. c+H+vf+die (bỏ elec)" $set4b @(0.0036,0,0.0021,0) @(0,0,0,0) $true
$set4c = @('c','vf','die','po')
$null = Eval-Model "D6. c+vf+po+die (không H, không elec)" $set4c @(0.0036,0.0021,0.0012,0) @(0,0,0,0) $true
$set3 = @('c','vf','die')
$null = Eval-Model "D7. c+vf+die" $set3 @(0.0036,0.0021,0) @(0,0,0) $true
$set3b = @('c','vf')
$null = Eval-Model "D8. c+vf" $set3b @(0.0036,0.0021) @(0,0) $true
$set3c = @('c','die')
$null = Eval-Model "D9. c+die" $set3c @(0.0036,0) @(0,0) $true
$set3d = @('c')
$null = Eval-Model "D10. hằng số (baseline thống kê)" $set3d @(0.0036) @(0) $true



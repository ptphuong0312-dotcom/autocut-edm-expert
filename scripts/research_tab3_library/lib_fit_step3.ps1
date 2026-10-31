. "$PSScriptRoot\lib_fit_fn.ps1"
$n=$data.Count

# ========== A) Ham LOO chung cho tap cot (da chuan hoa) ==========
function LooRun($Fcols,$target,$lam,$back){
  # Fcols: mang cac mang gia tri (moi cot 1 mang n phan tu); target: mang n; back: scriptblock doi du doan ve delta (mm)
  $k=$Fcols.Count
  $mus=@();$sds=@()
  foreach($c in $Fcols){ $mu=($c|Measure-Object -Average).Average; $sd=[math]::Sqrt((($c|ForEach-Object{($_-$mu)*($_-$mu)})|Measure-Object -Sum).Sum/$n); if($sd -lt 1e-12){return $null}; $mus+=$mu;$sds+=$sd }
  $X=@(); for($i=0;$i -lt $n;$i++){ $r=@(1.0); for($q=0;$q -lt $k;$q++){ $r+=(($Fcols[$q][$i]-$mus[$q])/$sds[$q]) }; $X+=,$r }
  $beta=Fit $X $target $lam; if($null -eq $beta){return $null}
  $ins=0.0;$loo=0.0;$mx=0.0;$perrow=@()
  for($i=0;$i -lt $n;$i++){
    $p=0.0; for($q=0;$q -lt $beta.Count;$q++){ $p+=$beta[$q]*$X[$i][$q] }
    $ins+=[math]::Abs((& $back $p $i)-$data[$i].delta)
    $Xt=@();$yt=@(); for($t=0;$t -lt $n;$t++){ if($t -ne $i){ $Xt+=,$X[$t]; $yt+=$target[$t] } }
    $bt=Fit $Xt $yt $lam; if($null -eq $bt){return $null}
    $pl=0.0; for($q=0;$q -lt $bt.Count;$q++){ $pl+=$bt[$q]*$X[$i][$q] }
    $dl=& $back $pl $i
    $e=[math]::Abs($dl-$data[$i].delta); $loo+=$e; if($e -gt $mx){$mx=$e}
    $perrow+=($dl-$data[$i].delta)*1000
  }
  return [pscustomobject]@{ins=$ins/$n*1000; loo=$loo/$n*1000; loomax=$mx*1000; perrow=$perrow; beta=$beta; mus=$mus; sds=$sds}
}
$lowAdj=@(); foreach($d0 in $data){ $lowAdj += $(if($d0.High -eq 0){0.0045}else{0.0}) }

# ========== B) Power-law: ln(delta-dlow) = a + sum b_j ln(x_j) ==========
$lg=[ordered]@{
 'ln Ton'={param($d)[math]::Log($d.Ton)}
 'ln IP'={param($d)[math]::Log($d.IP)}
 'ln(Po+1)'={param($d)[math]::Log($d.Po+1.0)}
 'ln H'={param($d)[math]::Log($d.H)}
 'ln VF'={param($d)[math]::Log($d.VF)}
 'ln Hz'={param($d)[math]::Log($d.Hz)}
 'hard'={param($d)$d.hard}
}
$ln=@($lg.Keys); $LF=@{}; foreach($nm in $ln){ $LF[$nm]=@(); foreach($d0 in $data){ $LF[$nm]+=[double](& $lg[$nm] $d0) } }
$tl=@(); for($i=0;$i -lt $n;$i++){ $tl+=[math]::Log($data[$i].delta-$lowAdj[$i]) }
$backP={ param($p,$i) [math]::Exp($p)+$lowAdj[$i] }
$out=@()
for($a=0;$a -lt $ln.Count;$a++){
 foreach($idx in @(@($a)) ){ }
 $sets=@(@($a))
 for($b=$a+1;$b -lt $ln.Count;$b++){ $sets+=,@($a,$b); for($c=$b+1;$c -lt $ln.Count;$c++){ $sets+=,@($a,$b,$c); for($e2=$c+1;$e2 -lt $ln.Count;$e2++){ $sets+=,@($a,$b,$c,$e2) } } }
 foreach($s in $sets){ $cols=@(); foreach($j in $s){ $cols+=,$LF[$ln[$j]] }; $r=LooRun $cols $tl 0.3 $backP; if($r){ $r | Add-Member names (($s|%{$ln[$_]}) -join ' + ') ; $out+=$r } }
}
"=== POWER-LAW (ln delta) : $($out.Count) mo hinh ==="
$out | Sort-Object loo | Select-Object -First 12 | ForEach-Object { "{0,5:N2} {1,5:N2} {2,6:N2}  {3}" -f $_.ins,$_.loo,$_.loomax,$_.names }

# ========== C) Khung Tab 3 hien tai, fit lai he so (ridge ve prior) ==========
$fe=@(); $fs=@(); $fv=@(); $fvf=@(); $fpo=@()
foreach($d0 in $data){ $u=if($d0.High -eq 1){1.0}else{22.0/27}; $ipf=[math]::Max(1.0,$d0.IP/4.0); $sm=if($d0.hard -eq 1){1.0}else{1.10}
  $fe+=[math]::Sqrt($d0.Ton*$d0.IP)*$u; $fs+=-($d0.H/100.0)*$sm/$ipf; $fv+=[math]::Pow($d0.H/100.0,2)*($d0.IP/5.0); $fvf+=($d0.VF-55.0)/10.0; $fpo+=-($d0.Po-5.0)/10.0 }
$tc=@(); for($i=0;$i -lt $n;$i++){ $tc+=($data[$i].delta-$lowAdj[$i]) }
$backL={ param($p,$i) $p+$lowAdj[$i] }
foreach($lam in 0.05,0.5,2,5){
  $r=LooRun @($fe,$fs,$fv,$fvf,$fpo) $tc $lam $backL
  "Khung Tab3 fit lai (5 he so + C0), ridge=$lam : in-sample {0:N2}  LOO-MAE {1:N2}  LOO-max {2:N2}" -f $r.ins,$r.loo,$r.loomax
}

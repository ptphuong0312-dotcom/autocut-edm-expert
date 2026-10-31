. "$PSScriptRoot\lib_fit_fn.ps1"
# Chi xet H<=170 (Rule 17: H>170 giu nguyen che do thong ke hoi tu). Phan du = thuc - Tab3 hien tai.
$le = @($data | Where-Object { $_.H -le 170 })
$n2 = $le.Count
$resid=@(); foreach($d in $le){ $resid += ($d.delta - (Tab3Current $d)) }
function F-of($name,$d){
  switch($name){
    'H'      { return $d.H/100.0 }
    'elec'   { $u=if($d.High -eq 1){1.0}else{22.0/27}; return [math]::Sqrt($d.Ton*$d.IP)*$u }
    'VF'     { return ($d.VF-55.0)/10.0 }
    'Po'     { return $d.Po }
    'IP'     { return $d.IP }
    'Ton'    { return $d.Ton/100.0 }
    'duty'   { return 1.0/($d.Po+2.0) }
    'Iavg'   { return $d.IP/($d.Po+1.0) }
  }
}
function LooGroup($feats,$lam){
  # moi vat lieu fit rieng: resid ~ b0 + sum b_j*f_j ; tra ve sai so LOO (um) tren moi dong
  $err=@(0)*$n2
  foreach($g in 0,1){
    $idx=@(); for($i=0;$i -lt $n2;$i++){ if($le[$i].hard -eq $g){ $idx+=$i } }
    foreach($i in $idx){
      $tr=@($idx | Where-Object { $_ -ne $i })
      if($feats.Count -eq 0){ $m=0.0; foreach($t in $tr){$m+=$resid[$t]}; $m/=$tr.Count; $err[$i]=($m-$resid[$i])*1000; continue }
      # chuan hoa cot theo tap train
      $mu=@();$sd=@()
      foreach($f in $feats){ $v=@($tr|ForEach-Object{ F-of $f $le[$_] }); $a=($v|Measure-Object -Average).Average; $s=[math]::Sqrt((($v|ForEach-Object{($_-$a)*($_-$a)})|Measure-Object -Sum).Sum/$v.Count); if($s -lt 1e-12){$s=1.0}; $mu+=$a;$sd+=$s }
      $X=@();$yy=@(); foreach($t in $tr){ $row=@(1.0); for($q=0;$q -lt $feats.Count;$q++){ $row+=((F-of $feats[$q] $le[$t])-$mu[$q])/$sd[$q] }; $X+=,$row; $yy+=$resid[$t] }
      $b=Fit $X $yy $lam
      $row=@(1.0); for($q=0;$q -lt $feats.Count;$q++){ $row+=((F-of $feats[$q] $le[$i])-$mu[$q])/$sd[$q] }
      $p=0.0; for($q=0;$q -lt $b.Count;$q++){ $p+=$b[$q]*$row[$q] }
      $err[$i]=($p-$resid[$i])*1000
    }
  }
  return $err
}
function Rep($label,$err){
  $mae=(($err|ForEach-Object{[math]::Abs($_)})|Measure-Object -Average).Average
  $m420=@(); $m440=@(); for($i=0;$i -lt $n2;$i++){ if($le[$i].hard -eq 0){$m420+=[math]::Abs($err[$i])}else{$m440+=[math]::Abs($err[$i])} }
  "{0,-46} LOO-MAE={1,5:N2}   SCM420={2,5:N2}   SCM440={3,5:N2}   max={4,5:N1}" -f $label,$mae,(($m420|Measure-Object -Average).Average),(($m440|Measure-Object -Average).Average),(($err|ForEach-Object{[math]::Abs($_)}|Measure-Object -Maximum).Maximum)
}
$base=@(); foreach($r in $resid){ $base+= -$r*1000 }   # sai so tab3 hien tai (tinh-thuc) = -resid
Rep "Tab 3 hien tai (n=$n2, H<=170)" $base
Rep "M1: + lech hang theo vat lieu" (LooGroup @() 0)
foreach($f in 'H','elec','VF','Po','IP','Ton','duty','Iavg'){
  Rep ("M2: + lech hang + he so rieng cho $f") (LooGroup @($f) 1.0)
}
foreach($pair in @(@('H','elec'),@('H','VF'),@('H','Po'),@('elec','VF'),@('H','Iavg'),@('elec','Po'))){
  Rep ("M3: lech hang + $($pair -join ' & ')") (LooGroup $pair 1.0)
}
"`n--- trung binh phan du theo vat lieu (thuc - Tab3), H<=170 ---"
foreach($g in 0,1){ $v=@(); for($i=0;$i -lt $n2;$i++){ if($le[$i].hard -eq $g){$v+=$resid[$i]*1000} }; "{0}: n={1} TB={2:N2} um" -f $(if($g){'SCM440'}else{'SCM420'}),$v.Count,(($v|Measure-Object -Average).Average) }

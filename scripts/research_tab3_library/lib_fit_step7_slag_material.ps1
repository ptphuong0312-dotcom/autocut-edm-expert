. "$PSScriptRoot\lib_fit_base.ps1"
# Tab 3 voi he so xi vat lieu sm420 tham so hoa (sm440 = 1). Giu nguyen moi he so khac.
function Tab3Sm($d,$sm420){
  $C0=0.0036;$KE=0.00092;$DL=0.0045;$KS=0.02;$KV=0.0039;$KVF=0.0021;$KPO=0.0012
  $u = if($d.High -eq 1){1.0}else{22.0/27.0}
  $H=$d.H;$Ton=$d.Ton;$IP=$d.IP
  $delec=$KE*[math]::Sqrt($Ton*$IP)*$u; $dlow=if($d.High -eq 0){$DL}else{0.0}
  $ipf=[math]::Max(1.0,$IP/4.0); $sm=if($d.hard -eq 1){1.0}else{$sm420}
  $dslag=-$KS*($H/100.0)*$sm/$ipf
  if($H -le 170){ $dvibr=$KV*[math]::Pow($H/100.0,2)*($IP/5.0); $gap=$C0+$delec+$dlow+$dslag+$dvibr; $dvf=$KVF*(($d.VF-55.0)/10.0); $dpo=-$KPO*(($d.Po-5.0)/10.0) }
  else { $g170=$C0+$delec+$dlow+(-$KS*1.70*$sm/$ipf)+($KV*[math]::Pow(1.70,2)*($IP/5.0)); $gap=$g170+($H-170)*(0.025-$g170)/130; $dvf=$KVF*0.5*(($d.VF-65.0)/10.0); $dpo=-$KPO*0.5*(($d.Po-9.0)/10.0) }
  return ($gap+$dvf+$dpo)
}
$le=@($data|Where-Object{$_.H -le 170}); $r420=@($le|Where-Object{$_.hard -eq 0}); $r440=@($le|Where-Object{$_.hard -eq 1})
function MaeSet($set,$sm){ (($set|ForEach-Object{[math]::Abs((Tab3Sm $_ $sm)-$_.delta)*1000})|Measure-Object -Average).Average }
function BiasSet($set,$sm){ (($set|ForEach-Object{((Tab3Sm $_ $sm)-$_.delta)*1000})|Measure-Object -Average).Average }
"sm420 | MAE420 bias420 | MAE440 (khong doi) | MAE tong H<=170"
foreach($sm in 1.1,1.0,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.0){
  "{0,4:N1}  | {1,6:N2} {2,7:N2} | {3,6:N2} | {4,6:N2}" -f $sm,(MaeSet $r420 $sm),(BiasSet $r420 $sm),(MaeSet $r440 $sm),(MaeSet $le $sm)
}
# LOO tren nhom SCM420: bo 1 bai, chon sm toi uu tren phan con lai (luoi), du doan bai bo
$grid=@(); for($s=0.0;$s -le 1.3;$s+=0.05){$grid+=$s}
$loo=@()
for($i=0;$i -lt $r420.Count;$i++){
  $tr=@(); for($j=0;$j -lt $r420.Count;$j++){ if($j -ne $i){$tr+=$r420[$j]} }
  $best=$null;$bm=1e9; foreach($s in $grid){ $m=MaeSet $tr $s; if($m -lt $bm){$bm=$m;$best=$s} }
  $e=[math]::Abs((Tab3Sm $r420[$i] $best)-$r420[$i].delta)*1000; $loo+=$e
  "  bo {0,-6} -> sm420 toi uu = {1:N2}  sai so bai bo = {2:N1} um" -f $r420[$i].name,$best,$e
}
"LOO-MAE SCM420 voi sm420 tu fit: {0:N2} um (hien tai sm=1.1: {1:N2})" -f (($loo|Measure-Object -Average).Average),(MaeSet $r420 1.1)

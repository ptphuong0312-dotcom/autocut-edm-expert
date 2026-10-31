. "$PSScriptRoot\lib_fit_fn.ps1"
$n=$data.Count
# ---- A) AMPE theo cong thuc B (GEMINI.md): I = 6.4*IP/(1+Po)*k ; k=2.2857 (SCM440), 2.8571 (SCM420) ----
$amp=@{ 'H12'=4.0;'H30'=4.475;'H40'=4.375;'H63a'=4.15;'H63b'=3.35;'H68L'=2.5;'H75'=3.45;'H85'=3.65;'H90'=3.55;'H95'=3.65;'H110'=2.75;'H140a'=3.65;'H140b'=3.75;'H160'=2.9;'H165'=2.9;'H300'=3.8 }
"=== AMPE: cong thuc B, k theo vat lieu, so voi may ==="
foreach($mode in 'k theo vat lieu','cung k=2.2857 (khong tach vat lieu)'){
  $se=@(); foreach($d in $data){ if($amp.ContainsKey($d.name)){
    $k = if($mode -like 'k theo*'){ if($d.hard -eq 1){2.2857}else{2.8571} } else {2.2857}
    $I=6.4*$d.IP/(1+$d.Po)*$k; $se += ($I-$amp[$d.name]) } }
  $mae=(($se|ForEach-Object{[math]::Abs($_)})|Measure-Object -Average).Average
  "{0}: MAE={1:N2} A  TB={2:N2}" -f $mode,$mae,(($se|Measure-Object -Average).Average)
}
foreach($g in 0,1){ $se=@(); foreach($d in $data){ if($d.hard -eq $g -and $amp.ContainsKey($d.name)){ $k=if($g){2.2857}else{2.8571}; $I=6.4*$d.IP/(1+$d.Po)*$k; $se+=($I-$amp[$d.name]); "{0,-6} may={1,5:N2} ct={2,5:N2} lech={3,5:N2}" -f $d.name,$amp[$d.name],$I,($I-$amp[$d.name]) } }; "  -> $(if($g){'SCM440'}else{'SCM420'}) MAE=$((($se|ForEach-Object{[math]::Abs($_)})|Measure-Object -Average).Average)" }

# ---- B) Bien 'xa xi' H/IP^k trong mo hinh delta (tat ca 17 bai, LOOCV) ----
"`n=== DELTA: them bien xa xi (do sau / cong suat xung) ==="
function Eval($fn,$lam,$label){
  $Fm=@(); foreach($fnc in $fn){ $col=@(); foreach($d in $data){ $col += [double](& $fnc $d) }; $Fm+=,$col }
  $k=$Fm.Count; $mus=@();$sds=@()
  foreach($c in $Fm){ $mu=($c|Measure-Object -Average).Average; $sd=[math]::Sqrt((($c|ForEach-Object{($_-$mu)*($_-$mu)})|Measure-Object -Sum).Sum/$n); $mus+=$mu;$sds+=$sd }
  $y=@(); foreach($d in $data){ $y += ($d.delta-$(if($d.High -eq 0){0.0045}else{0.0})) }
  $X=@(); for($i=0;$i -lt $n;$i++){ $r=@(1.0); for($q=0;$q -lt $k;$q++){ $r+=(($Fm[$q][$i]-$mus[$q])/$sds[$q]) }; $X+=,$r }
  $loo=@(); for($i=0;$i -lt $n;$i++){ $Xt=@();$yt=@(); for($t=0;$t -lt $n;$t++){ if($t -ne $i){$Xt+=,$X[$t];$yt+=$y[$t]} }; $b=Fit $Xt $yt $lam; $p=0.0; for($q=0;$q -lt $b.Count;$q++){$p+=$b[$q]*$X[$i][$q]}; $loo += ($p-$y[$i])*1000 }
  $a=@(); $m420=@();$m440=@(); for($i=0;$i -lt $n;$i++){ $e=[math]::Abs($loo[$i]); $a+=$e; if($data[$i].hard -eq 0){$m420+=$e}else{$m440+=$e} }
  $bb=Fit $X $y $lam
  "{0,-52} LOO-MAE={1,5:N2} (420={2,5:N2} 440={3,5:N2}) max={4,5:N1}  beta(std)={5}" -f $label,(($a|Measure-Object -Average).Average),(($m420|Measure-Object -Average).Average),(($m440|Measure-Object -Average).Average),(($a|Measure-Object -Maximum).Maximum),(($bb|ForEach-Object{'{0:N1}' -f ($_*1000)}) -join ',')
}
$fH_IP   ={param($d)($d.H/100.0)/$d.IP}
$fH_IP2  ={param($d)($d.H/100.0)/($d.IP*$d.IP)}
$fH_Iavg ={param($d)($d.H/100.0)/($d.IP/($d.Po+1.0))}
$fH_P    ={param($d)($d.H/100.0)/($d.IP*$d.Ton/100.0)}
$felec   ={param($d)$u=if($d.High -eq 1){1.0}else{22.0/27};[math]::Sqrt($d.Ton*$d.IP)*$u}
$fVF     ={param($d)($d.VF-55.0)/10.0}
$fhard   ={param($d)$d.hard}
$fH      ={param($d)$d.H/100.0}
Eval @($felec) 0.5 'elec'
Eval @($fH_IP) 0.5 'H/IP'
Eval @($fH_IP2) 0.5 'H/IP^2'
Eval @($fH_Iavg) 0.5 'H/Iavg'
Eval @($fH_P) 0.5 'H/(IP*Ton)'
Eval @($fH,$fH_IP2) 0.5 'H + H/IP^2'
Eval @($felec,$fH_IP2) 0.5 'elec + H/IP^2'
Eval @($felec,$fH_IP) 0.5 'elec + H/IP'
Eval @($felec,$fH_IP2,$fVF) 0.5 'elec + H/IP^2 + VF'
Eval @($felec,$fH_IP2,$fhard) 0.5 'elec + H/IP^2 + vat lieu'
Eval @($fH_IP2,$fhard) 0.5 'H/IP^2 + vat lieu'
Eval @($fH_IP,$fhard) 0.5 'H/IP + vat lieu'
Eval @($felec,$fH,$fhard) 0.5 'elec + H + vat lieu'


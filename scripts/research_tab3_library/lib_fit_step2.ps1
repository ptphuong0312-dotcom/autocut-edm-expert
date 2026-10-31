. "$PSScriptRoot\lib_fit_base.ps1"

function Solve($A,$b){
  $n=$b.Length
  $M=@(); for($i=0;$i -lt $n;$i++){ $row=New-Object 'double[]' ($n+1); for($j=0;$j -lt $n;$j++){$row[$j]=$A[$i][$j]}; $row[$n]=$b[$i]; $M+=,$row }
  for($c=0;$c -lt $n;$c++){
    $piv=$c; for($r=$c+1;$r -lt $n;$r++){ if([math]::Abs($M[$r][$c]) -gt [math]::Abs($M[$piv][$c])){$piv=$r} }
    if([math]::Abs($M[$piv][$c]) -lt 1e-14){ return $null }
    $tmp=$M[$c]; $M[$c]=$M[$piv]; $M[$piv]=$tmp
    for($r=0;$r -lt $n;$r++){ if($r -ne $c){ $f=$M[$r][$c]/$M[$c][$c]; for($j=$c;$j -le $n;$j++){ $M[$r][$j]-=$f*$M[$c][$j] } } }
  }
  $x=New-Object 'double[]' $n
  for($i=0;$i -lt $n;$i++){ $x[$i]=$M[$i][$n]/$M[$i][$i] }
  return ,$x
}

function Fit($X,$yv,$lam){
  $cnt=$yv.Count; $k=$X[0].Count
  $Mat=@(); for($p1=0;$p1 -lt $k;$p1++){ $Mat+=,(New-Object 'double[]' $k) }
  $vec=New-Object 'double[]' $k
  for($i=0;$i -lt $cnt;$i++){ for($p1=0;$p1 -lt $k;$p1++){ $vec[$p1]+=$X[$i][$p1]*$yv[$i]; for($p2=0;$p2 -lt $k;$p2++){ $Mat[$p1][$p2]+=$X[$i][$p1]*$X[$i][$p2] } } }
  for($p1=1;$p1 -lt $k;$p1++){ $Mat[$p1][$p1]+=$lam }
  return (Solve $Mat $vec)
}
# Feature definitions (physical, continuous). U_arc: High 27V / Low 22V
$feat = [ordered]@{
 'sqrt(Ton*IP)*U'  = { param($d) $u=if($d.High -eq 1){1.0}else{22.0/27}; [math]::Sqrt($d.Ton*$d.IP)*$u }
 'cbrt(Ton*IP*U)'  = { param($d) $U=if($d.High -eq 1){27.0}else{22.0}; [math]::Pow($d.Ton*$d.IP*$U,1.0/3) }
 'ln(Ton)'         = { param($d) [math]::Log($d.Ton) }
 'IP'              = { param($d) $d.IP }
 'Iavg=IP/(Po+1)'  = { param($d) $d.IP/($d.Po+1.0) }
 'duty=1/(Po+2)'   = { param($d) 1.0/($d.Po+2.0) }
 'Po'              = { param($d) $d.Po }
 'ln(Toff)'        = { param($d) [math]::Log($d.Ton*($d.Po+1.0)) }
 'H/100'           = { param($d) $d.H/100.0 }
 '(H/100)^2'       = { param($d) [math]::Pow($d.H/100.0,2) }
 'sqrt(H/100)'     = { param($d) [math]::Sqrt($d.H/100.0) }
 '(VF-55)/10'      = { param($d) ($d.VF-55.0)/10.0 }
 'ln(Hz)'          = { param($d) [math]::Log($d.Hz) }
 'Pavg/H'          = { param($d) ($d.Ton*0+ ($d.IP/($d.Po+1.0))*27.0)/($d.H) }
 'Ton*Iavg/100'    = { param($d) $d.Ton*$d.IP/($d.Po+1.0)/100.0 }
 'hard(SCM440)'    = { param($d) $d.hard }
}
$names=@($feat.Keys)
# Low-volt: co dinh d_low=4.5um (prior), tru khoi muc tieu de khong can he so (chi 1 bai Low trong thu vien)
$y=@(); foreach($d in $data){ $y += ($d.delta - $(if($d.High -eq 0){0.0045}else{0.0})) }
$F=@{}; foreach($nm in $names){ $F[$nm]=@(); foreach($d in $data){ $F[$nm]+= [double](& $feat[$nm] $d) } }
$n=$data.Count

function EvalSubset($idx,$lam){
  # standardize columns
  $cols=@(); foreach($j in $idx){ $v=$F[$names[$j]]; $mu=($v|Measure-Object -Average).Average; $sd=[math]::Sqrt((($v|ForEach-Object{($_-$mu)*($_-$mu)})|Measure-Object -Sum).Sum/$n); if($sd -lt 1e-12){return $null}; $cols += ,@($mu,$sd) }
  $X=@(); for($i=0;$i -lt $n;$i++){ $r=@(1.0); for($q=0;$q -lt $idx.Count;$q++){ $r += (($F[$names[$idx[$q]]][$i]-$cols[$q][0])/$cols[$q][1]) }; $X += ,$r }
  $beta=Fit $X $y $lam; if($null -eq $beta){return $null}
  $ins=0.0; $loo=0.0; $mx=0.0
  for($i=0;$i -lt $n;$i++){
    $p=0.0; for($a=0;$a -lt $beta.Count;$a++){ $p+=$beta[$a]*$X[$i][$a] }
    $ins+=[math]::Abs($p-$y[$i])
    $Xt=@();$yt=@(); for($t=0;$t -lt $n;$t++){ if($t -ne $i){ $Xt+=,$X[$t]; $yt+=$y[$t] } }
    $bt=Fit $Xt $yt $lam; if($null -eq $bt){return $null}
    $pl=0.0; for($a=0;$a -lt $bt.Count;$a++){ $pl+=$bt[$a]*$X[$i][$a] }
    $e=[math]::Abs($pl-$y[$i]); $loo+=$e; if($e -gt $mx){$mx=$e}
  }
  return [pscustomobject]@{ idx=$idx; ins=$ins/$n*1000; loo=$loo/$n*1000; loomax=$mx*1000; beta=$beta; cols=$cols }
}
$res=@()
$lam=0.5
for($a=0;$a -lt $names.Count;$a++){
  $r=EvalSubset @($a) $lam; if($r){$res+=$r}
  for($b=$a+1;$b -lt $names.Count;$b++){
    $r=EvalSubset @($a,$b) $lam; if($r){$res+=$r}
    for($c=$b+1;$c -lt $names.Count;$c++){
      $r=EvalSubset @($a,$b,$c) $lam; if($r){$res+=$r}
    }
  }
}
"Da danh gia $($res.Count) mo hinh (<=3 bien, ridge lambda=$lam, ca Low co dinh 4.5um)"
$res | Sort-Object loo | Select-Object -First 25 | ForEach-Object {
  "{0,5:N2} {1,5:N2} {2,6:N2}  {3}" -f $_.ins,$_.loo,$_.loomax,(($_.idx|ForEach-Object{$names[$_]}) -join '  +  ')
}
"(cot: MAE-trong-mau | LOO-MAE | LOO-Max, don vi um)"



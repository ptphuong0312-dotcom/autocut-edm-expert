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


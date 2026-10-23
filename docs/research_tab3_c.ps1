[Console]::OutputEncoding = [Text.Encoding]::UTF8
$src = Get-Content "$PSScriptRoot\research_tab3.ps1" -Raw -Encoding UTF8
$cut = $src.IndexOf('Write-Host "=== N ="')
Invoke-Expression $src.Substring(0,$cut)

$sets = [ordered]@{
 'P1 c+vf+die'        = @('c','vf','die');
 'P2 c+elec+vf+die'   = @('c','elec','vf','die');
 'P3 c+H+vf+die'      = @('c','H','vf','die');
 'P4 c+elec+H+vf+die' = @('c','elec','H','vf','die');
 'P5 c+die'           = @('c','die')
}
# H=300 STT14 out-of-sample (cối, SCM440, Ton120 Po9 IP6 High VF65) δ=25
$t300 = [pscustomobject]@{N='STT14';Mat=440;H=300;Ton=120;Po=9;IP=6;Volt='H';VF=65;Die=1;d=0.025}
foreach($k in $sets.Keys){
  $set=$sets[$k]; $b0=@(0.0)*$set.Count
  $b = Fit $D $set $b0 $b0
  $cs=''; for($i=0;$i -lt $set.Count;$i++){ $cs += ("{0}={1:N2}µm " -f $set[$i],($b[$i]*1000)) }
  Write-Host "`n[$k]  $cs"
  $lo=@()
  for($i=0;$i -lt $D.Count;$i++){
    $tr=@(); for($j=0;$j -lt $D.Count;$j++){ if($j -ne $i){$tr+=$D[$j]} }
    $bb = Fit $tr $set $b0 $b0
    $lo += ((Predict $D[$i] $set $bb)-$D[$i].d)*1000
  }
  $ins = $D | %{ ((Predict $_ $set $b)-$_.d)*1000 }
  Write-Host ("   in-sample: MAE={0:N2} Max={1:N2}   LOO: MAE={2:N2} RMSE={3:N2} Max={4:N2}" -f ((($ins|%{[math]::Abs($_)})|Measure-Object -Average).Average),((($ins|%{[math]::Abs($_)})|Measure-Object -Maximum).Maximum),((($lo|%{[math]::Abs($_)})|Measure-Object -Average).Average),[math]::Sqrt((($lo|%{$_*$_})|Measure-Object -Average).Average),((($lo|%{[math]::Abs($_)})|Measure-Object -Maximum).Maximum))
  $p300 = Predict $t300 $set $b
  Write-Host ("   Out-of-sample H=300 (STT14, cối): dự đoán {0:N2} µm vs thực 25.00 -> Δ={1:N2} µm" -f ($p300*1000),(($p300-0.025)*1000))
}

Write-Host "`n=== Bảng từng bài: Tab3 hiện tại vs P1 vs P2 (LOO) ==="
$setA=$sets['P1 c+vf+die']; $setB=$sets['P2 c+elec+vf+die']
"{0,-11} {1,3} {2,5} {3,5} {4,3} {5,2} {6,5} | {7,6} | {8,8} {9,8} {10,8}" -f 'Bài','H','Loại','Ton','IP','VF','Po','δthực','Tab3 Δ','P1 LOO Δ','P2 LOO Δ'
for($i=0;$i -lt $D.Count;$i++){
  $tr=@(); for($j=0;$j -lt $D.Count;$j++){ if($j -ne $i){$tr+=$D[$j]} }
  $z=@(0.0)*3; $bA = Fit $tr $setA $z $z; $z4=@(0.0)*4; $bB = Fit $tr $setB $z4 $z4
  $pA=((Predict $D[$i] $setA $bA)-$D[$i].d)*1000; $pB=((Predict $D[$i] $setB $bB)-$D[$i].d)*1000
  $t=Tab3-Current $D[$i]; $tA=($t.full-$D[$i].d)*1000
  "{0,-11} {1,3} {2,5} {3,5} {4,3} {5,2} {6,5} | {7,6:N2} | {8,8:N2} {9,8:N2} {10,8:N2}" -f $D[$i].N,$D[$i].H,$(if($D[$i].Die){'cối'}else{'chày'}),$D[$i].Ton,$D[$i].IP,$D[$i].VF,$D[$i].Po,($D[$i].d*1000),$tA,$pA,$pB
}

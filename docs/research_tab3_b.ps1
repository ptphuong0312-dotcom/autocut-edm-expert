[Console]::OutputEncoding = [Text.Encoding]::UTF8
$src = Get-Content "$PSScriptRoot\research_tab3.ps1" -Raw -Encoding UTF8
$cut = $src.IndexOf('Write-Host "=== N ="')
Invoke-Expression $src.Substring(0,$cut)

function Mean($a){ ($a|Measure-Object -Average).Average }
function SD($a){ $m=Mean $a; [math]::Sqrt((($a|%{($_-$m)*($_-$m)})|Measure-Object -Sum).Sum/($a.Count-1)) }

Write-Host "=== 1. So sánh nhóm Cối vs Chày (δ thực, µm) ==="
$die = $D | ?{$_.Die -eq 1} | %{$_.d*1000}
$pun = $D | ?{$_.Die -eq 0} | %{$_.d*1000}
"Cối : n={0} mean={1:N2} sd={2:N2}  [{3}]" -f $die.Count,(Mean $die),(SD $die),($die -join ', ')
"Chày: n={0} mean={1:N2} sd={2:N2}  [{3}]" -f $pun.Count,(Mean $pun),(SD $pun),($pun -join ', ')
$se=[math]::Sqrt([math]::Pow((SD $die),2)/$die.Count+[math]::Pow((SD $pun),2)/$pun.Count)
"Welch t = {0:N2}  (chênh trung bình {1:N2} µm)" -f (((Mean $die)-(Mean $pun))/$se),((Mean $die)-(Mean $pun))
# exact permutation test: all C(14,5)=2002 ways to label 5 points as "coi"
$dv = @($D | %{ $_.d*1000 }); $obs = (Mean $die)-(Mean $pun); $cnt=0; $tot=0; $nn=$dv.Count; $sall=($dv|Measure-Object -Sum).Sum
for($i1=0;$i1 -lt $nn;$i1++){ for($i2=$i1+1;$i2 -lt $nn;$i2++){ for($i3=$i2+1;$i3 -lt $nn;$i3++){ for($i4=$i3+1;$i4 -lt $nn;$i4++){ for($i5=$i4+1;$i5 -lt $nn;$i5++){
  $sa=$dv[$i1]+$dv[$i2]+$dv[$i3]+$dv[$i4]+$dv[$i5]
  $diff=$sa/5 - ($sall-$sa)/($nn-5); $tot++; if([math]::Abs($diff) -ge [math]::Abs($obs)){$cnt++}
}}}}}
"Exact permutation test: {0}/{1} => p = {2:N4}" -f $cnt,$tot,($cnt/$tot)
Write-Host "`n=== 2. Tương quan giữa các biến đầu vào (đa cộng tuyến) ==="
function Corr($x,$y){ $mx=Mean $x;$my=Mean $y; $sxy=0;$sxx=0;$syy=0; for($i=0;$i -lt $x.Count;$i++){ $sxy+=($x[$i]-$mx)*($y[$i]-$my);$sxx+=[math]::Pow($x[$i]-$mx,2);$syy+=[math]::Pow($y[$i]-$my,2)}; $sxy/[math]::Sqrt($sxx*$syy) }
$vH  = $D|%{[double]$_.H}
$vE  = $D|%{[math]::Sqrt($_.Ton*$_.IP)}
$vT  = $D|%{[double]$_.Ton}
$vIP = $D|%{[double]$_.IP}
$vVF = $D|%{[double]$_.VF}
$vPo = $D|%{[double]$_.Po}
$vD  = $D|%{[double]$_.Die}
$vdl = $D|%{[double]$_.d*1000}
"corr(H, sqrt(Ton*IP)) = {0:N3}" -f (Corr $vH $vE)
"corr(H, Ton)          = {0:N3}" -f (Corr $vH $vT)
"corr(H, IP)           = {0:N3}" -f (Corr $vH $vIP)
"corr(H, Po)           = {0:N3}" -f (Corr $vH $vPo)
"corr(H, VF)           = {0:N3}" -f (Corr $vH $vVF)
"corr(H, Cối)          = {0:N3}" -f (Corr $vH $vD)
Write-Host "--- tương quan với δ thực ---"
"corr(δ, H)    = {0:N3}" -f (Corr $vdl $vH)
"corr(δ, sqrt(Ton*IP)) = {0:N3}" -f (Corr $vdl $vE)
"corr(δ, IP)   = {0:N3}" -f (Corr $vdl $vIP)
"corr(δ, VF)   = {0:N3}" -f (Corr $vdl $vVF)
"corr(δ, Po)   = {0:N3}" -f (Corr $vdl $vPo)
"corr(δ, Cối)  = {0:N3}" -f (Corr $vdl $vD)

Write-Host "`n=== 3. Duyệt tập con đặc trưng (c luôn có), xếp theo LOO-RMSE ==="
$pool = @('elec','slag','vibr','vf','po','die','H','ip','ton','iavg')
function LooStats($set,$beta0){
  $lam=@(0.0)*$set.Count
  $lo=@()
  for($i=0;$i -lt $D.Count;$i++){
    $tr=@(); for($j=0;$j -lt $D.Count;$j++){ if($j -ne $i){$tr+=$D[$j]} }
    $bb = Fit $tr $set $beta0 $lam
    $lo += ((Predict $D[$i] $set $bb)-$D[$i].d)*1000
  }
  $mae = Mean ($lo|%{[math]::Abs($_)})
  $rmse=[math]::Sqrt((Mean ($lo|%{$_*$_})))
  $mx=($lo|%{[math]::Abs($_)}|Measure-Object -Maximum).Maximum
  return @($mae,$rmse,$mx)
}
$res=@()
$n=$pool.Count
for($mask=1;$mask -lt [math]::Pow(2,$n);$mask++){
  $bits=0;for($b=0;$b -lt $n;$b++){ if(($mask -shr $b) -band 1){$bits++} }
  if($bits -gt 3){continue}
  $set=@('c'); for($b=0;$b -lt $n;$b++){ if(($mask -shr $b) -band 1){$set+=$pool[$b]} }
  $b0=@(0.0)*$set.Count
  try{ $s=LooStats $set $b0; $res += [pscustomobject]@{Set=($set -join '+');MAE=$s[0];RMSE=$s[1];Max=$s[2]} }catch{}
}
$res | Sort-Object RMSE | Select-Object -First 15 | %{ "{0,-32} LOO-MAE={1,5:N2} RMSE={2,5:N2} Max={3,5:N2}" -f $_.Set,$_.MAE,$_.RMSE,$_.Max }
Write-Host "`n--- Top theo tập KHÔNG có die (đối chứng) ---"
$res | ?{$_.Set -notmatch 'die'} | Sort-Object RMSE | Select-Object -First 6 | %{ "{0,-32} LOO-MAE={1,5:N2} RMSE={2,5:N2} Max={3,5:N2}" -f $_.Set,$_.MAE,$_.RMSE,$_.Max }
Write-Host "`n--- Số tập có die trong top 20 / tổng top 20 ---"
$top=$res | Sort-Object RMSE | Select-Object -First 20
"{0}/20 chứa die" -f ($top | ?{$_.Set -match 'die'}).Count

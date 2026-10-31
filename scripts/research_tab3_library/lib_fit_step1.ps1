. "$PSScriptRoot\lib_fit_base.ps1"
$rows=@(); $ae=@(); $se=0.0
foreach($d in $data){
  $p = Tab3Current $d
  $e = ($p-$d.delta)*1000
  $ae += [math]::Abs($e); $se += $e*$e
  $rows += ("{0,-6} H={1,3} Ton={2,3} Po={3,2} IP={4} VF={5,2}  real={6,5:N1}  tab3={7,5:N1}  err={8,6:N1} um" -f $d.name,$d.H,$d.Ton,$d.Po,$d.IP,$d.VF,($d.delta*1000),($p*1000),$e)
}
$rows
$n=$data.Count
"N=$n  MAE={0:N2} um  RMSE={1:N2} um  Max={2:N2} um" -f (($ae|Measure-Object -Average).Average),([math]::Sqrt($se/$n)),(($ae|Measure-Object -Maximum).Maximum)
$mean = ($data | Measure-Object delta -Average).Average
$mae0 = ($data | ForEach-Object {[math]::Abs($_.delta-$mean)*1000} | Measure-Object -Average).Average
"Baseline hang so (trung binh {0:N1} um): MAE={1:N2} um" -f ($mean*1000),$mae0
$le = $data | Where-Object {$_.H -le 170}
$ae2 = $le | ForEach-Object {[math]::Abs((Tab3Current $_)-$_.delta)*1000}
"Chi H<=170 (N=$($le.Count)): MAE={0:N2}" -f (($ae2|Measure-Object -Average).Average)

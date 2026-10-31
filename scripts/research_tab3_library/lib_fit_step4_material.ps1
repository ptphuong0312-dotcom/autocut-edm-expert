. "$PSScriptRoot\lib_fit_fn.ps1"
$n=$data.Count
# trung diem Ampe va toc do may hien thi (mm2/p) theo thu vien web app (NaN = khong co)
$amp=@{ 'H12'=4.0;'H30'=4.475;'H40'=4.375;'H63a'=4.15;'H63b'=3.35;'H68L'=2.5;'H75'=3.45;'H85'=3.65;'H90'=3.55;'H95'=3.65;'H110'=2.75;'H140a'=3.65;'H140b'=3.75;'H160'=2.9;'H165'=2.9;'H300'=3.8 }
$spd=@{ 'H12'=280;'H30'=170;'H40'=135;'H63a'=80;'H63b'=57.5;'H75'=57.5;'H85'=60;'H90'=55;'H95'=40;'H110'=35;'H140b'=35;'H160'=23;'H165'=25;'H300'=16 }

"=== 1) AMPE: ty so thuc/cong thuc theo vat lieu ==="
"Tab3 hien tai: I = 2.8*IP*duty*1.15 ; Tab2: I = 2.8*IP*duty*2.6667*(U/27)"
foreach($grp in 0,1){
  $name = if($grp -eq 1){'SCM440 (28-32HRC)'}else{'SCM420 (HB<200)'}
  $r3=@();$r2=@()
  foreach($d in $data){ if($d.hard -eq $grp -and $amp.ContainsKey($d.name)){
    $u=if($d.High -eq 1){27.0}else{22.0}; $duty=1.0/($d.Po+2.0)
    $i3=2.8*$d.IP*$duty*1.15; $i2=2.8*$d.IP*$duty*2.6667*($u/27.0)
    $r3+=$amp[$d.name]/$i3; $r2+=$amp[$d.name]/$i2
    "{0,-6} actual={1,5:N2}  tab3={2,5:N2}  tab2form={3,5:N2}" -f $d.name,$amp[$d.name],$i3,$i2
  } }
  "{0}: n={1}  actual/tab3 = {2:N2}   actual/tab2form = {3:N3}  (min {4:N2} max {5:N2})" -f $name,$r3.Count,(($r3|Measure-Object -Average).Average),(($r2|Measure-Object -Average).Average),(($r2|Measure-Object -Minimum).Minimum),(($r2|Measure-Object -Maximum).Maximum)
}

"`n=== 2) TOC DO (may hien thi ~ Ft*40): Tab3 fc_est vs thuc ==="
foreach($grp in 0,1){
  $name = if($grp -eq 1){'SCM440'}else{'SCM420'}
  $rr=@()
  foreach($d in $data){ if($d.hard -eq $grp -and $spd.ContainsKey($d.name)){
    $u=if($d.High -eq 1){27.0}else{22.0}; $duty=1.0/($d.Po+2.0); $P=$u*2.8*$d.IP*$duty
    $fc=60*0.014*$P*0.78/0.23          # Tab3: mm2/p (feed*H)
    $ft40=$fc/$d.H*40                  # quy ve co so may hien thi (Ft*40)
    $rr+=$spd[$d.name]/$ft40
    "{0,-6} H={1,3} actual={2,6:N1}  tab3(feed*H)={3,6:N1}  tab3 quy Ft*40={4,6:N1}  ratio={5:N2}" -f $d.name,$d.H,$spd[$d.name],$fc,$ft40,($spd[$d.name]/$ft40)
  } }
  "{0}: ratio trung binh = {1:N2}" -f $name,(($rr|Measure-Object -Average).Average)
}

"`n=== 3) KHE HO delta: sai so Tab3 theo vat lieu ==="
foreach($grp in 0,1){
  $name = if($grp -eq 1){'SCM440'}else{'SCM420'}
  $e=@(); foreach($d in $data){ if($d.hard -eq $grp){ $e += ((Tab3Current $d)-$d.delta)*1000 } }
  "{0}: n={1}  sai so TB (tinh-thuc) = {2:N2} um   MAE = {3:N2} um" -f $name,$e.Count,(($e|Measure-Object -Average).Average),(($e|ForEach-Object{[math]::Abs($_)}|Measure-Object -Average).Average)
}

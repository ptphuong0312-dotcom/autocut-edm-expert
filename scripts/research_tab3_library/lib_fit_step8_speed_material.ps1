. "$PSScriptRoot\lib_fit_base.ps1"
$spd=@{ 'H12'=280;'H30'=170;'H40'=135;'H63a'=80;'H63b'=57.5;'H75'=57.5;'H85'=60;'H90'=55;'H95'=40;'H110'=35;'H140b'=35;'H160'=23;'H165'=25;'H300'=16 }
function Ft40($d,$mode){
  $u=if($d.High -eq 1){27.0}else{22.0}; $duty=1.0/($d.Po+2.0); $P=$u*2.8*$d.IP*$duty
  $H=$d.H;$Ton=$d.Ton;$IP=$d.IP;$hard=($d.hard -eq 1)
  if($mode -eq 'tab3'){ $eta=0.78 }
  else {
    $eta=$(if($hard){0.85}else{0.78})*[math]::Pow([math]::Max(1,$Ton)/50.0,0.38)
    if($Ton -gt 80){ $eta=[math]::Min(0.92,$eta) }
    if($hard){ if($H -gt 80){ $eta*=[math]::Max(0.65,1.0-($H-80)*0.0010) } } else { if($H -gt 50){ $eta*=[math]::Max(0.55,1.0-($H-50)*0.0016) } }
    if((-not $hard) -and $H -ge 70 -and $IP -lt 5){ $eta*=0.65 }
  }
  $fc=60*0.0140*$P*$eta/0.23     # mm2/p = feed*H
  return $fc/$H*40.0             # co so may hien thi
}
foreach($mode in 'tab3','tab2'){
  "--- engine toc do: $mode ---"
  foreach($g in 0,1){
    $rr=@();$ae=@()
    foreach($d in $data){ if($d.hard -eq $g -and $spd.ContainsKey($d.name)){ $c=Ft40 $d $mode; $rr+=($c/$spd[$d.name]); $ae+=[math]::Abs($c-$spd[$d.name])/$spd[$d.name]*100 } }
    "{0}: n={1} ty so tinh/thuc TB={2:N2}  sai so tuong doi TB={3:N1}%" -f $(if($g){'SCM440'}else{'SCM420'}),$rr.Count,(($rr|Measure-Object -Average).Average),(($ae|Measure-Object -Average).Average)
  }
  $ae=@(); foreach($d in $data){ if($spd.ContainsKey($d.name)){ $c=Ft40 $d $mode; $ae+=[math]::Abs($c-$spd[$d.name])/$spd[$d.name]*100 } }
  "TONG: sai so tuong doi TB = {0:N1}%" -f (($ae|Measure-Object -Average).Average)
}
"--- chi tiet tab2 ---"
foreach($d in $data){ if($spd.ContainsKey($d.name)){ "{0,-6} {1} may={2,6:N1} tab2eng={3,6:N1} tab3eng={4,6:N1}" -f $d.name,$(if($d.hard){'440'}else{'420'}),$spd[$d.name],(Ft40 $d 'tab2'),(Ft40 $d 'tab3') } }

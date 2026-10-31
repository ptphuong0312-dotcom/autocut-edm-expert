# Thu vien 1 Pass tren web app (WS_LIB_BENCHMARK_JOBS[1]) - 17 bai, KHONG gom Vung C
# cols: name, H, hard(1=SCM440,0=SCM420), Ton, Po, IP, High(1/0), VF, Hz, offset(mm)
$raw = @(
 @('H12',   12,1, 20, 5,3,1,65,150,0.101),
 @('H30',   30,1, 32, 5,4,1,65,200,0.098),
 @('H40',   40,1, 36, 5,4,1,65,180,0.098),
 @('H63a',  63,0, 44, 7,5,1,55,150,0.095),
 @('H63b',  63,0, 44, 8,4,1,57,150,0.098),
 @('H68L',  68,1, 70, 7,3,0,50,100,0.097),
 @('H75',   75,0, 55, 7,4,1,54,187,0.112),
 @('H85',   85,1, 70, 8,5,1,61,150,0.1025),
 @('H90',   90,0, 80, 7,4,1,54,150,0.118),
 @('H95',   95,1, 82, 7,4,1,55,150,0.1135),
 @('H110', 110,0,100,10,5,1,65,150,0.105),
 @('H140a',140,0,120, 8,5,1,55, 50,0.095),
 @('H140b',140,0,100, 9,6,1,60,100,0.102),
 @('H160', 160,0,120,11,6,1,70,154,0.120),
 @('H165', 165,1,135,11,6,1,70, 60,0.1125),
 @('H290', 290,1,135,10,6,1,75, 50,0.110),
 @('H300', 300,1,120, 9,6,1,65, 50,0.115)
)
$data = foreach($r in $raw){
  [pscustomobject]@{ name=$r[0]; H=[double]$r[1]; hard=[double]$r[2]; Ton=[double]$r[3]; Po=[double]$r[4]; IP=[double]$r[5]; High=[double]$r[6]; VF=[double]$r[7]; Hz=[double]$r[8]; off=[double]$r[9]; delta=([double]$r[9]-0.090) }
}

# ---- Tab 3 hien tai (port nguyen van tu app.js calcVFSparkGap) ----
function Tab3Current($d){
  $C0=0.0036;$KE=0.00092;$DL=0.0045;$KS=0.02;$KV=0.0039;$KVF=0.0021;$KPO=0.0012
  $isHard = ($d.hard -eq 1)
  $u = if($d.High -eq 1){1.0}else{22.0/27.0}
  $H=$d.H;$Ton=$d.Ton;$IP=$d.IP
  $delec = $KE*[math]::Sqrt([math]::Max(1,$Ton)*[math]::Max(1,$IP))*$u
  $dlow = if($d.High -eq 0){$DL}else{0.0}
  $ipf=[math]::Max(1.0,$IP/4.0)
  $sm= if($isHard){1.0}else{1.10}
  $dslag = -$KS*($H/100.0)*$sm/$ipf
  if($H -le 170){
    $dvibr=$KV*[math]::Pow($H/100.0,2)*($IP/5.0)
    $gap=$C0+$delec+$dlow+$dslag+$dvibr
    $dvf=$KVF*(($d.VF-55.0)/10.0)
    $dpo=-$KPO*(($d.Po-5.0)/10.0)
  } else {
    $g170=$C0+$delec+$dlow+(-$KS*1.70*$sm/$ipf)+($KV*[math]::Pow(1.70,2)*($IP/5.0))
    $gap=$g170+($H-170)*(0.025-$g170)/(300-170)
    $dvf=$KVF*0.5*(($d.VF-65.0)/10.0)
    $dpo=-$KPO*0.5*(($d.Po-9.0)/10.0)
  }
  return ($gap+$dvf+$dpo)
}

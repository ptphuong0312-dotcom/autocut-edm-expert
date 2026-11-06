# ==============================================================================
# AUDIT SPARK GAP & OFFSET BENCHMARK (RULE 17 & RULE 19 - POWERSHELL NATIVE)
# DU AN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - v3.5.54 (VONG 5 CAN BANG TOAN CAU)
# ==============================================================================

$C0 = 0.00200
$K_ELEC = 0.00070
$K_VF = 0.00210
$K_VIBR = 0.00350
$K_H_CONF = 0.00650
$K_SPD = 0.00550
$K_SEC_BASE = 0.160
$H_THRESH = 63.0
$PO_THRESH = 8.0
$S_EXP = 0.65

function Calc-Gap($H, $Ton, $Po, $IP, $Volt, $VF, $speed = 150, $mat = 'SCM440') {
    $isHard = ($mat -eq 'SCM440' -or $mat -eq '30HRC')
    if ($H -le 170) {
        $u_ratio = if ($Volt -eq 'High' -or $Volt -eq 'H') { 1.0 } else { 0.815 }
        $d_elec = $K_ELEC * [Math]::Sqrt($Ton * $IP) * $u_ratio
        $d_vf = $K_VF * (($VF - 55.0) / 10.0)
        $d_vibr = $K_VIBR * [Math]::Pow($H / 100.0, 2) * ($IP / 5.0)
        $d_h_conf = - $K_H_CONF * ($H / 100.0)
        $d_spd = if ($H -ge 110 -and $speed -lt 150) {
            - $K_SPD * ((150.0 - $speed) / 100.0) * [Math]::Pow($H / 100.0, 1.2)
        } else {
            0.0
        }
        $h_starve = [Math]::Max(0.0, ($H - $H_THRESH) / 100.0)
        $po_shortage = [Math]::Max(0.0, ($PO_THRESH - $Po) / 10.0)
        $mat_boost = if ($isHard) { 1.0 } else { 2.60 }
        $d_sec = $K_SEC_BASE * [Math]::Pow($h_starve, $S_EXP) * $po_shortage * $mat_boost
        return $C0 + $d_elec + $d_vf + $d_vibr + $d_h_conf + $d_spd + $d_sec
    } else {
        $calc = 0.0187 + ($H - 170) * (0.0250 - 0.0187) / (300 - 170)
        $d_vf = $K_VF * 0.5 * (($VF - 65.0) / 10.0)
        return $calc + $d_vf
    }
}

$dataset = @(
    # 1-Pass Benchmark cuts (19 bai thuc nghiem)
    @{ name='1P-5P01'; grp='1P Quy doi 5P-01'; H=12;  Ton=20;  Po=5;  IP=3; Volt='High'; VF=65; speed=150; mat='SCM440'; actual_gap=0.0110; actual_O1=0.1010 },
    @{ name='STT 22';  grp='1P SCM420 chay L'; H=12;  Ton=16;  Po=6;  IP=3; Volt='Low';  VF=60; speed=150; mat='SCM420'; actual_gap=0.0050; actual_O1=0.0950 },
    @{ name='STT 1';   grp='1P Chuan goc';     H=30;  Ton=32;  Po=5;  IP=4; Volt='High'; VF=65; speed=200; mat='SCM440'; actual_gap=0.0080; actual_O1=0.0980 },
    @{ name='STT 2';   grp='1P Chuan goc';     H=40;  Ton=36;  Po=5;  IP=4; Volt='High'; VF=65; speed=180; mat='SCM440'; actual_gap=0.0080; actual_O1=0.0980 },
    @{ name='STT 3';   grp='1P SCM420 chay';   H=63;  Ton=44;  Po=7;  IP=5; Volt='High'; VF=55; speed=150; mat='SCM420'; actual_gap=0.0050; actual_O1=0.0950 },
    @{ name='STT 18';  grp='1P SCM420 chay';   H=63;  Ton=44;  Po=8;  IP=4; Volt='High'; VF=57; speed=150; mat='SCM420'; actual_gap=0.0080; actual_O1=0.0980 },
    @{ name='STT 6';   grp='1P SCM440 chay L'; H=68;  Ton=70;  Po=7;  IP=3; Volt='Low';  VF=50; speed=100; mat='SCM440'; actual_gap=0.0070; actual_O1=0.0970 },
    @{ name='STT 16';  grp='1P SCM420 coi';    H=75;  Ton=55;  Po=7;  IP=4; Volt='High'; VF=54; speed=187; mat='SCM420'; actual_gap=0.0220; actual_O1=0.1120 },
    @{ name='1P-2P10'; grp='1P Quy doi 2P-10'; H=85;  Ton=70;  Po=8;  IP=5; Volt='High'; VF=61; speed=150; mat='SCM440'; actual_gap=0.0125; actual_O1=0.1025 },
    @{ name='STT 21';  grp='1P SCM420 coi';    H=90;  Ton=80;  Po=7;  IP=4; Volt='High'; VF=54; speed=150; mat='SCM420'; actual_gap=0.0280; actual_O1=0.1180 },
    @{ name='STT 17';  grp='1P SCM440 coi';    H=95;  Ton=82;  Po=7;  IP=4; Volt='High'; VF=55; speed=150; mat='SCM440'; actual_gap=0.0235; actual_O1=0.1135 },
    @{ name='STT 19';  grp='1P SCM420 chay';   H=110; Ton=100; Po=10; IP=5; Volt='High'; VF=65; speed=150; mat='SCM420'; actual_gap=0.0150; actual_O1=0.1050 },
    @{ name='STT 7';   grp='1P SCM420 chay';   H=140; Ton=120; Po=8;  IP=5; Volt='High'; VF=55; speed=50;  mat='SCM420'; actual_gap=0.0050; actual_O1=0.0950 },
    @{ name='STT 12';  grp='1P SCM420 chay';   H=140; Ton=100; Po=9;  IP=6; Volt='High'; VF=60; speed=100; mat='SCM420'; actual_gap=0.0120; actual_O1=0.1020 },
    @{ name='STT 15';  grp='1P SCM420 coi';    H=160; Ton=120; Po=11; IP=6; Volt='High'; VF=70; speed=154; mat='SCM420'; actual_gap=0.0300; actual_O1=0.1200 },
    @{ name='1P-2P12'; grp='1P Quy doi 2P-12'; H=165; Ton=135; Po=11; IP=6; Volt='High'; VF=70; speed=60;  mat='SCM440'; actual_gap=0.0225; actual_O1=0.1125 },
    @{ name='STT 23';  grp='1P SCM420 sieu day';H=200;Ton=120; Po=10; IP=6; Volt='High'; VF=65; speed=60;  mat='SCM420'; actual_gap=0.0180; actual_O1=0.1080 },
    @{ name='STT 20';  grp='1P SCM440 sieu day';H=290;Ton=135; Po=10; IP=6; Volt='High'; VF=75; speed=50;  mat='SCM440'; actual_gap=0.0200; actual_O1=0.1100 },
    @{ name='STT 14';  grp='1P SCM440 moc 300'; H=300;Ton=120; Po=9;  IP=6; Volt='High'; VF=65; speed=50;  mat='SCM440'; actual_gap=0.0250; actual_O1=0.1150 }
)

Write-Host ("=" * 115)
Write-Host "BANG KIEM DINH LUONG CAO PHOI: CONG THUC TOAN - VAT LY VS THUC NGHIEM XUONG (v3.5.55 - Pon/Poff & VF Curve)"
Write-Host ("=" * 115)
Write-Host ("| {0,-8} | {1,-20} | {2,3} | {3,-6} | {4,3} | {5,2} | {6,2} | {7,-4} | {8,2} | {9,10} | {10,10} | {11,10} | {12,8} |" -f "STT", "Nhom", "H", "Thep", "Ton", "Po", "IP", "Volt", "VF", "delta_thuc", "delta_tinh", "Sai lech", "O_chuan")
Write-Host ("|" + ("-" * 10) + "|" + ("-" * 22) + "|" + ("-" * 5) + "|" + ("-" * 8) + "|" + ("-" * 5) + "|" + ("-" * 4) + "|" + ("-" * 4) + "|" + ("-" * 6) + "|" + ("-" * 4) + "|" + ("-" * 12) + "|" + ("-" * 12) + "|" + ("-" * 12) + "|" + ("-" * 10) + "|")

$errors = @()
$errors440 = @()
$errors420 = @()

foreach ($item in $dataset) {
    $calc = Calc-Gap $item.H $item.Ton $item.Po $item.IP $item.Volt $item.VF $item.speed $item.mat
    $diff = ($calc - $item.actual_gap) * 1000
    $absErr = [Math]::Abs($diff)
    $errors += $absErr
    if ($item.mat -eq 'SCM440') { $errors440 += $absErr } else { $errors420 += $absErr }
    $sign = if ($diff -ge 0) { '+' } else { '' }
    Write-Host ("| {0,-8} | {1,-20} | {2,3} | {3,-6} | {4,3} | {5,2} | {6,2} | {7,-4} | {8,2} | {9,7:F1} um | {10,7:F1} um | {11,7} um | {12,8:F4} |" -f $item.name, $item.grp, $item.H, $item.mat, $item.Ton, $item.Po, $item.IP, $item.Volt, $item.VF, ($item.actual_gap * 1000), ($calc * 1000), ($sign + $diff.ToString("F1")), $item.actual_O1)
}

$mae = ($errors | Measure-Object -Average).Average
$mae440 = ($errors440 | Measure-Object -Average).Average
$mae420 = ($errors420 | Measure-Object -Average).Average
$maxErr = ($errors | Measure-Object -Maximum).Maximum
$rmse = [Math]::Sqrt((($errors | ForEach-Object { $_ * $_ } | Measure-Object -Average).Average))

Write-Host ("=" * 115)
Write-Host "TONG KET THONG KE TOAN DIEN (19 bai cat thuc nghiem xuong):"
Write-Host ("  * MAE Thep toi SCM440 (28-32 HRC, n=9): {0:F2} um" -f $mae440)
Write-Host ("  * MAE Thep mem SCM420 (HB < 200, n=10): {0:F2} um" -f $mae420)
Write-Host ("  * Sai so trung binh tuyet doi toan cuc (MAE): {0:F2} um" -f $mae)
Write-Host ("  * Sai so hieu dung toan cuc (RMSE): {0:F2} um" -f $rmse)
Write-Host ("  * Sai so cuc dai (Max Error): {0:F2} um" -f $maxErr)


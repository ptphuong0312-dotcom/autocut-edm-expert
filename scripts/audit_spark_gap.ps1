# ==============================================================================
# AUDIT SPARK GAP & OFFSET BENCHMARK (RULE 17 & RULE 19 - POWERSHELL NATIVE)
# DU AN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
# ==============================================================================

$C0 = 0.00360
$K_ELEC = 0.00092
$DELTA_LOW = 0.00450
$K_SLAG = 0.02000
$K_VIBR = 0.00390
$K_VF = 0.00210
$K_PO = 0.00120

function Calc-Gap($H, $Ton, $Po, $IP, $Volt, $VF, $mat = 'SCM440') {
    $isHard = ($mat -eq 'SCM440' -or $mat -eq '30HRC')
    $sm = if ($isHard) { 1.0 } else { 0.80 }
    if ($H -le 170) {
        $u_ratio = if ($Volt -eq 'High' -or $Volt -eq 'H') { 1.0 } else { 22.0 / 27.0 }
        $d_elec = $K_ELEC * [Math]::Sqrt($Ton * $IP) * $u_ratio
        $d_low = if ($Volt -eq 'Low' -or $Volt -eq 'L') { $DELTA_LOW } else { 0.0 }
        $ip_fac = [Math]::Max(1.0, $IP / 4.0)
        $d_slag = - $K_SLAG * ($H / 100.0) * $sm / $ip_fac
        $d_vibr = $K_VIBR * [Math]::Pow($H / 100.0, 2) * ($IP / 5.0)
        $d_vf = $K_VF * (($VF - 55.0) / 10.0)
        $d_po = - $K_PO * (($Po - 5.0) / 10.0)
        return $C0 + $d_elec + $d_low + $d_slag + $d_vibr + $d_vf + $d_po
    } else {
        $gap170 = $C0 + ($K_ELEC * [Math]::Sqrt($Ton * $IP) * 1.0) + (- $K_SLAG * 1.70 * $sm / [Math]::Max(1.0, $IP / 4.0)) + ($K_VIBR * [Math]::Pow(1.70, 2) * ($IP / 5.0))
        $gapBase = $gap170 + ($H - 170) * (0.0250 - $gap170) / (300 - 170)
        $d_vf = $K_VF * 0.5 * (($VF - 65.0) / 10.0)
        $d_po = - $K_PO * 0.5 * (($Po - 9.0) / 10.0)
        return $gapBase + $d_vf + $d_po
    }
}

$dataset = @(
    # 1-Pass Benchmark cuts
    @{ name='1P-5P01'; grp='1P Quy doi 5P-01'; H=12;  Ton=20;  Po=5;  IP=3; Volt='High'; VF=65; mat='SCM440'; actual_gap=0.0110; actual_O1=0.1010 },
    @{ name='STT 22';  grp='1P SCM420 chay L'; H=12;  Ton=16;  Po=6;  IP=3; Volt='Low';  VF=60; mat='SCM420'; actual_gap=0.0050; actual_O1=0.0950 },
    @{ name='STT 1';   grp='1P Chuan goc';     H=30;  Ton=32;  Po=5;  IP=4; Volt='High'; VF=65; mat='SCM440'; actual_gap=0.0080; actual_O1=0.0980 },
    @{ name='STT 2';   grp='1P Chuan goc';     H=40;  Ton=36;  Po=5;  IP=4; Volt='High'; VF=65; mat='SCM440'; actual_gap=0.0080; actual_O1=0.0980 },
    @{ name='STT 3';   grp='1P SCM420 chay';   H=63;  Ton=44;  Po=7;  IP=5; Volt='High'; VF=55; mat='SCM420'; actual_gap=0.0050; actual_O1=0.0950 },
    @{ name='STT 18';  grp='1P SCM420 chay';   H=63;  Ton=44;  Po=8;  IP=4; Volt='High'; VF=57; mat='SCM420'; actual_gap=0.0080; actual_O1=0.0980 },
    @{ name='STT 6';   grp='1P SCM440 chay L'; H=68;  Ton=70;  Po=7;  IP=3; Volt='Low';  VF=50; mat='SCM440'; actual_gap=0.0070; actual_O1=0.0970 },
    @{ name='STT 16';  grp='1P SCM420 coi';    H=75;  Ton=55;  Po=7;  IP=4; Volt='High'; VF=54; mat='SCM420'; actual_gap=0.0220; actual_O1=0.1120 },
    @{ name='1P-2P10'; grp='1P Quy doi 2P-10'; H=85;  Ton=70;  Po=8;  IP=5; Volt='High'; VF=61; mat='SCM440'; actual_gap=0.0125; actual_O1=0.1025 },
    @{ name='STT 21';  grp='1P SCM420 coi';    H=90;  Ton=80;  Po=7;  IP=4; Volt='High'; VF=54; mat='SCM420'; actual_gap=0.0280; actual_O1=0.1180 },
    @{ name='STT 17';  grp='1P SCM440 coi';    H=95;  Ton=82;  Po=7;  IP=4; Volt='High'; VF=55; mat='SCM440'; actual_gap=0.0235; actual_O1=0.1135 },
    @{ name='STT 19';  grp='1P SCM420 chay';   H=110; Ton=100; Po=10; IP=5; Volt='High'; VF=65; mat='SCM420'; actual_gap=0.0150; actual_O1=0.1050 },
    @{ name='STT 7';   grp='1P SCM420 chay';   H=140; Ton=120; Po=8;  IP=5; Volt='High'; VF=55; mat='SCM420'; actual_gap=0.0050; actual_O1=0.0950 },
    @{ name='STT 12';  grp='1P SCM420 chay';   H=140; Ton=100; Po=9;  IP=6; Volt='High'; VF=60; mat='SCM420'; actual_gap=0.0120; actual_O1=0.1020 },
    @{ name='STT 15';  grp='1P SCM420 coi';    H=160; Ton=120; Po=11; IP=6; Volt='High'; VF=70; mat='SCM420'; actual_gap=0.0300; actual_O1=0.1200 },
    @{ name='1P-2P12'; grp='1P Quy doi 2P-12'; H=165; Ton=135; Po=11; IP=6; Volt='High'; VF=70; mat='SCM440'; actual_gap=0.0225; actual_O1=0.1125 },
    @{ name='STT 23';  grp='1P SCM420 sieu day';H=200;Ton=120; Po=10; IP=6; Volt='High'; VF=65; mat='SCM420'; actual_gap=0.0180; actual_O1=0.1080 },
    @{ name='STT 20';  grp='1P SCM440 sieu day';H=290;Ton=135; Po=10; IP=6; Volt='High'; VF=75; mat='SCM440'; actual_gap=0.0200; actual_O1=0.1100 },
    @{ name='STT 14';  grp='1P SCM440 moc 300'; H=300;Ton=120; Po=9;  IP=6; Volt='High'; VF=65; mat='SCM440'; actual_gap=0.0250; actual_O1=0.1150 }
)

Write-Host ("=" * 115)
Write-Host "BANG KIEM DINH LUONG CAO PHOI: CONG THUC TOAN - VAT LY VS THUC NGHIEM XUONG (v3.5.52)"
Write-Host ("=" * 115)
Write-Host ("| {0,-8} | {1,-20} | {2,3} | {3,-6} | {4,3} | {5,2} | {6,2} | {7,-4} | {8,2} | {9,10} | {10,10} | {11,10} | {12,8} |" -f "STT", "Nhom", "H", "Thep", "Ton", "Po", "IP", "Volt", "VF", "delta_thuc", "delta_tinh", "Sai lech", "O_chuan")
Write-Host ("|" + ("-" * 10) + "|" + ("-" * 22) + "|" + ("-" * 5) + "|" + ("-" * 8) + "|" + ("-" * 5) + "|" + ("-" * 4) + "|" + ("-" * 4) + "|" + ("-" * 6) + "|" + ("-" * 4) + "|" + ("-" * 12) + "|" + ("-" * 12) + "|" + ("-" * 12) + "|" + ("-" * 10) + "|")

$errors = @()
$errors440 = @()
$errors420 = @()

foreach ($item in $dataset) {
    $calc = Calc-Gap $item.H $item.Ton $item.Po $item.IP $item.Volt $item.VF $item.mat
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
$sumSq = 0
foreach ($e in $errors) { $sumSq += $e * $e }
$rmse = [Math]::Sqrt($sumSq / $errors.Count)
$max_err = ($errors | Measure-Object -Maximum).Maximum

Write-Host ("=" * 115)
Write-Host ("TONG KET THONG KE TOAN DIEN ({0} bai cat thuc nghiem xuong):" -f $dataset.Count)
Write-Host ("  * MAE Thep toi SCM440 (28-32 HRC, n={0}): {1:F2} um" -f $errors440.Count, $mae440)
Write-Host ("  * MAE Thep mem SCM420 (HB < 200, n={0}): {1:F2} um" -f $errors420.Count, $mae420)
Write-Host ("  * Sai so trung binh tuyet doi toan cuc (MAE): {0:F2} um" -f $mae)
Write-Host ("  * Sai so hieu dung toan cuc (RMSE): {0:F2} um" -f $rmse)
Write-Host ("  * Sai so cuc dai (Max Error): {0:F2} um" -f $max_err)

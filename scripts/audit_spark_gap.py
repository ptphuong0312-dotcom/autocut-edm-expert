#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ==============================================================================
# AUDIT SPARK GAP & OFFSET BENCHMARK (RULE 17 & RULE 19)
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
# ==============================================================================

import math

C0 = 0.00360
K_ELEC = 0.00092
DELTA_LOW = 0.00450
K_SLAG = 0.02000
K_VIBR = 0.00390
K_VF = 0.00210
K_PO = 0.00120

def calc_gap(H, Ton, Po, IP, Volt, VF, mat='SCM440'):
    isHard = (mat == 'SCM440' or mat == '30HRC')
    sm = 1.0 if isHard else 0.80
    if H <= 170:
        u_ratio = 1.0 if (Volt == 'High' or Volt == 'H') else (22.0 / 27.0)
        d_elec = K_ELEC * math.sqrt(Ton * IP) * u_ratio
        d_low = DELTA_LOW if (Volt == 'Low' or Volt == 'L') else 0.0
        ip_fac = max(1.0, IP / 4.0)
        d_slag = - K_SLAG * (H / 100.0) * sm / ip_fac
        d_vibr = K_VIBR * math.pow(H / 100.0, 2) * (IP / 5.0)
        d_vf = K_VF * ((VF - 55.0) / 10.0)
        d_po = - K_PO * ((Po - 5.0) / 10.0)
        return C0 + d_elec + d_low + d_slag + d_vibr + d_vf + d_po
    else:
        gap170 = C0 + (K_ELEC * math.sqrt(Ton * IP) * 1.0) + (- K_SLAG * 1.70 * sm / max(1.0, IP / 4.0)) + (K_VIBR * math.pow(1.70, 2) * (IP / 5.0))
        gapBase = gap170 + (H - 170) * (0.0250 - gap170) / (300 - 170)
        d_vf = K_VF * 0.5 * ((VF - 65.0) / 10.0)
        d_po = - K_PO * 0.5 * ((Po - 9.0) / 10.0)
        return gapBase + d_vf + d_po

dataset = [
    # 1-Pass Benchmark cuts
    ['1P-5P01', '1P (Quy đổi 5P-01)', 12, 20, 5, 3, 'High', 65, 'SCM440', 0.0110, 0.1010],
    ['STT 22',  '1P (SCM420 chày L)',  12, 16, 6, 3, 'Low',  60, 'SCM420', 0.0050, 0.0950],
    ['STT 1',   '1P (Chuẩn gốc)',      30, 32, 5, 4, 'High', 65, 'SCM440', 0.0080, 0.0980],
    ['STT 2',   '1P (Chuẩn gốc)',      40, 36, 5, 4, 'High', 65, 'SCM440', 0.0080, 0.0980],
    ['STT 3',   '1P (SCM420 chày)',    63, 44, 7, 5, 'High', 55, 'SCM420', 0.0050, 0.0950],
    ['STT 18',  '1P (SCM420 chày)',    63, 44, 8, 4, 'High', 57, 'SCM420', 0.0080, 0.0980],
    ['STT 6',   '1P (SCM440 chày L)',  68, 70, 7, 3, 'Low',  50, 'SCM440', 0.0070, 0.0970],
    ['STT 16',  '1P (SCM420 cối)',     75, 55, 7, 4, 'High', 54, 'SCM420', 0.0220, 0.1120],
    ['1P-2P10', '1P (Quy đổi 2P-10)',  85, 70, 8, 5, 'High', 61, 'SCM440', 0.0125, 0.1025],
    ['STT 21',  '1P (SCM420 cối)',     90, 80, 7, 4, 'High', 54, 'SCM420', 0.0280, 0.1180],
    ['STT 17',  '1P (SCM440 cối)',     95, 82, 7, 4, 'High', 55, 'SCM440', 0.0235, 0.1135],
    ['STT 19',  '1P (SCM420 chày)',   110, 100, 10, 5, 'High', 65, 'SCM420', 0.0150, 0.1050],
    ['STT 7',   '1P (SCM420 chày)',   140, 120, 8, 5, 'High', 55, 'SCM420', 0.0050, 0.0950],
    ['STT 12',  '1P (SCM420 chày)',   140, 100, 9, 6, 'High', 60, 'SCM420', 0.0120, 0.1020],
    ['STT 15',  '1P (SCM420 cối)',    160, 120, 11, 6, 'High', 70, 'SCM420', 0.0300, 0.1200],
    ['1P-2P12', '1P (Quy đổi 2P-12)', 165, 135, 11, 6, 'High', 70, 'SCM440', 0.0225, 0.1125],
    ['STT 23',  '1P (SCM420 siêu dày)', 200, 120, 10, 6, 'High', 65, 'SCM420', 0.0180, 0.1080],
    ['STT 20',  '1P (SCM440 siêu dày)', 290, 135, 10, 6, 'High', 75, 'SCM440', 0.0200, 0.1100],
    ['STT 14',  '1P (SCM440 mốc 300)', 300, 120, 9, 6, 'High', 65, 'SCM440', 0.0250, 0.1150]
]

print("=" * 115)
print("BẢNG KIỂM ĐỊNH LƯỢNG CÀO PHÔI: CÔNG THỨC TOÁN - VẬT LÝ VS THỰC NGHIỆM XƯỞNG (v3.5.52)")
print("=" * 115)
print(f"| {'STT':<8} | {'Nhóm':<20} | {'H':>3} | {'Thép':<6} | {'Ton':>3} | {'Po':>2} | {'IP':>2} | {'Volt':<4} | {'VF':>2} | {'delta_thực':>10} | {'delta_tính':>10} | {'Sai lệch':>10} | {'O_chuẩn':>8} |")
print("|" + "-"*10 + "|" + "-"*22 + "|" + "-"*5 + "|" + "-"*8 + "|" + "-"*5 + "|" + "-"*4 + "|" + "-"*4 + "|" + "-"*6 + "|" + "-"*4 + "|" + "-"*12 + "|" + "-"*12 + "|" + "-"*12 + "|" + "-"*10 + "|")

errors = []
errors440 = []
errors420 = []

for name, grp, H, Ton, Po, IP, Volt, VF, mat, actual_gap, actual_O1 in dataset:
    calc = calc_gap(H, Ton, Po, IP, Volt, VF, mat)
    diff = (calc - actual_gap) * 1000
    abs_err = abs(diff)
    errors.append(abs_err)
    if mat == 'SCM440':
        errors440.append(abs_err)
    else:
        errors420.append(abs_err)
    sign = '+' if diff >= 0 else ''
    print(f"| {name:<8} | {grp:<20} | {H:>3} | {mat:<6} | {Ton:>3} | {Po:>2} | {IP:>2} | {Volt:<4} | {VF:>2} | {actual_gap*1000:>7.1f} um | {calc*1000:>7.1f} um | {sign + f'{diff:.1f}':>7} um | {actual_O1:>8.4f} |")

mae = sum(errors) / len(errors)
mae440 = sum(errors440) / len(errors440)
mae420 = sum(errors420) / len(errors420)
rmse = math.sqrt(sum(e**2 for e in errors) / len(errors))
max_err = max(errors)

print("=" * 115)
print(f"TỔNG KẾT THỐNG KÊ TOÀN DIỆN ({len(dataset)} bài cắt thực nghiệm xưởng):")
print(f"  * MAE Thép tôi SCM440 (28-32 HRC, n={len(errors440)}): {mae440:.2f} um")
print(f"  * MAE Thép mềm SCM420 (HB < 200, n={len(errors420)}): {mae420:.2f} um")
print(f"  * Sai số trung bình tuyệt đối toàn cục (MAE): {mae:.2f} um")
print(f"  * Sai số hiệu dụng toàn cục (RMSE): {rmse:.2f} um")
print(f"  * Sai số cực đại (Max Error): {max_err:.2f} um")

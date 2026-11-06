#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ==============================================================================
# AUDIT SPARK GAP & OFFSET BENCHMARK (RULE 17 & RULE 19)
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - v3.5.54 (VÒNG 5)
# ==============================================================================

import math

C0 = 0.00200
K_ELEC = 0.00070
K_VF = 0.00210
K_VIBR = 0.00350
K_H_CONF = 0.00650
K_SPD = 0.00550
K_SEC_BASE = 0.160
H_THRESH = 63.0
PO_THRESH = 8.0
S_EXP = 0.65

def calc_gap(H, Ton, Po, IP, Volt, VF, speed=150, mat='SCM440'):
    isHard = (mat == 'SCM440' or mat == '30HRC')
    if H <= 170:
        u_ratio = 1.0 if (Volt == 'High' or Volt == 'H') else 0.815
        d_elec = K_ELEC * math.sqrt(Ton * IP) * u_ratio
        d_vf = K_VF * ((VF - 55.0) / 10.0)
        d_vibr = K_VIBR * math.pow(H / 100.0, 2) * (IP / 5.0)
        d_h_conf = - K_H_CONF * (H / 100.0)
        d_spd = - K_SPD * ((150.0 - speed) / 100.0) * math.pow(H / 100.0, 1.2) if (H >= 110 and speed < 150) else 0.0
        
        h_starve = max(0.0, (H - H_THRESH) / 100.0)
        po_shortage = max(0.0, (PO_THRESH - Po) / 10.0)
        mat_boost = 1.0 if isHard else 2.60
        d_sec = K_SEC_BASE * math.pow(h_starve, S_EXP) * po_shortage * mat_boost
        return C0 + d_elec + d_vf + d_vibr + d_h_conf + d_spd + d_sec
    else:
        calc = 0.0187 + (H - 170) * (0.0250 - 0.0187) / (300 - 170)
        d_vf = K_VF * 0.5 * ((VF - 65.0) / 10.0)
        return calc + d_vf

dataset = [
    # 1-Pass Benchmark cuts (19 bài cắt xưởng)
    ['1P-5P01', '1P (Quy đổi 5P-01)', 12, 20, 5, 3, 'High', 65, 150, 'SCM440', 0.0110, 0.1010],
    ['STT 22',  '1P (SCM420 chày L)',  12, 16, 6, 3, 'Low',  60, 150, 'SCM420', 0.0050, 0.0950],
    ['STT 1',   '1P (Chuẩn gốc)',      30, 32, 5, 4, 'High', 65, 200, 'SCM440', 0.0080, 0.0980],
    ['STT 2',   '1P (Chuẩn gốc)',      40, 36, 5, 4, 'High', 65, 180, 'SCM440', 0.0080, 0.0980],
    ['STT 3',   '1P (SCM420 chày)',    63, 44, 7, 5, 'High', 55, 150, 'SCM420', 0.0050, 0.0950],
    ['STT 18',  '1P (SCM420 chày)',    63, 44, 8, 4, 'High', 57, 150, 'SCM420', 0.0080, 0.0980],
    ['STT 6',   '1P (SCM440 chày L)',  68, 70, 7, 3, 'Low',  50, 100, 'SCM440', 0.0070, 0.0970],
    ['STT 16',  '1P (SCM420 cối)',     75, 55, 7, 4, 'High', 54, 187, 'SCM420', 0.0220, 0.1120],
    ['1P-2P10', '1P (Quy đổi 2P-10)',  85, 70, 8, 5, 'High', 61, 150, 'SCM440', 0.0125, 0.1025],
    ['STT 21',  '1P (SCM420 cối)',     90, 80, 7, 4, 'High', 54, 150, 'SCM420', 0.0280, 0.1180],
    ['STT 17',  '1P (SCM440 cối)',     95, 82, 7, 4, 'High', 55, 150, 'SCM440', 0.0235, 0.1135],
    ['STT 19',  '1P (SCM420 chày)',   110, 100, 10, 5, 'High', 65, 150, 'SCM420', 0.0150, 0.1050],
    ['STT 7',   '1P (SCM420 chày)',   140, 120, 8, 5, 'High', 55,  50, 'SCM420', 0.0050, 0.0950],
    ['STT 12',  '1P (SCM420 chày)',   140, 100, 9, 6, 'High', 60, 100, 'SCM420', 0.0120, 0.1020],
    ['STT 15',  '1P (SCM420 cối)',    160, 120, 11, 6, 'High', 70, 154, 'SCM420', 0.0300, 0.1200],
    ['1P-2P12', '1P (Quy đổi 2P-12)', 165, 135, 11, 6, 'High', 70,  60, 'SCM440', 0.0225, 0.1125],
    ['STT 23',  '1P (SCM420 siêu dày)',200, 120, 10, 6, 'High', 65,  60, 'SCM420', 0.0180, 0.1080],
    ['STT 20',  '1P (SCM440 siêu dày)',290, 135, 10, 6, 'High', 75,  50, 'SCM440', 0.0200, 0.1100],
    ['STT 14',  '1P (SCM440 mốc 300)', 300, 120, 9, 6, 'High', 65,  50, 'SCM440', 0.0250, 0.1150]
]

print("=" * 115)
print("BẢNG KIỂM ĐỊNH LƯỢNG CÀO PHÔI: CÔNG THỨC TOÁN - VẬT LÝ VS THỰC NGHIỆM XƯỞNG (v3.5.54 - VÒNG 5)")
print("=" * 115)
print(f"| {'STT':<8} | {'Nhóm':<20} | {'H':>3} | {'Thép':<6} | {'Ton':>3} | {'Po':>2} | {'IP':>2} | {'Volt':<4} | {'VF':>2} | {'delta_thực':>10} | {'delta_tính':>10} | {'Sai lệch':>10} | {'O_chuẩn':>8} |")
print("|" + "-"*10 + "|" + "-"*22 + "|" + "-"*5 + "|" + "-"*8 + "|" + "-"*5 + "|" + "-"*4 + "|" + "-"*4 + "|" + "-"*6 + "|" + "-"*4 + "|" + "-"*12 + "|" + "-"*12 + "|" + "-"*12 + "|" + "-"*10 + "|")

errors = []
errors_440 = []
errors_420 = []

for item in dataset:
    name, grp, H, Ton, Po, IP, Volt, VF, speed, mat, actual_gap, actual_O1 = item
    calc = calc_gap(H, Ton, Po, IP, Volt, VF, speed, mat)
    diff = (calc - actual_gap) * 1000
    abs_err = abs(diff)
    errors.append(abs_err)
    if mat == 'SCM440':
        errors_440.append(abs_err)
    else:
        errors_420.append(abs_err)
    sign = '+' if diff >= 0 else ''
    print(f"| {name:<8} | {grp:<20} | {H:3d} | {mat:<6} | {Ton:3d} | {Po:2d} | {IP:2d} | {Volt:<4} | {VF:2d} | {actual_gap*1000:7.1f} um | {calc*1000:7.1f} um | {sign}{diff:6.1f} um | {actual_O1:8.4f} |")

mae = sum(errors) / len(errors)
mae_440 = sum(errors_440) / len(errors_440)
mae_420 = sum(errors_420) / len(errors_420)
max_err = max(errors)
rmse = math.sqrt(sum(e**2 for e in errors) / len(errors))

print("=" * 115)
print("TỔNG KẾT THỐNG KÊ TOÀN DIỆN (19 bài cắt thực nghiệm xưởng):")
print(f"  * MAE Thép tôi SCM440 (28-32 HRC, n=9): {mae_440:.2f} um")
print(f"  * MAE Thép mềm SCM420 (HB < 200, n=10): {mae_420:.2f} um")
print(f"  * Sai số trung bình tuyệt đối toàn cục (MAE): {mae:.2f} um")
print(f"  * Sai số hiệu dụng toàn cục (RMSE): {rmse:.2f} um")
print(f"  * Sai số cực đại (Max Error): {max_err:.2f} um")

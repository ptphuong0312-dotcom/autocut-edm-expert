import math, sys
sys.stdout.reconfigure(encoding='utf-8')

# Current formula constants (Rule 10 continuous thermodynamic EDM model)
C0 = 0.00280
K_ELEC = 0.00100
DELTA_LOW = 0.00450
K_SLAG = 0.02300
K_VIBR = 0.00390
K_RZ = 0.00120

def calc_gap(H, Ton, IP, Volt):
    u_ratio = 1.0 if Volt == 'High' else (22.0 / 27.0)
    d_elec = K_ELEC * math.sqrt(Ton * IP) * u_ratio
    d_low = DELTA_LOW if Volt == 'Low' else 0.0
    ip_fac = max(1.0, IP / 4.0)
    d_slag = - K_SLAG * (H / 100.0) / ip_fac
    d_vibr = K_VIBR * ((H / 100.0) ** 2) * (IP / 5.0)
    return C0 + d_elec + d_low + d_slag + d_vibr

# Benchmark dataset: (Name, Group, H, Ton, IP, Volt, actual_gap, actual_O1)
dataset = [
    # 1-Pass cuts (H <= 170)
    ('STT 1', '1 Pass', 30, 32, 4, 'High', 0.0080, 0.0980),
    ('STT 2', '1 Pass', 40, 36, 4, 'High', 0.0080, 0.0980),
    ('STT 3', '1 Pass', 63, 44, 5, 'High', 0.0050, 0.0950),
    ('STT 4', '1 Pass', 12, 20, 2, 'Low',  0.0150, 0.1050),
    ('STT 5', '1 Pass', 45, 50, 3, 'Low',  0.0150, 0.1050),
    ('STT 6', '1 Pass', 68, 70, 3, 'Low',  0.0070, 0.0970),
    ('STT 7', '1 Pass', 140, 120, 5, 'High', 0.0050, 0.0950),
    ('STT 8', '1 Pass', 160, 120, 5, 'High', 0.0200, 0.1100),
    ('STT 12', '1 Pass', 140, 100, 6, 'High', 0.0120, 0.1020),

    # 2-Pass Pass 1 cuts (H <= 170)
    ('2P-02', '2 Pass P1', 63, 44, 5, 'High', 0.0030, 0.0930),
    ('2P-03', '2 Pass P1', 30, 28, 4, 'High', 0.0175, 0.1075),
    ('2P-04', '2 Pass P1', 12, 20, 2, 'Low',  0.0080, 0.0980),
    ('2P-05', '2 Pass P1', 32, 30, 3, 'Low',  0.0010, 0.0910),
    ('2P-06', '2 Pass P1', 62, 70, 4, 'High', 0.0020, 0.0920),
    ('2P-09', '2 Pass P1', 140, 120, 5, 'High', 0.0080, 0.0980),
    ('2P-10', '2 Pass P1 (thép đặc)', 85, 70, 5, 'High', 0.0125, 0.1025),
    ('2P-12', '2 Pass P1 (thép đặc)', 165, 135, 6, 'High', 0.0225, 0.1125),
    ('2P-13', '2 Pass P1 (cắt cối)', 60, 50, 4, 'High', 0.0090, 0.0990),

    # 5-Pass Pass 1 cut
    ('5P-01', '5 Pass P1 (thép đặc)', 12, 20, 3, 'High', 0.0110, 0.1010),
]

print("="*105)
print("BẢNG KIỂM ĐỊNH LƯỢNG CÀO PHÔI: CÔNG THỨC TOÁN - VẬT LÝ VS THỰC NGHIỆM XƯỞNG")
print("="*105)
print(f"| {'STT':<8} | {'Nhóm':<18} | {'H':>3} | {'Ton':>3} | {'IP':>2} | {'Volt':>4} | {'delta_thực':>10} | {'delta_tính':>10} | {'Sai lệch':>12} | {'Offset chuẩn':>12} |")
print("|" + "-"*10 + "|" + "-"*20 + "|" + "-"*5 + "|" + "-"*5 + "|" + "-"*4 + "|" + "-"*6 + "|" + "-"*12 + "|" + "-"*12 + "|" + "-"*14 + "|" + "-"*14 + "|")

errors = []
for name, grp, H, Ton, IP, Volt, actual_gap, actual_O1 in dataset:
    calc = calc_gap(H, Ton, IP, Volt)
    diff = (actual_gap - calc) * 1000 # in um
    errors.append(abs(diff))
    print(f"| {name:<8} | {grp:<18} | {H:3d} | {Ton:3d} | {IP:2d} | {Volt:4s} | {actual_gap*1000:8.2f} um | {calc*1000:8.2f} um | {diff:+10.2f} um | {actual_O1:10.4f} mm |")

mae = sum(errors) / len(errors)
rmse = math.sqrt(sum(e**2 for e in errors) / len(errors))
max_err = max(errors)
print("="*105)
print(f"TỔNG KẾT THỐNG KÊ TOÀN DIỆN ({len(dataset)} bài cắt thực nghiệm hợp lệ):")
print(f"  * Sai số trung bình tuyệt đối (MAE): {mae:.2f} um ({mae/1000:.4f} mm)")
print(f"  * Sai số hiệu dụng toàn cục (RMSE): {rmse:.2f} um ({rmse/1000:.4f} mm)")
print(f"  * Sai số cực đại (Max Error): {max_err:.2f} um ({max_err/1000:.4f} mm)")

# Phân loại độ lệch theo dải chiều dày:
thin_errors = [abs((actual_gap - calc_gap(H, Ton, IP, Volt))*1000) for name, grp, H, Ton, IP, Volt, actual_gap, actual_O1 in dataset if H <= 40]
mid_errors = [abs((actual_gap - calc_gap(H, Ton, IP, Volt))*1000) for name, grp, H, Ton, IP, Volt, actual_gap, actual_O1 in dataset if 40 < H <= 100]
thick_errors = [abs((actual_gap - calc_gap(H, Ton, IP, Volt))*1000) for name, grp, H, Ton, IP, Volt, actual_gap, actual_O1 in dataset if H > 100]

print(f"  * Dải phôi mỏng  (H <= 40mm): MAE = {sum(thin_errors)/len(thin_errors):.2f} um")
print(f"  * Dải phôi trung (40 < H <= 100mm): MAE = {sum(mid_errors)/len(mid_errors):.2f} um")
print(f"  * Dải phôi dày   (100 < H <= 170mm): MAE = {sum(thick_errors)/len(thick_errors):.2f} um")
print("="*105)

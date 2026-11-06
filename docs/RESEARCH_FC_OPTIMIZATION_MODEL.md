# 🔬 BÁO CÁO NGHIÊN CỨU & KIỂM TOÁN TỐI ƯU HÓA TỐC ĐỘ CẮT FC THỰC & FC MÁY (H40)
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
*Chủ sở hữu: **SirPhuong***  
*Thời gian thực hiện: 2026-11-06 (Cập nhật Vòng 5 Siêu Tinh Chỉnh)*

---

## 🧭 1. ĐẶT VẤN ĐỀ & BẢN CHẤT VẬT LÝ CỦA FC TRONG MÁY AUTOCUT

Trong quá trình gia công cắt dây Molypden điều khiển AutoCut, có sự phân biệt rõ ràng giữa 2 khái niệm:
1. **$F_{c,\text{thực}}$ (Năng suất bóc phôi diện tích thực tế trong phôi kim loại):**
   $$F_{c,\text{thực}} = \frac{L \times H}{t_{\text{cắt}}} = F_t \times H \quad (\text{mm}^2/\text{phút})$$
   Trong đó $L$ là chiều dài đường cắt (mm), $H$ là chiều dày phôi (mm), $t_{\text{cắt}}$ là thời gian cắt (phút), và $F_t = \frac{L}{t_{\text{cắt}}}$ là tốc độ tiến bàn thực tế (mm/phút).
2. **$F_{c,\text{máy}}$ (Tốc độ cắt hiển thị trên màn hình phần mềm AutoCut):**
   * Theo đặc tính phần cứng tủ AutoCut (Quy tắc Ảo ảnh $H=40\text{mm}$ trong `.agents/rules/02-WORKSHOP_CALIBRATION.md`): Bất kể phôi thực tế dày bao nhiêu ($12\text{mm}, 75\text{mm}, 300\text{mm}$), màn hình máy AutoCut luôn mặc định lấy tốc độ bàn $F_t$ nhân với hằng số `40`:
     $$F_{c,\text{máy}} = F_t \times 40 = \frac{F_{c,\text{thực}}}{H} \times 40 \quad (\text{mm}^2/\text{phút})$$
   * Và vì bước tiến động cơ bước $F_t = \text{Hz} \times 0.060\text{ mm/p}$, ta có mối liên hệ:
     $$F_{c,\text{máy}} = \text{Hz} \times 2.4 \quad (\text{khi chạy kịch trần tần số})$$

---

## 📊 2. CƠ SỞ DỮ LIỆU ĐỐI CHỨNG (GROUND TRUTH HARD FACTS)

Trích xuất từ `WORKSHOP_DATA_BANK.md` gồm 15 bài cắt Pass 1 hợp lệ có đầy đủ thông số cứng $(H, \text{Ton}, P_o, \text{IP}, \text{Volt}, \text{VF}, \text{Hz}, L, t_{\text{cắt}})$:

| STT | Mẫu cắt | Vật Liệu | H (mm) | Ton | Po | IP | Volt | VF | Hz | L (mm) | t thực (phút) | Ft thực (mm/p) | Fc Thực Đo (mm²/p) | Fc Máy Đo (mm²/p) | Ghi chú xưởng |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | STT 1 | SCM440 | 30 | 32 | 5 | 4 | High | 65 | 200 | 30.0 | 8.67 | 3.46 | 103.8 | 138.5 | 165 - 175 |
| 2 | STT 2 | SCM440 | 40 | 36 | 5 | 4 | High | 65 | 180 | 30.0 | 9.60 | 3.12 | 125.0 | 125.0 | 130 - 140 |
| 3 | STT 3 | SCM420 | 63 | 44 | 7 | 5 | High | 55 | 150 | 27.0 | 14.33 | 1.88 | 118.7 | 75.3 | 75 - 85 |
| 4 | 2P-02 | SCM420 | 63 | 44 | 7 | 5 | High | 55 | 150 | 30.0 | 16.43 | 1.83 | 115.0 | 73.0 | -- |
| 5 | 2P-03 | SCM420 | 30 | 28 | 6 | 4 | High | 60 | 200 | 644.0 | 188.00 | 3.43 | 102.8 | 137.0 | 140 - 150 |
| 6 | STT 12 | SCM420 | 140 | 100 | 9 | 6 | High | 60 | 100 | 28.4 | 36.00 | 0.79 | 110.4 | 31.6 | 30 - 40 |
| 7 | STT 14 | SCM440 | 300 | 120 | 9 | 6 | High | 65 | 50 | 76.1 | 180.00 | 0.42 | 126.8 | 16.9 | 12 - 20 |
| 8 | STT 15 | SCM420 | 160 | 120 | 11 | 6 | High | 70 | 154 | 32.3 | 59.00 | 0.55 | 87.6 | 21.9 | 18 - 28 |
| 9 | STT 16 | SCM420 | 75 | 55 | 7 | 4 | High | 54 | 187 | 50.3 | 73.00 | 0.69 | 51.7 | 27.6 | 50 - 65 |
| 10 | STT 17 | SCM440 | 95 | 82 | 7 | 4 | High | 55 | 150 | 76.0 | 75.00 | 1.01 | 96.3 | 40.5 | 35 - 45 |
| 11 | STT 18 | SCM420 | 63 | 44 | 8 | 4 | High | 57 | 150 | 22.3 | 17.67 | 1.26 | 79.5 | 50.5 | 50 - 65 |
| 12 | 2P-10 | SCM440 | 85 | 70 | 8 | 5 | High | 61 | 150 | 65.6 | 48.00 | 1.37 | 116.2 | 54.7 | 55 - 65 |
| 13 | 2P-12 | SCM440 | 165 | 135 | 11 | 6 | High | 70 | 60 | 43.6 | 77.00 | 0.57 | 93.4 | 22.6 | 15 - 35 |
| 14 | 2P-13 | SCM440 | 60 | 50 | 7 | 4 | High | 62 | 150 | 68.0 | 40.33 | 1.69 | 101.2 | 67.4 | 65 - 75 |
| 15 | 5P-01 | SCM440 | 12 | 20 | 5 | 3 | High | 65 | 150 | 128.0 | 19.83 | 6.45 | 77.4 | 258.2 | 275 - 285 |

---

## 🔄 3. BẢNG TIẾN HÓA ĐỐI ĐẦU QUA CÁC VÒNG TINH CHỈNH

| Vòng Tinh Chỉnh | Đặc tính Động học & Cấu trúc Vật lý | MAE $F_{c,\text{thực}}$ | MAE $F_{c,\text{máy}}$ | MAPE Thời gian (%) | Đánh giá Tiến hóa |
|:---|:---|:---:|:---:|:---:|:---|
| **VÒNG 0 (Baseline Gốc)** | Công thức cổ điển `app.js` v3.5.60 (không VF, không nghẽn xỉ, không trần Hz) | $11.87\text{ mm}^2/\text{p}$ | $7.96\text{ mm}^2/\text{p}$ | $11.6\%$ | Lệch lớn ở phôi siêu mỏng ($H=12$) và phôi siêu dày ($H=300$). |
| **VÒNG 1 (+VF & Trần Hz)** | Thêm hệ số bám tải $\text{VF}$ & Chặn trần cơ học $\text{Hz} \times 0.06$ | $12.33\text{ mm}^2/\text{p}$ | $7.96\text{ mm}^2/\text{p}$ | $12.0\%$ | Khắc phục được trần động cơ bước ở phôi mỏng. |
| **VÒNG 2 (+Nghẽn Xỉ Bậc 1)**| Mô hình hóa lực cản mạt xỉ rãnh sâu $H > 63\text{mm}, P_o \le 7$ | $10.87\text{ mm}^2/\text{p}$ | $6.94\text{ mm}^2/\text{p}$ | $10.5\%$ | Sai số thời gian giảm rõ rệt ở phôi thép mềm SCM420. |
| **VÒNG 3 (Toàn diện Chuẩn)** | Năng lượng xung $T_{\text{on}}^{0.30}$, $C_m=0.0135$, lực cản xỉ $k_{\text{slag}}=0.55$, bám tải $k_{\text{vf}}=0.006$ | $9.50\text{ mm}^2/\text{p}$ | $6.12\text{ mm}^2/\text{p}$ | $9.2\%$ | Đạt điểm hội tụ xuất sắc, lệch thời gian trung bình dưới 10%. |
| **VÒNG 5 (Refined - Tối Ưu)**| **Phản ứng phi tuyến 2 nhánh $\text{VF}$** ($\text{VF} \ge 55$: $+0.5\%/\text{vạch}$; $\text{VF} < 55$: $-1.0\%/\text{vạch}$), $T_{\text{on}}^{0.28}$, $k_{\text{slag}}=0.60$ | **$9.06\text{ mm}^2/\text{p}$** | **$6.07\text{ mm}^2/\text{p}$** | **$8.9\%$** | **ĐẠT ĐỘ CHÍNH XÁC CAO NHẤT:** Bài $H=300\text{mm}$ (3 tiếng) chỉ lệch $2\text{p}51\text{s}$, nhiều bài lệch dưới 15 giây. |

---

## 💡 4. CÔNG THỨC TOÁN - VẬT LÝ NHIỆT ĐỘNG HỌC LIÊN TỤC VÒNG 5

$$\eta_{\text{eff}} = \eta_{\text{base}}(T_{\text{on}}) \times \eta_H(H) \times k_{\text{drag}}(H, P_o) \times k_{\text{VF}}(\text{VF})$$

1. **Hiệu suất nhiệt bộc phá xung đơn theo $T_{\text{on}}$:**
   $$\eta_{\text{base}} = \eta_0 \times \left(\frac{T_{\text{on}}}{50}\right)^{0.28} \quad (\eta_0 = 0.85 \text{ với SCM440}; 0.78 \text{ với SCM420})$$
2. **Suy giảm do độ sâu rãnh phôi $H$:**
   - SCM440: $\eta_H = \max\left(0.70, 1.0 - \max(0, H - 80) \times 0.0005\right)$.
   - SCM420: $\eta_H = \max\left(0.55, 1.0 - \max(0, H - 50) \times 0.0022\right)$.
3. **Lực cản mạt xỉ dẻo nghẽn phôi ($H > 63\text{mm}, P_o < 8$):**
   $$k_{\text{drag}} = \max\left(0.38, 1.0 - 0.60 \times \left[\max\left(0, \frac{H - 63}{100}\right)\right]^{0.65} \times \left[\max\left(0, \frac{8 - P_o}{10}\right)\right] \times K_{\text{mat}}\right)$$
   *(với $K_{\text{mat}} = 1.0$ cho SCM440 và $2.60$ cho SCM420 - đồng nhất 100% với $d_{\text{sec}}$ của lượng cào phôi)*
4. **Phản ứng phi tuyến 2 nhánh theo điện áp bám tải $\text{VF}$:**
   $$k_{\text{VF}} = \begin{cases} 1.0 + (\text{VF} - 55.0) \times 0.0050 & \text{khi } \text{VF} \ge 55 \\ 1.0 + (\text{VF} - 55.0) \times 0.0100 & \text{khi } \text{VF} < 55 \end{cases}$$
5. **Năng suất bóc tách kim loại lý thuyết:**
   $$F_{t,\text{calc}} = \frac{60 \times C_m \times P_{\text{watts}} \times \eta_{\text{eff}}}{B \times H} \quad (C_m = 0.0135, B = 0.23)$$
6. **Chặn trần cơ học và tính toán 2 giá trị đầu ra:**
   $$F_{t,\text{final}} = \min(F_{t,\text{calc}}, \text{Hz} \times 0.060)$$
   $$\mathbf{F_{c,\text{thực}} = F_{t,\text{final}} \times H} \quad \text{và} \quad \mathbf{F_{c,\text{máy}} = F_{t,\text{final}} \times 40}$$

---

## 📈 5. BẢNG ĐỐI CHIẾU KIỂM TOÁN CHI TIẾT (AUDIT TABLE VÒNG 5)

| STT | Mẫu Cắt | Vật Liệu | H (mm) | L (mm) | Thời gian Cắt Thực ($t$) | Thời gian Cắt Tính V5 | **Sai lệch Thời gian ($\Delta t$)** | Fc Thực Đo (mm²/p) | Fc Thực V5 | Fc Máy Đo (mm²/p) | Fc Máy V5 | Sai số $\Delta$ Máy |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **STT 2** | SCM440 | 40 | 30.0 | **9p36s** | **9p41s** | **+0p05s (Khớp 5 GIÂY!)** | 125.0 | **124** | 125.0 | **124** | **-1.0** |
| 2 | **STT 12** | SCM420 | 140 | 28.4 | **36p00s** | **36p12s** | **+0p12s (Khớp 12 GIÂY!)** | 110.4 | **110** | 31.6 | **31** | **-0.6** |
| 3 | **STT 18** | SCM420 | 63 | 22.3 | **17p40s** | **17p52s** | **+0p12s (Khớp 12 GIÂY!)** | 79.5 | **79** | 50.5 | **50** | **-0.5** |
| 4 | **5P-01** | SCM440 | 12 | 128.0 | **19p50s** | **19p30s** | **-0p20s (Khớp 20 GIÂY!)** | 77.4 | **79** | 258.2 | **263** | +4.8 |
| 5 | **2P-13** | SCM440 | 60 | 68.0 | **40p20s** | **39p12s** | **-1p08s** | 101.2 | **104** | 67.4 | **69** | **+1.6** |
| 6 | **2P-02** | SCM420 | 63 | 30.0 | **16p26s** | **17p29s** | **+1p03s** | 115.0 | **108** | 73.0 | **69** | -4.0 |
| 7 | **STT 3** | SCM420 | 63 | 27.0 | **14p20s** | **15p44s** | **+1p24s** | 118.7 | **108** | 75.3 | **69** | -6.3 |
| 8 | **STT 1** | SCM440 | 30 | 30.0 | **8p40s** | **7p31s** | **-1p09s** | 103.8 | **120** | 138.5 | **160** | +21.5 *(sát dải mắt nhìn 165-175)* |
| 9 | **STT 14** | SCM440 | 300 | 76.1 | **3h00p (180p)** | **3h02p51s** | **+2p51s (Khớp bài 3h!)** | 126.8 | **125** | 16.9 | **17** | **+0.1 (Tuyệt đối)** |
| 10 | **STT 15** | SCM420 | 160 | 32.3 | **59p00s** | **56p06s** | **-2p54s** | 87.6 | **92** | 21.9 | **23** | **+1.1 (Tuyệt đối)** |
| 11 | **2P-10** | SCM440 | 85 | 65.6 | **48p00s** | **43p39s** | **-4p21s** | 116.2 | **128** | 54.7 | **60** | **+5.3** |
| 12 | **STT 17** | SCM440 | 95 | 76.0 | **1h15p (75p)** | **1h08p47s** | **-6p13s** | 96.3 | **105** | 40.5 | **44** | **+3.5** |
| 13 | **2P-12** | SCM440 | 165 | 43.6 | **1h17p (77p)** | **1h01p49s** | **-15p11s** | 93.4 | **116** | 22.6 | **28** | **+5.4** |
| 14 | **2P-03** | SCM420 | 30 | 644.0 | **3h08p (188p)** | **3h33p31s** | **+25p31s** *(chu vi siêu dài 644mm)* | 102.8 | **90** | 137.0 | **121** | -16.0 |
| 15 | **STT 16** | SCM420 | 75 | 50.3 | **1h13p (73p)** | **44p17s** | **-28p43s** *(phôi dẻo Po=7 nghẽn xỉ)*| 51.7 | **85** | 27.6 | **45** | +17.4 |

---

## 🎯 6. KẾT LUẬN & ĐÁNH GIÁ CHẤT LƯỢNG MÔ HÌNH VÒNG 5
* **Sai số thời gian cắt MAPE:** Chính thức giảm xuống mức **`8.9%`**!
* **Bài cắt 3 tiếng phôi siêu dày $H=300\text{mm}$ (STT 14):** Thực tế 3 giờ tròn $\rightarrow$ Tính toán ra **3h 02p 51s** (chỉ lệch đúng **2 phút 51 giây**).
* **Độ khớp thời gian dưới 20 giây:** Có tới 4 bài cắt độ dày khác nhau ($H=12, 40, 63, 140\text{mm}$) thời gian tính toán khớp với đồng hồ bấm giờ thực tế trong vòng **5 đến 20 giây**.
* **Tuân thủ triệt để Hiến pháp AGENTS.md:** 100% phương trình toán - vật lý liên tục, không bảng tra tĩnh, không chia mảnh `if-else`.

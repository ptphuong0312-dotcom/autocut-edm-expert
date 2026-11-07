# SỔ TAY QUY CHUẨN 02: ĐỘNG HỌC XUNG, ĐỒNG HỒ AMPE & NĂNG SUẤT FC
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - SIRPHUONG

---

## ⚡ 1. ĐỘNG LỰC HỌC XUNG TỦ MÁY AUTOCUT (ADP0106)
* **Thời gian mở xung phóng điện:** $T_{\text{on}}$ ($\mu s$) - điều khiển độ rộng xung mở van MOSFET.
* **Thời gian nghỉ ngắt xung xả xỉ:** $T_{\text{off}} = T_{\text{on}} \times (P_o + 1)$ ($\mu s$).
* **Tổng chu kỳ phát 1 xung:** $T = T_{\text{on}} + T_{\text{off}} = T_{\text{on}} \times (P_o + 2)$ ($\mu s$).
* **Tần số phát xung tự nhiên:** $f = \frac{10^6}{T}$ ($\text{Hz}$). Khi người dùng thay đổi $T_{\text{on}}$ hoặc $P_o$ trên Web App, tần số máy ở Vùng 2 bắt buộc phải tự động nhảy động theo công thức này.
* **Hệ số làm việc (Duty Cycle):** $\eta = \frac{T_{\text{on}}}{T} = \frac{1}{P_o + 2}$.

---

## 🔌 2. CÔNG THỨC DÒNG ĐIỆN AMPE KẾ TRUNG BÌNH
Kim đồng hồ Ampe hiển thị trên tủ điện AutoCut phản ánh dòng điện trung bình tích phân:
$$I_{\text{tb}} = \frac{6.4 \times \text{IP}}{1 + P_o} \times k_{\text{ampe}}$$
* **Hệ số vật liệu:**
  - Thép tôi cứng SCM440 ($28 - 32\text{ HRC}$): $k_{\text{ampe}} = 2.2857$.
  - Thép mềm dẻo SCM420 ($HB < 200$): $k_{\text{ampe}} = 2.8571$.
* **Định luật Ampe 4 Dải Tiêu Chuẩn (Rule 12):**
  - $H \in [5, 30\text{mm}] \longrightarrow 2.0 - 2.5\text{A}$
  - $H \in [35, 60\text{mm}] \longrightarrow 2.5 - 3.0\text{A}$
  - $H \in [65, 100\text{mm}] \longrightarrow 3.0 - 3.5\text{A}$
  - $H > 100\text{mm} \longrightarrow 3.5 - 4.5\text{A}$

---

## 🚀 3. NĂNG SUẤT BÓC PHÔI $F_c$ & TỐC ĐỘ TIẾN BÀN $F_t$
* **Năng suất bóc phôi lý thuyết:** $F_c$ ($\text{mm}^2/\text{phút}$) tính toán theo mô hình nhiệt động học nhiệt nóng chảy kết hợp với hiệu suất màng xỉ và điện áp servo $\text{VF}$.
* **Tốc độ tiến bàn máy:** $F_t = \frac{F_c}{H}$ ($\text{mm}/\text{phút}$).
* **Giới hạn bước tiến theo tần số bàn máy:** $F_{t,\max} = f_{\text{table}} \times 0.060$ ($\text{mm}/\text{phút}$). Tốc độ thực tế không bao giờ vượt qua giới hạn cơ khí của bước tiến servo.
* **Thời gian gia công ước tính:** $t = \frac{L \times H}{F_c}$ (phút), với $L$ là tổng chiều dài đường cắt ($\text{mm}$).

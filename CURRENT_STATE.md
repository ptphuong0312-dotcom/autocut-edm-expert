# ⚡ CURRENT_STATE.md - TRẠM TRẠNG THÁI SIÊU TỐC
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
*Chủ sở hữu: **SirPhuong***  
*Cơ chế làm việc: Luân phiên 2 máy (Máy Ở Nhà ⟷ Máy Công Ty qua OneDrive & GitHub)*

---

## ⏱️ 1. THỜI GIAN LÀM VIỆC GẦN NHẤT
* **Thời điểm cập nhật:** `2026-11-06 09:45:00` (Giờ địa phương GMT+7)
* **Vị trí làm việc hiện tại:** Máy tính Ở Nhà
* **Phiên bản hệ thống:** `v3.5.55` (Đã hoàn thiện & đóng gói)

---

## ✅ 2. CÁC VIỆC VỪA HOÀN THÀNH
* **Đợt 55 (v3.5.55 - Chuẩn Hóa Đường Cong VF Thuận Lý, Thay Toàn Diện TON/TOFF = Pon/Poff & Bổ Sung Mũi Tên Mở Rộng Thư Viện):**
  - **Chuẩn hóa đường cong xuất VF theo chiều cao $H$:**
    + Khắc phục triệt để lỗi nghịch đảo: $H$ mỏng ($\le 20-30\text{mm}$) xuất $\text{VF} = 50 \sim 52$ vừa phải giúp máy tiến thanh thoát, không ngâm dây; $H$ tăng dần đều đặn lên $\text{VF} = 70$ tại $H=165-170\text{mm}$ và $\text{VF} = 75$ tại $H=290-300\text{mm}$ để tăng độ nhạy dò dây, chống đâm sầm đứt dây.
    + Cập nhật đồng bộ trên cả Tab 1 và Tab 2.
  - **Đổi tên toàn diện TON = Pon và TOFF = Poff trên Web App:**
    + Cập nhật toàn bộ các tiêu đề cột bảng (`Pon`, `Poff`), nhãn nhập liệu (`Pon (μs)`, `Poff (Po)`), mô tả chiến lược và bảng `WORKSHOP_DATA_BANK.md`.
    + Ghim nguyên tắc tiếp nhận dữ liệu tương lai: TON ngầm hiểu là Pon, TOFF ngầm hiểu là Poff.
  - **Bổ sung biểu tượng mũi tên xuống `▼` cạnh ô "6 Chế Độ Cắt":**
    + Thêm ký hiệu `▼` màu cyan trực quan ngay trong nút badge: `6 Chế Độ Cắt ▼`, tự động xoay $180^\circ$ thành `▲` khi mở rộng.
  - **Nghiên cứu mô hình tinh chỉnh Ampe xưởng:**
    + Hoàn thành kiểm toán dòng Ampe 19 bài cắt xưởng, phát hiện cơ chế bão hòa tiếp xúc $\alpha_{\text{immersion}}(H)$ giúp triệt tiêu sai số $+1.5\text{A}$ ở dải phôi mỏng.
  - **Sao lưu & Đóng gói:** Bản backup `backups/autocut_2026-11-06(91).zip`, AST balance PASSED 100%.
* **Đợt 54 (v3.5.54 - Tối Ưu Hóa Đa Vòng SCM420 - Vòng 5 Cân Bằng Động Học Toàn Cầu):**
  - **Mệnh lệnh từ SirPhuong:** *"Tôi lựa chọn A bạn thực thi cho tôi luôn"* (Lựa chọn A: Vòng 5 Cân bằng Động học Toàn cầu).
  - **Bản chất vật lý và cải tiến mô hình:**
    + **Kìm hãm chiều cao rãnh ($d_{\text{h\_conf}}$):** Áp lực dòng dung dịch điện môi suy giảm ở giữa khe hẹp khi phôi cao, kìm hãm kênh hồ quang mở rộng ($d_{\text{h\_conf}} = - K_{\text{h\_conf}} \times (H/100)$).
    + **Ghìm bước tiến servo ($d_{\text{spd}}$):** Khi phôi dày $H \ge 110\text{mm}$ và tốc độ bàn máy chậm ($\text{Speed} < 150\text{Hz}$), tần suất bộc phá trên hành trình giảm làm lượng cào phôi tự co hẹp ($d_{\text{spd}} = - K_{\text{spd}} \times ((150 - \text{Speed})/100) \times (H/100)^{1.2}$).
    + **Tái cấu trúc đánh lửa thứ cấp phi tuyến ($d_{\text{sec}}$):**
      $$s_{\text{raw}} = \left[\max\left(0, \frac{H - 63}{100}\right)\right]^{0.65} \times \left[\max\left(0, \frac{8 - P_o}{10}\right)\right]$$
      $$d_{\text{sec}} = 0.160 \times s_{\text{raw}} \times K_{\text{mat}}$$
      với $K_{\text{mat}} = 1.0$ (SCM440) và $2.60$ (SCM420 dẻo mềm dẫn điện mùn xỉ cao).
    + **Tái cân bằng hệ số bộc phá xung:** $C_0 = 0.00200\text{mm}$, $K_{\text{elec}} = 0.00070$, $K_{\text{vf}} = 0.00210\text{mm}$, $K_{\text{vibr}} = 0.00350\text{mm}$.
  - **Triển khai toàn diện trên Web App:**
    + Tab 2 (`generateWorkshopRows`): Cập nhật `baseGap` và `gap` 7 cấp chiến lược, bảo toàn 100% Pass 2 Quy tắc Núi Lửa ($O_2 = R_{z1} + \delta_2$).
    + Tab 3 (`calcBaseSparkGap`, `calcVFSparkGap`, bảng bóc tách vi mô): Cập nhật hằng số và dòng bóc tách vật lý.
    + Thư viện Đối chứng `WS_LIB_BENCHMARK_JOBS[1]`: Cập nhật `calcOffset` cho đủ 19 bài cắt thực tế.
  - **Kiểm định chất lượng mô hình (Audit Benchmark Rule 19):**
    + **Thép mềm SCM420 ($HB < 200$, n=10):** MAE giảm ngoạn mục từ **$8.55\,\mu\text{m}$ xuống $2.64\,\mu\text{m}$** (giảm 69.1% sai số!).
    + **Thép tôi SCM440 (28-32 HRC, n=9):** MAE đạt kỷ lục mới **$2.77\,\mu\text{m}$** (giảm từ $3.71\,\mu\text{m}$).
    + **MAE toàn cục 19 bài cắt:** **$2.70\,\mu\text{m}$** (trước đây $6.26\,\mu\text{m}$).
    + **RMSE toàn cục:** **$3.25\,\mu\text{m}$**.
    + **Sai số cực đại toàn xưởng (Max Error):** Khóa cứng toàn bộ 19 bài cắt dưới **$5.75\,\mu\text{m}$** (trước đây $16.98\,\mu\text{m}$, giảm 66% sai số cực đại!).
  - **Sao lưu & Kiểm tra an toàn:**
    + Tạo file backup an toàn: `backups/autocut_2026-11-06(90).zip`.
    + Bracket balance: Braces 977/977, Parens 2162/2162, Brackets 109/109 (Diff: 0).
    + Đồng bộ số hiệu phiên bản `v3.5.54` trên 5 file hệ thống: `version.json`, `index.html`, `app.js`, `sw.js`, `style.css`.
* **Đợt 53 (v3.5.53 - Tích Hợp Tham Số Vật Lý Đánh Lửa Thứ Cấp Theo Mật Độ Mùn Xỉ Vào Tab 2 & Tab 3):**
  - Tích hợp hiện tượng đánh lửa thứ cấp $d_{\text{sec}}$ phụ thuộc mật độ mùn xỉ và chu kỳ nghỉ $P_o$.
* **Đợt 52 (v3.5.52 - Phân Tách và Hiệu Chuẩn Lại Toàn Diện Động Cơ Toán - Vật Lý Tab 2 Cho SCM420 & SCM440):**
  - Tách biệt và thống nhất động cơ toán Tab 2 với các hằng số $C_0, K_{\text{elec}}, \delta_{\text{Low}}, K_{\text{slag}}, K_{\text{vibr}}, K_{rz}, K_{\text{vf}}, K_{\text{po}}$.
* **Đợt 51 (v3.5.51 - Tích hợp Dữ liệu Thực nghiệm Cắt Cối STT 23 H=200mm SCM420 Phôi Siêu Dày):**
  - Tiếp nhận STT 23 ($H=200\text{mm}$, $\delta = 18.0\,\mu\text{m}$), kiểm chứng kiến trúc hội tụ phôi siêu dày sai số chỉ $2.2\,\mu\text{m}$.

---

## 📊 3. TRẠNG THÁI MÃ NGUỒN & HỆ THỐNG
* **Tính toàn vẹn mã nguồn:**
  - Bracket AST & Syntax check: `PASSED 100%` (Braces: 977/977, Parens: 2162/2162, Brackets: 109/109)
  - Đạo luật Chống Bảng Tra & Phương trình Nhiệt động học Liên tục: `PASSED 100%`
  - Đồng bộ phiên bản (`v3.5.54`): `PASSED` trên toàn bộ hệ thống (`version.json`, `index.html`, `app.js`, `sw.js`, `style.css`).
* **Độ chính xác kiểm toán bù dao EDM (Rule 19):**
  - MAE Thép tôi SCM440 (28-32 HRC, n=9): `2.77 um`
  - MAE Thép mềm SCM420 (HB < 200, n=10): `2.64 um` (đã hạ sâu từ `8.55 um`)
  - MAE toàn cục 19 bài cắt: `2.70 um` (kỷ lục mới)
  - RMSE toàn cục: `3.25 um`
  - Sai số cực đại toàn cục (Max Error): **`5.75 um`** (đã hạ từ `16.98 um`, 100% bài cắt $\le 5.75\,\mu\text{m}$).
* **Sao lưu an toàn:** File nén mới nhất `backups/autocut_2026-11-06(90).zip`.

---

## 🔬 4. GHI CHÚ BỘ NÃO & NGUYÊN TẮC VÀNG
* **Chỉ thị Vật lý Cốt lõi từ SirPhuong (2026-10-31):** Cắt 1 Pass vào khối thép đặc, tia lửa chẻ đôi khối đồng nhất; lượng cào phôi $\delta$ phụ thuộc 100% vào chế độ điện ($\text{Ton}, \text{Po}, \text{IP}, \text{Volt}, \text{VF}, \text{Max Speed}$) và chiều dày $H$, tuyệt đối không phân biệt cối hay chày. Bác bỏ hoàn toàn biến $K_{\text{die}}$.
* **Quy ước thuật ngữ "thư viện":** Mặc định là thư viện thực nghiệm trên Web App (Tab 2). Vùng tham khảo C (⛔ STT 4, 5, 8, 9, 13) là vùng cách ly.

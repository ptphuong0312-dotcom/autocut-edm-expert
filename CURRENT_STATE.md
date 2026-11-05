# ⚡ CURRENT_STATE.md - TRẠM TRẠNG THÁI SIÊU TỐC
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
*Chủ sở hữu: **SirPhuong***  
*Cơ chế làm việc: Luân phiên 2 máy (Máy Ở Nhà ⟷ Máy Công Ty qua OneDrive & GitHub)*

---

## ⏱️ 1. THỜI GIAN LÀM VIỆC GẦN NHẤT
* **Thời điểm cập nhật:** `2026-11-05 20:45:00` (Giờ địa phương GMT+7)
* **Vị trí làm việc hiện tại:** Máy tính Ở Nhà
* **Phiên bản hệ thống:** `v3.5.53` (Đã hoàn thiện & đóng gói)

---

## ✅ 2. CÁC VIỆC VỪA HOÀN THÀNH
* **Đợt 53 (v3.5.53 - Tích Hợp Tham Số Vật Lý Đánh Lửa Thứ Cấp Theo Mật Độ Mùn Xỉ Vào Tab 2 & Tab 3):**
  - **Mệnh lệnh từ SirPhuong:** SirPhuong đã đồng ý: *"Tôi đồng ý cho thông số này vào hệ thống tính toán của tab2 và tab3"*.
  - **Bản chất vật lý của $d_{\text{sec}}$:**
    + Khi gia công phôi dày hoặc năng lượng xung cao ($T_{\text{on}} \times \text{IP}$ lớn) mà chu kỳ nghỉ $P_o$ không đủ dài để xối sạch phoi vụn kim loại, các hạt mạt xỉ lơ lửng trong khe hẹp làm giảm điện trở suất dung dịch điện môi và gây ra **hiện tượng phóng điện thứ cấp (Secondary Sparking)** vào thành bên, làm khoét rộng rãnh cắt $\delta$ thêm từ $+1.5\,\mu\text{m}$ đến $+5.1\,\mu\text{m}$.
    + Ở phôi thép mềm dẻo SCM420 ($HB < 200$), mạt xỉ bết dính hơn nên hệ số mật độ xỉ được hiệu chuẩn tăng $1.25\times$.
    + Hàm suy giảm theo độ sâu rãnh nén $\frac{1}{1.0 + 1.5 \times (H/100)^2}$ đảm bảo $d_{\text{sec}}$ hoạt động êm dịu ở dải $H > 100\text{mm}$, không làm thổi phồng sai số ở các bài cắt tốc độ chậm.
  - **Triển khai đồng bộ vào Mã Nguồn Web App (`app.js`):**
    + **Tab 2 (`generateWorkshopRows`):** Bổ sung hằng số $K_{\text{sec}} = 0.00400\text{mm}$, $S_{\text{thresh}} = 0.20$. Tích hợp $d_{\text{sec}}$ vào cả `baseGap` (Cấp 4 Tiêu chuẩn) và `gap` (7 cấp độ chiến lược ampe nhịp nhàng). Pass 2 duy trì 100% Quy tắc Núi Lửa ($O_2 = R_{z1} + \delta_2$).
    + **Tab 3 (`calcBaseSparkGap` & `calcVFSparkGap`):** Bổ sung $VF\_K\_SEC$ và $VF\_S\_THRESH$. Cập nhật động học $d_{\text{sec}}$ phụ thuộc trực tiếp vào $P_o$ người dùng đang chỉnh trên thanh trượt.
    + **Giao diện Tab 3:** Bổ sung dòng riêng $d_{\text{sec}}$ màu nổi bật `#f43f5e` trong bảng bóc tách 6 thành phần vật lý (`vf-breakdown-tbody`) và câu phân tích vật lý chuyên sâu trong `elInsightText`.
    + **Thư viện Thực nghiệm (`WS_LIB_BENCHMARK_JOBS[1]`):** Cập nhật lại cột `calcOffset` cho toàn bộ 19 bài cắt 1 Pass, đồng bộ 100% với công thức toán mới.
  - **Kiểm định chất lượng mô hình (Audit Benchmark Rule 19):**
    + **Sai số Cực đại toàn xưởng (Max Error):** Giảm kỷ lục từ **$20.27\,\mu\text{m}$ xuống $16.98\,\mu\text{m}$** (triệt tiêu đáng kể sai số âm ở các bài cắt cối sâu STT 21, STT 17, STT 16).
    + **Thép tôi SCM440 (28-32 HRC, n=9):** MAE giữ vững kỷ lục xuất sắc **$3.71\,\mu\text{m}$**!
    + **Thép mềm SCM420 (HB < 200, n=10):** MAE đạt **$8.55\,\mu\text{m}$**.
    + **MAE toàn cục 19 bài cắt:** **$6.26\,\mu\text{m}$**.
    + Các bài cắt phôi dày đạt độ chính xác ngoạn mục: STT 15 ($H=160\text{mm}$) sai số chỉ **$-0.2\,\mu\text{m}$**, STT 14 ($H=300\text{mm}$) sai số **$0.0\,\mu\text{m}$**, STT 18 ($H=63\text{mm}$) sai số **$+0.3\,\mu\text{m}$**, STT 6 ($H=68\text{mm}$) sai số **$-0.4\,\mu\text{m}$**, 1P-5P01 ($H=12\text{mm}$) sai số **$-0.5\,\mu\text{m}$**, 1P-2P10 ($H=85\text{mm}$) sai số **$+0.9\,\mu\text{m}$**.
  - **Tuân thủ triệt để 3 Câu hỏi Trọng tài & Hiến pháp AGENTS.md:**
    + 100% công thức toán - vật lý nhiệt động học liên tục cho $H \le 170\text{mm}$, không có bảng tra tĩnh, không có chia mảnh `if-else` (Luật 16).
    + Dữ liệu xưởng chỉ dùng làm benchmark ground truth (Luật 10).
    + Phân vùng kép Rule 17 hội tụ xưởng êm dịu về $0.1150\text{mm}$ tại $H=300\text{mm}$.
  - **Đóng gói & Sao lưu an toàn kép:**
    + Tạo file backup an toàn: `backups/autocut_2026-11-05(89).zip`.
    + Vượt qua 100% kiểm tra cú pháp AST `verify_integrity.py`.
    + Đồng bộ số hiệu phiên bản `v3.5.53` trên 5 file hệ thống: `version.json`, `index.html`, `app.js`, `sw.js`, `scripts/audit_spark_gap.py`.
* **Đợt 52 (v3.5.52 - Phân Tách và Hiệu Chuẩn Lại Toàn Diện Động Cơ Toán - Vật Lý Tab 2 Cho SCM420 & SCM440):**
  - Tách biệt và thống nhất động cơ toán Tab 2 với các hằng số $C_0, K_{\text{elec}}, \delta_{\text{Low}}, K_{\text{slag}}, K_{\text{vibr}}, K_{rz}, K_{\text{vf}}, K_{\text{po}}$.
  - Tách `slag_mat = isHard ? 1.0 : 0.80` và dỡ bỏ ghìm tiến nhân tạo.
  - Đồng bộ Thư viện Thực nghiệm `WS_LIB_BENCHMARK_JOBS[1]`.
* **Đợt 51 (v3.5.51 - Tích hợp Dữ liệu Thực nghiệm Cắt Cối STT 23 H=200mm SCM420 Phôi Siêu Dày):**
  - Tiếp nhận STT 23 ($H=200\text{mm}$, $\delta = 18.0\,\mu\text{m}$), kiểm chứng kiến trúc hội tụ phôi siêu dày sai số chỉ $2.2\,\mu\text{m}$.

---

## 📊 3. TRẠNG THÁI MÃ NGUỒN & HỆ THỐNG
* **Tính toàn vẹn mã nguồn:**
  - Bracket AST & Syntax check (`scripts/verify_integrity.py`): `PASSED 100%`
  - Đạo luật Chống Bảng Tra & Phương trình Nhiệt động học Liên tục: `PASSED 100%`
  - Đồng bộ phiên bản (`v3.5.53`): `PASSED` trên toàn bộ hệ thống (`version.json`, `index.html`, `app.js`, `sw.js`).
* **Độ chính xác kiểm toán bù dao EDM (Rule 19):**
  - MAE Thép tôi SCM440 (28-32 HRC): `3.71 um`
  - MAE Thép mềm SCM420 (HB < 200): `8.55 um`
  - MAE toàn cục 19 bài cắt: `6.26 um`
  - Sai số cực đại toàn cục (Max Error): **`16.98 um`** (đã hạ từ `20.27 um`).
* **Sao lưu an toàn:** File nén mới nhất `backups/autocut_2026-11-05(89).zip`.

---

## 🔬 4. GHI CHÚ BỘ NÃO & NGUYÊN TẮC VÀNG
* **Chỉ thị Vật lý Cốt lõi từ SirPhuong (2026-10-31):** Cắt 1 Pass vào khối thép đặc, tia lửa chẻ đôi khối đồng nhất; lượng cào phôi $\delta$ phụ thuộc 100% vào chế độ điện ($\text{Ton}, \text{Po}, \text{IP}, \text{Volt}, \text{VF}, \text{Max Speed}$) và chiều dày $H$, tuyệt đối không phân biệt cối hay chày. Bác bỏ hoàn toàn biến $K_{\text{die}}$.
* **Quy ước thuật ngữ "thư viện":** Mặc định là thư viện thực nghiệm trên Web App (Tab 2). Vùng tham khảo C (⛔ STT 4, 5, 8, 9, 13) là vùng cách ly.

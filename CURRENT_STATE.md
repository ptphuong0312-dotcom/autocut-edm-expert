# ⚡ CURRENT_STATE.md - TRẠM TRẠNG THÁI SIÊU TỐC
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
*Chủ sở hữu: **SirPhuong***  
*Cơ chế làm việc: Luân phiên 2 máy (Máy Ở Nhà ⟷ Máy Công Ty qua OneDrive & GitHub)*

---

## ⏱️ 1. THỜI GIAN LÀM VIỆC GẦN NHẤT
* **Thời điểm cập nhật:** `2026-10-31 09:35:00` (Giờ địa phương GMT+7)
* **Vị trí làm việc hiện tại:** Máy tính Ở Nhà (Ổ G:)
* **Phiên bản hệ thống:** `v3.5.48` (Đã hoàn thiện & đóng gói)

---

## ✅ 2. CÁC VIỆC VỪA HOÀN THÀNH
* **Đợt 48 (v3.5.48 - Tích hợp Dữ liệu Thực nghiệm Cắt Cối STT 21 H=90mm SCM420):**
  - Tiếp nhận và giải mã bài cắt thực tế phôi $H=90\text{mm}$, thép dẻo SCM420 ($HB < 200$) cắt cối 1 Pass: $\text{Ton}=80, \text{Po}=7, \text{IP}=4, \text{Wire}=1, \text{Volt}=\text{High}, \text{VF}=54, \text{Max Speed}=150\text{Hz}$, Offset nhập $0.118\text{mm} \implies$ kích thước chuẩn luôn 100% danh nghĩa ($\Delta = 0.000$).
  - Xác lập Offset Chuẩn = $0.118\text{mm}$, lượng cào phôi $\delta = 0.118 - 0.090 = \mathbf{0.0280\text{ mm}}$ ($28.0\,\mu\text{m}$).
  - Ghi nhận chỉ số thực tế quý giá: Kim Ampe ăn $3.5\text{A} - 3.6\text{A}$ (khớp lý thuyết $3.3\text{A} \sim 3.5\text{A}$), tốc độ thực $50 - 60\text{ mm}^2/\text{phút}$.
  - Cập nhật đồng bộ vào `WORKSHOP_DATA_BANK.md`, Rule 09 và mảng `WORKSHOP_EMPIRICAL_LIBRARY` + bảng `WS_LIB_BENCHMARK_JOBS[1]` trong `app.js`.
  - Đồng bộ phiên bản `v3.5.48` trên 5 file hệ thống và vượt qua 100% kiểm tra AST / Đạo luật chống bảng tra.
* **Đợt 47 (v3.5.47 - Hiệu chỉnh thông số bài cắt thực nghiệm STT 20 H=290mm):**
  - Tiếp nhận ảnh chụp bảng dữ liệu thực tế từ SirPhuong hiệu chỉnh thông số cắt STT 20: $\text{VF}=75$ (thay vì 50) và $\text{Max Speed}=50\text{Hz}$ (thay vì 150Hz).
  - Cập nhật đồng bộ trong `WORKSHOP_DATA_BANK.md`, Rule 09 và `app.js` (cả `WORKSHOP_EMPIRICAL_LIBRARY` và bảng `WS_LIB_BENCHMARK_JOBS[1]`).
  - Đồng bộ phiên bản `v3.5.47` trên 5 file hệ thống và vượt qua 100% kiểm tra AST / Đạo luật chống bảng tra.
* **Đợt 46 (v3.5.46 - Bổ sung Thẻ 11 Cẩm nang EDM Tab 4 & Giải mã Chùm xung GPon/GPoff):**
  - Tiếp nhận xác nhận từ SirPhuong: `GPon = 1, GPoff = 0` là xung đơn tiêu chuẩn liên tục, chùm xung không hoạt động.
  - Tìm kiếm và đối chiếu tài liệu kỹ thuật chuyên sâu về Chùm xung (Group Pulse / 脉冲组 / 分组脉冲 / F.M.): Cơ chế vật lý "Xung nung chảy phôi - Ngắt sâu xối xỉ & làm nguội dây" giải quyết triệt để nguy cơ đứt dây, hoa dây cho phôi siêu dày $H \ge 100 - 300\text{mm}$.
  - Thiết kế và bổ sung **Thẻ 11 trong Cẩm nang EDM Tab 4**: Trình bày rõ ràng công thức vi xử lý AutoCut ($P_{\text{off\_máy}}, T, f$) và các chế độ chùm xung ($GP_{\text{on}}, GP_{\text{off}}$) kèm chỉ dẫn vận hành cho thợ xưởng.
  - Cập nhật Rule 19, đồng bộ phiên bản `v3.5.46` trên toàn bộ 5 file hệ thống và vượt qua 100% kiểm tra AST.
* **Đợt 45 (v3.5.45 - Tích hợp Dữ liệu Thực nghiệm Phôi Siêu Dày STT 20 H=290mm):**
  - Tiếp nhận và giải mã bài cắt thực tế phôi siêu dày $H=290\text{mm}$, SCM440 cắt cối 1 Pass: $\text{Ton}=135, \text{Po}=10, \text{IP}=6, \text{VF}=50, 150\text{Hz}$, Offset nhập $0.110\text{mm} \implies$ kích thước chuẩn luôn 100% danh nghĩa ($\Delta = 0.000$).
  - Xác lập Offset Chuẩn = $0.110\text{mm}$, lượng cào phôi $\delta = 0.0200\text{mm}$ ($20.0\,\mu\text{m}$).
  - Cập nhật đồng bộ vào `WORKSHOP_DATA_BANK.md`, Rule 09 và mảng `WORKSHOP_EMPIRICAL_LIBRARY` + bảng `WS_LIB_BENCHMARK_JOBS[1]` trong `app.js`.
  - Ban hành Quy tắc 18 và Luật 20 về Kho tri thức nghiên cứu độ chính xác lượng cào phôi.
  - Đồng bộ phiên bản `v3.5.45` trên 5 file và vượt qua 100% kiểm tra AST.

---

## 📊 3. TRẠNG THÁI MÃ NGUỒN & HỆ THỐNG
* **Tính toàn vẹn mã nguồn:**
  - Bracket AST & Syntax check: `PASSED 100%`
  - Đạo luật Chống Bảng Tra & Phương trình Nhiệt động học Liên tục: `PASSED 100%`
  - Đồng bộ phiên bản (`v3.5.48`): `PASSED` trên 4 file (`version.json`, `index.html`, `app.js`, `sw.js`).
* **Độ chính xác kiểm toán bù dao EDM (Rule 19):**
  - MAE toàn cục 23 bài cắt: `6.26 um`
  - MAE phôi mỏng ($H \le 40\text{mm}$): `4.02 um`
  - MAE phôi dày ($100 < H \le 170\text{mm}$): `4.81 um`
  - Thuật toán đa biến Tab 3: `2.86 um`
* **Trạng thái Git:** Commit gần nhất `e0f99ed fix(tab3): remove duplicate closing divs restoring 2-column layout and tab isolation (v3.5.43)`. Các file tài liệu bộ não mới đã sẵn sàng đóng gói.

---

## 🔬 3b. NGHIÊN CỨU ĐANG CHỜ DUYỆT (2026-10-23) — CHƯA SỬA CODE
* **Kiến thức mới đã lưu (2026-10-23 tối):** Cách máy AutoCut tính Pon/Poff/GPon/GPoff (chùm xung) — xem `.agents/rules/19-GROUP_PULSE_GPON_GPOFF_KNOWLEDGE.md`; sách hướng dẫn hãng đã trích xuất văn bản tại `docs/AUTOCUT_MANUAL_TEXT_EXTRACT.txt` (AI không đọc trực tiếp PDF được). Chưa đưa vào công thức/app; Data Bank chưa có cột GPon/GPoff.
* **Đo thực tế 2026-10-24:** H=51 SCM420, Pon50/Poff7/GPon1/IP3/High/VF50: GPoff=0 → 3.0A, GPoff=1 → 1.5A (đúng 1/(1+GPoff)); công thức Ampe Tab 2 cho ≈2.5A (lệch −17%, chưa hiệu chỉnh). Xem Rule 19 mục VI.
* Báo cáo: `docs/RESEARCH_TAB3_ALTERNATIVE_MODELS.md` (so sánh mô hình Tab 3 bằng LOOCV trên 14 điểm thật H≤170).
* Kết luận chính: Tab 3 hiện tại MAE 5.50 µm / max 20.2 µm; biến **cối vs chày** là nhân tố lớn nhất chưa mô hình hóa (δ cối ≈ 22.2 µm vs chày ≈ 8.8 µm, p=0.001); H, Ton, IP, Po đa cộng tuyến (corr ≈ 0.9–0.99) nên d_elec/d_slag/d_vibr không tách được.
* Đề xuất Tab 3 v2: `δ = C0 + K_e·√(Ton·IP)·U + δ_Low + K_vf·(VF−55)/10 + K_die·s`. **Chờ SirPhuong duyệt + thí nghiệm kiểm chứng T1/T2 (cùng chế độ, đổi cối↔chày)** trước khi sửa `app.js`.

---

## 🎯 4. CÔNG VIỆC TIẾP THEO CẦN LÀM
1. Tiếp nhận dữ liệu cắt thực tế mới từ xưởng của SirPhuong (hoặc yêu cầu tinh chỉnh giao diện/công thức).
2. Sẵn sàng kích hoạt tức thì khi nhận khẩu lệnh `"Bắt đầu"`, `"hãy kiểm định lại thông số offset"`, hoặc khi SirPhuong đề cập trực tiếp/gián tiếp đến *"tinh chỉnh phát triển độ chính xác lượng cào phôi"* (Luật 20).
3. Đóng gói bản sao lưu số 84 và commit Git nhánh `main` khi SirPhuong ra lệnh kết thúc phiên làm việc.

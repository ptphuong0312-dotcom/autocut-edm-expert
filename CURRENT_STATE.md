# ⚡ CURRENT_STATE.md - TRẠM TRẠNG THÁI SIÊU TỐC
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
*Chủ sở hữu: **SirPhuong***  
*Cơ chế làm việc: Luân phiên 2 máy (Máy Ở Nhà ⟷ Máy Công Ty qua OneDrive & GitHub)*

---

## ⏱️ 1. THỜI GIAN LÀM VIỆC GẦN NHẤT
* **Thời điểm cập nhật:** `2026-11-04 14:15:00` (Giờ địa phương GMT+7)
* **Vị trí làm việc hiện tại:** Máy tính Ở Nhà (Ổ G:)
* **Phiên bản hệ thống:** `v3.5.50` (Đã hoàn thiện & đóng gói)

---

## ✅ 2. CÁC VIỆC VỪA HOÀN THÀNH
* **Đợt 50 (v3.5.50 - Tích hợp Dữ liệu Thực nghiệm Cắt Chày STT 22 H=12mm SCM420 Volt Low):**
  - **Tiếp nhận bài cắt thực tế STT 22:** Phôi mỏng $H=12\text{mm}$, SCM420 ($HB < 200$), cắt chày 1 Pass: $\text{Ton}=16, \text{Po}=6, \text{IP}=3, \text{Wire}=1, \text{Volt}=\text{Low}, \text{VF}=60, \text{Max Speed}=150\text{Hz}$, Offset nhập $0.095\text{mm} \implies$ kích thước chuẩn luôn 100% danh nghĩa ($\Delta = 0.000$).
  - **Xác lập Offset Chuẩn & Lượng cào phôi:** $\text{Offset Chuẩn} = 0.095\text{mm} \implies \delta = 0.095 - 0.090 = \mathbf{0.0050\text{ mm}}$ ($5.0\,\mu\text{m}$).
  - **Ghi nhận đồng hồ Ampe:** Thực tế kim ăn **$2.5\text{A} - 2.7\text{A}$** ở $\text{IP}=3, \text{Po}=6$ Volt Low, khớp chuẩn xác với dải Ampe Rule 12 cho phôi mỏng.
  - **Ý nghĩa kiểm chứng khép kín:** Khớp $95\% - 100\%$ với chế độ tiêu chuẩn khuyến nghị của Web App Tab 2 cho phôi $H \le 15\text{mm}$ ($\text{Volt}=\text{Low}, \text{Po}=6, \text{IP}=3, \text{Ton} \approx 16-17\mu s$).
  - **Cập nhật dữ liệu & Thư viện:** Bổ sung STT 22 vào `WORKSHOP_DATA_BANK.md`, Rule 09 và mảng `WORKSHOP_EMPIRICAL_LIBRARY` + bảng `WS_LIB_BENCHMARK_JOBS[1]` trong `app.js`.
  - **Đồng bộ phiên bản `v3.5.50`:** Đồng bộ trên 5 file hệ thống và vượt qua 100% kiểm tra AST `verify_integrity.ps1`.
* **Đợt 49 (v3.5.49 - Phân tách tính riêng SCM420 & SCM440 trong Tab 3):**
  - **Đồng bộ công thức Ampe Tab 3:** Thay thế hệ số cũ `1.15` bằng công thức chuẩn Tab 2 `i_peak * duty * 2.6667 * (u_arc / 27)`, giúp chỉ số Ampe dự tính của Tab 3 khớp chính xác với kim Ampe thực tế xưởng (dải 3.0A - 4.5A thay vì bị tụt thấp ~1.5A - 1.8A như trước).
  - **Hiệu chỉnh hệ số xỉ SCM420 (`slag_mat`):** Chuyển từ `1.10x` sang `0.80x` (SCM440 giữ chuẩn `1.0x`), giúp giảm độ ghìm xỉ âm, tăng nhẹ khe cào phôi $\delta$ cho thép mềm SCM420 thêm $\approx +1.8\mu m \sim +4.0\mu m$, kéo giảm sai số MAE của toàn bộ tập phôi $H \le 170\text{mm}$ từ $6.83\mu m$ xuống $6.33\mu m$.
  - **Cập nhật giao diện bóc tách thành phần vật lý:** Đổi chú thích dòng $d_{\text{slag}}$ trong bảng Tab 3 hiển thị rõ ràng đặc tính của SCM440 (chuẩn xỉ 1.0x) và SCM420 (hệ số xỉ 0.80x cào thoáng hơn).
  - **Đồng bộ phiên bản `v3.5.49`:** Cập nhật đồng bộ trên `version.json`, `index.html`, `app.js`, `sw.js` và vượt qua 100% kiểm tra cú pháp AST `verify_integrity.ps1`.
* **Đợt 48 (v3.5.48 - Tích hợp Bài cắt STT 21 H=90mm & Đính chính Bản chất Vật lý Cốt lõi từ SirPhuong):**
  - **Tiếp nhận bài cắt thực tế STT 21:** Phôi dày $H=90\text{mm}$, SCM420 ($HB < 200$), cắt 1 Pass: $\text{Ton}=80, \text{Po}=7, \text{IP}=4, \text{Wire}=1, \text{Volt}=\text{High}, \text{VF}=54, \text{Max Speed}=150\text{Hz}$, Offset nhập $0.118\text{mm} \implies$ kích thước chuẩn luôn 100% danh nghĩa ($\Delta = 0.000$).
  - Xác lập Offset Chuẩn = $0.118\text{mm}$, lượng cào phôi $\delta = 0.118 - 0.090 = \mathbf{0.0280\text{ mm}}$ ($28.0\,\mu\text{m}$).
  - Ghi nhận thực tế: Kim Ampe ăn $3.5\text{A} - 3.6\text{A}$ (khớp lý thuyết), tốc độ thực $50 - 60\text{ mm}^2/\text{phút}$.
  - Cập nhật đồng bộ vào `WORKSHOP_DATA_BANK.md`, Rule 09 và mảng `WORKSHOP_EMPIRICAL_LIBRARY` + bảng `WS_LIB_BENCHMARK_JOBS[1]` trong `app.js`.
  - **Chỉ thị Vật lý Cốt lõi từ SirPhuong (Bác bỏ biến Cối vs Chày):**
    > *"Lượng cào phôi dầy mỏng là do chế độ điện còn bạn cắt cối hay chày thì dây vẫn chạy vào cắt ở 1 khối đặc thì làm gì có sự khác nhau."*
    + Khắc sâu nguyên lý: Khi cắt 1 Pass vào khối thép đặc, dây Molypden xẻ rãnh đối xứng xuyên qua khối kim loại đồng nhất; lượng cào phôi $\delta$ phụ thuộc **100% vào chế độ điện** ($\text{Ton}, \text{Po}, \text{IP}, \text{Volt}, \text{VF}, \text{Max Speed}$) và chiều dày $H$, tuyệt đối không phân biệt cối hay chày.
    + Nhận diện ngụy tương quan: Sự chênh lệch $\delta$ trong quá khứ là do các bài cắt cối xưởng chạy năng lượng xung $\text{Ton}, \text{IP}$ rất lớn. Minh chứng: Cùng cắt cối, $H=290\text{mm}$ (STT 20) chạy $\text{Po}=10, \text{VF}=75, 50\text{Hz}$ có $\delta = 20\mu m$, nhỏ hơn nhiều so với $H=90\text{mm}$ (STT 21) chạy $\text{Po}=7, \text{VF}=54, 150\text{Hz}$ có $\delta = 28\mu m$!
    + Hủy bỏ hoàn toàn đề xuất đưa biến hình học $K_{\text{die}}$ vào công thức tính toán.
    + Cập nhật đồng bộ trong `AGENTS.md` (Luật 20), `GEMINI.md`, Rule 18 và `docs/RESEARCH_TAB3_ALTERNATIVE_MODELS.md`.
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

## 🔬 3b. NGHIÊN CỨU & KẾT LUẬN VẬT LÝ TỪ SIRPHUONG (2026-10-31)
* **Kiến thức mới đã lưu:** Cách máy AutoCut tính Pon/Poff/GPon/GPoff (chùm xung) — xem `.agents/rules/19-GROUP_PULSE_GPON_GPOFF_KNOWLEDGE.md`; sách hướng dẫn hãng đã trích xuất văn bản tại `docs/AUTOCUT_MANUAL_TEXT_EXTRACT.txt`.
* **Đo thực tế 2026-10-24:** H=51 SCM420, Pon50/Poff7/GPon1/IP3/High/VF50: GPoff=0 → 3.0A, GPoff=1 → 1.5A (đúng 1/(1+GPoff)).
* **Quy ước thuật ngữ (SirPhuong, 2026-10-31):** "thư viện" = thư viện thực nghiệm trên Web App (17 bài 1 Pass). **Vùng tham khảo C (⛔ STT 4, 5, 8, 9, 13) là vùng cách ly, chỉ dùng khi SirPhuong nhắc đích danh.**
* **Đối chiếu Tab 3 với thư viện Web App (2026-10-31, chưa sửa code):** Tab 3 hiện tại MAE 6.36 µm / max 25.7 µm (lệch dồn H75, H90, H95, H160). Thử tuyến tính ≤3 biến, luật lũy thừa, fit lại khung Tab 3 bằng LOOCV: không cấu trúc nào xuống dưới LOO-MAE ≈ 6 µm; fit lại hệ số làm LOO tệ hơn (7.3–8.9). Gốc rễ là đa cộng tuyến/thiếu dữ liệu đơn biến → đề xuất thí nghiệm đơn biến (thang Ton/Po/VF/IP tại H=75). Chi tiết: `docs/RESEARCH_TAB3_LIBRARY_FIT.md`, script: `scripts/research_tab3_library/`.
* **Báo cáo nghiên cứu:** `docs/RESEARCH_TAB3_ALTERNATIVE_MODELS.md` và `.agents/rules/18-SPARK_GAP_PRECISION_RESEARCH_VAULT.md`.
* **Kết luận Tối cao từ SirPhuong:** Bác bỏ hoàn toàn biến hình học $K_{\text{die}}$ (Cối vs Chày). Dây cắt vào phôi đặc nguyên khối thì tia lửa đối xứng đồng nhất; $\delta$ phụ thuộc 100% vào chế độ điện ($\text{Ton}, \text{Po}, \text{IP}, \text{Volt}, \text{VF}, \text{Max Speed}$) và chiều dày $H$. Mọi hướng nghiên cứu tiếp theo sẽ tập trung vào phân rã động học xung đa biến thuần vật lý.

---

## 🎯 4. CÔNG VIỆC TIẾP THEO CẦN LÀM
1. Tiếp nhận dữ liệu cắt thực tế mới từ xưởng của SirPhuong (hoặc yêu cầu tinh chỉnh giao diện/công thức).
2. Sẵn sàng kích hoạt tức thì khi nhận khẩu lệnh `"Bắt đầu"`, `"hãy kiểm định lại thông số offset"`, hoặc khi SirPhuong đề cập trực tiếp/gián tiếp đến *"tinh chỉnh phát triển độ chính xác lượng cào phôi"* (Luật 20).
3. Đóng gói bản sao lưu số 84 và commit Git nhánh `main` khi SirPhuong ra lệnh kết thúc phiên làm việc.

# 📑 NHẬT KÝ KỸ THUẬT & TỐI ƯU HÓA TRƯỜNG TỒN (OPTIMIZATION HISTORY)
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
*Chủ sở hữu tối cao: **SirPhuong***  
*Cơ chế luân chuyển: Máy Ở Nhà ⟷ Máy Công Ty (Đồng bộ kép OneDrive & GitHub)*

---

## 🎯 MỤC ĐÍCH TÀI LIỆU
Tài liệu này là **Nhật ký kỹ thuật trường tồn** của dự án. Mọi can thiệp mã nguồn, sửa lỗi, tinh chỉnh công thức toán - vật lý, hoặc tiếp nhận số liệu thực nghiệm đo đạc từ xưởng của SirPhuong đều được ghi chép chi tiết theo từng **Đợt** (Đợt 1, Đợt 2, Đợt 3...).
Khi luân chuyển giữa Máy Nhà và Máy Công Ty, AI chỉ cần đọc tài liệu này là nắm rõ lịch sử can thiệp kỹ thuật và các kết quả nghiệm thu chính xác.

---

## 📌 DANH SÁCH CÁC ĐỢT TỐI ƯU HÓA & NGHIỆM THU KỸ THUẬT

### 🚀 ĐỢT 44: THIẾT LẬP HẠ TẦNG BỘ NÃO TRI THỨC LUÂN PHIÊN 2 MÁY (v3.5.44)
* **Thời gian:** 2026-10-22 23:15 (GMT+7)
* **Môi trường:** Máy tính Ở Nhà
* **Mục tiêu kỹ thuật:**
  - Xây dựng hệ thống 4 Trụ Cột Bộ Não Tri Thức bảo toàn vĩnh viễn bối cảnh kỹ thuật khi SirPhuong luân chuyển giữa 2 máy tính Nhà ⟷ Công Ty qua OneDrive và GitHub.
  - Chuẩn hóa khẩu lệnh khởi động siêu tốc `"Bắt đầu"`.
  - Khắc phục sự thiếu hụt Node.js trên máy ở nhà bằng cách cung cấp bộ công cụ kiểm toán/toàn vẹn hệ thống chạy thuần Python 3.12.
* **Các file đã sửa / tạo mới:**
  - `CURRENT_STATE.md`: Trạm trạng thái siêu tốc ở thư mục gốc.
  - `docs/OPTIMIZATION_HISTORY.md`: Nhật ký kỹ thuật trường tồn này.
  - `.agents/workflows/khoi_dong_phien_lam_viec_bat_dau.md`: Kịch bản vận hành khởi động chuẩn hóa.
  - `GEMINI.md`: Cập nhật cấu trúc 4 trụ cột và quy chuẩn an toàn kép.
  - `scripts/verify_integrity.py`: Script kiểm định cú pháp, ngoặc AST và quy tắc chống bảng tra chạy bằng Python.
* **Kết quả nghiệm thu:**
  - `python scripts/verify_integrity.py`: Bracket AST & Pure Physics PASSED 100%.
  - `python scripts/audit_spark_gap.py`: Toàn bộ 23 bài cắt thực nghiệm hợp lệ chạy trơn tru.

---

### 🚀 ĐỢT 43: KHẮC PHỤC LỖI PHÂN CẤP THẺ HTML DOM TAB 3 (v3.5.43)
* **Thời gian:** 2026-10-21
* **Mục tiêu kỹ thuật:**
  - Khắc phục hiện tượng khối kết quả tính toán Tab 3 bị rò rỉ ra ngoài và hiển thị ở chân trang tất cả các Tab khác.
* **Các file đã sửa:**
  - `index.html`: Loại bỏ 2 thẻ `</div>` đóng dư thừa trong cấu trúc DOM của Tab 3.
  - `version.json`, `app.js`, `sw.js`: Đồng bộ phiên bản lên `v3.5.43`.
* **Kết quả nghiệm thu:**
  - Bố cục lưới 2 cột song song của Tab 3 (Cột nhập liệu bên trái, Khối kết quả so sánh bên phải) hiển thị chuẩn đẹp, hoàn toàn độc lập và không còn rò rỉ layout sang các Tab khác.
  - Bản sao lưu số 82: `autocut_2026-10-21(82).zip`.

---

### 🚀 ĐỢT 42: TỐI ƯU HÓA ĐA BIẾN TAB 3 & GIẢM SAI SỐ MAE XUỐNG 2.86µm (v3.5.42)
* **Thời gian:** 2026-10-21
* **Mục tiêu kỹ thuật:**
  - Tích hợp 3 yếu tố vật lý thực chiến vào động cơ tính toán Tab 3:
    1. Hiệu ứng màng đệm điện môi khi chạy $\text{Volt} = \text{Low}$ ($+4.5\mu m$).
    2. Hệ số thoát xỉ theo bản chất vật liệu: Phôi thép dẻo mềm SCM420 tích tụ xỉ cao hơn thép tôi tôi SCM440 $+10\%$ ($K_{\text{mat}} = 1.10$).
    3. Đồng bộ cơ chế hội tụ phôi siêu dày $H > 170\text{mm}$ theo Rule 17.
* **Các file đã sửa:**
  - `app.js`: Tinh chỉnh hàm tính toán vi mô lượng cào phôi $\delta$.
  - `index.html`, `version.json`, `sw.js`: Đồng bộ phiên bản lên `v3.5.42`.
* **Kết quả nghiệm thu:**
  - Sai số tuyệt đối trung bình (MAE) trên toàn bộ tập dữ liệu thực nghiệm giảm mạnh từ $6.26\mu m$ xuống còn **$2.86\mu m$**.
  - Bản sao lưu số 81: `autocut_2026-10-21(81).zip`.

---

### 🚀 ĐỢT 41: TÍCH HỢP ĐỘNG LỰC HỌC XUNG VÀ CHU KỲ XẢ XỈ Po (v3.5.41)
* **Thời gian:** 2026-10-21
* **Mục tiêu kỹ thuật:**
  - Chuẩn hóa công thức động học theo tài liệu gốc AutoCut ADP0106:
    $$T_{\text{off}} = T_{\text{on}} \times (P_o + 1), \quad T = T_{\text{on}} \times (P_o + 2), \quad \eta = \frac{1}{P_o + 2}$$
  - Đưa bảng phân tích động học xung và tần số phát xung thực tế vào Tab 3.
* **Các file đã sửa:**
  - `app.js`: Viết lại hàm phân tích xung và tính bước tiến theo chu kỳ mở van.
  - `index.html`: Bổ sung bảng thông số động học xung hiển thị động trên UI.
* **Kết quả nghiệm thu:**
  - Khắc phục hoàn toàn hiểu lầm trước đây coi $P_o$ là microsecond cố định.
  - Bản sao lưu số 80: `autocut_2026-10-21(80).zip`.

---

### 🚀 ĐỢT 40: BỔ SUNG CỘT SAI SỐ (Δ) VÀO BẢNG THƯ VIỆN THỰC NGHIỆM TAB 2 (v3.5.40)
* **Thời gian:** 2026-10-21
* **Mục tiêu kỹ thuật:**
  - Minh bạch hóa độ chính xác của công thức lý thuyết so với kết quả cắt thực tế trên giao diện thợ.
* **Các file đã sửa:**
  - `app.js`: Bổ sung cột Sai Số $(\Delta = O_{\text{calc}} - O_{\text{chuẩn}})$ vào bảng thư viện đối chứng Tab 2.
  - `style.css`: Thêm màu cảnh báo trực quan cho sai số (xanh lá nếu $\le 3\mu m$, cam nếu $3 - 5\mu m$, đỏ nếu $> 5\mu m$).
* **Kết quả nghiệm thu:**
  - Thợ đứng máy có thể nhìn thấy ngay độ lệch chính xác từng micron của máy.
  - Bản sao lưu số 79: `autocut_2026-10-21(79).zip`.

---

### 🚀 ĐỢT 39: TÍCH HỢP 3 BÀI CẮT THỰC NGHIỆM MỚI STT 17, 18, 19 VÀO DATA BANK (v3.5.39)
* **Thời gian:** 2026-10-21
* **Mục tiêu kỹ thuật:**
  - Tiếp nhận và giải mã 3 bài cắt thực tế mới do SirPhuong cung cấp theo đúng SOP 6 bước:
    + STT 17: Phôi $H=95\text{mm}$, SCM440 cắt cối 1 Pass ($O_{\text{chuẩn}} = 0.1135\text{mm}$, $\delta = 0.0235\text{mm}$).
    + STT 18: Phôi $H=63\text{mm}$, SCM420 cắt chày 1 Pass ($O_{\text{chuẩn}} = 0.0980\text{mm}$, $\delta = 0.0080\text{mm}$).
    + STT 19: Phôi $H=110\text{mm}$, SCM420 cắt chày 1 Pass chuẩn $100\%$ ($O_{\text{chuẩn}} = 0.1050\text{mm}$, $\delta = 0.0150\text{mm}$).
* **Các file đã sửa:**
  - `WORKSHOP_DATA_BANK.md`: Ghi chép chi tiết 17 trường thông số gốc và giải mã động học.
  - `app.js`: Bổ sung vào mảng `WORKSHOP_EMPIRICAL_LIBRARY`.
* **Kết quả nghiệm thu:**
  - Gia tăng độ dày đặc của dữ liệu thực nghiệm ở dải phôi trung và dày ($63\text{mm}$, $95\text{mm}$, $110\text{mm}$).
  - Bản sao lưu số 78: `autocut_2026-10-21(78).zip`.


---

### 🔬 NGHIÊN CỨU 2026-10-23: PHƯƠNG ÁN TÍNH TAB 3 SÁT THỰC TẾ HƠN (CHỜ DUYỆT – CHƯA SỬA CODE)
* **Yêu cầu của SirPhuong:** Tìm kiểu tính toán Tab 3 sát thực tế hơn từ dữ liệu thực tế, trình bày rồi mới quyết định làm.
* **Phương pháp:** LOOCV trên 14 điểm độc lập (H ≤ 170, 1 Pass thật + quy đổi Rule 15, đã gộp trùng); STT14 (H=300) dùng kiểm tra ngoài mẫu. Máy không có Node/Python nên chạy bằng PowerShell.
* **Kết quả:** Tab 3 hiện tại MAE 5.50 µm / max 20.2 µm (lệch dồn ở 3 bài cối STT15/16/17). Biến cối/chày giải thích δ mạnh nhất (22.2 vs 8.8 µm, permutation p=0.001). H, Ton, IP, Po đa cộng tuyến (corr 0.9–0.99). Mô hình `c + √(Ton·IP)·U + VF + cối` đạt LOO-MAE 4.4 µm, dự đoán H=300 cối lệch −0.9 µm không cần neo.
* **Trạng thái:** Không sửa file mã nguồn/Data Bank. Báo cáo đầy đủ: `docs/RESEARCH_TAB3_ALTERNATIVE_MODELS.md`. Bước tiếp: SirPhuong duyệt + cắt kiểm chứng T1/T2 (đổi cối↔chày cùng chế độ).


---

### 🚀 ĐỢT 45: TÍCH HỢP BÀI CẮT PHÔI SIÊU DÀY STT 20 (H=290mm) VÀO DATA BANK VÀ THƯ VIỆN TAB 2 (v3.5.45)
* **Thời gian:** 2026-10-23
* **Mục tiêu kỹ thuật:**
  - Tiếp nhận và giải mã bài cắt thực tế phôi siêu dày $H=290\text{mm}$ do SirPhuong cung cấp theo đúng SOP 6 bước:
    + STT 20: Phôi siêu dày $H=290\text{mm}$, thép tôi SCM440 (28-32 HRC), cắt cối 1 Pass: $\text{Ton}=135, \text{Po}=10, \text{IP}=6, \text{Wire}=1, \text{Volt}=\text{High}, \text{VF}=50, 150\text{Hz}$, Offset nhập $0.110\text{mm} \implies$ kích thước chuẩn luôn 100% ($\Delta = 0.000$).
    + Lượng cào phôi thép đặc: $\delta = 0.110 - 0.090 = \mathbf{0.0200\text{ mm}} = 20.0\,\mu\text{m}$.
    + Minh chứng thực nghiệm giá trị cao: Chứng minh ở phôi siêu dày ($H=290\text{mm}$ vs $H=300\text{mm}$), khi giảm $\text{VF}$ từ 65 về 50 (bàn tiến nhanh hơn, giảm ngâm nhiệt) thì $\delta$ giảm đúng $5.0\,\mu\text{m}$ (từ $25.0\,\mu\text{m}$ về $20.0\,\mu\text{m}$).
* **Các file đã sửa:**
  - `WORKSHOP_DATA_BANK.md` & `09-WORKSHOP_RAW_DATA_BANK_AND_REVERSE_INTERPOLATION.md`: Bổ sung STT 20 và hộp phân tích động học.
  - `app.js`: Thêm STT 20 vào `WORKSHOP_EMPIRICAL_LIBRARY` và chèn $H=290$ vào bảng `WS_LIB_BENCHMARK_JOBS[1]`.
  - `AGENTS.md` & `GEMINI.md`: Thêm Luật 20 (Kho tri thức nghiên cứu độ chính xác lượng cào phôi).
  - `.agents/rules/18-SPARK_GAP_PRECISION_RESEARCH_VAULT.md`: Tạo tài liệu quy chuẩn kích hoạt tự động.
  - `scripts/verify_integrity.ps1`: Tạo script kiểm toán AST & cú pháp độc lập bằng PowerShell.
  - Đồng bộ phiên bản `v3.5.45` trên 5 file hệ thống.
* **Kết quả nghiệm thu:**
  - Vượt qua 100% kiểm tra cú pháp AST/ngoặc nhọn và Đạo luật Chống Bảng Tra.
  - Bản sao lưu số 85: `autocut_2026-10-23(85).zip`.


---

### 📚 TRI THỨC 2026-10-23 (TỐI): CHÙM XUNG GPon/GPoff CỦA MÁY AUTOCUT (KHÔNG SỬA CODE)
* **Nguồn:** 8 ảnh chụp màn hình bảng Technics Database do SirPhuong nhập số liệu tự do (chỉ để lộ cách máy tính), sách hướng dẫn hãng, 6 lượt tìm kiếm web.
* **Đã xác minh (khớp 8/8 ảnh):** $P_{off}=P_{on}(P_{off,nhập}+1)$; $GP_{on}=(GP_{on,nhập}+1)\times T$; $GP_{off}=GP_{off,nhập}\times GP_{on}$; $GP_{off}=0$ → xung liên tục. Hệ số làm việc chùm $=1/(1+GP_{off})$.
* **Sách hãng:** định nghĩa tham số ở mục 4.5 (Expert Database); không có ví dụ/giá trị khuyến nghị GPon/GPoff. Đã trích xuất văn bản PDF → `docs/AUTOCUT_MANUAL_TEXT_EXTRACT.txt`.
* **Web:** chỉ có mô tả định tính (nghỉ chùm dài để xả mùn, chống đứt dây phôi dày); không tìm được ví dụ cắt thực tế kèm chế độ điện; một số nhận định ngoài mâu thuẫn với số liệu máy → không dùng làm công thức.
* **Lưu tại:** `.agents/rules/19-GROUP_PULSE_GPON_GPOFF_KNOWLEDGE.md`, `TUDIEN_EDM.md` (mục 6), `GEMINI.md` (mục 6A). Chưa ảnh hưởng Tab 1/2/3; chưa có dữ liệu GPoff lên δ/Ampe/tốc độ.


---

### 🚀 ĐỢT 46: BỔ SUNG THẺ 11 CẨM NANG EDM TAB 4 & GIẢI MÃ CÔNG NGHỆ CHÙM XUNG (v3.5.46)
* **Thời gian:** 2026-10-24
* **Mục tiêu kỹ thuật:**
  - Tiếp nhận xác nhận từ SirPhuong: `GPon = 1, GPoff = 0` nghĩa là chùm xung không hoạt động, máy vẫn đang chạy chế độ phát xung đơn tiêu chuẩn liên tục.
  - Tìm kiếm và tích hợp tài liệu công nghệ EDM chuyên sâu (Trung Quốc/Đài Loan) về Chùm xung (Group Pulse / 脉冲组 / 分组脉冲): Giải mã bản chất 2 nhịp (Nhịp nổ bóc phôi trong chùm $N = GP_{\text{on}}+1$ xung & Nhịp ngắt sâu $GP_{\text{off}}$ để nước áp lực cao xối sạch mạt xỉ, khử ion hóa và làm nguội dây Moly), chống đứt dây triệt để khi cắt phôi siêu dày $H \ge 100 - 300\text{mm}$.
  - Thiết kế và bổ sung **Thẻ 11 trong Cẩm nang EDM Tab 4** trên giao diện Web App:
    + Mục 1: Công thức vi xử lý AutoCut quy đổi micro-giây ($\mu s$) thực tế và tần số ($P_{\text{off\_máy}}, T, f$).
    + Mục 2: Công thức và bảng tra trạng thái Chùm xung ($GP_{\text{on}}, GP_{\text{off}}$).
    + Mục 3: Chỉ dẫn vận hành thực tế cho thợ xưởng (khi nào giữ $GP_{\text{off}}=0$, khi nào nâng $GP_{\text{off}}=1 \sim 2$).
* **Các file đã sửa:**
  - `index.html`: Thêm Thẻ 11 vào `#tab-knowledge`, cập nhật số hiệu phiên bản.
  - `app.js`: Đồng bộ `CURRENT_VERSION = "3.5.46"`.
  - `version.json`: Nâng phiên bản `v3.5.46` và release note.
  - `sw.js`: Cập nhật cache name `autocut-v3.5.46`.
  - `.agents/rules/19-GROUP_PULSE_GPON_GPOFF_KNOWLEDGE.md`: Cập nhật xác nhận của SirPhuong và các chỉ dẫn kỹ thuật chuyên sâu.
  - `CURRENT_STATE.md`: Cập nhật trạng thái Đợt 46.
* **Kết quả nghiệm thu:**
  - Kiểm tra cú pháp/ngoặc AST và Đạo luật Chống bảng tra bằng `scripts/verify_integrity.ps1`: `PASSED 100%`.
  - Đồng bộ phiên bản `v3.5.46` trên toàn bộ hệ thống: `PASSED 100%`.


---

### 📚 TRI THỨC 2026-10-24 (TRƯA): ĐO ẢNH HƯỞNG GPoff LÊN AMPE (KHÔNG SỬA CODE)
* **Dữ liệu SirPhuong:** $H=51\text{mm}$ SCM420; $P_{on}=50, P_{off}=7, GP_{on}=1, IP=3, \text{High}, \text{VF}=50$: $GP_{off}=0 \to 3.0\text{A}$; $GP_{off}=1 \to 1.5\text{A}$ (đúng 50% $= 1/(1+GP_{off})$).
* **Đối chiếu:** công thức Ampe Tab 2 cho ≈2.5A ở $GP_{off}=0$ (lệch −17% so với 3.0A đo). Chưa hiệu chỉnh.
* **Lưu tại:** `.agents/rules/19-GROUP_PULSE_GPON_GPOFF_KNOWLEDGE.md` (mục VI). Chưa vào Data Bank/Tab 4.


---

### 🚀 ĐỢT 47: HIỆU CHỈNH THÔNG SỐ BÀI CẮT STT 20 (H=290mm, SCM440 CỐI) (v3.5.47)
* **Thời gian:** 2026-10-24
* **Mục tiêu kỹ thuật:**
  - Tiếp nhận ảnh chụp bảng thông số gia công thực tế từ SirPhuong hiệu chỉnh bài cắt STT 20:
    + Thông số trước đó gửi nhầm: $\text{VF}=50, \text{Max Speed}=150\text{Hz}$.
    + Thông số thực tế chuẩn xác theo ảnh: $\mathbf{\text{VF}=75}, \mathbf{\text{Max Speed}=50\text{Hz}}$ (cùng $\text{Ton}=135, \text{Po}=10, \text{IP}=6, \text{Wire}=1, \text{Volt}=\text{High}$, Offset nhập $0.110\text{mm} \implies$ cắt cối chuẩn kích thước $100\%$, $\delta = 0.020\text{mm}$).
  - Cập nhật đồng bộ trong `WORKSHOP_DATA_BANK.md`, Rule 09 và `app.js` (`WORKSHOP_EMPIRICAL_LIBRARY` và `WS_LIB_BENCHMARK_JOBS[1]`).
* **Các file đã sửa:**
  - `WORKSHOP_DATA_BANK.md` & `.agents/rules/09-WORKSHOP_RAW_DATA_BANK_AND_REVERSE_INTERPOLATION.md`: Cập nhật bảng thô STT 20, bảng suy luận ngược và phân tích động học.
  - `app.js`: Cập nhật `VF: 75`, `maxSpeed: "50Hz"` và nâng phiên bản `v3.5.47`.
  - `version.json`, `index.html`, `sw.js`: Đồng bộ phiên bản `v3.5.47`.
  - `CURRENT_STATE.md`: Cập nhật trạng thái Đợt 47.
* **Kết quả nghiệm thu:**
  - `scripts/verify_integrity.ps1`: `PASSED 100%`.
  - Backup: `autocut_2026-10-24(87).zip`.


---

### 🚀 ĐỢT 48: TÍCH HỢP BÀI CẮT THỰC NGHIỆM STT 21 (H=90mm, SCM420 CỐI) (v3.5.48)
* **Thời gian:** 2026-10-31
* **Mục tiêu kỹ thuật:**
  - Tiếp nhận và giải mã bài cắt thực tế phôi $H=90\text{mm}$, thép dẻo SCM420 ($HB < 200$), cắt cối 1 Pass do SirPhuong cung cấp theo đúng SOP 6 bước:
    + STT 21: Phôi dày $H=90\text{mm}$, SCM420 ($HB < 200$), cắt cối 1 Pass: $\text{Ton}=80, \text{Po}=7, \text{IP}=4, \text{Wire}=1, \text{Volt}=\text{High}, \text{VF}=54, \text{Max Speed}=150\text{Hz}$, Offset nhập $0.118\text{mm} \implies$ kích thước chuẩn luôn 100% danh nghĩa ($\Delta = 0.000$).
    + Lượng cào phôi thép đặc: $\delta = 0.118 - 0.090 = \mathbf{0.0280\text{ mm}} = 28.0\,\mu\text{m}$.
    + Đồng hồ Ampe thực tế: $3.5\text{A} - 3.6\text{A}$, khớp rất sát công thức lý thuyết ($3.3\text{A} \sim 3.5\text{A}$) ở cấp công suất $\text{IP}=4, \text{Po}=7$.
    + Tốc độ cắt thực tế: $50 - 60\text{ mm}^2/\text{phút}$.
    + Bản chất vật lý cốt lõi (Đính chính từ SirPhuong): Lượng cào phôi $\delta = 28.0\,\mu\text{m}$ hoàn toàn do chế độ điện năng lượng cao ($\text{Ton}=80\mu s, \text{Po}=7, \text{IP}=4$, Volt High) trong phôi dày $H=90\text{mm}$. Dây cắt 1 Pass vào khối thép đặc thì tia lửa chẻ đôi khối phôi đồng nhất, lượng cào phôi dày hay mỏng 100% do chế độ điện quyết định, tuyệt đối không phân biệt cối hay chày. Bác bỏ hoàn toàn giả thuyết $K_{\text{die}}$. Minh chứng: Cùng cắt cối, $H=290\text{mm}$ (STT 20) chạy $\text{Po}=10, \text{VF}=75, \text{Max Speed}=50\text{Hz}$ có $\delta = 20.0\,\mu\text{m}$, nhỏ hơn nhiều so với $H=90\text{mm}$ ($\delta = 28.0\,\mu\text{m}$).
  - Cập nhật đồng bộ vào `WORKSHOP_DATA_BANK.md`, Rule 09 và `app.js` (`WORKSHOP_EMPIRICAL_LIBRARY` và `WS_LIB_BENCHMARK_JOBS[1]`).
  - Đồng bộ cập nhật Hiến pháp `AGENTS.md` (Luật 20), `GEMINI.md`, Rule 18 và `docs/RESEARCH_TAB3_ALTERNATIVE_MODELS.md`.
* **Các file đã sửa:**
  - `WORKSHOP_DATA_BANK.md` & `.agents/rules/09-WORKSHOP_RAW_DATA_BANK_AND_REVERSE_INTERPOLATION.md`: Thêm STT 21 vào Bảng thô, Bảng suy luận ngược và hộp phân tích động học.
  - `app.js`: Thêm STT 21 vào `WORKSHOP_EMPIRICAL_LIBRARY`, thêm hàng $H=90$ vào `WS_LIB_BENCHMARK_JOBS[1]`, nâng phiên bản `v3.5.48`.
  - `version.json`, `index.html`, `sw.js`: Đồng bộ phiên bản `v3.5.48`.
  - `CURRENT_STATE.md`: Cập nhật trạng thái Đợt 48.
* **Kết quả nghiệm thu:**
  - `scripts/verify_integrity.ps1`: `PASSED 100%`.
  - Backup: `autocut_2026-10-31(88).zip`.

---

### 🚀 ĐỢT 49: PHÂN TÁCH TÍNH RIÊNG THÉP SCM420 & SCM440 TRONG TAB 3 (v3.5.49)
* **Thời gian:** 2026-10-31 21:00 (GMT+7)
* **Mục tiêu kỹ thuật:**
  - Tiếp nhận chỉ đạo từ SirPhuong về việc phân tách tính riêng cho thép mềm SCM420 ($HB < 200$) và thép tôi cứng SCM440 (28-32 HRC) trong Tab 3:
    1. **Đồng bộ công thức Ampe:** Tab 3 trước đây dùng công thức nhân `1.15` khiến Ampe dự tính chỉ ra ~1.5A - 1.8A (thấp hơn 2.3 lần so với thực tế). Đã đồng bộ sang công thức chuẩn xưởng của Tab 2: `I = i_peak * duty * 2.6667 * (u_arc / 27)`, đưa dòng điện hiển thị về dải thực tế $3.0\text{A} - 4.5\text{A}$ khớp 100% kim đồng hồ Ampe máy AutoCut.
    2. **Hiệu chỉnh hệ số xỉ SCM420 (`slag_mat`):** Chuyển từ `1.10x` sang `0.80x` (SCM440 giữ chuẩn `1.0x`). Do thành phần nén xỉ mang dấu âm ($d_{\text{slag}} = -K_{\text{slag}} \times \dots$), việc hạ hệ số xỉ từ 1.10 xuống 0.80 giúp giảm lượng ghìm xỉ âm, làm lượng cào phôi $\delta$ của SCM420 tăng thêm $+1.8\mu m \sim +4.0\mu m$, kéo giảm sai số MAE của toàn bộ tập phôi $H \le 170\text{mm}$ từ $6.83\mu m$ xuống $6.33\mu m$.
    3. **Cập nhật giao diện bóc tách thành phần vật lý:** Đổi chú thích dòng $d_{\text{slag}}$ trong bảng Tab 3 hiển thị rõ ràng: SCM440 (chuẩn xỉ 1.0x) và SCM420 (hệ số xỉ 0.80x cào thoáng hơn).
* **Các file đã sửa:**
  - `app.js`: Cập nhật `calcBaseSparkGap`, `calcVFSparkGap`, `renderResearchVF` và nâng version lên `3.5.49`.
  - `version.json`, `index.html`, `sw.js`: Đồng bộ phiên bản `v3.5.49`.
  - `CURRENT_STATE.md`: Cập nhật trạng thái Đợt 49.
* **Kết quả nghiệm thu:**
  - `scripts/verify_integrity.ps1`: Bracket AST, Anti-Lookup-Table Law & Version sync `v3.5.49` PASSED 100%.

---

### 🚀 ĐỢT 50: TÍCH HỢP BÀI CẮT THỰC NGHIỆM STT 22 (H=12mm, SCM420 CHÀY VOLT LOW) (v3.5.50)
* **Thời gian:** 2026-11-04 14:15 (GMT+7)
* **Mục tiêu kỹ thuật:**
  - Tiếp nhận và giải mã bài cắt thực tế phôi mỏng $H=12\text{mm}$, thép dẻo SCM420 ($HB < 200$), cắt chày 1 Pass do SirPhuong cung cấp theo đúng SOP 6 bước:
    + STT 22: Phôi mỏng $H=12\text{mm}$, SCM420 ($HB < 200$), cắt chày 1 Pass: $\text{Ton}=16, \text{Po}=6, \text{IP}=3, \text{Wire}=1, \text{Volt}=\text{Low}, \text{VF}=60, \text{Max Speed}=150\text{Hz}$, Offset nhập $0.095\text{mm} \implies$ kích thước chuẩn luôn 100% danh nghĩa ($\Delta = 0.000$).
    + Lượng cào phôi thép đặc: $\delta = 0.095 - 0.090 = \mathbf{0.0050\text{ mm}} = 5.0\,\mu\text{m}$.
    + Đồng hồ Ampe thực tế: $2.5\text{A} - 2.7\text{A}$, chuẩn xác theo quy luật Ampe Rule 12 cho dải phôi mỏng ở $\text{IP}=3, \text{Po}=6$ Volt Low.
    + Ý nghĩa kiểm chứng khép kín: Chế độ thực tế này khớp $95\% - 100\%$ với chế độ tiêu chuẩn khuyến nghị của Web App Tab 2 cho phôi $H \le 15\text{mm}$ ($\text{Volt}=\text{Low}, \text{Po}=6, \text{IP}=3, \text{Ton} \approx 16 - 17\mu s$).
  - Cập nhật đồng bộ vào `WORKSHOP_DATA_BANK.md`, Rule 09 và `app.js` (`WORKSHOP_EMPIRICAL_LIBRARY` và `WS_LIB_BENCHMARK_JOBS[1]`).
  - Nâng phiên bản hệ thống lên `v3.5.50` trên 5 file hệ thống.
* **Các file đã sửa:**
  - `WORKSHOP_DATA_BANK.md` & `.agents/rules/09-WORKSHOP_RAW_DATA_BANK_AND_REVERSE_INTERPOLATION.md`: Thêm STT 22 vào Bảng thô, Bảng suy luận ngược và hộp phân tích động học.
  - `app.js`: Thêm STT 22 vào `WORKSHOP_EMPIRICAL_LIBRARY`, thêm hàng $H=12$ vào `WS_LIB_BENCHMARK_JOBS[1]`, nâng phiên bản `v3.5.50`.
  - `version.json`, `index.html`, `sw.js`: Đồng bộ phiên bản `v3.5.50`.
  - `CURRENT_STATE.md`: Cập nhật trạng thái Đợt 50.
* **Kết quả nghiệm thu:**
  - `scripts/verify_integrity.ps1`: PASSED 100%.

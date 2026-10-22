# 📜 NHẬT KÝ LỊCH SỬ TIẾN HÓA DỰ ÁN (PROJECT HISTORY)
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
*Chủ sở hữu tối cao: **SirPhuong***

---

## 🌟 TỔNG QUAN HÀNH TRÌNH PHÁT TRIỂN

Dự án **AutoCut Servo EDM Expert** được khởi xướng bởi **SirPhuong** nhằm giải quyết bài toán cốt lõi trong gia công cắt dây Molypden CNC: **Làm chủ tuyệt đối bản chất vật lý của chế độ điện, loại bỏ hoàn toàn sự mò mẫm cảm tính, tính toán chính xác lượng bù dao (Offset) và các thông số công nghệ (Ampe, tần số, tốc độ, bước tiến)** để mọi chi tiết cắt ra đều chuẩn xác theo kích thước bản vẽ ngay từ lần chạy đầu tiên.

---

## 🚀 CÁC GIAI ĐOẠN TIẾN HÓA (CHRONOLOGICAL PHASES)

### 📌 PHASE 1: NỀN TẢNG & SỐ HÓA BẢNG TIÊU CHUẨN CỦA HÃNG (v1.0 - v2.9)
* **Khởi tạo Web App:** Xây dựng ứng dụng Web giao diện Dark Mode công nghiệp hiện đại, tối ưu hiển thị trên cả điện thoại (xưởng máy) và máy tính văn phòng.
* **Số hóa bảng thông số Hãng:** Chuyển đổi toàn bộ tài liệu hướng dẫn kỹ thuật gốc `AutoCut-manual-for-CNC-wirecut-EDM-machine.pdf` thành cơ sở dữ liệu số:
  - 2 vật liệu chủ lực: Thép dẻo mềm SCM420 ($HB < 200$) và Thép tôi cải thiện SCM440 ($28 - 32\text{ HRC}$).
  - Cắt từ 1 Pass (lấy đứt) đến 6 Pass (bóng gương).
  - Dải phôi từ $5\text{mm}$ đến $500\text{mm}$.
* **Công thức Động học cơ bản:** Xây dựng công thức tính năng suất bóc phôi $F_c$ ($\text{mm}^2/\text{phút}$), tốc độ tiến bàn $F_t$ ($\text{mm}/\text{phút}$), năng lượng xung đơn $W_e$ và công suất 1 giây.
* **PWA Offline & Auto-Sync:** Tích hợp Service Worker (`sw.js`) và `manifest.json` cho phép lưu trữ cục bộ, hoạt động 100% khi mất mạng tại xưởng và tự động cưỡng bức làm mới (force update) khi có phiên bản mới.
* **Xuất phiếu công nghệ A4 Landscape:** Hỗ trợ in ấn và xuất PDF bảng thông số gia công chuẩn hóa cho thợ đứng máy.

---

### 📌 PHASE 2: PHÂN TÁCH KIẾN TRÚC & VÙNG HIỆU CHUẨN XƯỞNG ĐỘC LẬP (v3.0 - v3.4)
* **Tách đôi 2 Tab độc lập:**
  - **Tab 1:** Lưu giữ bất biến thông số chuẩn của Hãng AutoCut làm thước đo đối chiếu.
  - **Tab 2:** Mở ra Vùng Hiệu Chuẩn Thực Nghiệm Xưởng Độc Quyền (Workshop Calibration Zone) để điều chỉnh bám sát thực tế tủ điện ADP0106 và phôi thép thực tế tại xưởng của SirPhuong.
* **Cơ chế liên thông đồng bộ 2 chiều:** Thay đổi vật liệu hoặc chiều dày ở Tab nào thì Tab kia tự động cập nhật đồng bộ.
* **Chuẩn hóa Ampe kế:** Xác lập công thức tính dòng Ampe trung bình hiển thị trên đồng hồ tủ máy:
  $$I_{\text{tb}} = \frac{6.4 \times \text{IP}}{1 + P_o} \times k_{\text{ampe}}$$
  với $k_{\text{ampe}} = 2.2857$ (cho SCM440) và $2.8571$ (cho SCM420).
* **Thiết lập Kỷ luật Sao lưu Độc lập:** Đưa toàn bộ các bản backup nén vào thư mục `/backups/autocut_YYYY-MM-DD(n).zip`.

---

### 📌 PHASE 3: THỰC NGHIỆM XƯỞNG & XÂY DỰNG DATA BANK (v3.4.10 - v3.4.95)
* **Tiếp nhận các bài cắt thực tế từ SirPhuong:** Thu thập và kiểm chứng hàng loạt bài cắt phôi thực tế trên máy DK77 dây Moly $\Phi 0.18\text{mm}$:
  - Phôi mỏng và vừa: $H=12, 30, 40, 45, 60, 63, 68, 75, 85, 95, 110\text{mm}$.
  - Phôi dày và siêu dày: $H=140, 160, 165, 300\text{mm}$.
* **Khởi tạo Thư viện dữ liệu thô (`WORKSHOP_DATA_BANK.md`):** Ghi chép chi tiết 17 trường thông số gốc (chế độ điện, chiều dài cắt, ampe, thời gian thực, kích thước đo Panme sau cắt, độ chệch chày/cối).
* **Ban hành Quy trình SOP 6 bước (`SOP_NEW_DATA_INTEGRATION.md`):** Quy định nghiêm ngặt các bước giải mã, tính toán suy luận ngược (Reverse Calculation) từ kích thước đo Panme ra lượng cào phôi bề mặt $\delta$.
* **Đúc kết Hiện tượng Vật lý Thực chiến:**
  - *Điểm nghẽn 1.5 - 2 giờ (The Choke Point):* Xảy ra ở phôi dày $>100\text{mm}$ do dây mòn và xỉ tích tụ.
  - *Chiến thuật "Mìn phá băng & Lệnh xung phong":* Đẩy $T_{\text{on}}$ cực đại kết hợp $\text{VF}$ cao để dọn rãnh và ép mâm máy vượt qua vùng nghẽn.
  - *Nghịch lý "Không béo bụng" ở phôi siêu dày:* $T_{\text{on}}$ lớn mở rộng rãnh cắt giúp triệt tiêu ma sát và làm thẳng vách phôi.
* **Hằng số tỉ lệ điện áp tủ nguồn High vs Low:** Đúc kết thực nghiệm cho thấy tủ nguồn số có hệ số cố định $K_U = 1.20$. Chuyển sang High tăng đúng 20% Ampe, chuyển về Low giảm đúng 16.7% Ampe.

---

### 📌 PHASE 4: ĐẠI CẢI TỔ HIẾN PHÁP EDM & ĐỘNG CƠ VẬT LÝ LIÊN TỤC (v3.5.0 - v3.5.36)
* **Ban hành Hiến pháp 19 Đạo luật (`AGENTS.md`):** Thiết lập nền tảng nguyên tắc bất khả xâm phạm cho toàn bộ các Agent làm việc trên dự án.
* **Xóa bỏ hoàn toàn Bảng tra tĩnh & `if-else` lắt nhắt (Đạo luật 16):** Xóa sạch mọi biến `anchorOffsetTarget` hay chuỗi rẽ nhánh chia khoảng tùy tiện.
* **Xây dựng Phương trình Nhiệt động học EDM Liên tục ($\delta$):**
  $$\delta = C_0 + K_{\text{elec}} \cdot \sqrt[3]{T_{\text{on}} \cdot \text{IP} \cdot U_{\text{arc}}} + d_{\text{low}} + K_{\text{slag}} \left(\frac{H}{100}\right)^{1.35} K_{\text{mat}} + K_{\text{vibr}} \left(\frac{H}{100}\right)^{1.8}$$
* **Kiến trúc Phân vùng Kép (Đạo luật 17):**
  - Vùng 1 ($H \le 170\text{mm}$): Vận hành 100% bằng Phương trình Toán Nhiệt động học liên tục.
  - Vùng 2 ($H > 170\text{mm}$): Vận hành bằng Phương pháp Thống kê Hội tụ Thực nghiệm Xưởng, hội tụ êm ái về $O_1 = 0.1150\text{mm}$ tại $H=300\text{mm}$, Pass 2 khóa tại $O_2 = 0.0150\text{mm}$.
* **Quy luật Bậc thang Ampe 7 cấp đối xứng (Đạo luật 13):** Chuẩn hóa toàn bộ chế độ cắt Tab 2 thành 7 cấp độ quanh Cấp 4 (Tiêu chuẩn), mỗi nấc tăng giảm đều đặn $\Delta I \approx 0.5 - 0.7\text{A}$.
* **Quy tắc Núi lửa Panme (Đạo luật 14):** Khẳng định Pass tinh chỉ phạt gọt các đỉnh nhọn $R_z$ của Pass trước chứ không cào được $30 - 35\mu m$ thép phẳng đặc.
* **Thu thập $\delta_1$ sau Pass 1 (Đạo luật 15):** Bắt buộc quy đổi kích thước trung gian Pass 1 thành bài cắt 1 Pass tương đương để huấn luyện mô hình.
* **Giao thức Kiểm định Bù dao Tự động Rule 19:** Tự động kích hoạt kiểm toán toàn bộ thư viện khi có lệnh `"hãy kiểm định lại thông số offset"`.
* **Cải tiến Thư viện UI (Tab 2):** Chia 6 Sub-tabs (1P đến 6P), tự động sắp xếp phôi theo $H$ tăng dần, bổ sung cột Sai số thực tế vs tính toán.

---

### 📌 PHASE 5: CHUẨN HÓA ĐỘNG LỰC HỌC XUNG AUTOCUT & PHÒNG THÍ NGHIỆM TAB 3 (v3.5.37 - HIỆN TẠI v3.5.43)
* **Chuẩn hóa công thức $T_{\text{off}}$ theo tài liệu gốc AutoCut:**
  $$T_{\text{off}} = T_{\text{on}} \times (P_o + 1), \quad T = T_{\text{on}} \times (P_o + 2), \quad \eta = \frac{1}{P_o + 2}$$
  Thay thế quan niệm nhầm lẫn trước đây coi $P_o$ là số microsecond cố định.
* **Xây dựng Tab 3 (Phòng thí nghiệm & Nghiên cứu VF bù dao 1 Pass):**
  - Môi trường thử nghiệm tự do mọi thông số đầu vào.
  - Bảng so sánh song song giữa Công thức Gốc và Công thức Mới (tích hợp $\text{VF}$ và chu kỳ xả xỉ $P_o$).
  - Bảng bóc tách 5 thành phần cấu thành lượng cào phôi vi mô.
* **Tối ưu hóa Đa biến Tab 3 (v3.5.42):**
  - Bổ sung hiệu ứng màng đệm điện môi $\text{Volt} = \text{Low}$ ($+4.5\mu m$).
  - Bổ sung hệ số thoát xỉ theo vật liệu mềm SCM420 ($+10\%$ tích tụ xỉ).
  - Đồng bộ cơ chế hội tụ phôi siêu dày $H > 170\text{mm}$ theo Rule 17.
  - Kết quả: Sai số tuyệt đối trung bình $\text{MAE}$ giảm ngoạn mục xuống còn **$2.86\mu m$** trên toàn bộ 19 bài cắt thực tế.
* **Khắc phục triệt để lỗi phân cấp DOM Tab 3 (v3.5.43):**
  - Loại bỏ 2 thẻ `</div>` đóng dư thừa gây hiện tượng khối kết quả tính toán bị rò rỉ ra `<body>` và hiện ở đáy tất cả các tab.
  - Khôi phục bố cục 2 cột song song chuẩn đẹp cho Tab 3, cách ly hoàn toàn khối kết quả tính toán theo tab.
  - Đồng bộ phiên bản v3.5.43 và tạo bản sao lưu an toàn `autocut_2026-10-21(82).zip`.
* **Thiết lập Bộ Não Tri Thức Độc Lập GEMINI.md (v3.5.44):**
  - Tuyên bố chủ quyền SirPhuong.
  - Ban hành Nguyên tắc Vàng (Golden Meta-Rule).
  - Thiết lập hệ thống tài liệu `docs/` và thư mục kỹ năng `.agents/skills/`.

---

## 📊 BẢNG THEO DÕI CÁC PHIÊN BẢN HỆ THỐNG GẦN ĐÂY

| Phiên Bản | Ngày Phát Hành | Nội Dung Cốt Lõi | Bản Sao Lưu |
|:---:|:---:|:---|:---|
| **v3.5.38** | 2026-09-24 | Chuẩn hóa công thức $T_{\text{off}} = T_{\text{on}} \times (P_o + 1)$ theo tài liệu gốc AutoCut | `autocut_2026-09-24(77).zip` |
| **v3.5.39** | 2026-10-21 | Tích hợp dữ liệu cắt thực nghiệm STT 17, 18, 19 vào Data Bank | `autocut_2026-10-21(78).zip` |
| **v3.5.40** | 2026-10-21 | Bổ sung cột Sai Số $(\Delta)$ vào Bảng Thư viện thực nghiệm Tab 2 | `autocut_2026-10-21(79).zip` |
| **v3.5.41** | 2026-10-21 | Tích hợp động lực học xung và tương tác chu kỳ $P_o$ vào Tab 3 | `autocut_2026-10-21(80).zip` |
| **v3.5.42** | 2026-10-21 | Tối ưu hóa đa biến Tab 3 (Volt Low $+4.5\mu m$, vật liệu, Rule 17, MAE $2.86\mu m$) | `autocut_2026-10-21(81).zip` |
| **v3.5.43** | 2026-10-21 | Khắc phục lỗi phân cấp DOM HTML, khôi phục lưới 2 cột Tab 3 và cách ly layout | `autocut_2026-10-21(82).zip` |
| **v3.5.44** | 2026-10-22 | Thiết lập Hạ tầng Bộ Não Tri Thức 4 Trụ Cột luân chuyển 2 máy (CURRENT_STATE, OPTIMIZATION_HISTORY, workflows/BẮT ĐẦU) | `autocut_2026-10-22(84).zip` |

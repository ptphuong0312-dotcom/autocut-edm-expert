# 🤖 ANTIGRAVITY AGENT INSTRUCTIONS & CORE PRINCIPLES

## 🚨 MANDATORY CHECK BEFORE ANY ACTION (NGUYÊN TẮC TRONG NGUYÊN TẮC)
Before modifying ANY file or executing any logic, you MUST adhere to the following:

### 🛡️ 3 CÂU HỎI TRỌNG TÀI BẮT BUỘC TỰ VẤN TRƯỚC KHI VIẾT BẤT KỲ DÒNG CODE NÀO:
1. **Giải pháp của bạn là CÔNG THỨC TOÁN - VẬT LÝ LIÊN TỤC $\delta = f(H, \text{Ton}, \text{IP}, \text{Volt})$ hay là BẢNG TRA / CHIA KHOẢNG `if-else` THEO $H$ ĐỂ GÁN BÙ DAO?**
   👉 **BẮT BUỘC PHẢI LÀ CÔNG THỨC TOÁN - VẬT LÝ LIÊN TỤC.** Mọi hành vi dùng `if (H <= ...) offset = ...` hoặc `anchorOffsetTarget` đều là VI PHẠM PHÁP LUẬT NGHIÊM TRỌNG, BỊ CẤM TUYỆT ĐỐI!
2. **Dữ liệu thực nghiệm của người dùng dùng để làm gì?**
   👉 **CHỈ DÙNG ĐỂ TỐI ƯU HÓA HỆ SỐ CỦA CÔNG THỨC** $(C_0, K_{\text{elec}}, K_{\text{slag}}, K_{\text{vibr}}, K_{rz})$ hoặc nạp vào công thức để so sánh sai số đầu ra. TUYỆT ĐỐI KHÔNG biến dữ liệu người dùng thành mốc chia khoảng trong bảng tra!
3. **Bù dao Pass 2 ($O_2$) tính bằng gì?**
   👉 Bắt buộc theo Quy tắc Núi Lửa: $O_2 = R_{z1} + \delta_2$. Tuyệt đối không nhầm lẫn là Pass 2 cào được phôi phẳng đặc.

0. **READ ALL RULES AND SKILLS FIRST:**
   - You MUST deeply review all knowledge in `.agents/rules/` and `.agents/skills/` to ensure your proposed solution aligns with the established physics logic and project architecture before writing a single line of code.
1. **IMMUTABILITY OF STANDARD FORMULAS & PARAMETERS:**
   - The EDM physics formulas, standard pass tables (P1 to P6), standard speeds, and manufacturer baselines are **STRICTLY IMMUTABLE**.
   - NEVER alter these core equations or standard baselines unless explicitly commanded by the user.
2. **ISOLATED WORKSHOP CALIBRATION ZONE:**
   - Any workshop-specific calibration (matching actual factory cut times, ammeter readings, or specific workpiece offsets) must ONLY be adjusted inside the designated **Workshop Calibration Model / Table (Tab 2)**.
3. **BACKUP CONVENTION:**
   - Place all zipped backups in `/backups/autocut_YYYY-MM-DD(n).zip`.
4. **VERSION INTEGRITY & SYNTAX SAFETY:**
   - Keep versions synchronized across `app.js`, `index.html`, `style.css`, `version.json`, `sw.js`.
   - Always run syntax & bracket verification before any commit to prevent UI freeze (See `.agents/rules/05-PREVENTING_CODE_CORRUPTION_AND_UI_FREEZE.md`).
5. **CONTINUOUS EMPIRICAL CALIBRATION (VÒNG LẶP HỌC MÁY THỰC NGHIỆM):**
   - The user will routinely provide actual cutting results (e.g., actual dimensions, cutting time, surface finish) from their workshop.
   - The agent MUST actively use these empirical data points to recalibrate the offset, speed, and other outputs in the Workshop Calibration Model (Tab 2) to ensure the software converges on perfect accuracy for the user's specific machine conditions.
6. **STRICT IMMUTABILITY OF WORKSHOP RAW DATA BANK:**
   - Dữ liệu thô trong `WORKSHOP_DATA_BANK.md` và `.agents/rules/09-WORKSHOP_RAW_DATA_BANK_AND_REVERSE_INTERPOLATION.md` là tài sản thiêng liêng lưu trữ số liệu thực nghiệm gốc.
   - AI TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý SỬA ĐỔI nếu chưa có lệnh của người dùng. AI chỉ được ĐỌC để tính toán.
7. **UNIVERSAL MULTIVARIABLE HYBRID OFFSET ENGINE:**
   - AI KHÔNG ĐƯỢC CỐ ĐỊNH $\delta$ THEO $H$.
   - AI phải kết hợp Năng lượng xung đơn $E_p$, điện áp hồ quang $U_{arc}$ của Hãng với các điểm neo thực nghiệm cào phôi $\delta(H, \text{Ton}, \text{IP}, \text{Volt})$ của Xưởng (Xem `.agents/rules/10-UNIVERSAL_HYBRID_OFFSET_FORMULA.md`) để tính toán chính xác hệ số bù dao Offset cho bất kỳ độ dày $H$ và bất kỳ chế độ điện nào.
8. **MANDATORY 6-STEP SOP FOR NEW DATA INTEGRATION:**
   - Khi người dùng cung cấp dữ liệu cắt thực nghiệm mới, AI BẮT BUỘC phải thực thi đúng **Quy trình chuẩn 6 bước** quy định trong `.agents/rules/11-SOP_NEW_EMPIRICAL_DATA_INTEGRATION.md` và `SOP_NEW_DATA_INTEGRATION.md`.
9. **4-TIER STANDARD AMMETER PROGRESSION LAW:**
   - Trong Chế độ Tiêu chuẩn (Tab 2 Cấp 3), kim đồng hồ Ampe phải tuân thủ nghiêm ngặt 4 dải: $H(5-30) \rightarrow 2.0-2.5\text{A}$, $H(35-60) \rightarrow 2.5-3.0\text{A}$, $H(65-100) \rightarrow 3.0-3.5\text{A}$, $H>100 \rightarrow 3.5-4.5\text{A}$ (Xem `.agents/rules/12-STANDARD_AMMETER_PROGRESSION_LAW.md`).
10. **DATA BANK IS GROUND TRUTH BENCHMARK ONLY (DỮ LIỆU CHỈ DÙNG ĐỂ ĐỐI CHỨNG):**
   - Dữ liệu thực nghiệm cắt xưởng LÀ THƯỚC ĐO CHUẨN ĐỂ ĐỐI CHỨNG KẾT QUẢ TÍNH TOÁN CỦA HỆ THỐNG CÔNG THỨC TOÁN - VẬT LÝ.
   - AI TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý SUY DIỄN BỪA BÃI, không được dùng dữ liệu thực nghiệm để "suy ra cái này suy ra cái kia" gây sai lệch logic cốt lõi.
11. **RAW EMPIRICAL TRIAL DATA BENCHMARKING PROTOCOL:**
   - Dữ liệu người dùng gửi là dữ liệu cắt thử nghiệm thô (Offset nhập lúc cắt có thể là số thử nghiệm ngẫu nhiên). AI TUYỆT ĐỐI KHÔNG ĐƯỢC LẤY OFFSET NHẬP THỰC TẾ LÀM THƯỚC ĐO CHUẨN ĐỂ BẮT CHƯỚC THEO.
   - AI chỉ nạp thông số điện thực tế vào công thức lý thuyết để so sánh kết quả đầu ra, và GIỮ NGUYÊN HỆ THỐNG CÔNG THỨC GỐC BẤT BIẾN, không hiệu chỉnh gì cho đến khi có lệnh rõ ràng từ người dùng (Xem `.agents/rules/13-RAW_EMPIRICAL_DATA_BENCHMARKING_PROTOCOL.md`).
12. **CLOSED-LOOP EMPIRICAL VALIDATION PROTOCOL (VÒNG LẶP ĐỐI CHỨNG THỰC NGHIỆM KHÉP KÍN 95%):**
    - Người dùng đã ghim nguyên tắc: Kể từ nay, người dùng sẽ **dùng chính 95% bộ thông số do Web App xuất ra (Ton, Po, IP, Volt, VF, Wire, Offset $O_1, O_2$) để cắt thực tế trên máy và phản hồi lại kết quả đo kiểm**.
    - AI BẮT BUỘC PHẢI NHỚ RẰNG: Dữ liệu gửi về sau này là kết quả đo lường trực tiếp độ lệch thực tế của chính công thức do hệ thống tính toán ra, không phải thông số thử nghiệm ngẫu nhiên.
    - AI dùng kết quả này để đánh giá chính xác độ hội tụ của $\text{gap}_1, \text{gap}_2$ và làm căn cứ tinh chỉnh khi có lệnh từ người dùng (Xem `.agents/rules/14-CLOSED_LOOP_EMPIRICAL_VALIDATION_PROTOCOL.md`).
13. **HIGH-PRODUCTIVITY VS FINE-SURFACE MACHINING REGIMES (NGUYÊN TẮC GIA CÔNG NĂNG SUẤT VÀ BỀ MẶT MỊN):**
    - **Khi tăng năng suất:** Tuyệt đối không tùy tiện tăng $\text{IP}$ (sò) bừa bãi tránh sốc nhiệt làm đứt dây Moly $\Phi 0.18$. Ưu tiên hàng đầu là rút ngắn thời gian nghỉ $\text{Po}$ (Toff), tăng nhẹ $\text{Ton}$, và tăng điện áp theo dõi $\text{VF}$. Ở phôi dày $H>160\text{mm}$ khi $\text{IP}=6$ đã chạm trần, bắt buộc phải tăng năng suất bằng cách rút $\text{Po}$ xuống $7\sim 6$ và nâng $\text{VF}$ lên $64\sim 69$.
    - **Khi gia công bề mặt mịn:** Ưu tiên số 1 là hạ $\text{IP}$ xuống mức tối thiểu (1 đến 2 sò), rút ngắn $\text{Ton}$ ($8\sim 16\mu s$), chuyển sang $\text{Volt}=\text{Low}$, kéo dài $\text{Po}\ge 8\sim 15$, hạ $\text{VF}$ ($30\sim 40$) và tăng tốc độ dây $\text{Wire 2/3}$ để triệt tiêu đánh lửa thứ cấp, giúp bề mặt đạt độ bóng cao $Ra\le 1.0\sim 1.6\mu m$ (Xem `.agents/rules/15-PRODUCTIVITY_VS_SURFACE_FINISH_REGIMES.md`
    - **QUY LUẬT BẬC THANG AMPE 7 CẤP ĐỘ ĐỀU NHỊP (TAB 2):** Toàn bộ chế độ cắt Tab 2 được chuẩn hóa thành 7 cấp độ đối xứng quanh Cấp 4 (Tiêu chuẩn), mỗi nấc tăng/giảm đều đặn $\Delta I \approx 0.5 - 0.7\text{A}$ trên kim ampe. Cấp 1-3 chuyên cắt mịn ($Ra \le 1.2 - 2.2\mu m$), Cấp 4 chuẩn xưởng, Cấp 5-7 tăng tốc bứt phá năng suất.).
14. **MULTI-PASS VOLCANO PEAK VS SOLID EROSION ANTI-CONFUSION PRINCIPLE (NGUYÊN TẮC CHỐNG NHẦM LẪN NĂNG LỰC CÀO PASS TINH):**
    - **CẢNH BÁO TỐI THƯỢNG:** AI TUYỆT ĐỐI KHÔNG ĐƯỢC NHẦM LẪN rằng chế độ điện của Pass tinh (Pass 2, Pass 3... với Ton nhỏ, IP nhỏ) có thể tự thân bóc tách được $0.030 - 0.035\text{mm}$ trên bề mặt thép phẳng đặc. Khả năng cào thực chất của nó trên phôi phẳng chỉ là $\delta pprox 0.008 - 0.012\text{mm}$.
    - Lượng $0.035\text{mm}$ bóc đi trong Pass 2 (như thực tế phôi $H=85\text{mm}$) là do Pass 2 đã **phạt gọt các chóp đỉnh nhọn rỗng xốp của miệng núi lửa ($Rz_1$) do Pass 1 để lại** (vốn là phần nổi duy nhất mà thước Panme chạm tới), cộng với khe hở phóng điện nhỏ của Pass 2 ($ pprox 5 - 7\mu m$).
    - Khi phân tích và xây dựng chế độ cắt nhiều Pass (2 đến 6 Pass): Lượng chừa phôi $O_n$ luôn là tổ hợp: $O_n = R_{z(n-1)} + \delta_n$. Tuyệt đối không được lấy tổng lượng bóc tách đo được sau Pass tinh gán ghép thành năng lực cào phôi thép đặc (Xem `.agents/rules/03-SPARK_GAP_CAPABILITY.md`).
15. **MANDATORY PASS-1 SOLID EROSION (&delta;1) CAPTURE FOR 1-PASS CALIBRATION:**
    - **CHỈ THỊ CÔNG NGHỆ BẮT BUỘC:** Mỗi khi người dùng cung cấp dữ liệu cắt nhiều Pass có số đo trung gian sau Pass 1, AI **BẮT BUỘC PHẢI TÍNH TOÁN VÀ LƯU LẠI CHÍNH XÁC LƯỢNG BÀO MÒN THÉP ĐẶC CỦA PASS 1 ($\delta_1$)**:
      $$\delta_1 = \text{Khoảng cách mép dây Pass 1} - \text{Khoảng cách vách đo Panme Pass 1}$$
    - Thông số $\delta_1$ này là thước đo chuẩn xác về năng lực cào phôi thép đặc của chế độ điện phá thô ($\text{Ton}_1, \text{Po}_1, \text{IP}_1, \text{Volt}_1, H$).
    - AI **BẮT BUỘC PHẢI LƯU THÔNG SỐ NÀY VÀ QUY ĐỔI THÀNH OFFSET 1 PASS TƯƠNG ĐƯƠNG ($\text{Offset}_{\text{1P}} = 0.090 + \delta_1$)** vào Data Bank để dùng làm căn cứ thực nghiệm tinh chỉnh thuật toán tính toán cắt 1 Pass chuẩn xác tuyệt đối (Xem .agents/rules/11-SOP_NEW_EMPIRICAL_DATA_INTEGRATION.md).
16. **STRICT BAN ON STATIC LOOKUP TABLES & PIECEWISE IF-ELSE ANCHORS (ĐIỀU LUẬT BẤT KHẢ XÂM PHẠM: CẤM BẢNG TRA TĨNH VÀ NỘI SUY MẢNH IF-ELSE ĐỂ GÁN OFFSET/GAP):**
    - **Mệnh lệnh cốt lõi:** Mọi tính toán bù dao Offset ($O_1, O_2$) và lượng cào phôi $\delta$ trong Tab 2 **BẮT BUỘC PHẢI VẬN HÀNH BẰNG PHƯƠNG TRÌNH TOÁN - VẬT LÝ NHIỆT ĐỘNG HỌC LIÊN TỤC** $\delta = f(H, \text{Ton}, \text{IP}, \text{Volt})$ theo mô hình bộc phá xung đơn, màng điện môi Volt Low, áp lực nén xỉ lòng rãnh sâu $K_{\text{slag}}$ và rung võng cơ học dây Moly $K_{\text{vibr}}$.
    - **Cấm tuyệt đối:** TUYỆT ĐỐI CẤM tạo các biến `anchorOffsetTarget` hay chuỗi rẽ nhánh `if (H <= ...) ... else if ...` để gán bù dao Offset hoặc khe hở.
    - **Bản chất dữ liệu xưởng:** Dữ liệu thực nghiệm người dùng cung cấp (Data Bank) chỉ là tập mẫu huấn luyện/hiệu chuẩn (Benchmark Ground Truth). Bất kỳ khi nào có dữ liệu mới, AI BẮT BUỘC phải dùng phương pháp tối ưu hóa/hồi quy để tinh chỉnh các hệ số vật lý $(C_0, K_{\text{elec}}, K_{\text{slag}}, K_{\text{vibr}}, K_{rz})$, đảm bảo phần mềm luôn tính toán liên tục cho mọi giá trị độ dày $H \in [5, 300\text{mm}]$ và mọi cấp độ chiến lược, tuyệt đối không chắp vá chia khoảng.

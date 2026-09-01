# 🤖 ANTIGRAVITY AGENT INSTRUCTIONS & CORE PRINCIPLES

## 🚨 MANDATORY CHECK BEFORE ANY ACTION (NGUYÊN TẮC TRONG NGUYÊN TẮC)
Before modifying ANY file or executing any logic, you MUST adhere to the following:
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

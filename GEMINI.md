# 🧠 GEMINI.md - BẢN ĐỒ TRI THỨC MASTER & BẢNG ĐỊNH TUYẾN TÁC VỤ
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - SIRPHUONG
*Phiên bản kiến trúc: Anti-Amnesia Master Map v3.5.70*

---

## 👑 1. TUYÊN BỐ CHỦ QUYỀN & NGUYÊN TẮC VÀNG
* **Chủ sở hữu tối cao:** **SirPhuong** (ptphuong0312@gmail.com).
* **Định vị dự án:** Hệ thống Chuyên gia Tính toán & Tra cứu Chế độ Cắt Dây Molypden AutoCut Servo DK77, hoạt động offline 100% dạng PWA, luân phiên 2 máy (Ở Nhà ⟷ Công Ty qua OneDrive & GitHub).
* **NGUYÊN TẮC VÀNG (GOLDEN META-RULE):** Khi hoàn thành bất kỳ nhiệm vụ nào, AI **BẮT BUỘC TỰ ĐỘNG CẬP NHẬT** ngay: `CURRENT_STATE.md`, `docs/OPTIMIZATION_HISTORY.md`, tạo backup zip tại `backups/`, commit và push GitHub `main`.

---

## 🧭 2. BẢNG ĐỊNH TUYẾN TÁC VỤ (TASK ROUTING TABLE)
> [!IMPORTANT]
> **QUY TẮC ĐỌC TRƯỚC KHI SỬA (PRE-EDIT RE-READ):** Mỗi khi nhận tác vụ, AI BẮT BUỘC phải đọc đúng Sổ tay quy chuẩn tương ứng trong `docs/rules/` trước khi viết bất kỳ dòng code nào!

| Nhóm Tác Vụ | Sổ Tay Quy Chuẩn Bắt Buộc Đọc | File Mã Nguồn Duy Nhất Được Sửa | Công Cụ Gatekeeper Phải Chạy |
|:---|:---|:---|:---|
| **1. Tiếp nhận dữ liệu cắt mới** | `docs/rules/04_EMPIRICAL_DATA_GROUND_TRUTH.md` | `WORKSHOP_DATA_BANK.md` + `app.js` | `powershell -File scripts/verify_gatekeeper.ps1` |
| **2. Bù dao, Vật lý & Dòng Ampe** | `docs/rules/01_CORE_PHYSICS_AND_IMMUTABILITY.md`<br>`docs/rules/02_AMMETER_AND_KINEMATICS.md` | `app.js` | `powershell -File scripts/verify_gatekeeper.ps1` |
| **3. Cắt nhiều Pass (Multi-Pass)** | `docs/rules/03_MULTI_PASS_AND_VOLCANO_PEAKS.md` | `app.js` | `powershell -File scripts/verify_gatekeeper.ps1` |
| **4. Giao diện 2 Vùng, Copy & Mobile** | `docs/rules/05_UI_CONTRACTS_AND_EXPORT_SPECS.md` | `index.html`, `style.css`, `app.js` | `powershell -File scripts/verify_gatekeeper.ps1` |
| **5. PWA Offline, Cache & Luân chuyển** | `docs/rules/06_PWA_OFFLINE_AND_CROSS_MACHINE.md` | `sw.js`, `version.json` | `powershell -File scripts/verify_gatekeeper.ps1` |
| **6. Điều phối Đa Mô Hình & Cổng Chặn** | `docs/rules/07_MULTI_MODEL_ORCHESTRATION.md` | `GEMINI.md`, `AGENTS.md` | `powershell -File scripts/verify_gatekeeper.ps1` |

---

## 🏛️ 3. KIẾN TRÚC 2 TAB HIỆN HÀNH (SINGLE SOURCE OF TRUTH)
Web App hiện tại gồm đúng **2 Tab chức năng** (Các Tab Hãng và Thí nghiệm VF cũ đã bị loại bỏ):
1. **TAB 1: "Thông Số Cắt & Bù Dao Offset"** (`#tab-workshop`):
   - Bảng 2 Khung dọc: Khung 1 (Đầu vào 7 cột: `Pon`, `Poff`, `IP`, `V`, `VF`, `Wire`, Reset); Khung 2 (Động học 7 cột: `P`, `OFFSET` đầu tiên, `Fc thực`, `Fc máy H40`, `Hz`, `Ampe`, `Ra`).
   - Sửa Vùng 1 tự động cập nhật thời gian thực vào Vùng 2 (bao gồm cả Tần số Hz).
   - Thư viện thực nghiệm xưởng xẻ rãnh (1 Pass đến 6 Pass) kèm nút mũi tên `6 Chế Độ Cắt ▼`.
2. **TAB 2: "Kiến Thức EDM"** (`#tab-knowledge`):
   - Cẩm nang giáo trình toàn tập và bài giảng 7 bước tính toán động học thời gian thực.

---

## 🛡️ 4. 3 CÂU HỎI TRỌNG TÀI BẮT BUỘC TRƯỚC MỌI DÒNG CODE
1. **Giải pháp tuân thủ KIẾN TRÚC PHÂN VÙNG KÉP ($H \le 170\text{mm}$ TOÁN VẬT LÝ LIÊN TỤC và $H > 170\text{mm}$ THỐNG KÊ HỘI TỤ XƯỞNG) hay là BẢNG TRA / CHIA KHOẢNG LẮT NHẮT?**
   👉 Bắt buộc tuân thủ 100%. Tuyệt đối cấm tạo biến `anchorOffsetTarget` hay chuỗi if-else gán cứng mốc chia khoảng!
2. **Dữ liệu thực nghiệm của người dùng dùng để làm gì?**
   👉 CHỈ DÙNG ĐỂ TỐI ƯU HÓA HỆ SỐ CỦA CÔNG THỨC $(C_0, K_{\text{elec}}, K_{\text{slag}}, K_{\text{vibr}}, K_{rz})$ và làm mốc biên thống kê hội tụ cho $H > 170\text{mm}$.
3. **Bù dao Pass 2 ($O_2$) tính bằng gì?**
   👉 Bắt buộc theo Quy tắc Núi Lửa: $O_2 = R_{z1} + \delta_2$ ($H \le 170\text{mm}$) và khóa chặt tại $0.0150\text{mm}$ ($H > 170\text{mm}$) để tia lửa Pass 2 luôn bám sát vách.

---

## ⚡ 5. KHẨU LỆNH TỰ ĐỘNG
* **Khẩu lệnh "Bắt đầu":** Tự động đọc `CURRENT_STATE.md`, quét `git status` và báo cáo 3 gạch đầu dòng.
* **Khẩu lệnh "hãy kiểm định lại thông số offset":** Tự động chạy `powershell -File scripts/audit_spark_gap.ps1` xuất bảng kiểm toán MAE/RMSE tức thì.
* **Quy chuẩn bàn giao:** Bắt buộc chạy `powershell -File scripts/verify_gatekeeper.ps1` đạt **100% PASSED** trước khi báo cáo hoàn thành.

---

## 🤖 6. ĐIỀU PHỐI ĐA MÔ HÌNH (3 QUỸ QUOTA), 5 LUẬT SẮT & CỔNG CHẶN
> [!CAUTION]
> **CHỈ ĐÍCH DANH 1 MODEL + 1 MỨC (`Low/Medium/High/Extra`).** **Quỹ 1 (5h):** `3.8 Flash` chung quỹ `4 Hydrogen` (tránh `3.8 Flash High`). **Quỹ 2 (Tuần):** `4 Argon` + `Orchestrator (Argon)`. **Quỹ 3 (5h):** `Claude Opus/Sonnet 5.5` (kèm `<Dự phòng>` Gemini/Argon). Chi tiết tại `docs/rules/07_MULTI_MODEL_ORCHESTRATION.md`.

### 🛡️ 5 Luật Sắt Bắt Buộc Ở Mọi Lượt Chat:
1. **Every-Turn Model Gate:** Đầu mỗi câu trả lời, tự đọc **Model + Mức thật** từ system context (cấm copy log cũ); ghi `[Model: Đạt chuẩn — <Model + Mức thật>]` nếu đúng tầng.
2. **Hard Stop (Cổng Chặn Cứng):** Nếu đang chạy `3.8 Flash` (mọi mức) hoặc mức `Low` của `Sonnet/Opus/Hydrogen/Argon` mà nhận tác vụ chạm code lõi / toán vật lý / kiến trúc / debug sâu / UI `>= 50 dòng` chưa có Blueprint (chưa có lệnh `"Làm luôn"`): **DỪNG NGAY TRƯỚC KHI SỬA FILE**, nêu `<Model đang chạy>` + đề xuất đích danh `1 <Model + Mức chuẩn>` (+ `<Dự phòng>` nếu là Claude), chờ `"Làm đi"` / `"Làm luôn"`.
3. **Subagent Quét Thô & Chống Attention Dilution:** Trên `Hydrogen/Argon/Sonnet/Opus`, cấm tự đọc hàng loạt file lớn (`WORKSHOP_DATA_BANK.md`, `OPTIMIZATION_HISTORY.md`, `RESEARCH_*.md`, CSV/log) hay grep rộng trên luồng chính ➔ đẩy sang subagent `flash` (`3.8 Flash Low`). Giữ tiền tố cố định ở đầu để tận dụng Implicit Caching.
4. **Zero-Loss Handoff (Hết Quota Giữa Chừng):** Khi sắp/đã chạm trần quota, xuất ngay **3 dòng bàn giao** (`1. Việc đang làm dở | 2. File vừa sửa/đang dở | 3. Bước tiếp theo`) kèm đích danh `<Model + Mức dự phòng>` để SirPhuong chuyển model và gõ `"Làm tiếp"`.
5. **Multi-Task Split & Scope Lock:** Tin nhắn nhiều tầng việc ➔ tự bóc tách phần đúng tầng vs phần bàn giao. Giao `Sonnet 5.5 (High)` bắt buộc khóa rõ danh sách file được phép sửa.

### 📊 Ma Trận Phân Công Riêng Cho AutoCut EDM (`v2.0`):
| Đầu Việc Thực Tế Của Dự Án | Chỉ Định Chính (1 Model + 1 Mức) | Dự Phòng Hết Quota |
|:---|:---|:---|
| Quét thô Data Bank / History / `RESEARCH_*.md`, lọc log, grep rộng (Subagent) | `Gemini 3.8 Flash (Low)` | `Claude Sonnet 5.5 (Low)` |
| Khẩu lệnh hằng ngày (`Bắt đầu`, `kiểm định offset`), `verify_gatekeeper.ps1`, `backup.ps1`, git | `Gemini 3.8 Flash (Medium)` | `Gemini 4 Hydrogen (Medium)` |
| Sửa 1 file rõ ngữ cảnh, thi công `< 50 dòng` khi **ĐÃ CÓ Blueprint**, nạp bài đã tính sẵn | `Gemini 4 Hydrogen (Medium)` | `Claude Sonnet 5.5 (Medium)` |
| Đọc/tóm tắt tài liệu PDF AutoCut hoặc quy chuẩn *(chỉ đọc, cấm sửa code)* | `Claude Sonnet 5.5 (Low)` | `Gemini 3.8 Flash (Medium)` |
| Frontend UI sạch `>= 50 dòng` (Tab 1 2-vùng, Mobile chips, Print A4), script `.ps1/.py` | `Claude Sonnet 5.5 (Medium)` | `Gemini 4 Hydrogen (High)` |
| Đối soát UI ⟷ Engine (Live Reactivity, Clipboard `V66`), Regex/DOM khó *(khóa file)* | `Claude Sonnet 5.5 (High)` | `Gemini 4 Hydrogen (High)` |
| Thử nghiệm nhánh phụ, refactor module phụ ngoài hằng số lõi, test JSDOM/Node | `Gemini 4 Hydrogen (Medium)` | `Claude Sonnet 5.5 (Medium)` |
| Lõi Toán-Vật Lý ($\delta$, $R_z$ Núi Lửa, Ampe, $F_c$, $H>170$), SOP 6 bước, code đa file | `Gemini 4 Hydrogen (High)` | `Claude Sonnet 5.5 (High)` |
| Dự phòng chiến lược khi Quỹ 2 & 3 cạn; thuật toán/phụ thuộc chồng chéo cực khó, self-audit | `Gemini 4 Hydrogen (Extra)` | `Claude Opus 5.5 (Medium)` |
| Debug ca khó đa tầng (UI + Engine + PWA/SW) & Phản biện giả thiết vật lý trước khi code | `Claude Opus 5.5 (Medium)` | `Gemini 4 Argon (Medium)` |
| Nghiệm thu chéo độc lập (audit code/công thức của Gemini/Sonnet) & Bug sync/timing khó | `Claude Opus 5.5 (High)` | `Gemini 4 Argon (High)` |
| Đọc ảnh UI/sơ đồ/3D phức tạp, bản đồ phụ thuộc đa thư mục, phản biện thiết kế vừa–lớn | `Gemini 4 Argon (Medium)` | `Claude Opus 5.5 (Medium)` |
| Thiết kế Blueprint kiến trúc mới từ số 0 & Đại tu mô hình toán lõi toàn cục | `Gemini 4 Argon (High)` | `Claude Opus 5.5 (High)` |
| Đại dự án 1 phiên (vừa thiết kế kiến trúc vừa code & test hàng chục file cùng lúc) | `Orchestrator (Argon)` | `Gemini 4 Hydrogen (High)` |

⛔ **CẤM / TRÁNH / BỎ QUA:** Cấm `Opus Low`, `Argon Low`, `Hydrogen Low` (code/logic), `Sonnet Low` (sửa code); Tránh `3.8 Flash High`; Loại bỏ `GPT-OSS 120B`.

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

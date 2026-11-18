# SỔ TAY QUY CHUẨN 07: ĐIỀU PHỐI ĐA MÔ HÌNH (3 QUỸ QUOTA × TỪNG MỨC) & ZERO-LOSS HANDOFF
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - SIRPHUONG
*Đồng bộ theo Hồ sơ Năng lực Model v2.0 (19/11/2026)*

---

## 🎯 1. KIẾN TRÚC 3 QUỸ QUOTA ĐỘC LẬP & KINH TẾ HỌC TOKEN
1. **Đúng việc — Đúng Model — Đúng Mức (`Low / Medium / High / Extra`):** Giao việc theo đúng sở trường kỹ thuật và hiệu quả chi phí/quota.
2. **Chỉ đích danh 1 `<Model + Mức>`:** Mọi phân công và cảnh báo chuyển model phải ghi đích danh đúng **1 Model + 1 Mức** (cấm ghi chung chung kiểu `Med/High`). Mọi đầu việc Claude BẮT BUỘC kèm **1 `<Model + Mức dự phòng>`** bên Gemini/Argon.
3. **Bản đồ 3 Quỹ Quota thực tế (Google AI Pro):**
   - **[QUỸ 1 — Hồi 5 giờ] Tốc độ & Thực thi:** `Gemini 3.8 Flash` (`Low/Medium/High`) **DÙNG CHUNG QUỸ** với `Gemini 4 Hydrogen` (`Low/Medium/High/Extra`).
     + Đường cong chi phí `Hydrogen`: `Low (~$0.29)` → `Medium (~$0.80, x2.7)` → `High (~$1.87, x6.4)` → `Extra (~$3.16, x10.9)`.
     + **Quy luật vàng:** Tuyệt đối **tránh dùng `3.8 Flash (High)`** cho code/debug (Index ~35.5 < `Hydrogen Medium` ~41, TTFT trễ ~13s, chậm hơn `Hydrogen High` tới 2.5x). Chỉ dùng `3.8 Flash (Low/Medium)` cho Subagent quét thô và tác vụ lặp; mọi việc code chuyển sang `Hydrogen`.
   - **[QUỸ 2 — Hồi THEO TUẦN 7 ngày, khan hiếm nhất] Kiến trúc & Điều phối:** `Gemini 4 Argon` (`Low/Medium/High`) + `Orchestrator (Argon)`.
     + Không bật cho việc vặt/đọc log/sửa nhỏ. `Argon (High)` chốt xong Blueprint → trả quyền thi công code về `Hydrogen (High)` / `Sonnet 5.5`.
   - **[QUỸ 3 — Hồi 5 giờ, dung lượng nhỏ] Đối tác Anthropic:** `Claude Opus 5.5` (`$4/$20`, 128K output) + `Claude Sonnet 5.5` (`$2/$10`, 128K output). Loại bỏ 100% `GPT-OSS 120B` (thuần text, yếu tiếng Việt, phase-out 18/11/2026).
   - **[Khóa gói Pro]:** `Gemini 4 Carbon` (Index 59–60, bảo mật đỉnh cao) chỉ mở khi nâng lên gói Ultra.

---

## 📊 2. MA TRẬN PHÂN CÔNG ĐÍCH DANH CHO DỰ ÁN AUTOCUT EDM

| STT | Nhóm Công Việc Thực Tế Của Dự Án | Chỉ Định Chính (1 Model + 1 Mức) | Dự Phòng Khi Hết Quota (1 Model + 1 Mức) |
|:---:|:---|:---|:---|
| **1** | Quét thô tài liệu lớn (`WORKSHOP_DATA_BANK.md`, `OPTIMIZATION_HISTORY.md`, `RESEARCH_*.md`), grep rộng, lọc log cho Subagent (`flash`/`flash_lite`) | `Gemini 3.8 Flash (Low)` | `Claude Sonnet 5.5 (Low)` *(chỉ đọc)* |
| **2** | Khẩu lệnh lặp hằng ngày (`"Bắt đầu"`, `"hãy kiểm định lại thông số offset"`), chạy `verify_gatekeeper.ps1`, `audit_spark_gap.ps1`, `backup.ps1`, cập nhật `CURRENT_STATE.md`, Git | `Gemini 3.8 Flash (Medium)` | `Gemini 4 Hydrogen (Medium)` |
| **3** | Sửa lỗi cục bộ 1 file rõ ngữ cảnh, viết hàm/script `< 50 dòng` **khi ĐÃ CÓ Blueprint** (nạp bài đã tính sẵn, sửa text Tab 2, đồng bộ `version.json`/`sw.js`) | `Gemini 4 Hydrogen (Medium)` | `Claude Sonnet 5.5 (Medium)` |
| **4** | Đọc/tóm tắt tài liệu kỹ thuật AutoCut PDF hoặc sổ tay quy chuẩn *(chỉ đọc, cấm sửa code)* | `Claude Sonnet 5.5 (Low)` | `Gemini 3.8 Flash (Medium)` |
| **5** | Frontend UI sạch `>= 50 dòng` (Tab 1 2-vùng, Mobile chips `10..200mm`, Print A4), viết/refactor script `.ps1`/`.py` kỷ luật cú pháp cao, refactor 1–2 file ngoài toán lõi | `Claude Sonnet 5.5 (Medium)` | `Gemini 4 Hydrogen (High)` |
| **6** | Đối soát chéo Frontend ⟷ Engine (Live Reactivity, `CLIPBOARD_EXPORT_CONTRACT_V66`), Regex/Parser/Validator phức tạp, xuất báo cáo/file rất dài (`128K output`) *(khóa rõ danh sách file)* | `Claude Sonnet 5.5 (High)` | `Gemini 4 Hydrogen (High)` |
| **7** | Thử nghiệm nhánh phụ, refactor module phụ không đụng hằng số gốc, viết/chạy test JSDOM/Node (`scripts/test_app.js`) | `Gemini 4 Hydrogen (Medium)` | `Claude Sonnet 5.5 (Medium)` |
| **8** | **Ngựa chiến 85–90% việc kỹ thuật:** Lõi Toán-Vật Lý EDM ($\delta$, $R_z$ Núi Lửa, Ampe 4 dải, $F_c$, $H>170$), SOP 6 bước, code đa file, vòng lặp test → sửa → re-test | `Gemini 4 Hydrogen (High)` | `Claude Sonnet 5.5 (High)` |
| **9** | **Dự phòng chiến lược** khi Quỹ 3 cạn 0% & Quỹ 2 sắp cạn tuần; hoặc thuật toán/phụ thuộc chồng chéo cực khó, tự kiểm toán (self-audit) *(cấm dùng cho việc vặt)* | `Gemini 4 Hydrogen (Extra)` | `Claude Opus 5.5 (Medium)` |
| **10** | Debug ca khó đa tầng (UI State ⟷ Engine ⟷ PWA/SW khi model khác sửa tái phát) & Phản biện thiết kế cốt lõi, Root-Cause Analysis | `Claude Opus 5.5 (Medium)` | `Gemini 4 Argon (Medium)` |
| **11** | **Nghiệm thu chéo độc lập** (*LLM-as-a-Judge* kiểm toán code/công thức do Gemini/Sonnet viết) & Bug đồng bộ/timing cực khó *(lọc log trước qua Subagent)* | `Claude Opus 5.5 (High)` | `Gemini 4 Argon (High)` |
| **12** | Đọc ảnh UI phức tạp / sơ đồ / không gian 3D / video, lập bản đồ phụ thuộc đa thư mục, phản biện thiết kế vừa–lớn | `Gemini 4 Argon (Medium)` | `Claude Opus 5.5 (Medium)` |
| **13** | **Thiết kế Blueprint kiến trúc mới từ số 0** & Đại tu mô hình toán lõi toàn cục (xong Blueprint trả quyền code về `Hydrogen High`) | `Gemini 4 Argon (High)` | `Claude Opus 5.5 (High)` |
| **14** | **Đại dự án 1 phiên** (vừa thiết kế kiến trúc mới vừa code & test đồng loạt hàng chục file, tiết kiệm ~24% quota) | `Orchestrator (Argon)` | `Gemini 4 Hydrogen (High)` |

### ⛔ DANH SÁCH CẶP MODEL BỊ CẤM / TRÁNH / BỎ QUA
* `Claude Opus 5.5 (Low)`: **Cấm tuyệt đối** (đốt Quỹ 3 đắt đỏ mà bóp mất suy luận sâu).
* `Gemini 4 Argon (Low)`: **Cấm tuyệt đối** (trừ Quỹ Tuần nhưng yếu hơn `Hydrogen Medium`).
* `Gemini 4 Hydrogen (Low)`: **Cấm dùng** cho viết script/sửa logic điều kiện (chỉ dùng lọc/gắn nhãn log, format thô).
* `Gemini 3.8 Flash (High)`: **Tránh dùng** cho code/debug (Index 35.5 < `Hydrogen Medium` 41, TTFT ~13s, ăn chung Quỹ 1).
* `Claude Sonnet 5.5 (Low)`: **Cấm sửa code/script** (chỉ đọc/tóm tắt nhẹ).
* `GPT-OSS 120B`: **Loại bỏ 100%** (thuần text, yếu tiếng Việt, ăn chung Quỹ 3, phase-out từ 18/11/2026).

---

## 🛡️ 3. SÁU LUẬT VẬN HÀNH & BẢO VỆ NGỮ CẢNH
1. **Every-Turn Model Gate:** Đầu mỗi câu trả lời, tự đọc **Model + Mức thật** từ ngữ cảnh hệ thống (cấm copy log cũ); mở đầu bằng `[Model: Đạt chuẩn — <Model + Mức thật>]` nếu đúng tầng.
2. **Cổng Chặn Cứng (`Hard Stop`):** Nếu đang chạy `3.8 Flash` (mọi mức) hoặc mức `Low` của `Sonnet / Opus / Hydrogen / Argon` mà nhận tác vụ chạm code lõi / toán vật lý / kiến trúc / debug sâu / UI `>= 50 dòng` chưa Blueprint (chưa có `"Làm luôn"`): **DỪNG NGAY TRƯỚC KHI SỬA FILE**, nêu `<Model đang chạy>` + đề xuất **đích danh 1 `<Model + Mức chuẩn>`** (+ `<Dự phòng>` nếu gợi ý Claude), chờ `"Làm đi"` / `"Làm luôn"`.
3. **Luật Subagent Quét Thô & Chống Attention Dilution:** Trên `Hydrogen / Argon / Sonnet / Opus`, tuyệt đối không tự đọc hàng loạt file lớn hay grep rộng trên luồng chính ➔ đẩy sang Subagent `flash` (`Gemini 3.8 Flash Low`) để bảo vệ bể 1M (nhất là bể chung Input+Thinking+Output của Gemini 4).
4. **Kỷ Luật Caching & Chống Scope Creep:**
   - Gemini 4 chỉ dùng **Implicit Caching** (≥ 4K tiền tố cố định ở đầu, dữ liệu động ở cuối; cấm gọi Explicit Cache API). Claude 5.5 cần làm mới ngữ cảnh file khi chuyển pha tránh *stale state*.
   - Khi giao `Claude Sonnet 5.5 (High)`, **bắt buộc ghi rõ danh sách file được phép sửa** và cấm sửa lan ngoài phạm vi.
5. **Giao thức Hết Quota Giữa Chừng (`Zero-Loss Handoff`):** Khi sắp/đã chạm trần quota, xuất ngay **3 dòng bàn giao** kèm **đích danh `<Model + Mức dự phòng>`**:
   ```text
   [ZERO-LOSS HANDOFF -> Đổi sang: <Model + Mức dự phòng>]
   1. Việc đang làm dở: ...
   2. Các file vừa sửa / đang dở: ...
   3. Bước tiếp theo cần làm (sau khi SirPhuong gõ "Làm tiếp"): ...
   ```
6. **Luật Đa Việc (`Multi-Task Split`):** Tin nhắn chứa nhiều việc khác tầng ➔ tự bóc tách: làm phần đúng tầng (hoặc giao subagent), phần vượt tầng đóng gói sẵn bàn giao chờ chuyển đúng model.

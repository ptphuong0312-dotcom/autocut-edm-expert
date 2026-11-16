# SỔ TAY QUY CHUẨN 07: ĐIỀU PHỐI ĐA MÔ HÌNH (5 MODEL × 3 MỨC) & ZERO-LOSS HANDOFF
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - SIRPHUONG

---

## 🎯 1. NGUYÊN TẮC CỐT LÕI
1. **Đúng việc — Đúng Model — Đúng Mức (`Low / Medium / High`):** Giao việc theo đúng sở trường kỹ thuật để đạt chất lượng cao nhất, không chia dè sẻn.
2. **Chỉ đích danh 1 `<Model + Mức>`:** Mọi phân công và cảnh báo chuyển model phải ghi đích danh đúng **1 Model + 1 Mức** (cấm ghi chung chung kiểu `Med/High` hay `Claude/Gemini`).
3. **3 Quỹ Model độc lập của SirPhuong:**
   - **Quỹ Gemini:** `Gemini 3.8 Flash` (`Low/Medium/High`), `Gemini 4 Hydrogen` (`Low/Medium/High`).
   - **Quỹ Claude & GPT** *(hạn mức ít)*: `Claude Sonnet 5.5` (`Low/Medium/High`), `Claude Opus 5.5` (`Low/Medium/High`). *(Bỏ qua `GPT-OSS 120B` vì dùng chung pool nhỏ của Claude)*.
   - **Quỹ Argon:** `Gemini 4 Argon` (`Low/Medium/High`).
4. **Dự phòng bắt buộc (`Zero-Loss Handoff`):** Mọi đầu việc giao cho Claude BẮT BUỘC kèm **đích danh 1 `<Model + Mức dự phòng>`** bên Gemini/Argon để nối tiếp ngay khi hết quota.

---

## 📊 2. MA TRẬN PHÂN CÔNG ĐÍCH DANH CHO DỰ ÁN AUTOCUT EDM

| STT | Nhóm Công Việc Thực Tế Của Dự Án | Chỉ Định Chính (1 Model + 1 Mức) | Dự Phòng Khi Hết Quota (1 Model + 1 Mức) |
|:---:|:---|:---|:---|
| **1** | Quét thô tài liệu lớn (`WORKSHOP_DATA_BANK.md`, `OPTIMIZATION_HISTORY.md`, `RESEARCH_*.md`, PDF text), grep rộng `app.js` / `.agents/rules/` (đặc biệt qua Subagent) | `Gemini 3.8 Flash (Low)` | `Claude Sonnet 5.5 (Low)` *(chỉ đọc)* |
| **2** | Khẩu lệnh lặp hằng ngày (`"Bắt đầu"`, `"hãy kiểm định lại thông số offset"`), chạy `verify_gatekeeper.ps1`, `audit_spark_gap.ps1`, `backup.ps1`, cập nhật `CURRENT_STATE.md`, `git commit/push` | `Gemini 3.8 Flash (Medium)` | `Gemini 4 Hydrogen (Medium)` |
| **3** | Thi công code/UI khi **ĐÃ CÓ Blueprint chi tiết**, hoặc sửa nhỏ gọn `< 50 dòng` ít rủi ro (nạp bài cắt vào `WS_LIB_BENCHMARK_JOBS` sau khi tính xong, sửa text Tab 2, đồng bộ `version.json`/`sw.js`) | `Gemini 3.8 Flash (High)` | `Claude Sonnet 5.5 (Medium)` |
| **4** | Đọc/tóm tắt tài liệu kỹ thuật AutoCut PDF hoặc sổ tay quy chuẩn *(chỉ đọc, cấm sửa code)* | `Claude Sonnet 5.5 (Low)` | `Gemini 3.8 Flash (Medium)` |
| **5** | Phát triển/sửa Frontend UI sạch `>= 50 dòng` (Bảng 2 vùng Tab 1, Responsive Mobile chips `10..200mm`, Print A4 `@media print`), viết/sửa script `.ps1`/`.py`, refactor 1–2 file ngoài toán lõi | `Claude Sonnet 5.5 (Medium)` | `Gemini 3.8 Flash (High)` |
| **6** | Đối soát chéo Frontend ⟷ Physics Engine (Live Reactivity Vùng 1→2, `SPEC-LOCK: CLIPBOARD_EXPORT_CONTRACT_V66`, regex AST, DOM phức tạp), hoặc dự phòng nóng cho `Hydrogen High` ở logic code | `Claude Sonnet 5.5 (High)` | `Gemini 4 Hydrogen (High)` |
| **7** | Thử nghiệm nhánh phụ, refactor module phụ không đụng hằng số gốc, viết/chạy test JSDOM/Node (`scripts/test_app.js`) | `Gemini 4 Hydrogen (Medium)` | `Claude Sonnet 5.5 (Medium)` |
| **8** | Xử lý **Lõi Toán - Vật Lý EDM** ($\delta$, $R_z$ Núi Lửa Multi-Pass, Ampe 4 dải, $F_c/F_t$, vùng $H>170\text{mm}$), tối ưu hệ số, thực thi **SOP 6 bước** tiếp nhận dữ liệu mới & backtest đồng bộ 22+ bài đa file | `Gemini 4 Hydrogen (High)` | `Claude Sonnet 5.5 (High)` |
| **9** | Debug ca khó đa tầng (UI State ⟷ Engine ⟷ PWA Service Worker/Offline) & **Phản biện giả thiết vật lý/thiết kế** (bắt lỗi ngụy biện thống kê đa cộng tuyến, kiểm tra vi phạm Rule 16/17 trước khi code) | `Claude Opus 5.5 (Medium)` | `Gemini 4 Argon (Medium)` |
| **10** | **Nghiệm thu chéo độc lập** (kiểm toán code/công thức do Gemini/Sonnet viết để tránh tự chấm bài mình) & Sửa bug đồng bộ/timing cực khó | `Claude Opus 5.5 (High)` | `Gemini 4 Argon (High)` |
| **11** | Phản biện nhanh bản vẽ thiết kế hoặc thuật toán mức trung bình (ước lượng $F_c$, Pass 3–6, luồng UX mới) | `Gemini 4 Argon (Medium)` | `Claude Opus 5.5 (Medium)` |
| **12** | **Thiết kế khung kiến trúc mới từ số 0** (xuất Blueprint chi tiết cho Tab/tính năng lớn mới) & **Đại tu mô hình toán lõi toàn cục** (vd: Tab 3 v2) | `Gemini 4 Argon (High)` | `Claude Opus 5.5 (High)` |

### ⛔ DANH SÁCH CẶP MODEL BỊ CẤM / BỎ QUA
* `Claude Opus 5.5 (Low)`: **Cấm tuyệt đối** (lãng phí quỹ ít mà mất khả năng suy luận sâu).
* `Gemini 4 Argon (Low)`: **Cấm tuyệt đối**.
* `Gemini 4 Hydrogen (Low)`: **Cấm dùng** cho code và phân tích.
* `Claude Sonnet 5.5 (Low)`: **Cấm sửa logic lõi** (chỉ đọc/tóm tắt nhẹ).
* `GPT-OSS 120B`: **Bỏ qua hoàn toàn** (dùng chung pool nhỏ với Claude).

---

## 🛡️ 3. NĂM LUẬT SẮT VẬN HÀNH & CỔNG CHẶN MODEL

1. **Every-Turn Model Gate (Kiểm tra mỗi lượt):** Đầu mỗi câu trả lời, AI tự đọc đúng **Model + Mức thật** đang chạy từ ngữ cảnh hệ thống (cấm copy nhãn từ file log cũ). Nếu đúng tầng công việc, mở đầu bằng `[Model: Đạt chuẩn — <Model + Mức thật>]`.
2. **Cổng Chặn Cứng (`Hard Stop`):** Nếu đang chạy `Gemini 3.8 Flash` (mọi mức) hoặc mức `Low` của `Sonnet / Opus / Hydrogen / Argon` mà nhận tác vụ chạm code lõi / toán vật lý / kiến trúc / debug sâu / UI phức tạp `>= 50 dòng` chưa có Blueprint (khi SirPhuong chưa gõ `"Làm luôn"`): **DỪNG NGAY TRƯỚC KHI SỬA BẤT KỲ FILE NÀO**, chỉ rõ `<Model đang chạy>` và đề xuất **đích danh 1 `<Model + Mức chuẩn>`** (+ `<Model dự phòng>` nếu gợi ý Claude), chờ xác nhận `"Làm đi"` hoặc `"Làm luôn"`.
3. **Luật Subagent Quét Thô:** Khi chạy trên `Hydrogen / Argon / Sonnet / Opus`, tuyệt đối không tự đọc hàng loạt file lớn hay grep rộng trên luồng chính ➔ bắt buộc đẩy sang subagent `flash` hoặc `flash_lite`.
4. **Giao thức Hết Quota Giữa Chừng (`Zero-Loss Handoff`):** Khi sắp/đã chạm trần quota (đặc biệt trên Claude), xuất ngay **3 dòng bàn giao** kèm tên **đích danh `<Model + Mức dự phòng>`**:
   ```text
   [ZERO-LOSS HANDOFF -> Đổi sang: <Model + Mức dự phòng>]
   1. Việc đang làm dở: ...
   2. Các file vừa sửa / đang dở: ...
   3. Bước tiếp theo cần làm (sau khi SirPhuong gõ "Làm tiếp"): ...
   ```
5. **Luật Đa Việc (`Multi-Task Split`):** Nếu 1 tin nhắn chứa nhiều việc khác tầng, tự bóc tách: thi công phần đúng tầng của mình (hoặc đẩy quét thô cho subagent), phần vượt tầng đóng gói sẵn bàn giao chờ chuyển đúng model.

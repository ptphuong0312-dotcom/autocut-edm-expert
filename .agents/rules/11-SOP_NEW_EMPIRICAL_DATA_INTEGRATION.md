# QUY TRÌNH CHUẨN (SOP) TIẾP NHẬN & TÍNH TOÁN DỮ LIỆU CẮT THỰC TẾ MỚI
# (STANDARD OPERATING PROCEDURE FOR NEW WORKSHOP EMPIRICAL DATA INTEGRATION)

---

## 🚨 MỤC ĐÍCH & PHẠM VI ÁP DỤNG
Tài liệu này xác lập **Quy trình chuẩn 6 bước bắt buộc** dành cho mọi AI Agent khi người dùng gửi thêm dữ liệu cắt thực tế mới từ xưởng.
Mục tiêu: Đảm bảo AI **hiểu sâu sắc bản chất vật lý, không bao giờ quên nguyên tắc, không làm sai lệch dữ liệu gốc và cập nhật chính xác 100% vào bộ não tính toán của phần mềm**.

---

## BƯỚC 0: ĐỌC LẠI CÁC TÀI LIỆU BẮT BUỘC TRƯỚC KHI LÀM BẤT KỲ ĐIỀU GÌ
Trước khi viết dù chỉ 1 dòng code, AI **BẮT BUỘC PHẢI ĐỌC LẠI 5 TÀI LIỆU SAU**:

1. **[AGENTS.md](file:///F:/Antigravity/Cat%20Day%20EDM%201/AGENTS.md):** Đọc lại 7 điều luật cốt lõi (Bảo toàn dữ liệu thô, cơ chế lai tạo Hãng + Xưởng, an toàn cú pháp).
2. **[09-WORKSHOP_RAW_DATA_BANK_AND_REVERSE_INTERPOLATION.md](file:///F:/Antigravity/Cat%20Day%20EDM%201/.agents/rules/09-WORKSHOP_RAW_DATA_BANK_AND_REVERSE_INTERPOLATION.md):** Đọc lại cấu trúc 17 cột dữ liệu thô và nguyên tắc bất biến của Thư viện.
3. **[10-UNIVERSAL_HYBRID_OFFSET_FORMULA.md](file:///F:/Antigravity/Cat%20Day%20EDM%201/.agents/rules/10-UNIVERSAL_HYBRID_OFFSET_FORMULA.md):** Đọc lại phương trình phi tuyến đa biến $\delta(H, \text{Ton}, \text{IP}, \text{Volt})$ — **Nhớ rằng tại cùng độ dày $H$, thay đổi chế độ điện sẽ cho ra lượng cào $\delta$ khác nhau!**
4. **[04-EMPIRICAL_DATA_ANCHORS.md](file:///F:/Antigravity/Cat%20Day%20EDM%201/.agents/rules/04-EMPIRICAL_DATA_ANCHORS.md) & [06-OFFSET_CAUSALITY_PRINCIPLE.md](file:///F:/Antigravity/Cat%20Day%20EDM%201/.agents/rules/06-OFFSET_CAUSALITY_PRINCIPLE.md):** Đọc lại nguyên lý nhân quả Offset và công thức bù trừ chày/cối từ số đo thực tế.
5. **[05-PREVENTING_CODE_CORRUPTION_AND_UI_FREEZE.md](file:///F:/Antigravity/Cat%20Day%20EDM%201/.agents/rules/05-PREVENTING_CODE_CORRUPTION_AND_UI_FREEZE.md):** Đọc lại quy tắc an toàn cú pháp, ngoặc nhọn `{ }` và quy trình kiểm thử AST stack.

---

## BƯỚC 1: TIẾP NHẬN & GIẢI MÃ DỮ LIỆU GỐC CỦA NGƯỜI DÙNG
Khi người dùng gửi ảnh hoặc bảng số liệu cắt mới, AI trích xuất đầy đủ 17 trường thông số:
1. **Số lần cắt:** 1 Lần (hoặc 2 Lần, P1, P2)
2. **Vật liệu:** Tên thép & độ cứng (VD: SCM440 28-32HRC, SCM420 HB<200, SKD11...)
3. **Chiều dày phôi $H$:** (mm)
4. **Thời gian phát xung $\text{Ton}$:** ($\mu s$)
5. **Thời gian nghỉ xung $\text{Toff}$ / $\text{Po}$:**
6. **Cấp công suất $\text{IP}$:** (Số sò/công tắc dòng đỉnh)
7. **Trạng thái dây $\text{Wire}$:** (1 = Dây mới/chuẩn, 2 = Dây cũ)
8. **Điện áp $\text{Volt}$:** (High = 75-80V / Low = 50-55V)
9. **Điện áp theo dõi $\text{VF}$:** (Tốc độ ăn phôi)
10. **Tần số giới hạn $\text{Max Speed}$:** (Hz)
11. **Offset Nhập Test ban đầu:** (mm — Thông số người thợ gõ vào máy)
12. **Thời gian cắt thực tế:** (Phút/Giờ)
13. **Chiều dài đường cắt $L$:** (mm)
14. **Đồng hồ Ampe thực tế:** (A)
15. **Tốc độ thực tế đo được:** (mm²/phút)
16. **Kích thước đo sau cắt:** (Nguyên văn ghi chú đo kiểm của thợ: chày to/nhỏ hơn $\Delta$ mm, cối lớn/nhỏ hơn $\Delta$ mm, hay chuẩn luôn)

---

## BƯỚC 2: TÍNH TOÁN SUY LUẬN NGƯỢC (REVERSE CALCULATION)
Quy đổi kết quả đo thực tế sang **OFFSET CHUẨN XƯỞNG** và **LƯỢNG CÀO PHÔI BỀ MẶT $\delta$**:

1. **Quy tắc Bù dao Chuẩn:**
   - **Cắt lấy Chày (biên dạng ngoài):**
     $$\text{Offset Chuẩn} = \text{Offset Nhập Test} - \frac{\Delta}{2} \quad \text{(Nếu chày to hơn } \Delta\text{)}$$
     $$\text{Offset Chuẩn} = \text{Offset Nhập Test} + \frac{\Delta}{2} \quad \text{(Nếu chày nhỏ hơn } \Delta\text{)}$$
   - **Cắt lấy Cối (biên dạng trong):**
     $$\text{Offset Chuẩn} = \text{Offset Nhập Test} - \frac{\Delta}{2} \quad \text{(Nếu cối lớn hơn } \Delta\text{)}$$
     $$\text{Offset Chuẩn} = \text{Offset Nhập Test} + \frac{\Delta}{2} \quad \text{(Nếu cối nhỏ hơn } \Delta\text{)}$$
   - **Kích thước chuẩn luôn:** $\text{Offset Chuẩn} = \text{Offset Nhập Test}$.

2. **Tính Lượng cào phôi bề mặt (Spark Gap $\delta$):**
   $$\delta = \text{Offset Chuẩn} - R_{\text{dây}} = \text{Offset Chuẩn} - 0.090\text{mm}$$

---

## BƯỚC 3: CẬP NHẬT VÀO NGÂN HÀNG DỮ LIỆU THÔ (RAW DATA BANK)
1. Thêm dòng dữ liệu mới vào cuối bảng trong 2 file:
   - [WORKSHOP_DATA_BANK.md](file:///F:/Antigravity/Cat%20Day%20EDM%201/WORKSHOP_DATA_BANK.md)
   - [09-WORKSHOP_RAW_DATA_BANK_AND_REVERSE_INTERPOLATION.md](file:///F:/Antigravity/Cat%20Day%20EDM%201/.agents/rules/09-WORKSHOP_RAW_DATA_BANK_AND_REVERSE_INTERPOLATION.md)
2. Gán số thứ tự tiếp theo (STT 15, STT 16...).
3. **TUYỆT ĐỐI KHÔNG** thay đổi các STT cũ.

---

## BƯỚC 4: NẠP VÀO BỘ NÃO TÍNH TOÁN & GIAO DIỆN APP.JS
1. **Cập nhật mảng `WORKSHOP_EMPIRICAL_LIBRARY` trong `app.js`:**
   - Lưu trữ bài cắt mới với đầy đủ cả 2 trường:
     - `enteredOffset`: Giá trị nhập test ban đầu.
     - `standardOffset`: Giá trị Offset chuẩn đã hiệu chỉnh.
     - `sparkGap`: Lượng cào $\delta$.
     - `notes`: Ghi chú công thức giải thích phép tính bù trừ.
2. **Cập nhật mảng điểm neo `anchors` trong hàm `generateWorkshopRows()` của `app.js`:**
   - Bổ sung hoặc làm mịn mốc $H$ mới vào `const anchors`.
3. **Kiểm tra Phương trình lai tạo trong Rule 10:**
   - Dùng điểm mới để tái kiểm chứng phương trình $\delta(H, \text{Ton}, \text{IP}, \text{Volt})$ đảm bảo sai số toàn cục $\le 0.003\text{mm}$.

---

## BƯỚC 5: KIỂM THỬ AN TOÀN, ĐÓNG GÓI BẢN SAO LƯU & DEPLOY
1. **Chạy Syntax Checker:** Chạy script Python quét AST matcher đảm bảo `SYNTAX OK` (không lệch ngoặc `{ }` hay dấu `,`).
2. **Đồng bộ Phiên bản:** Tăng số hiệu phiên bản (VD: `3.4.74 -> 3.4.75`) trên cả 4 file: `version.json`, `sw.js`, `index.html`, `app.js`.
3. **Tạo Backup Zip:** Tạo bản nén `backups/autocut_YYYY-MM-DD(n).zip`.
4. **Git Commit & Push:** Đẩy commit lên GitHub / Vercel qua Dulwich.

---

## BƯỚC 6: BÁO CÁO MINH BẠCH & TRÌNH BÀY BẢNG ĐỐI SOÁT CHO NGƯỜI DÙNG
Trình bày báo cáo rõ ràng gồm 3 phần:
1. **Bảng đối chiếu thông số:** Số liệu người dùng gửi $\rightarrow$ Phép tính bù trừ $\rightarrow$ Offset Chuẩn & $\delta$.
2. **Bảng kết quả chạy thử Tab 2:** Xuất kết quả tính toán của phần mềm tại các độ dày $H$ tương ứng để người dùng kiểm chứng.
3. **Mã commit & Tên file backup:** Để người dùng yên tâm dữ liệu đã được bảo toàn vĩnh viễn.

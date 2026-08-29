# 🚨 BÀI HỌC KINH NGHIỆM & QUY TRÌNH XỬ LÝ LỖI ĐƠ WEB APP (UI FREEZE PREVENTION SOP)

Tài liệu này ghi lại chi tiết nguyên nhân gốc rễ và quy trình chẩn đoán - xử lý sự cố "Nút bấm / Giao diện không phản hồi" để AI không bao giờ lặp lại lỗi này.

---

## 1. NGUYÊN NHÂN GỐC RỄ (ROOT CAUSES)

### 🔴 Nguyên nhân 1: Lỗi Cú Pháp (Syntax Error) do Regex can thiệp chuỗi JSON
*   **Hiện tượng:** Khi dùng Regex để tìm/thay thế hoặc chèn dữ liệu JSON vào biến `WORKSHOP_EMPIRICAL_LIBRARY` trong `app.js`, chuỗi dễ bị thừa/thiếu dấu ngoặc `]`, `}` hoặc phẩy `,`.
*   **Hậu quả:** Trình duyệt gặp lỗi `SyntaxError: Unexpected token ']'`, toàn bộ file `app.js` bị dừng biên dịch ngay lập tức. Hàm `initApp()` không chạy được ➔ Không có sự kiện bấm nút nào được gán ➔ Web App đơ 100%.

### 🔴 Nguyên nhân 2: Trùng lặp mã nhúng trong `index.html`
*   **Hiện tượng:** `index.html` từng chứa một khối `<script>` inline khổng lồ thay vì trỏ đến `app.js`.
*   **Hậu quả:** Sửa `app.js` nhưng web vẫn chạy file nhúng cũ trong `index.html`.

### 🔴 Nguyên nhân 3: Kẹt Cache Service Worker / Trình duyệt
*   **Hiện tượng:** Trình duyệt điện thoại giữ lại bản cache cũ của Service Worker hoặc nạp file `app.js` cũ mà không chịu tải bản mới.

---

## 2. QUY TRÌNH PHÒNG TRÁNH BẮT BUỘC (MANDATORY PREVENTION RULES)

1.  **Tuyệt đối không dùng Regex chắp vá JSON thô:** Khi cần sửa dữ liệu mảng, luôn dùng Python đọc/ghi đối tượng JSON chuẩn xác (`json.loads`, `json.dumps`), ghép nối hoàn chỉnh rồi mới ghi đè vào biến JavaScript.
2.  **Chạy kiểm tra cú pháp (Syntax Validation Check) TRƯỚC KHI COMMIT:**
    *   Bắt buộc phải chạy script kiểm tra cân bằng tất cả dấu ngoặc `()`, `{}`, `[]` và backtick `` ` `` trên toàn bộ `app.js`.
    *   Chỉ khi kết quả là `PERFECT! ZERO SYNTAX ERRORS!` mới được phép commit và push.
3.  **Luôn gắn Cache-Buster cho thẻ script trong `index.html`:**
    *   Cấu trúc chuẩn: `<script src="app.js?v=X.X.X"></script>`
4.  **Phòng thủ Null cho tất cả các Event Listener:**
    *   Mọi câu lệnh gán sự kiện phải luôn bọc trong điều kiện: `if (element) element.addEventListener(...)`.

---

## 3. QUY TRÌNH XỬ LÝ KHẨN CẤP KHI GẶP LỖI ĐƠ WEB APP (EMERGENCY RECOVERY SOP)

Nếu người dùng phản ánh "ấn nút không có phản hồi":
*   **Bước 1:** Chạy ngay script kiểm tra cú pháp `app.js` để định vị ký tự / dấu ngoặc gây lỗi (Dùng script đếm ngoặc và tìm token lỗi).
*   **Bước 2:** Kiểm tra `index.html` xem thẻ `<script src="app.js?v=...">` có đồng bộ phiên bản với `version.json` và `sw.js` không.
*   **Bước 3:** Sửa lỗi cú pháp, tăng số phiên bản (Bump version), cập nhật Service Worker và push ngay bản vá lên GitHub.

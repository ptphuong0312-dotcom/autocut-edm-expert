# KIẾN TRÚC DỰ ÁN AUTOCUT EDM EXPERT

Dự án này là một Progressive Web App (PWA) tĩnh (Static HTML/JS/CSS), hoạt động hoàn toàn Offline trên trình duyệt, không cần máy chủ Node.js hay Database.

## Cấu trúc File Cốt lõi
*   **`index.html`**: Giao diện người dùng. Chứa cấu trúc DOM (Tab 1, Tab 2, Khung nhập liệu, Modal).
*   **`app.js`**: Trái tim của ứng dụng.
    *   Chứa `STRATEGY_CONFIGS` (11 cấp độ chiến lược hãng).
    *   Chứa `WORKSHOP_EMPIRICAL_LIBRARY` (Cơ sở dữ liệu các bài test xưởng).
    *   Toàn bộ thuật toán Động lực học (Tính toán Ton, Toff, IP, Điện áp, Tốc độ cắt).
    *   Hàm `render()` cập nhật DOM tự động khi thay đổi trạng thái (State).
*   **`style.css`**: CSS tùy chỉnh, thiết kế theo phong cách Dark Mode chuyên nghiệp.
*   **`sw.js` & `manifest.json`**: Cấu hình PWA để cài đặt ứng dụng xuống màn hình chính (Điện thoại/PC) và chạy Offline.
*   **`version.json`**: Chứa phiên bản (VD: `{"version": "3.4.8"}`). Trình duyệt sẽ fetch file này mỗi khi mở lại app để so sánh với `sw.js`. Nếu khác nhau, nó ép tải lại toàn bộ cache để cập nhật phiên bản mới.

## Quy tắc Cập nhật & Deploy
Bất cứ khi nào Agent thay đổi code HTML/JS/CSS, bắt buộc phải:
1.  Sửa code.
2.  Tăng số phiên bản ở tất cả 4 file: `index.html` (chỗ `v=...`), `sw.js` (biến `CACHE_NAME`), `version.json`, và `app.js` (nếu có hardcode).
3.  Tạo bản sao lưu `.zip` vào thư mục `backups/`.
4.  Git commit (Không cần Git push, Vercel sẽ tự động deploy nếu có webhooks, hoặc chạy local).

## Thư mục Docs & Scripts
*   **`docs/`**: Chứa các tài liệu phân tích kỹ thuật (Physics, Calibration).
*   **`scripts/`**: Chứa các file Python/JS dùng để Agent tự động sửa code hoặc test code bằng JSDOM (`test_app.js`).

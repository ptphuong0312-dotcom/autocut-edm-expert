# SỔ TAY QUY CHUẨN 06: PWA OFFLINE 100% & ĐỒNG BỘ LUÂN CHUYỂN 2 MÁY
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - SIRPHUONG

---

## ⚡ 1. QUY CHUẨN SERVICE WORKER & BẢO ĐẢM CACHE OFFLINE 100%
* **Bảo đảm không có tệp tin phantom (Lỗi 404):** Mảng `ASSETS_TO_CACHE` trong `sw.js` chỉ được chứa các tệp tin thực tế đang tồn tại trong dự án:
  ```javascript
  const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './version.json',
    './manifest.json',
    './AGENTS.md',
    'https://fonts.googleapis.com/...google fonts...'
  ];
  ```
  Tuyệt đối không đưa các tệp tin giả định hoặc đã xóa vào danh sách này.
* **Đồng bộ CACHE_NAME:** Mỗi khi nâng cấp phiên bản `CURRENT_VERSION` trong `app.js` và `version.json`, bắt buộc phải đồng bộ `CACHE_NAME = 'autocut-vX.Y.ZZ'` trong `sw.js`.
* **Cơ chế tự động dọn dẹp (Cache Cleanup):** Khi Service Worker mới kích hoạt (`activate`), nó tự động xóa toàn bộ các cache cũ và gọi `clients.claim()` để người dùng nhận ngay bản cập nhật mới nhất.

---

## 🔄 2. QUY CHUẨN LUÂN CHUYỂN 2 MÁY (MÁY Ở NHÀ ⟷ MÁY CÔNG TY)
SirPhuong làm việc luân phiên trên 2 máy tính thông qua **OneDrive** và **GitHub**:
1. **Lịch sử chat là cục bộ:** Lịch sử chat của AI chỉ lưu trên từng máy tính, KHÔNG TỰ ĐỘNG ĐỒNG BỘ giữa 2 máy.
2. **Tệp tin trong dự án là trường tồn:** Mọi tri thức, trạng thái, bài học kinh nghiệm và quy tắc bắt buộc phải được lưu trực tiếp vào các file dự án (`CURRENT_STATE.md`, `docs/OPTIMIZATION_HISTORY.md`, `GEMINI.md`).
3. **Quy chuẩn kết thúc buổi làm việc:**
   - Cập nhật đầy đủ `CURRENT_STATE.md`.
   - Tạo file nén sao lưu độc lập tại `backups/autocut_YYYY-MM-DD(n).zip`.
   - Commit Git với thông điệp rõ ràng và push lên GitHub nhánh chính (`main`).
4. **Quy chuẩn khởi động buổi làm việc mới:** Khi mở phiên làm việc mới trên bất kỳ máy nào và nhận khẩu lệnh **"Bắt đầu"**, AI lập tức đọc `CURRENT_STATE.md`, kiểm tra Git và báo cáo 3 gạch đầu dòng ngắn gọn.

---

## 🛡️ 3. TÍNH ĐỘC LẬP VỀ MÔI TRƯỜNG CHẠY (ZERO EXTERNAL DEPENDENCY)
* Không được giả định rằng mọi máy tính của SirPhuong đều đã cài đặt sẵn Node.js hoặc Python trong PATH.
* Mọi công cụ kiểm tra chất lượng tự động cốt lõi (Gatekeeper, AST check, DOM check, audit offset) bắt buộc phải có phiên bản chạy bằng **PowerShell thuần túy (`.ps1`)** sử dụng .NET Framework mặc định của Windows.

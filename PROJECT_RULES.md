# PROJECT RULES & ARCHITECTURE

## 1. MỤC TIÊU DỰ ÁN (PROJECT GOAL)
AutoCut EDM Expert là một ứng dụng Web (PWA) chạy offline, đóng vai trò như "Trí tuệ nhân tạo chuyên gia" cho máy cắt dây CNC (Fast Wire EDM, DK77 series, tủ nguồn AutoCut / HL / HF).
Ứng dụng có 2 nhiệm vụ chính:
- **Tab 1 (Chuẩn Hãng):** Tính toán chính xác các thông số vật lý (Ton, Toff, Tốc độ cắt, Khe hở, Bù dao) dựa trên công thức điện động lực học chính hãng (Xem `tailieu.txt`).
- **Tab 2 (Hiệu Chỉnh Xưởng):** Tự động tinh chỉnh, hãm tốc độ, bù hao mòn cơ khí để thích nghi với tình trạng thực tế của máy móc tại xưởng người dùng (Machine Learning Empirical Loop).

## 2. QUẢN LÝ KIẾN THỨC (KNOWLEDGE MANAGEMENT)
Để không bao giờ quên các thỏa thuận, nguyên lý và công thức, hệ thống kiến thức được chia làm các file Markdown tại thư mục `/docs`:
- **`docs/ARCHITECTURE.md`**: Cấu trúc file, cách thức hoạt động của PWA và quy trình nâng cấp phiên bản (Version Bumping).
- **`docs/WORKSHOP_CALIBRATION.md`**: Ghi chép chi tiết nguyên lý vật lý (Servo Hunting, Secondary Sparking) và các điểm Neo (Anchor Points) để nội suy Hz và Offset cho xưởng.
- **`tailieu.txt`**: Cẩm nang công thức Toán học EDM (Chuẩn hãng).

*Mỗi khi có dữ liệu cắt thực tế mới từ người dùng, Agent phải cập nhật vào `app.js` (Thư viện Thực nghiệm) và điều chỉnh lại thuật toán nội suy trong `docs/WORKSHOP_CALIBRATION.md`.*

## 3. QUY TRÌNH SỬA CODE & CẬP NHẬT (AGENT WORKFLOW)
1. **Tuyệt đối không phá vỡ UI/UX hiện tại:** HTML/CSS đã được thiết kế tinh chỉnh, chỉ can thiệp vào logic tính toán trong `app.js` trừ khi user yêu cầu đổi giao diện.
2. **Cập nhật Phiên bản (Bắt buộc):** Do PWA dùng Service Worker để cache cực mạnh. Nếu sửa code mà không tăng version thì người dùng F5 sẽ không thấy tác dụng.
   - Khi sửa code, luôn tăng version đồng bộ tại: `index.html` (tag script `v=x.x`), `sw.js` (CACHE_NAME), và `version.json`.
3. **Sao lưu (Backup):** Luôn zip toàn bộ mã nguồn (trừ `node_modules`, `.git`) vào thư mục `backups/` trước khi sửa những logic phức tạp.

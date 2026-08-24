# 📜 NGUYÊN TẮC CỐT LÕI DỰ ÁN (NGUYÊN TẮC TRONG NGUYÊN TẮC)
> **Dự án:** Hệ thống Chuyên gia Tính toán & Tra cứu Chế độ cắt AutoCut Wire-Cut EDM Servo  
> **Phiên bản:** v2.9.0+  
> **Cập nhật lần cuối:** 2026-08-25  

---

## ⛔ 1. NGUYÊN TẮC BẤT BIẾN SỐ 1 (NGUYÊN TẮC TRONG NGUYÊN TẮC)
1. **Tính Bất Biến Của Chuẩn Hãng:**
   - Toàn bộ các công thức toán học, thuật toán động lực học, bộ thông số các Pass (P1 - P6), dữ liệu vật liệu (SCM420, SCM440, Cu, Al) và chế độ tiêu chuẩn hãng trên Web App **LÀ CỐ ĐỊNH 100% VÀ BẤT BIẾN**.
   - **TUYỆT ĐỐI KHÔNG ĐƯỢC THAY ĐỔI** bất kỳ công thức hay thông số gốc nào trên Web App nếu chưa có lệnh rõ ràng từ người dùng.
2. **Quy Định Hiệu Chỉnh Thực Tế Xưởng:**
   - Mọi điều chỉnh, khớp số liệu thực nghiệm theo điều kiện máy móc/tủ điện tại xưởng của người dùng **CHỈ ĐƯỢC PHÉP THỰC HIỆN TRÊN BẢNG HIỆU CHỈNH THỰC TẾ XƯỞNG (`Workshop Calibration Table`)**.
   - Bảng này hoạt động độc lập và không được làm sai lệch cơ sở dữ liệu gốc của Hãng.
3. **Quy Trình Bắt Buộc Khi Nhận Lệnh Từ Người Dùng:**
   - Bất kỳ khi nào Agent thực hiện lệnh từ người dùng, **BẮT BUỘC PHẢI ĐỌC LẠI NGUYÊN TẮC NÀY ĐẦU TIÊN** để đảm bảo không vi phạm vùng an toàn của hệ thống.

---

## 🔄 2. QUY TRÌNH QUẢN LÝ MÃ NGUỒN & SAO LƯU (WORKFLOW)
1. **Quy tắc Lưu Trữ Backup:**
   - Tất cả các bản backup nén zip phải được lưu vào thư mục riêng: `/backups/`.
   - Định dạng tên file backup: `autocut_YYYY-MM-DD.zip`, `autocut_YYYY-MM-DD(1).zip`, `autocut_YYYY-MM-DD(2).zip`... theo đúng số thứ tự tạo trong ngày.
2. **Quy trình Deploy & Cập nhật Phiên bản:**
   - Nâng số phiên bản `CURRENT_VERSION` đồng bộ trong: `app.js`, `index.html`, `style.css`, `version.json`, `sw.js`.
   - Commit & Push lên GitHub Private Repository: `ptphuong0312-dotcom/autocut-edm-expert`.
   - Deploy trực tiếp lên Vercel Production: `https://autocut-edm-expert.vercel.app`.

---

## 📊 3. ĐỊNH DẠNG & CẤU HÌNH GIAO DIỆN
1. **Bảng So Sánh (`Comparison Table`):**
   - Cột 1: Tiêu chí / Ký hiệu viết tắt (Có chế độ ẩn/hiện phương ngang, mặc định là **ẨN / Thu gọn ký hiệu**).
   - Cột 2: `Chế độ nhập` (Mặc định lấy từ cấu hình: **"Bề Mặt Mịn / Ưu Tiên Phẳng (Cấp 5/11)"**).
   - Cột 3: `Standard` (Chế độ Chuẩn Hãng).
   - Mặc định bảng so sánh: **HIỂN THỊ LUÔN**.
2. **Bảng Thực Tế Xưởng (`Workshop Calibration Table`):**
   - Chỉ gồm 1 cột thông số thực tế xưởng.
   - Có nút ẩn/hiện, mặc định là **ẨN**.
3. **Bài Giảng Tính Toán:**
   - Nằm toàn bộ bên **Tab 2 (Kiến thức chuyên sâu EDM)** để đảm bảo giao diện Tab 1 gọn gàng, trực quan.

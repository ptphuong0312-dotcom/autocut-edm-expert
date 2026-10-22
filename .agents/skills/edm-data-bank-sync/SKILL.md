---
name: edm-data-bank-sync
description: Quy trình tiếp nhận, giải mã, tính toán suy luận ngược (Reverse Calculation) và tích hợp các bài cắt thực nghiệm mới từ SirPhuong vào Data Bank và Web App theo đúng SOP 6 bước chuẩn hóa.
---

# KỸ NĂNG TIẾP NHẬN & TÍCH HỢP DỮ LIỆU THỰC NGHIỆM MỚI (SOP 6 BƯỚC)

Kỹ năng này được sử dụng khi **SirPhuong** cung cấp thêm thông số hoặc hình ảnh kết quả cắt thực tế mới từ xưởng.

---

## 📋 QUY TRÌNH 6 BƯỚC CHUẨN BẮT BUỘC

### Bước 0: Đọc Lại Các Tài Liệu Bắt Buộc
Trước khi viết code, AI đọc lại:
- `GEMINI.md`
- `AGENTS.md` (Đạo luật 6, 8, 10, 11, 14, 15, 16, 17)
- `WORKSHOP_DATA_BANK.md`

### Bước 1: Trích Xuất 17 Trường Thông Số Gốc
Trích xuất đủ 17 thông số từ ghi chép của SirPhuong:
1. Số lần cắt (1 Pass hay nhiều Pass)
2. Vật liệu & độ cứng (SCM440 28-32HRC, SCM420 HB<200...)
3. Chiều dày $H$ (mm)
4. $T_{\text{on}}$ ($\mu s$)
5. $T_{\text{off}}$ ($P_o$)
6. Cấp công suất $\text{IP}$
7. Trạng thái dây Wire (1: Dây mới, 2: Dây cũ)
8. Điện áp Volt (High / Low)
9. Điện áp theo dõi $\text{VF}$
10. Tần số giới hạn Max Speed (Hz)
11. Offset Nhập Test ban đầu (mm)
12. Thời gian cắt thực tế
13. Chiều dài đường cắt $L$ (mm)
14. Đồng hồ Ampe thực tế (A)
15. Tốc độ thực tế đo được ($\text{mm}^2/\text{phút}$)
16. Kích thước đo sau cắt (chày/cối to/nhỏ hơn bao nhiêu $\Delta$)
17. Ghi chú hiện tượng (vết núi lửa, rãnh cắt...)

### Bước 2: Tính Toán Suy Luận Ngược (Reverse Calculation)
- **Cắt lấy Chày:**
  $$\text{Offset Chuẩn} = \text{Offset Nhập Test} - \frac{\Delta}{2} \quad (\text{nếu chày to hơn } \Delta)$$
  $$\text{Offset Chuẩn} = \text{Offset Nhập Test} + \frac{\Delta}{2} \quad (\text{nếu chày nhỏ hơn } \Delta)$$
- **Cắt lấy Cối:**
  $$\text{Offset Chuẩn} = \text{Offset Nhập Test} + \frac{\Delta}{2} \quad (\text{nếu cối lớn hơn } \Delta)$$
  $$\text{Offset Chuẩn} = \text{Offset Nhập Test} - \frac{\Delta}{2} \quad (\text{nếu cối nhỏ hơn } \Delta)$$
- **Lượng cào phôi thực tế:**
  $$\delta_{\text{thực}} = \text{Offset Chuẩn} - R_{\text{dây}} = \text{Offset Chuẩn} - 0.090\text{mm}$$
- **Nếu là bài cắt nhiều Pass:** Bắt buộc thu thập $\delta_1$ sau Pass 1 theo Đạo luật 15 để quy đổi thành bài cắt 1 Pass tương đương.

### Bước 3: Ghi Nhận Vào Data Bank
- Cập nhật nguyên văn và đầy đủ chi tiết vào `WORKSHOP_DATA_BANK.md` và `.agents/rules/09-WORKSHOP_RAW_DATA_BANK_AND_REVERSE_INTERPOLATION.md`.
- Tuyệt đối bảo toàn dữ liệu gốc, không làm tròn cẩu thả.

### Bước 4: Kiểm Định Đối Chứng Với Công Thức Lý Thuyết
- Nạp thông số vào công thức toán liên tục $\delta = f(H, T_{\text{on}}, \text{IP}, \text{Volt})$ để kiểm tra sai lệch $\Delta = \delta_{\text{tính}} - \delta_{\text{thực}}$.
- Nếu sai số nằm ngoài ngưỡng cho phép ($> 5\mu m$), phân tích nguyên nhân vật lý (do tích tụ xỉ, do màng điện môi, hay do chế độ $\text{VF}$).

### Bước 5: Cập Nhật Vào Giao Diện Web App & Đồng Bộ Phiên Bản
- Thêm bài cắt vào mảng `WORKSHOP_EMPIRICAL_LIBRARY` trong `app.js` (theo đúng nguyên tắc tinh gọn UI: hiển thị Offset chuẩn và $F_c$ tính toán).
- Tăng số hiệu phiên bản trong `version.json`, `index.html`, `app.js`, `sw.js`.
- Tạo file sao lưu an toàn tại `/backups/autocut_YYYY-MM-DD(n).zip`.

### Bước 6: Chạy Kiểm Tra Toàn Vẹn Hệ Thống
- Chạy `scripts/verify_integrity.js`.
- Báo cáo kết quả chi tiết cho SirPhuong.

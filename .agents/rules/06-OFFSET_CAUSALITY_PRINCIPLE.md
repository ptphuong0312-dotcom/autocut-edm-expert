# NGUYÊN LÝ NHÂN QUẢ BÙ DAO VÀ NỘI SUY TOÀN DIỆN (OFFSET CAUSALITY & FULL INTERPOLATION PRINCIPLE)

🚨 **NGUYÊN TẮC TỐI THƯỢNG ĐƯỢC ĐÍNH CHÍNH TỪ USER** 🚨

Tài liệu này xác lập tính nhân quả bất di bất dịch trong việc nội suy toàn bộ chuỗi Bù dao (Offset O1, O2, O3, O4, O5, O6), dựa trên bộ dữ liệu thực nghiệm.

## 1. BẢN CHẤT CỦA BÙ DAO (OFFSET) TRONG MỌI PASS CẮT
- **Khả năng cào bề mặt (Removal Capability):** Mỗi một chế độ điện (tổ hợp Ton, IP, Volt) mang một sức công phá/độ sâu hố rỗ nội tại riêng biệt.
- **Nguyên lý Nhân quả:** Bù dao (Offset) của BẤT KỲ Pass nào (từ phá thô O1 đến bóng gương O6) đều là **hệ quả trực tiếp** của chế độ điện được sử dụng trong Pass đó.
  - Chế độ điện mạnh (Ton lớn, IP lớn) -> Cào sâu -> Bù dao lớn (VD: O1 = 0.085 ~ 0.110).
  - Chế độ điện trung bình (Ton 20-30, IP 2-3) -> Cào vừa -> Bù dao trung bình (VD: O2 = 0.030).
  - Chế độ điện siêu nhỏ (Ton 1-3, IP 1) -> Chỉ đánh bóng -> Bù dao siêu mỏng (VD: O5 = 0.002).

## 2. NHIỆM VỤ NỘI SUY CỦA HỆ THỐNG AI
- AI **TUYỆT ĐỐI KHÔNG** được "khóa cứng" (hardcode) hay mặc định bất kỳ giá trị Offset nào (như nghĩ rằng O2 luôn tự động bằng 0.030).
- Khi người dùng gửi kết quả cắt thực nghiệm xưởng, AI phải:
  1. Đọc chế độ điện của TỪNG PASS (P1, P2, P3...).
  2. Phân tích kết quả cắt chuẩn để ánh xạ ra Bù dao (O1, O2, O3...).
  3. Xây dựng mô hình học máy: `f(Chế độ điện) = Khả năng cào phôi = Offset chuẩn`.
- Nhờ đó, với bất kỳ chế độ điện nào được chọn cho bất kỳ Pass nào, phần mềm đều có thể tự động tính toán nội suy ra toàn bộ chuỗi Offset từ O1 đến O6.

## 3. LOẠI BỎ TƯ DUY SAI LẦM CŨ
- **Sai lầm:** AI từng cho rằng O2 là "Biến số test" do người dùng tùy ý ghim cứng, còn AI chỉ lo tính mỗi O1.
- **Đính chính:** Toàn bộ bảng dữ liệu thực nghiệm khổng lồ User gửi là để AI học khả năng cào phôi của *từng cấp độ điện riêng biệt*, từ đó tự động nội suy ra ĐỒNG BỘ cả O1, O2, O3, O4, O5, O6 chứ không phải chỉ 1 biến số.

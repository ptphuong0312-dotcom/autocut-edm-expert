# QUY CHUẨN VÒNG LẶP ĐỐI CHỨNG THỰC NGHIỆM KHÉP KÍN (95% THÔNG SỐ XUẤT TỪ WEB)
# (CLOSED-LOOP EMPIRICAL VALIDATION PROTOCOL - 95% AI-GENERATED FIDELITY)

---

## 🚨 BẢN CHẤT CỦA DỮ LIỆU THỰC NGHIỆM TRONG TƯƠNG LAI:

Người dùng đã chính thức thiết lập nguyên tắc vận hành thực nghiệm mới:
> *"sau này tôi sẽ dùng chính thông số bạn xuất ra để cắt và cấp lại kết quả cho bạn. bạn ghim điều này để nhớ rằng dữ liệu sau này sẽ là 95% của bạn xuất ra"*

---

## 📌 3 ĐIỀU CẦN KHẮC GHI TRONG MỌI PHÂN TÍCH:

1. **DỮ LIỆU ĐẾN TỪ 95% THÔNG SỐ DO HỆ THỐNG XUẤT RA:**
   * Không giống như các bài test thử nghiệm ngẫu nhiên ban đầu, toàn bộ các bộ thông số cắt thực tế mà người dùng gửi về sau này (Ton, Po, IP, Volt, VF, Wire, Offset $O_1, O_2$) sẽ lấy **95% nguyên bản từ kết quả tính toán do Web App xuất ra**.
   * Người dùng nạp các thông số này trực tiếp vào tủ điều khiển AutoCut và chạy gia công thực tế trên phôi.

2. **Ý NGHĨA KỸ THUẬT CỦA KẾT QUẢ PHẢN HỒI (SAI LỆCH ĐO KIỂM $\Delta$):**
   * Kết quả đo kiểm kích thước (ví dụ: chày to hơn $\Delta$ mm, cối nhỏ hơn $\Delta$ mm, hoặc kích thước đã chuẩn 100%), thời gian cắt thực tế và ampe kim máy sẽ là **thước đo phản ánh trực tiếp và trung thực sai số còn lại của chính hệ thống công thức do AI xây dựng**.
   * Sai lệch kích thước $\Delta$ đo được chính là sai lệch của lượng cào phôi $	ext{gap}_1$ và $	ext{gap}_2$ giữa lý thuyết tính toán so với thực tế phóng điện trong lòng khe hở.

3. **QUY TRÌNH TIẾP NHẬN & ĐÁNH GIÁ CỦA AI:**
   * Khi người dùng cung cấp dữ liệu cắt mới:
     - AI lập tức nhận diện: Đây là bài test kiểm chứng khép kín (Closed-loop benchmark) chạy theo thông số Web đã xuất.
     - Nạp dữ liệu thực tế vào bảng đối chứng sai số: $\Delta 	ext{gap}_1 = 	ext{gap}_{1	ext{ tính}} - 	ext{gap}_{1	ext{ thực}}$ và $\Delta 	ext{gap}_2 = 	ext{gap}_{2	ext{ tính}} - 	ext{gap}_{2	ext{ thực}}$.
     - Ghi nhận xu hướng và báo cáo rõ ràng mức độ chính xác của hệ thống, chuẩn bị phương án tinh chỉnh hệ số khi người dùng cho phép.

# NGUYÊN TẮC PHÂN ĐỊNH DỮ LIỆU: TEST VS TIÊU CHUẨN (RAW MATERIAL VS STANDARD)

🚨 **NGUYÊN TẮC SỐNG CÒN SỐ 07 - ĐƯỢC NHẤN MẠNH VÀ ĐÍNH CHÍNH BỞI USER** 🚨

Tài liệu này xác định rõ bản chất của các số liệu mà người dùng cung cấp và định hình vai trò tính toán thực sự của AI. Tuyệt đối không được nhầm lẫn giữa hai khái niệm này.

## 1. DỮ LIỆU USER GỬI CHỈ LÀ TÀI LIỆU NGUỒN (RAW TEST DATA)
- **Không phải thông số chuẩn:** Tất cả các bảng thông số cắt (Ton, IP, Bù dao...) mà người dùng gửi cho AI đều là **thông số cắt thực nghiệm (Test Parameters)**.
- **Mục đích:** Người dùng cố tình chạy các bài test này với các biến số khác nhau nhằm mục đích ép máy CNC bộc lộ các đặc tính vật lý (khả năng cào bề mặt, độ lệch, giới hạn tốc độ). 
- **Bản chất:** Đây hoàn toàn là "Nguyên liệu thô" (Source Material / Training Data) để cung cấp cho mô hình học máy.

## 2. NHIỆM VỤ CỦA AI: TÍNH TOÁN RA THÔNG SỐ CHUẨN (STANDARD PARAMETERS)
- AI **TUYỆT ĐỐI KHÔNG ĐƯỢC** học vẹt, sao chép y nguyên các thông số test này và gọi nó là "Thông số tiêu chuẩn".
- **Quy trình hoạt động bắt buộc:**
  1. Nhận "Dữ liệu Test" từ người dùng.
  2. Mổ xẻ và khai thác quy luật vật lý ẩn bên trong (Nội suy xem tổ hợp điện nào sinh ra tia lửa bao nhiêu).
  3. Xây dựng phương trình nội suy (Interpolation Math) từ các quy luật đó.
  4. **Tính toán, tối ưu và XUẤT RA "Thông số Chuẩn" (Standard Parameters)** cuối cùng để người dùng sử dụng cho các sản phẩm thực tế.

## 3. CHÂM NGÔN NHẮC NHỞ CHO MỌI AGENT
*"Thông số người dùng gửi không phải tiêu chuẩn mà là nguồn tài liệu để tính toán nội suy ra thông số chuẩn. AI là một cỗ máy phân tích (Data Analyzer), không phải máy copy."*

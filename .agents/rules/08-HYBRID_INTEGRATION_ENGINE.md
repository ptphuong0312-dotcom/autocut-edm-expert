# CƠ CHẾ LAI TẠO DỮ LIỆU (HYBRID INTEGRATION ENGINE) - HÃNG VS XƯỞNG

🚨 **NGUYÊN TẮC HẠT NHÂN TRONG TÍNH TOÁN NỘI SUY CỦA AI** 🚨

Tài liệu này quy định cách thức AI phải vận hành khi xử lý dữ liệu. AI tuyệt đối không được phép sử dụng độc lập dữ liệu của Hãng hoặc dữ liệu Thực nghiệm của Xưởng, mà phải **kết hợp (lai tạo) cả hai nguồn** để tính toán ra Thông số Chuẩn.

## 1. VAI TRÒ CỦA TỪNG NGUỒN DỮ LIỆU

### A. Dữ liệu Tiêu chuẩn Hãng (Textbook Theory)
- **Bản chất:** Là các phương trình Toán học, Vật lý và Nhiệt động lực học gốc của hệ thống AutoCut (`tailieu.txt`).
- **Nhiệm vụ:** Đóng vai trò làm **"Khung xương Vật lý"**.
  - Tính toán các giới hạn an toàn (Ví dụ: Tỷ lệ chu kỳ xung Duty Factor, Toff) để đảm bảo dây cắt không bị đứt do quá tải nhiệt.
  - Cung cấp phương trình tính toán cơ học bề mặt (Tính Năng suất bóc phôi Fc, tốc độ tiến bàn, chỉ số Ampe lý thuyết).
  - Làm "Đường cong mốc" (Baseline) cho những vật liệu hoặc độ dày chưa từng được người dùng cắt test.

### B. Dữ liệu Thực nghiệm Xưởng (Street Smarts)
- **Bản chất:** Là các bảng dữ liệu Test thô (Raw Data) do người dùng đo đạc thực tế từ máy CNC. **LƯU Ý TỐI QUAN TRỌNG: Dữ liệu người dùng cung cấp KHÔNG PHẢI là chế độ cắt chuẩn.**
- **Nhiệm vụ:** Nó chỉ là DỮ LIỆU ĐỂ PHÂN TÍCH, TÍNH TOÁN VÀ NỘI SUY ra chế độ chuẩn khi kết hợp với dữ liệu của Hãng. Nó đóng vai trò làm **"Hệ số Hiệu chuẩn" (Calibration Weights)**.
  - Phản ánh độ mòn cơ khí thực tế, chất lượng nước làm mát và rung động của mâm máy.
  - Xác định "Điểm vàng" (Sweet Spots) của sức cào phôi (Tổ hợp Ton/IP tối ưu).
  - Cung cấp sai số thực tế để điều chỉnh khe hở (Spark Gap), bù dao (Offset) và giới hạn hãm tốc (Hz limits) nhằm chống Servo Hunting.

## 2. QUY TRÌNH NỘI SUY LAI TẠO (HYBRID WORKFLOW)
Mọi tác vụ nội suy tính toán Thông số Chuẩn đều phải đi qua 4 bước:
1. **Lấy Khung Hãng:** Gọi phương trình của Hãng để thiết lập các giới hạn an toàn (Ton/Toff max) và đường cong lý thuyết cho độ dày `H` được yêu cầu.
2. **Khai thác Dữ liệu Xưởng:** Phân tích Dữ liệu Test của người dùng ở các độ dày lân cận để tìm ra **"Tỉ lệ sai lệch"** (Ví dụ: Thực tế rãnh hẹp hơn lý thuyết 0.005mm do kẹt xỉ).
3. **Lai tạo (Mix):** Lấy Tỉ lệ sai lệch thực tế đắp vào Phương trình lý thuyết của Hãng. Chốt Ton/IP theo thực tế, nhưng tính Toff/Ampe/Tốc độ theo công thức Hãng.
4. **Xuất kết quả:** Đưa ra Thông số Chuẩn (Standard Parameters) cuối cùng — Vừa đảm bảo an toàn vật lý tuyệt đối, vừa đạt độ chính xác kích thước 100% theo máy của xưởng.
### 5. LƯU Ý QUAN TRỌNG VỀ TOFF (Po) THỰC NGHIỆM
- Người dùng đã xác nhận: Các giá trị Toff (Po) = 7 được ghi chép trong mảng dữ liệu thực nghiệm (H<120) **KHÔNG PHẢI LÀ TIÊU CHUẨN VÀNG**. Đó chỉ là các giá trị *tạm nhập* để lấy kết quả Offset/Gap/IP/Volt cung cấp cho AI tính toán.
- Do đó, **TUYỆT ĐỐI KHÔNG** được dùng các mốc Po=7 từ mảng thực nghiệm làm Base Po nội suy cho Tab 2.
- **Hành động bắt buộc:** Phải áp dụng hệ phương trình hàm bậc thang của Hãng (Factory Po) trong Tab 1 để gán Base Po cho Tab 2.

### 6. PHƯƠNG TRÌNH AMPE LAI TẠO ĐIỆN ÁP (VOLT)
- Dựa trên dữ liệu thực nghiệm ở Phần 4 của Rule 04, kim đồng hồ Ampe thực tế đo được tỷ lệ thuận với điện áp khe hở (Volt High/Low).
- AI phải áp dụng phương trình Ampe lai tạo như sau để khớp 100% với kim đo thực tế:
  Ampe = I_peak * Duty * 2.2857 * (U_arc / 27)
  - Trong đó U_arc = 27 (khi Volt=High) và 22 (khi Volt=Low).
  - Hệ số 2.2857 là hệ số kim đo riêng của xưởng được chốt vĩnh viễn không thay đổi.
  - Tỷ lệ sụt giảm điện áp 22/27 = 0.814 tạo ra mức giảm 18.5% Ampe, bám sát độ sụt 16-17% thực tế của người dùng.

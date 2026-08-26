# MÔ HÌNH HIỆU CHUẨN XƯỞNG (WORKSHOP CALIBRATION MODEL)

Tài liệu này ghi lại toàn bộ các nguyên tắc vật lý thực nghiệm và logic nội suy được áp dụng riêng cho xưởng của người dùng (Tab 2: Hiệu Chỉnh Thực Tế Xưởng). Đây là "Bộ não" cốt lõi giúp phần mềm thích nghi với máy cắt thực tế.

## 1. Bản chất của Giới hạn Tốc độ (Hz) & Phóng điện thứ cấp
*   **Nguyên lý phần cứng:** Tốc độ tiến bàn (Ft) của máy cắt dây AutoCut (DK77) phụ thuộc vào tần số xung cấp cho động cơ bước. 1 Xung = 1 μm. Công thức: `Ft_max (mm/p) = Hz * 0.06`.
*   **Hiện tượng Servo Hunting (Giật cục):** Ở các Pass cắt tinh (lượng phôi rất mỏng, khe hở dễ mở), nếu không hãm tốc độ, mạch dò điện áp (V-F) sẽ đẩy bàn máy chạy rất nhanh, gây ngắn mạch và phanh gấp liên tục. Độ rung này phá hủy độ bóng bề mặt (gây sọc vằn vện).
*   **Hiện tượng Phóng điện thứ cấp (Secondary Discharge):** Nếu hãm bàn máy đi *quá chậm* trong khi áp lực nước làm mát yếu (đặc trưng của cắt tinh), mạt xỉ không kịp thoát ra sẽ tụ lại. Tia lửa điện đánh qua lớp xỉ này dội vào vách phôi, làm bề mặt bị rỗ, xám xỉn và lẹm kích thước.
*   **Điểm Vàng (Sweet Spot):** Là mức giới hạn tốc độ (Hz) vừa đủ thấp để dập tắt Servo Hunting, nhưng vừa đủ nhanh để vượt qua lớp xỉ, ngăn chặn phóng điện thứ cấp.

## 2. Dữ liệu Neo Thực nghiệm (Anchor Data)
Người dùng đã cung cấp kết quả cắt hoàn hảo cho thép SCM440, chiều dày **H=12mm** (Mã: `WS-EXP-02`):
*   Tỷ lệ quy đổi trên giao diện phần mềm xưởng: `200Hz tương đương 480mm2/p`. Suy ra công thức hãm: **`Hz = Fc_max / 2.4`**.
*   Giới hạn năng suất mượt nhất (Fc_max) giảm dần theo 5 Pass: `300, 220, 140, 90, 60` (mm2/p).
*   Tương đương dãy Hz điểm vàng cho H=12mm: `125Hz, 92Hz, 58Hz, 38Hz, 25Hz`.

## 3. Quy tắc Hiệu chuẩn Hệ số Bù dao (Offset)
*   **Độ rơ cơ học:** Máy thực tế rung lớn hơn lý thuyết, nhưng ở Pass 1 (Cắt thô), bù dao chuẩn hãng thường bị dư khiến chi tiết bị to (+0.012mm). 
*   **Điều chỉnh:** Pass 1 luôn phải **giảm Offset đi 0.017mm** so với chuẩn hãng để ăn khớp dung sai.
*   **Pass tinh:** Các Pass sau (2, 3, 4, 5) neo cố định lượng bù dao gọt siêu mỏng: `0.018mm, 0.008mm, 0.004mm, 0.002mm`.

## 4. Thuật toán Nội suy Tương lai (Machine Learning Evolution)
*   Phần mềm hiện đang khóa cứng "Điểm vàng" ở mốc H=12mm để áp dụng tạm cho các phôi mỏng.
*   **Nhiệm vụ AI:** Khi người dùng cung cấp thêm kết quả cắt thực nghiệm ở các độ dày khác (VD: H=50mm, H=100mm), AI Agent PHẢI thu thập các mốc `maxSpeed` này, lập ra một đường cong nội suy toán học (ví dụ: Polynomial hoặc Tuyến tính).
*   **Mục tiêu:** Khi nhập bất kỳ độ dày `H` nào, phần mềm sẽ tự động nội suy ra dãy `Fc_max` và `Hz` chuẩn xác nhất mà không cần người dùng phải tự test lại.

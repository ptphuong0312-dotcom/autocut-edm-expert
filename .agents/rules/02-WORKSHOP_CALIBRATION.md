# MÔ HÌNH HIỆU CHUẨN XƯỞNG (WORKSHOP CALIBRATION MODEL)

Tài liệu này ghi lại toàn bộ các nguyên tắc vật lý thực nghiệm và logic nội suy được áp dụng riêng cho xưởng của người dùng (Tab 2: Hiệu Chỉnh Thực Tế Xưởng). Đây là "Bộ não" cốt lõi giúp phần mềm thích nghi với máy cắt thực tế.

## 1. Bản chất của Giới hạn Tốc độ (Hz) & Phóng điện thứ cấp
*   **Nguyên lý phần cứng:** Tốc độ tiến bàn (Ft) của máy cắt dây AutoCut (DK77) phụ thuộc vào tần số xung cấp cho động cơ bước. 1 Xung = 1 μm. Công thức: `Ft_max (mm/p) = Hz * 0.06`.
*   **Hiện tượng Servo Hunting (Giật cục):** Ở các Pass cắt tinh (lượng phôi rất mỏng, khe hở dễ mở), nếu không hãm tốc độ, mạch dò điện áp (V-F) sẽ đẩy bàn máy chạy rất nhanh, gây ngắn mạch và phanh gấp liên tục. Độ rung này phá hủy độ bóng bề mặt (gây sọc vằn vện).
*   **Hiện tượng Phóng điện thứ cấp (Secondary Discharge):** Nếu hãm bàn máy đi *quá chậm* trong khi áp lực nước làm mát yếu (đặc trưng của cắt tinh), mạt xỉ không kịp thoát ra sẽ tụ lại. Tia lửa điện đánh qua lớp xỉ này dội vào vách phôi, làm bề mặt bị rỗ, xám xỉn và lẹm kích thước.
*   **Điểm Vàng (Sweet Spot):** Là mức giới hạn tốc độ (Hz) vừa đủ thấp để dập tắt Servo Hunting, nhưng vừa đủ nhanh để vượt qua lớp xỉ, ngăn chặn phóng điện thứ cấp.

## 2. Dữ liệu Neo Thực nghiệm (Anchor Data)
Người dùng đã cung cấp kết quả cắt hoàn hảo cho thép SCM440, chiều dày **H=12mm** (Mã: `WS-EXP-02`):
*   Dữ liệu cắt thực tế (Thợ nhập tay trực tiếp vào máy): `200Hz, 200Hz, 120Hz, 100Hz, 80Hz`.
*   Nhận định từ thợ: Pass 2 để 200Hz là quá lỏng (thả rông), cần hãm lại một chút.
*   **Mức Trần An Toàn Vĩnh Viễn (Universal Safety Ceiling):** `[200, 150, 120, 100, 80]`. 
*   **Giải thích vật lý:** Dãy Hz này đóng vai trò là mức trần. Ở phôi mỏng, máy đòi chạy rất nhanh (vd 300Hz), trần này sẽ chặn nó lại để chống Servo Hunting. Ở phôi dày, máy tự chạy siêu chậm (vd 15Hz), trần 80Hz sẽ trở thành vô hình ("thả rông" đúng nghĩa), không hề cản trở quá trình cắt phôi dày!

## 3. Quy tắc Hiệu chuẩn Hệ số Bù dao (Offset)
*   **Độ rơ cơ học:** Máy thực tế rung lớn hơn lý thuyết, nhưng ở Pass 1 (Cắt thô), bù dao chuẩn hãng thường bị dư khiến chi tiết bị to (+0.012mm). 
*   **Điều chỉnh:** Pass 1 luôn phải **giảm Offset đi 0.017mm** so với chuẩn hãng để ăn khớp dung sai.
*   **Pass tinh:** Các Pass sau (2, 3, 4, 5) neo cố định lượng bù dao gọt siêu mỏng: `0.018mm, 0.008mm, 0.004mm, 0.002mm`.

## 4. Thuật toán Nội suy Tương lai (Machine Learning Evolution)
*   Phần mềm hiện đang khóa cứng "Điểm vàng" ở mốc H=12mm để áp dụng tạm cho các phôi mỏng.
*   **Nhiệm vụ AI:** Khi người dùng cung cấp thêm kết quả cắt thực nghiệm ở các độ dày khác (VD: H=50mm, H=100mm), AI Agent PHẢI thu thập các mốc `maxSpeed` này, lập ra một đường cong nội suy toán học (ví dụ: Polynomial hoặc Tuyến tính).
*   **Mục tiêu:** Khi nhập bất kỳ độ dày `H` nào, phần mềm sẽ tự động nội suy ra dãy `Fc_max` và `Hz` chuẩn xác nhất mà không cần người dùng phải tự test lại.

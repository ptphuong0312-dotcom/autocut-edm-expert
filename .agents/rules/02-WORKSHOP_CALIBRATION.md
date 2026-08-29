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
*   **Anchor Data 1 (Mỏng, Cấp 6):** H=12mm `[200, 150, 120, 100, 80] Hz`. Offset Pass 1 giảm 0.006mm.
*   **Anchor Data 2 (Dày, Cấp 6):** H=63mm `[150, 100, 80, 60, 50] Hz`. Offset Pass 1 giảm 0.025mm.
*   **Anchor Data 3 (Dày, Cấp 4):** H=63mm. Offset Pass 1 giảm 0.035mm.
*   **Thuật toán hiện tại (Multi-dimensional Linear Interpolation):** Phần mềm tự động nội suy mức giảm Bù dao (Offset) đa chiều: Vừa theo độ dày `H`, vừa theo `Strategy Level` (từ Cấp 6 xuống Cấp 4 sẽ tự cộng dồn thêm mức giảm Offset). Giới hạn Tốc độ (Hz) cũng được nội suy tuyến tính theo chiều dày `H`.

## 5. NGUYÊN TẮC LUÂN CHUYỂN DỮ LIỆU (USER WORKFLOW) - BẮT BUỘC NHỚ
*   **Nguồn lấy dữ liệu cắt:** Đa phần (90%) người dùng sẽ lấy thông số chế độ điện trực tiếp từ **Tab 1 (Chuẩn hãng với thanh trượt 11 cấp độ)** để nạp vào máy cắt CNC thực tế.
*   **Trạng thái Tab 2:** Tab 2 (Hiệu Chỉnh Thực Tế Xưởng) hiện tại vẫn đang trong giai đoạn **chưa hoàn thiện và đang thu thập dữ liệu (Calibration Phase)**, do đó người dùng **sẽ CHƯA DÙNG thông số của Tab 2 để cắt**.
*   **Vòng lặp học máy (The Loop) - QUY TRÌNH BẮT BUỘC:** 
    1. User tra cứu Tab 1 -> Mang thông số Tab 1 ra xưởng cắt.
    2. Cắt xong, User cung cấp kết quả đo đạc thực tế (kích thước sai lệch, tốc độ Hz, Ampe) cho AI.
    3. **AI Bắt buộc phải MAPPING:** Trước khi phân tích, AI PHẢI so sánh các thông số (Ton, Toff, IP...) mà User gửi với thuật toán của Tab 1 để CHỐT xem dữ liệu cắt đó thuộc "Cấp độ chiến lược nào" (từ Cấp 1 đến 11).
    4. Sau khi chốt được Cấp độ, AI mới bắt đầu phân tích sâu các kết quả kèm theo (thời gian, Hz, tốc độ, sai lệch).
    5. AI Agent có nhiệm vụ dùng kết quả đó làm "Anchor Data" để sửa lại thuật toán nội suy (Machine Learning) **bên trong Tab 2**, giúp Tab 2 ngày càng chính xác hơn để chuẩn bị cho tương lai.

## 6. ĐẶC TÍNH HIỂN THỊ CỦA MÁY CNC THỰC TẾ (AUTOCUT DISPLAY QUIRKS)
*   **Nguyên tắc "Ảo ảnh H=40mm":** Bất kể phôi thực tế của bạn dày bao nhiêu (12mm, 55mm, 63mm...), phần mềm AutoCut luôn mặc định lấy Tốc độ tiến bàn cơ học (Ft) nhân với hằng số `40` để in ra con số `mm²/phút` trên màn hình.
*   **Công thức quy đổi tuyệt đối:** Vì tốc độ bàn `Ft (mm/phút) = Hz * 0.06`, và màn hình hiển thị `Hiển thị = Ft * 40`, chúng ta có công thức bất di bất dịch:
    **`Tốc độ hiển thị AutoCut (mm²/phút) = Hz * 2.4`**
    (Ví dụ: 200Hz sẽ luôn hiện 480 mm²/p; 100Hz sẽ luôn hiện 240 mm²/p).
*   **Ứng dụng thực tế:** AI và User thống nhất **TUYỆT ĐỐI KHÔNG tin vào chỉ số mm²/phút trên màn hình máy** khi đo đạc năng suất thực tế. Thay vào đó, mọi hồ sơ thực nghiệm phải được quy chiếu về **Tần số xung (Hz)**.

## 7. NGUYÊN LÝ LƯỢNG DƯ TƯƠNG ĐỐI (RELATIVE ALLOWANCE OFFSET)
*   **Bản chất thông số Offset trong AutoCut (DK77):**
    *   **Pass 1 (Offset):** Là tọa độ tuyệt đối từ tâm dây đến biên vách phôi (Offset = R_dây + Khe hở).
    *   **Pass 2 trở đi (Remain / Lượng dư):** Đây **KHÔNG PHẢI** là tọa độ tuyệt đối. Đây là khoảng cách tương đối (lượng phôi sẽ bị gọt đi) so với Pass trước đó.
*   **Thuật toán của Máy:** Tọa độ Pass sau = Tọa độ Pass trước - Remain.
*   **Nguyên tắc vàng khi sửa kích thước:** 
    *   Khi đo sản phẩm thấy sai số (Ví dụ: Lỗ nhỏ đi 0.008mm mỗi bên, cần mở rộng lỗ ra), ta **CHỈ CẦN ĐIỀU CHỈNH OFFSET PASS 1** (Giảm đi 0.008mm).
    *   **TUYỆT ĐỐI GIỮ NGUYÊN REMAIN CÁC PASS SAU.**
    *   Máy sẽ tự động dịch chuyển toàn bộ quỹ đạo của các Pass sau ra ngoài (hoặc vào trong) tương ứng với Pass 1, đồng thời bảo toàn chính xác lượng phôi (Remain) mà các Pass sau phải cắt, giúp tránh hiện tượng ngộp phôi đứt dây hoặc trượt tia lửa.

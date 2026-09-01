# ĐỘNG HỌC OFFSET NHIỀU PASS (MULTI-PASS KINEMATICS)

🚨 **TÀI LIỆU CỐT LÕI - BẮT BUỘC ĐỌC TRƯỚC KHI TÍNH TOÁN OFFSET NHIỀU PASS** 🚨
Tài liệu này định nghĩa bản chất toán học tuyệt đối của hệ thống AutoCut khi xử lý cắt nhiều Pass, được công nhận qua kiểm thử thực tế từ người dùng.

## 1. BẢN CHẤT CỦA CÁC THÔNG SỐ NHẬP VÀO MÁY
Khi người dùng nhập 2 hệ số bù dao:
- `O1` (Offset Pass 1)
- `O2` (Offset Pass 2 / Lượng dư Remain)
Máy AutoCut sẽ diễn dịch thành quỹ đạo chạy tâm dây (Path) như sau:
*   **Path 1 (Tâm dây P1):** `Path 1 = O1 + O2`
*   **Path 2 (Tâm dây P2):** `Path 2 = R_wire (0.090) + O2`

## 2. NGHỊCH LÝ QUỸ ĐẠO & HIỆN TƯỢNG "TẦM VƯƠN GIỚI HẠN" (THE REACH LIMIT)
*   **Nghịch lý:** Quỹ đạo của Pass 2 **KHÔNG HỀ CHỨA** biến số `O1`. Tâm dây Pass 2 bị khóa chết tuyệt đối bởi `O2`.
*   **Tầm vươn (Reach):** Ở Pass 2, bề mặt sợi dây cách vạch đích (Kích thước 0) một khoảng đúng bằng `O2`. Tại đây, dây phóng ra tia lửa `G2`. Tọa độ phôi bị cào sâu tối đa là: `O2 - G2`.
*   **Vai trò cứu thế của O1:** 
    - Nếu `O1` nhập quá lớn: Pass 1 chạy quá xa ra ngoài, chừa lại bức tường phôi (Remain) quá dày. Khi Pass 2 đi qua, tia lửa `G2` cào hết lực cũng không với tới vạch đích -> Sản phẩm bị dư (to).
    - Giải pháp: Chỉ cần GIẢM `O1` xuống. Pass 1 sẽ ép sát vào, làm bức tường phôi mỏng lại vừa khít với tầm vươn `G2` của Pass 2 -> Kích thước chuẩn.

## 3. SỨ MỆNH NỘI SUY CỦA AI (BẢN CHẤT VẬT LÝ VS SỰ KỲ VỌNG)
Máy AutoCut luôn "ảo tưởng" (kỳ vọng) rằng khe hở Pass 1 là `O1 - 0.09` và khe hở Pass 2 là `O2`. Nhưng thực tế vật lý tia lửa (Gap) to hay nhỏ lại phụ thuộc vào `Ton` và `IP`.
Chính vì sự mù mờ này của máy, AI phải làm nhiệm vụ:
1.  **Dùng dữ liệu 1 Pass:** Để đo thực tế chế độ điện phá thô phóng ra tia lửa rộng bao nhiêu (`G1`).
2.  **Dùng dữ liệu 2 Pass:** Để đo "tầm vươn cào phôi" thực tế của chế độ mài bóng (`G2`).
3.  **Toán học giải ngược:** Bất kể người dùng nhập mốc `O2` là số nào (thậm chí là một số ảo/vớ vẩn), AI mang trọng trách giải phương trình động học để tìm ra con số **`O1` hoàn hảo nhất**. Con số `O1` này sẽ có tác dụng "dịch chuyển bức tường phôi" về đúng điểm rơi tia lửa của Pass 2.

=> **QUY TẮC BẤT DI BẤT DỊCH:** Tính toán Offset nhiều Pass thực chất là bài toán tìm bù dao `O1` để sửa sai cho sự chênh lệch giữa "Lượng dư cơ học O2" và "Sức công phá vật lý của tia lửa G2".

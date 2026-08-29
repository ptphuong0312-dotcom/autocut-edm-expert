# 📖 TỪ ĐIỂN CÁC ĐỊNH NGHĨA & THUẬT NGỮ CẮT DÂY EDM (AutoCut)
*Tài liệu đúc kết từ quá trình thực nghiệm và tinh chỉnh giữa Thợ máy & AI.*
*Trạng thái: Đã cập nhật Đạo luật Tiêu chuẩn Đỉnh Panme.*

---

### 1. CÁC THÔNG SỐ ĐIỆN CƠ BẢN
*   **Ton / ti (Độ rộng xung - Pulse Width):** Thời gian dòng điện phóng ra (µs). Ton càng lớn, tia lửa càng mạnh, cắt càng nhanh, rãnh cắt càng rộng, nhưng bề mặt phôi càng rỗ và dây Molypden càng nhanh mòn.
*   **Toff / Po (Thời gian nghỉ - Pulse Off):** Hệ số nhân thời gian nghỉ. Thời gian nghỉ thực tế = Toff * Ton. Quyết định khoảng thời gian xối nước làm mát để đẩy xỉ ra ngoài. Toff càng lớn, cắt càng an toàn (ít đứt dây), nhưng dòng Ampe bị tụt và tốc độ chậm.
*   **IP (Ống công suất / Dòng đỉnh):** Số lượng van công suất mở (1 đến 6). Quyết định cường độ dòng điện cực đại của mỗi tia lửa.
*   **Volt (Điện áp):** High (Điện áp cao) giúp tia lửa dễ mồi qua khoảng cách xa (thích hợp phôi dày), Low (Điện áp thấp) cho tia lửa ngắn (thích hợp cắt tinh Pass 2, 3).
*   **VF (Biến tần / V-F Tracking):** Tần số cấp cho mô-tơ bước/servo điều khiển mâm máy tiến/lùi. 
    *   **VF thấp:** Tần số chậm, mâm máy tiến rón rén, dễ lùi dao khi kẹt xỉ (chống đứt dây nhưng cắt chậm).
    *   **VF cao:** Tần số nhanh, mâm máy tiến hung hãn, lỳ lợm ép thẳng vào phôi. Thích hợp khi rãnh cắt đã được thông thoáng.

---

### 2. QUY CHUẨN ĐO LƯỜNG, ĐỊA HÌNH NÚI LỬA & PANME
*   **Tiêu chuẩn Đỉnh Panme (Phần nổi):** Thước Panme chỉ tiếp xúc với các đỉnh nhô cao nhất của bề mặt. Mọi kích thước nghiệm thu theo bản vẽ đều lấy số đo Đỉnh Panme này làm chuẩn 100%. Phần lõm (Đáy núi lửa / phần chìm) không liên quan đến kích thước nghiệm thu.
*   **Nội suy Phần chìm (Đáy lõm Rz):** AI có nhiệm vụ tính toán chiều sâu phần lõm $ để xác định lượng chừa phôi (Remain) cho các Pass sau sao cho Pass sau gọt sạch các đỉnh nhô cũ và đưa đỉnh nhô mới về đúng kích thước bản vẽ.
*   **Khả năng cào phôi (True Spark Gap):** Khoảng cách thực tế từ mép dây đến đỉnh nhô cao nhất đo bằng Panme.
    *   *Nguyên tắc sinh tử:* Không bao giờ được nhập lượng chừa phôi (Remain) cho các Pass cắt tinh lớn hơn "Khả năng cào phôi" của bộ điện Pass đó.

---

### 3. HIỆN TƯỢNG VẬT LÝ THỰC CHIẾN & CHIẾN THUẬT SIÊU DÀY
*   **Điểm nghẽn 1.5 - 2 giờ (The Choke Point):** Xảy ra ở phôi dày $>100\text{mm}$. Dây mòn + xỉ nghẹt làm máy khựng lại.
*   **Chiến thuật "Mìn phá băng & Lệnh xung phong":** Dùng Ton siêu lớn (100 - 120µs) nổ tung dọn rãnh, kết hợp VF cao (60 - 65) ép mâm máy lướt qua vùng nghẽn.
*   **Đường cong Khả năng cào hình chữ U:** Từ =12$ đến \text{mm}$, Gap giảm từ 0.019 xuống 0.005mm. Nhưng từ =100$ đến \text{mm}$, do dùng Ton siêu lớn (100-120), Gap nở rộng ngược lại từ 0.012 lên 0.020mm.
*   **Nghịch lý Không béo bụng ở phôi siêu dày:** Ton lớn tạo rãnh rộng giúp triệt tiêu ma sát vách, áp suất nổ đều 2 đầu và tốc độ nhích bàn điềm tĩnh giúp phôi cắt ra thẳng tắp.

---

### 4. GHI CHÚ VỀ CHẾ ĐỘ TIÊU CHUẨN (TAB 1)
*   Chế độ Hãng ở Tab 1 hiện tại chỉ mang tính tham khảo đối chiếu.
*   Chỉ khi có lệnh trực tiếp từ Thợ máy, AI mới được sửa đổi thuật toán Tab 1.
---

### 5. H?NG S? �I?N �P T? NGU?N (HIGH vs LOW)
*   **H? s? t? l? Ampe:** D? li?u th?c nghi?m qua 2 b�i test d?c l?p tr�n ph�i SCM420 (=30\text{mm}$):
    *   *Test 1 (Ton 28, Toff 6, IP 4):* High = 4.15A, Low = 3.45A $\rightarrow \text{T? l? } \frac{\text{High}}{\text{Low}} = \mathbf{1.203}$ (+20.3%).
    *   *Test 2 (Ton 30, Toff 7, IP 3):* High = 3.0A, Low = 2.5A $\rightarrow \text{T? l? } \frac{\text{High}}{\text{Low}} = \mathbf{1.200}$ (+20.0%).
*   **K?t lu?n V?t l�:** T? ngu?n s? c?a xu?ng c� h?ng s? t? l? di?n �p c? d?nh  = 1.20$. Chuy?n t? Low sang High lu�n l�m d�ng Ampe tang ch�nh x�c **20%**, v� ngu?c l?i t? High v? Low lu�n l�m d�ng Ampe gi?m ch�nh x�c **16.7%**.

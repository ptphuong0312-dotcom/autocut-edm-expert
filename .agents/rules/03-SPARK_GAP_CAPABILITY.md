# 💡 NGUYÊN LÝ "KHẢ NĂNG CÀO PHÔI", ĐỊA HÌNH MIỆNG NÚI LỬA & TIÊU CHUẨN ĐỈNH PANME
*Đạo luật cốt lõi đúc kết từ kinh nghiệm thực tiễn của Thợ máy & Hệ thống AI AutoCut Expert.*

---

## 1. TIÊU CHUẨN NGHIỆM THU KÍCH THƯỚC: "TIÊU CHUẨN ĐỈNH PANME" (PHẦN NỔI)
*   **Thực tế đo kiểm xưởng:** Mọi kích thước đo đạc thực tế của thợ máy đều sử dụng **Thước Panme cơ khí**.
*   **Bản chất tiếp xúc:** Thước Panme phẳng chỉ chạm và kẹp vào **CÁC ĐIỂM NHÔ CAO NHẤT (ĐỈNH NÚI LỬA / PHẦN NỔI)** trên bề mặt phôi.
*   **Định nghĩa Kích thước Yêu cầu:** 
    *   **Kích thước bản vẽ yêu cầu = Kích thước Đỉnh Panme đo được sau Pass cắt cuối cùng.**
    *   **Phần lõm (Đáy miệng núi lửa / Phần chìm):** Không đo được bằng Panme và **KHÔNG LIÊN QUAN / KHÔNG ĐƯỢC TÍNH** vào kích thước yêu cầu nghiệm thu của bản vẽ.

---

## 2. VAI TRÒ NỘI SUY CỦA AI VỚI "PHẦN CHÌM" (ĐÁY LÕM NÚI LỬA)
Mặc dù phần lõm không dùng để nghiệm thu kích thước, nhưng AI **BẮT BUỘC PHẢI HIỂU VÀ NỘI SUY CHÍNH XÁC CHIỀU SÂU LÕM** để tính toán cho các Pass tiếp theo:
*   **Độ sâu hố rỗ ($):**  = \text{Độ sâu đáy hố} - \text{Đỉnh Panme đo được}$.
*   $ chính là độ cao của lớp "đỉnh núi" mà Pass tiếp theo phải gọt bỏ.
*   Nếu AI không ước lượng đúng độ sâu lõm $ của Pass 1, lượng chừa phôi (Remain) cho Pass 2 sẽ bị sai:
    *   *Chừa quá ít:* Pass 2 không gọt hết đáy hố cũ, bề mặt vẫn còn lỗ chỗ vết bóc thô của Pass 1.
    *   *Chừa quá nhiều:* Vượt quá "Khả năng cào" của bộ điện Pass 2, dây đâm cơ học vào vách gây đứt dây hoặc lùi dao.

---

## 3. NGUYÊN TẮC THIẾT KẾ ĐIỆN VÀ OFFSET CHO CẮT NHIỀU PASS (2 PASS, 3 PASS,...)
Khi người dùng yêu cầu cắt $ Pass (Ví dụ: Cắt 2 Pass):
1.  **Pass 1 (Phá thô):** 
    *   Dùng bộ điện mạnh (Ton lớn) phá phôi nhanh.
    *   Để lại bề mặt rỗ với các đỉnh nhô và đáy lõm $ lớn.
    *   Offset Pass 1 phải đẩy ra xa một lượng vừa đủ để chừa lại lớp đỉnh nhô này cho Pass 2.
2.  **Pass 2 (Cắt tinh - Pass kết thúc):**
    *   Bộ điện hạ công suất (Ton nhỏ, IP nhỏ) để tạo ra miệng núi lửa siêu nông ($ cực nhỏ, bề mặt bóng mịn).
    *   Hệ số Offset/Remain của Pass 2 phải được tính toán sao cho: **Sau khi san phẳng lớp đỉnh cũ của Pass 1 và tạo lớp bề mặt mới, ĐỈNH NHÔ CAO NHẤT MỚI (khi kẹp Panme) ĐẠT ĐÚNG 100% KÍCH THƯỚC BẢN VẼ YÊU CẦU.**

---

## 4. CÔNG THỨC TOÁN HỌC THIẾT LẬP OFFSET
*   **Cắt 1 Pass:**
    \text{Offset}_1 = R_{\text{dây}} (0.09) + \text{True Spark Gap (Khoảng cách từ mép dây đến Đỉnh Panme)}
    *(Ví dụ H=40mm: $\text{Offset} = 0.090 + 0.008 = 0.098\text{mm}$)*
*   **Cắt 2 Pass:**
    *   $\text{Offset}_1 = R_{\text{dây}} (0.09) + \text{True Spark Gap}_1 + \text{Remain}_2$
    *   $\text{Remain}_2 \ge R_{z1}$ (đảm bảo đủ cào sạch đỉnh nhô cũ).
    *   $\text{Offset}_2$ thực tế đưa đỉnh nhô của Pass 2 trùng khít đường biên bản vẽ.

---

## 5. 🚨 CẢNH BÁO CHỐNG NHẦM LẪN VỀ NĂNG LỰC CÀO CỦA PASS TINH (ANTI-CONFUSION LAW)
*Được người dùng chỉ đạo khắc ghi từ thực nghiệm bài cắt H=85mm SCM440 (STT 2P-10).*

1. **SỰ THẬT VẬT LÝ VỀ CON SỐ 0.035mm CỦA PASS 2:**
   - Trong bài cắt $H=85\text{mm}$, Pass 2 với chế độ điện $	ext{Ton}=20\mu s, 	ext{Po}=6, 	ext{IP}=3$ đã làm kích thước thành cối mở rộng $0.035\text{mm}$ (từ $19.945\text{mm}$ lên $20.015\text{mm}$).
   - **CẢNH BÁO:** AI KHÔNG ĐƯỢC NHẦM LẪN RẰNG BỘ ĐIỆN PASS 2 CÓ THỂ TỰ CÀO ĐƯỢC $0.035\text{mm}$ THÉP ĐẶC!
   - Nếu đưa chế độ điện $	ext{Ton}=20, 	ext{IP}=3$ này vào cắt một phôi thép đã mài phẳng nhẵn lì, năng lực phóng điện thực tế của nó chỉ vươn được **$\delta pprox 0.008 - 0.012\text{mm}$**. Nếu ép dây ăn sâu $0.035\text{mm}$ vào thép phẳng đặc, máy sẽ đoản mạch và đứt dây ngay lập tức.

2. **VÌ SAO PASS 2 LẠI LƯỚT ĐƯỢC 0.035mm VỚI TỐC ĐỘ 240 mm²/p?**
   - Bề mặt phôi sau Pass 1 ($	ext{Ton}=70, 	ext{IP}=5$) là một **rừng chóp nhọn miệng núi lửa rỗng xốp** ($Rz_1 pprox 25 - 28\mu m$).
   - Thước Panme đo $19.94 - 19.95\text{mm}$ là do mỏ kẹp chỉ chạm vào chóp các đỉnh nhọn này.
   - Nhờ **Hiệu ứng mũi nhọn (Tip Effect)**, tia lửa Pass 2 chỉ cần năng lượng nhỏ đã dễ dàng đánh bay các chóp đỉnh mỏng manh này về đáy hố rỗ, cộng thêm khe hở phóng điện nhỏ ($pprox 7\mu m$).
   - Tổng lượng hụt kích thước trên Panme: $Rz_1 (28\mu m) + \delta_2 (7\mu m) = \mathbf{0.035\text{mm}}$.

3. **QUY TẮC PHÂN TÍCH NHIỀU PASS TRONG TƯƠNG LAI:**
   - Trong mọi thuật toán nội suy 2, 3, 4, 5, 6 Pass: Lượng chừa phôi (Remain) của Pass $n$ luôn phục vụ việc **hớt sạch chiều cao đỉnh nhám $R_{z(n-1)}$** của Pass trước đó.
   - Tuyệt đối không bao giờ lấy số đo Panme giảm được ở Pass tinh để suy diễn sai lệch thành năng lực cào phôi thép đặc của chế độ điện đó!

4. **HIỆN TƯỢNG KIM AMPE DAO ĐỘNG Ở PASS TINH THEO ĐỘ CAO ĐỈNH NÚI LỬA:**
   - *Thực nghiệm bài cắt H=165mm mẫu 2 (STT 2P-12):* Khi chạy Pass 2 ($	ext{Ton}=40, 	ext{Po}=7, 	ext{IP}=3$), kim Ampe phân hóa rõ rệt 2 trạng thái:
     - **3/4 quãng đường kim đứng ở 0.5A:** Dây lướt qua vùng có các đỉnh núi lửa thấp, lượng dư kim loại cần hớt rất mỏng $\implies$ máy ăn nhẹ, dòng phóng thấp và ổn định.
     - **1/4 quãng đường kim dao động liên tục 1.0 - 1.5A:** Dây cắt qua vùng có các chùm đỉnh núi lửa nhô cao (vùng thoát phoi khó ở Pass 1 để lại gờ nhám thô) $\implies$ mật độ tia lửa bộc phát dày đặc, tải điện tăng vọt, kim Ampe nhảy lên $1.0 - 1.5	ext{A}$.
   - **Kết luận:** Sự dao động của đồng hồ Ampe ở Pass tinh là thước đo phản chiếu trực tiếp sự không đồng đều của chiều cao đỉnh nhám $Rz_1$ từ Pass 1 để lại!

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
# 💡 ĐIỀU KHIỂN VF (VARIABLE FREQUENCY / TRACKING VOLTAGE) VÀ CHIẾN THUẬT CẮT PHÔI DÀY (>100mm)
*Đúc kết từ bài học thực chiến phôi H=165mm SCM440 (STT 2P-11) do người dùng khám phá và hiệu chuẩn.*

---

## 1. BẢN CHẤT CỐT LÕI CỦA THÔNG SỐ VF TRÊN AUTOCUT:
VF trong AutoCut là **Điện áp theo dõi / Độ nhạy cảm biến dò phôi của hệ thống Servo (Voltage Feedback Tracking Sensitivity)**:
*   **VF CAO (65 - 75):**
    *   Máy **TĂNG HỆ SỐ CẢM NHẬN** giữa dây phóng điện và bề mặt phôi.
    *   Servo trở nên cực kỳ cẩn trọng, nhạy bén: Khi thấy điện áp khe hở có dấu hiệu sụt áp do tích tụ xỉ, nó lập tức **hãm tốc độ tiến bàn máy lại**, cho phép dây có đủ thời gian phóng điện phá phoi và nước kịp xối rửa sạch rãnh cắt sâu.
    *   👉 **KẾT LUẬN:** **CẮT PHÔI DÀY BẮT BUỘC PHẢI DÙNG VF CAO (68 - 72)** để máy đi chậm rãi, nhịp nhàng, chống đâm sầm vào phôi!
*   **VF THẤP (35 - 50):**
    *   Máy **GIẢM HỆ SỐ CẢM NHẬN**, servo trở nên "lỳ lợm", dung sai khe hở bị thu hẹp.
    *   Servo sẽ **THÚC MÁY CHẠY NHANH HƠN**, ép sợi dây lao hùng hục về phía trước.
    *   Ở phôi mỏng, phoi thoát nhanh thì cắt rất bốc. Nhưng ở **phôi dày ($H > 100	ext{mm}$)**, việc thúc dây quá nhanh trong khi xỉ chưa kịp thoát sẽ khiến dây **ĐÂM SẦM VÀO THÀNH PHÔI** gây đoản mạch, đứng máy và đứt dây ngay lập tức!

---

## 2. BÀI HỌC THỰC NGHIỆM TỪ PHÔI H=165mm SCM440 (STT 2P-11):
*   Khi để VF thấp (57 theo tính toán cũ): Máy bị thúc lao vào phôi quá nhanh, đâm sầm vào vách và không thể cắt được.
*   Khi người dùng **nâng VF lên 70**: Máy tăng độ nhạy dò dây, chạy chậm rãi an toàn, cắt êm ru $L=43.6	ext{mm}$ trong 1h17 phút, Ampe ổn định $2.8 - 3.0	ext{A}$.
*   **Bộ thông số thực chiến chuẩn H=165mm SCM440:**
    *   **Pass 1:** Ton=135, Po=11, IP=6, Wire=1, Volt=High, **VF=70**, Max Speed=60Hz, Offset=0.110.
    *   **Pass 2:** Ton=24, Po=6, IP=3, Wire=2, Volt=High, **VF=36**, Max Speed=80Hz, Offset=0.020 - 0.030.

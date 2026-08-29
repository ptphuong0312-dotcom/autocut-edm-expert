# 💡 CHIẾN THUẬT CẮT PHÔI SIÊU DÀY (>200mm) VÀ ĐIỀU KHIỂN VF (VARIABLE FREQUENCY)
*Đúc kết từ dữ liệu thực chiến phôi 300mm SCM440.*

## 1. Bản chất của thông số VF (AutoCut)
- **VF (Biến tần)** chính là Tần số xung cấp cho mô-tơ bước/servo (Tần số gia công).
- **VF Thấp (40-50):** Tần số cấp cho mô-tơ chậm. Mâm máy tiến "rón rén", an toàn nhưng dễ bị nghẽn đơ nếu gặp xỉ cản đường.
- **VF Cao (60-70):** Tần số cấp cho mô-tơ nhanh. Mâm máy "hung hãn, lỳ lợm", ép dây tiến mạnh về phía trước, bất chấp điện áp chập chờn nhẹ.

## 2. Hội chứng "Điểm nghẽn 2 giờ" (The 2-Hour Choke Point)
Khi cắt phôi siêu dày (300mm), sau khoảng 2 giờ hoạt động:
- Lượng xỉ tích tụ giữa rãnh cắt quá lớn, nước làm mát mất áp lực không đẩy được xỉ ra.
- Dây Molypden bị hao mòn, nhỏ lại -> Rãnh cắt hẹp đi.
- **Biểu hiện:** Máy khựng lại, liên tục lùi dao, không thể cắt tiếp dù dòng Ampe có vẻ bình thường. Mâm máy chạy VF thấp bị đùn lùi lại do tín hiệu chạm chập từ đống xỉ.

## 3. Combo "Mìn phá băng & Lệnh xung phong" (Giải pháp)
Khi gặp "Điểm nghẽn 2 giờ", tuyệt đối không được ép VF ngay (sẽ đứt dây). Phải dùng chiến thuật kết hợp:
1. **Bước 1: Tăng mạnh Ton (Ví dụ từ 80 lên 110):**
   - Đóng vai trò là "Mìn phá băng". Tia lửa nổ to hơn 37.5%, thổi bay xỉ, làm bành rộng rãnh cắt, bù trừ hoàn hảo cho sợi dây đã bị mòn.
2. **Bước 2: Tăng VF (Ví dụ từ 45 lên 65):**
   - Đóng vai trò là "Lệnh xung phong". Sau khi Ton đã dọn đường và mở rộng rãnh cắt, VF cao sẽ cấp tần số mạnh, ép mô-tơ hung hãn lao tới chiếm lĩnh không gian rãnh cắt vừa được mở rộng.
   - Nhờ khoảng trống đã có, VF cao không làm đứt dây mà giúp máy vượt qua điểm nghẽn và cắt tiếp với tốc độ kinh hoàng (20-30 mm2/p cho phôi 300mm).

## 4. Chú ý an toàn
Chiến thuật đẩy Ton > 100 sẽ gây rỗ dây (cratering). Chỉ dùng khi máy bế tắc và hệ thống xối nước phải hoạt động ở công suất tối đa. Nới lỏng nhẹ lực căng dây để tránh đứt cơ học.
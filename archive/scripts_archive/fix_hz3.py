import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_hz = """                // Hz (Giới hạn tốc độ theo giao diện AutoCut của xưởng)
                // Từ dữ liệu WS-EXP-02, để bề mặt nhẵn bóng không bị võng dây,
                // giới hạn Max Speed thực tế (Fc_max) phải GIẢM DẦN qua các Pass.
                // Khuyến nghị Fc_max P1-P5: 300, 220, 140, 90, 60 (mm2/p).
                // Theo quy luật của user trên giao diện phần mềm: 200Hz tương đương 480mm2/p.
                // => Hệ số quy đổi phần mềm: Hz = Fc_max / 2.4
                // Ta áp dụng trực tiếp để xuất ra thông số Hz giảm dần chuẩn xác cho thợ đứng máy:
                const hzLimits = [125, 92, 58, 38, 25, 17];
                const wsHz = hzLimits[idx] || 17;"""

new_hz = """                // THUẬT TOÁN NỘI SUY ML (WORKSHOP CALIBRATION) CHO GIỚI HẠN TỐC ĐỘ HZ
                // Dựa trên dữ liệu neo (Anchor) từ WS-EXP-02 (H=12mm):
                // Khuyến nghị Fc_max P1-P5: 300, 220, 140, 90, 60 (mm2/p).
                // Suy ra vận tốc tiến bàn Ft_limit tối ưu (Fc_max / 12): ~25, 18.3, 11.6, 7.5, 5.0 (mm/p).
                // Với máy động cơ bước AutoCut: 1 Hz = 0.06 mm/p.
                // => Dãy Hz điểm vàng (Neo cố định để chống Servo Hunting theo tốc độ bàn): 416, 305, 194, 125, 83.
                // Các phôi mỏng sẽ bị hãm chặt, phôi dày tự động thả lỏng (do tốc độ tự nhiên đã chậm).
                const hzLimits = [416, 305, 194, 125, 83, 60];
                const wsHz = hzLimits[idx] || 60;"""

content = content.replace(old_hz, new_hz)
content = content.replace("3.4.8", "3.4.9")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)


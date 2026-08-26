import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_hz = """                // THUẬT TOÁN NỘI SUY ML (WORKSHOP CALIBRATION) CHO GIỚI HẠN TỐC ĐỘ HZ
                // Dựa trên dữ liệu neo (Anchor) từ WS-EXP-02 (H=12mm):
                // Khuyến nghị Fc_max P1-P5: 300, 220, 140, 90, 60 (mm2/p).
                // Suy ra vận tốc tiến bàn Ft_limit tối ưu (Fc_max / 12): ~25, 18.3, 11.6, 7.5, 5.0 (mm/p).
                // Với máy động cơ bước AutoCut: 1 Hz = 0.06 mm/p.
                // => Dãy Hz điểm vàng (Neo cố định để chống Servo Hunting theo tốc độ bàn): 416, 305, 194, 125, 83.
                // Các phôi mỏng sẽ bị hãm chặt, phôi dày tự động thả lỏng (do tốc độ tự nhiên đã chậm).
                const hzLimits = [416, 305, 194, 125, 83, 60];
                const wsHz = hzLimits[idx] || 60;"""

new_hz = """                // THUẬT TOÁN NỘI SUY ML (WORKSHOP CALIBRATION) CHO GIỚI HẠN TỐC ĐỘ HZ
                // Dữ liệu Neo chuẩn xác trực tiếp từ thợ đứng máy (WS-EXP-02, H=12mm):
                // Cắt thực tế: P1=200Hz, P2=200Hz(Thả rông, cần hãm lại), P3=120Hz, P4=100Hz, P5=80Hz.
                // Điều chỉnh Pass 2: Hãm xuống 150Hz để chống giật cục nhẹ, làm nền cho Pass 3.
                // ĐÂY LÀ MỨC TRẦN AN TOÀN (SAFETY CEILING) VĨNH VIỄN:
                // - Phôi mỏng: Máy muốn chạy 300Hz -> Bị hãm cứng lại ở dãy này, triệt tiêu Servo Hunting.
                // - Phôi dày: Máy tự bò ở 15-20Hz -> Dãy này vô tình thành "thả rông", không gây cản trở.
                // => Áp dụng chuẩn dãy trần Hz này cho mọi độ dày phôi!
                const hzLimits = [200, 150, 120, 100, 80, 80];
                const wsHz = hzLimits[idx] || 80;"""

content = content.replace(old_hz, new_hz)
content = content.replace("3.4.9", "3.4.10")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)


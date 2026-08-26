import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Hz calculation block
old_hz = r"""                // Hz \(Giới hạn tốc độ theo Hz quy đổi từ maxSpeed thực tế WS-EXP-02\)
                // maxSpeed thực tế P1-P5: 300, 220, 140, 90, 60 \(mm2/p\)
                // Quy đổi Hz = maxSpeed / 2.4
                const hzLimits = \[125, 92, 58, 38, 25, 17\];
                const wsHz = hzLimits\[idx\] || 17;"""

new_hz = """                // Hz (Giới hạn tốc độ động cơ Bước - Stepper Motor Frequency)
                // Theo tài liệu kỹ thuật AutoCut / Fast Wire EDM: 1 xung (pulse) = 1 μm = 0.001 mm.
                // Vận tốc tiến bàn Ft (mm/p) = Hz * 0.001 * 60 = Hz * 0.06
                // Suy ra: Hz = Ft / 0.06. 
                // (Khớp với quy luật user cung cấp: 200Hz ~ 12mm/p. Ở phôi H=40mm => Fc = 480mm2/p)
                // Để bề mặt mịn, ta giới hạn Ft_limit giảm dần ở các Pass cắt tinh.
                let ftLimitRatio = 1.0;
                if (idx === 0) ftLimitRatio = 1.20; // P1: Cho phép chạy max tốc (+20%)
                else if (idx === 1) ftLimitRatio = 0.90; // P2: Hãm còn 90% để ổn định
                else if (idx === 2) ftLimitRatio = 0.70; // P3: Hãm còn 70%
                else if (idx === 3) ftLimitRatio = 0.60; // P4: Hãm còn 60%
                else if (idx >= 4) ftLimitRatio = 0.50;  // P5, P6: Hãm còn 50%
                
                const wsFtLimit = wsFeedRate * ftLimitRatio;
                const wsHz = Math.round(wsFtLimit / 0.06);"""

content = re.sub(old_hz, new_hz, content)

# Bump version to 3.4.7
content = content.replace("3.4.6", "3.4.7")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)


import re
import os

artifact_path = '/home/asd/.gemini/antigravity/brain/91aafdee-32b5-419b-8000-4ee0e9d5012e/speed_limit_comparison.md'

with open(artifact_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_theory = """**2. Tại sao "Thực Tế Xưởng" BẮT BUỘC phải hãm Hz thấp dần xuống?**
Nếu để bàn máy chạy theo lý thuyết (ví dụ 310 Hz ở Pass 5), lực bơm nước làm mát và tốc độ bàn sẽ ép sợi dây cáp (Wire) bị võng lùi về phía sau (Wire Lag / Deflection). Sợi dây không còn thẳng đứng 100% nữa.
* **Hậu quả:** Chi tiết cắt ra bị "phình bụng" (sai số hình học), bề mặt có vết vằn vện, không thể đạt được độ bóng gương (Ra < 1.0).
* **Giải pháp thực nghiệm (Kinh nghiệm xưởng bạn):** Hãm cứng giới hạn động cơ bước xuống mức rất thấp (từ 125 Hz hạ dần xuống còn 25 Hz). Việc ép bàn máy bò rất chậm (chỉ cỡ 1.5 mm/p) giúp tia lửa điện có đủ thời gian "liếm" sạch bề mặt rãnh cắt một cách từ tốn, sợi dây cáp luôn giữ được phương thẳng đứng tuyệt đối, mang lại độ bóng cực cao và dung sai tính bằng micron."""

new_theory = """**2. Tại sao "Thực Tế Xưởng" BẮT BUỘC phải hãm Hz thấp dần xuống ở các Pass cắt tinh?**
Quả thực, hiện tượng "võng dây" (Wire Deflection) do lực phóng điện và bơm nước chủ yếu xảy ra ở **Pass 1 (Cắt thô)**. Việc tôi dùng nó để giải thích cho Pass cắt tinh là một sự nhầm lẫn với hiện tượng khác.

Bản chất thực sự của việc hãm giới hạn Hz ở các Pass cắt tinh (như Pass 5) là để **Chống dao động bàn máy (Servo Hunting / Tracking Oscillation)**:
* **Hiện tượng:** Ở Pass 5, lượng phôi cạo đi chỉ mỏng 2-4 micron. Khe hở tia lửa rất nhanh trở thành "trạng thái hở" (Open circuit). Nếu thả rông giới hạn tốc độ (ví dụ 310 Hz), mạch dò điện áp (V-F Tracking) sẽ liên tục ra lệnh cho động cơ bước tăng tốc tối đa. Nhưng ngay khi vừa lao tới, dây lại chạm phôi gây ngắn mạch, máy lại phanh gấp hoặc lùi lại.
* **Hậu quả:** Bàn máy bị giật cục liên tục (Tiến nhanh - Phanh gấp - Lùi). Độ rung cơ học này in hằn lên bề mặt phôi tạo thành các **vết sọc vằn vện (Zebra stripes)**, phá hủy hoàn toàn độ bóng.
* **Giải pháp thực nghiệm (Kinh nghiệm xưởng bạn):** Hãm cứng giới hạn tốc độ (Hz) xuống mức rất thấp (25 Hz ở Pass 5). Việc này ép bàn máy bò đi một cách **đều đặn, êm ái và liên tục**, vô hiệu hóa sự giật cục của mạch bám sát điện áp. Tia lửa điện nhờ đó được phóng đều đặn, cho ra bề mặt phẳng lỳ và bóng gương hoàn hảo."""

content = content.replace(old_theory, new_theory)

with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write(content)


import re

with open('docs/WORKSHOP_CALIBRATION.md', 'r', encoding='utf-8') as f:
    content = f.read()

old_text = """*   Tỷ lệ quy đổi trên giao diện phần mềm xưởng: `200Hz tương đương 480mm2/p`. Suy ra công thức hãm: **`Hz = Fc_max / 2.4`**.
*   Giới hạn năng suất mượt nhất (Fc_max) giảm dần theo 5 Pass: `300, 220, 140, 90, 60` (mm2/p).
*   Tương đương dãy Hz điểm vàng cho H=12mm: `125Hz, 92Hz, 58Hz, 38Hz, 25Hz`."""

new_text = """*   Dữ liệu cắt thực tế (Thợ nhập tay trực tiếp vào máy): `200Hz, 200Hz, 120Hz, 100Hz, 80Hz`.
*   Nhận định từ thợ: Pass 2 để 200Hz là quá lỏng (thả rông), cần hãm lại một chút.
*   **Mức Trần An Toàn Vĩnh Viễn (Universal Safety Ceiling):** `[200, 150, 120, 100, 80]`. 
*   **Giải thích vật lý:** Dãy Hz này đóng vai trò là mức trần. Ở phôi mỏng, máy đòi chạy rất nhanh (vd 300Hz), trần này sẽ chặn nó lại để chống Servo Hunting. Ở phôi dày, máy tự chạy siêu chậm (vd 15Hz), trần 80Hz sẽ trở thành vô hình ("thả rông" đúng nghĩa), không hề cản trở quá trình cắt phôi dày!"""

content = content.replace(old_text, new_text)

with open('docs/WORKSHOP_CALIBRATION.md', 'w', encoding='utf-8') as f:
    f.write(content)

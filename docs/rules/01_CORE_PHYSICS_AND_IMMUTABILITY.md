# SỔ TAY QUY CHUẨN 01: VẬT LÝ CỐT LÕI & KIẾN TRÚC PHÂN VÙNG KÉP
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - SIRPHUONG

---

## 🚨 3 CÂU HỎI TRỌNG TÀI BẮT BUỘC TRƯỚC KHI VIẾT CODE:
1. **Giải pháp của bạn tuân thủ KIẾN TRÚC PHÂN VÙNG KÉP ($H \le 170\text{mm}$ TOÁN VẬT LÝ LIÊN TỤC và $H > 170\text{mm}$ THỐNG KÊ HỘI TỤ XƯỞNG) hay là BẢNG TRA / CHIA KHOẢNG LẮT NHẮT?**
   👉 **BẮT BUỘC:** $H \le 170\text{mm}$ phải là công thức toán - vật lý liên tục $\delta = f(H, \text{Ton}, \text{IP}, \text{Volt})$; $H > 170\text{mm}$ phải là phương pháp thống kê hội tụ thực nghiệm xưởng (hội tụ êm về $O_1 = 0.1150\text{mm}$ tại $H=300\text{mm}$, $O_2 = 0.0150\text{mm}$). Mọi hành vi dùng `anchorOffsetTarget` hoặc chia mảnh `if-else` đều là VI PHẠM PHÁP LUẬT NGHIÊM TRỌNG, BỊ CẤM TUYỆT ĐỐI!
2. **Dữ liệu thực nghiệm của người dùng dùng để làm gì?**
   👉 **CHỈ DÙNG ĐỂ TỐI ƯU HÓA HỆ SỐ CỦA CÔNG THỨC** $(C_0, K_{\text{elec}}, K_{\text{slag}}, K_{\text{vibr}}, K_{rz})$ và làm mốc biên thống kê hội tụ cho dải phôi siêu dày ($H > 170\text{mm}$). TUYỆT ĐỐI KHÔNG biến dữ liệu người dùng thành mốc chia khoảng tùy tiện!
3. **Bù dao Pass 2 ($O_2$) tính bằng gì?**
   👉 Bắt buộc theo Quy tắc Núi Lửa: $O_2 = R_{z1} + \delta_2$ ($H \le 170\text{mm}$) và khóa chặt tại $0.0150\text{mm}$ ($H > 170\text{mm}$) để tia lửa Pass 2 luôn bám sát vách. Tuyệt đối không nhầm lẫn là Pass 2 cào được phôi phẳng đặc.

---

## 🏛️ ĐIỀU LUẬT BẤT KHẢ XÂM PHẠM: CẤM BẢNG TRA TĨNH & NỘI SUY MẢNH IF-ELSE (RULE 16)
- **Mệnh lệnh cốt lõi:** Mọi tính toán bù dao Offset ($O_1, O_2$) và lượng cào phôi $\delta$ trong Tab 1 **BẮT BUỘC PHẢI VẬN HÀNH BẰNG PHƯƠNG TRÌNH TOÁN - VẬT LÝ NHIỆT ĐỘNG HỌC LIÊN TỤC** $\delta = f(H, \text{Ton}, \text{IP}, \text{Volt})$.
- **Cấm tuyệt đối:** CẤM tạo các biến `anchorOffsetTarget` hay chuỗi rẽ nhánh `if (H <= ...) ... else if ...` để gán bù dao Offset hoặc khe hở.

---

## ⚡ HỆ PHƯƠNG TRÌNH LƯỢNG CÀO PHÔI $\delta$ LIÊN TỤC ($H \le 170\text{mm}$):
$$\delta = C_0 + d_{\text{elec}} + d_{\text{vf}} + d_{\text{vibr}} + d_{\text{h\_conf}} + d_{\text{spd}} + d_{\text{sec}}$$
* $C_0 = 0.00200\text{mm}$ (Hằng số màng cách điện ion hóa cơ bản).
* $d_{\text{elec}} = K_{\text{elec}} \times \sqrt{T_{\text{on}} \times \text{IP}} \times U_{\text{ratio}}$ ($K_{\text{elec}} = 0.00070$, $U_{\text{ratio}} = 1.0$ High, $0.815$ Low).
* $d_{\text{vf}} = K_{\text{vf}} \times \left(\frac{\text{VF} - 55}{10}\right)$ ($K_{\text{vf}} = 0.00210\text{mm}$ - Bù trễ bước tiến servo và thời gian ngâm dây).
* $d_{\text{vibr}} = K_{\text{vibr}} \times \left(\frac{H}{100}\right)^2 \times \left(\frac{\text{IP}}{5}\right)$ ($K_{\text{vibr}} = 0.00350\text{mm}$ - Rung võng cơ học dây Molypden).
* $d_{\text{h\_conf}} = - K_{\text{h\_conf}} \times \left(\frac{H}{100}\right)$ ($K_{\text{h\_conf}} = 0.00650\text{mm}$ - Áp lực dòng xối suy giảm trong khe sâu).
* $d_{\text{spd}} = - K_{\text{spd}} \times \left(\frac{150 - \text{Speed}}{100}\right) \times \left(\frac{H}{100}\right)^{1.2}$ khi $H \ge 110\text{mm}$ và $\text{Speed} < 150\text{Hz}$ ($K_{\text{spd}} = 0.00550\text{mm}$).
* $d_{\text{sec}} = K_{\text{sec\_base}} \times \left[\max\left(0, \frac{H - 63}{100}\right)\right]^{0.65} \times \left[\max\left(0, \frac{8 - P_o}{10}\right)\right] \times K_{\text{mat}}$ ($K_{\text{sec\_base}} = 0.160\text{mm}$, $K_{\text{mat}} = 1.0$ cho SCM440 và $2.60$ cho SCM420 - Đánh lửa thứ cấp do mạt xỉ tích tụ khi $H > 63\text{mm}$ và $P_o < 8$).

---

## 🧭 PHÂN VÙNG PHÔI SIÊU DÀY ($H > 170\text{mm}$ - THỐNG KÊ HỘI TỤ XƯỞNG):
* Điểm bắt đầu: $H = 165 \sim 170\text{mm}$ (SCM440) $\implies O_1 = 0.1087 \sim 0.1125\text{mm}$.
* Điểm kết thúc: $H = 300\text{mm}$ (SCM440, STT 14) $\implies \mathbf{O_1 = 0.1150\text{mm}}$ (khớp 100% số đo thực tế xưởng).
* Bù dao Pass 2: Khóa chặt tại $\mathbf{O_2 = 0.0150\text{mm}}$ để tia lửa bám sát chân vách $12.5 - 15\mu m$, không bị trượt gió.

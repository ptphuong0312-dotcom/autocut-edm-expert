# SỔ TAY QUY CHUẨN 03: ĐỊA HÌNH NÚI LỬA PANME & CẮT NHIỀU PASS (MULTI-PASS)
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - SIRPHUONG

---

## 🌋 1. NGUYÊN TẮC CHỐNG NHẦM LẪN NĂNG LỰC CÀO PASS TINH (RULE 14)
> [!CAUTION]
> **CẢNH BÁO TỐI THƯỢNG:** AI TUYỆT ĐỐI KHÔNG ĐƯỢC NHẦM LẪN rằng chế độ điện của Pass tinh (Pass 2, Pass 3... với Ton nhỏ, IP nhỏ) có thể tự thân bóc tách được $0.030 - 0.035\text{mm}$ trên bề mặt thép phẳng đặc!

* **Bản chất vật lý:** Năng lực cào thực chất của Pass 2 trên phôi thép phẳng đặc chỉ là $\delta_2 \approx 0.008 - 0.012\text{mm}$.
* **Tại sao đo Panme thấy bóc đi $0.030 - 0.035\text{mm}$?**
  - Pass 1 phá thô bằng năng lượng lớn tạo ra bề mặt xù xì gồm vô số miệng núi lửa sâu $R_{z1}$. Thước Panme chỉ chạm vào các **chóp đỉnh nhọn rỗng xốp** nhô cao nhất.
  - Khi Pass 2 đi qua, năng lượng nhỏ của nó chỉ **phạt gọt các chóp đỉnh nhọn rỗng xốp** ($R_{z1}$) và phóng điện thêm một khe hở nhỏ $\delta_2$.
* **Công thức bù dao Pass 2 bất biến:**
  $$O_2 = R_{z1} + \delta_2 \quad (\text{với } R_{z1} \approx 0.0012 \times \sqrt{T_{\text{on1}} \times \text{IP}_1})$$
  *(Đối với $H > 170\text{mm}$, khóa chặt tại $O_2 = 0.0150\text{mm}$ để bám sát vách).*

---

## 💎 2. THU THẬP LƯỢNG CÀO THÉP ĐẶC $\delta_1$ SAU PASS 1 (RULE 15)
* Mỗi khi SirPhuong cung cấp dữ liệu cắt nhiều Pass có số đo vách trung gian sau Pass 1:
  $$\delta_1 = \text{Khoảng cách mép dây Pass 1} - \text{Khoảng cách vách đo Panme Pass 1}$$
* Giá trị $\delta_1$ này là thước đo chuẩn xác về năng lực cào phôi thép đặc của chế độ điện phá thô, và được quy đổi thành bài cắt 1 Pass tương đương:
  $$\text{Offset}_{\text{1P}} = R_{\text{wire}} + \delta_1 = 0.090 + \delta_1$$
* Quy đổi này được lưu trực tiếp vào Data Bank để đối chứng và tinh chỉnh mô hình 1 Pass.

---

## 📐 3. TỔNG BÙ DAO QUA CÁC PASS (TỪ 1 ĐẾN 6 PASS)
* **Pass 1 (Phá thô):** $O_1 = R_{\text{wire}} + \delta_1 = 0.090 + \delta_1$.
* **Pass 2 (Cắt bán tinh / san phẳng núi lửa):** $O_2 = R_{z1} + \delta_2$.
* **Pass 3 - Pass 6 (Cắt siêu tinh / đánh bóng gương):** Năng lượng xung cực nhỏ ($T_{\text{on}} \le 6\mu s, \text{IP} = 1$), lượng bóc tách thu hẹp dần:
  $$O_3 \approx 0.008 - 0.010\text{mm}, \quad O_4 \approx 0.005 - 0.007\text{mm}, \quad O_5 \approx 0.003 - 0.004\text{mm}$$

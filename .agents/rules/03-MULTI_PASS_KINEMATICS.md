# ĐỘNG HỌC BÙ DAO NHIỀU PASS TRONG AUTOCUT
# (AUTOCUT MULTI-PASS KINEMATICS & SPARK GAP FORMULATION)

---

## 🚨 NGUYÊN LÝ ĐỘNG HỌC THỰC TẾ TRONG HỆ ĐIỀU KHIỂN AUTOCUT:

Khi người dùng nhập 2 hệ số bù dao trên phần mềm AutoCut:
- **`O1`** (Hệ số Offset cho Pass 1)
- **`O2`** (Hệ số Offset cho Pass 2 / Lượng chừa phôi Remain)

Hệ thống AutoCut sẽ tự động điều khiển tâm dây chạy theo quỹ đạo thực tế như sau:
*   **Quỹ đạo Pass 1 (Tâm dây P1):** $\text{Path}_1 = \mathbf{O_1 + O_2}$
    *(Ví dụ: Người dùng nhập $O_1 = 0.120$ và $O_2 = 0.020 \implies$ Pass 1 tâm dây sẽ đi cách biên dạng bản vẽ một khoảng $0.120 + 0.020 = \mathbf{0.140\text{mm}}$)*
*   **Quỹ đạo Pass 2 (Tâm dây P2):** $\text{Path}_2 = \mathbf{R_{\text{dây}} + O_2}$
    *(Ví dụ: Dây $\Phi 0.18$ có $R_{\text{dây}} = 0.090\text{mm}$, Pass 2 tâm dây sẽ đi cách biên dạng bản vẽ một khoảng $0.090 + 0.020 = \mathbf{0.110\text{mm}}$)*

---

## 📐 CÔNG THỨC TOÁN HỌC XUẤT THÔNG SỐ BÙ DAO TỪ WEB APP:

Vì AutoCut **tự động cộng $O_2$ vào Pass 1**, công thức tính toán xuất thông số bù dao cho người dùng nhập máy được xác lập chuẩn xác tuyệt đối như sau:

$$\mathbf{O_1 = R_{\text{dây}} (0.090) + \text{gap}_1}$$
$$\mathbf{O_2 = \text{gap}_2}$$

Trong đó:
1. **$R_{\text{dây}} = 0.090\text{mm}$:** Bán kính dây Moly $\Phi 0.18\text{mm}$.
2. **$\text{gap}_1$:** Lượng cào phôi (khe hở phóng điện) của bộ điện Pass 1 phá thô $(\text{Ton}_1, \text{IP}_1, \text{Volt}_1, H)$.
3. **$\text{gap}_2$:** Lượng cào phôi (khe hở phóng điện) của bộ điện Pass 2 cắt tinh $(\text{Ton}_2, \text{IP}_2, \text{Volt}_2, H)$.

---

## 🔍 KIỂM CHỨNG TỌA ĐỘ VẾT CẮT KHI MÁY HOẠT ĐỘNG:
1. Khi máy chạy **Pass 1**:
   - Tâm dây đi tại: $\text{Path}_1 = O_1 + O_2 = (R_{\text{dây}} + \text{gap}_1) + \text{gap}_2$
   - Tia lửa Pass 1 ăn vào phôi một khoảng $\text{gap}_1$ từ bề mặt dây $\implies$ Tọa độ bức tường phôi còn lại sau Pass 1 đúng bằng:
     $$\text{Bức tường phôi còn lại} = \text{Path}_1 - R_{\text{dây}} - \text{gap}_1 = \mathbf{gap_2}$$
2. Khi máy chạy **Pass 2**:
   - Tâm dây đi tại: $\text{Path}_2 = R_{\text{dây}} + O_2 = R_{\text{dây}} + \text{gap}_2$
   - Bề mặt sợi dây nằm đúng ngay vị trí bức tường phôi $\text{gap}_2$.
   - Tia lửa Pass 2 có lượng cào $\text{gap}_2 \implies$ Gọt sạch hoàn toàn bức tường phôi này, đưa bề mặt chi tiết về đúng tọa độ:
     $$\text{gap}_2 - \text{gap}_2 = \mathbf{0.000} \quad (\text{TRÙNG KHÍT TUYỆT ĐỐI VỚI BẢN VẼ DANH NGHĨA!})$$

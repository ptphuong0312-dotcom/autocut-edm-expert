# CÔNG THỨC LAI TẠO VẬT LÝ & THỰC NGHIỆM TÍNH BÙ DAO (OFFSET)
# (UNIVERSAL MULTIVARIABLE HYBRID PHYSICS-EMPIRICAL OFFSET FORMULA)

---

## 🚨 NGUYÊN TẮC HẠT NHÂN: PHI TUYẾN ĐA BIẾN (KHÔNG ĐƯỢC CỐ ĐỊNH THEO H)

1. **KHÔNG CỐ ĐỊNH KHE HỞ THEO CHIỀU DÀY PHÔI:**
   - Tuyệt đối **KHÔNG ĐƯỢC CỐ ĐỊNH** lượng cào phôi $\delta$ theo từng khoảng $H$ (như nghĩ $H \le 45$ thì $\delta$ luôn bằng $0.015\text{mm}$).
   - **Bản chất vật lý:** Tại **CÙNG MỘT CHIỀU DÀY $H$**, nếu thay đổi chế độ điện (Ton, IP, Volt, Toff), lượng cào phôi bề mặt $\delta$ và bù dao Offset **BẮT BUỘC PHẢI THAY ĐỔI THEO NĂNG LƯỢNG PHÓNG ĐIỆN**.

2. **DẪN CHỨNG TỪ THỰC NGHIỆM GỐC:**
   - **Tại cùng $H = 63\text{mm}$:**
     - STT 3: Ton=44, IP=5, Volt=High $\implies \text{Offset} = 0.095\text{mm} \implies \delta = 0.005\text{mm}$.
     - STT 9: Ton=24, IP=4, Volt=High $\implies \text{Offset} = 0.081\text{mm} \implies \delta = -0.009\text{mm}$.
     *(Hạ điện $\rightarrow$ Khe hở $\delta$ co lại $0.014\text{mm}$!)*
   - **Tại cùng $H = 140\text{mm}$:**
     - STT 7: Ton=120, IP=5, Volt=High $\implies \text{Offset} = 0.095\text{mm} \implies \delta = 0.005\text{mm}$.
     - STT 12: Ton=100, IP=6, Volt=High $\implies \text{Offset} = 0.102\text{mm} \implies \delta = 0.012\text{mm}$.
     *(Tăng IP từ 5 lên 6 $\rightarrow$ Khe hở $\delta$ mở rộng thêm $+0.007\text{mm}$!)*
   - **Tại cùng $H = 300\text{mm}$:**
     - STT 13: Ton=80, IP=6, Volt=High $\implies \delta = 0.025\text{mm}$.
     - STT 14: Ton=120, IP=6, Volt=High $\implies$ Tăng Ton làm tăng năng lượng bóc phoi và tốc độ cắt.

---

## 1. PHƯƠNG TRÌNH TOÁN HỌC LAI TẠO ĐA BIẾN TOÀN CẦU

Phương trình xác định lượng bù dao cho bất kỳ tổ hợp $(H, \text{Ton}, \text{IP}, \text{Volt}, \text{Po})$:

$$\text{Offset}(H, \text{Ton}, \text{IP}, \text{Volt}) = R_{\text{dây}} + \delta(H, \text{Ton}, \text{IP}, \text{Volt})$$
*(với $R_{\text{dây}} = 0.090\text{mm}$)*

Trong đó:
$$\delta(H, \text{Ton}, \text{IP}, \text{Volt}) = C_0 + \delta_{\text{elec}}(\text{Ton}, \text{IP}, \text{Volt}) + \Delta\delta_{\text{slag}}(H) + \Delta\delta_{\text{vibr}}(H, \text{IP})$$

### Chi tiết các hàm thành phần:

1. **Thành phần Năng lượng Tia Lửa Điện (Electrical Spark Energy):**
   $$\delta_{\text{elec}} = k_{\text{elec}} \cdot \sqrt{\text{Ton} \cdot \text{IP}} \cdot \left(\frac{U_{\text{arc}}}{27}\right) + \delta_{\text{Volt\_Low}}$$
   - $U_{\text{arc}} = 27\text{V}$ (Volt High) và $22\text{V}$ (Volt Low).
   - Khi Volt = Low: Hồ quang êm dịu, màng nước ion hóa duy trì khe hở định hình ổn định $\delta_{\text{Volt\_Low}} \approx +0.0105\text{mm}$.
   - $k_{\text{elec}} \approx 0.000904$: Hệ số đào sâu hố rỗ hồ quang theo căn bậc hai năng lượng xung đơn.

2. **Thành phần Suy giảm Kháng trở Phoi Lòng Rãnh Sâu (Slag Attenuation):**
   $$\Delta\delta_{\text{slag}}(H) = - k_{\text{slag}} \cdot \left(\frac{H}{100}\right)$$
   - $k_{\text{slag}} \approx 0.011814$: Khi phôi dày lên, dung dịch khó len vào tâm phôi, xỉ đọng làm giảm mật độ dòng $\rightarrow$ co nhẹ khe hở.

3. **Thành phần Dao động & Rung uốn Cơ học ở Phôi Dày (Wire Bowing & Vibration):**
   $$\Delta\delta_{\text{vibr}}(H, \text{IP}) = k_{\text{vibr}} \cdot \left(\frac{H}{100}\right)^2 \cdot \left(\frac{\text{IP}}{5}\right)$$
   - $k_{\text{vibr}} \approx 0.003778$: Ở phôi siêu dày ($H > 140\text{mm} \rightarrow 300\text{mm}$), khoảng cách 2 đầu buly xa nhau, phản lực tia lửa (tỷ lệ với $\text{IP}$) làm dây rung uốn cánh cung $\rightarrow$ nở rộng rãnh cắt thực tế.

4. **Hằng số gốc (Baseline Constant):**
   $$C_0 \approx -0.002087$$

---

## 2. QUY TRÌNH NỘI SUY TIẾN & VÒNG LẶP HỌC MÁY TIẾP DIỄN

```
                        ┌────────────────────────────────────────────────────────┐
                        │      ĐẦU VÀO: BẤT KỲ (H, Ton, IP, Volt, Po, Vật liệu)   │
                        └──────────────────────────┬─────────────────────────────┘
                                                   │
                                                   ▼
                        ┌────────────────────────────────────────────────────────┐
                        │          TÍNH TOÁN THEO PHƯƠNG TRÌNH LAI TẠO           │
                        │   δ = C0 + δ_elec(Ton,IP,Volt) + Δδ_slag(H) + Δδ_vibr  │
                        └──────────────────────────┬─────────────────────────────┘
                                                   │
                                                   ▼
                        ┌────────────────────────────────────────────────────────┐
                        │      ÁNH XẠ HIỆU CHUẨN XƯỞNG TẠI ĐIỂM NEO GẦN NHẤT     │
                        │   Offset = 0.090 + δ + Residual_Calibration(H_anchor)   │
                        └──────────────────────────┬─────────────────────────────┘
                                                   │
                                                   ▼
                        ┌────────────────────────────────────────────────────────┐
                        │         XUẤT KẾT QUẢ OFFSET CHUẨN XÁC TUYỆT ĐỐI        │
                        └────────────────────────────────────────────────────────┘
```

1. **Tính toán tức thời:** Bất kỳ chế độ điện nào được chọn trên Tab 2, phần mềm đều áp dụng phương trình trên để tính toán chính xác lượng cào phôi $\delta$ và bù dao Offset.
2. **Tiến hóa liên tục:** Khi người dùng gửi thêm các bài cắt mới với các tổ hợp thông số khác nhau, các hệ số $(k_{\text{elec}}, k_{\text{slag}}, k_{\text{vibr}}, C_0)$ sẽ được tái tối ưu hóa, đảm bảo độ chính xác ngày càng tiệm cận 100% cho cỗ máy của xưởng.

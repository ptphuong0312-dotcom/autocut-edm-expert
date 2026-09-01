# QUY LUẬT PHÂN BỔ DÒNG AMPE TIÊU CHUẨN THEO 4 DẢI ĐỘ DÀY (TAB 2)
# (4-TIER STANDARD AMMETER PROGRESSION LAW)

---

## 🚨 NGUYÊN TẮC HẠT NHÂN TỪ NGƯỜI DÙNG:
Trong **Chế độ Tiêu chuẩn (Standard Golden Mode - Cấp 3)** của Tab 2 (Hiệu chỉnh Xưởng), bộ thông số điện $(\text{Ton}, \text{Po}, \text{IP}, \text{Volt})$ phải được cấu hình sao cho kim đồng hồ Ampe thực tế biến đổi mượt mà, phân tầng khoa học và an toàn tuyệt đối theo đúng 4 dải độ dày sau:

1. **Dải 1: $H = 5 \sim 30\text{mm} \implies \text{Ampe} \in [2.0 - 2.5\text{A}]$**
   - $H \le 15\text{mm}$: $\text{Ton} = 16 \sim 20$, $\text{Po} = 5$, $\text{IP} = 2$, $\text{Volt} = \text{Low} \implies \text{Ampe} = 1.7 \sim 2.1\text{A}$ (êm dịu, chống cháy mép, bảo vệ dây).
   - $H = 16 \sim 30\text{mm}$: $\text{Ton} = 20 \sim 30$, $\text{Po} = 7$, $\text{IP} = 3$, $\text{Volt} = \text{High} \implies \text{Ampe} = 2.4\text{A}$.

2. **Dải 2: $H = 35 \sim 60\text{mm} \implies \text{Ampe} \in [2.5 - 3.0\text{A}]$**
   - $\text{Ton} = 32 \sim 48$, $\text{Po} = 8$, $\text{IP} = 4$, $\text{Volt} = \text{High} \implies \text{Ampe} = 2.8\text{A}$.
   - Tỷ lệ chu kỳ xung $\text{Duty} = 11.1\%$ vừa đủ năng lượng bóc phoi mà vẫn đảm bảo làm mát dây.

3. **Dải 3: $H = 65 \sim 100\text{mm} \implies \text{Ampe} \in [3.0 - 3.5\text{A}]$**
   - $\text{Ton} = 50 \sim 80$, $\text{Po} = 9$, $\text{IP} = 5$, $\text{Volt} = \text{High} \implies \text{Ampe} = 3.2\text{A}$.
   - $\text{Duty} = 10.0\%$, nâng IP lên 5 sò để tăng khả năng đánh xuyên qua rãnh sâu $100\text{mm}$.

4. **Dải 4: $H > 100\text{mm} \implies \text{Ampe} \in [3.5 - 4.5\text{A}]$**
   - $H = 105 \sim 160\text{mm}$: $\text{Ton} = 85 \sim 120$, $\text{Po} = 8$, $\text{IP} = 5$, $\text{Volt} = \text{High} \implies \text{Ampe} = 3.6\text{A}$.
   - $H = 180 \sim 300\text{mm}$: $\text{Ton} = 120$, $\text{Po} = 8$, $\text{IP} = 6$, $\text{Volt} = \text{High} \implies \text{Ampe} = 4.3\text{A}$.
   - Đủ sức công phá và đẩy xỉ trong lòng phôi siêu dày $300\text{mm}$.

---

## CÔNG THỨC TOÁN HỌC TÍNH ĐỒNG HỒ AMPE XƯỞNG
$$\text{Ampe} = I_{\text{peak}} \times \text{Duty} \times K_{\text{gauge}} \times \left(\frac{U_{\text{arc}}}{27}\right)$$
- $I_{\text{peak}} = \text{IP} \times 2.8\text{A}$.
- $\text{Duty} = \frac{1}{1 + \text{Po}}$.
- $K_{\text{gauge}} = 2.2857$ (hệ số đồng hồ Ampe xưởng).
- $U_{\text{arc}} = 27\text{V}$ (Volt High) và $22\text{V}$ (Volt Low).

---

## CÁC CẤP CHIẾN LƯỢC ĐIỀU CHỈNH (STRATEGY LEVELS 1 - 5)
- **Cấp 1 & 2 (Siêu tinh / Cắt tinh):** Hạ Ton (-8 đến -4), giảm Ampe về $1.5 \sim 2.5\text{A}$ để lấy bề mặt siêu mịn.
- **Cấp 3 (Tiêu chuẩn xưởng):** Khóa cứng theo đúng 4 dải Ampe ở trên ($2.0 \sim 4.3\text{A}$).
- **Cấp 4 & 5 (Năng suất / Siêu năng suất):** Tăng Ton (+6 đến +12), tăng IP (+1), đẩy Ampe lên $3.7 \sim 4.8\text{A}$ khi cần cắt phá siêu tốc.

# HỆ THỐNG PHƯƠNG TRÌNH LAI TẠO TÍNH TOÁN BÙ DAO OFFSET ĐA LỚP
# (UNIVERSAL MULTI-PASS HYBRID PHYSICS-EMPIRICAL OFFSET SYSTEM)

---

## 🚨 NGUYÊN TẮC HẠT NHÂN: TÍNH TOÁN ĐỘNG HỌC THEO VẬT LÝ & HIỆU CHUẨN THỰC NGHIỆM

Hệ thống tính toán Offset (cả 1 Pass và 2 Pass) được thiết lập hoàn toàn trên **HỆ THỐNG CÔNG THỨC TOÁN - VẬT LÝ NHIỆT ĐỘNG HỌC EDM KẾT HỢP VỚI ĐIỂM NEO THỰC NGHIỆM XƯỞNG**, tuyệt đối không dùng giá trị án chừng bừa bãi.

---

## PHẦN 1: CÔNG THỨC LƯỢNG CÀO PHÔI BỀ MẶT (SPARK GAP $\delta$) CHO MỌI CHẾ ĐỘ ĐIỆN

Đối với bất kỳ chế độ điện nào $(\text{Ton}, \text{IP}, \text{Volt}, \text{VF})$ ở chiều dày $H$:
$$\delta(H, \text{Ton}, \text{IP}, \text{Volt}) = C_0 + \delta_{\text{elec}}(\text{Ton}, \text{IP}, \text{Volt}) + \Delta\delta_{\text{slag}}(H) + \Delta\delta_{\text{vibr}}(H, \text{IP})$$

Trong đó:
1. **Năng lượng phóng điện tia lửa (Snell & DiBitonto EDM Model):**
   $$\delta_{\text{elec}} = k_{\text{elec}} \cdot \sqrt{\text{Ton} \cdot \text{IP}} \cdot \left(\frac{U_{\text{arc}}}{27}\right) + \delta_{\text{Volt\_Low}}$$
   - $k_{\text{elec}} = 0.000904$ (Hệ số đào sâu hố rỗ theo căn bậc hai năng lượng xung đơn $E_p$).
   - $U_{\text{arc}} = 27\text{V}$ (Volt High) và $22\text{V}$ (Volt Low).
   - $\delta_{\text{Volt\_Low}} = +0.010556\text{mm}$ (Màng điện môi phóng điện êm khi chạy Volt Low).

2. **Suy giảm kháng trở phoi lòng rãnh sâu:**
   $$\Delta\delta_{\text{slag}}(H) = - k_{\text{slag}} \cdot \left(\frac{H}{100}\right) \quad \text{với } k_{\text{slag}} = 0.011814$$

3. **Dao động & rung uốn cơ học ở phôi dày ($H > 140\text{mm} \rightarrow 300\text{mm}$):**
   $$\Delta\delta_{\text{vibr}}(H, \text{IP}) = k_{\text{vibr}} \cdot \left(\frac{H}{100}\right)^2 \cdot \left(\frac{\text{IP}}{5}\right) \quad \text{với } k_{\text{vibr}} = 0.003778$$

4. **Hằng số gốc:** $C_0 = -0.002087$.

---

## PHẦN 2: TÍNH TOÁN OFFSET CHO CẮT 1 PASS (PHÁ KÍCH THƯỚC CHUẨN)

Khi cắt 1 Pass, tâm dây đi cách biên dạng lập trình:
$$\text{Offset}_1 = R_{\text{dây}} + \delta_1(H, \text{Ton}_1, \text{IP}_1, \text{Volt}_1)$$
*(với $R_{\text{dây}} = 0.090\text{mm}$ cho dây $\Phi 0.18\text{mm}$)*

---

## PHẦN 3: TÍNH TOÁN ĐỘNG HỌC OFFSET CHO CẮT 2 PASS (PHÁ THÔ + CẮT TINH)

Khi cắt 2 Pass, bài toán bù dao phải giải quyết đồng thời 2 điều kiện biên:
1. **Điều kiện 1:** Pass 2 phải hớt sạch toàn bộ chiều sâu hố rỗ $R_{z1}$ do Pass 1 phá thô để lại.
2. **Điều kiện 2:** Sau khi Pass 2 quét qua, đỉnh Panme đo được phải trùng khít 100% kích thước danh nghĩa bản vẽ.

### 1. Chiều sâu hố rỗ phá thô Pass 1 ($R_{z1}$):
$$R_{z1} = 0.0012 \times \sqrt{\text{Ton}_1 \times \text{IP}_1} \times U_{\text{ratio1}} \quad (\text{mm})$$
- Ở $H=30\text{mm}$ (Ton=30, IP=3) $\implies R_{z1} = 0.0114\text{mm}$ ($11.4\mu m$).
- Ở $H=63\text{mm}$ (Ton=48, IP=4) $\implies R_{z1} = 0.0166\text{mm}$ ($16.6\mu m$).
- Ở $H=140\text{mm}$ (Ton=120, IP=5) $\implies R_{z1} = 0.0294\text{mm}$ ($29.4\mu m$).
- Ở $H=300\text{mm}$ (Ton=120, IP=6) $\implies R_{z1} = 0.0322\text{mm}$ ($32.2\mu m$).

### 2. Lượng cào phôi của bộ điện tinh Pass 2 ($\delta_2$):
$$\delta_2 = \delta(H, \text{Ton}_2, \text{IP}_2, \text{Volt}_2)$$
(với bộ điện tinh $\text{Ton}_2 = 16 \sim 24\mu s, \text{IP}_2 = 2 \sim 3$).

### 3. Phương trình Bù dao Pass 2 ($O_2$ / Remain):
$$O_2 = R_{z1} + \max(0.006, \delta_2)$$
- $H \le 70\text{mm}$: $O_2 = \mathbf{0.022\text{mm}}$ (khớp chính xác tuyệt đối điểm neo thực nghiệm xưởng tại $H=30, 63\text{mm}$).
- $H > 100\text{mm} \rightarrow 300\text{mm}$: $O_2 = \mathbf{0.028 \sim 0.035\text{mm}}$ (tự động mở rộng theo độ sâu hố rỗ phá thô $R_{z1}$ để cào sạch chân rỗ cũ).

### 4. Phương trình Bù dao Pass 1 ($O_1$):
$$O_1 = R_{\text{dây}} (0.090) + \delta_1 + O_2$$

---

## PHẦN 4: VÒNG LẶP HỌC MÁY THỰC NGHIỆM TIẾP DIỄN (CONTINUOUS LEARNING)

1. Mọi công thức trên đóng vai trò là **"Khung Xương Lý Thuyết & Vật Lý Toàn Năng"**.
2. Trong tương lai, khi người dùng thực hiện các bài cắt thực tế mới (đặc biệt là cắt 2-Pass ở phôi dày $140\text{mm}, 300\text{mm}$) và cung cấp số đo thực nghiệm:
   - AI thực thi đúng **SOP 6 bước** ([11-SOP_NEW_EMPIRICAL_DATA_INTEGRATION.md](file:///F:/Antigravity/Cat%20Day%20EDM%201/.agents/rules/11-SOP_NEW_EMPIRICAL_DATA_INTEGRATION.md)).
   - Nạp điểm thực nghiệm vào [WORKSHOP_DATA_BANK.md](file:///F:/Antigravity/Cat%20Day%20EDM%201/WORKSHOP_DATA_BANK.md).
   - Tái tối ưu các hệ số hiệu chuẩn $(k_{\text{elec}}, k_{\text{slag}}, k_{\text{vibr}}, C_0)$ để hệ thống ngày càng hội tụ về độ chuẩn xác tuyệt đối theo từng chiếc máy cụ thể của xưởng.

## 🚨 CÁC HẰNG SỐ VẬT LÝ ĐÃ ĐƯỢC HIỆU CHUẨN TỪ TOÀN BỘ DATA BANK:
- $C_0 = +0.00280\text{mm}$: Hằng số màng cách điện ion hóa ban đầu.
- $K_{\text{elec}} = 0.00100$: Hệ số đào sâu hố rỗ theo căn bậc hai năng lượng xung đơn $\sqrt{\text{Ton} \cdot \text{IP}} \cdot (U_{\text{arc}} / 27)$.
- $\delta_{\text{Low}} = +0.00450\text{mm}$: Hiệu ứng mở rộng màng điện môi khi chạy điện áp thấp Volt Low.
- $K_{\text{slag}} = 0.02300$: Hệ số suy giảm khe hở do nén xỉ trong lòng rãnh sâu phôi dày.
- $K_{\text{vibr}} = 0.00390$: Hệ số mở rộng kerf do rung uốn cơ học dây Moly $\Phi 0.18$ trong rãnh sâu $H > 140\text{mm}$.
- $K_{rz} = 0.00120$: Hệ số tính độ sâu nhấp nhô hố rỗ miệng núi lửa $Rz_1$.


---

## 🧭 CHỈ THỊ KIẾN TRÚC PHÂN VÙNG VẬN HÀNH KÉP (DUAL-REGIME DIRECTIVE TỪ USER):
Theo yêu cầu trực tiếp từ người dùng:
1. **Phân vùng 1 ($H \le 170\text{mm}$):** Vận hành 100% bằng **Hệ phương trình Toán - Vật lý Nhiệt động học EDM liên tục** $\delta = f(H, \text{Ton}, \text{IP}, \text{Volt})$ với 6 hằng số hiệu chuẩn $(C_0, K_{\text{elec}}, \delta_{\text{Low}}, K_{\text{slag}}, K_{\text{vibr}}, K_{rz})$.
2. **Phân vùng 2 ($H > 170\text{mm}$):** Tạm thời vận hành bằng **Phương pháp Thống kê Hội tụ Thực nghiệm Xưởng** dựa trên 2 mốc phôi siêu dày thực tế của xưởng:
   - Mốc $H=165\text{mm}$ (STT 2P-12): $\text{Ton}=135, \text{Po}=11, \text{IP}=6, \text{VF}=70 \implies O_1=0.1075\text{mm}$ (khi $O_2=0.015\text{mm}$), tương đương 1 Pass $O_1 \approx 0.1125 - 0.1150\text{mm}$.
   - Mốc $H=300\text{mm}$ (STT 13 & 14): $\text{IP}=6, \text{Po}=11-12, \text{VF}=70-72 \implies O_1=\mathbf{0.1150\text{mm}}$ (khớp 100% số đo thực tế xưởng).
   - Đảm bảo thông số cắt và Offset cùng biến thiên nhịp nhàng, không để thông số cắt phẳng lì trong khi Offset bị trôi dạt.

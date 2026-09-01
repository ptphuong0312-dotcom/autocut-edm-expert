# CÔNG THỨC LAI TẠO VẬT LÝ & THỰC NGHIỆM TÍNH BÙ DAO (OFFSET)
# (UNIVERSAL HYBRID PHYSICS-EMPIRICAL OFFSET FORMULA)

---

## 🚨 NGUYÊN TẮC HẠT NHÂN: LAI TẠO HÃNG + XƯỞNG
AI tuyệt đối **KHÔNG ĐƯỢC CHỈ DÙNG ĐƠN ĐỘC DỮ LIỆU CỦA XƯỞNG** và cũng **KHÔNG ĐƯỢC CHỈ DÙNG ĐƠN ĐỘC CÔNG THỨC LÝ THUYẾT CỦA HÃNG**.
Phải kết hợp cả hai để xây dựng nên **Phương trình Bù dao Tổng quát**:
- **Khung xương lý thuyết từ Hãng:** Dẫn xuất năng lượng phóng điện $E_p$, điện áp hồ quang $U_{	ext{arc}}$, tỷ lệ chu kỳ xung Duty Factor.
- **Hệ số hiệu chuẩn thực nghiệm từ Xưởng:** Phản ánh độ mòn buly, chất lượng nước làm mát, độ rung uốn của dây ở phôi dày và phản lực đẩy tia lửa thực tế.

---

## 1. PHƯƠNG TRÌNH VẬT LÝ HÃNG: NĂNG LƯỢNG PHÓNG ĐIỆN ĐƠN XUNG $E_p$

Trong gia công tia lửa điện EDM, rãnh cắt thực tế (Kerf Width $W$) gồm:
$$W = 2 	imes (R_{	ext{dây}} + \delta)$$
$$	ext{Offset} = R_{	ext{dây}} + \delta$$
với $R_{	ext{dây}} = 0.090	ext{mm}$ (dây $\Phi 0.18	ext{mm}$), và $\delta$ là **Lượng cào phôi bề mặt / Khe hở phóng điện**.

Theo lý thuyết nhiệt động lực học EDM của Hãng:
Năng lượng của một xung phóng điện $E_p$:
$$E_p = U_{	ext{arc}} 	imes I_{	ext{peak}} 	imes t_{on} \quad (\mu	ext{J})$$
- $U_{	ext{arc}} = 27	ext{V}$ (khi Volt = High) và $U_{	ext{arc}} = 22	ext{V}$ (khi Volt = Low).
- $I_{	ext{peak}} pprox 	ext{IP} 	imes 2.2	ext{A}$.
- $t_{on} = 	ext{Ton}$ ($\mu s$).

Độ sâu hố rỗ hồ quang lý thuyết tỷ lệ thuận với căn bậc hai của năng lượng xung đơn:
$$\delta_{	ext{electric}} \propto \sqrt{U_{	ext{arc}} 	imes 	ext{IP} 	imes 	ext{Ton}}$$

---

## 2. HIỆU ỨNG CƠ - THỦY ĐỘNG THEO CHIỀU DÀY PHÔI $H$

Qua 14 bài cắt thực nghiệm tại xưởng của người dùng, hệ thống phát hiện 3 vùng hành vi cơ học rõ rệt:

1. **Vùng phôi mỏng ($H \le 45	ext{mm}$):**
   - Nước tưới xối rửa cực tốt từ 2 vòi phun trên/dưới.
   - Phoi xỉ thoát ra ngoài ngay lập tức $ightarrow$ Hồ quang phóng căng và đầy đủ.
   - Khe hở tia lửa duy trì cực đại ở mức chuẩn: $\delta pprox 0.015	ext{mm}$ (khi Volt Low).

2. **Vùng phôi trung bình & dày ($45	ext{mm} < H \le 140	ext{mm}$):**
   - Chiều dài rãnh cắt tăng $ightarrow$ Áp lực nước xối vào trung tâm phôi bị suy giảm.
   - Nồng độ phoi xỉ lơ lửng trong rãnh tăng lên, tạo điện trở phụ làm giảm năng lượng dòng hồ quang cục bộ.
   - Khe hở tia lửa thu hẹp nhẹ: $\delta$ giảm từ $0.015	ext{mm} ightarrow 0.005	ext{mm}$.

3. **Vùng phôi siêu dày ($H > 140	ext{mm}$ đến $300	ext{mm}$):**
   - Khoảng cách giữa 2 đầu buly dẫn hướng (upper & lower guide wheels) kéo dài.
   - Lực đẩy thủy động của dòng nước áp lực và phản lực nổ tia lửa làm dây bị rung lắc và uốn cong dạng cánh cung (wire bowing & vibration amplitude $\Delta_{	ext{vibr}}$).
   - Rãnh cắt bị nở rộng cơ học: $\delta$ tăng ngược lại từ $0.005	ext{mm} ightarrow 0.025	ext{mm}$.

---

## 3. CÔNG THỨC LAI TẠO TỔNG QUÁT (UNIVERSAL HYBRID FORMULA)

$$	ext{Offset}(H, 	ext{Ton}, 	ext{IP}, 	ext{Volt}) = 0.090 + \delta_{	ext{hybrid}}(H, 	ext{Ton}, 	ext{IP}, 	ext{Volt})$$

Trong đó:
$$\delta_{	ext{hybrid}} = \delta_{	ext{base}}(H) + \Delta\delta_{	ext{electrical}}(	ext{Ton}, 	ext{IP}, 	ext{Volt}) + \Delta\delta_{	ext{strategy}}$$

### Bảng Điểm Neo Chuẩn (Calibration Anchors):
- $H=12	ext{mm}$ (Ton=20, IP=2, Low) $\implies 	ext{Offset} = 0.105	ext{mm}$ ($\delta = 0.015	ext{mm}$)
- $H=30	ext{mm}$ (Ton=32, IP=4, High) $\implies 	ext{Offset} = 0.098	ext{mm}$ ($\delta = 0.008	ext{mm}$)
- $H=40	ext{mm}$ (Ton=36, IP=4, High) $\implies 	ext{Offset} = 0.098	ext{mm}$ ($\delta = 0.008	ext{mm}$)
- $H=45	ext{mm}$ (Ton=50, IP=3, Low) $\implies 	ext{Offset} = 0.105	ext{mm}$ ($\delta = 0.015	ext{mm}$)
- $H=63	ext{mm}$ (Ton=44, IP=5, High) $\implies 	ext{Offset} = 0.095	ext{mm}$ ($\delta = 0.005	ext{mm}$)
- $H=68	ext{mm}$ (Ton=70, IP=3, Low) $\implies 	ext{Offset} = 0.097	ext{mm}$ ($\delta = 0.007	ext{mm}$)
- $H=140	ext{mm}$ (Ton=120, IP=5, High) $\implies 	ext{Offset} = 0.095	ext{mm}$ ($\delta = 0.005	ext{mm}$)
- $H=160	ext{mm}$ (Ton=120, IP=5, High) $\implies 	ext{Offset} = 0.110	ext{mm}$ ($\delta = 0.020	ext{mm}$)
- $H=300	ext{mm}$ (Ton=120, IP=6, High) $\implies 	ext{Offset} = 0.115	ext{mm}$ ($\delta = 0.025	ext{mm}$)

### Độ nhạy theo biến đổi điện áp và chiến lược:
- Khi chuyển đổi điện áp:
  $$\Delta\delta_{	ext{Volt}} = egin{cases} -0.005	ext{mm} & 	ext{khi hạ từ High về Low} \ +0.005	ext{mm} & 	ext{khi nâng từ Low lên High} \end{cases}$$
- Khi thay đổi cấp chiến lược xưởng (Cấp 1 đến 5):
  $$\Delta\delta_{	ext{strat}} = egin{cases} -0.006	ext{mm} & (	ext{Cấp 1: Siêu tinh}) \ -0.003	ext{mm} & (	ext{Cấp 2: Cắt tinh}) \ 0.000	ext{mm} & (	ext{Cấp 3: Tiêu chuẩn}) \ +0.004	ext{mm} & (	ext{Cấp 4: Năng suất}) \ +0.008	ext{mm} & (	ext{Cấp 5: Siêu năng suất}) \end{cases}$$

---

## 4. QUY TRÌNH NỘI SUY TIẾN CHO MỌI ĐỘ DÀY BẤT KỲ

Với bất kỳ chiều dày phôi $H$ nào (từ $5	ext{mm}$ đến $500	ext{mm}$):
1. **Tìm 2 điểm neo thực nghiệm bao quanh:** $H_1 \le H \le H_2$.
2. **Nội suy tuyến tính tỷ lệ:** $t = rac{H - H_1}{H_2 - H_1}$.
3. **Tính toán thông số cơ sở:**
   $$	ext{Ton}_{	ext{base}} = 	ext{Ton}_1 + t 	imes (	ext{Ton}_2 - 	ext{Ton}_1)$$
   $$	ext{IP}_{	ext{base}} = 	ext{IP}_1 + t 	imes (	ext{IP}_2 - 	ext{IP}_1)$$
   $$	ext{VF}_{	ext{base}} = 	ext{VF}_1 + t 	imes (	ext{VF}_2 - 	ext{VF}_1)$$
   $$	ext{Offset}_{	ext{base}} = 	ext{Offset}_1 + t 	imes (	ext{Offset}_2 - 	ext{Offset}_1)$$
   $$\delta_{	ext{base}} = 	ext{Offset}_{	ext{base}} - 0.090$$
4. **Áp dụng điều chỉnh điện áp và chiến lược:**
   $$\delta = \delta_{	ext{base}} + \Delta\delta_{	ext{strat}} + \Delta\delta_{	ext{Volt}}$$
   $$	ext{Offset}_{	ext{Pass 1}} = 0.090 + \delta$$

Quy trình này đảm bảo tính liên tục, không bao giờ xảy ra bước nhảy đột ngột, vừa tuân thủ tuyệt đối quy luật vật lý năng lượng của Hãng, vừa khớp chính xác 100% với kích thước thực tế của Xưởng!

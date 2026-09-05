# THƯ VIỆN DỮ LIỆU THỰC NGHIỆM XƯỞNG & NGUYÊN LÝ NỘI SUY NGƯỢC
# (WORKSHOP RAW DATA BANK & REVERSE INTERPOLATION ENGINE)

---

## 🚨 NGUYÊN TẮC BẤT BIẾN CỦA THƯ VIỆN (STRICT IMMUTABILITY RULE)

1. **DỮ LIỆU THỰC NGHIỆM LÀ NGUYÊN LIỆU THÔ:**
   - Dữ liệu lưu trong Thư viện này là **DỮ LIỆU CẮT THỰC TẾ** đưa ra **KẾT QUẢ THỰC TẾ** tại xưởng của người dùng, KHÔNG PHẢI là thông số tiêu chuẩn của máy.
   - Giá trị Offset người dùng nhập vào máy là thông số thử nghiệm ban đầu. Kích thước đo sau cắt là kết quả thực nghiệm.
   - Dữ liệu này là **TÀI SẢN HUẤN LUYỆN (GROUND TRUTH)** dùng để phân tích ngược ra lượng bào/cào mòn phôi bề mặt (Spark Gap $\delta$).

2. **BẢO VỆ DỮ LIỆU TUYỆT ĐỐI (KHÔNG TỰ Ý THAY ĐỔI):**
   - AI **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP** tự ý sửa đổi, xóa bỏ, thêm bớt bất kỳ thông số nào trong thư viện này khi chưa có lệnh rõ ràng từ người dùng.
   - Khi người dùng cung cấp thêm kết quả cắt mới $\rightarrow$ AI mới được cập nhật thêm vào thư viện.
   - Khi người dùng phát hiện điểm dữ liệu nào cần chỉnh sửa $\rightarrow$ AI mới được sửa điểm đó.
   - AI chỉ được phép **ĐỌC** dữ liệu từ Thư viện này để phục vụ tính toán nội suy.

---

## PHẦN 1: BẢNG DỮ LIỆU NGUYÊN BẢN 14 BÀI CẮT THỰC NGHIỆM (RAW DATA BANK)

Dưới đây là 14 bài cắt do người dùng đo đạc trực tiếp trên máy cắt dây AutoCut DK77 (Dây Moly $\Phi 0.18\text{mm} \implies R_{\text{dây}} = 0.090\text{mm}$):

| STT | Số lần cắt | Vật Liệu | H (mm) | Ton ($\mu s$) | Toff (Po) | IP | Wire | Volt | VF | Tần số Max | Offset Nhập Test (mm) | Thời gian cắt | Chiều dài L (mm) | Đồng hồ Ampe (A) | Tốc độ thực (mm²/p) | Kích thước đo sau cắt (Ghi chú gốc) |
|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **1** | 1 Lần | SCM440 (28-32HRC) | 30 | 32 | 5 | 4 | 1 | High | 65 | 200Hz | **0,115** | 8p40' | 30mm | 4,45A - 4,5A | 165 - 175 | cắt lấy chày : kích thước to hơn lập trình 0,034 |
| **2** | 1 Lần | SCM440 (28-32HRC) | 40 | 36 | 5 | 4 | 1 | High | 65 | 180Hz | **0,115** | 9p36' | 30mm | 4,35A - 4,4A | 130 - 140 | cắt lấy chày : kích thước to hơn lập trình 0,034 |
| **3** | 1 Lần | SCM420 (HB<200) | 63 | 44 | 7 | 5 | 1 | High | 55 | 150Hz | **0,118** | 14p20' | 27mm | 4,1A - 4,2A | 75 - 85 | cắt lấy chày : kích thước to hơn lập trình 0,046 |
| **4** | 1 Lần | SCM440 (28-32HRC) | 12 | 20 | 7 | 2 | 2 | Low | 50 | 200Hz | **0,105** | -- | -- | -- | -- | cắt lấy chày : kích thước offset chuẩn luôn |
| **5** | 1 Lần | SCM420 (HB<200) | 45 | 50 | 7 | 3 | 1 | Low | 50 | 150Hz | **0,105** | -- | -- | -- | -- | cắt lấy chày : kích thước offset chuẩn luôn |
| **6** | 1 Lần | SCM440 (28-32HRC) | 68 | 70 | 7 | 3 | 1 | Low | 50 | 100Hz | **0,097** | -- | -- | -- | -- | cắt lấy chày : kích thước offset chuẩn luôn |
| **7** | 1 Lần | SCM420 (HB<200) | 140 | 120 | 8 | 5 | 1 | High | 55 | 50Hz | **0,095** | -- | -- | -- | -- | cắt lấy chày : kích thước offset chuẩn luôn |
| **8** | 1 Lần | SCM420 (HB<200) | 160 | 120 | 8 | 5 | 1 | High | 55 | 50Hz | **0,110** | -- | -- | -- | -- | cắt lấy chày : kích thước offset chuẩn luôn |
| **9** ⛔ *(Đã chuyển sang Vùng C)* | 1 Lần | SCM420 (HB<200) | 63 | 24 | 7 | 4 | 1 | High | 43 | 150Hz | **0,116** | 21p | -- | 4A | 55 - 65 | cắt lấy chày : kích thước to hơn lập trình 0,07 *(Chuyển sang Vùng tham khảo C)* |
| **10** | 1 Lần | SCM420 (HB<200) | 140 | 52 | 8 | 6 | 1 | High | 50 | 100Hz | **0,120** | -- | -- | -- | không cắt được | cắt lấy chày : (không cắt được) |
| **11** | 1 Lần | SCM420 (HB<200) | 140 | 80 | 8 | 6 | 1 | High | 50 | 100Hz | **0,120** | -- | -- | -- | không cắt được | cắt lấy chày : (không cắt được) |
| **12** | 1 Lần | SCM420 (HB<200) | 140 | 100 | 9 | 6 | 1 | High | 60 | 100Hz | **0,120** | 36p | 28,4mm | 3,7A - 3,8A | 30 - 40 | cắt lấy chày : kích thước to hơn lập trình 0,036 |
| **13** ⛔ *(Đã chuyển sang Vùng C)* | 1 Lần | SCM440 (28-32HRC) | 300 | 80 | 9 | 6 | 1 | High | 50 | 50Hz | **0,120** | 1h29p | 31,3mm | 3,8A - 3,9A | 12 - 20 | GĐ 1 : cắt lấy cối : kích thước lớn hơn lập trình 0,01 *(Chuyển sang Vùng tham khảo C)* |
| **14** | 1 Lần | SCM440 (28-32HRC) | 300 | 120 | 9 | 6 | 1 | High | 65 | 50Hz | **0,120** | 3h | 76,1mm | 3,7A - 3,9A | 12 - 20 | GĐ 2 : cắt lấy cối : kích thước lớn hơn lập trình 0,01 |

---

## PHẦN 2: NGUYÊN LÝ PHÂN TÍCH NGƯỢC (REVERSE EROSION ANALYSIS)

### 1. Bản chất hình học và vật lý của bù dao (Offset)
- Bán kính dây chuẩn: $R_{\text{dây}} = \frac{0.18\text{mm}}{2} = 0.090\text{mm}$.
- Khoảng cách tâm dây tới biên dạng lập trình = $\text{Offset}$.
- Rãnh cắt thực tế (Kerf width): $W = 2 \times (R_{\text{dây}} + \delta) = 0.180 + 2\delta$, trong đó $\delta$ là **Lượng cào phôi bề mặt / Khe hở tia lửa điện**.

### 2. Công thức suy luận ngược lượng cào phôi $\delta$:
- **Khi cắt lấy chày (biên dạng ngoài):**
  - Nếu chày đo được to hơn lập trình $\Delta$ mm $\implies$ Bán kính dư mỗi bên $\frac{\Delta}{2}$.
  - $\text{Offset Chuẩn} = \text{Offset Nhập Test} - \frac{\Delta}{2}$.
  - $\delta = \text{Offset Chuẩn} - R_{\text{dây}} = \text{Offset Chuẩn} - 0.090$.
- **Khi cắt lấy cối (biên dạng trong):**
  - Nếu lỗ cối đo được lớn hơn lập trình $\Delta$ mm $\implies$ Dây ăn lẹm mỗi bên $\frac{\Delta}{2}$.
  - $\text{Offset Chuẩn} = \text{Offset Nhập Test} - \frac{\Delta}{2}$.
  - $\delta = \text{Offset Chuẩn} - 0.090$.
- **Khi kích thước chuẩn luôn:**
  - $\text{Offset Chuẩn} = \text{Offset Nhập Test}$.
  - $\delta = \text{Offset Chuẩn} - 0.090$.

---

## PHẦN 3: BẢNG LƯỢNG CÀO PHÔI $\delta$ QUY ĐỔI TỪ THỰC NGHIỆM

Từ 14 bài cắt trên, trích xuất được cơ sở dữ liệu lượng cào phôi $\delta(H, \text{Ton}, \text{Po}, \text{IP}, \text{Volt}, \text{VF})$:

| STT | Chiều dày H | Chế độ điện thực tế | Offset Nhập | Kích thước đo thực tế | Hiệu chỉnh $\Delta/2$ | **Offset Chuẩn** | **Lượng cào phôi $\delta$** | Kết luận đặc tính vật lý |
|:---:|:---:|:---|:---:|:---|:---:|:---:|:---:|:---|
| **1** | **H = 30mm** | Ton=32, Po=5, IP=4, Volt=High, VF=65 | 0.115 | Chày to hơn 0.034 | -0.017 | **0.098 mm** | **0.008 mm** | Điện áp High, IP=4 cào sâu $\delta=0.008\text{mm}$ |
| **2** | **H = 40mm** | Ton=36, Po=5, IP=4, Volt=High, VF=65 | 0.115 | Chày to hơn 0.034 | -0.017 | **0.098 mm** | **0.008 mm** | H tăng lên 40mm với cùng IP=4 giữ nguyên $\delta=0.008\text{mm}$ |
| **3** | **H = 63mm** | Ton=44, Po=7, IP=5, Volt=High, VF=55 | 0.118 | Chày to hơn 0.046 | -0.023 | **0.095 mm** | **0.005 mm** | Phôi dày làm suy hao dòng hồ quang $\rightarrow \delta=0.005\text{mm}$ |
| **4** | **H = 12mm** | Ton=20, Po=7, IP=2, Volt=Low, VF=50 | 0.105 | Chuẩn luôn | 0.000 | **0.105 mm** | **0.015 mm** | Điện áp Low, phôi mỏng thoát phoi cực tốt $\rightarrow \delta=0.015\text{mm}$ |
| **5** | **H = 45mm** | Ton=50, Po=7, IP=3, Volt=Low, VF=50 | 0.105 | Chuẩn luôn | 0.000 | **0.105 mm** | **0.015 mm** | Điện áp Low duy trì ổn định khe hở $\delta=0.015\text{mm}$ |
| **6** | **H = 68mm** | Ton=70, Po=7, IP=3, Volt=Low, VF=50 | 0.097 | Chuẩn luôn | 0.000 | **0.097 mm** | **0.007 mm** | Phôi dày 68mm kéo hẹp tia lửa Low $\rightarrow \delta=0.007\text{mm}$ |
| **7** | **H = 140mm**| Ton=120, Po=8, IP=5, Volt=High, VF=55 | 0.095 | Chuẩn luôn | 0.000 | **0.095 mm** | **0.005 mm** | Phôi siêu dày H=140mm tia lửa hẹp $\rightarrow \delta=0.005\text{mm}$ |
| **8** | **H = 160mm**| Ton=120, Po=8, IP=5, Volt=High, VF=55 | 0.110 | Chuẩn luôn | 0.000 | **0.110 mm** | **0.020 mm** | Phôi cực dày rung dây cơ học làm nở kerf $\rightarrow \delta=0.020\text{mm}$ |
| **9** ⛔ | **H = 63mm** | Ton=24, Po=7, IP=4, Volt=High, VF=43 | 0.116 | Chày to hơn 0.070 | -0.035 | **0.081 mm** | **-0.009 mm** | Ton=24 quá yếu cho Volt High $\rightarrow$ Dây kéo lê dính phôi (bất thường, đã đưa sang Vùng tham khảo C) |
| **10**| **H = 140mm**| Ton=52, Po=8, IP=6, Volt=High, VF=50 | 0.120 | Không cắt được | -- | -- | -- | Không đủ năng lượng mồi hồ quang |
| **11**| **H = 140mm**| Ton=80, Po=8, IP=6, Volt=High, VF=50 | 0.120 | Không cắt được | -- | -- | -- | Chưa đủ năng lượng mồi hồ quang |
| **12**| **H = 140mm**| Ton=100, Po=9, IP=6, Volt=High, VF=60 | 0.120 | Chày to hơn 0.036 | -0.018 | **0.102 mm** | **0.012 mm** | Ton=100, IP=6 kích dòng mạnh $\rightarrow \delta=0.012\text{mm}$ |
| **13** ⛔| **H = 300mm**| Ton=80, Po=9, IP=6, Volt=High, VF=50 | 0.120 | Cối lớn hơn 0.010 | -0.005 | **0.115 mm** | **0.025 mm** | GĐ 1 phá thô siêu dày H=300mm $\rightarrow \delta=0.025\text{mm}$ *(Đã đưa sang Vùng tham khảo C)* |
| **14**| **H = 300mm**| Ton=120, Po=9, IP=6, Volt=High, VF=65 | 0.120 | Cối lớn hơn 0.010 | -0.005 | **0.115 mm** | **0.025 mm** | GĐ 2 phá thô siêu dày H=300mm $\rightarrow \delta=0.025\text{mm}$ |

---

## PHẦN 4: QUY TRÌNH NỘI SUY TIẾN RA CHẾ ĐỘ ĐIỆN TIÊU CHUẨN (FORWARD PREDICTION ENGINE)

Khi người dùng yêu cầu chế độ điện tiêu chuẩn (hoặc khi phần mềm sinh bảng Tab 2 cho độ dày $H$ bất kỳ):

1. **Bước 1 — Xác định thông số điện tiêu chuẩn:**
   Hệ thống xác định $(\text{Ton}_{\text{std}}, \text{Po}_{\text{std}}, \text{IP}_{\text{std}}, \text{Volt}_{\text{std}}, \text{VF}_{\text{std}})$ cho độ dày $H$ theo bảng chuẩn công nghệ xưởng.

2. **Bước 2 — Nội suy lượng cào phôi $\delta_{\text{predicted}}$:**
   Dựa trên các mốc thực nghiệm trong Thư viện (Data Bank), tính toán lượng cào phôi $\delta$ tương ứng:
   - Nếu $(H, \text{Ton}, \text{IP}, \text{Volt})$ trùng khớp với điểm neo thực nghiệm $\rightarrow$ Lấy chính xác $\delta$ thực nghiệm.
   - Nếu $H$ nằm giữa các điểm neo $H_1$ và $H_2$ $\rightarrow$ Nội suy tuyến tính lượng cào phôi:
     $$\delta_{\text{predicted}} = \delta_1 + \frac{H - H_1}{H_2 - H_1} \times (\delta_2 - \delta_1)$$
   - Nếu thay đổi cấp chiến lược (tăng/giảm IP, Ton) $\rightarrow$ Áp dụng hệ số điều chỉnh năng lượng phóng điện $\Delta\delta_{\text{strat}}$.

3. **Bước 3 — Xuất thông số Offset chuẩn danh nghĩa:**
   $$\text{Offset}_{\text{Standard}} = 0.090 + \delta_{\text{predicted}}$$

---

## PHẦN 5: QUY TRÌNH TIẾP NHẬN & TIẾN HÓA DỮ LIỆU TRONG TƯƠNG LAI (CONTINUOUS LEARNING)

1. Khi người dùng thực hiện các bài test mới tại xưởng và gửi kết quả (Gồm: $H$, $\text{Ton}$, $\text{Toff}$, $\text{IP}$, $\text{Volt}$, $\text{VF}$, $\text{Offset nhập}$, và $\text{Kích thước đo sau cắt}$):
2. AI ghi nhận bài cắt mới vào cuối Bảng dữ liệu thô (Raw Data Bank) trong tài liệu này (cấp mã STT tiếp theo: STT 15, STT 16...).
3. AI tính toán lượng cào phôi $\delta$ của bài cắt mới.
4. AI cập nhật mảng `const anchors` trong `app.js` để đường cong nội suy Offset ngày càng dày đặc và hội tụ tiệm cận độ chính xác 100% cho chiếc máy cắt dây cụ thể của xưởng.

---

## PHẦN 2: BẢNG DỮ LIỆU THÔ CẮT 2 PASS THỰC TẾ (2-PASS RAW DATA BANK)

| STT 2P | Số lần | Vật Liệu | H | Bước | Ton | Toff | IP | Wire | Volt | VF | Max Speed | Offset Nhập | Thời gian | Chiều dài L | Ampe đo | Tốc độ thực | Kích thước đo sau cắt (Ghi chú gốc) | Sai lệch mỗi bên | Offset P1 Chuẩn | Offset P2 Chuẩn |
|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---:|:---:|:---:|
| **2P-01** ⛔ *(Đã ẩn: gap âm)* | 2 Lần | SCM420 (HB<200) | 63 | **P1** | 24 | 7 | 4 | 1 | High | 43 | 150Hz | **0,116** | 21p | 30mm | 4A | 55-65 mm²/p | cắt lấy chày : kích thước to hơn lập trình 0,07 | -0.035 mm | **0.081 mm** | **0.022 mm** |
| | | | | **P2** | 15 | 5 | 2 | 2 | High | 36 | 100Hz | **0,022** | 5p20' | 30mm | 0,1-0,2A | 240 mm²/p | | | | |
| **2P-02** | 2 Lần | SCM420 (HB<200) | 63 | **P1** | 44 | 7 | 5 | 1 | High | 55 | 150Hz | **0,118** | 16p26' | 30mm | 4,2A | 75-85 mm²/p | cắt lấy chày : kích thước to hơn lập trình 0,05 | -0.025 mm | **0.093 mm** | **0.024 mm** |
| | | | | **P2** | 20 | 5 | 3 | 2 | High | 40 | 100Hz | **0,024** | 5p20' | 30mm | 0,1-0,2A | 240 mm²/p | | | | |
| **2P-03** | 2 Lần | SCM420 (HB<200) | 30 | **P1** | 28 | 6 | 4 | 1 | High | 60 | 200Hz | **0,115** | 3h08p | 644mm | 4,1A | 140-150 mm²/p | cắt lấy cối : kích thước nhỏ hơn lập trình 0,015 | -0.0075 mm | **0.1075 mm**| **0.022 mm** |
| | | | | **P2** | 16 | 5 | 2 | 2 | Low | 40 | 150Hz | **0,022** | 1h12p | 644mm | 0,1-0,2A | 360 mm²/p | | | | |
| **2P-04** | 2 Lần | SCM440 (28-32HRC)| 12 | **P1** | 20 | 7 | 2 | 2 | Low | 50 | 150Hz | **0,098** | -- | -- | -- | -- | kích thước đã chuẩn với hệ số offset hiện tại | 0.000 mm | **0.098 mm** | **0.040 mm** |
| | | | | **P2** | 12 | 7 | 2 | 2 | Low | 20 | 130Hz | **0,040** | -- | -- | -- | -- | | | | |
| **2P-05** | 2 Lần | SCM440 (28-32HRC)| 32 | **P1** | 30 | 7 | 3 | 1 | Low | 50 | 200Hz | **0,091** | -- | -- | -- | -- | kích thước đã chuẩn với hệ số offset hiện tại | 0.000 mm | **0.091 mm** | **0.030 mm** |
| | | | | **P2** | 5 | 15 | 1 | 1 | Low | 10 | 130Hz | **0,030** | -- | -- | -- | -- | | | | |
| **2P-06** | 2 Lần | SCM440 (28-32HRC)| 62 | **P1** | 70 | 7 | 4 | 1 | High | 50 | 150Hz | **0,092** | -- | -- | -- | -- | kích thước đã chuẩn với hệ số offset hiện tại | 0.000 mm | **0.092 mm** | **0.030 mm** |
| | | | | **P2** | 15 | 7 | 2 | 2 | Low | 20 | 100Hz | **0,030** | -- | -- | -- | -- | | | | |
| **2P-07** ⛔ *(Đã ẩn: gap âm)* | 2 Lần | SCM420 (HB<200) | 90 | **P1** | 100 | 7 | 3 | 1 | High | 50 | 150Hz | **0,072** | -- | -- | -- | -- | kích thước đã chuẩn với hệ số offset hiện tại | 0.000 mm | **0.072 mm** | **0.030 mm** |
| | | | | **P2** | 15 | 7 | 2 | 3 | Low | 20 | 100Hz | **0,030** | -- | -- | -- | -- | | | | |
| **2P-08** ⛔ *(Đã ẩn: gap âm)* | 2 Lần | SCM420 (HB<200) | 90 | **P1** | 100 | 7 | 4 | 1 | High | 50 | 150Hz | **0,085** | -- | -- | -- | -- | kích thước đã chuẩn với hệ số offset hiện tại | 0.000 mm | **0.085 mm** | **0.030 mm** |
| | | | | **P2** | 15 | 7 | 2 | 3 | Low | 20 | 100Hz | **0,030** | -- | -- | -- | -- | | | | |
| **2P-09** | 2 Lần | SCM420 (HB<200) | 140 | **P1** | 120 | 8 | 5 | 1 | High | 55 | 60Hz | **0,098** | -- | -- | -- | -- | kích thước đã chuẩn với hệ số offset hiện tại | 0.000 mm | **0.098 mm** | **0.030 mm** |
| | | | | **P2** | 25 | 7 | 2 | 2 | Low | 25 | 100Hz | **0,030** | -- | -- | -- | -- | | | | |
| **2P-10** | 2 Lần | SCM440 (28-32HRC)| 85 | **P1** | 70 | 8 | 5 | 1 | High | 61 | 150Hz | **0,095** | 48p | 65,6mm | 3,6A-3,7A | 55-65 mm²/p | Sau P1 đo: 19.94 - 19.95mm (chừa 0.0275mm/bên) | +0.0075 mm | **0.1025 mm**| **0.030 mm** |
| | | | | **P2** | 20 | 6 | 3 | 2 | High | 36 | 100Hz | **0,030** | 10p24' | 65,6mm | 0,5A-1,0A | 240 mm²/p | Sau P2: cối to hơn lập trình 0.015 (20.015mm) | (Đo khép kín) | (Khe hở δ1=0.0125) | (P2 ăn 0.035mm/bên) |


> ⚠️ **QUY TẮC NÚI LỬA (GHI NHỚ ĐẶC BIỆT TỪ USER):** Pass 2 ăn 0.035mm là do phạt gọt các chóp đỉnh nhọn rỗng xốp của miệng núi lửa ($Rz_1 pprox 28\mu m$) do Pass 1 để lại + khe hở $\delta_2 pprox 7\mu m$. Chế độ điện Pass 2 ($	ext{Ton}=20, 	ext{IP}=3$) KHÔNG THỂ tự cào được 0.035mm trên bề mặt thép phẳng đặc (trên thép phẳng đặc chỉ cào được ~0.010mm). Tuyệt đối không được nhầm lẫn khi phân tích cắt nhiều Pass!

| **2P-12** | 2 Lần | SCM440 (28-32HRC)| 165 | **P1** | 135 | 11 | 6 | 1 | High | 70 | 60Hz | **0,100** | 1h17' | 43,6mm | 2,8A-3,0A | 15-35 mm²/p | Sau P1: 23.99 - 24.00mm (chừa ~2.5μm/bên) | +0.0075 mm | **0.1075 mm**| **0.015 mm** |
| | | | | **P2** | 40 | 7 | 3 | 2 | High | 36 | 80Hz | **0,015** | 9p | 43,6mm | 0,5A - 1A-1,5A | 190 mm²/p | Sau P2: 24.01 - 24.02mm (cối to hơn lập trình 0.015mm) | (Đo kiểm 2 Pass) | (Khe hở δ1=0.0225) | (Ampe đổi theo đỉnh núi lửa) |

> 💡 **PHÂN TÍCH ĐỘNG HỌC & ĐỒNG HỒ AMPE BÀI CẮT 2P-12 (H=165mm, MẪU 2):**
> * **Pass 1:** $O_1=0.100, O_2=0.015 \implies$ Mép dây P1 cách bản vẽ $0.025	ext{mm}$. Sau P1 đo đạt $23.99-24.00	ext{mm}$ $\implies$ vách chỉ còn cách bản vẽ $0.0025	ext{mm}$.
> * **Lượng cào thép đặc của Pass 1:** $\delta_1 = 0.025 - 0.0025 = \mathbf{0.0225	ext{ mm}}$ ($22.5\mu m$). Offset 1 Pass tương đương: $\mathbf{0.1125	ext{ mm}}$.
> * **Pass 2:** Nâng Ton lên 40, hạ $O_2$ về $0.015	ext{mm} \implies$ Mép dây Pass 2 cách vách phôi Pass 1 là $12.5\mu m$, tia lửa Pass 2 đã ăn sâu vào vách, đưa kích thước lên $24.015	ext{mm}$ (to hơn lập trình $0.015	ext{mm}$).
> * **Hiện tượng Ampe Pass 2 (Đúc kết từ User):** 
>   - 3/4 quãng đường kim chỉ $0.5	ext{A}$: Cắt qua vùng đỉnh núi lửa thấp (lượng dư ít, phoi mỏng).
>   - 1/4 quãng đường kim vọt lên $1.0 - 1.5	ext{A}$ dao động liên tục: Cắt qua vùng đỉnh núi lửa nhô cao (lượng dư nhiều, mật độ phóng điện dày đặc).
>   - 👉 Chứng minh độ nhám rỗng xốp $Rz_1$ không đồng đều trên toàn bộ chu vi cắt phôi dày.

| **2P-13** | 2 Lần | SCM440 (28-32HRC)| 60 | **P1** | 50 | 7 | 4 | 1 | High | 62 | 150Hz | **0,094** | 40p20' | 68mm | 3,5A-3,6A | 65-75 mm²/p | Cắt lấy cối: kích thước lớn hơn lập trình 0.010mm | +0.0050 mm | **0.0990 mm**| **0.022 mm** |
| | | | | **P2** | 16 | 6 | 2 | 2 | High | 40 | 100Hz | **0,022** | 12p | 68mm | 0,5A-0,6A | 240 mm²/p | (Lỗ cối lớn hơn 0.01mm -> ăn lẹm 5μm/bên) | (Cần tăng bù dao P1 lên 0.099) | (O2 tính 0.022 khớp 0.022) | (Chuẩn xác hình học) |

> 💡 **PHÂN TÍCH ĐỘNG HỌC & ĐỐI CHIẾU LÝ THUYẾT BÀI CẮT 2P-13 (H=60mm, SCM440 - CẮT LẤY CỐI):**
> * **Kích thước đo sau cắt:** Lỗ cối lớn hơn lập trình $0.010\text{ mm} \implies$ Vách lỗ bị ăn lẹm mỗi bên: $\Delta/2 = +0.005\text{ mm}$ ($5.0\mu m$).
> * **Bù dao Pass 1 Chuẩn khi cắt cối:** Để lỗ cối co nhỏ lại về đúng kích thước danh nghĩa, dây Moly cần lùi sâu vào trong lòng lỗ (cách xa thành vách hơn), do đó Offset Pass 1 phải **TĂNG THÊM $0.005\text{mm}$**:
>   $$\mathbf{\text{Offset}_{1\_\text{chuẩn}}} = 0.094 + 0.005 = \mathbf{0.099\text{ mm}}$$
> * **Bù dao Pass 2 Chuẩn:** Giữ nguyên $\mathbf{0.022\text{ mm}}$ (Pass 2 ăn rất êm $0.5 - 0.6\text{A}$, phạt đỉnh núi lửa $17\mu m + 5\mu m$ hoàn hảo).
> * **Đồng hồ Ampe:** Pass 1 ăn $3.5\text{A} - 3.6\text{A}$ (chuẩn theo Quy luật 4 dải Ampe Rule 12 cho $H=60\text{mm}$), Pass 2 ăn êm ru $0.5\text{A} - 0.6\text{A}$.

---

## PHẦN 3: BẢNG DỮ LIỆU THÔ CẮT 5 PASS THỰC TẾ (5-PASS RAW DATA BANK)

| STT 5P | Số lần | Vật Liệu | H | Bước | Ton | Toff | IP | Wire | Volt | VF | Max Speed | Offset Nhập | Thời gian | Chiều dài L | Ampe đo | Tốc độ thực | Kích thước đo sau cắt (Ghi chú gốc) | Lượng bóc tách mỗi bên | Offset P1 Chuẩn |
|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---:|:---:|
| **5P-01** | 5 Lần | SCM440 (28-32HRC) | 12 | **P1** | 20 | 5 | 3 | 1 | High | 65 | 150Hz | **0,108** | 19p50' | 128mm | 4A | 275-285 mm²/p | Sau P1 đo: 54.08mm (chừa 0.040mm/bên) | +40.0 μm (chừa dư) | **0.093 mm** |
| | | | | **P2** | 14 | 5 | 2 | 2 | Low | 42 | 140Hz | **0,018** | 16p | 128mm | 0,3-0,5A | 232-340 mm²/p | Sau P2 đo: 54.045mm (gọt bớt 0.0175mm/bên) | -17.5 μm (Pass 2 ăn) | **0.018 mm** |
| | | | | **P3** | 6 | 8 | 1 | 3 | Low | 35 | 120Hz | **0,009** | -- | 128mm | < 0,2A | -- | San phẳng chỏm sóng siêu vi | -2.5 μm | **0.009 mm** |
| | | | | **P4** | 2 | 12 | 1 | 3 | Low | 25 | 100Hz | **0,004** | -- | 128mm | < 0,1A | -- | Đánh bóng bán tinh | -2.5 μm | **0.004 mm** |
| | | | | **P5** | 1 | 16 | 1 | 3 | Low | 20 | 80Hz | **0,002** | -- | 128mm | ~ 0,05A | -- | Sau P5 đo: 54.03mm (to hơn lập trình 0.030mm) | -2.5 μm | **0.002 mm** |

> 💡 **PHÂN TÍCH ĐỘNG HỌC & HÌNH HỌC ĐO KIỂM 5 PASS (H=12mm, SCM440):**
> * **Kích thước danh nghĩa lập trình:** $W_0 = 54.000\text{ mm}$ (cắt lấy chày).
> * **Sau Pass 1:** Đo đạt $54.080\text{ mm} \implies$ Chày to hơn chuẩn $0.080\text{mm}$, lượng phôi chừa lại mỗi bên vách là $40\mu m$.
> * **Năng lực cào thép đặc của Pass 1 ($\delta_1$):**
>   - Tổng bù dao tâm dây Pass 1: $O_{\text{tổng}} = 0.108 + 0.018 + 0.009 + 0.004 + 0.002 = 0.141\text{ mm}$.
>   - Mép trong dây Moly cách biên dạng danh nghĩa: $0.141 - 0.090 = 0.051\text{ mm}$.
>   - Vách chày thực tế cách biên dạng danh nghĩa: $0.040\text{ mm}$.
>   - 👉 **Lượng cào phôi thép đặc thực tế của Pass 1:** $\delta_1 = 0.051 - 0.040 = \mathbf{0.011\text{ mm}} = 11\mu m$.
>   - Offset 1 Pass tương đương: $R_{\text{dây}} + \delta_1 = 0.090 + 0.011 = \mathbf{0.101\text{ mm}}$.
> * **Sau Pass 2:** Đo đạt $54.045\text{ mm} \implies$ Kích thước ngót đi $0.035\text{mm}$, tức Pass 2 bóc tách chính xác $\mathbf{17.5\mu m/\text{bên}}$.
>   - Khớp 100% với Quy tắc Núi Lửa: $O_2 = 0.018\text{mm}$ đưa dây áp sát vách nhám $Rz_1$, gọt đỉnh than rỗng xốp với dòng ampe nhẹ $0.3 - 0.5\text{A}$.
> * **Sau Pass 3, 4, 5:** Đo cuối cùng $54.030\text{ mm} \implies$ Ngót thêm $0.015\text{mm}$, tức cả 3 pass tinh bóc tách $\mathbf{7.5\mu m/\text{bên}}$ (trung bình $2.5\mu m/\text{pass}$).
> * **Hiệu chỉnh Offset Chuẩn:**
>   - Kích thước chày to hơn lập trình $0.030\text{mm} \implies \Delta/2 = 0.015\text{mm}$.
>   - Để chày về đúng kích thước chuẩn $54.000\text{mm}$, Offset Pass 1 chuẩn là:
>     $$\mathbf{\text{Offset}_{1\_\text{chuẩn}}} = 0.108 - 0.015 = \mathbf{0.093\text{ mm}}$$
> * **Tổng thời gian cắt 5 Pass:** $1\text{h}45\text{p}$ cho chu vi cắt $L = 128\text{mm}$.

---


### BẢNG QUY ĐỔI PASS 1 (TỪ MULTI-PASS) THÀNH 1 PASS TƯƠNG ĐƯƠNG TRÊN THƯ VIỆN TAB 2:
*Theo chỉ thị công nghệ (Rule 15 trong AGENTS.md), các bài cắt nhiều Pass có đo đạc kích thước phôi trung gian ngay sau khi kết thúc Pass 1 được quy đổi thành bài cắt 1 Pass tương đương với lượng cào thép đặc $\delta_1$, hiển thị trên bảng 1 Pass với ký hiệu $H$ màu vàng (H-badge Amber):*

| Nguồn 2-Pass | Vật Liệu | H (mm) | Chế độ điện Pass 1 | Kích thước đo sau Pass 1 | Lượng cào thép đặc δ1 | Offset 1P quy đổi tương đương | Thời gian thực | Ampe thực | Tốc độ thực |
|:---:|:---|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **2P-10** | SCM440 (30HRC) | **85** | Ton=70, Po=8, IP=5, Volt=H, VF=61, 150Hz | Sau P1: 19.94-19.95mm (chừa 0.0275mm/bên) | **0.0125 mm** | **0.1025 mm** | 48p (L=65.6mm) | 3,6A - 3,7A | 55 - 65 mm²/p |
| **2P-12** | SCM440 (30HRC) | **165**| Ton=135, Po=11, IP=6, Volt=H, VF=70, 60Hz | Sau P1: 23.99-24.00mm (chừa ~2.5μm/bên) | **0.0225 mm** | **0.1125 mm** | 1h17' (L=43.6mm) | 2,8A - 3,0A | 15 - 35 mm²/p |

---

## C. VÙNG DỮ LIỆU THỬ NGHIỆM THAM KHẢO & RÚT KINH NGHIỆM (KHÔNG DÙNG TRONG TÍNH TOÁN / HIỆU CHUẨN)
*Vùng lưu trữ các bài cắt thử nghiệm công nghệ, các trường hợp hụt tia lửa, trượt gió hoặc chưa hoàn thiện để làm tài liệu tham khảo và rút kinh nghiệm thực chiến xưởng (tuyệt đối không dùng để hiệu chuẩn thuật toán hay nạp vào thư viện tính toán).*

### Bài cắt Tham khảo STT 2P-11 (H=165mm SCM440 - Mẫu 1 hụt tia lửa Pass 2):
| STT | Số lần | Vật Liệu | H | Bước | Ton | Toff | IP | Wire | Volt | VF | Max Speed | Offset Nhập thực tế | Thời gian | Chiều dài L | Ampe đo | Tốc độ thực | Kích thước đo sau cắt | Bài học kinh nghiệm & Hiện tượng |
|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---|
| **2P-11** *(Tham khảo)* | 2 Lần | SCM440 (28-32HRC)| 165 | **P1** | 135 | 11 | 6 | 1 | High | 70 | 60Hz | **0,110** | 1h17' | 43,6mm | 2,8A-3,0A | 15-35 mm²/p | Sau P1: 23.95 - 23.96mm (cối nhỏ hơn lập trình 0.045mm) | VF=70 giúp máy thoát nghẽn phôi siêu dày thành công |
| | | | | **P2** | 24 | 6 | 3 | 2 | High | 36 | 80Hz | **0,030** | 9p | 43,6mm | 1,0A-1,5A | 190 mm²/p | Sau P2: 23.95 - 23.96mm (kích thước giữ nguyên so với Pass 1) | **Trượt gió Pass 2:** Do đặt O2=0.030 quá xa và Ton=24 quá thấp, tia lửa Pass 2 không chạm tới vách phôi dày 165mm |

> 💡 **BÀI HỌC KINH NGHIỆM ĐẮT GIÁ TỪ MẪU 1 (2P-11):**
> 1. **Nguyên nhân trượt gió:** Khi cắt phôi dày $H=165\text{mm}$, nếu để lượng chừa Pass 2 quá dày ($O_2=0.030\text{mm}$) kết hợp năng lượng xung yếu ($\text{Ton}=24$), tia lửa Pass 2 hoàn toàn bị hụt tầm vươn, không thể bóc tách được phôi $\implies$ Kích thước sau Pass 2 không hề thay đổi so với Pass 1.
> 2. **Giải pháp thành công (Mẫu 2 STT 2P-12):** Nâng $\text{Ton}$ Pass 2 lên **$40\mu s$** và ép $O_2$ về **$0.015\text{mm}$** $\implies$ tia lửa cắn sâu vào chân vách, đạt kích thước $24.015\text{mm}$ thành công 100%.
> 3. **Lý do tách khỏi tính toán:** Vì Pass 2 của Mẫu 1 không ăn phôi nên số liệu không đại diện cho động lực học 2 Pass hoàn chỉnh. Do đó tách riêng vào vùng này để lưu trữ kinh nghiệm thực chiến.

### Bài cắt Tham khảo STT 9 (H=63mm SCM420 1 Lần - Chế độ xung yếu, dây tì dính phôi):
| STT | Số lần | Vật Liệu | H (mm) | Ton (μs) | Toff (Po) | IP | Wire | Volt | VF | Tần số Max | Offset Nhập thực tế | Thời gian | Chiều dài L | Đồng hồ Ampe | Tốc độ thực | Kích thước đo sau cắt (Ghi chú gốc) | Sai lệch mỗi bên | Offset chuẩn hiệu chỉnh | Lượng cào phôi δ | Hiện tượng & Rút kinh nghiệm |
|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---:|:---:|:---:|:---|
| **STT 9** *(Tham khảo)* | 1 Lần | SCM420 (HB<200) | 63 | 24 | 7 | 4 | 1 | High | 43 | 150Hz | **0,116** | 21p | -- | 4A | 55 - 65 mm²/p | cắt lấy chày : kích thước to hơn lập trình 0,07 | -0.035 mm | **0.081 mm** | **-0.009 mm** | Ton=24 quá non cho phôi H=63mm Volt High; dây tì đè kéo lê gây khe hở âm |

> 💡 **BÀI HỌC KINH NGHIỆM ĐẮT GIÁ TỪ MẪU STT 9:**
> 1. **Nguyên nhân khe hở âm ($\delta = -0.009\text{mm}$):** Với chiều dày $H=63\text{mm}$, điện áp High mà cài đặt $\text{Ton}=24\mu s, \text{IP}=4$ là chế độ xung quá yếu so với khe hở cần thiết. Năng lượng xung đơn không đủ áp lực bùng nổ để thổi phoi thoát ra khỏi rãnh sâu $63\text{mm}$, dẫn đến đoản mạch vi mô cục bộ triền miên. Dây Moly bị tì đè kéo lê trên vách phôi (hiện tượng dính/chập dây), làm phôi cắt ra bị phình to hơn lập trình đến $0.07\text{mm}$.
> 2. **Chế độ chuẩn thay thế thành công (STT 3):** Khi nâng lên $\text{Ton}=44\mu s, \text{IP}=5, \text{VF}=55$ (STT 3), xung đủ lực tống phoi, cắt cực kỳ êm, đạt $\delta = +0.005\text{mm}$ (Offset chuẩn $0.095\text{mm}$) và tốc độ tăng lên $75-85\text{ mm}^2/\text{p}$.
> 3. **Lý do loại khỏi Thư viện Tab 2 và dữ liệu tính toán:** Do khe hở phóng điện bị âm giả tạo ($\delta = -0.009\text{mm}$) do dây kéo lê cơ học chứ không phải bản chất phóng điện tia lửa tự nhiên. Mẫu này hoàn toàn bị loại khỏi Thư viện thực nghiệm Tab 2 và mọi mô hình toán học / thuật toán hiệu chuẩn, chỉ lưu giữ tại Vùng tham khảo này để cảnh báo thợ vận hành tránh dùng xung quá non cho phôi dày trung bình.

### Bài cắt Tham khảo STT 13 (H=300mm SCM440 1 Lần - Giai đoạn 1 chạy rà đầu phôi):
| STT | Số lần | Vật Liệu | H (mm) | Ton (μs) | Toff (Po) | IP | Wire | Volt | VF | Tần số Max | Offset Nhập thực tế | Thời gian | Chiều dài L | Đồng hồ Ampe | Tốc độ thực | Kích thước đo sau cắt (Ghi chú gốc) | Sai lệch mỗi bên | Offset chuẩn hiệu chỉnh | Lượng cào phôi δ | Hiện tượng & Rút kinh nghiệm |
|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---:|:---:|:---:|:---|
| **STT 13** *(Tham khảo)* | 1 Lần | SCM440 (28-32HRC) | 300 | 80 | 9 | 6 | 1 | High | 50 | 50Hz | **0,120** | 1h29p | 31,3mm | 3,8A - 3,9A | 12 - 20 mm²/p | GĐ 1 : cắt lấy cối : kích thước lớn hơn lập trình 0,01 | -0.005 mm | **0.115 mm** | **0.025 mm** | Giai đoạn 1 chạy rà đầu phôi 31.3mm; sau đó xưởng tối ưu nâng lên Ton=120 VF=65 (STT 14) |

> 💡 **BÀI HỌC KINH NGHIỆM ĐẮT GIÁ TỪ MẪU STT 13 (GIAI ĐOẠN 1):**
> 1. **Bản chất công nghệ:** Khi cắt phôi siêu dày $H=300\text{mm}$, ở $31.3\text{mm}$ đầu tiên (Giai đoạn 1), xưởng đã thử nghiệm chế độ dò đường với $\text{Ton}=80\mu s, \text{Po}=9, \text{IP}=6, \text{VF}=50$. Dù đã đạt kích thước đo chuẩn (Offset chuẩn $0.115\text{mm}$), nhưng khi đi sâu vào lòng phôi, trở lực thủy lực lớn làm tăng nguy cơ ngắn mạch và đứt dây.
> 2. **Chế độ chuẩn hoàn chỉnh (STT 14 - Giai đoạn 2):** Xưởng đã nâng năng lượng xung lên $\text{Ton}=120\mu s$ và tăng điện áp bám $\text{VF}=65$, giúp máy cắt trơn tru ổn định liên tục $3\text{h}$ cho toàn bộ chiều dài $76.1\text{mm}$ còn lại mà không gặp bất kỳ sự cố nào.
> 3. **Lý do tách khỏi Thư viện Tab 2:** Để tránh trùng lặp 2 dòng cùng chiều dày $H=300\text{mm}$ gây phân vân cho người vận hành, Thư viện Tab 2 chỉ giữ lại duy nhất 1 bài chuẩn công nghệ hoàn chỉnh nhất là **STT 14** ($\text{Ton}=120, \text{VF}=65$). STT 13 được chuyển sang Vùng tham khảo này để làm tư liệu kinh nghiệm hữu ích về giai đoạn tiếp cận phôi ban đầu.


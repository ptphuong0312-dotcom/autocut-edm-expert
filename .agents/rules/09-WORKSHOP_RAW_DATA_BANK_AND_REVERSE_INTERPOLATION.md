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
| **9** | 1 Lần | SCM420 (HB<200) | 63 | 24 | 7 | 4 | 1 | High | 43 | 150Hz | **0,116** | 21p | -- | 4A | 55 - 65 | cắt lấy chày : kích thước to hơn lập trình 0,07 |
| **10** | 1 Lần | SCM420 (HB<200) | 140 | 52 | 8 | 6 | 1 | High | 50 | 100Hz | **0,120** | -- | -- | -- | không cắt được | cắt lấy chày : (không cắt được) |
| **11** | 1 Lần | SCM420 (HB<200) | 140 | 80 | 8 | 6 | 1 | High | 50 | 100Hz | **0,120** | -- | -- | -- | không cắt được | cắt lấy chày : (không cắt được) |
| **12** | 1 Lần | SCM420 (HB<200) | 140 | 100 | 9 | 6 | 1 | High | 60 | 100Hz | **0,120** | 36p | 28,4mm | 3,7A - 3,8A | 30 - 40 | cắt lấy chày : kích thước to hơn lập trình 0,036 |
| **13** | 1 Lần | SCM440 (28-32HRC) | 300 | 80 | 9 | 6 | 1 | High | 50 | 50Hz | **0,120** | 1h29p | 31,3mm | 3,8A - 3,9A | 12 - 20 | GĐ 1 : cắt lấy cối : kích thước lớn hơn lập trình 0,01 |
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
| **9** | **H = 63mm** | Ton=24, Po=7, IP=4, Volt=High, VF=43 | 0.116 | Chày to hơn 0.070 | -0.035 | **0.081 mm** | **-0.009 mm** | Ton=24 quá yếu cho Volt High $\rightarrow$ Dây kéo lê dính phôi (bất thường) |
| **10**| **H = 140mm**| Ton=52, Po=8, IP=6, Volt=High, VF=50 | 0.120 | Không cắt được | -- | -- | -- | Không đủ năng lượng mồi hồ quang |
| **11**| **H = 140mm**| Ton=80, Po=8, IP=6, Volt=High, VF=50 | 0.120 | Không cắt được | -- | -- | -- | Chưa đủ năng lượng mồi hồ quang |
| **12**| **H = 140mm**| Ton=100, Po=9, IP=6, Volt=High, VF=60 | 0.120 | Chày to hơn 0.036 | -0.018 | **0.102 mm** | **0.012 mm** | Ton=100, IP=6 kích dòng mạnh $\rightarrow \delta=0.012\text{mm}$ |
| **13**| **H = 300mm**| Ton=80, Po=9, IP=6, Volt=High, VF=50 | 0.120 | Cối lớn hơn 0.010 | -0.005 | **0.115 mm** | **0.025 mm** | GĐ 1 phá thô siêu dày H=300mm $\rightarrow \delta=0.025\text{mm}$ |
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

| **2P-11** | 2 Lần | SCM440 (28-32HRC)| 165 | **P1** | 135 | 11 | 6 | 1 | High | 70 | 60Hz | **0,110** | 1h17' | 43,6mm | 2,8A-3,0A | 15-35 mm²/p | Sau P1: 23.95 - 23.96mm (cối nhỏ hơn lập trình 0.045mm) | -0.0225 mm | **0.0875 mm**| **0.020 mm** |
| | | | | **P2** | 24 | 6 | 3 | 2 | High | 36 | 80Hz | **0,030** | 9p | 43,6mm | 1,0A-1,5A | 190 mm²/p | Sau P2: 23.95 - 23.96mm (kích thước giữ nguyên do O2 đặt lùi quá xa tầm vươn tia lửa P2) | (VF=70 cứu máy) | (Khe hở δ1=0.0275) | (P2 hụt tầm vươn) |

> ⚠️ **QUY TẮC NÚI LỬA (GHI NHỚ ĐẶC BIỆT TỪ USER):** Pass 2 ăn 0.035mm là do phạt gọt các chóp đỉnh nhọn rỗng xốp của miệng núi lửa ($Rz_1 pprox 28\mu m$) do Pass 1 để lại + khe hở $\delta_2 pprox 7\mu m$. Chế độ điện Pass 2 ($	ext{Ton}=20, 	ext{IP}=3$) KHÔNG THỂ tự cào được 0.035mm trên bề mặt thép phẳng đặc (trên thép phẳng đặc chỉ cào được ~0.010mm). Tuyệt đối không được nhầm lẫn khi phân tích cắt nhiều Pass!

> 💡 **TÍNH TOÁN NĂNG LỰC BÀO MÒN PASS 1 VÀ HIỆU CHUẨN 1 PASS TỪ BÀI CẮT 2P-11 (H=165mm):**
> * Mép dây Pass 1 cách bản vẽ: $0.110 + 0.030 - 0.090 = 0.050	ext{mm}$.
> * Vách phôi đo được sau Pass 1 cách bản vẽ: $0.045 / 2 = 0.0225	ext{mm}$.
> * **Lượng cào phôi thép đặc thực tế của Pass 1 ($\delta_1$):**
>   $$\delta_1 = 0.050 - 0.0225 = \mathbf{0.0275	ext{ mm}} \quad (27.5\mu m)$$
> * **Bề rộng rãnh cắt thực tế Pass 1:** $B_1 = 2 	imes (0.090 + 0.0275) = \mathbf{0.235	ext{ mm}}$.
> * **Quy đổi Offset CẮT 1 PASS CHUẨN cho bộ điện $	ext{Ton}=135, 	ext{Po}=11, 	ext{IP}=6, 	ext{VF}=70$ tại $H=165	ext{mm}$:**
>   $$\mathbf{	ext{Offset 1-Pass Chuẩn}} = R_{	ext{dây}} + \delta_1 = 0.090 + 0.0275 = \mathbf{0.1175	ext{ mm}}$$
>   *(Dữ liệu này được lưu trữ vĩnh viễn để hiệu chỉnh công thức cắt 1 Pass cho phôi cực dày).*

# QUY TRÌNH KIỂM ĐỊNH TỰ ĐỘNG THÔNG SỐ OFFSET & LỆNH KÍCH HOẠT NHANH
# AUTOMATED OFFSET VERIFICATION PROTOCOL (FAST TRIGGER PROTOCOL)

---

## 🚨 MỆNH LỆNH TRỰC TIẾP TỪ NGƯỜI DÙNG (USER CORE DIRECTIVE)
> *"Tôi muốn bạn sử dụng thông số 1 pass và pass 1 của 2 pass trong thư viện .md để kiểm định lại lượng cào phôi của công thức tính toán hiện tại, xem có cần tinh chỉnh thêm gì để đúng với thực tế hơn (nhớ là dữ liệu nào có đủ thông số và kết quả để thay thế vào công thức thì mới lấy nhá).*
> *Ngoài ra tôi muốn từ sau trở đi tôi chỉ cần nói **'hãy kiểm định lại thông số offset'** thì lệnh trên sẽ được thực thi, không cần tôi phải trình bày dài dòng."*

Tài liệu này xác lập quy trình chuẩn hóa và khẩu lệnh kích hoạt vĩnh viễn trong hệ thống. Bất kỳ AI nào khi nhận được khẩu lệnh đều phải lập tức thi hành chính xác, đầy đủ và chuyên nghiệp nhất.

---

## I. KHẨU LỆNH KÍCH HOẠT (FAST TRIGGER COMMANDS)
Khi người dùng nhập bất kỳ khẩu lệnh nào dưới đây:
1. **`hãy kiểm định lại thông số offset`** (Khẩu lệnh chuẩn)
2. `kiểm định lại offset` / `kiểm định offset`
3. `kiểm tra lại lượng cào phôi` / `audit spark gap`

👉 **HÀNH ĐỘNG BẮT BUỘC CỦA AI:**
AI không được hỏi lại, không cần người dùng giải thích dài dòng. AI lập tức:
1. Chạy script kiểm toán: `python scripts/audit_spark_gap.py` hoặc trích xuất toàn bộ dữ liệu thực nghiệm hợp lệ trong `WORKSHOP_DATA_BANK.md`.
2. Tính toán lượng cào phôi $\delta_{\text{tính}}$ và bù dao $O_{\text{tính}}$ bằng công thức toán - vật lý liên tục hiện hành.
3. Xuất bảng đối chiếu chi tiết 100% các bài cắt (Audit Table).
4. Phân tích các chỉ số thống kê (MAE, RMSE, Max Error, phân bổ dải mỏng/trung/dày).
5. Kết luận rõ ràng về độ ổn định của 5 hệ số vật lý $(C_0, K_{\text{elec}}, \delta_{\text{low}}, K_{\text{slag}}, K_{\text{vibr}})$ và khuyến nghị giữ nguyên hay tinh chỉnh.

---

## II. TIÊU CHUẨN LỰA CHỌN BÀI CẮT THỰC NGHIỆM ĐỂ KIỂM ĐỊNH
Theo chỉ thị của người dùng: **Chỉ những bài cắt có đầy đủ thông số công nghệ và kết quả đo kiểm rõ ràng mới được đưa vào tập kiểm định**:
1. **Thuộc dải $H \le 170\text{mm}$:** Phân vùng vận hành 100% bằng công thức Toán - Vật lý Nhiệt động học liên tục.
2. **Đầy đủ 4 thông số xung điện chính:** Chiều dày $H$, Thời gian phát xung $\text{Ton}$, Dòng đỉnh $\text{IP}$, và Cấp điện áp $\text{Volt}$ (High/Low).
3. **Có kết quả đo kích thước Panme thực tế sau cắt:** Xác định được chính xác độ lệch kích thước $\Delta$, từ đó quy đổi được lượng cào phôi thực tế $\delta_{\text{thực}}$:
   - Cắt 1 Pass: $\delta_{\text{thực}} = \text{Offset nhập} \pm \Delta/2 - 0.090\text{mm}$.
   - Pass 1 của Multi-pass: $\delta_{\text{thực}} = \text{Khoảng cách vách đo Panme Pass 1} - \text{Mép dây Pass 1}$.
4. **Loại trừ các bài cắt không hợp lệ:**
   - Các bài cắt lỗi đứt dây, chạm chập, bỏ dở giữa chừng.
   - Các bài cắt thiếu kích thước đo kiểm trung gian sau Pass 1.
   - Các bài phôi siêu dày $H > 170\text{mm}$ (vận hành theo cơ chế thống kê hội tụ riêng theo Rule 16).

---

## III. HỆ THỐNG CÔNG THỨC TOÁN - VẬT LÝ KIỂM ĐỊNH ($H \le 170\text{mm}$)
Lượng cào phôi vật lý $\delta$ được tính toán liên tục theo 5 thành phần động học:
$$\delta = C_0 + d_{\text{elec}} + d_{\text{low}} + d_{\text{slag}} + d_{\text{vibr}}$$

Trong đó:
1. **$C_0 = +0.00280\text{mm}$:** Hằng số khe hở phóng điện cơ bản ở năng lượng cực tiểu.
2. **$d_{\text{elec}} = K_{\text{elec}} \cdot \sqrt{\text{Ton} \cdot \text{IP}} \cdot (U_{\text{arc}} / 27)$:** Năng lượng bộc phá xung đơn ($K_{\text{elec}} = 0.00100$).
3. **$d_{\text{low}} = \delta_{\text{Low}} = +0.00450\text{mm}$:** Hiệu ứng màng điện môi dãn nở khi chạy áp thấp Volt Low (với Volt High thì $d_{\text{low}} = 0$).
4. **$d_{\text{slag}} = -K_{\text{slag}} \cdot (H / 100)$:** Lực nén xỉ lòng rãnh sâu triệt tiêu tia lửa ($K_{\text{slag}} = 0.02300$).
5. **$d_{\text{vibr}} = +K_{\text{vibr}} \cdot (H / 100)^2 \cdot (\text{IP} / 5)$:** Rung võng cơ học dây Moly dưới áp lực nổ xung ($K_{\text{vibr}} = 0.00390$).

Offset chuẩn quy đổi:
- Cắt 1 Pass: $O_{\text{1P}} = 0.090 + \delta$
- Cắt 2 Pass: $O_1 = 0.090 + \delta_1 + O_2$ (với $O_2 = R_{z1} + \delta_2$)

---

## IV. BẢNG DỮ LIỆU KIỂM ĐỊNH CHUẨN HÓA (19 BÀI CẮT THỰC TẾ XƯỞNG)

| STT | Nhóm bài cắt | $H$ (mm) | Ton | IP | Volt | $\delta_{\text{thực}}$ | $\delta_{\text{tính}}$ | Sai lệch $\Delta$ | Offset chuẩn thực tế |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **STT 1** | 1 Pass | 30 | 32 | 4 | High | $8.00\mu m$ | $7.49\mu m$ | **$+0.51\mu m$** | 0.0980 mm |
| **STT 2** | 1 Pass | 40 | 36 | 4 | High | $8.00\mu m$ | $6.10\mu m$ | **$+1.90\mu m$** | 0.0980 mm |
| **STT 3** | 1 Pass | 63 | 44 | 5 | High | $5.00\mu m$ | $7.59\mu m$ | **$-2.59\mu m$** | 0.0950 mm |
| **STT 4** | 1 Pass | 12 | 20 | 2 | Low | $15.00\mu m$ | $9.72\mu m$ | **$+5.28\mu m$** | 0.1050 mm |
| **STT 5** | 1 Pass | 45 | 50 | 3 | Low | $15.00\mu m$ | $7.40\mu m$ | **$+7.60\mu m$** | 0.1050 mm |
| **STT 6** | 1 Pass | 68 | 70 | 3 | Low | $7.00\mu m$ | $4.55\mu m$ | **$+2.45\mu m$** | 0.0970 mm |
| **STT 7** | 1 Pass | 140 | 120 | 5 | High | $5.00\mu m$ | $9.18\mu m$ | **$-4.18\mu m$** | 0.0950 mm |
| **STT 8** | 1 Pass | 160 | 120 | 5 | High | $20.00\mu m$ | $7.84\mu m$ | **$+12.16\mu m$** | 0.1100 mm |
| **STT 12** | 1 Pass | 140 | 100 | 6 | High | $12.00\mu m$ | $15.00\mu m$ | **$-3.00\mu m$** | 0.1020 mm |
| **2P-02** | 2 Pass P1 | 63 | 44 | 5 | High | $3.00\mu m$ | $7.59\mu m$ | **$-4.59\mu m$** | 0.0930 mm |
| **2P-03** | 2 Pass P1 | 30 | 28 | 4 | High | $17.50\mu m$ | $6.76\mu m$ | **$+10.74\mu m$** | 0.1075 mm |
| **2P-04** | 2 Pass P1 | 12 | 20 | 2 | Low | $8.00\mu m$ | $9.72\mu m$ | **$-1.72\mu m$** | 0.0980 mm |
| **2P-05** | 2 Pass P1 | 32 | 30 | 3 | Low | $1.00\mu m$ | $7.91\mu m$ | **$-6.91\mu m$** | 0.0910 mm |
| **2P-06** | 2 Pass P1 | 62 | 70 | 4 | High | $2.00\mu m$ | $6.47\mu m$ | **$-4.47\mu m$** | 0.0920 mm |
| **2P-09** | 2 Pass P1 | 140 | 120 | 5 | High | $8.00\mu m$ | $9.18\mu m$ | **$-1.18\mu m$** | 0.0980 mm |
| **2P-10** | 2 Pass P1 (thép đặc) | 85 | 70 | 5 | High | $12.50\mu m$ | $8.69\mu m$ | **$+3.81\mu m$** | 0.1025 mm |
| **2P-12** | 2 Pass P1 (thép đặc) | 165 | 135 | 6 | High | $22.50\mu m$ | $18.70\mu m$ | **$+3.80\mu m$** | 0.1125 mm |
| **2P-13** | 2 Pass P1 (cắt cối) | 60 | 50 | 4 | High | $9.00\mu m$ | $4.27\mu m$ | **$+4.73\mu m$** | 0.0990 mm |
| **5P-01** | 5 Pass P1 (thép đặc) | 12 | 20 | 3 | High | $11.00\mu m$ | $7.82\mu m$ | **$+3.18\mu m$** | 0.1010 mm |

---

## V. ĐÁNH GIÁ THỐNG KÊ & KẾT LUẬN VẬT LÝ
1. **Sai số trung bình tuyệt đối toàn cục (MAE):** $\mathbf{4.46\mu m}$ ($0.0045\text{mm}$).
   - Đây là độ chính xác cực kỳ cao trong công nghệ cắt dây EDM, tiệm cận độ phân giải và sai số kẹp thước Panme cơ khí ($\pm 2\mu m$) cùng độ mòn dây Moly tự nhiên ($2 - 4\mu m$).
2. **Sai số phân bổ đồng đều theo mọi dải chiều dày:**
   - Dải phôi mỏng ($H \le 40\text{mm}$): MAE = **$4.32\mu m$**
   - Dải phôi trung bình ($40 < H \le 100\text{mm}$): MAE = **$4.32\mu m$**
   - Dải phôi dày ($100 < H \le 170\text{mm}$): MAE = **$4.86\mu m$**
3. **Kiểm định tối ưu hóa toàn cục:**
   - Thực nghiệm thuật toán tối ưu hóa đa biến (Coordinate Descent / Nelder-Mead) trên toàn bộ 19 bài cắt cho thấy: Việc hiệu chỉnh lại 5 hệ số vật lý chỉ làm giảm MAE từ $4.46\mu m$ xuống $4.27\mu m$ (chênh lệch chưa đầy $0.19\mu m$, hoàn toàn nằm dưới ngưỡng nhiễu đo lường).
   - Nếu ép các hệ số thay đổi để giảm $0.19\mu m$ sẽ dẫn đến hiện tượng quá khớp (Overfitting), làm mất đi tính tổng quát của định luật nhiệt động học EDM.
4. **KẾT LUẬN CÔNG NGHỆ:**
   👉 **Hệ thống 5 hệ số vật lý hiện hành đang ở trạng thái CÂN BẰNG TỐI ƯU TOÀN CỤC (Global Pareto Optimum). GIỮ NGUYÊN BỘ HỆ SỐ CÔNG THỨC HIỆN TẠI.**

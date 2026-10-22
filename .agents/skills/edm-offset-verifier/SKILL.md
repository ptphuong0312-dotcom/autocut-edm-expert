---
name: edm-offset-verifier
description: Tự động kiểm định và kiểm toán sai số bù dao Offset / lượng cào phôi delta trên toàn bộ 19+ bài cắt thực nghiệm xưởng. Kích hoạt bằng khẩu lệnh "hãy kiểm định lại thông số offset" hoặc khi cần đánh giá tính ổn định của mô hình vật lý EDM.
---

# KỸ NĂNG KIỂM ĐỊNH TỰ ĐỘNG BÙ DAO OFFSET (RULE 19 PROTOCOL)

Kỹ năng này được kích hoạt tự động bất cứ khi nào **SirPhuong** đưa ra khẩu lệnh:
* `"hãy kiểm định lại thông số offset"`
* `"kiểm định lại offset"`
* `"kiểm tra lại lượng cào phôi"`
* Hoặc sau mỗi lần tinh chỉnh công thức toán vật lý hay nạp bài cắt mới vào Data Bank.

---

## 🛠️ QUY TRÌNH THỰC THI CHUẨN

### Bước 1: Thực thi Script Kiểm toán
Chạy script kiểm toán đã chuẩn hóa:
```bash
node scripts/audit_spark_gap.js
# Hoặc phiên bản Python tương đương:
python scripts/audit_spark_gap.py
```

### Bước 2: Trích xuất & Tính toán
Script sẽ:
1. Đọc toàn bộ các bài cắt hợp lệ từ `WORKSHOP_DATA_BANK.md` (bao gồm các bài cắt 1 Pass và các bài cắt nhiều Pass có số đo $\delta_1$ quy đổi).
2. Nạp chính xác bộ thông số thực tế $(H, T_{\text{on}}, \text{IP}, \text{Volt})$ của từng bài vào công thức toán - vật lý nhiệt động học liên tục:
   $$\delta = C_0 + d_{\text{elec}} + d_{\text{low}} + d_{\text{slag}} + d_{\text{vibr}}$$
   $$\text{Offset}_{\text{calc}} = 0.090 + \delta$$
3. Tính sai số:
   $$\Delta = (\text{Offset}_{\text{calc}} - \text{Offset}_{\text{chuẩn}}) \times 1000 \quad (\mu m)$$

### Bước 3: Xuất Báo Cáo Kiểm Định Nghiêm Ngặt
Trình bày bảng Markdown đối chiếu toàn diện:
- Cột: STT, Tên bài, Vật liệu, H (mm), Ton, IP, Volt, $\delta_{\text{thực}}$, $\delta_{\text{tính}}$, Sai số $\Delta$ ($\mu m$), Offset Chuẩn.
- Tính toán các chỉ số thống kê chất lượng mô hình:
  - **MAE (Mean Absolute Error):** Sai số tuyệt đối trung bình.
  - **RMSE (Root Mean Square Error):** Sai số hiệu dụng.
  - **Max Error ($\Delta_{\max}$):** Sai số cực đại trên toàn bộ tập dữ liệu.
  - Phân tích sai số theo từng dải chiều dày: Phôi mỏng ($H \le 40$), Phôi vừa ($40 < H \le 100$), Phôi dày ($100 < H \le 170$).

### Bước 4: Đánh Giá Tính Ổn Định Của 5 Hệ Số Vật Lý
Đánh giá xem 5 hằng số vật lý:
- $C_0 = 0.0050\text{mm}$
- $K_{\text{elec}} = 0.000850$
- $d_{\text{low}} = 0.0045\text{mm}$
- $K_{\text{slag}} = 0.004000$ (kèm hệ số vật liệu $K_{\text{mat}} = 1.10$ cho SCM420)
- $K_{\text{vibr}} = 0.002500$
có cần tối ưu thêm hay đã đạt trạng thái cân bằng tuyệt đối (MAE $< 3.5\mu m$).
Đưa ra kết luận minh bạch cho SirPhuong.

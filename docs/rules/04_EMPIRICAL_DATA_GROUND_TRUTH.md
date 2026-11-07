# SỔ TAY QUY CHUẨN 04: THƯ VIỆN THỰC NGHIỆM XƯỞNG & DỮ LIỆU GROUND TRUTH
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - SIRPHUONG

---

## 🏛️ 1. NGUYÊN TẮC BẢO VỆ DỮ LIỆU THÔ (RULE 6 & RULE 10)
* Dữ liệu trong `WORKSHOP_DATA_BANK.md` là tài sản thiêng liêng lưu trữ số liệu thực nghiệm gốc do SirPhuong trực tiếp đo đạc.
* AI **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý SỬA ĐỔI HOẶC XÓA BỎ** dữ liệu thực nghiệm khi chưa có lệnh.
* Dữ liệu xưởng là **THƯỚC ĐO CHUẨN (BENCHMARK GROUND TRUTH)** để đối chứng, kiểm toán sai số của mô hình vật lý. AI không được tự ý "suy diễn ngược" làm biến dạng bản chất dữ liệu gốc.

---

## 📋 2. QUY TRÌNH 6 BƯỚC TIẾP NHẬN DỮ LIỆU MỚI (SOP STANDARD)
Khi SirPhuong gửi số liệu cắt thực tế mới, AI bắt buộc thực hiện tuần tự:
1. **Bước 1 (Giải mã & Phân loại bài cắt):** Xác định vật liệu (SCM440 hay SCM420), chiều dày $H$, số Pass, kiểu cắt (chày hay cối), thông số điện ($T_{\text{on}}, P_o, \text{IP}, \text{Volt}, \text{VF}$, Tần số, Tốc độ dây, Ampe thực tế, Thời gian thực tế).
2. **Bước 2 (Tính toán suy luận ngược):**
   - Độ sai lệch mỗi bên: $\Delta_{\text{side}} = \frac{|\text{Kích thước đo} - \text{Lập trình}|}{2}$.
   - Offset chuẩn thực tế: $\text{Offset}_{\text{chuẩn}} = \text{Offset}_{\text{test}} \pm \Delta_{\text{side}}$.
   - Lượng cào phôi thực tế: $\delta_{\text{thực}} = \text{Offset}_{\text{chuẩn}} - 0.090\text{mm}$.
3. **Bước 3 (Ghi chép toàn vẹn vào `WORKSHOP_DATA_BANK.md`):** Ghi đầy đủ mọi chi tiết (thời gian, ampe, panme, hiện tượng rãnh cắt, bài học kinh nghiệm). Cập nhật cả Bảng Chỉ Mục Chuẩn ở đầu file.
4. **Bước 4 (Cập nhật Thư viện giao diện Web App):** Nạp vào mảng dữ liệu `WS_LIB_BENCHMARK_JOBS` trong `app.js` theo đúng Pass tương ứng.
5. **Bước 5 (Kiểm toán & Đánh giá mô hình):** Chạy script kiểm toán `scripts/verify_gatekeeper.ps1` hoặc `scripts/audit_spark_gap.ps1` để so sánh với công thức lý thuyết.
6. **Bước 6 (Báo cáo & Đóng gói an toàn):** Báo cáo kết quả đối chiếu, cập nhật `CURRENT_STATE.md` và tạo bản sao lưu `backups/`.

---

## ⚡ 3. KHẨU LỆNH KIỂM ĐỊNH TỰ ĐỘNG (RULE 19)
Khi SirPhuong phát lệnh: **`"hãy kiểm định lại thông số offset"`** (hoặc `"kiểm định lại offset"`, `"kiểm tra lượng cào phôi"`):
* AI tự động chạy ngay script kiểm toán:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts/audit_spark_gap.ps1
  ```
* Xuất bảng đối chiếu toàn diện: STT, Nhóm, $H$, Ton, Po, IP, Volt, VF, $\delta_{\text{thực}}$, $\delta_{\text{tính}}$, Sai lệch ($\mu m$), Offset chuẩn.
* Báo cáo MAE (SCM440), MAE (SCM420), MAE toàn cục, RMSE và Sai số cực đại.

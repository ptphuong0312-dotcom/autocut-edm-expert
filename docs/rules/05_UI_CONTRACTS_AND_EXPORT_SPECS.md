# SỔ TAY QUY CHUẨN 05: GIAO DIỆN 2 VÙNG, ĐỊNH DẠNG XUẤT CLIPBOARD & MOBILE UX
# DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM) - SIRPHUONG

---

## 🖥️ 1. CẤU TRÚC GIAO DIỆN 2 TAB HIỆN HÀNH (SINGLE SOURCE OF TRUTH)
Giao diện Web App hiện tại gồm đúng **2 Tab chức năng**:
1. **TAB 1: "Thông Số Cắt & Bù Dao Offset"** (`#tab-workshop`):
   - Phía trên: Chọn vật liệu (SCM440 / SCM420), Chọn Pass (1-6), Thanh trượt 7 cấp độ, Chọn chiều dày $H$ kèm thanh trượt và phím chọn nhanh đến $200\text{mm}$, Hộp tính thời gian cắt.
   - Bảng 2 Khung dọc:
     * **Khung 1 (VÙNG 1: THÔNG SỐ ĐẦU VÀO):** 7 cột gồm `P`, `PON`, `POFF`, `IP`, `V`, `VF`, `WIRE`. Các ô này người dùng có thể can thiệp sửa trực tiếp. Có nút **🔄 Trở Về Mặc Định** (`#ws-btn-reset-params`) để khôi phục nhanh.
     * **Khung 2 (VÙNG 2: KẾT QUẢ ĐỘNG HỌC MÁY):** 7 cột gồm `P`, `OFFSET` (cột đầu tiên nổi bật màu vàng hổ phách), `FC THỰC (MM²/P)`, `FC MÁY (H40)`, `GIỚI HẠN (HZ)`, `AMPE KẾ (A)`, `RA`.
     * **Tính phản ứng thời gian thực (Live Reactivity):** Khi người dùng sửa Pon, Poff, IP, Volt, VF ở Vùng 1, toàn bộ Vùng 2 (OFFSET, Fc, Hz, Ampe, Ra) tự động tính toán lại tức thì mà không làm mất tiêu điểm bàn phím!
   - Phía dưới: Thư viện Thông số Cắt Thực tế Xưởng (Benchmark Library) chia 6 Sub-tabs (1 Pass đến 6 Pass), hỗ trợ nút mũi tên thu gọn/mở rộng `6 Chế Độ Cắt ▼`.
2. **TAB 2: "Kiến Thức EDM"** (`#tab-knowledge`):
   - Cẩm nang giáo trình toàn tập giải thích bản chất vật lý của Pon, Poff, IP, Volt, VF, Wire, chu kỳ xung và cơ chế tạo rãnh cắt.
   - Bài giảng 7 bước tính toán động lực học tích hợp số liệu thực tế theo thời gian thực.

---

## 📋 2. KHÓA CƠ HỌC ĐỊNH DẠNG XUẤT CLIPBOARD [SPEC-LOCK: CLIPBOARD_EXPORT_CONTRACT_V66]
Khi người dùng bấm nút **📋 Copy Thông Số** (`#ws-btn-copy-table`), nội dung sao chép vào bộ nhớ tạm bắt buộc phải tuân thủ nghiêm ngặt định dạng sau:

### A. Đối với quy trình 1 Pass:
```text
Quy trình: 1 Pass

Pon = 33 , Poff = 8 , IP = 4 , Volt = H , VF = 53 , Wire = 1 , OFFSET = 0.097
```

### B. Đối với quy trình nhiều Pass (2 đến 6 Pass):
Bắt buộc phải có **dòng trống cách biệt (`\n\n`)** giữa mỗi Pass để thông số thoáng, rõ ràng, không dính chùm:
```text
Quy trình: 2 Pass

Pass1 : Pon = 33 , Poff = 8 , IP = 4 , Volt = H , VF = 53 , Wire = 1 , OFFSET = 0.097

Pass2 : Pon = 14 , Poff = 6 , IP = 2 , Volt = L , VF = 36 , Wire = 2 , OFFSET = 0.019
```
*(Tương tự cho 3 Pass, 4 Pass, 5 Pass, 6 Pass).*
* **Quy chuẩn mã hóa:** `Volt` xuất dưới dạng `H` (High) hoặc `L` (Low); `OFFSET` định dạng 3 chữ số thập phân (`0.097`).

---

## 📱 3. QUY CHUẨN TỐI ƯU MOBILE & IN ẤN A4
* **Phím chọn nhanh chiều dày (`#ws-quick-chips`):** Bắt buộc có thuộc tính `display: flex; flex-wrap: wrap !important; gap: 6px;` để dàn trải đều đặn trên màn hình điện thoại từ $10\text{mm}$ đến $200\text{mm}$, không bị tràn ngang mép màn hình.
* **In phiếu công nghệ A4 (`@media print`):** Ẩn hoàn toàn thanh điều khiển, các nút bấm thao tác (`.results-header-actions`, `#ws-btn-copy-table`, `#ws-btn-reset-params`) để bản in công nghệ hoàn toàn sạch sẽ, sắc nét.

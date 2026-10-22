---
description: Kịch bản vận hành tự động khởi động phiên làm việc siêu tốc khi SirPhuong phát khẩu lệnh "Bắt đầu" hoặc "bắt đầu nhé" trên Máy Nhà hoặc Máy Công Ty.
---

# 🚀 KỊCH BẢN VẬN HÀNH: KHỞI ĐỘNG PHIÊN LÀM VIỆC TỰ ĐỘNG
# KHẨU LỆNH KÍCH HOẠT: "BẮT ĐẦU" / "BẮT ĐẦU NHÉ"

---

## 🎯 MỤC ĐÍCH KỊCH BẢN
Đảm bảo khi **SirPhuong** mở phiên làm việc mới trên bất kỳ máy nào (Máy Ở Nhà ⟷ Máy Công Ty) và phát khẩu lệnh:
> **"Bắt đầu"** (hoặc *"bắt đầu nhé"*, *"bắt đầu làm việc"*)

AI **BẮT BUỘC TỰ ĐỘNG THỰC HIỆN NGAY LẬP TỨC 3 BƯỚC MÀ KHÔNG ĐƯỢC CHỜ ĐỢI HAY YÊU CẦU NHẮC LẠI**:

---

## ⚡ 3 BƯỚC THỰC THI TỰ ĐỘNG CỦA AI

### 🔹 BƯỚC 1: ĐỌC TRẠM TRẠNG THÁI SIÊU TỐC
* Đọc ngay tệp tin `CURRENT_STATE.md` tại thư mục gốc của dự án.
* Nắm bắt: Thời gian làm việc gần nhất, phiên bản hiện tại, các việc vừa hoàn thành ở Đợt trước và việc còn dở dang.

### 🔹 BƯỚC 2: QUÉT LỊCH SỬ TỐI ƯU & KIỂM TRA MÃ NGUỒN GIT
1. Quét nhanh các dòng cuối của `docs/OPTIMIZATION_HISTORY.md` để nắm bối cảnh kỹ thuật sâu.
2. Kiểm tra trạng thái Git bằng lệnh:
   ```bash
   git status -s
   git log -n 3 --oneline
   ```
   *(Trên Windows nếu lệnh `git` chưa có trong biến môi trường PATH mặc định, AI chủ động gọi qua đường dẫn: `& 'C:\Users\SirPhuong\AppData\Local\Programs\Git\cmd\git.exe'`)*
3. Chạy nhanh công cụ kiểm tra cú pháp và toàn vẹn hệ thống:
   ```bash
   python scripts/verify_integrity.py
   ```

### 🔹 BƯỚC 3: BÁO CÁO PHẢN HỒI NGẮN GỌN ĐÚNG 3 GẠCH ĐẦU DÒNG
AI chỉ trả lời ngắn gọn, trực diện, không dài dòng, tuân thủ đúng định dạng 3 gạch đầu dòng sau:

* **1️⃣ Việc vừa hoàn thành ở phiên trước:** *(Tóm tắt 1-2 câu về Đợt vừa làm, tính năng hoặc lỗi đã xử lý xong)*
* **2️⃣ Trạng thái mã nguồn và đồng bộ Git hiện tại:** *(Báo cáo phiên bản, kết quả verify cú pháp 100%, commit hash gần nhất, trạng thái nhánh `main`)*
* **3️⃣ Đề xuất bước tiếp theo và sẵn sàng nhận lệnh:** *(Nêu rõ 1 việc trọng tâm tiếp theo cần triển khai và chờ lệnh của SirPhuong)*

---

## 🛡️ QUY CHUẨN KẾT THÚC BUỔI LÀM VIỆC (BẢO CHỨNG AN TOÀN KÉP)
Khi SirPhuong chuẩn bị tắt máy hoặc ra lệnh kết thúc phiên làm việc:
1. **Cập nhật Bộ Não:** Ghi nhận đầy đủ thông tin vào `CURRENT_STATE.md` và `docs/OPTIMIZATION_HISTORY.md`.
2. **Tạo bản sao lưu:** Tạo file nén trong `backups/autocut_YYYY-MM-DD(n).zip`.
3. **Commit & Push GitHub:**
   ```bash
   git add .
   git commit -m "<loại_thay_đổi>: mô tả công việc hoàn thành (vX.X.XX)"
   git push origin main
   ```
   Đảm bảo dữ liệu được bảo vệ an toàn kép giữa **OneDrive** và **GitHub repository**, giúp phiên làm việc trên máy tiếp theo lập tức kế thừa 100% dữ liệu sạch sẽ.

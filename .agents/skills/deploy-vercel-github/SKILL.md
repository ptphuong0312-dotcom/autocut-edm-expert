---
name: deploy-vercel-github
description: Quy trình đẩy code lên GitHub và Vercel cho các dự án Web App. Hướng dẫn cách tạo file backup an toàn, commit code và xử lý lỗi phân quyền (Not authorized) khi AI không có Token.
---

# Hướng dẫn Đưa Web App lên GitHub và Vercel (Auto-Deployment Workflow)

Khi người dùng yêu cầu "đưa web app lên github và vercel" hoặc "deploy web app", hãy thực hiện chính xác theo quy trình sau:

## Bước 1: Tạo bản sao lưu (Backup)
Luôn luôn đóng gói mã nguồn hiện tại thành file `.zip` vào thư mục `backups/` theo chuẩn tên `tên-dự-án_YYYY-MM-DD(n).zip` trước khi thực hiện commit.
**Lệnh nén bỏ qua các file rác:**
```bash
zip -r backups/backup_2024-01-01(1).zip . -x "node_modules/*" ".git/*" "backups/*"
```

## Bước 2: Chuẩn bị Commit Code
Thêm toàn bộ file thay đổi và tạo commit message rõ ràng:
```bash
git add .
git commit -m "chore: prepare for deployment"
```

## Bước 3: Đẩy mã nguồn lên GitHub (Và Vercel sẽ tự động Build)
Thông thường, các dự án Vercel đã được liên kết trực tiếp với repository trên GitHub (tính năng Auto-deploy). Do đó, chỉ cần push thành công lên GitHub, Vercel sẽ tự động cập nhật mà không cần dùng lệnh `vercel deploy`.

1.  **Chạy lệnh Git Push:**
    ```bash
    git push origin main
    ```
2.  **Xử lý lỗi quyền truy cập (Username required / Not authorized):**
    Vì Agent AI chạy trong hộp cát (sandbox) bảo mật, Agent sẽ **KHÔNG THỂ** tự động nhập Password hoặc đọc phiên đăng nhập trình duyệt của người dùng.
    Nếu lệnh `git push` bị treo và yêu cầu nhập Username/Password:
    *   Hãy **HỦY (Kill)** tiến trình lệnh đó ngay lập tức.
    *   Báo cáo lại với người dùng một cách chuyên nghiệp: *"Vì lý do bảo mật hộp cát, AI không có quyền giữ Token/Mật khẩu GitHub của bạn. Mọi code và backup đã được tôi chuẩn bị sẵn sàng 100%. Vui lòng mở Terminal của bạn và tự gõ lệnh `git push origin main`."*
3.  **Sử dụng Token nếu đã từng được cung cấp:**
    Nếu trong lịch sử chat (transcript) người dùng đã từng cung cấp Token (ví dụ: `ghp_...`), hãy chủ động thiết lập lại URL để vượt qua tường bảo mật:
    ```bash
    git remote set-url origin https://<username>:<token>@github.com/<username>/<repo>.git
    git push -u origin main
    ```
    *(Push thành công thì Vercel cũng sẽ tự động lên).*

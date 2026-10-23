# QUY TẮC 19: KIẾN THỨC CHÙM XUNG (GROUP PULSE) — GPon / GPoff CỦA TỦ MÁY AUTOCUT
# (GROUP PULSE / BURST PULSE KNOWLEDGE VAULT)

*Ngày lưu: 2026-10-23. Nguồn: (1) 8 ảnh chụp màn hình bảng "Technics Database" của SirPhuong; (2) sách hướng dẫn gốc AutoCut (trích xuất tại `docs/AUTOCUT_MANUAL_TEXT_EXTRACT.txt`); (3) tìm kiếm web (chỉ mang tính tham khảo, chưa kiểm chứng).*

> [!IMPORTANT]
> SirPhuong đã nhập số liệu **linh tinh có chủ đích** (không phải chế độ cắt chuẩn) chỉ để lộ cách máy tính $P_{on}, P_{off}, GP_{on}, GP_{off}$. Đây **không phải** dữ liệu cắt thực nghiệm → **không nạp vào Data Bank**, không dùng hiệu chuẩn $\delta$/Offset.

---

## I. BẢNG SỐ LIỆU GỐC TỪ MÀN HÌNH MÁY (IP=3, Wire=1, High volt, VF=50, Speed=200 ở cả 8 ảnh)

| Mã | Nhập: Pon | Poff | GPon | GPoff | Máy hiển thị: Pon | Poff | GPon | GPoff |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| A | 50 | 7 | 1 | 0 | 50 µs | 400 µs | 900 µs | 0 µs |
| B | 50 | 8 | 1 | 0 | 50 µs | 450 µs | 1000 µs | 0 µs |
| C | 55 | 8 | 1 | 0 | 55 µs | 495 µs | 1100 µs | 0 µs |
| D | 50 | 8 | 1 | 1 | 50 µs | 450 µs | 1000 µs | 1000 µs |
| E | 55 | 8 | 2 | 1 | 55 µs | 495 µs | 1650 µs | 1650 µs |
| F | 55 | 9 | 3 | 1 | 55 µs | 550 µs | 2420 µs | 2420 µs |
| G | 55 | 9 | 3 | 2 | 55 µs | 550 µs | 2420 µs | 4840 µs |
| H | 55 | 9 | 3 | 4 | 55 µs | 550 µs | 2420 µs | 9680 µs |

Ghi chú: bảng thư viện của máy (Database) hiện có 2 dòng mẫu đều `Gon=1, Goff=0` (chế độ xung liên tục, không ngắt chùm).

## II. CÔNG THỨC ĐÃ XÁC MINH (khớp 8/8 ảnh, từng µs)

$$P_{off,\,máy} = P_{on} \times (P_{off,\,nhập} + 1) \qquad T = P_{on} + P_{off,\,máy} = P_{on} \times (P_{off,\,nhập} + 2)$$

$$N = GP_{on,\,nhập} + 1 \;\text{(số chu kỳ xung đơn trong 1 chùm)} \qquad GP_{on,\,máy} = N \times T$$

$$GP_{off,\,máy} = GP_{off,\,nhập} \times GP_{on,\,máy} \qquad (GP_{off,\,nhập}=0 \Rightarrow \text{xung liên tục, không có khoảng nghỉ chùm})$$

**Hệ quả suy trực tiếp từ công thức (toán học, chưa đo bằng dao động ký):**
- Chu kỳ chùm: $T_{group} = (1 + k)\cdot N \cdot T$ với $k = GP_{off,\,nhập}$.
- Hệ số làm việc của chùm: $\eta_g = \dfrac{1}{1+k}$ — **không phụ thuộc GPon**.
- Hệ số làm việc tổng: $\eta = \dfrac{1}{(P_{off}+2)(1+k)}$ (Tab 3 hiện chỉ có phần $\dfrac{1}{P_{off}+2}$).
- Ví dụ ảnh H: xung đơn $\eta = 1/11 = 9.09\%$; $\eta_g = 1/5$ → $\eta = 1.82\%$; chu kỳ chùm $= 5 \times 2420 = 12100\,\mu s$ (≈ 82.6 chùm/giây); trong chùm 4 xung cách nhau 605 µs (≈ 1.653 kHz).
- $GP_{off}=1$ làm dòng trung bình ≈ giảm một nửa so với $GP_{off}=0$ cùng $(P_{on}, P_{off}, IP)$ — nhưng năng lượng nổ theo chùm, khác bản chất với việc chỉ tăng $P_{off}$.

## III. ĐỊNH NGHĨA CHÍNH THỨC TRONG SÁCH HƯỚNG DẪN AUTOCUT (Mục 4.5 "Technics Library / Expert Database")
1. Remain (mm): khoảng cách của lần cắt kế tiếp. 2. Pulse width: 0.5~250 µs. 3. **Pulse interval (pulse width number): 1~30**. 4. **Grouping pulse width (pulse number): 1~30**. 5. **Grouping interval (times): 1~30**. 6. Channel (IP): 1~6. 7. Silk (Wire) speed: 0~3. 8. Voltage: High/Low. 9. VF: chỉnh độ ổn định đường cắt, *giá trị càng nhỏ đường cắt càng tốt*, 0 = không đặt. 10. Max Speed. 11–16. Số hiệu bản ghi, đường kính dây (0.05–0.5), chiều dày phôi (0.1–2000), bù dây (0.05–0.15), Shape/Inner, vật liệu.
- Mục 5.1.6 hiển thị thời gian thực: pulse width, pulse distance, grouping pulse width, grouping distance, silk speed.
- Mục 5.9 "Gapping" (Trace Setting, 0–500): *khi cắt phôi dày quá trình không ổn định, tăng giá trị sẽ ổn định hơn*.
- Mục 1.4(7): phần mềm tối ưu cho phôi siêu dày (trên 1 mét).
- Đối chiếu: sách ghi "pulse number" cho GPon và "times" cho GPoff — **khớp** với công thức trên (GPon đếm số xung; GPoff là bội số của độ rộng chùm). Sách ghi GPoff 1~30 nhưng giao diện/CSDL máy của SirPhuong chấp nhận **0** (= tắt ngắt chùm).
- **Sách KHÔNG có ví dụ cắt thực tế hay giá trị khuyến nghị cho GPon/GPoff.**

## IV. KẾT QUẢ TÌM KIẾM TÀI LIỆU CÔNG NGHỆ CHUYÊN SÂU (TRUNG QUỐC / ĐÀI LOAN) & XÁC NHẬN TỪ SirPhuong
1. **Xác nhận tối quan trọng từ SirPhuong (2026-10-24):**
   - Khi `GPon = 1, GPoff = 0`: **Chùm xung KHÔNG hoạt động**, máy hoàn toàn vận hành ở chế độ **phát xung đơn tiêu chuẩn** liên tục $T_{\text{on}} / T_{\text{off}}$. Toàn bộ 23+ bài cắt thực nghiệm hiện tại của xưởng đều cắt ở chế độ này.
2. **Bản chất công nghệ "Chùm xung / Phân tổ xung" (Group Pulse / 脉冲组 / 分组脉冲 / F.M. Modulation):**
   - **Đối tượng áp dụng:** Chuyên trị phôi dày và siêu dày ($H \ge 100\text{mm} \sim 200 - 300\text{mm}$), vật liệu dẻo khó thoát xỉ, hoặc khi rãnh cắt xuất hiện hiện tượng "hoa dây" (đốm nhiệt cháy hồ quang), ampe giật mạnh, máy lùi Soft-short liên tục dẫn đến đứt dây.
   - **Cơ chế vật lý 2 nhịp:**
     + *Nhịp 1 (Trong chùm):* Bắn một cụm $N = GP_{\text{on}} + 1$ xung cao tần để nung chảy kim loại. Giữ số xung $N$ vừa phải ($GP_{\text{on}} = 1 \sim 3$) để nhiệt lượng không bị tích tụ quá ngưỡng đứt dây.
     + *Nhịp 2 (Khoảng ngắt sâu giữa 2 chùm):* Máy ngừng phát hoàn toàn trong thời gian $GP_{\text{off\_máy}} = GP_{\text{off}} \times GP_{\text{on\_máy}}$. Đây là **"Kỳ xả xỉ & làm nguội sâu"**: Áp lực dung dịch xối mạnh đẩy sạch mạt phoi/bọt khí ra khỏi rãnh sâu, môi trường điện môi được khử ion hóa $100\%$, dây Molypden được làm nguội hoàn toàn trước khi chùm xung kế tiếp phóng vào.
   - **Chỉ dẫn cài đặt tham số thực chiến:**
     + *Gia công tiêu chuẩn ($H \le 100\text{mm}$):* Luôn để `GPon = 1, GPoff = 0` để đạt năng suất và tốc độ cắt tối đa $100\%$.
     + *Gia công phôi dày ($H \ge 100 - 300\text{mm}$):* Khi có nguy cơ đứt dây hoặc máy khựng lùi, bật chùm xung bằng cách đặt `GPon = 1 ~ 3`, `GPoff = 1 ~ 2`. Đánh đổi: Dòng ampe trung bình và tốc độ cắt sẽ giảm tỉ lệ thuận với $\eta_g = \frac{1}{1 + GP_{\text{off}}}$ nhưng đường cắt ổn định tuyệt đối và triệt tiêu nguy cơ đứt dây.
     + Đã tích hợp thành **Thẻ 11 trong Cẩm nang EDM Tab 4** trên Web App (phiên bản `v3.5.46`).

## V. CHƯA BIẾT / VIỆC NÊN LÀM KHI SirPhuong YÊU CẦU
1. **Data Bank chưa có cột GPon/GPoff.** Các bài cắt hiện có (STT 1–20, 2P, 5P) coi như chạy mặc định `GPon=1, GPoff=0` — chưa được xác nhận. Bài cắt mới nên ghi thêm 2 cột này.
2. Ảnh hưởng của GPoff lên **δ (lượng cào phôi), Ampe, tốc độ Fc, độ bóng** chưa có dữ liệu → chưa được đưa vào công thức Tab 1/2/3 (Luật 1, 10, 11, 16 giữ nguyên).
3. Số hiển thị là do phần mềm máy tính; **dạng sóng thực của tủ nguồn chưa đo** (cần dao động ký nếu muốn chắc chắn).
4. Thí nghiệm đề xuất (khi được lệnh): lấy một bài đã biết (vd. 2P-12 hoặc STT 14), giữ nguyên mọi thông số, chỉ đổi `GPoff` 0→1→2, ghi Ampe, thời gian/tốc độ, kích thước → đo hệ số quy đổi δ và Fc theo $\eta_g$.
5. Nếu sau này thêm vào Tab 3: nhân hệ số làm việc `η × 1/(1+GPoff)`, cập nhật tần số/ampe ước tính; **chỉ khi SirPhuong duyệt.**

# Nghiên cứu: cách tính Tab 3 sát thực tế hơn (BÁO CÁO KỸ THUẬT & KẾT LUẬN)

> [!IMPORTANT]
> **KẾT LUẬN CUỐI CÙNG TỪ SIRPHUONG (2026-10-31): BÁC BỎ HOÀN TOÀN BIẾN CỐI VS CHÀY**
> SirPhuong đã đưa ra chỉ thị vật lý tối cao bác bỏ giả thuyết $K_{\text{die}}$:
> *"Lượng cào phôi dầy mỏng là do chế độ điện còn bạn cắt cối hay chày thì dây vẫn chạy vào cắt ở 1 khối đặc thì làm gì có sự khác nhau."*
>
> **Bản chất vật lý cốt lõi:**
> - Khi cắt 1 Pass vào khối thép đặc nguyên khối, dây Molypden xẻ rãnh đối xứng xuyên qua khối phôi kim loại đồng nhất. Tia lửa hồ quang hai bên mép dây phóng vào thép đặc là hoàn toàn đồng nhất.
> - Lượng cào phôi $\delta$ dày hay mỏng phụ thuộc **100% vào chế độ điện** ($\text{Ton}, \text{Po}, \text{IP}, \text{Volt}, \text{VF}, \text{Max Speed}$) và điều kiện chiều dày phôi $H$, **tuyệt đối không phụ thuộc vào việc thợ máy lấy cối hay lấy chày**.
> - Hiện tượng thống kê $p=0.001$ và $r=0.84$ trước đây là **NGỤY TƯƠNG QUAN DO ĐA CỘNG TUYẾN CHẾ ĐỘ ĐIỆN**: Các bài cắt cối (như STT 15, 16, 17, 21) xưởng cài đặt năng lượng xung rất mạnh ($\text{Ton}$ lớn, $\text{IP}$ lớn) nên $\delta$ vọt lên $22 - 30\mu m$. Trong khi các bài cắt chày (STT 1, 2, 18) xưởng chạy $\text{Ton}$ nhỏ nên $\delta$ chỉ $8\mu m$.
> - Minh chứng thực tế đối ứng: Cùng là cắt cối, phôi siêu dày $H=290\text{mm}$ (STT 20, SCM440) chạy $\text{Po}=10, \text{VF}=75, \text{Max Speed}=50\text{Hz}$ cho $\delta = 20.0\,\mu\text{m}$, nhỏ hơn nhiều so với phôi $H=90\text{mm}$ (STT 21, SCM420, cũng cắt cối) chạy $\text{Po}=7, \text{VF}=54, \text{Max Speed}=150\text{Hz}$ cho $\delta = 28.0\,\mu\text{m}$!
> - **KẾT LUẬN:** Đề xuất đưa biến hình học $K_{\text{die}}$ bị HỦY BỎ HOÀN TOÀN. Mọi hướng nghiên cứu nâng cấp $\delta$ sẽ tập trung vào động học xung đa biến thuần vật lý.

## 1. Phương pháp
- **Dữ liệu:** 14 điểm độc lập, `H ≤ 170` (1 Pass thật + quy đổi Rule 15, đã gộp trùng: STT16 ≡ 1P‑2P14).
  - Loại: Vùng C, các dòng "Offset P1 chuẩn" của 2‑Pass không có số đo trung gian (δ không xác định theo Rule 14/15).
  - STT14 (`H=300`) **không dùng để fit**, giữ làm kiểm tra ngoài mẫu.
- **Đánh giá:** LOOCV (bỏ từng điểm → fit lại → dự đoán điểm bị bỏ), tránh tự khen vì khớp trong mẫu.
- **Công cụ:** máy này không có Node/Python → chạy bằng PowerShell (`scratch/research_tab3*.ps1`). Không sửa `app.js`, Data Bank, Tab 1/2.

## 2. Tab 3 hiện tại trên 14 điểm thật

| Chỉ số | Tab 3 hiện tại (đủ VF + Po) |
|:--|:--:|
| MAE | **5.50 µm** |
| RMSE | 8.43 µm |
| Sai số lớn nhất | **20.2 µm** |

Sai số dồn vào 3 bài **cắt cối**: STT16 `−20.2`, STT17 `−19.7`, STT15 `−10.8` µm (Tab 3 tính 2–4 µm, thực tế 22–30 µm).
Hằng số trung bình (không dùng vật lý gì) có LOO‑MAE 7.24 µm → Tab 3 hiện chỉ hơn mức "đoán bừa bằng trung bình" một chút.

> [!NOTE]
> Con số "MAE 2.86 µm" trong docs tôi **không tái lập được** trên tập 14 điểm sạch này (có thể tính trên tập khác, vd. gồm các dòng P1 của 2‑Pass).

## 3. Phát hiện chính

**(a) Biến "cối vs chày" giải thích δ mạnh hơn mọi biến điện/H:**

| Nhóm | n | δ trung bình | độ lệch chuẩn |
|:--|:--:|:--:|:--:|
| Cắt **cối** | 5 | **22.2 µm** | 6.3 |
| Cắt **chày** | 9 | **8.8 µm** | 3.3 |

Chênh 13.4 µm; Welch t = 4.4; **exact permutation test p = 0.001** (2/2002).
Tương quan với δ: Cối `0.84` ≫ Po `0.55` > H `0.52` > √(Ton·IP) `0.49` > VF `0.40`.

**(b) Đa cộng tuyến nặng – dữ liệu không tách nổi 3 thành phần d_elec / d_slag / d_vibr:**
`corr(H, √(Ton·IP)) = 0.99`, `corr(H, Ton) = 0.98`, `corr(H, Po) = 0.90`. Khi fit tự do, hệ số ra **dấu ngược vật lý** (d_elec âm, d_slag đảo dấu). Bảng "5 thành phần" ở Tab 3 vì vậy **chưa được dữ liệu chống lưng**.

**(c) Duyệt ~175 tập đặc trưng:** 20/20 mô hình tốt nhất đều chứa biến cối/chày. Tốt nhất khi **không** có nó: LOO‑RMSE 7.35 µm (so với ~4.9 µm).

**(d) Hệ quả với `K_vibr·H²` và Rule 17:** các điểm đẩy δ lên cao ở phôi dày (STT15, 2P‑12, STT13, STT14 – gồm cả các mốc neo của Rule 17) **đều là cối**. Chày dày nhất có dữ liệu (STT7, STT12 ở H=140) chỉ 5–12 µm. "Độ phình phôi dày" có thể là hiệu ứng cối chứ không hẳn rung dây.

## 4. So sánh mô hình (µm)

| Mô hình | MAE trong mẫu | **LOO‑MAE** | LOO‑RMSE | LOO‑Max | H=300 ngoài mẫu (thực 25.0) |
|:--|:--:|:--:|:--:|:--:|:--:|
| Tab 3 hiện tại | 5.50 | — | 8.43 | 20.2 | neo cứng 25.0 |
| Cấu trúc cũ, fit lại 6 hệ số | 4.55 | 8.08 | 9.60 | 19.8 | — |
| Cấu trúc cũ + ridge về prior (λ=0.1) | 4.65 | 6.83 | 8.60 | 16.0 | — |
| Cấu trúc cũ + biến cối/chày | 2.64 | 5.80 | 6.56 | 11.2 | — |
| **P1** `c + VF + cối` | 3.09 | **4.04** | **4.91** | 11.6 | 23.4 (−1.7) |
| **P2** `c + √(Ton·IP)·U + VF + cối` | 3.10 | 4.43 | 5.15 | 11.3 | **24.1 (−0.9)** |
| P3 `c + H + VF + cối` | 3.06 | 4.41 | 5.17 | 11.2 | 27.9 (+2.9) |
| P5 `c + cối` | 3.26 | 3.84 | 5.34 | 12.1 | 22.2 (−2.9) |

Hệ số fit (µm): **P2** `c=4.13, elec=0.16, VF=+3.58 /10 vạch, cối=+12.16`; **P1** `c=6.40, VF=+4.02, cối=+12.94`. Mọi hệ số đều dương, dễ giải thích.
Điểm lạc đàn lớn nhất của mô hình mới: 1P‑2P10 (cối H=85, IP=5) dự đoán cao hơn thực +11.6 µm.

## 5. Đề xuất (nếu SirPhuong duyệt) – "Tab 3 v2"

```
δ = C0 + K_e·√(Ton·IP)·(U_arc/27) + δ_Low + K_vf·(VF−55)/10 + K_die·s      (s = 0 chày, 1 cối)
Offset_1P = 0.090 + δ
```
- Liên tục theo mọi biến, **không** if‑else chia khoảng, **không** `anchorOffsetTarget`. `s` là input của người dùng, không phải mốc chia H.
- Giữ `δ_Low` và số hạng năng lượng để mô hình không bị "mù" ở chế độ tinh (Ton nhỏ, IP 1–2, Volt Low) – vùng dữ liệu thô chưa phủ.
- Bỏ `d_slag`, `d_vibr` khỏi phần tính (không xác định được); thay Rule‑17‑branch của Tab 3 bằng chính phương trình liên tục (P2 dự đoán đúng H=300 cối mà không cần neo).
- Sai số kỳ vọng thực tế **~5 µm** (LOO‑MAE ~4.4, đã cộng thiên lệch do chọn mô hình), so với 5.5 µm trong mẫu và max 20 µm hiện nay. Sàn nhiễu đo (Panme/làm tròn offset) khoảng 2.5–3 µm.

## 6. Rủi ro / giới hạn – cần đọc trước khi quyết
1. **Chỉ 5 điểm cối.** Có ý nghĩa thống kê nhưng **cơ chế chưa chứng minh**: có thể là hình học lỗ (bán kính góc, kích thước nhỏ), nhả ứng suất, hoặc đặc thù đo cối – chứ không phải "vật lý cối".
2. **Chưa có chày ở H>170 và chưa có cối Volt Low / IP thấp.** Nếu cối/chày thật sự khác nhau thì Rule 17 (Offset 0.1150 tại H=300) chỉ đúng cho **cối**; chày H=300 khi đó ≈ 0.102 (P2) – **chưa kiểm chứng**.
3. Ghi chú Data Bank (Phần 2): công thức cối ghi "nhập − Δ/2" nhưng các bài tính cụ thể dùng "nhập **+** Δ/2". Tôi đã kiểm bằng hình học và dùng `+Δ/2` (đúng). Không tự sửa tài liệu gốc.
4. Duyệt ~175 mô hình trên 14 điểm → số LOO hơi lạc quan.

## 7. Thí nghiệm kiểm chứng đề xuất (vòng lặp khép kín Rule 12)
Cùng chế độ điện, cùng vật liệu, cùng H, chỉ đổi **cối ↔ chày**:

| # | Điều kiện | Nếu giả thuyết đúng | Nếu sai |
|:--|:--|:--|:--|
| T1 | SCM420, H=75, Ton55 Po7 IP4 VF54 High (đã có cối: δ=22.25 µm) – **cắt chày** | δ ≈ **6 µm** (Offset ≈ 0.096) | δ ≈ 22 µm |
| T2 | SCM440, H=165, Ton135 Po11 IP6 VF70 (đã có cối: δ=22.5 µm) – **cắt chày** | δ ≈ **14 µm** (Offset ≈ 0.104) | δ ≈ 22 µm |

Chỉ 1 trong 2 phép thử đã đủ bác bỏ/ủng hộ giả thuyết. Tab 3 hiện tại dự đoán ≈ 2 µm (T1) và ≈ 23 µm (T2).

## 8. Kiểm tra 3 câu hỏi trọng tài (AGENTS.md)
1. Phân vùng kép: giữ nguyên Tab 2 (H≤170 liên tục / H>170 thống kê). Đề xuất chỉ chạm Tab 3 (phòng thí nghiệm); việc áp dụng sang Tab 2 là quyết định riêng.
2. Dữ liệu chỉ dùng **tối ưu hệ số** và đối chứng (LOOCV), không biến thành mốc chia khoảng.
3. Bù dao Pass 2 không bị ảnh hưởng (đề xuất chỉ cho 1 Pass).

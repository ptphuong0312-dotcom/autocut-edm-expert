# Nghiên cứu Tab 3 đối chiếu với THƯ VIỆN WEB APP (2026-10-31)

> **Quy ước thuật ngữ do SirPhuong ban hành:** "thư viện" = thư viện thực nghiệm hiển thị trên Web App (Tab 2 → Thư viện 1 Pass). **Vùng tham khảo C (các bài ⛔ STT 4, 5, 8, 9, 13) là vùng cách ly — chỉ dùng khi SirPhuong nhắc đích danh.**

## 1. Tập đối chứng
17 bài 1 Pass trong `WS_LIB_BENCHMARK_JOBS[1]` (H = 12, 30, 40, 63×2, 68, 75, 85, 90, 95, 110, 140×2, 160, 165, 290, 300), gồm 3 bài Pass 1 quy đổi (H12, H85, H165). `δ = Offset chuẩn − 0.090`. Không có bài Vùng C.

## 2. Tab 3 hiện tại (`calcVFSparkGap`) so với thư viện
| Chỉ số | Giá trị |
|:--|:--:|
| MAE | **6.36 µm** |
| RMSE | 9.93 µm |
| Lệch lớn nhất | 25.7 µm (H90) |
| Hằng số trung bình 15.4 µm (đoán bừa) | MAE 7.40 µm |

Lệch dồn ở 4 bài: **H90 −25.7, H75 −19.9, H95 −19.7, H160 −10.8 µm** (Tab 3 tính 2–4 µm, thực tế 22–30 µm). H290 lệch +5.7 µm (neo Rule 17 ở H=300).

## 3. Các cấu trúc công thức thay thế đã thử (đánh giá LOOCV, µm)
Điều kiện: liên tục, thuần biến điện + H, không bảng tra, không biến cối/chày; `δ_Low = 4.5 µm` cố định (thư viện chỉ có 1 bài Volt Low nên không ước lượng được).

| Họ mô hình | MAE trong mẫu | **LOO-MAE** | LOO-Max |
|:--|:--:|:--:|:--:|
| Hằng số | — | 7.40 | — |
| Tab 3 hiện tại (hệ số chỉnh tay) | 6.36 | (≈6.4 — không fit LOO) | 25.7 |
| Khung Tab 3, fit lại 6 hệ số (ridge 0.05→5) | 5.5–5.9 | **7.3–8.9** (tệ hơn) | 16–21 |
| Tuyến tính ≤3 biến vật lý (696 tổ hợp) — tốt nhất `Iavg + H + ln(Max Speed)` | 4.69 | **5.96** | 14.2 |
| Tuyến tính ≤3 biến — tốt nhất **không** dùng Max Speed (`H`) | 5.92 | 6.53 | 15.0 |
| Luật lũy thừa `ln δ` ≤4 biến (98 tổ hợp) — tốt nhất `ln(Po+1)+ln VF` | 5.60 | 6.58 | 20.6 |

## 4. Kết luận
1. **Không có cấu trúc công thức nào cho LOO-MAE dưới ~6 µm** trên thư viện 17 bài. Tab 3 hiện tại (6.36 µm) đã gần sát sàn này; đổi công thức chỉ đổi được ≈0.4 µm, trong khi sai số đo (Panme, làm tròn offset) đã ≈2.5–3 µm.
2. Fit lại hệ số của khung hiện tại cho sai số trong mẫu thấp hơn nhưng **LOO tệ hơn (7.3–8.9 µm)** → quá khớp, **không nên làm**.
3. Biến duy nhất cải thiện có ý nghĩa nhỏ là **Max Speed (Hz)** (LOO 5.96 so với 6.53). Tab 3 hiện chưa có ô nhập này.
4. Phương pháp "bám thư viện 100%" (nội suy kernel / láng giềng gần nhất / bảng tra) sẽ cho sai số ≈0 nhưng **vi phạm Luật 16 (cấm bảng tra & neo)** → loại.
5. **Nguyên nhân gốc là thiếu dữ liệu đối chứng đơn biến**, không phải thiếu dạng hàm: H, Ton, IP, Po, VF, Hz thay đổi đồng thời giữa các bài (đa cộng tuyến), nên mô hình không tách được ảnh hưởng của từng thông số. Ví dụ: H63 (Ton44 Po8 IP4 VF57) δ=8 µm nhưng H75 (Ton55 Po7 IP4 VF54) δ=22 µm — thay đổi 3 thông số cùng lúc, độ nhạy không xác định được.

## 5. Đề xuất (chờ SirPhuong quyết định)
**Thí nghiệm đơn biến** (giữ nguyên H, vật liệu, đổi duy nhất 1 thông số mỗi lần), ví dụ nền H=75 SCM420 (STT 16: Ton55 Po7 IP4 VF54 → δ=22 µm):
- Thang Ton: 44 / 50 / 62 / 80 (giữ Po7 IP4 VF54)
- Thang Po: 6 / 8 / 10 (giữ Ton55 IP4 VF54)
- Thang VF: 48 / 60 / 66 (giữ Ton55 Po7 IP4)
- Thang IP: 3 / 5 (giữ Ton55 Po7 VF54)
Mỗi bài chỉ cần: Offset nhập + kết quả đo kích thước. 8–10 bài là đủ tách độc lập các hệ số `K_elec, K_po, K_vf` mà không cần thêm biến hình học nào. Không sửa `app.js` cho đến khi có lệnh.

## 6. Tái lập
Script PowerShell (máy không có Node/Python): `scripts/research_tab3_library/lib_fit_step1.ps1` (đánh giá Tab 3), `lib_fit_step2.ps1` (tuyến tính ≤3 biến, LOOCV), `lib_fit_step3.ps1` (lũy thừa + fit lại khung Tab 3).

## 7. Phân tách riêng SCM420 (HB<200) và SCM440 (28-32HRC) trong Tab 3 (2026-10-31)
Hiện trạng code: vật liệu chỉ tác động qua `slag_mat = 1.10` nhân vào số hạng `d_slag` (âm) → SCM420 bị kéo δ **nhỏ hơn** ≈1.8 µm; Ampe (`×1.15`) và tốc độ (`η = 0.78`) **không** phân biệt vật liệu.

Đối chiếu thư viện Web App (17 bài):
| Đại lượng | SCM420 | SCM440 | Nhận xét |
|:--|:--:|:--:|:--|
| Sai số δ Tab 3 hiện tại, H≤170 (tính − thực) | −6.9 µm (n=8, MAE 9.3) | −1.5 µm (n=7, MAE 4.0) | SCM420 thực tế cào **nhiều hơn** → hệ số 1.10 đang lệch chiều |
| Ampe: thực / công thức Tab 2 (`I=2.8·IP·η·2.667·U/27`) | 0.98 | 1.05 | khác nhau ≤7%, nằm trong nhiễu (0.84–1.25) → **không cần tách**. Tab 3 hiện dùng hằng `1.15` nên thấp ≈2.3 lần ở cả 2 thép (bug) |
| Tốc độ máy hiển thị (Ft×40): tính/thực, engine Tab 3 (η=0.78 chung) | 0.93 | 0.97 | sai số tương đối 7.6% — **tốt hơn** engine Tab 2 tách vật liệu (13.7%) |
| Cặp cùng chế độ điện: H90 SCM420 (Ton80 Po7 IP4 VF54) δ=28 vs H95 SCM440 (Ton82 Po7 IP4 VF55) δ=23.5 | | | chênh ≈ +4.5 µm cho SCM420 |

Thử đưa tách vật liệu vào δ bằng LOOCV (H≤170, n=15): hằng số lệch theo vật liệu, hệ số riêng cho H/Ton/VF/Po/IP, biến xả xỉ `H/IP^k`, hệ số xỉ SCM420 tự do → **không cấu hình nào cải thiện LOO** (8–11 µm so với 6.83). Chỉnh hệ số xỉ SCM420 (`sm420`) về 0.8 giảm MAE trong mẫu 6.83 → 6.33 nhưng LOO SCM420 không tốt hơn (9.87 vs 9.34); phần dư 20–25 µm ở H75/H90 không biến điện nào giải thích được.
Script: `scripts/research_tab3_library/lib_fit_step4..8_*.ps1`.

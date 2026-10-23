# QUY TẮC 18: KHO TRI THỨC VÀ KHẨU LỆNH TINH CHỈNH ĐỘ CHÍNH XÁC LƯỢNG CÀO PHÔI
# (SPARK GAP ACCURACY REFINEMENT INTELLIGENCE VAULT & RETRIEVAL TRIGGER)

---

## 🚨 MỆNH LỆNH TRỰC TIẾP TỪ SIRPHUONG (USER DIRECTIVE - 2026-10-23)
> *"Tạm thời cứ lưu trữ số liệu phân tích này lại, sau này tôi đề cập trực tiếp hoặc gián tiếp đến vấn đề tinh chỉnh phát triển độ chính xác lượng cào phôi thì bạn đưa những thông tin này ra."*

Tài liệu này là **ĐIỀU LUẬT KHỞI TẠO TỰ ĐỘNG**. Bất kỳ AI nào tiếp quản hệ thống, khi người dùng đề cập **trực tiếp hoặc gián tiếp** đến việc **"tinh chỉnh phát triển độ chính xác lượng cào phôi"** (hoặc *"tinh chỉnh delta"*, *"độ chính xác cào phôi"*, *"nâng cấp công thức lượng cào phôi"*), AI **BẮT BUỘC PHẢI MANG TOÀN BỘ BỘ DỮ LIỆU VÀ CÁC ĐỀ XUẤT DƯỚI ĐÂY RA TRÌNH BÀY NGAY LẬP TỨC**.

---

## I. TỔNG HỢP KẾT QUẢ KIỂM TOÁN THỰC NGHIỆM ĐỘC LẬP (LOOCV N=14 ĐIỂM H ≤ 170mm)

1. **Đánh giá Tab 3 hiện hành:**
   - Tập kiểm định: 14 bài cắt độc lập sạch (1 Pass thật và các bài Pass 1 quy đổi theo Rule 15, đã loại bỏ vùng tham khảo C và các điểm trùng lặp).
   - Sai số trong mẫu: $\text{MAE} = 5.50\,\mu\text{m}$, $\text{RMSE} = 8.43\,\mu\text{m}$, $\text{Max Error} = 20.20\,\mu\text{m}$.
   - **Vùng lệch dồn:** Lệch tập trung toàn bộ ở 3 bài **cắt cối**:
     + STT 16 ($H=75$, SCM420 cối): Tính $2.05\,\mu\text{m}$ vs Thực $22.25\,\mu\text{m}$ ($\Delta = -20.20\,\mu\text{m}$).
     + STT 17 ($H=95$, SCM440 cối): Tính $3.84\,\mu\text{m}$ vs Thực $23.50\,\mu\text{m}$ ($\Delta = -19.66\,\mu\text{m}$).
     + STT 15 ($H=160$, SCM420 cối): Tính $19.23\,\mu\text{m}$ vs Thực $30.00\,\mu\text{m}$ ($\Delta = -10.77\,\mu\text{m}$).

2. **Phát hiện cốt lõi số 1: Hiện tượng phân hóa Cối vs Chày (Die vs Punch Effect):**
   - Lượng cào phôi thực tế $\delta$ của 5 bài cắt cối: $\text{Mean} = 22.15\,\mu\text{m}$ ($SD = 6.26\,\mu\text{m}$).
   - Lượng cào phôi thực tế $\delta$ của 9 bài cắt chày: $\text{Mean} = 8.78\,\mu\text{m}$ ($SD = 3.31\,\mu\text{m}$).
   - Độ chênh lệch trung bình: $+13.37\,\mu\text{m}$.
   - Kiểm định thống kê: Welch $t = 4.44$, Kiểm định hoán vị chính xác (Exact Permutation Test $C_{14}^5 = 2002$ tổ hợp) cho kết quả $p = 0.0010$ (cực kỳ có ý nghĩa thống kê).
   - Tương quan với $\delta$: Biến Cối ($r = 0.838$) vượt trội hoàn toàn so với $\text{Po}$ ($0.553$), $H$ ($0.523$), $\sqrt{\text{Ton} \cdot \text{IP}}$ ($0.493$), $\text{VF}$ ($0.396$).
   - Duyệt toàn bộ 175 tập hợp đặc trưng con: **20/20 mô hình tốt nhất đều chứa biến Cối/Chày**.

3. **Phát hiện cốt lõi số 2: Hiện tượng đa cộng tuyến nghiêm trọng giữa các biến điện:**
   - $r(H, \sqrt{\text{Ton} \cdot \text{IP}}) = 0.990$.
   - $r(H, \text{Ton}) = 0.976$.
   - $r(H, P_o) = 0.904$.
   - $r(H, \text{IP}) = 0.840$.
   - **Hệ quả vật lý:** Do thợ máy tăng đồng bộ $H \rightarrow \text{Ton} \rightarrow \text{IP} \rightarrow P_o$ để chống đứt dây, dữ liệu thực tế bị đa cộng tuyến gần như tuyệt đối. Mô hình toán học không thể tự tách rời độc lập 3 thành phần $d_{\text{elec}}$, $d_{\text{slag}}$, $d_{\text{vibr}}$ nếu không có thêm dữ liệu test chéo.

---

## II. CÁC MÔ HÌNH ỨNG VIÊN TỐI ƯU (TAB 3 V2)

### ỨNG VIÊN P2 (Vật lý Nhiệt động + VF + Cối/Chày - Khuyên dùng):
$$\delta = C_0 + K_{\text{elec}} \cdot \sqrt{\text{Ton} \cdot \text{IP}} \cdot \left(\frac{U_{\text{arc}}}{27}\right) + \delta_{\text{Low}} + K_{\text{vf}} \cdot \left(\frac{\text{VF} - 55}{10}\right) + K_{\text{die}} \cdot s$$
*(Trong đó: $s = 0$ nếu cắt chày, $s = 1$ nếu cắt cối; $\delta_{\text{Low}} = 0.00450\,\text{mm}$ khi Volt Low)*

* **Hệ số tối ưu:**
  - $C_0 = +4.13\,\mu\text{m}$ ($0.00413\,\text{mm}$)
  - $K_{\text{elec}} = 0.16\,\mu\text{m}$ ($0.00016\,\text{mm}$)
  - $K_{\text{vf}} = +3.58\,\mu\text{m} / 10\,\text{vạch}$ ($0.00358\,\text{mm}$)
  - $K_{\text{die}} = +12.16\,\mu\text{m}$ ($0.01216\,\text{mm}$)
* **Chỉ số kiểm định:**
  - Sai số trong mẫu: $\text{MAE} = 3.10\,\mu\text{m}$, $\text{Max Error} = 8.87\,\mu\text{m}$.
  - Sai số chéo ngoại suy (LOOCV): $\text{LOO-MAE} = 4.43\,\mu\text{m}$, $\text{LOO-RMSE} = 5.15\,\mu\text{m}$, $\text{LOO-Max} = 11.31\,\mu\text{m}$.
  - Kiểm tra ngoài mẫu tại $H=300\text{mm}$ cối (STT 14: thực tế $\delta = 25.0\,\mu\text{m}$): Mô hình dự đoán đạt **$24.08\,\mu\text{m}$** (chỉ lệch đúng $-0.92\,\mu\text{m}$ hoàn toàn tự nhiên mà không cần ép mốc neo).

---

## III. HAI BÀI TEST THỰC NGHIỆM ĐỐI ỨNG ĐỂ KIỂM CHỨNG TRƯỚC KHI SỬA CODE

Trước khi quyết định can thiệp sửa đổi `app.js`, SirPhuong có thể thực hiện 1 trong 2 bài cắt thực nghiệm đối ứng (giữ nguyên $100\%$ chế độ điện và chiều dày, chỉ đổi từ CẮT CỐI sang CẮT CHÀY):

1. **Thí nghiệm T1 (SCM420, $H=75\text{mm}$):**
   - Chế độ điện: $\text{Ton}=55, P_o=7, \text{IP}=4, \text{VF}=54, \text{Volt}=\text{High}$ (đã có kết quả Cắt Cối STT 16: $\delta_{\text{cối}} = 22.25\,\mu\text{m}$).
   - Thực hiện: **Cắt lấy Chày**.
   - **Tiêu chuẩn đối chứng:**
     + Nếu giả thuyết Cối/Chày đúng: Lượng cào phôi của chày sẽ co hẹp về $\delta \approx 6.0\,\mu\text{m} \implies \text{Offset} \approx 0.096\,\text{mm}$.
     + Nếu Tab 3 hiện tại đúng: Lượng cào phôi vẫn giữ mức $\delta \approx 2.0 - 4.0\,\mu\text{m}$.
     + Nếu cối và chày không khác nhau: Lượng cào phôi sẽ vẫn ở mức $\approx 22.0\,\mu\text{m}$.

2. **Thí nghiệm T2 (SCM440, $H=165\text{mm}$):**
   - Chế độ điện: $\text{Ton}=135, P_o=11, \text{IP}=6, \text{VF}=70, \text{Volt}=\text{High}$ (đã có kết quả Cắt Cối STT 2P-12: $\delta_{\text{cối}} = 22.50\,\mu\text{m}$).
   - Thực hiện: **Cắt lấy Chày**.
   - **Tiêu chuẩn đối chứng:**
     + Nếu giả thuyết Cối/Chày đúng: Lượng cào phôi của chày sẽ rơi vào $\delta \approx 13.0 - 15.0\,\mu\text{m} \implies \text{Offset} \approx 0.103 - 0.105\,\text{mm}$.
     + Nếu không có hiệu ứng Cối/Chày: Lượng cào phôi vẫn giữ $\delta \approx 22.5\,\mu\text{m}$ ($\text{Offset} \approx 0.1125\,\text{mm}$).

---

## IV. TÀI LIỆU VÀ SCRIPT LƯU TRỮ ĐI KÈM
* Tài liệu chi tiết: `docs/RESEARCH_TAB3_ALTERNATIVE_MODELS.md`
* Scripts kiểm thử PowerShell độc lập:
  - `docs/research_tab3.ps1`: Bộ giải nghiệm hồi quy tuyến tính, Ridge Regression & LOOCV.
  - `docs/research_tab3_b.ps1`: Phân tích thống kê Welch t-test, Permutation test và duyệt 175 tập đặc trưng.
  - `docs/research_tab3_c.ps1`: Kiểm định 5 mô hình ứng viên và ngoại suy $H=300\text{mm}$.

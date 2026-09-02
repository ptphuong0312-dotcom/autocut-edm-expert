# NGUYÊN TẮC VẬT LÝ GIA CÔNG NĂNG SUẤT CAO & GIA CÔNG BỀ MẶT MỊN
# (HIGH-PRODUCTIVITY VS FINE-SURFACE FINISH REGIMES SOP)

---

## 🚨 TRIẾT LÝ VẬT LÝ NỀN TẢNG (THE CORE EDM PLASMA PRINCIPLE):

Bề mặt cắt dây EDM CNC được cấu thành từ hàng triệu **hố rỗ phóng điện (discharge craters)** li ti xếp chồng lên nhau:
* Thể tích và chiều sâu của mỗi hố rỗ tỷ lệ thuận với năng lượng xung đơn:
  $$h_{\text{crater}} \propto \sqrt{\text{Ton} \cdot \text{IP}} \cdot U_{\text{arc}}$$
* Tốc độ cắt và năng suất tỷ lệ thuận với tổng công suất nhiệt và tần số phát xung:
  $$MRR \propto P_{\text{avg}} = I_{\text{peak}} \cdot U_{\text{arc}} \cdot \left(\frac{\text{Ton}}{\text{Ton} + \text{Toff}}\right)$$

Từ hai phương trình nền tảng này, quy luật điều khiển máy được phân lập thành 2 trường phái kỹ thuật chuyên biệt:

---

## I. NGUYÊN TẮC GIA CÔNG NĂNG SUẤT CAO (HIGH-PRODUCTIVITY REGIME - CẮT NHANH, PHÁ THÔ)

Mục tiêu: Đạt tốc độ bóc tách kim loại ($MRR$ hay $SpeedArea$) lớn nhất trong thời gian ngắn nhất, đồng thời bảo vệ an toàn cho sợi dây Moly $\Phi 0.18\text{mm}$.

### 1. Thứ tự ưu tiên can thiệp chuẩn khoa học:
1. **Ưu tiên số 1 - Rút ngắn thời gian nghỉ $\text{Po}$ (Toff):**
   * Đây là "chân ga" tăng tốc an toàn và hiệu quả nhất.
   * Rút ngắn $\text{Po}$ từ $8 \rightarrow 7 \rightarrow 6$ giúp tăng tần số phóng điện trong 1 giây mà không làm tăng năng lượng bạo lực của từng tia lửa $\implies$ Tốc độ nhảy vọt từ $20\% - 35\%$ mà dây Moly vẫn êm, không bị sốc nhiệt.
2. **Ưu tiên số 2 - Tăng điện áp theo dõi Servo $\text{VF}$:**
   * Tăng $\text{VF}$ thêm $+3 \sim +8$ đơn vị để động cơ bước/servo đẩy bàn máy bám sát tốc độ phóng điện mới, giảm khoảng hở chết (idle gap).
3. **Ưu tiên số 3 - Tăng nhẹ thời gian phát xung $\text{Ton}$:**
   * Tăng $\text{Ton}$ thêm $+4 \sim +15\mu s$ để mở rộng thể tích bóc tách của vũng kim loại nóng chảy.
   * *Giới hạn an toàn:* Luôn khống chế chu kỳ tải $\text{Duty} \le 20\% - 25\%$ để nước kịp làm nguội dây.
4. **Hạn chế tối đa việc tùy tiện tăng $\text{IP}$:**
   * $\text{IP}$ (Đỉnh dòng xung) phải được **ghim cố định theo khung chịu tải của chiều dày $H$**.
   * Với dây Moly $\Phi 0.18\text{mm}$ (tiết diện chỉ $0.0254\text{ mm}^2$), tăng $\text{IP}$ quá đà làm mật độ dòng vọt lên $> 600\text{ A/mm}^2$, nung đỏ dây và gây đứt tức thì!
5. **Quy luật ở phôi siêu dày ($H > 160\text{mm}$):**
   * Khi $\text{IP}=6$ đã kịch trần toàn bộ số sò của máy, **bắt buộc phải tăng năng suất bằng cách rút $\text{Po}$ xuống $7 \sim 6$, nâng $\text{VF}$ lên $64 \sim 69$ và điều chế $\text{Ton}$ lên $130 \sim 140\mu s$**.

---

## II. NGUYÊN TẮC GIA CÔNG BỀ MẶT MỊN (FINE-SURFACE FINISH REGIME - CẮT TINH, ĐỘ BÓNG CAO)

Mục tiêu: Đạt bề mặt phẳng lì, satin mờ mịn hoặc bóng gương ($Ra \le 1.0 \sim 1.6\mu m$), triệt tiêu hoàn toàn sọc vằn, lớp biến trắng (White Layer) và nứt vi mô.

### 1. Thứ tự ưu tiên can thiệp chuẩn khoa học:
1. **Ưu tiên số 1 - Hạ $\text{IP}$ xuống mức tối thiểu (1 đến 2 sò):**
   * $\text{IP}$ quyết định trực tiếp chiều sâu hố rỗ.
   * Dùng búa nhỏ (1 - 2 sò) thì hố rỗ chỉ sâu $\le 1\mu m$, bề mặt phôi lập tức trở nên phẳng mịn, nhẵn bóng.
2. **Ưu tiên số 2 - Rút ngắn $\text{Ton}$ cực ngắn (Vi xung $\text{Ton} = 8 \sim 16\mu s$):**
   * Dập tắt xung cực nhanh trước khi nhiệt kịp truyền sâu vào thân phôi, triệt tiêu vùng ảnh hưởng nhiệt (HAZ) và lớp biến trắng.
3. **Ưu tiên số 3 - Chuyển sang điện áp thấp ($\text{Volt} = \text{Low}$):**
   * $\text{Volt Low}$ ($50 - 60\text{V}, U_{\text{arc}} \approx 22\text{V}$) tạo áp lực nổ plasma êm dịu, gọt phôi êm như dao cạo, bề mặt đồng màu và sáng mịn.
4. **Ưu tiên số 4 - Kéo dài thời gian nghỉ xung $\text{Po}$ ($\text{Po} \ge 8 \sim 15$):**
   * Đảm bảo màng nước rửa trôi $100\%$ hạt bụi xỉ li ti, loại bỏ hoàn toàn hiện tượng **đánh lửa thứ cấp (Secondary Sparking)** gây sọc đen hoặc xước vệt.
5. **Ưu tiên số 5 - Hạ $\text{VF}$ ($30 \sim 40$) & Tăng tốc độ dây ($\text{Wire 2 / Wire 3}$):**
   * Giảm $\text{VF}$ giúp servo chạy nhẹ nhàng thư thái, không gằn ép gây rung dây.
   * Tăng tốc độ dây giúp liên tục đổi mới vị trí tiếp xúc của dây Moly, bề mặt không để lại vết hằn.

---

## III. MA TRẬN THIẾT LẬP THÔNG SỐ ĐỐI CHIẾU

| Thông số máy AutoCut | Chế độ TĂNG NĂNG SUẤT (Nhanh / Phá thô) | Chế độ BỀ MẶT MỊN (Bóng / Cắt tinh) |
|:---|:---|:---|
| **$\text{IP}$ (Sò công suất)** | Giữ cố định theo chiều dày $H$ ($3 \sim 5$ sò) | **Hạ kịch sàn về 1 hoặc 2 sò** |
| **$\text{Ton}$ (Thời gian xung)** | Tăng cao ($30 \sim 140\mu s$) | **Rút thật ngắn ($8 \sim 16\mu s$)** |
| **$\text{Po}$ (Thời gian nghỉ)** | **Rút ngắn ($5 \sim 7$)** để tăng tần số | **Kéo dài ($8 \sim 15$)** để rửa sạch phoi |
| **$\text{Volt}$ (Điện áp hồ quang)**| $\text{High}$ (Cao áp phóng bộc phá) | **$\text{Low}$ (Hạ áp phóng êm mượt)** |
| **$\text{VF}$ (Theo dõi Servo)** | Tăng cao ($60 \sim 70$) bám sát tốc độ | Hạ thấp ($30 \sim 40$) lướt nhẹ nhàng |
| **Cấp tốc độ dây ($\text{Wire}$)**| $\text{Wire 1}$ (Dây chậm, tiết kiệm) | **$\text{Wire 2 / Wire 3}$ (Dây nhanh, lướt bóng)** |
| **Tốc độ cắt đạt được** | **Rất nhanh ($120 \sim 240\text{ mm}^2/\text{p}$)** | Chậm ($25 \sim 50\text{ mm}^2/\text{p}$) |
| **Độ bóng bề mặt ($Ra$)** | $Ra \approx 3.2 \sim 4.5\mu m$ (Nhám vỏ cam) | **$Ra \approx 1.0 \sim 1.6\mu m$ (Mịn màng, bóng sáng)** |

---

## IV. GIẢI PHÁP TỐI THƯỢNG: PHỐI HỢP CHIẾN LƯỢC 2 PASS
Để đạt được cả **Tốc độ xẻ phôi nhanh** lẫn **Bề mặt khuôn mẫu tuyệt đối mịn màng**, người vận hành máy luôn áp dụng quy trình 2 Pass:
* **Pass 1:** Chạy chế độ Năng suất cao $\rightarrow$ Chừa lượng phôi mỏng $\mathbf{O_2 = 0.022 \sim 0.030\text{mm}}$.
* **Pass 2:** Chạy chế độ Siêu mịn ($\text{Ton}=12\sim 16, \text{Po}=5\sim 6, \text{IP}=2, \text{Volt Low}, \text{VF}=36\sim 40, \text{Ampe} \le 0.2\text{A}$) $\rightarrow$ Lướt sạch đỉnh nhám, đưa chi tiết về độ chính xác danh nghĩa hoàn mỹ!

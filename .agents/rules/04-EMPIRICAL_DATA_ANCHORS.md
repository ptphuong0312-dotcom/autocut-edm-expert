# DỮ LIỆU THỰC NGHIỆM XƯỞNG (EMPIRICAL ANCHOR DATA)

Tài liệu này lưu trữ toàn bộ các thông số cắt thực tế đa lớp (1 Pass, 2 Pass, và mở rộng cho 3, 4, 5, 6 Pass) mà người dùng đã đo đạc thành công tại xưởng.
AI BẮT BUỘC phải đọc tài liệu này để tham chiếu điểm neo (Anchor) khi thực hiện nội suy chế độ điện và bù dao.

---

## PHẦN 1: DỮ LIỆU CẮT 1 PASS (NỀN TẢNG NỘI SUY OFFSET & KHE HỞ)
Các dữ liệu này là cơ sở để tính toán Tốc độ mài (Fc), Khe hở tia lửa (Gap) và Lượng bù dao chuẩn tuyệt đối.

| H (mm) | Vật liệu | Cấp độ | Ton | Toff | IP | Volt | VF | Offset chuẩn | Khe hở Gap | Kết quả đo thực tế |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 12 | SCM440 | Chuẩn | 20 | 7 | 2 | Low | 50 | **0.105** | 0.015 | Chuẩn kích thước tuyệt đối (WS-EXP-02) |
| 30 | SCM440 | Cấp 6 | 32 | 5 | 4 | High | 65 | **0.098** | 0.008 | Bù dao ban đầu 0.115 làm chày to 0.034. Đã giảm 0.017 |
| 40 | SCM440 | Cấp 6 | 36 | 5 | 4 | High | 65 | **0.098** | 0.008 | Bù dao ban đầu 0.115 làm chày to 0.034. Đã giảm 0.017 |
| 45 | SCM420 | Chuẩn | 50 | 7 | 3 | Low | 50 | **0.105** | 0.015 | Chuẩn kích thước tuyệt đối (WS-EXP-01) |
| 63 | SCM420 | Cấp 6 | 44 | 7 | 5 | High | 55 | **0.095** | 0.005 | Bù dao ban đầu 0.118 làm chày to 0.046. Đã giảm 0.023 |
| 63 | SCM420 | Cấp 4 | 24 | 7 | 4 | High | 43 | **0.081** | -0.009 (âm) | Ép điện yếu cho phôi dày, dây kéo lê dính phôi (WS-EXP-17). |
| 68 | SCM440 | Chuẩn | 70 | 7 | 3 | Low | 50 | **0.097** | 0.007 | Chuẩn kích thước tuyệt đối (WS-EXP-03) |
| 140 | SCM420 | Ép Dài | 120 | 8 | 5 | High | 55 | **0.095** | 0.005 | Chuẩn kích thước tuyệt đối |
| 160 | SCM420 | Ép Dài | 120 | 8 | 5 | High | 55 | **0.110** | 0.020 | Chuẩn kích thước tuyệt đối |
| 300 | SCM440 | Phá thô| 120 | 9 | 6 | High | 65 | **0.110** | 0.020 | Dữ liệu nội suy gốc cực hạn |

---

## PHẦN 2: DỮ LIỆU CẮT 2 PASS (KIỂM CHỨNG TẦM VƯƠN G2 & O1 BÙ TRỪ)

### 2.1. Nhóm Dữ liệu Chuẩn (Cấp 6 và Cấp 4 Tab 1)
| H | Pass | Ton | Toff | IP | Volt | VF | Max Speed | Offset | Kích thước & Phân tích |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **63** | P1 | 24 | 7 | 4 | High | 43 | 150Hz | 0.081 | (Cấp 4) Nhập ban đầu O1=0.116, O2=0.022. Chày to 0.070. Đã giảm O1 về 0.081. |
| | P2 | 15 | 5 | 2 | High | 36 | 100Hz | 0.022 | (Remain) Tốc độ đạt kịch trần 240 mm²/p |
| **63** | P1 | 44 | 7 | 5 | High | 55 | 150Hz | 0.093 | (Cấp 6) Nhập ban đầu O1=0.118, O2=0.024. Chày to 0.050. Đã giảm O1 về 0.093. |
| | P2 | 20 | 5 | 3 | High | 40 | 100Hz | 0.024 | (Remain) Tốc độ đạt kịch trần 240 mm²/p |
| **30** | P1 | 28 | 6 | 4 | High | 60 | 200Hz | 0.1075 | (Cấp 6, Cắt Cối) Nhập ban đầu O1=0.115, O2=0.022. Cối nhỏ 0.015. Giảm O1 về 0.1075. |
| | P2 | 16 | 5 | 2 | Low | 40 | 150Hz | 0.022 | (Remain) Tốc độ đạt kịch trần 360 mm²/p |

### 2.2. Nhóm Dữ liệu Custom (Tự do - Chuẩn tuyệt đối kích thước)
| H | Pass | Ton | Toff | IP | Wire | Volt | VF | Max Speed (Hz) | Offset | Phân tích quy luật |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **12** | P1 | 20 | 7 | 2 | 2 | Low | 50 | **150Hz** | **0.098** | Kết hợp O1=0.098 và O2=0.040 ra kích thước chuẩn. |
| | P2 | 12 | 7 | 2 | 2 | Low | 20 | **130Hz** | **0.040** | |
| **32** | P1 | 30 | 7 | 3 | 1 | Low | 50 | **200Hz** | **0.091** | |
| | P2 | 5 | 15 | 1 | 1 | Low | 10 | **130Hz** | **0.030** | Dòng cực thấp (IP=1), O1=0.091 |
| **62** | P1 | 70 | 7 | 4 | 1 | High | 50 | **150Hz** | **0.092** | |
| | P2 | 15 | 7 | 2 | 2 | Low | 20 | **100Hz** | **0.030** | |
| **90** | P1 | 100 | 7 | 3 | 1 | High | 50 | **150Hz** | **0.072** | **QUY LUẬT IP:** So với H=90 bên dưới, IP giảm 1 nấc (4->3). |
| | P2 | 15 | 7 | 2 | 3 | Low | 20 | **100Hz** | **0.030** | Tia lửa P1 nhỏ đi, nên O1 cũng phải ép nhỏ lại (0.072) để chừa đúng Remain. |
| **90** | P1 | 100 | 7 | 4 | 1 | High | 50 | **150Hz** | **0.085** | **QUY LUẬT IP:** So với H=90 bên trên, IP tăng 1 nấc (3->4). |
| | P2 | 15 | 7 | 2 | 3 | Low | 20 | **100Hz** | **0.030** | Tia lửa P1 phóng to ra, nên O1 phải kéo rộng ra (0.085) để không bị phạm phôi. |
| **140**| P1 | 120 | 8 | 5 | 1 | High | 55 | **60Hz** | **0.098** | |
| | P2 | 25 | 7 | 2 | 2 | Low | 25 | **100Hz** | **0.030** | |

---

## PHẦN 3: DỮ LIỆU CẮT NHIỀU PASS MỞ RỘNG (3, 4, 5, 6 PASS)

### 3.1. Nhóm Dữ liệu Cắt 3 Pass (Custom)
| H | Pass | Ton | Toff | IP | Wire | Volt | VF | Max Speed (Hz) | Offset |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **12** | P1 | 20 | 7 | 3 | 1 | Low | 50 | 150Hz | **0.094** |
| | P2 | 10 | 7 | 2 | 2 | Low | 25 | 150Hz | **0.030** |
| | P3 | 3 | 20 | 1 | 3 | Low | 10 | 150Hz | **0.015** |
| **35** | P1 | 30 | 7 | 3 | 1 | Low | 50 | 200Hz | **0.073** |
| | P2 | 11 | 7 | 2 | 2 | Low | 20 | 140Hz | **0.040** |
| | P3 | 2 | 10 | 2 | 3 | Low | 5 | 120Hz | **0.020** |
| **54** | P1 | 50 | 7 | 4 | 1 | Low | 50 | 150Hz | **0.085** |
| | P2 | 20 | 7 | 2 | 2 | Low | 25 | 150Hz | **0.035** |
| | P3 | 3 | 20 | 1 | 3 | Low | 10 | 150Hz | **0.010** |
| **62** | P1 | 70 | 7 | 4 | 1 | High | 50 | 150Hz | **0.075** |
| | P2 | 20 | 7 | 2 | 2 | Low | 20 | 110Hz | **0.030** |
| | P3 | 5 | 10 | 2 | 3 | Low | 5 | 100Hz | **0.015** |
| **90** | P1 | 90 | 7 | 4 | 1 | High | 50 | 150Hz | **0.087** |
| | P2 | 20 | 6 | 2 | 2 | Low | 20 | 120Hz | **0.020** |
| | P3 | 6 | 7 | 2 | 3 | Low | 5 | 100Hz | **0.010** |
| **140**| P1 | 120 | 8 | 5 | 1 | High | 55 | 60Hz | **0.093** |
| | P2 | 25 | 7 | 2 | 2 | Low | 25 | 100Hz | **0.030** |
| | P3 | 5 | 10 | 1 | 3 | Low | 5 | 100Hz | **0.010** |

### 3.2. Nhóm Dữ liệu Cắt 5 Pass (Custom Siêu Tinh)
| H | Pass | Ton | Toff | IP | Wire | Volt | VF | Max Speed (Hz) | Offset |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **12 (Cách 1)** | P1 | 30 | 7 | 3 | 1 | Low | 50 | 200Hz | **0.098** |
| | P2 | 10 | 5 | 2 | 2 | Low | 25 | 150Hz | **0.040** |
| | P3 | 5 | 10 | 2 | 2 | Low | 15 | 140Hz | **0.020** |
| | P4 | 5 | 10 | 1 | 3 | Low | 5 | 130Hz | **0.010** |
| | P5 | 2 | 20 | 1 | 3 | Low | 1 | 120Hz | **0.005** |
| **12 (Bóng Gương)** | P1 | 20 | 7 | 3 | 1 | Low | 50 | 150Hz | **0.091** |
| | P2 | 10 | 7 | 2 | 2 | Low | 25 | 150Hz | **0.020** |
| | P3 | 5 | 10 | 1 | 3 | Low | 5 | 200Hz | **0.006** |
| | P4 | 3 | 15 | 1 | 3 | Low | 5 | 250Hz | **0.002** |
| | P5 | 1 | 20 | 1 | 3 | Low | 5 | 300Hz | **0.002** |
| **32** | P1 | 40 | 7 | 4 | 1 | Low | 50 | 150Hz | **0.073** |
| | P2 | 20 | 7 | 3 | 2 | Low | 25 | 150Hz | **0.030** |
| | P3 | 10 | 10 | 2 | 2 | Low | 15 | 150Hz | **0.020** |
| | P4 | 5 | 15 | 2 | 3 | Low | 5 | 150Hz | **0.010** |
| | P5 | 3 | 17 | 1 | 3 | Low | 5 | 150Hz | **0.005** |
| **54** | P1 | 50 | 7 | 4 | 1 | Low | 50 | 150Hz | **0.077** |
| | P2 | 30 | 7 | 3 | 2 | Low | 25 | 150Hz | **0.030** |
| | P3 | 10 | 10 | 2 | 3 | Low | 15 | 150Hz | **0.020** |
| | P4 | 5 | 15 | 2 | 3 | Low | 5 | 200Hz | **0.010** |
| | P5 | 2 | 20 | 1 | 3 | Low | 5 | 250Hz | **0.005** |
| **62** | P1 | 70 | 7 | 4 | 1 | High | 50 | 150Hz | **0.088** |
| | P2 | 30 | 7 | 3 | 2 | Low | 30 | 150Hz | **0.030** |
| | P3 | 10 | 10 | 2 | 2 | Low | 15 | 140Hz | **0.015** |
| | P4 | 5 | 10 | 2 | 2 | Low | 5 | 100Hz | **0.010** |
| | P5 | 3 | 15 | 1 | 3 | Low | 1 | 100Hz | **0.005** |
| **140**| P1 | 120 | 8 | 5 | 1 | High | 55 | 60Hz | **0.085** |
| | P2 | 25 | 7 | 2 | 2 | Low | 25 | 100Hz | **0.030** |
| | P3 | 15 | 10 | 2 | 2 | Low | 15 | 100Hz | **0.010** |
| | P4 | 7 | 12 | 1 | 3 | Low | 5 | 100Hz | **0.010** |
| | P5 | 3 | 15 | 1 | 3 | Low | 1 | 100Hz | **0.005** |

## PHẦN 4: DỮ LIỆU ĐỐI CHIẾU DÒNG ĐIỆN (AMPE) THEO ĐIỆN ÁP (VOLT)
Người dùng đã cung cấp 2 bài test thực tế chứng minh dòng Ampe trên kim đồng hồ đo tỷ lệ thuận với điện áp khe hở (Volt):
- **Test 1 (H=30, Cấp 6, Ton=28, Toff=6, IP=4):** 
  - Volt = High -> Ampe = 4.1A
  - Volt = Low -> Ampe = 3.45A
- **Test 2 (H=30, Ton=30, Toff=7, IP=3):**
  - Volt = High -> Ampe = 3.0A
  - Volt = Low -> Ampe = 2.5A

=> **Quy luật rút ra:** Khi chuyển từ High xuống Low, dòng Ampe sụt giảm từ 16% - 17%. Dữ liệu này được dùng làm Anchor để tinh chỉnh phương trình vật lý tính Ampe của hệ thống.

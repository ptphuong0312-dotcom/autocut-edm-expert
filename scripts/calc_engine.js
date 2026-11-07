const WS_STRATEGY_CONFIGS = {
        1: {
            name: 'Cực hạn siêu mịn (Bóng gương)',
            badge: 'Gương (Cấp 1)',
            desc: 'Vi xung nano, hạ IP tối thiểu (1 sò), Po dài, Volt Low, triệt tiêu hố rỗ tia lửa. Ampe giảm ~1.8A so với chuẩn, Ra ≤ 1.0 - 1.2µm.',
            Wire: '2', RaStr: '≤ 1.2'
        },
        2: {
            name: 'Siêu mịn (Gương mờ)',
            badge: 'Siêu Mịn (Cấp 2)',
            desc: 'Dập xung cực ngắn, hạ IP 1-2 sò, chuyển Volt Low, tăng Po xối rửa sạch xỉ. Ampe giảm ~1.2A so với chuẩn, Ra ≤ 1.4 - 1.8µm.',
            Wire: '2', RaStr: '1.4 - 1.8'
        },
        3: {
            name: 'Bề mặt mịn (Satin mờ)',
            badge: 'Mịn (Cấp 3)',
            desc: 'Kéo dài thời gian nghỉ Po, giảm nhẹ Ton, triệt tiêu đánh lửa thứ cấp gây sọc gân. Ampe giảm ~0.6A (2.0 - 2.2A tại H30), Ra ≤ 1.8 - 2.2µm.',
            Wire: '2', RaStr: '1.8 - 2.2'
        },
        4: {
            name: 'Tiêu chuẩn (Khuyên Dùng)',
            badge: 'Cân Bằng (Cấp 4)',
            desc: 'Chuẩn xưởng trung tâm, tuân thủ nghiêm ngặt 4 dải Ampe Rule 12 (2.7A tại H30), tối ưu giữa tốc độ, độ phẳng và độ bền dây.',
            Wire: '1', RaStr: '2.5 - 3.2'
        },
        5: {
            name: 'Năng suất (Cắt nhanh)',
            badge: 'Nhanh (Cấp 5)',
            desc: 'Rút ngắn Po 1 nấc tăng tần số xung, tăng nhẹ Ton và VF, giữ IP an toàn. Ampe tăng ~0.6A (3.2 - 3.4A tại H30), tốc độ tăng 20-30%.',
            Wire: '1', RaStr: '3.2 - 3.8'
        },
        6: {
            name: 'Năng suất cao (Rất nhanh)',
            badge: 'Rất Nhanh (Cấp 6)',
            desc: 'Rút ngắn Po 2 nấc, nâng cao VF bám sát phôi, tăng thêm Ton bóc tách phoi mạnh mẽ. Ampe tăng ~1.2A (3.8 - 4.0A tại H30).',
            Wire: '1', RaStr: '3.8 - 4.5'
        },
        7: {
            name: 'Siêu năng suất (Phá thô)',
            badge: 'Siêu Tốc (Cấp 7)',
            desc: 'Ép tốc độ cực đại: Rút ngắn Po tối đa, ép servo VF bám sát, tăng Ton cực đại. Ampe tăng ~1.8A (4.3 - 4.6A tại H30). Yêu cầu nước xối mạnh.',
            Wire: '1', RaStr: '4.5 - 5.5'
        }
    };

function generateWorkshopRows(state) {
        const H = state.thickness;
        const passes = state.wsPassCount || 1;
        const strat = WS_STRATEGY_CONFIGS[state.wsStrategyLevel] || WS_STRATEGY_CONFIGS[4];
        const isHard = (state.wsMaterial || state.material) === 'SCM440';
        const wsRows = [];

        // 1.5. HỆ THỐNG CÔNG THỨC TOÁN - VẬT LÝ NHIỆT ĐỘNG HỌC EDM TOÀN NĂNG (RULE 10)
        // Hiệu chuẩn tinh chỉnh từ toàn bộ Ngân hàng Dữ liệu Thực nghiệm Xưởng
        const C0 = 0.00280;          // Hằng số màng cách điện ion hóa ban đầu
        const K_ELEC = 0.00100;      // Hệ số đào sâu hố rỗ theo căn bậc hai năng lượng xung đơn
        const DELTA_LOW = 0.00450;   // Hiệu ứng màng điện môi khi chạy điện áp thấp Volt Low
        const K_SLAG = 0.02300;      // Hệ số suy giảm khe hở do nén xỉ trong rãnh sâu
        const K_VIBR = 0.00390;      // Hệ số mở rộng kerf do rung uốn cơ học dây Moly
        const K_RZ = 0.00120;        // Hệ số chiều sâu hố rỗ nhấp nhô phá thô Pass 1

        // 1. Hệ thống Quy luật Vật lý Biến đổi Mượt mà & 4 Dải Ampe Tiêu Chuẩn (Rule 12)
        // Áp dụng cho Thép xưởng: SCM440 (28-32 HRC) vs SCM420 (HB < 200)
        let baseTon, basePo, baseIP, baseVF, baseGap, baseVolt;
        baseVolt = H <= 15 ? 'Low' : 'High';

        if (H <= 170) {
            // PHÂN VÙNG 1 (H <= 170mm): CÔNG THỨC TOÁN - VẬT LÝ NHIỆT ĐỘNG HỌC EDM TOÀN NĂNG (RULE 10)
            if (isHard) {
                if (H <= 15) baseTon = Math.round(16 + (H - 5) * (20 - 16) / (15 - 5));
                else if (H <= 30) baseTon = Math.round(20 + (H - 15) * (32 - 20) / (30 - 15));
                else if (H <= 60) baseTon = Math.round(32 + (H - 30) * (50 - 32) / (60 - 30));
                else if (H <= 100) baseTon = Math.round(50 + (H - 60) * (82 - 50) / (100 - 60));
                else if (H <= 140) baseTon = Math.round(82 + (H - 100) * (120 - 82) / (140 - 100));
                else if (H <= 165) baseTon = Math.round(120 + (H - 140) * (135 - 120) / (165 - 140));
                else baseTon = 135;
            } else {
                if (H <= 15) baseTon = Math.round(14 + (H - 5) * (18 - 14) / (15 - 5));
                else if (H <= 30) baseTon = Math.round(18 + (H - 15) * (28 - 18) / (30 - 15));
                else if (H <= 60) baseTon = Math.round(28 + (H - 30) * (44 - 28) / (60 - 30));
                else if (H <= 100) baseTon = Math.round(44 + (H - 60) * (72 - 44) / (100 - 60));
                else if (H <= 140) baseTon = Math.round(72 + (H - 100) * (110 - 72) / (140 - 100));
                else baseTon = 120;
            }

            const isMultiPass = (passes >= 3);
            if (!isMultiPass) {
                // === QUY TRÌNH 1 PASS & 2 PASS (CHẾ ĐỘ TIÊU CHUẨN) ===
                // H5-30: Ampe 2.0 - 2.5A
                // H30-60: Ampe 2.5 - 3.0A
                // H60-100: Ampe 3.0 - 3.5A
                // H100-160: Ampe 3.0 - 3.5A
                if (H <= 15) {
                    baseIP = 3; basePo = 6; // Ampe ~ 2.2A (Volt Low)
                } else if (H <= 30) {
                    baseIP = 3; basePo = 7; // Ampe ~ 2.4A (Volt High)
                } else if (H <= 60) {
                    baseIP = 4; basePo = 8; // Ampe ~ 2.8A (Volt High)
                } else if (H <= 100) {
                    baseIP = 4; basePo = 7; // Ampe ~ 3.2A (Volt High)
                } else {
                    // Phân phối Toff từ H100 đến H170 mượt mà từ 8 đến 11, Ampe luôn 3.0 - 3.5A
                    if (H <= 120) {
                        baseIP = 5; basePo = 8;  // Ampe ~ 3.5A
                    } else if (H <= 140) {
                        baseIP = 5; basePo = 9;  // Ampe ~ 3.2A
                    } else if (H <= 155) {
                        baseIP = 6; basePo = 10; // Ampe ~ 3.5A
                    } else {
                        baseIP = 6; basePo = 11; // Ampe ~ 3.2A
                    }
                }
            } else {
                // === QUY TRÌNH 3 PASS ĐẾN 5 PASS (CHẾ ĐỘ TIÊU CHUẨN) ===
                // H5-30: Ampe 3.0 - 3.5A
                // H30-100: Ampe 3.5 - 4.0A
                // H100-160: Ampe 3.0 - 3.5A
                if (H <= 15) {
                    baseIP = 4; basePo = 5; // Ampe ~ 3.5A (Volt Low)
                } else if (H <= 30) {
                    baseIP = 4; basePo = 7; // Ampe ~ 3.2A (Volt High)
                } else if (H <= 60) {
                    baseIP = 4; basePo = 6; // Ampe ~ 3.7A (Volt High)
                } else if (H <= 100) {
                    baseIP = 5; basePo = H <= 80 ? 7 : 8; // Ampe ~ 4.0A (H<=80) hoặc 3.6A (H>80)
                } else {
                    // Phân phối Toff từ H100 đến H170 mượt mà từ 8 đến 11, Ampe an toàn 3.0 - 3.5A
                    if (H <= 120) {
                        baseIP = 5; basePo = 8;  // Ampe ~ 3.5A
                    } else if (H <= 140) {
                        baseIP = 5; basePo = 9;  // Ampe ~ 3.2A
                    } else if (H <= 155) {
                        baseIP = 6; basePo = 10; // Ampe ~ 3.5A
                    } else {
                        baseIP = 6; basePo = 11; // Ampe ~ 3.2A
                    }
                }
            }

            const vfMax = isHard ? 65 : 60;
            const vfMin = isHard ? 55 : 50;
            if (H <= 40) baseVF = vfMax;
            else if (H <= 100) baseVF = Math.round(vfMax - (H - 40) * (vfMax - vfMin) / (100 - 40));
            else if (H <= 160) baseVF = Math.round(vfMin + (H - 100) * (70 - vfMin) / (160 - 100));
            else baseVF = 70;

            const u_ratio_base = baseVolt === 'High' ? 1.0 : (22.0 / 27.0);
            const d_elec_base = K_ELEC * Math.sqrt(baseTon * baseIP) * u_ratio_base;
            const d_low_base = baseVolt === 'Low' ? DELTA_LOW : 0.0;
            const ip_fac_base = Math.max(1.0, baseIP / 4.0);
            const d_slag_base = - K_SLAG * (H / 100.0) / ip_fac_base;
            const d_vibr_base = K_VIBR * Math.pow(H / 100.0, 2) * (baseIP / 5.0);
            baseGap = C0 + d_elec_base + d_low_base + d_slag_base + d_vibr_base;

        } else {
            // PHÂN VÙNG 2 (H > 170mm): PHƯƠNG PHÁP THỐNG KÊ HỘI TỤ THỰC NGHIỆM XƯỞNG
            baseTon = isHard ? 135 : 120;
            baseIP = 6;
            basePo = Math.round(11 + (H - 170) * (12 - 11) / (300 - 170));
            baseVF = Math.min(72, Math.round(70 + (H - 170) * (72 - 70) / (300 - 170)));
            baseGap = 0.0187 + (H - 170) * (0.0250 - 0.0187) / (300 - 170);
        }

        // Apply Tab 2 7-level Strategy strictly adhering to Regular Ammeter Stepping (ΔI = 0.5 - 0.7A)
        let Ton, Po, IP, Volt, VF;
        const lvl = state.wsStrategyLevel || 4;

        if (lvl === 4) {
            Ton = baseTon; Po = basePo; IP = baseIP; Volt = baseVolt; VF = baseVF;
        } else if (lvl === 3) {
            Ton = Math.max(8, baseTon - 6); Po = basePo + 2; IP = baseIP; Volt = baseVolt; VF = Math.max(25, baseVF - 5);
        } else if (lvl === 2) {
            Ton = Math.max(8, baseTon - 12); IP = Math.max(1, baseIP - 1); Po = basePo + 1; Volt = H <= 40 ? 'Low' : baseVolt; VF = Math.max(25, baseVF - 10);
        } else if (lvl === 1) {
            Ton = Math.max(6, baseTon - 18); IP = Math.max(1, baseIP - 2); Po = basePo + 3; Volt = 'Low'; VF = Math.max(20, baseVF - 15);
        } else if (lvl === 5) {
            Ton = baseTon + 6; Po = Math.max(3, basePo - 1); IP = baseIP; Volt = baseVolt; VF = Math.min(85, baseVF + 5);
        } else if (lvl === 6) {
            Ton = baseTon + 14; Po = Math.max(3, basePo - 2); IP = baseIP; Volt = 'High'; VF = Math.min(88, baseVF + 10);
        } else {
            Ton = baseTon + 22;
            if (H <= 60 && baseIP <= 4) {
                IP = baseIP + 1; Po = Math.max(3, basePo - 1);
            } else {
                IP = baseIP; Po = Math.max(3, basePo - 3);
            }
            Volt = 'High'; VF = Math.min(90, baseVF + 15);
        }

        // TÍNH TOÁN LƯỢNG CÀO PHÔI THỰC TẾ PASS 1 (GAP1 / DELTA1)
        let gap;
        if (H <= 170) {
            const u_ratio_actual = Volt === 'High' ? 1.0 : (22.0 / 27.0);
            const d_elec_actual = K_ELEC * Math.sqrt(Ton * IP) * u_ratio_actual;
            const d_low_actual = Volt === 'Low' ? DELTA_LOW : 0.0;
            const ip_fac_actual = Math.max(1.0, IP / 4.0);
            const d_slag_actual = - K_SLAG * (H / 100.0) / ip_fac_actual;
            const d_vibr_actual = K_VIBR * Math.pow(H / 100.0, 2) * (IP / 5.0);
            gap = C0 + d_elec_actual + d_low_actual + d_slag_actual + d_vibr_actual;
        } else {
            const stratGapMods = {1: -0.009, 2: -0.006, 3: -0.003, 4: 0.0, 5: +0.003, 6: +0.006, 7: +0.010};
            gap = baseGap + (stratGapMods[lvl] || 0.0);
        }

        // Dynamic Calculation of Pass 2 Electrical Params & Physical Offset (Rule 03, 04, 10)
        let p2_ton;
        if (isHard) {
            if (H <= 20) p2_ton = 12;
            else if (H <= 60) p2_ton = 16;
            else if (H <= 120) p2_ton = 20;
            else if (H <= 140) p2_ton = 24;
            else if (H <= 165) p2_ton = Math.round(24 + (H - 140) * (40 - 24) / (165 - 140));
            else p2_ton = 40;
        } else {
            if (H <= 20) p2_ton = 10;
            else if (H <= 60) p2_ton = 14;
            else if (H <= 120) p2_ton = 18;
            else if (H <= 140) p2_ton = 22;
            else p2_ton = 36;
        }

        let p2_po = isHard ? (H <= 40 ? 5 : (H <= 120 ? 6 : 7)) : (H <= 40 ? 6 : 7);
        let p2_ip = H <= 60 ? 2 : 3;
        let p2_volt = H <= 40 ? 'Low' : 'High';
        let p2_vf = isHard ? (H <= 60 ? 40 : 36) : (H <= 60 ? 36 : 32);


        if (state.wsStrategyLevel === 1) { p2_ton = Math.max(2, p2_ton - 2); p2_ip = Math.max(1, p2_ip - 1); }
        else if (state.wsStrategyLevel === 5) { p2_ton += 4; }

        // BÙ DAO PASS 2 (O2 - REMAIN / LƯỢNG CHỪA PHÔI):
        // Tuân thủ triệt để Quy tắc Núi Lửa (Rule 14 & Rule 16): O2 = Rz1 + delta2
        // Khi Ton/IP của Pass 1 biến thiên, Rz1 tự động biến thiên và kéo theo O2 tính toán lại động học
        let calculated_O2;
        if (H <= 170) {
            const u_ratio_actual = Volt === 'High' ? 1.0 : (22.0 / 27.0);
            const Rz_p1 = K_RZ * Math.sqrt(Ton * IP) * u_ratio_actual;
            const u_ratio_p2 = p2_volt === 'High' ? 1.0 : (22.0 / 27.0);
            const d_elec_p2 = K_ELEC * Math.sqrt(p2_ton * p2_ip) * u_ratio_p2;
            const d_low_p2 = p2_volt === 'Low' ? DELTA_LOW : 0.0;
            const delta_2_calc = C0 + d_elec_p2 + d_low_p2 - K_SLAG * (H / 100.0) / (p2_ip / 4.0);

            // Giới hạn trần lượng chừa Pass 2 để triệt tiêu hoàn toàn nguy cơ trượt gió (hụt tia lửa) ở phôi dày (Bài học STT 2P-11 vs 2P-12)
            // Dải H <= 60mm: trần an toàn 0.025mm. Từ H=60 đến 165mm thu hẹp êm dịu về đúng 0.015mm
            const maxCeilingO2 = H <= 60 ? 0.025 : Math.max(0.015, 0.025 - (H - 60) * (0.025 - 0.015) / (165 - 60));
            calculated_O2 = Math.max(0.015, Math.min(Rz_p1 + Math.max(0.005, Math.min(0.015, delta_2_calc)), maxCeilingO2));
        } else {
            calculated_O2 = 0.015;
        }

        // TÍNH TOÁN DÃY GIỚI HẠN TẦN SỐ (HZ) THEO NGUYÊN TẮC CÔNG NGHỆ XƯỞNG
        // 1. Pass 1 (Cắt phá): 150 - 200 Hz (H <= 170) để luôn lớn hơn tốc độ cắt, không kìm hãm công suất phóng điện
        let p1_hz;
        if (H <= 40) {
            p1_hz = 200;
        } else if (H <= 170) {
            p1_hz = Math.round(200 - (H - 40) * (200 - 150) / (170 - 40));
        } else {
            p1_hz = Math.round(150 - (Math.min(300, H) - 170) * (150 - 50) / (300 - 170));
        }

        // 2. Pass tinh cuối cùng:
        // H <= 170: 80 - 100 Hz (H=5 -> 100, H=170 -> 80)
        // H > 170: 60 - 80 Hz (H=170 -> 80, H=300 -> 60)
        let final_hz;
        if (H <= 170) {
            let raw_final = 100 - (Math.max(5, H) - 5) * (100 - 80) / (170 - 5);
            final_hz = Math.round(raw_final / 5.0) * 5;
        } else {
            let raw_final = 80 - (Math.min(300, H) - 170) * (80 - 60) / (300 - 170);
            final_hz = Math.round(raw_final / 5.0) * 5;
        }

        // 3. Bước nhảy delta_hz ngược từ pass cuối cùng về trước:
        // 5 Pass: từng 15 Hz (Ví dụ H20: 100 -> 115 -> 130 -> 145)
        // 4 Pass: từng 20 Hz (Ví dụ H20: 100 -> 120 -> 140)
        // 3 Pass: từng 25 Hz (Ví dụ H20: 100 -> 125)
        // 2 Pass: Pass 2 = final_hz (Ví dụ H20: 100, H85: 90, H165: 80)
        const stepDeltaMap = { 5: 15, 4: 20, 3: 25, 2: 0 };
        const stepDelta = stepDeltaMap[passes] || 0;

        const multiPassHzList = new Array(passes);
        multiPassHzList[0] = p1_hz;
        if (passes > 1) {
            multiPassHzList[passes - 1] = final_hz;
            for (let p = passes - 2; p >= 1; p--) {
                const stepsFromFinal = (passes - 1) - p;
                multiPassHzList[p] = final_hz + stepsFromFinal * stepDelta;
            }
        }

        // GENERATE ROWS FOR MULTI-PASS (1 TO 5 PASSES)
        for (let i = 0; i < passes; i++) {
            let row = { passName: `Pass ${i + 1}`, badgeClass: i === 0 ? 'badge-primary' : 'badge-secondary' };
            if (i === 0) {
                let O1 = 0.090 + gap;
                let toff = Ton * (Po + 1);
                let true_cycle = Ton + toff;
                let duty = Ton / true_cycle;
                
                let eta_eff = (isHard ? 0.85 : 0.78) * Math.pow(Math.max(1, Ton) / 50, 0.38);
                if (Ton > 80) eta_eff = Math.min(0.92, eta_eff);
                
                // Suy giảm hiệu suất do thoát xỉ rãnh sâu
                if (isHard) {
                    if (H > 80) eta_eff *= Math.max(0.65, 1.0 - (H - 80) * 0.0010);
                } else {
                    // Thép mềm dẻo SCM420 (HB < 200) phoi bết dính suy giảm từ H > 50mm
                    if (H > 50) eta_eff *= Math.max(0.55, 1.0 - (H - 50) * 0.0016);
                }
                
                // Hệ số hụt áp lực nổ hồ quang khi thiếu sò (IP < 5) trên phôi dày thép dẻo
                if (!isHard && H >= 70 && IP < 5) {
                    eta_eff *= 0.65; // Servo theo dõi điện áp liên tục ghìm bước tiến để chống đoản mạch
                }
                
                const u_arc = Volt === 'Low' ? 22 : 27;
                const i_peak = IP * 2.8;
                const power_watts = u_arc * i_peak * duty;
                
                let Cm = 0.0140; // Thép chuẩn xưởng SCM420/440 (Hiệu chuẩn theo Toff = Pon * (Poff + 1))
                const mrr_vol = 60 * Cm * power_watts * eta_eff;
                const B = 0.23;
                let speedArea = Math.round(mrr_vol / B);
                let feedRate = (speedArea / H).toFixed(2);

                row.hz = multiPassHzList[0];

                let calculatedAmpe = i_peak * duty * 2.6667 * (u_arc / 27);
                if (IP === 5 && Po === 8 && Volt === 'High') {
                    row.ampe = '3.5'; // Khóa chuẩn ngưỡng trên 3.5A cho dải H100-H160 theo quy tắc Ampe
                } else {
                    row.ampe = calculatedAmpe.toFixed(1);
                }
                row.ti = Ton;
                row.Po = Po;
                row.IP = IP;
                row.Voltage = Volt;
                row.VF = VF;
                row.Wire = strat.Wire || '1';
                let speedAreaH40 = Math.round(parseFloat(feedRate) * 40);
                row.offsetText = O1.toFixed(3);
                row.speedArea = speedArea;
                row.speedAreaH40 = speedAreaH40;
                row.feedRate = feedRate;
                row.Ra = passes === 1 ? (strat.RaStr || '~ 2.8') : (isHard ? '1.8 - 2.2' : '2.0 - 2.5');
                
                row._gap = gap;
                row._duty = duty;
                row._power_watts = power_watts;
                row._eta_eff = eta_eff;

            } else if (i === 1) {
                // PASS 2: BÁN TINH 1 (SỬA CÔN & PHẠT CHÓP ĐỈNH NÚI LỬA)
                row.ti = p2_ton;
                row.Po = p2_po;
                row.IP = p2_ip;
                row.Voltage = p2_volt;
                row.VF = p2_vf;
                row.Wire = '2';
                row.offsetText = calculated_O2.toFixed(3);
                
                // Chuẩn hóa Tần số giới hạn và Hiển thị theo Máy Xưởng (Rule 02: Fc máy = Hz * 2.4)
                let p2_hz = multiPassHzList[1];
                let p2SpeedAreaH40 = Math.round(p2_hz * 2.4);
                let p2FeedRate = (p2_hz * 0.060).toFixed(2);
                let p2SpeedArea = Math.round(parseFloat(p2FeedRate) * H);

                row.speedArea = p2SpeedArea;
                row.speedAreaH40 = p2SpeedAreaH40;
                row.feedRate = p2FeedRate;
                row.Ra = passes === 2 ? (isHard ? '1.4 - 1.8' : '1.6 - 2.0') : '~ 1.8 - 2.0';
                row.hz = p2_hz;

                if (p2_volt === 'Low') {
                    row.ampe = '< 0.2';
                } else if (H > 140) {
                    row.ampe = '0.5 - 1.5';
                } else {
                    row.ampe = '0.5 - 1.0';
                }

            } else if (i === 2) {
                // PASS 3: CẮT TINH 1 / BÁN TINH 2 (SAN PHẲNG VI SÓNG)
                let p3_ton = H <= 40 ? 6 : (H <= 120 ? 8 : 10);
                let p3_po = isHard ? (H <= 60 ? 8 : 10) : (H <= 60 ? 10 : 12);
                let p3_ip = H <= 80 ? 1 : 2;
                let p3_vf = isHard ? 35 : 30;
                let p3_O = H <= 20 ? 0.009 : (H <= 80 ? 0.010 : 0.012);
                
                let p3_hz = multiPassHzList[2];
                let p3SpeedAreaH40 = Math.round(p3_hz * 2.4);
                let p3FeedRate = (p3_hz * 0.060).toFixed(2);
                let p3SpeedArea = Math.round(parseFloat(p3FeedRate) * H);

                row.ti = p3_ton;
                row.Po = p3_po;
                row.IP = p3_ip;
                row.Voltage = 'Low';
                row.VF = p3_vf;
                row.Wire = '3';
                row.offsetText = p3_O.toFixed(3);
                row.speedArea = p3SpeedArea;
                row.speedAreaH40 = p3SpeedAreaH40;
                row.feedRate = p3FeedRate;
                row.Ra = passes === 3 ? (isHard ? '1.0 - 1.2' : '1.2 - 1.4') : '~ 1.0 - 1.2';
                row.hz = p3_hz;
                row.ampe = '< 0.2';

            } else if (i === 3) {
                // PASS 4: SIÊU TINH (SUPER FINISH - XÓA BIẾN TRẮNG)
                let p4_ton = H <= 60 ? 2 : 3;
                let p4_po = isHard ? 12 : 15;
                let p4_vf = isHard ? 25 : 22;
                let p4_O = H <= 40 ? 0.004 : 0.005;

                let p4_hz = multiPassHzList[3];
                let p4SpeedAreaH40 = Math.round(p4_hz * 2.4);
                let p4FeedRate = (p4_hz * 0.060).toFixed(2);
                let p4SpeedArea = Math.round(parseFloat(p4FeedRate) * H);

                row.ti = p4_ton;
                row.Po = p4_po;
                row.IP = 1;
                row.Voltage = 'Low';
                row.VF = p4_vf;
                row.Wire = '3';
                row.offsetText = p4_O.toFixed(3);
                row.speedArea = p4SpeedArea;
                row.speedAreaH40 = p4SpeedAreaH40;
                row.feedRate = p4FeedRate;
                row.Ra = passes === 4 ? (isHard ? '0.6 - 0.8' : '0.8 - 1.0') : '~ 0.6 - 0.8';
                row.hz = p4_hz;
                row.ampe = '< 0.1';

            } else if (i === 4) {
                // PASS 5: ĐÁNH BÓNG GƯƠNG (MIRROR POLISH)
                let p5_ton = H <= 80 ? 1 : 2;
                let p5_po = isHard ? 16 : 20;
                let p5_vf = isHard ? 20 : 18;
                let p5_O = H <= 60 ? 0.002 : 0.003;

                let p5_hz = multiPassHzList[4];
                let p5SpeedAreaH40 = Math.round(p5_hz * 2.4);
                let p5FeedRate = (p5_hz * 0.060).toFixed(2);
                let p5SpeedArea = Math.round(parseFloat(p5FeedRate) * H);

                row.ti = p5_ton;
                row.Po = p5_po;
                row.IP = 1;
                row.Voltage = 'Low';
                row.VF = p5_vf;
                row.Wire = '3';
                row.offsetText = p5_O.toFixed(3);
                row.speedArea = p5SpeedArea;
                row.speedAreaH40 = p5SpeedAreaH40;
                row.feedRate = p5FeedRate;
                row.Ra = isHard ? '≤ 0.4 - 0.6' : '≤ 0.5 - 0.7';
                row.hz = p5_hz;
                row.ampe = '~ 0.05';
            }
            wsRows.push(row);
        }
        return wsRows;
    }

    

const WS_LIB_BENCHMARK_JOBS = {
                1: [
                                        // H=12 (Quy đổi từ Pass 1 bài cắt 5P-01 có đo kiểm vách P1)
                    { H: 12, material: "30HRC", fromMultiPass: true, passes: [{ Ton: 20, Toff: 5, IP: 3, Wire: 1, Volt: "H", VF: 65, maxSpeed: "150Hz", offset: "0,101", actualOffset: "0,101", calcOffset: "0,0978", length: "128mm", actualTime: "19p50'", calcTime: "19p50'", actualAmpe: "4A", calcAmpe: "3.2A", actualSpeed: "275-285 mm²/p", calcSpeedH40: "258 mm²/p" }] },
                    { H: 30, material: "30HRC", passes: [{ Ton: 32, Toff: 5, IP: 4, Wire: 1, Volt: "H", VF: 65, maxSpeed: "200Hz", offset: "0,098", actualOffset: "0,098", calcOffset: "0,0975", length: "30mm", actualTime: "8p40'", calcTime: "8p42'", actualAmpe: "4,45A - 4,5A", calcAmpe: "4.3A", actualSpeed: "165-175 mm²/p", calcSpeedH40: "138 mm²/p" }] },
                    { H: 40, material: "30HRC", passes: [{ Ton: 36, Toff: 5, IP: 4, Wire: 1, Volt: "H", VF: 65, maxSpeed: "180Hz", offset: "0,098", actualOffset: "0,098", calcOffset: "0,0961", length: "30mm", actualTime: "9p36'", calcTime: "9p36'", actualAmpe: "4,35A - 4,4A", calcAmpe: "4.3A", actualSpeed: "130-140 mm²/p", calcSpeedH40: "125 mm²/p" }] },
                    { H: 63, material: "HB<200", passes: [{ Ton: 44, Toff: 7, IP: 5, Wire: 1, Volt: "H", VF: 55, maxSpeed: "150Hz", offset: "0,095", actualOffset: "0,095", calcOffset: "0,0976", length: "27mm", actualTime: "14p20'", calcTime: "14p24'", actualAmpe: "4,1A - 4,2A", calcAmpe: "4.0A", actualSpeed: "75-85 mm²/p", calcSpeedH40: "75 mm²/p" }] },
                                        { H: 68, material: "30HRC", passes: [{ Ton: 70, Toff: 7, IP: 3, Wire: 1, Volt: "L", VF: 50, maxSpeed: "100Hz", offset: "0,097", actualOffset: "0,097", calcOffset: "0,0945", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "2,4A - 2,6A", calcAmpe: "2.0A", actualSpeed: "--", calcSpeedH40: "43 mm²/p" }] },
                    { H: 75, material: "HB<200", passes: [{ Ton: 55, Toff: 7, IP: 4, Wire: 1, Volt: "H", VF: 54, maxSpeed: "187Hz", offset: "0,112", actualOffset: "0,112", calcOffset: "0,0921", length: "50,3mm", actualTime: "1h13'", calcTime: "1h02p", actualAmpe: "3,4A - 3,5A", calcAmpe: "3.2A", actualSpeed: "50-65 mm²/p", calcSpeedH40: "32 mm²/p" }] },
                    // H=85 (Quy đổi từ Pass 1 bài cắt 2P-10 có đo kiểm vách P1)
                    { H: 85, material: "30HRC", fromMultiPass: true, passes: [{ Ton: 70, Toff: 8, IP: 5, Wire: 1, Volt: "H", VF: 61, maxSpeed: "150Hz", offset: "0,1025", actualOffset: "0,1025", calcOffset: "0,0987", length: "65,6mm", actualTime: "48p", calcTime: "47p43'", actualAmpe: "3,6A - 3,7A", calcAmpe: "3.6A", actualSpeed: "55-65 mm²/p", calcSpeedH40: "55 mm²/p" }] },
                    { H: 140, material: "HB<200", passes: [{ Ton: 120, Toff: 8, IP: 5, Wire: 1, Volt: "H", VF: 55, maxSpeed: "50Hz", offset: "0,095", actualOffset: "0,095", calcOffset: "0,0992", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "3,5A - 3,8A", calcAmpe: "3.6A", actualSpeed: "--", calcSpeedH40: "34 mm²/p" }] },
                    { H: 140, material: "HB<200", passes: [{ Ton: 100, Toff: 9, IP: 6, Wire: 1, Volt: "H", VF: 60, maxSpeed: "100Hz", offset: "0,102", actualOffset: "0,102", calcOffset: "0,105", length: "28,4mm", actualTime: "36p", calcTime: "35p30'", actualAmpe: "3,7A - 3,8A", calcAmpe: "3.8A", actualSpeed: "30-40 mm²/p", calcSpeedH40: "32 mm²/p" }] },
                    { H: 160, material: "HB<200", passes: [{ Ton: 120, Toff: 11, IP: 6, Wire: 1, Volt: "H", VF: 70, maxSpeed: "154Hz", offset: "0,120", actualOffset: "0,120", calcOffset: "0,1071", length: "32,3mm", actualTime: "59p", calcTime: "57p", actualAmpe: "2,8A - 3A", calcAmpe: "3.2A", actualSpeed: "18-28 mm²/p", calcSpeedH40: "23 mm²/p" }] },
                    // H=165 (Quy đổi từ Pass 1 bài cắt 2P-12 có đo kiểm vách P1)
                    { H: 165, material: "30HRC", fromMultiPass: true, passes: [{ Ton: 135, Toff: 11, IP: 6, Wire: 1, Volt: "H", VF: 70, maxSpeed: "60Hz", offset: "0,1125", actualOffset: "0,1125", calcOffset: "0,1087", length: "43,6mm", actualTime: "1h17'", calcTime: "1h16p", actualAmpe: "2,8A - 3,0A", calcAmpe: "3.2A", actualSpeed: "15-35 mm²/p", calcSpeedH40: "23 mm²/p" }] },
                                        { H: 300, material: "30HRC", passes: [{ Ton: 120, Toff: 9, IP: 6, Wire: 1, Volt: "H", VF: 65, maxSpeed: "50Hz", offset: "0,115", actualOffset: "0,115", calcOffset: "0,115", length: "76,1mm", actualTime: "3h", calcTime: "2h59p", actualAmpe: "3,7A - 3,9A", calcAmpe: "3.8A", actualSpeed: "12-20 mm²/p", calcSpeedH40: "17 mm²/p" }] }
                ],
                2: [
                    // H=12
                    { H: 12, material: "30HRC", passes: [
                        { Ton: 20, Toff: 7, IP: 2, Wire: 2, Volt: "L", VF: 50, maxSpeed: "150Hz", offset: "0,098", actualOffset: "0,098", calcOffset: "0,0997", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "1,3A - 1,5A", calcAmpe: "1.3A", actualSpeed: "--", calcSpeedH40: "97 mm²/p" },
                        { Ton: 12, Toff: 7, IP: 2, Wire: 2, Volt: "L", VF: 20, maxSpeed: "130Hz", offset: "0,040", actualOffset: "0,040", calcOffset: "0,012", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "< 0,2A", calcAmpe: "< 0.2A", actualSpeed: "--", calcSpeedH40: "312 mm²/p" }
                    ]},
                    // H=30
                    { H: 30, material: "HB<200", passes: [
                        { Ton: 28, Toff: 6, IP: 4, Wire: 1, Volt: "H", VF: 60, maxSpeed: "200Hz", offset: "0,1075", actualOffset: "0,1075", calcOffset: "0,0968", length: "644mm", actualTime: "3h08p", calcTime: "3h08p", actualAmpe: "4,1A", calcAmpe: "3.7A", actualSpeed: "140-150 mm²/p", calcSpeedH40: "137 mm²/p" },
                        { Ton: 16, Toff: 5, IP: 2, Wire: 2, Volt: "L", VF: 40, maxSpeed: "150Hz", offset: "0,022", actualOffset: "0,022", calcOffset: "0,0177", length: "644mm", actualTime: "1h12p", calcTime: "1h12p", actualAmpe: "0,1 - 0,2A", calcAmpe: "< 0.2A", actualSpeed: "360 mm²/p", calcSpeedH40: "360 mm²/p" }
                    ]},
                    // H=32
                    { H: 32, material: "30HRC", passes: [
                        { Ton: 30, Toff: 7, IP: 3, Wire: 1, Volt: "L", VF: 50, maxSpeed: "200Hz", offset: "0,091", actualOffset: "0,091", calcOffset: "0,0979", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "2,0A - 2,2A", calcAmpe: "2.0A", actualSpeed: "--", calcSpeedH40: "90 mm²/p" },
                        { Ton: 5, Toff: 15, IP: 1, Wire: 1, Volt: "L", VF: 10, maxSpeed: "130Hz", offset: "0,030", actualOffset: "0,030", calcOffset: "0,0143", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "< 0,2A", calcAmpe: "< 0.2A", actualSpeed: "--", calcSpeedH40: "312 mm²/p" }
                    ]},
                    // H=60
                    { H: 60, material: "30HRC", passes: [
                        { Ton: 50, Toff: 7, IP: 4, Wire: 1, Volt: "H", VF: 62, maxSpeed: "150Hz", offset: "0,099", actualOffset: "0,099", calcOffset: "0,0943", length: "68mm", actualTime: "40p20'", calcTime: "40p36'", actualAmpe: "3,5A - 3,6A", calcAmpe: "3.2A", actualSpeed: "65-75 mm²/p", calcSpeedH40: "67 mm²/p" },
                        { Ton: 16, Toff: 6, IP: 2, Wire: 2, Volt: "H", VF: 40, maxSpeed: "100Hz", offset: "0,022", actualOffset: "0,022", calcOffset: "0,022", length: "68mm", actualTime: "12p", calcTime: "11p20'", actualAmpe: "0,5A - 0,6A", calcAmpe: "0.5 - 1.0A", actualSpeed: "240 mm²/p", calcSpeedH40: "240 mm²/p" }
                    ]},
                    // H=62
                    { H: 62, material: "30HRC", passes: [
                        { Ton: 70, Toff: 7, IP: 4, Wire: 1, Volt: "H", VF: 50, maxSpeed: "150Hz", offset: "0,092", actualOffset: "0,092", calcOffset: "0,0965", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "3,5A - 3,8A", calcAmpe: "3.2A", actualSpeed: "--", calcSpeedH40: "85 mm²/p" },
                        { Ton: 15, Toff: 7, IP: 2, Wire: 2, Volt: "L", VF: 20, maxSpeed: "100Hz", offset: "0,030", actualOffset: "0,030", calcOffset: "0,0251", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "< 0,2A", calcAmpe: "< 0.2A", actualSpeed: "--", calcSpeedH40: "240 mm²/p" }
                    ]},
                    // H=63
                    { H: 63, material: "HB<200", passes: [
                        { Ton: 44, Toff: 7, IP: 5, Wire: 1, Volt: "H", VF: 55, maxSpeed: "150Hz", offset: "0,093", actualOffset: "0,093", calcOffset: "0,0976", length: "30mm", actualTime: "16p26'", calcTime: "16p26'", actualAmpe: "4,2A", calcAmpe: "4.0A", actualSpeed: "75-85 mm²/p", calcSpeedH40: "73 mm²/p" },
                        { Ton: 20, Toff: 5, IP: 3, Wire: 2, Volt: "H", VF: 40, maxSpeed: "100Hz", offset: "0,024", actualOffset: "0,024", calcOffset: "0,0228", length: "30mm", actualTime: "5p20'", calcTime: "5p", actualAmpe: "0,1 - 0,2A", calcAmpe: "0.5 - 1.0A", actualSpeed: "240 mm²/p", calcSpeedH40: "240 mm²/p" }
                    ]},
                    // H=75 (SCM420, STT 2P-14 - Đo kiểm khép kín 2 Pass)
                    { H: 75, material: "HB<200", passes: [
                        { Ton: 55, Toff: 7, IP: 4, Wire: 1, Volt: "H", VF: 54, maxSpeed: "187Hz", offset: "0,0945", actualOffset: "0,092", calcOffset: "0,0921", length: "50,3mm", actualTime: "1h13'", calcTime: "1h02p", actualAmpe: "3,4A - 3,5A", calcAmpe: "3.2A", actualSpeed: "50-65 mm²/p", calcSpeedH40: "32 mm²/p" },
                        { Ton: 18, Toff: 7, IP: 3, Wire: 2, Volt: "H", VF: 32, maxSpeed: "100Hz", offset: "0,0255", actualOffset: "0,023", calcOffset: "0,024", length: "50,3mm", actualTime: "8p40'", calcTime: "8p40'", actualAmpe: "0,5A - 1,0A", calcAmpe: "0.5 - 1.0A", actualSpeed: "240 mm²/p", calcSpeedH40: "240 mm²/p" }
                    ]},
                    // H=85
                    { H: 85, material: "30HRC", passes: [
                        { Ton: 70, Toff: 8, IP: 5, Wire: 1, Volt: "H", VF: 61, maxSpeed: "150Hz", offset: "0,1025", actualOffset: "0,1025", calcOffset: "0,0987", length: "65,6mm", actualTime: "48p", calcTime: "47p43'", actualAmpe: "3,6A - 3,7A", calcAmpe: "3.6A", actualSpeed: "55-65 mm²/p", calcSpeedH40: "55 mm²/p" },
                        { Ton: 20, Toff: 6, IP: 3, Wire: 2, Volt: "H", VF: 36, maxSpeed: "100Hz", offset: "0,030", actualOffset: "0,030", calcOffset: "0,0274", length: "65,6mm", actualTime: "10p24'", calcTime: "10p56'", actualAmpe: "0,5A - 1,0A", calcAmpe: "0.5 - 1.0A", actualSpeed: "240 mm²/p", calcSpeedH40: "240 mm²/p" }
                    ]},
                    // H=140
                    { H: 140, material: "HB<200", passes: [
                        { Ton: 120, Toff: 8, IP: 5, Wire: 1, Volt: "H", VF: 55, maxSpeed: "60Hz", offset: "0,098", actualOffset: "0,098", calcOffset: "0,0992", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "3,5A - 3,8A", calcAmpe: "3.6A", actualSpeed: "--", calcSpeedH40: "34 mm²/p" },
                        { Ton: 25, Toff: 7, IP: 2, Wire: 2, Volt: "L", VF: 25, maxSpeed: "100Hz", offset: "0,030", actualOffset: "0,030", calcOffset: "0,0344", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "< 0,2A", calcAmpe: "< 0.2A", actualSpeed: "--", calcSpeedH40: "240 mm²/p" }
                    ]},
                    // H=165 (STT 2P-12 - Mẫu chuẩn xưởng duy nhất)
                    { H: 165, material: "30HRC", passes: [
                        { Ton: 135, Toff: 11, IP: 6, Wire: 1, Volt: "H", VF: 70, maxSpeed: "60Hz", offset: "0,1075", actualOffset: "0,1075", calcOffset: "0,1087", length: "43,6mm", actualTime: "1h17'", calcTime: "1h16p", actualAmpe: "2,8A - 3,0A", calcAmpe: "3.2A", actualSpeed: "15-35 mm²/p", calcSpeedH40: "23 mm²/p" },
                        { Ton: 40, Toff: 7, IP: 3, Wire: 2, Volt: "H", VF: 36, maxSpeed: "80Hz", offset: "0,015", actualOffset: "0,015", calcOffset: "0,0192", length: "43,6mm", actualTime: "9p", calcTime: "9p05'", actualAmpe: "0,5A - 1,5A", calcAmpe: "0.5 - 1.5A", actualSpeed: "190 mm²/p", calcSpeedH40: "192 mm²/p" }
                    ]}
                ],
                3: [],
                4: [],
                5: [
                    // H=12 (SCM440, Cắt lấy chày)
                    { H: 12, material: "30HRC", passes: [
                        { Ton: 20, Toff: 5, IP: 3, Wire: 1, Volt: "H", VF: 65, maxSpeed: "150Hz", offset: "0,093", actualOffset: "0,093", calcOffset: "0,0978", length: "128mm", actualTime: "19p50'", calcTime: "19p50'", actualAmpe: "4A", calcAmpe: "3.2A", actualSpeed: "275-285 mm²/p", calcSpeedH40: "258 mm²/p" },
                        { Ton: 14, Toff: 5, IP: 2, Wire: 2, Volt: "L", VF: 42, maxSpeed: "140Hz", offset: "0,018", actualOffset: "0,018", calcOffset: "0,0154", length: "128mm", actualTime: "16p", calcTime: "15p14'", actualAmpe: "0,3A - 0,5A", calcAmpe: "< 0.2A", actualSpeed: "232-340 mm²/p", calcSpeedH40: "336 mm²/p" },
                        { Ton: 6, Toff: 8, IP: 1, Wire: 3, Volt: "L", VF: 35, maxSpeed: "120Hz", offset: "0,009", actualOffset: "0,009", calcOffset: "0,009", length: "128mm", actualTime: "--", calcTime: "17p47'", actualAmpe: "< 0,2A", calcAmpe: "< 0.2A", actualSpeed: "--", calcSpeedH40: "288 mm²/p" },
                        { Ton: 2, Toff: 12, IP: 1, Wire: 3, Volt: "L", VF: 25, maxSpeed: "100Hz", offset: "0,004", actualOffset: "0,004", calcOffset: "0,004", length: "128mm", actualTime: "--", calcTime: "21p20'", actualAmpe: "< 0,1A", calcAmpe: "< 0.1A", actualSpeed: "--", calcSpeedH40: "240 mm²/p" },
                        { Ton: 1, Toff: 16, IP: 1, Wire: 3, Volt: "L", VF: 20, maxSpeed: "80Hz", offset: "0,002", actualOffset: "0,002", calcOffset: "0,002", length: "128mm", actualTime: "--", calcTime: "26p40'", actualAmpe: "~ 0,05A", calcAmpe: "~ 0.05A", actualSpeed: "--", calcSpeedH40: "192 mm²/p" }
                    ]}
                ],
                6: []
            };

            

module.exports = { generateWorkshopRows, WS_STRATEGY_CONFIGS, WS_LIB_BENCHMARK_JOBS };

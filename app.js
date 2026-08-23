/**
 * AUTOCUT EDM SERVO - PARAMETER CALCULATION & ANALYSIS ENGINE
 * Hệ thống tính toán, phân tích và tra cứu chế độ cắt EDM AutoCut Servo
 * © 2026 AutoCut EDM Master
 */

document.addEventListener('DOMContentLoaded', () => {
    // STATE (Mặc định SCM420)
    const state = {
        material: 'SCM420',
        passCount: 1,
        qualityMode: 'standard',
        thickness: 40,
        cutLength: 100
    };

    // DOM ELEMENTS
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    const materialCards = document.querySelectorAll('.radio-card');
    const passButtons = document.querySelectorAll('.pass-btn');
    const subModeItems = document.querySelectorAll('.sub-mode-item');
    const thicknessInput = document.getElementById('thickness-input');
    const thicknessSlider = document.getElementById('thickness-slider');
    const quickChips = document.querySelectorAll('.chip');
    const cutLengthInput = document.getElementById('cut-length');
    const totalTimeText = document.getElementById('total-time-text');
    const configSummary = document.getElementById('config-summary');
    const tableBody = document.getElementById('table-body');
    const noticeList = document.getElementById('notice-list');
    const btnCopyTable = document.getElementById('btn-copy-table');
    const btnPrint = document.getElementById('btn-print');
    const btnShowGuide = document.getElementById('btn-show-guide');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const guideModal = document.getElementById('guide-modal');

    // Custom analysis elements
    const btnAnalyzeCustom = document.getElementById('btn-analyze-custom');
    const customTiInput = document.getElementById('custom-ti');
    const customPoInput = document.getElementById('custom-po');
    const customIpInput = document.getElementById('custom-ip');
    const customVoltInput = document.getElementById('custom-volt');
    const customVfInput = document.getElementById('custom-vf');
    const customWireInput = document.getElementById('custom-wire');
    const analysisContainer = document.getElementById('analysis-container');
    const comparisonTableElement = document.getElementById('comparison-table-element');
    const analysisFeedbackBox = document.getElementById('analysis-feedback-box');

    // ==========================================
    // 1. TAB SWITCHING
    // ==========================================
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById(target).classList.add('active');
        });
    });

    // ==========================================
    // 2. FORM EVENT LISTENERS
    // ==========================================

    // Material Selection
    materialCards.forEach(card => {
        card.addEventListener('click', () => {
            materialCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input[type="radio"]');
            radio.checked = true;
            state.material = radio.value;
            render();
        });
    });

    // Pass Selection (1 đến 6 lần)
    passButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            passButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.passCount = parseInt(btn.dataset.pass, 10);
            render();
        });
    });

    // Quality Strategy Selection (Áp dụng cho mọi pass)
    subModeItems.forEach(item => {
        item.addEventListener('click', () => {
            subModeItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const radio = item.querySelector('input[type="radio"]');
            radio.checked = true;
            state.qualityMode = radio.value;
            render();
        });
    });

    // Thickness Slider & Input Sync
    thicknessSlider.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        val = Math.round(val / 5) * 5; // Snap to 5mm
        state.thickness = Math.max(5, Math.min(500, val));
        thicknessInput.value = state.thickness;
        updateQuickChips(state.thickness);
        render();
    });

    thicknessInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 40;
        val = Math.round(val / 5) * 5;
        state.thickness = Math.max(5, Math.min(500, val));
        thicknessInput.value = state.thickness;
        thicknessSlider.value = state.thickness;
        updateQuickChips(state.thickness);
        render();
    });

    // Quick Thickness Chips
    quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const h = parseInt(chip.dataset.h, 10);
            state.thickness = h;
            thicknessInput.value = h;
            thicknessSlider.value = h;
            updateQuickChips(h);
            render();
        });
    });

    function updateQuickChips(currentH) {
        quickChips.forEach(chip => {
            if (parseInt(chip.dataset.h, 10) === currentH) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    // Cut Length (Perimeter)
    cutLengthInput.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val) || val <= 0) val = 100;
        state.cutLength = val;
        render();
    });

    // Modal Guide
    btnShowGuide.addEventListener('click', () => {
        guideModal.classList.add('active');
    });

    btnCloseModal.addEventListener('click', () => {
        guideModal.classList.remove('active');
    });

    guideModal.addEventListener('click', (e) => {
        if (e.target === guideModal) {
            guideModal.classList.remove('active');
        }
    });

    // Print
    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // Copy Table
    btnCopyTable.addEventListener('click', () => {
        copyTableToClipboard();
    });

    // Custom Analysis Button
    btnAnalyzeCustom.addEventListener('click', () => {
        runCustomAnalysis();
    });

    // ==========================================
    // 3. CALCULATION ENGINE (PHYSICS & RULES)
    // ==========================================

    function calculateEDM(state) {
        const { material, passCount, qualityMode, thickness, cutLength } = state;
        const H = thickness;
        const isHard = material === 'SCM440'; // SCM440 vs SCM420
        const rows = [];

        // ----------------------------------------------------
        // PASS 1: ROUGH CUT (CẮT PHÁ THÔ)
        // ----------------------------------------------------
        let ti_1, Po_1, IP_1, Volt_1, VF_1, Wire_1, Offset_1, SpeedArea_1, Ra_1;

        // Base ti calculation
        if (H <= 15) {
            ti_1 = isHard ? 28 : 24;
        } else if (H <= 30) {
            ti_1 = isHard ? 32 : 28;
        } else if (H <= 60) {
            ti_1 = isHard ? 36 : 32;
        } else if (H <= 100) {
            ti_1 = 44;
        } else if (H <= 160) {
            ti_1 = 52;
        } else if (H <= 250) {
            ti_1 = 60;
        } else if (H <= 350) {
            ti_1 = 64;
        } else {
            ti_1 = 68;
        }

        // Base Po calculation (Off-time factor)
        if (H <= 15) {
            Po_1 = isHard ? 4 : 5;
        } else if (H <= 40) {
            Po_1 = isHard ? 5 : 6;
        } else if (H <= 70) {
            Po_1 = isHard ? 6 : 7;
        } else if (H <= 120) {
            Po_1 = isHard ? 6 : 7;
        } else if (H <= 200) {
            Po_1 = isHard ? 7 : 8;
        } else if (H <= 350) {
            Po_1 = isHard ? 9 : 10;
        } else {
            Po_1 = isHard ? 11 : 13;
        }

        // Base IP calculation (Channels 1-6)
        if (H <= 15) {
            IP_1 = 3;
        } else if (H <= 50) {
            IP_1 = 4;
        } else if (H <= 100) {
            IP_1 = 5;
        } else {
            IP_1 = 6;
        }

        // Base VF calculation (Servo tracking)
        if (H <= 20) {
            VF_1 = isHard ? 70 : 65;
        } else if (H <= 60) {
            VF_1 = isHard ? 65 : 60;
        } else if (H <= 100) {
            VF_1 = isHard ? 60 : 55;
        } else if (H <= 180) {
            VF_1 = isHard ? 55 : 50;
        } else if (H <= 300) {
            VF_1 = isHard ? 50 : 45;
        } else {
            VF_1 = isHard ? 45 : 40;
        }

        Volt_1 = 'High';
        Wire_1 = 1;

        // Base Offset (R_wire = 0.090 + Spark Gap)
        if (H <= 20) {
            Offset_1 = 0.112;
        } else if (H <= 60) {
            Offset_1 = 0.115;
        } else if (H <= 100) {
            Offset_1 = 0.118;
        } else if (H <= 200) {
            Offset_1 = 0.120;
        } else if (H <= 350) {
            Offset_1 = 0.122;
        } else {
            Offset_1 = 0.125;
        }

        // Base Speed area (mm2/min)
        SpeedArea_1 = isHard ? 130 : 115;
        if (H <= 20) SpeedArea_1 = isHard ? 115 : 100;
        if (H > 100 && H <= 250) SpeedArea_1 = isHard ? 110 : 95;
        if (H > 250) SpeedArea_1 = isHard ? 95 : 80;

        Ra_1 = isHard ? '2.8 - 3.2' : '3.0 - 3.4';

        // Tinh chỉnh theo Mục tiêu chất lượng (Quality Mode)
        let strategySpeedMult = 1.0;
        if (qualityMode === 'ultra-speed') {
            ti_1 = Math.min(ti_1 + 8, 72);
            Po_1 = Math.max(Po_1 - 1, 3);
            IP_1 = Math.min(IP_1 + 1, 6);
            VF_1 = Math.min(VF_1 + 5, 80);
            Offset_1 += 0.003;
            SpeedArea_1 *= 1.25;
            Ra_1 = isHard ? '3.6 - 4.2' : '3.8 - 4.5';
            strategySpeedMult = 1.20;
        } else if (qualityMode === 'high-speed') {
            ti_1 = Math.min(ti_1 + 4, 72);
            VF_1 = Math.min(VF_1 + 3, 75);
            SpeedArea_1 *= 1.12;
            Ra_1 = isHard ? '3.0 - 3.5' : '3.2 - 3.8';
            strategySpeedMult = 1.10;
        } else if (qualityMode === 'smooth') {
            ti_1 = Math.max(16, Math.round(ti_1 * 0.6));
            IP_1 = Math.max(2, IP_1 - 1);
            VF_1 = Math.max(45, VF_1 - 8);
            Offset_1 -= 0.002;
            SpeedArea_1 *= 0.70;
            Ra_1 = isHard ? '1.8 - 2.2' : '2.0 - 2.4';
            strategySpeedMult = 0.85;
        } else if (qualityMode === 'ultra-smooth') {
            ti_1 = Math.max(10, Math.round(ti_1 * 0.45));
            IP_1 = Math.max(1, IP_1 - 2);
            Volt_1 = H <= 40 ? 'Low' : 'High';
            VF_1 = Math.max(35, VF_1 - 15);
            Offset_1 -= 0.004;
            SpeedArea_1 *= 0.45;
            Ra_1 = isHard ? '1.2 - 1.5' : '1.4 - 1.8';
            strategySpeedMult = 0.70;
        }

        // Tốc độ tiến bàn cơ bản cho Pass 1: F1 = S1 / H
        const feedRate_1 = (SpeedArea_1 / H);

        rows.push({
            passName: 'P1',
            badgeClass: 'pass-badge-1',
            ti: ti_1,
            Po: Po_1,
            IP: IP_1,
            Voltage: Volt_1,
            VF: VF_1,
            Wire: Wire_1,
            offsetText: `Offset = ${Offset_1.toFixed(3)} mm`,
            speedArea: Math.round(SpeedArea_1),
            feedRate: feedRate_1.toFixed(2),
            Ra: Ra_1,
            rawOffset: Offset_1
        });

        // ----------------------------------------------------
        // PASS 2: SEMI-FINISH 1 / SỬA CÔN & SÓNG
        // Trong thực tế, vì lớp bào d = 0.022mm rất mỏng so với rãnh 0.23mm,
        // tốc độ tiến bàn F2 chạy nhanh hơn Pass 1 khoảng 1.7 - 2.0 lần.
        // ----------------------------------------------------
        if (passCount >= 2) {
            let ti_2 = H <= 60 ? 16 : (H <= 150 ? 20 : 24);
            let Po_2 = isHard ? 4 : 5;
            if (H > 100) Po_2 += 1;
            let IP_2 = H <= 60 ? 2 : 3;
            let Volt_2 = H <= 60 ? 'Low' : 'High';
            let VF_2 = isHard ? 45 : 40;
            let Wire_2 = 2;
            let remain_2 = H <= 20 ? 0.018 : (H <= 60 ? 0.022 : (H <= 120 ? 0.024 : 0.026));
            
            // Tốc độ tiến bàn thực tế F2 = F1 * 1.8 * strategy
            let feedRate_2 = feedRate_1 * 1.85 * strategySpeedMult;
            let speedArea_2 = Math.round(feedRate_2 * H);

            rows.push({
                passName: 'P2',
                badgeClass: 'pass-badge-2',
                ti: ti_2,
                Po: Po_2,
                IP: IP_2,
                Voltage: Volt_2,
                VF: VF_2,
                Wire: Wire_2,
                offsetText: `Lượng bào = ${remain_2.toFixed(3)} mm`,
                speedArea: speedArea_2,
                feedRate: feedRate_2.toFixed(2),
                Ra: isHard ? '1.8 - 2.0' : '2.0 - 2.2'
            });
        }

        // ----------------------------------------------------
        // PASS 3: FINISH 1 / CẮT TINH HẠ NHÁM
        // Lớp bào d = 0.010mm siêu mỏng -> F3 chạy nhanh hơn Pass 1 khoảng 2.2 - 2.5 lần
        // ----------------------------------------------------
        if (passCount >= 3) {
            let ti_3 = H <= 60 ? 6 : (H <= 150 ? 8 : 10);
            let Po_3 = isHard ? 3 : 4;
            if (H > 100) Po_3 += 1;
            let IP_3 = H <= 60 ? 1 : 2;
            let Volt_3 = 'Low';
            let VF_3 = isHard ? 35 : 30;
            let Wire_3 = 3;
            let remain_3 = H <= 20 ? 0.008 : (H <= 60 ? 0.010 : 0.012);
            
            let feedRate_3 = feedRate_1 * 2.30 * strategySpeedMult;
            let speedArea_3 = Math.round(feedRate_3 * H);

            rows.push({
                passName: 'P3',
                badgeClass: 'pass-badge-3',
                ti: ti_3,
                Po: Po_3,
                IP: IP_3,
                Voltage: Volt_3,
                VF: VF_3,
                Wire: Wire_3,
                offsetText: `Lượng bào = ${remain_3.toFixed(3)} mm`,
                speedArea: speedArea_3,
                feedRate: feedRate_3.toFixed(2),
                Ra: isHard ? '1.0 - 1.2' : '1.2 - 1.4'
            });
        }

        // ----------------------------------------------------
        // PASS 4: SUPER FINISH / XÓA BIẾN TRẮNG
        // Lớp bào d = 0.005mm -> F4 chạy lướt nhanh gấp 2.4 - 2.7 lần
        // ----------------------------------------------------
        if (passCount >= 4) {
            let ti_4 = H <= 60 ? 2 : (H <= 150 ? 3 : 4);
            let Po_4 = isHard ? 2 : 3;
            let IP_4 = 1;
            let Volt_4 = 'Low';
            let VF_4 = isHard ? 25 : 22;
            let Wire_4 = 3;
            let remain_4 = H <= 20 ? 0.004 : (H <= 60 ? 0.005 : 0.006);
            
            let feedRate_4 = feedRate_1 * 2.50 * strategySpeedMult;
            let speedArea_4 = Math.round(feedRate_4 * H);

            rows.push({
                passName: 'P4',
                badgeClass: 'pass-badge-4',
                ti: ti_4,
                Po: Po_4,
                IP: IP_4,
                Voltage: Volt_4,
                VF: VF_4,
                Wire: Wire_4,
                offsetText: `Lượng bào = ${remain_4.toFixed(3)} mm`,
                speedArea: speedArea_4,
                feedRate: feedRate_4.toFixed(2),
                Ra: isHard ? '0.7 - 0.9' : '0.9 - 1.1'
            });
        }

        // ----------------------------------------------------
        // PASS 5: MIRROR POLISH 1 / ĐÁNH BÓNG
        // Lớp bào d = 0.002mm -> F5 chạy lướt nhanh gấp 2.6 - 2.8 lần
        // ----------------------------------------------------
        if (passCount >= 5) {
            let ti_5 = H <= 80 ? 1 : 2;
            let Po_5 = 2;
            let IP_5 = 1;
            let Volt_5 = 'Low';
            let VF_5 = isHard ? 20 : 18;
            let Wire_5 = 3;
            let remain_5 = H <= 60 ? 0.002 : 0.003;
            
            let feedRate_5 = feedRate_1 * 2.65 * strategySpeedMult;
            let speedArea_5 = Math.round(feedRate_5 * H);

            rows.push({
                passName: 'P5',
                badgeClass: 'pass-badge-5',
                ti: ti_5,
                Po: Po_5,
                IP: IP_5,
                Voltage: Volt_5,
                VF: VF_5,
                Wire: Wire_5,
                offsetText: `Lượng bào = ${remain_5.toFixed(3)} mm`,
                speedArea: speedArea_5,
                feedRate: feedRate_5.toFixed(2),
                Ra: isHard ? '≤ 0.60' : '≤ 0.70'
            });
        }

        // ----------------------------------------------------
        // PASS 6: ULTRA MIRROR FINISH / BÓNG GƯƠNG TẾ VI
        // ----------------------------------------------------
        if (passCount >= 6) {
            let ti_6 = 1;
            let Po_6 = 2;
            let IP_6 = 1;
            let Volt_6 = 'Low';
            let VF_6 = 15;
            let Wire_6 = 3;
            let remain_6 = 0.001;
            
            let feedRate_6 = feedRate_1 * 2.70 * strategySpeedMult;
            let speedArea_6 = Math.round(feedRate_6 * H);

            rows.push({
                passName: 'P6',
                badgeClass: 'pass-badge-6',
                ti: ti_6,
                Po: Po_6,
                IP: IP_6,
                Voltage: Volt_6,
                VF: VF_6,
                Wire: Wire_6,
                offsetText: `Lượng bào = ${remain_6.toFixed(3)} mm`,
                speedArea: speedArea_6,
                feedRate: feedRate_6.toFixed(2),
                Ra: isHard ? '≤ 0.45' : '≤ 0.55'
            });
        }

        // Calculate Total Time
        let totalMinutes = 0;
        rows.forEach(r => {
            const feed = parseFloat(r.feedRate);
            if (feed > 0) {
                totalMinutes += cutLength / feed;
            }
        });

        // Generate dynamic technical notices
        const notices = [];
        if (!isHard) {
            notices.push('Thép mềm SCM420 dễ dính phôi: Đã tự động tăng hệ số nghỉ xung <strong>Po</strong> và giảm bớt <strong>VF</strong> để triệt tiêu nguy cơ ngắn mạch / đứt dây.');
        } else {
            notices.push('Thép tôi SCM440 cấu trúc Sorbit đồng nhất: Có thể phát huy tối đa tốc độ bám bước của Servo và cho độ bóng cao.');
        }

        if (H <= 20) {
            notices.push('Phôi mỏng (H ≤ 20mm): Mức xung ti được khống chế vừa phải để bảo vệ mép biên dạng không bị nát sắc nét.');
        } else if (H >= 100) {
            notices.push(`Phôi dày đặc biệt (H = ${H}mm): Cần tăng áp lực vòi xối làm mát 2 đầu tối đa, kiểm tra độ căng dây molypden định kỳ (khuyến nghị lực căng 9 - 12N).`);
        }

        if (passCount >= 4) {
            notices.push('Quy trình cắt từ 4 Pass trở lên: Nước làm mát cho các lần cắt sau nên được lọc cặn sạch hoặc dùng nước mới để tránh mạt sắt làm xước bề mặt gương.');
        }

        return { rows, totalMinutes, notices };
    }

    // ==========================================
    // 4. CUSTOM PARAMETER ANALYSIS ENGINE
    // ==========================================

    function runCustomAnalysis() {
        const c_ti = parseInt(customTiInput.value, 10) || 70;
        const c_po = parseInt(customPoInput.value, 10) || 7;
        const c_ip = parseInt(customIpInput.value, 10) || 4;
        const c_volt = customVoltInput.value;
        const c_vf = parseInt(customVfInput.value, 10) || 55;
        const c_wire = parseInt(customWireInput.value, 10) || 1;

        const H = state.thickness;
        const isHard = state.material === 'SCM440';

        // Lấy thông số chuẩn của hãng cho phôi này
        const stdCalc = calculateEDM({ ...state, qualityMode: 'standard' });
        const stdRow = stdCalc.rows[0];

        // 1. Tính toán Tần số phóng điện
        const c_toff = c_ti * c_po;
        const c_cycle = c_ti + c_toff;
        const c_freq_khz = (1000 / c_cycle).toFixed(2); // kHz

        const std_toff = stdRow.ti * stdRow.Po;
        const std_cycle = stdRow.ti + std_toff;
        const std_freq_khz = (1000 / std_cycle).toFixed(2);

        // 1b. Tính toán Năng lượng 1 tia, Tỷ lệ mở van và Tổng năng lượng trong 1 giây
        const c_duty_factor = ((1 / (1 + c_po)) * 100).toFixed(1);
        const std_duty_factor = ((1 / (1 + stdRow.Po)) * 100).toFixed(1);

        const c_we = c_ti * c_ip;
        const std_we = stdRow.ti * stdRow.IP;

        const c_total_power = Math.round(parseFloat(c_freq_khz) * 1000 * c_we);
        const std_total_power = Math.round(parseFloat(std_freq_khz) * 1000 * std_we);

        // 2. Tính toán tốc độ cắt ước tính
        const c_energy_factor = (c_ti * c_ip) / c_cycle;
        const std_energy_factor = (stdRow.ti * stdRow.IP) / std_cycle;
        const ratio = c_energy_factor / std_energy_factor;
        
        let c_speedArea = Math.round(stdRow.speedArea * ratio);
        if (c_ti > 60 && H < 100) {
            c_speedArea = Math.round(c_speedArea * 0.85);
        }
        const c_feedRate = (c_speedArea / H).toFixed(2);

        // 3. Tính độ nhám Ra ước tính
        let c_ra_min, c_ra_max;
        if (c_ti >= 70) {
            c_ra_min = 4.0; c_ra_max = 5.2;
        } else if (c_ti >= 50) {
            c_ra_min = 3.5; c_ra_max = 4.2;
        } else if (c_ti >= 30) {
            c_ra_min = 2.8; c_ra_max = 3.4;
        } else {
            c_ra_min = 1.8; c_ra_max = 2.4;
        }

        // 4. Khe hở phóng tia & Nguy cơ lẹm kích thước
        const c_sparkGap = (0.015 + 0.00035 * c_ti * (c_ip / 3)).toFixed(3);
        const std_sparkGap = (0.015 + 0.00035 * stdRow.ti * (stdRow.IP / 3)).toFixed(3);
        const gapDiff = ((c_sparkGap - std_sparkGap) * 1000).toFixed(0); // micron

        // Render bảng so sánh
        comparisonTableElement.innerHTML = `
            <thead>
                <tr>
                    <th class="col-metric">Tiêu chí Công nghệ</th>
                    <th class="col-user">Chế độ bạn nhập (Custom)</th>
                    <th class="col-std">Chế độ chuẩn Hãng (Standard)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="col-metric"><strong>Bộ thông số [ti - Po - IP - VF]</strong></td>
                    <td class="col-user">ti=${c_ti}μs, Po=${c_po}, IP=${c_ip}, VF=${c_vf}</td>
                    <td class="col-std">ti=${stdRow.ti}μs, Po=${stdRow.Po}, IP=${stdRow.IP}, VF=${stdRow.VF}</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Thời gian nghỉ xả xỉ (Toff)</strong></td>
                    <td class="col-user">${c_toff} μs</td>
                    <td class="col-std">${std_toff} μs</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Tần số phát xung (Frequency)</strong></td>
                    <td class="col-user"><strong>${c_freq_khz} kHz</strong> ${c_freq_khz < 2.5 ? '(Quá thưa)' : ''}</td>
                    <td class="col-std"><strong>${std_freq_khz} kHz</strong> (Tối ưu)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Tỷ lệ mở van MOSFET (Duty Factor - η)</strong></td>
                    <td class="col-user"><strong>${c_duty_factor}%</strong> (1 mở : ${c_po} nghỉ)</td>
                    <td class="col-std"><strong>${std_duty_factor}%</strong> (1 mở : ${stdRow.Po} nghỉ)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Năng lượng của 1 tia đơn (We ∝ ti × IP)</strong></td>
                    <td class="col-user"><strong>${c_we} đv</strong> (≈ ${(c_we * 0.035).toFixed(1)} mJ ${c_we > std_we ? '- Tia to hơn' : ''})</td>
                    <td class="col-std"><strong>${std_we} đv</strong> (≈ ${(std_we * 0.035).toFixed(1)} mJ - Tia vừa)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Tổng năng lượng phát ra trong 1 giây (f × We)</strong></td>
                    <td class="col-user"><strong>≈ ${c_total_power.toLocaleString()} đv/s</strong></td>
                    <td class="col-std"><strong>≈ ${std_total_power.toLocaleString()} đv/s</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Tốc độ cắt diện tích ước tính</strong></td>
                    <td class="col-user"><strong>${c_speedArea} mm²/p</strong></td>
                    <td class="col-std"><strong>${stdRow.speedArea} mm²/p</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Tốc độ tiến bàn máy F (H=${H}mm)</strong></td>
                    <td class="col-user"><strong>${c_feedRate} mm/p</strong></td>
                    <td class="col-std"><strong>${stdRow.feedRate} mm/p</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Độ nhám bề mặt (Ra)</strong></td>
                    <td class="col-user">${c_ra_min} - ${c_ra_max} μm (Rỗ sâu)</td>
                    <td class="col-std">${stdRow.Ra} μm (Đều, mịn)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Khe hở phóng điện thực tế (δ)</strong></td>
                    <td class="col-user">≈ ${c_sparkGap} mm</td>
                    <td class="col-std">≈ ${std_sparkGap} mm (Chuẩn)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Sai số kích thước (nếu giữ Offset=0.115)</strong></td>
                    <td class="col-user">${gapDiff > 5 ? `⚠️ LẸM (ÂM) ${gapDiff} μm (${(gapDiff/1000).toFixed(3)}mm)` : 'Bình thường'}</td>
                    <td class="col-std">✅ Chuẩn xác ±0.005 mm</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Mức độ mòn &amp; Nguy cơ đứt dây</strong></td>
                    <td class="col-user">${c_ti > 60 ? '🔴 DÂY MÒN RẤT NHANH, DỄ THẮT EO ĐỨT' : '🟢 An toàn'}</td>
                    <td class="col-std">🟢 DÂY BỀN, TUỔI THỌ CAO</td>
                </tr>
            </tbody>
        `;

        // Render feedback nhận xét
        let feedbackHTML = `<span class="feedback-alert feedback-warn">🔍 ĐÁNH GIÁ KỸ THUẬT CHI TIẾT TỪ CHUYÊN GIA EDM:</span>`;
        feedbackHTML += `<ul style="padding-left:18px;margin-top:6px;">`;

        if (c_ti > 50 && H < 100) {
            feedbackHTML += `<li><strong>Xung ti=${c_ti}μs quá cao cho phôi H=${H}mm:</strong> Năng lượng xung đơn quá nóng làm dây Molypden bị ủ mềm, sinh hố rỗ hồ quang lớn. Bề mặt cắt sẽ rất thô nhám (Ra ≈ ${c_ra_min} - ${c_ra_max} μm).</li>`;
        }

        if (c_toff > 300) {
            feedbackHTML += `<li><strong>Thời gian nghỉ Toff=${c_toff}μs quá dài:</strong> Mặc dù rửa xỉ tốt nhưng làm tần số xung tụt xuống còn <strong>${c_freq_khz} kHz</strong> → Mật độ tia lửa quá thưa khiến <strong>tốc độ cắt bị kéo chậm lại rõ rệt</strong>.</li>`;
        }

        if (gapDiff > 5) {
            feedbackHTML += `<li><strong>Cảnh báo sai lệch kích thước:</strong> Do khe hở tia lửa bị giãn rộng thêm <strong>+${gapDiff} micron</strong>, nếu bạn dùng Offset mặc định (0.115 mm) thì chi tiết cắt ra sẽ bị <strong>LẸM PHÔI</strong>. Nếu muốn dùng chế độ này, bạn bắt buộc phải tăng Offset lên <strong>${(0.090 + parseFloat(c_sparkGap)).toFixed(3)} mm</strong>.</li>`;
        }

        if (c_ti <= stdRow.ti + 8 && c_po <= stdRow.Po + 1) {
            feedbackHTML += `<li><strong class="feedback-good">Đánh giá chung:</strong> Bộ thông số bạn nhập tương đối hợp lý và nằm gần vùng làm việc an toàn của máy.</li>`;
        } else {
            feedbackHTML += `<li><strong class="feedback-danger">Lời khuyên:</strong> Đối với thép ${state.material} dày ${H}mm, bạn nên áp dụng <strong>ti=${stdRow.ti}μs, Po=${stdRow.Po}, IP=${stdRow.IP}</strong> để đạt tốc độ cắt nhanh hơn, bề mặt đẹp và bảo vệ dây Molypden tối đa.</li>`;
        }

        feedbackHTML += `</ul>`;
        analysisFeedbackBox.innerHTML = feedbackHTML;

        // Hiển thị khung so sánh
        analysisContainer.style.display = 'block';
        analysisContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // ==========================================
    // 5. RENDER MAIN VIEW
    // ==========================================

    function render() {
        // Summary text
        const modeMap = {
            'ultra-speed': 'Siêu Năng Suất',
            'high-speed': 'Năng Suất Cao',
            'standard': 'Tiêu Chuẩn',
            'smooth': 'Bề Mặt Mịn',
            'ultra-smooth': 'Bề Mặt Siêu Mịn'
        };
        const strategyLabel = modeMap[state.qualityMode] || 'Tiêu Chuẩn';
        const passLabel = state.passCount === 1 ? '1 Lần cắt' : `${state.passCount} Lần cắt (Multi-Cut)`;

        configSummary.textContent = `${state.material} | Chiều dày H = ${state.thickness} mm | ${passLabel} | Chiến lược: ${strategyLabel}`;

        // Compute parameters
        const { rows, totalMinutes, notices } = calculateEDM(state);

        // Render Table Body
        tableBody.innerHTML = rows.map(r => `
            <tr>
                <td class="pass-cell"><span class="pass-badge ${r.badgeClass}">${r.passName}</span></td>
                <td><strong>${r.ti}</strong></td>
                <td>${r.Po}</td>
                <td><span class="badge-ip">${r.IP}</span></td>
                <td><span class="${r.Voltage === 'High' ? 'val-volt-high' : 'val-volt-low'}">${r.Voltage}</span></td>
                <td>${r.VF}</td>
                <td>${r.Wire}</td>
                <td class="val-offset">${r.offsetText}</td>
                <td>${r.speedArea}</td>
                <td><strong>${r.feedRate}</strong></td>
                <td class="val-ra">${r.Ra}</td>
            </tr>
        `).join('');

        // Render Notices
        noticeList.innerHTML = notices.map(n => `<li>${n}</li>`).join('');

        // Render Total Time
        if (totalMinutes < 60) {
            totalTimeText.textContent = `${totalMinutes.toFixed(1)} phút`;
        } else {
            const hrs = Math.floor(totalMinutes / 60);
            const mins = Math.round(totalMinutes % 60);
            totalTimeText.textContent = `${hrs} giờ ${mins} phút (~${totalMinutes.toFixed(0)}p)`;
        }
    }

    // ==========================================
    // 6. COPY TABLE TO CLIPBOARD
    // ==========================================

    function copyTableToClipboard() {
        const { rows } = calculateEDM(state);
        let text = `AUTOCUT EDM SERVO - BẢNG THÔNG SỐ CẮT\n`;
        text += `Vật liệu: ${state.material} | Chiều dày H: ${state.thickness}mm | Quy trình: ${state.passCount} Pass | Chiến lược: ${state.qualityMode}\n\n`;
        text += `P\tti(μs)\tPo\tIP\tVolt\tVF\tWire\tBù dao\tTốc độ(mm2/p)\tF(mm/p)\tRa(μm)\n`;
        
        rows.forEach(r => {
            text += `${r.passName}\t${r.ti}\t${r.Po}\t${r.IP}\t${r.Voltage}\t${r.VF}\t${r.Wire}\t${r.offsetText}\t${r.speedArea}\t${r.feedRate}\t${r.Ra}\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
            btnCopyTable.textContent = '✅ Đã Copy!';
            setTimeout(() => {
                btnCopyTable.textContent = '📋 Copy Bảng';
            }, 2000);
        }).catch(err => {
            alert('Không thể copy vào clipboard: ' + err);
        });
    }

    // ==========================================
    // 7. PWA OFFLINE MODE & AUTO-SYNC ENGINE
    // ==========================================
    const CURRENT_VERSION = "2.4.0";

    // 7a. Register Service Worker (Hỗ trợ chạy Offline khi mất mạng)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js?v=' + CURRENT_VERSION)
                .then(reg => {
                    console.log('PWA Service Worker registered:', reg.scope);
                })
                .catch(err => {
                    console.warn('Service Worker registration skipped:', err);
                });
        });
    }

    // 7b. Quản lý trạng thái Mạng (Online / Offline)
    const networkBadge = document.getElementById('network-badge');
    function updateNetworkStatus() {
        if (!networkBadge) return;
        if (navigator.onLine) {
            networkBadge.textContent = '🟢 Online';
            networkBadge.className = 'net-badge net-online';
            checkForForceUpdate();
        } else {
            networkBadge.textContent = '🟡 Offline (Bản lưu trong máy)';
            networkBadge.className = 'net-badge net-offline';
            showToast('📡 Đang dùng chế độ ngoại tuyến (Không có mạng vẫn chạy tốt!)');
        }
    }
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();

    // 7c. Tự động kiểm tra cập nhật khi có mạng
    async function checkForForceUpdate() {
        if (!navigator.onLine) return; // Mất mạng thì không kiểm tra, để offline mượt mà
        try {
            const response = await fetch('version.json?_t=' + Date.now(), {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
            });
            if (!response.ok) return;
            const data = await response.json();
            
            const storedVersion = localStorage.getItem('autocut_app_version');
            if (data.version && storedVersion && data.version !== storedVersion) {
                localStorage.setItem('autocut_app_version', data.version);
                
                // Cập nhật cache Service Worker
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (let registration of registrations) {
                        registration.update();
                    }
                }

                // Thông báo & tự động tải bản mới
                showToast(`⚡ Đã đồng bộ bản mới nhất (${data.version})!`);
                setTimeout(() => {
                    const cleanUrl = window.location.href.split('?')[0];
                    window.location.replace(cleanUrl + '?v=' + Date.now());
                }, 800);
            } else if (!storedVersion && data.version) {
                localStorage.setItem('autocut_app_version', data.version);
            }
        } catch (e) {
            console.warn('Auto sync check skipped:', e);
        }
    }

    function forceHardRefresh() {
        localStorage.removeItem('autocut_app_version');
        if ('caches' in window) {
            caches.keys().then(names => names.forEach(name => caches.delete(name)));
        }
        showToast('🔄 Đang đồng bộ lại toàn bộ dữ liệu từ máy chủ...');
        setTimeout(() => {
            const cleanUrl = window.location.href.split('?')[0];
            window.location.replace(cleanUrl + '?force_reload=' + Date.now());
        }, 600);
    }

    function showToast(msg) {
        let toast = document.getElementById('update-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'update-toast';
            toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#00f0ff;color:#000;padding:10px 20px;border-radius:24px;font-weight:700;font-size:13px;box-shadow:0 6px 24px rgba(0,240,255,0.6);z-index:99999;font-family:sans-serif;text-align:center;pointer-events:none;';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => {
            if (toast) toast.style.display = 'none';
        }, 3500);
    }

    // Attach button listeners
    const btnForceUpdate = document.getElementById('btn-force-update');
    if (btnForceUpdate) {
        btnForceUpdate.addEventListener('click', forceHardRefresh);
    }
    const linkForceUpdate = document.getElementById('link-force-update');
    if (linkForceUpdate) {
        linkForceUpdate.addEventListener('click', forceHardRefresh);
    }

    // Check on launch & on tab focus
    checkForForceUpdate();
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkForForceUpdate();
        }
    });

    // INITIAL RENDER
    render();
});

/**
 * AUTOCUT EDM SERVO - PARAMETER CALCULATION & ANALYSIS ENGINE
 * Hệ thống tính toán, phân tích và tra cứu chế độ cắt EDM AutoCut Servo
 * © 2026 AutoCut EDM Master
 */

document.addEventListener('DOMContentLoaded', () => {
    // 11 CẤP ĐỘ CHIẾN LƯỢC GIA CÔNG (TÂM ĐIỂM = CẤP 6: TIÊU CHUẨN)
    const STRATEGY_CONFIGS = {
        1: { name: 'Cực Hạn Tinh Xảo (Mịn +3)', badge: 'Gương Quang Học', desc: 'Vi xung nano, khống chế biến trắng tuyệt đối, độ bóng gương quang học đỉnh cao.', tiMult: 0.30, ipDelta: -2, vfDelta: -20, poDelta: +1, speedMult: 0.30 },
        2: { name: 'Siêu Mịn Cấp 2 (Mịn +2)', badge: 'Gương Tế Vi', desc: 'Xung cực nhỏ, triệt tiêu hoàn toàn vi nứt bề mặt khuôn mẫu.', tiMult: 0.38, ipDelta: -2, vfDelta: -18, poDelta: +1, speedMult: 0.38 },
        3: { name: 'Siêu Mịn Cấp 1 (Mịn +1)', badge: 'Siêu Phẳng', desc: 'Bóc tách êm mượt, tối ưu độ đồng đều bề mặt và mép sắc nét.', tiMult: 0.45, ipDelta: -2, vfDelta: -15, poDelta: 0, speedMult: 0.45 },
        4: { name: 'Bề Mặt Siêu Mịn', badge: 'Mịn Cao', desc: 'Vi xung cực mịn, khống chế dung sai phôi nghiêm ngặt.', tiMult: 0.55, ipDelta: -1, vfDelta: -12, poDelta: 0, speedMult: 0.55 },
        5: { name: 'Bề Mặt Mịn / Ưu Tiên Phẳng', badge: 'Mịn Vừa', desc: 'Hạn chế sọc sóng, mép sắc nét, bám bước êm ái.', tiMult: 0.70, ipDelta: -1, vfDelta: -8, poDelta: 0, speedMult: 0.70 },
        6: { name: '⭐ Tiêu Chuẩn (Khuyên Dùng)', badge: 'Chuẩn Hãng', desc: 'Cân bằng tối ưu giữa tốc độ, độ nhám và độ bền dây Molypden.', tiMult: 1.0, ipDelta: 0, vfDelta: 0, poDelta: 0, speedMult: 1.0 },
        7: { name: 'Năng Suất Cao', badge: 'Tốc Độ +1', desc: 'Tốc độ nhanh, ổn định cao, tiết kiệm dây và điện.', tiMult: 1.10, ipDelta: 0, vfDelta: +3, poDelta: 0, speedMult: 1.12 },
        8: { name: 'Siêu Năng Suất', badge: 'Tốc Độ +2', desc: 'Bóc tách tối đa, bám tải nhanh, rút ngắn thời gian cắt.', tiMult: 1.25, ipDelta: +1, vfDelta: +5, poDelta: -1, speedMult: 1.25 },
        9: { name: 'Cường Lực Bóc Tách (Tốc độ +3)', badge: 'Tốc Độ +3', desc: 'Tăng cường năng lượng xung ti, đẩy mạnh tiến bàn máy.', tiMult: 1.35, ipDelta: +1, vfDelta: +8, poDelta: -1, speedMult: 1.38 },
        10: { name: 'Tối Đa Công Suất (Tốc độ +4)', badge: 'Tốc Độ +4', desc: 'Mở tối đa kênh dòng MOSFET, bám tải Servo cực mạnh.', tiMult: 1.45, ipDelta: +1, vfDelta: +10, poDelta: -1, speedMult: 1.50 },
        11: { name: 'Cực Hạn Phá Thô (Tốc độ +5)', badge: 'Cực Hạn Phá', desc: 'Khai thác kịch trần công suất tủ nguồn, phá thô siêu tốc kỷ lục cho phôi dày.', tiMult: 1.55, ipDelta: +1, vfDelta: +12, poDelta: -1, speedMult: 1.62 }
    };

    // STATE (Mặc định SCM420, 1 Pass, Chiến lược Cấp 6, H=40mm)
    const state = {
        material: 'SCM420',
        passCount: 1,
        strategyLevel: 6,
        thickness: 40,
        cutLength: 100
    };

    // DOM ELEMENTS
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    const materialCards = document.querySelectorAll('.radio-card');
    const passButtons = document.querySelectorAll('.pass-btn');
    const strategySlider = document.getElementById('strategy-slider');
    const strategyLevelBadge = document.getElementById('strategy-level-badge');
    const strategyNameDisplay = document.getElementById('strategy-name-display');
    const strategyBadgeDisplay = document.getElementById('strategy-badge-display');
    const strategyDescDisplay = document.getElementById('strategy-desc-display');

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

    // 11-Position Strategy Slider
    if (strategySlider) {
        strategySlider.addEventListener('input', (e) => {
            const lvl = parseInt(e.target.value, 10);
            state.strategyLevel = lvl;
            updateStrategyDisplay(lvl);
            render();
        });
    }

    function updateStrategyDisplay(lvl) {
        const conf = STRATEGY_CONFIGS[lvl] || STRATEGY_CONFIGS[6];
        if (strategyLevelBadge) strategyLevelBadge.textContent = `${conf.name} (Cấp ${lvl}/11)`;
        if (strategyNameDisplay) strategyNameDisplay.textContent = conf.name;
        if (strategyBadgeDisplay) strategyBadgeDisplay.textContent = conf.badge;
        if (strategyDescDisplay) strategyDescDisplay.textContent = conf.desc;
    }

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
        const { material, passCount, strategyLevel, thickness, cutLength } = state;
        const H = thickness;
        const isHard = material === 'SCM440'; // Thép tôi cứng SCM440
        const isCopper = material === 'COPPER'; // Đồng đỏ / Đồng thau
        const isAlu = material === 'ALUMINUM'; // Nhôm 6061 / 7075
        const rows = [];
        const strat = STRATEGY_CONFIGS[strategyLevel] || STRATEGY_CONFIGS[6];

        // ----------------------------------------------------
        // PASS 1: ROUGH CUT (CẮT PHÁ THÔ)
        // ----------------------------------------------------
        let ti_1, Po_1, IP_1, Volt_1, VF_1, Wire_1, Offset_1, SpeedArea_1, Ra_1;

        // Base Ton (ti) calculation
        if (isAlu) {
            // Nhôm nóng chảy 660°C -> xung ti ngắn tránh bốc mạt nhôm dính dây
            if (H <= 15) ti_1 = 18;
            else if (H <= 30) ti_1 = 22;
            else if (H <= 60) ti_1 = 26;
            else if (H <= 100) ti_1 = 32;
            else if (H <= 160) ti_1 = 38;
            else if (H <= 250) ti_1 = 44;
            else if (H <= 350) ti_1 = 50;
            else ti_1 = 56;
        } else if (isCopper) {
            // Đồng tản nhiệt rất nhanh -> xung ti tập trung
            if (H <= 15) ti_1 = 26;
            else if (H <= 30) ti_1 = 30;
            else if (H <= 60) ti_1 = 36;
            else if (H <= 100) ti_1 = 44;
            else if (H <= 160) ti_1 = 52;
            else if (H <= 250) ti_1 = 60;
            else if (H <= 350) ti_1 = 64;
            else ti_1 = 68;
        } else {
            // Thép SCM420 / SCM440
            if (H <= 15) ti_1 = isHard ? 28 : 24;
            else if (H <= 30) ti_1 = isHard ? 32 : 28;
            else if (H <= 60) ti_1 = isHard ? 36 : 32;
            else if (H <= 100) ti_1 = 44;
            else if (H <= 160) ti_1 = 52;
            else if (H <= 250) ti_1 = 60;
            else if (H <= 350) ti_1 = 64;
            else ti_1 = 68;
        }

        // Base Toff (Po) calculation
        if (isAlu) {
            // Nhôm cần Toff lớn để xả xỉ nhôm chống ngắn mạch
            if (H <= 15) Po_1 = 6;
            else if (H <= 40) Po_1 = 7;
            else if (H <= 70) Po_1 = 8;
            else if (H <= 120) Po_1 = 9;
            else if (H <= 200) Po_1 = 10;
            else Po_1 = 12;
        } else if (isCopper) {
            if (H <= 15) Po_1 = 4;
            else if (H <= 40) Po_1 = 5;
            else if (H <= 70) Po_1 = 6;
            else if (H <= 120) Po_1 = 7;
            else if (H <= 200) Po_1 = 8;
            else Po_1 = 10;
        } else {
            if (H <= 15) Po_1 = isHard ? 4 : 5;
            else if (H <= 40) Po_1 = isHard ? 5 : 6;
            else if (H <= 70) Po_1 = isHard ? 6 : 7;
            else if (H <= 120) Po_1 = isHard ? 6 : 7;
            else if (H <= 200) Po_1 = isHard ? 7 : 8;
            else if (H <= 350) Po_1 = isHard ? 9 : 10;
            else Po_1 = isHard ? 11 : 13;
        }

        // Base IP calculation
        if (H <= 15) IP_1 = 3;
        else if (H <= 50) IP_1 = 4;
        else if (H <= 100) IP_1 = 5;
        else IP_1 = 6;

        // Base VF calculation
        if (isAlu) {
            if (H <= 20) VF_1 = 75;
            else if (H <= 60) VF_1 = 70;
            else if (H <= 100) VF_1 = 65;
            else if (H <= 180) VF_1 = 60;
            else if (H <= 300) VF_1 = 55;
            else VF_1 = 50;
        } else if (isCopper) {
            if (H <= 20) VF_1 = 68;
            else if (H <= 60) VF_1 = 62;
            else if (H <= 100) VF_1 = 58;
            else if (H <= 180) VF_1 = 52;
            else if (H <= 300) VF_1 = 48;
            else VF_1 = 42;
        } else {
            if (H <= 20) VF_1 = isHard ? 70 : 65;
            else if (H <= 60) VF_1 = isHard ? 65 : 60;
            else if (H <= 100) VF_1 = isHard ? 60 : 55;
            else if (H <= 180) VF_1 = isHard ? 55 : 50;
            else if (H <= 300) VF_1 = isHard ? 50 : 45;
            else VF_1 = isHard ? 45 : 40;
        }

        Volt_1 = 'High';
        Wire_1 = 1;

        // Base Offset (R_wire = 0.090 + Spark Gap)
        if (isAlu) {
            if (H <= 20) Offset_1 = 0.116;
            else if (H <= 60) Offset_1 = 0.118;
            else if (H <= 100) Offset_1 = 0.122;
            else if (H <= 200) Offset_1 = 0.125;
            else Offset_1 = 0.128;
        } else if (isCopper) {
            if (H <= 20) Offset_1 = 0.112;
            else if (H <= 60) Offset_1 = 0.115;
            else if (H <= 100) Offset_1 = 0.118;
            else if (H <= 200) Offset_1 = 0.120;
            else Offset_1 = 0.124;
        } else {
            if (H <= 20) Offset_1 = 0.112;
            else if (H <= 60) Offset_1 = 0.115;
            else if (H <= 100) Offset_1 = 0.118;
            else if (H <= 200) Offset_1 = 0.120;
            else if (H <= 350) Offset_1 = 0.122;
            else Offset_1 = 0.125;
        }

        // Base Speed area (mm2/min)
        if (isAlu) {
            SpeedArea_1 = 165;
            if (H <= 20) SpeedArea_1 = 145;
            if (H > 100 && H <= 250) SpeedArea_1 = 150;
            if (H > 250) SpeedArea_1 = 125;
            Ra_1 = '3.2 - 3.8';
        } else if (isCopper) {
            SpeedArea_1 = 125;
            if (H <= 20) SpeedArea_1 = 110;
            if (H > 100 && H <= 250) SpeedArea_1 = 105;
            if (H > 250) SpeedArea_1 = 90;
            Ra_1 = '2.6 - 3.0';
        } else {
            SpeedArea_1 = isHard ? 130 : 115;
            if (H <= 20) SpeedArea_1 = isHard ? 115 : 100;
            if (H > 100 && H <= 250) SpeedArea_1 = isHard ? 110 : 95;
            if (H > 250) SpeedArea_1 = isHard ? 95 : 80;
            Ra_1 = isHard ? '2.8 - 3.2' : '3.0 - 3.4';
        }

        // Tinh chỉnh theo Chiến lược 11 Cấp độ
        let strategySpeedMult = strat.speedMult;
        if (strategyLevel !== 6) {
            ti_1 = Math.max(6, Math.min(80, Math.round(ti_1 * strat.tiMult)));
            IP_1 = Math.max(1, Math.min(6, IP_1 + strat.ipDelta));
            VF_1 = Math.max(20, Math.min(90, VF_1 + strat.vfDelta));
            Po_1 = Math.max(2, Math.min(16, Po_1 + strat.poDelta));
            SpeedArea_1 = Math.round(SpeedArea_1 * strat.speedMult);

            if (strategyLevel <= 3 && H <= 40) {
                Volt_1 = 'Low';
                Offset_1 -= 0.005;
                Ra_1 = isAlu ? '1.4 - 1.8' : (isCopper ? '1.0 - 1.3' : (isHard ? '1.0 - 1.4' : '1.2 - 1.6'));
            } else if (strategyLevel <= 5) {
                Offset_1 -= 0.002;
                Ra_1 = isAlu ? '2.0 - 2.4' : (isCopper ? '1.5 - 1.9' : (isHard ? '1.6 - 2.0' : '1.8 - 2.2'));
            } else if (strategyLevel >= 9) {
                Offset_1 += 0.004;
                Ra_1 = isAlu ? '4.5 - 5.5' : (isCopper ? '3.8 - 4.5' : (isHard ? '4.0 - 4.8' : '4.2 - 5.2'));
            } else if (strategyLevel >= 7) {
                Offset_1 += 0.002;
                Ra_1 = isAlu ? '3.6 - 4.2' : (isCopper ? '3.0 - 3.5' : (isHard ? '3.2 - 3.8' : '3.4 - 4.0'));
            }
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
            offsetText: `${Offset_1.toFixed(3)}mm`,
            speedArea: Math.round(SpeedArea_1),
            feedRate: feedRate_1.toFixed(2),
            Ra: Ra_1,
            tolerance: H <= 50 ? '±0.015mm' : (H <= 150 ? '±0.020mm' : '±0.025mm'),
            rawOffset: Offset_1
        });

        // ----------------------------------------------------
        // PASS 2: SEMI-FINISH 1 / SỬA CÔN & SÓNG
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
                offsetText: `${remain_2.toFixed(3)}mm`,
                speedArea: speedArea_2,
                feedRate: feedRate_2.toFixed(2),
                Ra: isHard ? '1.8 - 2.0' : '2.0 - 2.2',
                tolerance: H <= 50 ? '±0.008mm' : (H <= 150 ? '±0.010mm' : '±0.012mm')
            });
        }

        // ----------------------------------------------------
        // PASS 3: FINISH 1 / CẮT TINH HẠ NHÁM
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
                offsetText: `${remain_3.toFixed(3)}mm`,
                speedArea: speedArea_3,
                feedRate: feedRate_3.toFixed(2),
                Ra: isHard ? '1.0 - 1.2' : '1.2 - 1.4',
                tolerance: H <= 50 ? '±0.005mm' : (H <= 150 ? '±0.006mm' : '±0.008mm')
            });
        }

        // ----------------------------------------------------
        // PASS 4: SUPER FINISH / XÓA BIẾN TRẮNG
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
                offsetText: `${remain_4.toFixed(3)}mm`,
                speedArea: speedArea_4,
                feedRate: feedRate_4.toFixed(2),
                Ra: isHard ? '0.7 - 0.9' : '0.9 - 1.1',
                tolerance: '±0.004mm'
            });
        }

        // ----------------------------------------------------
        // PASS 5: MIRROR POLISH 1 / ĐÁNH BÓNG
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
                offsetText: `${remain_5.toFixed(3)}mm`,
                speedArea: speedArea_5,
                feedRate: feedRate_5.toFixed(2),
                Ra: isHard ? '≤ 0.60' : '≤ 0.70',
                tolerance: '±0.003mm'
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
                offsetText: `${remain_6.toFixed(3)}mm`,
                speedArea: speedArea_6,
                feedRate: feedRate_6.toFixed(2),
                Ra: isHard ? '≤ 0.45' : '≤ 0.55',
                tolerance: '±0.002mm'
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

        // Expert Operation Notices
        const notices = [];
        if (isAlu) {
            notices.push("Nhôm (Al 6061/7075): Tốc độ cắt cực nhanh do nhiệt độ nóng chảy thấp (660°C). Bắt buộc tăng Toff để xả xỉ chống bám dính dây và đoản mạch.");
        } else if (isCopper) {
            notices.push("Đồng (Cu / Đồng thau): Tản nhiệt và dẫn điện cực mạnh. Cần duy trì xung ổn định và áp lực nước đều để tránh tổn hao năng lượng.");
        } else if (isHard) {
            notices.push("Thép đã tôi cứng SCM440 (28-32 HRC): Bề mặt bóc xỉ rất đều, độ bóng cao. Tăng nhẹ VF và giảm nhẹ Toff để tăng năng suất.");
        } else {
            notices.push("Thép mềm SCM420 dễ dính phôi: Đã tự động tăng hệ số nghỉ xung Toff và giảm bớt VF để triệt tiêu nguy cơ ngắn mạch / đứt dây.");
        }

        if (H > 150) {
            notices.push(`Phôi dày lớn H=${H}mm: Cần mở van nước áp lực cao, kiểm tra tiếp điện và định kỳ hạ tốc độ dây khi cắt tinh.`);
        } else if (H <= 20) {
            notices.push(`Phôi mỏng H=${H}mm: Tránh dùng Ton quá lớn để ngăn ngừa phồng biên dạng mép cắt.`);
        }

        if (strategyLevel >= 9) {
            notices.push("⚠️ Đang kích hoạt chế độ Cường lực / Tối đa công suất: Chú ý lực căng dây và lưu lượng nước làm mát để phòng ngừa đứt dây.");
        } else if (strategyLevel <= 3) {
            notices.push("✨ Đang kích hoạt chế độ Siêu mịn / Bóng gương: Năng lượng cực nhỏ, yêu cầu dây sạch và độ căng chuẩn tuyệt đối.");
        }

        return { rows, totalMinutes, notices };
    }

    // ==========================================
    // 4. CUSTOM ANALYSIS ENGINE
    // ==========================================

    function runCustomAnalysis() {
        const c_ti = parseInt(customTiInput.value, 10) || 70;
        const c_po = parseInt(customPoInput.value, 10) || 7;
        const c_ip = parseInt(customIpInput.value, 10) || 4;
        const c_volt = customVoltInput.value;
        const c_vf = parseInt(customVfInput.value, 10) || 55;
        const c_wire = parseInt(customWireInput.value, 10) || 1;

        const H = state.thickness;
        const stdCalc = calculateEDM({ ...state, strategyLevel: 6 });
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
                    <td class="col-metric"><strong>Tốc độ cắt diện tích ước tính Fc</strong></td>
                    <td class="col-user"><strong>${c_speedArea} mm²/p</strong></td>
                    <td class="col-std"><strong>${stdRow.speedArea} mm²/p</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>Tốc độ tiến bàn máy Ft (H=${H}mm)</strong></td>
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
        const strat = STRATEGY_CONFIGS[state.strategyLevel] || STRATEGY_CONFIGS[6];
        const passLabel = state.passCount === 1 ? '1 Pass' : `${state.passCount} Pass (Multi-Cut)`;
        const matNames = {
            'SCM420': 'Thép SCM420 (Thép mềm)',
            'SCM440': 'Thép tôi SCM440 (Thép cứng)',
            'COPPER': 'Đồng (Cu / Đồng thau)',
            'ALUMINUM': 'Nhôm (Al 6061 / 7075)'
        };
        const matLabel = matNames[state.material] || state.material;

        configSummary.textContent = `${matLabel} | H = ${state.thickness} mm | ${passLabel} | Chiến lược: ${strat.name}`;

        // Compute parameters
        const { rows, totalMinutes, notices } = calculateEDM(state);

        // Render Table Body
        tableBody.innerHTML = rows.map(r => `
            <tr>
                <td class="pass-cell sticky-col"><span class="pass-badge ${r.badgeClass}">${r.passName}</span></td>
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
                <td class="val-tolerance">${r.tolerance}</td>
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
        const strat = STRATEGY_CONFIGS[state.strategyLevel] || STRATEGY_CONFIGS[6];
        const matNames = {
            'SCM420': 'Thép SCM420',
            'SCM440': 'Thép tôi SCM440',
            'COPPER': 'Đồng (Cu/Thau)',
            'ALUMINUM': 'Nhôm (Al 6061/7075)'
        };
        const matLabel = matNames[state.material] || state.material;
        let text = `AUTOCUT EDM SERVO - BẢNG THÔNG SỐ CẮT\n`;
        text += `Vật liệu: ${matLabel} | Chiều dày H: ${state.thickness}mm | Quy trình: ${state.passCount} Pass | Chiến lược: ${strat.name}\n\n`;
        text += `P\tTon\tToff\tIP\tV\tVF\tWire\tOFFSET\tFc(mm2/p)\tFt(mm/p)\tRa\tSai số\n`;
        
        rows.forEach(r => {
            text += `${r.passName}\t${r.ti}\t${r.Po}\t${r.IP}\t${r.Voltage}\t${r.VF}\t${r.Wire}\t${r.offsetText}\t${r.speedArea}\t${r.feedRate}\t${r.Ra}\t${r.tolerance}\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
            btnCopyTable.textContent = '✅ Đã Copy!';
            setTimeout(() => {
                btnCopyTable.textContent = '📋 Copy Bảng';
            }, 2000);
        });
    }

    // ==========================================
    // 7. PWA OFFLINE MODE & AUTO-SYNC ENGINE
    // ==========================================
    const CURRENT_VERSION = "2.7.0";

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
    updateStrategyDisplay(state.strategyLevel);
    render();
});

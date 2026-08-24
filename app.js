/**
 * AUTOCUT EDM SERVO - PARAMETER CALCULATION & ANALYSIS ENGINE
 * Hệ thống tính toán, phân tích và tra cứu chế độ cắt EDM AutoCut Servo
 * © 2026 AutoCut EDM Master
 */

document.addEventListener('DOMContentLoaded', () => {
    // 11 CẤP ĐỘ CHIẾN LƯỢC GIA CÔNG (TÂM ĐIỂM = CẤP 6: TIÊU CHUẨN)
    const STRATEGY_CONFIGS = {
        1: { name: 'Cực Hạn Tinh Xảo (Mịn +3)', shortName: 'Cực Hạn Tinh Xảo (Cấp 1)', badge: 'Gương Quang Học', desc: 'Vi xung nano, khống chế biến trắng tuyệt đối, độ bóng gương quang học đỉnh cao.', tiMult: 0.30, ipDelta: -2, vfDelta: -20, poDelta: +1, speedMult: 0.30 },
        2: { name: 'Siêu Mịn Cấp 2 (Mịn +2)', shortName: 'Siêu Mịn (Cấp 2)', badge: 'Gương Tế Vi', desc: 'Xung cực nhỏ, triệt tiêu hoàn toàn vi nứt bề mặt khuôn mẫu.', tiMult: 0.38, ipDelta: -2, vfDelta: -18, poDelta: +1, speedMult: 0.38 },
        3: { name: 'Siêu Mịn Cấp 1 (Mịn +1)', shortName: 'Siêu Mịn (Cấp 3)', badge: 'Siêu Phẳng', desc: 'Bóc tách êm mượt, tối ưu độ đồng đều bề mặt và mép sắc nét.', tiMult: 0.45, ipDelta: -2, vfDelta: -15, poDelta: 0, speedMult: 0.45 },
        4: { name: 'Bề Mặt Siêu Mịn', shortName: 'Mịn Cao (Cấp 4)', badge: 'Mịn Cao', desc: 'Vi xung cực mịn, khống chế dung sai phôi nghiêm ngặt.', tiMult: 0.55, ipDelta: -1, vfDelta: -12, poDelta: 0, speedMult: 0.55 },
        5: { name: 'Bề Mặt Mịn / Ưu Tiên Phẳng', shortName: 'Mịn Phẳng (Cấp 5)', badge: 'Mịn Vừa', desc: 'Hạn chế sọc sóng, mép sắc nét, bám bước êm ái.', tiMult: 0.70, ipDelta: -1, vfDelta: -8, poDelta: 0, speedMult: 0.70 },
        6: { name: '⭐ Tiêu Chuẩn (Khuyên Dùng)', shortName: 'Tiêu Chuẩn (Cấp 6)', badge: 'Chuẩn Hãng', desc: 'Cân bằng tối ưu giữa tốc độ, độ nhám và độ bền dây Molypden.', tiMult: 1.0, ipDelta: 0, vfDelta: 0, poDelta: 0, speedMult: 1.0 },
        7: { name: 'Năng Suất Cao', shortName: 'Năng Suất (Cấp 7)', badge: 'Tốc Độ +1', desc: 'Tốc độ nhanh, ổn định cao, tiết kiệm dây và điện.', tiMult: 1.10, ipDelta: 0, vfDelta: +3, poDelta: 0, speedMult: 1.12 },
        8: { name: 'Siêu Năng Suất', shortName: 'Siêu Tốc (Cấp 8)', badge: 'Tốc Độ +2', desc: 'Bóc tách tối đa, bám tải nhanh, rút ngắn thời gian cắt.', tiMult: 1.25, ipDelta: +1, vfDelta: +5, poDelta: -1, speedMult: 1.25 },
        9: { name: 'Cường Lực Bóc Tách (Tốc độ +3)', shortName: 'Cường Lực (Cấp 9)', badge: 'Tốc Độ +3', desc: 'Tăng cường năng lượng xung ti, đẩy mạnh tiến bàn máy.', tiMult: 1.35, ipDelta: +1, vfDelta: +8, poDelta: -1, speedMult: 1.38 },
        10: { name: 'Tối Đa Công Suất (Tốc độ +4)', shortName: 'Max Công Suất (Cấp 10)', badge: 'Tốc Độ +4', desc: 'Mở tối đa kênh dòng MOSFET, bám tải Servo cực mạnh.', tiMult: 1.45, ipDelta: +1, vfDelta: +10, poDelta: -1, speedMult: 1.50 },
        11: { name: 'Cực Hạn Phá Thô (Tốc độ +5)', shortName: 'Cực Hạn Phá (Cấp 11)', badge: 'Cực Hạn Phá', desc: 'Khai thác kịch trần công suất tủ nguồn, phá thô siêu tốc kỷ lục cho phôi dày.', tiMult: 1.55, ipDelta: +1, vfDelta: +12, poDelta: -1, speedMult: 1.62 }
    };

    // STATE (Mặc định SCM420, 1 Pass, Chiến lược Cấp 6, H=40mm)
    const state = {
        material: 'SCM420',
        passCount: 1,
        strategyLevel: 6,
        thickness: 40,
        cutLength: 100,
        compactMetrics: true, // Mặc định thu gọn ký hiệu (Ẩn tên dài theo phương ngang)
        workshopExpanded: false, // Mặc định ẩn bảng thực tế xưởng
        isCustomUserEdited: false // Đánh dấu nếu người dùng đã tự chỉnh thông số nhập riêng
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

    // Custom analysis & Workshop elements
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
    const btnToggleCompact = document.getElementById('btn-toggle-compact');
    const compactText = document.getElementById('compact-text');
    const btnToggleWorkshop = document.getElementById('btn-toggle-workshop');
    const workshopBody = document.getElementById('workshop-body');
    const workshopToggleStatus = document.getElementById('workshop-toggle-status');
    const workshopTableElement = document.getElementById('workshop-table-element');
    const lectureKnowledgeBody = document.getElementById('lecture-knowledge-body');

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

    // Custom Analysis Button & Real-time Custom Inputs
    btnAnalyzeCustom.addEventListener('click', () => {
        runCustomAnalysis(true);
    });

    [customTiInput, customPoInput, customIpInput, customVoltInput, customVfInput, customWireInput].forEach(inp => {
        if (inp) {
            inp.addEventListener('input', () => {
                state.isCustomUserEdited = true;
                runCustomAnalysis(false);
            });
            inp.addEventListener('change', () => {
                state.isCustomUserEdited = true;
                runCustomAnalysis(false);
            });
        }
    });

    // Toggle Chế độ Ẩn/Hiện Ký hiệu viết tắt theo phương ngang
    if (btnToggleCompact) {
        btnToggleCompact.addEventListener('click', () => {
            state.compactMetrics = !state.compactMetrics;
            if (state.compactMetrics) {
                compactText.innerHTML = 'Ký hiệu viết tắt: <strong>BẬT</strong>';
                comparisonTableElement.classList.add('compact-mode');
            } else {
                compactText.innerHTML = 'Ký hiệu viết tắt: <strong>TẮT (Hiện đủ)</strong>';
                comparisonTableElement.classList.remove('compact-mode');
            }
            runCustomAnalysis(false);
        });
    }

    // Toggle Bảng Hiệu chỉnh Thực tế Xưởng
    if (btnToggleWorkshop && workshopBody) {
        btnToggleWorkshop.addEventListener('click', () => {
            state.workshopExpanded = !state.workshopExpanded;
            workshopBody.style.display = state.workshopExpanded ? 'block' : 'none';
            if (workshopToggleStatus) {
                workshopToggleStatus.textContent = state.workshopExpanded ? 'Hiện ▲' : 'Ẩn ▼';
            }
        });
    }

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

    // =========================================================================
    // 4. HỆ THỐNG TÍNH TOÁN HIỆU CHỈNH THỰC TẾ XƯỞNG ĐỘC LẬP (WORKSHOP ENGINE)
    // =========================================================================
    /**
     * NGUYÊN TẮC CỐT LÕI (NGUYÊN TẮC TRONG NGUYÊN TẮC):
     * 1. Tách biệt 100% không gian biến, cấu hình và hàm tính toán với hệ thống gốc.
     * 2. Sao chép nguyên bản thuật toán động lực học của Hãng làm nền tảng cơ sở ban đầu.
     * 3. Mọi hiệu chỉnh theo thực nghiệm xưởng (Ammeter 4A, phôi thực tế, bù mòn cữ)
     *    sau này sẽ chỉ thay đổi trong WORKSHOP_CALIBRATION_MODEL và calculateWorkshopEDM().
     */

    const WORKSHOP_CALIBRATION_MODEL = {
        ammeterCurrentFactor: 1.0,   // Khớp kim Ampe thực tế ~4A
        speedCalibrationFactor: 1.0,  // Hệ số tốc độ thực tế xưởng
        gapCompensation: 0.0,         // Bù trừ khe hở thực tế xưởng (mm)
        workpieceOffsetBias: 0.0,     // Sai số cữ gá đặt (mm)
        actualAmmeterReading: '≈ 3.8 - 4.2 A (Khớp kim đo tại xưởng)'
    };

    function calculateWorkshopEDM(state) {
        // Sao chép logic tính toán làm cơ sở phát triển độc lập
        const { material, strategyLevel, thickness, cutLength } = state;
        const H = thickness;
        const L = cutLength || 100;
        const isHard = material === 'SCM440';
        const isCopper = material === 'COPPER';
        const isAlu = material === 'ALUMINUM';
        const strat = STRATEGY_CONFIGS[strategyLevel] || STRATEGY_CONFIGS[6];

        let ti_w, Po_w, IP_w, Volt_w, VF_w, Wire_w;
        if (isAlu) {
            if (H <= 15) ti_w = 18;
            else if (H <= 30) ti_w = 22;
            else if (H <= 60) ti_w = 26;
            else if (H <= 100) ti_w = 32;
            else if (H <= 160) ti_w = 38;
            else if (H <= 250) ti_w = 44;
            else if (H <= 350) ti_w = 50;
            else ti_w = 56;
        } else if (isCopper) {
            if (H <= 15) ti_w = 26;
            else if (H <= 30) ti_w = 30;
            else if (H <= 60) ti_w = 36;
            else if (H <= 100) ti_w = 44;
            else if (H <= 160) ti_w = 52;
            else if (H <= 250) ti_w = 60;
            else if (H <= 350) ti_w = 64;
            else ti_w = 68;
        } else {
            if (H <= 15) ti_w = 20;
            else if (H <= 30) ti_w = 24;
            else if (H <= 60) ti_w = 32;
            else if (H <= 100) ti_w = 40;
            else if (H <= 160) ti_w = 48;
            else if (H <= 250) ti_w = 56;
            else if (H <= 350) ti_w = 60;
            else ti_w = 64;
        }

        if (H <= 20) Po_w = 5;
        else if (H <= 60) Po_w = 6;
        else if (H <= 120) Po_w = 7;
        else if (H <= 200) Po_w = 8;
        else if (H <= 300) Po_w = 9;
        else Po_w = 10;

        if (isAlu) Po_w += 2;
        if (isCopper) Po_w += 1;
        if (isHard) Po_w = Math.max(4, Po_w - 1);

        if (H <= 15) IP_w = 2;
        else if (H <= 40) IP_w = 3;
        else if (H <= 100) IP_w = 4;
        else if (H <= 200) IP_w = 5;
        else IP_w = 6;

        if (isCopper) IP_w = Math.min(6, IP_w + 1);

        Volt_w = H > 150 ? 'High' : (H <= 25 ? 'Low' : 'High');

        if (H <= 20) VF_w = 45;
        else if (H <= 60) VF_w = 55;
        else if (H <= 120) VF_w = 60;
        else if (H <= 200) VF_w = 65;
        else VF_w = 70;

        if (isAlu) VF_w += 5;
        if (isHard) VF_w += 5;

        Wire_w = 1;

        // Áp dụng tỷ lệ chiến lược
        ti_w = Math.max(1, Math.round(ti_w * strat.tiMult));
        Po_w = Math.max(2, Math.min(30, Po_w + strat.poDelta));
        IP_w = Math.max(1, Math.min(6, IP_w + strat.ipDelta));
        VF_w = Math.max(10, Math.min(100, VF_w + strat.vfDelta));

        let standardFc_baseline = 115;
        if (isAlu) standardFc_baseline = 155;
        else if (isCopper) standardFc_baseline = 95;
        else if (isHard) standardFc_baseline = 125;

        let heightEfficiency = 1.0;
        if (H > 100) {
            heightEfficiency = Math.max(0.70, 1.0 - (H - 100) * 0.0012);
        } else if (H < 25) {
            heightEfficiency = Math.max(0.75, 0.85 + H * 0.006);
        }

        // TÍNH TOÁN HIỆU CHỈNH RIÊNG THỰC TẾ XƯỞNG
        let speedArea_w = Math.round(standardFc_baseline * strat.speedMult * heightEfficiency * WORKSHOP_CALIBRATION_MODEL.speedCalibrationFactor);
        let feedRate_w = (speedArea_w / H);

        const toff_w = ti_w * Po_w;
        const cycle_w = ti_w + toff_w;
        const cycle_ms_w = (cycle_w / 1000).toFixed(3);
        const freq_hz_w = Math.round(1000000 / cycle_w);
        const freq_khz_w = (freq_hz_w / 1000).toFixed(2);
        const duty_factor_w = ((ti_w / cycle_w) * 100).toFixed(1);

        const u_arc_w = Volt_w === 'Low' ? 22 : 27;
        const i_peak_w = IP_w * 2.8;
        const we_mj_w = ((u_arc_w * i_peak_w * ti_w) / 1000).toFixed(2);
        const we_score_w = ti_w * IP_w;
        const power_watts_w = ((freq_hz_w * parseFloat(we_mj_w)) / 1000).toFixed(1);

        const sparkGap_w = (0.015 + 0.00035 * ti_w * (IP_w / 3) + (Volt_w === 'High' ? 0.004 : 0.001) + WORKSHOP_CALIBRATION_MODEL.gapCompensation).toFixed(3);
        const time_min_w = L / feedRate_w;

        let ra_w = isHard ? '2.4 - 2.8' : (isCopper ? '2.8 - 3.2' : (isAlu ? '3.0 - 3.5' : '2.8 - 3.2'));

        return {
            ti: ti_w,
            Po: Po_w,
            IP: IP_w,
            Voltage: Volt_w,
            VF: VF_w,
            Wire: Wire_w,
            toff: toff_w,
            cycle: cycle_w,
            cycle_ms: cycle_ms_w,
            freq_hz: freq_hz_w,
            freq_khz: freq_khz_w,
            duty_factor: duty_factor_w,
            we_mj: we_mj_w,
            we_score: we_score_w,
            power_watts: power_watts_w,
            speedArea: speedArea_w,
            feedRate: feedRate_w.toFixed(2),
            sparkGap: sparkGap_w,
            time_min: time_min_w,
            Ra: ra_w,
            ammeter: WORKSHOP_CALIBRATION_MODEL.actualAmmeterReading
        };
    }

    // ==========================================
    // 5. CUSTOM ANALYSIS ENGINE & BÀI GIẢNG TAB 2
    // ==========================================

    // Tự động điền Chế độ "Bề Mặt Mịn / Ưu Tiên Phẳng (Cấp 5/11)" làm mặc định cho ô nhập riêng
    function populateSmoothCustomDefaults(force = false) {
        if (!force && state.isCustomUserEdited) return;
        const smoothCalc = calculateEDM({ ...state, strategyLevel: 5 }); // Cấp 5/11: Bề Mặt Mịn / Ưu Tiên Phẳng
        const smoothRow = smoothCalc.rows[0];
        if (smoothRow) {
            customTiInput.value = smoothRow.ti;
            customPoInput.value = smoothRow.Po;
            customIpInput.value = smoothRow.IP;
            customVoltInput.value = smoothRow.Voltage;
            customVfInput.value = smoothRow.VF;
            customWireInput.value = smoothRow.Wire;
        }
    }

    function runCustomAnalysis(shouldScroll = false) {
        const c_ti = parseInt(customTiInput.value, 10) || 28;
        const c_po = parseInt(customPoInput.value, 10) || 7;
        const c_ip = parseInt(customIpInput.value, 10) || 4;
        const c_volt = customVoltInput.value;
        const c_vf = parseInt(customVfInput.value, 10) || 55;
        const c_wire = parseInt(customWireInput.value, 10) || 1;

        const H = state.thickness;
        const L = state.cutLength || 100;
        
        // 1. BASELINE CHUẨN CẤP 6 (CỐ ĐỊNH) - DÙNG ĐỂ TÍNH CÁC ĐẶC TÍNH VẬT LÝ TUYỆT ĐỐI CỦA CHẾ ĐỘ NHẬP
        // Giúp cột "Chế độ nhập" hoàn toàn cố định 100%, không bị nhảy số khi kéo thanh trượt chiến lược
        const baseCalc = calculateEDM({ ...state, strategyLevel: 6 });
        const baseRow = baseCalc.rows[0];

        const base_toff = baseRow.ti * baseRow.Po;
        const base_cycle = baseRow.ti + base_toff;
        const base_freq_hz = Math.round(1000000 / base_cycle);
        const base_u_arc = baseRow.Voltage === 'Low' ? 22 : 27;
        const base_i_peak = baseRow.IP * 2.8;
        const base_we_mj = (base_u_arc * base_i_peak * baseRow.ti) / 1000;
        const base_sparkGap = (0.015 + 0.00035 * baseRow.ti * (baseRow.IP / 3) + (baseRow.Voltage === 'High' ? 0.004 : 0.001)).toFixed(3);

        // 2. CHIẾN LƯỢC HÃNG HIỆN TẠI (THAY ĐỔI ĐỘNG THEO THANH TRƯỢT 11 CẤP ĐỘ)
        const activeStrat = STRATEGY_CONFIGS[state.strategyLevel] || STRATEGY_CONFIGS[6];
        const activeStratName = activeStrat.shortName || activeStrat.name;
        const stdCalc = calculateEDM(state); // Đồng bộ theo thanh trượt
        const stdRow = stdCalc.rows[0];

        // --- TÍNH TOÁN CÁC THÔNG SỐ VẬT LÝ CHẾ ĐỘ NHẬP ---
        // 1. Chu kỳ 1 xung T và Thời gian nghỉ Toff
        const c_toff = c_ti * c_po; // micro-seconds
        const c_cycle = c_ti + c_toff; // micro-seconds (Chu kỳ T)
        const c_cycle_ms = (c_cycle / 1000).toFixed(3); // ms

        // 2. Tần số phát xung (Frequency - f)
        const c_freq_hz = Math.round(1000000 / c_cycle);
        const c_freq_khz = (c_freq_hz / 1000).toFixed(2);

        // 3. Tỷ lệ mở van MOSFET (Duty Factor - η)
        const c_duty_factor = ((c_ti / c_cycle) * 100).toFixed(1);

        // 4. Năng lượng 1 tia đơn We
        const c_u_arc = c_volt === 'Low' ? 22 : 27;
        const c_i_peak = c_ip * 2.8; // Amperes
        const c_we_mj = ((c_u_arc * c_i_peak * c_ti) / 1000).toFixed(2); // mJ
        const c_we_score = c_ti * c_ip;

        // 5. Công suất phát trung bình 1s Ptb và dòng Ampe
        const c_power_watts = ((c_freq_hz * parseFloat(c_we_mj)) / 1000).toFixed(1); // Watts
        const c_power_score = Math.round(c_freq_hz * c_we_score);
        const c_i_tb = (c_i_peak * (parseFloat(c_duty_factor) / 100) * 0.75).toFixed(1);

        // 6. Năng suất cắt Fc, Tốc độ tiến bàn Ft (So với baseline Cấp 6 cố định)
        const f_ratio_base = c_freq_hz / base_freq_hz;
        const we_ratio_base = parseFloat(c_we_mj) / base_we_mj;
        const vf_factor_base = 1 + (c_vf - baseRow.VF) / 250;
        const mrr_ratio_custom = f_ratio_base * Math.pow(we_ratio_base, 1.25) * vf_factor_base;

        let c_speedArea = Math.round(baseRow.speedArea * mrr_ratio_custom);
        if (c_ti > 70 && H < 60) c_speedArea = Math.round(c_speedArea * 0.88);
        if (c_po < 4 && H > 80) c_speedArea = Math.round(c_speedArea * 0.85);

        const c_feedRate = (c_speedArea / H).toFixed(2);
        const c_time_min = L / parseFloat(c_feedRate);

        // 7. Khe hở tia lửa δ và Sai số kích thước Δ
        const c_sparkGap = (0.015 + 0.00035 * c_ti * (c_ip / 3) + (c_volt === 'High' ? 0.004 : 0.001)).toFixed(3);
        const gapDiff = Math.round((parseFloat(c_sparkGap) - parseFloat(base_sparkGap)) * 1000); // micron

        // --- TÍNH TOÁN CÁC THÔNG SỐ CHIẾN LƯỢC HÃNG (CỘT 3 - THEO THANH TRƯỢT) ---
        const std_toff = stdRow.ti * stdRow.Po;
        const std_cycle = stdRow.ti + std_toff;
        const std_cycle_ms = (std_cycle / 1000).toFixed(3);
        const std_freq_hz = Math.round(1000000 / std_cycle);
        const std_freq_khz = (std_freq_hz / 1000).toFixed(2);
        const std_duty_factor = ((stdRow.ti / std_cycle) * 100).toFixed(1);

        const std_u_arc = stdRow.Voltage === 'Low' ? 22 : 27;
        const std_i_peak = stdRow.IP * 2.8;
        const std_we_mj = ((std_u_arc * std_i_peak * stdRow.ti) / 1000).toFixed(2);
        const std_we_score = stdRow.ti * stdRow.IP;
        const std_power_watts = ((std_freq_hz * parseFloat(std_we_mj)) / 1000).toFixed(1);
        const std_power_score = Math.round(std_freq_hz * std_we_score);
        const std_feedRate = parseFloat(stdRow.feedRate).toFixed(2);
        const std_time_min = L / parseFloat(std_feedRate);
        const std_sparkGap = (0.015 + 0.00035 * stdRow.ti * (stdRow.IP / 3) + (stdRow.Voltage === 'High' ? 0.004 : 0.001)).toFixed(3);

        function formatTimeMinSec(mins) {
            if (!isFinite(mins) || mins <= 0) return '0.0 phút';
            const m = Math.floor(mins);
            const s = Math.round((mins - m) * 60);
            if (mins < 60) {
                return `${mins.toFixed(1)} phút (~${m}p ${s < 10 ? '0' + s : s}s)`;
            } else {
                const h = Math.floor(mins / 60);
                const remM = Math.round(mins % 60);
                return `${h} giờ ${remM} phút (~${mins.toFixed(0)}p)`;
            }
        }

        // Độ nhám Ra ước tính
        let c_ra_min, c_ra_max;
        if (c_we_score >= 280) {
            c_ra_min = 4.2; c_ra_max = 5.5;
        } else if (c_we_score >= 180) {
            c_ra_min = 3.4; c_ra_max = 4.2;
        } else if (c_we_score >= 100) {
            c_ra_min = 2.6; c_ra_max = 3.4;
        } else if (c_we_score >= 40) {
            c_ra_min = 1.8; c_ra_max = 2.5;
        } else {
            c_ra_min = 0.8; c_ra_max = 1.6;
        }

        // Danh mục Tiêu chí (Khi ở chế độ Ẩn: chỉ hiển thị ký hiệu ngắn gọn, loại bỏ giải thích trong ngoặc)
        const isCompact = state.compactMetrics;
        const m_ti = isCompact ? 'Ton' : 'Thời gian mở xung (Ton)';
        const m_po = isCompact ? 'Toff' : 'Thời gian nghỉ xả xỉ (Toff)';
        const m_cycle = isCompact ? 'T' : 'Tổng thời gian 1 chu kỳ (T = Ton + Toff)';
        const m_freq = isCompact ? 'f' : 'Tần số phát xung (Frequency - f)';
        const m_duty = isCompact ? 'η' : 'Tỷ lệ mở van MOSFET (Duty Factor - η)';
        const m_we = isCompact ? 'We' : 'NĂNG LƯỢNG 1 TIA ĐƠN (We ∝ Ton × IP)';
        const m_ptb = isCompact ? 'Ptb' : 'NĂNG LƯỢNG PHÁT TRONG 1S (Công suất trung bình Ptb)';
        const m_itb = isCompact ? 'Itb' : 'Dòng điện chỉ thị Ampe kế (Itb thực tế)';
        const m_fc = isCompact ? 'Fc' : 'Tốc độ cắt diện tích ước tính Fc';
        const m_ft = isCompact ? 'Ft' : `Tốc độ tiến bàn máy Ft (H=${H}mm)`;
        const m_time = isCompact ? 't' : `Thời gian gia công ước tính (Chu vi L=${L}mm)`;
        const m_ra = isCompact ? 'Ra' : 'Độ nhám bề mặt ước tính (Ra)';
        const m_gap = isCompact ? 'δ' : 'Khe hở phóng điện thực tế (δ)';
        const m_diff = isCompact ? 'Sai số' : 'Sai số kích thước (Dung sai Δ)';
        const m_wire = isCompact ? 'An toàn' : 'Mức độ mòn & Nguy cơ đứt dây';

        // 1. RENDER BẢNG SO SÁNH (CHẾ ĐỘ NHẬP vs CHIẾN LƯỢC HÃNG)
        comparisonTableElement.innerHTML = `
            <thead>
                <tr>
                    <th class="col-metric">${isCompact ? 'Tiêu chí' : 'Tiêu chí Công nghệ'}</th>
                    <th class="col-user">Chế độ nhập</th>
                    <th class="col-std">${activeStratName}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="col-metric"><strong>${m_ti}</strong></td>
                    <td class="col-user"><strong>${c_ti} μs</strong></td>
                    <td class="col-std"><strong>${stdRow.ti} μs</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_po}</strong></td>
                    <td class="col-user"><strong>${c_toff} μs</strong> (Hệ số ${c_po})</td>
                    <td class="col-std"><strong>${std_toff} μs</strong> (Hệ số ${stdRow.Po})</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_cycle}</strong></td>
                    <td class="col-user"><strong>${c_cycle} μs</strong> (${c_cycle_ms} ms)</td>
                    <td class="col-std"><strong>${std_cycle} μs</strong> (${std_cycle_ms} ms)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_freq}</strong></td>
                    <td class="col-user"><strong>${c_freq_khz} kHz</strong> (${c_freq_hz.toLocaleString()} xung/giây) ${c_freq_khz < 2.5 ? '<br><small style="color:var(--accent-amber)">⚠️ Quá thưa</small>' : ''}</td>
                    <td class="col-std"><strong>${std_freq_khz} kHz</strong> (${std_freq_hz.toLocaleString()} xung/giây)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_duty}</strong></td>
                    <td class="col-user"><strong>${c_duty_factor}%</strong> (1 mở : ${c_po} nghỉ)</td>
                    <td class="col-std"><strong>${std_duty_factor}%</strong> (1 mở : ${stdRow.Po} nghỉ)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_we}</strong></td>
                    <td class="col-user"><strong>${c_we_score} đv</strong> (≈ <strong>${c_we_mj} mJ</strong> ${c_we_score > std_we_score ? '⚡ Tia to hơn' : '🔹 Tia nhỏ mịn hơn'})</td>
                    <td class="col-std"><strong>${std_we_score} đv</strong> (≈ <strong>${std_we_mj} mJ</strong>)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_ptb}</strong></td>
                    <td class="col-user"><strong>${c_power_watts} W</strong> (≈ ${c_power_score.toLocaleString()} đv/s)</td>
                    <td class="col-std"><strong>${std_power_watts} W</strong> (≈ ${std_power_score.toLocaleString()} đv/s)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_itb}</strong></td>
                    <td class="col-user"><strong>≈ 3.8 - 4.2 A</strong> (Tủ công suất cao) <br><small style="color:var(--text-secondary)">≈ 1.3 - 1.5 A (Tủ tiêu chuẩn)</small></td>
                    <td class="col-std"><strong>≈ 3.8 - 4.2 A</strong> (Tủ công suất cao) <br><small style="color:var(--text-secondary)">≈ 1.3 - 1.5 A (Tủ tiêu chuẩn)</small></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_fc}</strong></td>
                    <td class="col-user"><strong>${c_speedArea} mm²/p</strong></td>
                    <td class="col-std"><strong>${stdRow.speedArea} mm²/p</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_ft}</strong></td>
                    <td class="col-user"><strong>${c_feedRate} mm/p</strong></td>
                    <td class="col-std"><strong>${std_feedRate} mm/p</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_time}</strong></td>
                    <td class="col-user"><strong>${formatTimeMinSec(c_time_min)}</strong></td>
                    <td class="col-std"><strong>${formatTimeMinSec(std_time_min)}</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_ra}</strong></td>
                    <td class="col-user">${c_ra_min} - ${c_ra_max} μm ${c_we_score < std_we_score ? '(Mịn bóng hơn)' : (c_we_score > std_we_score ? '(Rỗ thô hơn)' : '(Đều, mịn)')}</td>
                    <td class="col-std">${stdRow.Ra} μm (Đều, mịn)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_gap}</strong></td>
                    <td class="col-user">≈ ${c_sparkGap} mm</td>
                    <td class="col-std">≈ ${std_sparkGap} mm (Chuẩn)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_diff}</strong></td>
                    <td class="col-user">${gapDiff > 4 ? `⚠️ LẸM (ÂM) ${gapDiff} μm` : (gapDiff < -4 ? `⚠️ DƯ DƯƠNG ${Math.abs(gapDiff)} μm` : `✅ Chuẩn xác ${stdRow.tolerance}`)}</td>
                    <td class="col-std">✅ Chuẩn xác ${stdRow.tolerance}</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_wire}</strong></td>
                    <td class="col-user">${c_ti > 55 ? '🔴 DÂY MÒN RẤT NHANH' : (c_toff < 100 ? '⚠️ NGHẸT XỈ' : '🟢 An toàn, dây bền')}</td>
                    <td class="col-std">🟢 DÂY BỀN, TUỔI THỌ CAO</td>
                </tr>
            </tbody>
        `;

        // Render feedback nhận xét chuyên gia
        let feedbackHTML = `<span class="feedback-alert feedback-warn">🔍 ĐÁNH GIÁ KỸ THUẬT CHI TIẾT TỪ CHUYÊN GIA EDM:</span>`;
        feedbackHTML += `<ul style="padding-left:18px;margin-top:6px;">`;

        if (c_we_score < std_we_score) {
            feedbackHTML += `<li><strong class="feedback-good">✨ Chế độ Bề Mặt Mịn / Ưu Tiên Phẳng (Cấp 5/11):</strong> Năng lượng 1 tia đơn nhỏ (${c_we_mj} mJ) giúp tạo miệng hố rỗ nông và khít, mang lại độ bóng cao (Ra ≈ ${c_ra_min} - ${c_ra_max} μm), giảm độ mòn dây Molypden tối đa.</li>`;
        } else if (c_ti > 50 && H < 100) {
            feedbackHTML += `<li><strong>Xung Ton=${c_ti}μs cao:</strong> Năng lượng tia đơn lớn (${c_we_mj} mJ) tạo hố ăn mòn sâu, làm bề mặt thô nhám (Ra ≈ ${c_ra_min} - ${c_ra_max} μm) và tăng tốc độ mòn dây.</li>`;
        }

        if (gapDiff > 4) {
            feedbackHTML += `<li><strong>Cảnh báo sai lệch kích thước:</strong> Do khe hở tia lửa bị nở rộng thêm <strong>+${gapDiff} micron</strong>, nếu dùng Offset mặc định thì chi tiết sẽ bị <strong>LẸM PHÔI</strong>. Cần bù thêm Offset thành <strong>${(0.090 + parseFloat(c_sparkGap)).toFixed(3)} mm</strong>.</li>`;
        } else if (gapDiff < -4) {
            feedbackHTML += `<li><strong>Cảnh báo phôi dư dương:</strong> Do khe hở nhỏ hơn <strong>${Math.abs(gapDiff)} micron</strong>, phôi cắt ra sẽ hơi dày hơn kích thước danh định một chút (thích hợp để cạo sửa hoặc mài phẳng).</li>`;
        } else {
            feedbackHTML += `<li><strong class="feedback-good">Đánh giá chung:</strong> Bộ thông số bạn chọn rất cân đối, nằm an toàn trong dải gia công ổn định của máy.</li>`;
        }

        feedbackHTML += `</ul>`;
        analysisFeedbackBox.innerHTML = feedbackHTML;

        // 2. RENDER BẢNG HIỆU CHỈNH THỰC TẾ XƯỞNG ĐỘC LẬP (WORKSHOP CALIBRATION ENGINE)
        if (workshopTableElement) {
            const wData = calculateWorkshopEDM(state);
            workshopTableElement.innerHTML = `
                <thead>
                    <tr>
                        <th class="col-metric">${isCompact ? 'Tiêu chí' : 'Tiêu chí Công nghệ'}</th>
                        <th class="col-actual">Thông số Thực tế Xưởng của bạn (Workshop Actual)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="col-metric"><strong>${m_ti}</strong></td>
                        <td class="col-actual"><strong>${wData.ti} μs</strong></td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_po}</strong></td>
                        <td class="col-actual"><strong>${wData.toff} μs</strong> (Hệ số ${wData.Po})</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_cycle}</strong></td>
                        <td class="col-actual"><strong>${wData.cycle} μs</strong> (${wData.cycle_ms} ms)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_freq}</strong></td>
                        <td class="col-actual"><strong>${wData.freq_khz} kHz</strong> (${wData.freq_hz.toLocaleString()} xung/giây)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_duty}</strong></td>
                        <td class="col-actual"><strong>${wData.duty_factor}%</strong></td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_we}</strong></td>
                        <td class="col-actual"><strong>${wData.we_score} đv</strong> (≈ ${wData.we_mj} mJ)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_ptb}</strong></td>
                        <td class="col-actual"><strong>${wData.power_watts} W</strong></td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_itb}</strong></td>
                        <td class="col-actual"><strong>${wData.ammeter}</strong></td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_fc}</strong></td>
                        <td class="col-actual"><strong>${wData.speedArea} mm²/p</strong> (Năng suất thực tế)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_ft}</strong></td>
                        <td class="col-actual"><strong>${wData.feedRate} mm/p</strong></td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_time}</strong></td>
                        <td class="col-actual"><strong>${formatTimeMinSec(wData.time_min)}</strong></td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_ra}</strong></td>
                        <td class="col-actual">${wData.Ra} μm (Đạt độ phẳng bề mặt)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_gap}</strong></td>
                        <td class="col-actual">≈ ${wData.sparkGap} mm (Rãnh cắt thực tế)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_diff}</strong></td>
                        <td class="col-actual">✅ Chuẩn xác ${stdRow.tolerance}</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_wire}</strong></td>
                        <td class="col-actual">🟢 Dây Molypden chạy êm, xả xỉ đều</td>
                    </tr>
                </tbody>
            `;
        }

        // 3. RENDER BÀI GIẢNG ĐỘNG LỰC HỌC VÀO TAB 2 (KIẾN THỨC CHUYÊN SÂU EDM)
        if (lectureKnowledgeBody) {
            lectureKnowledgeBody.innerHTML = `
                <p style="margin-bottom: 12px; font-size: 13px; color: #cbd5e1;">
                    Dưới đây là giáo trình bài giảng trình bày toàn bộ cơ sở lý thuyết, bản chất vật lý và các phép tính toán từng bước từ <strong>Bước 1 đến Bước 7</strong> được tự động đồng bộ theo thông số bạn đang chọn:
                </p>

                <!-- BƯỚC 1: TOFF & CHU KỲ T -->
                <div class="lecture-step">
                    <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 1</span> Thời gian nghỉ xả xỉ (Toff) &amp; Tổng chu kỳ 1 xung (T)</div>
                    <p><strong>Bản chất:</strong> $Ton$ là thời gian mở van MOSFET. $Toff$ là thời gian ngắt điện để dung dịch khử ion và cuốn trôi mạt xỉ kim loại.</p>
                    <div class="lecture-formula-box">
                        • Toff (thực tế) = Ton × Toff(hệ số) (μs)<br>
                        • Tổng chu kỳ: T = Ton + Toff = Ton × (1 + Toff(hệ số)) (μs)
                    </div>
                    <div class="lecture-calc-grid">
                        <div class="lecture-calc-col custom-col">
                            <strong>Chế độ nhập:</strong><br>
                            • Toff = ${c_ti} × ${c_po} = <strong>${c_toff} μs</strong><br>
                            • Chu kỳ T = ${c_ti} + ${c_toff} = <strong>${c_cycle} μs</strong> (${c_cycle_ms} ms)
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            • Toff = ${stdRow.ti} × ${stdRow.Po} = <strong>${std_toff} μs</strong><br>
                            • Chu kỳ T = ${stdRow.ti} + ${std_toff} = <strong>${std_cycle} μs</strong> (${std_cycle_ms} ms)
                        </div>
                    </div>
                </div>

                <!-- BƯỚC 2: TẦN SỐ PHÁT XUNG f -->
                <div class="lecture-step">
                    <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 2</span> Tần số phát xung cao tần (Frequency - f)</div>
                    <p><strong>Ý nghĩa:</strong> Số lượng hạt tia lửa điện bộc phát qua khe hở cắt trong thời gian 1 giây.</p>
                    <div class="lecture-formula-box">
                        f = 10⁶ / T(μs) [Hz] = 1000 / T(μs) [kHz]
                    </div>
                    <div class="lecture-calc-grid">
                        <div class="lecture-calc-col custom-col">
                            <strong>Chế độ nhập:</strong><br>
                            f = 10⁶ / ${c_cycle} = <strong>${c_freq_khz} kHz</strong> (${c_freq_hz.toLocaleString()} tia/giây)
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            f = 10⁶ / ${std_cycle} = <strong>${std_freq_khz} kHz</strong> (${std_freq_hz.toLocaleString()} tia/giây)
                        </div>
                    </div>
                </div>

                <!-- BƯỚC 3: HỆ SỐ MỞ VAN MOSFET η -->
                <div class="lecture-step">
                    <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 3</span> Tỷ lệ mở van MOSFET (Duty Factor - η)</div>
                    <p><strong>Bản chất:</strong> Tỷ lệ phần trăm thời gian van công suất dẫn dòng điện thực tế trong 1 chu kỳ.</p>
                    <div class="lecture-formula-box">
                        η = (Ton / T) × 100% = [1 / (1 + Toff(hệ số))] × 100%
                    </div>
                    <div class="lecture-calc-grid">
                        <div class="lecture-calc-col custom-col">
                            <strong>Chế độ nhập:</strong><br>
                            η = (${c_ti} / ${c_cycle}) × 100% = <strong>${c_duty_factor}%</strong> (1 mở : ${c_po} nghỉ)
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            η = (${stdRow.ti} / ${std_cycle}) × 100% = <strong>${std_duty_factor}%</strong> (1 mở : ${stdRow.Po} nghỉ)
                        </div>
                    </div>
                </div>

                <!-- BƯỚC 4: NĂNG LƯỢNG 1 TIA ĐƠN We -->
                <div class="lecture-step">
                    <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 4</span> Năng lượng 1 tia lửa đơn (Single Spark Energy - We)</div>
                    <p><strong>Bản chất:</strong> Năng lượng nhiệt Joule giải phóng trong 1 xung hồ quang ngắn để làm nóng chảy kim loại phôi.</p>
                    <div class="lecture-formula-box">
                        • We = (Uarc × Ipeak × Ton) / 1000 (mJ)<br>
                        • Trong đó: Uarc = 27V (High) / 22V (Low); Ipeak = IP × 2.8A (mỗi kênh MOSFET)
                    </div>
                    <div class="lecture-calc-grid">
                        <div class="lecture-calc-col custom-col">
                            <strong>Chế độ nhập:</strong><br>
                            • Ipeak = ${c_ip} × 2.8A = ${c_i_peak} A<br>
                            • We = (${c_u_arc}V × ${c_i_peak}A × ${c_ti}μs) / 1000 = <strong>${c_we_mj} mJ</strong> (Điểm: ${c_we_score} đv)
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            • Ipeak = ${stdRow.IP} × 2.8A = ${std_i_peak} A<br>
                            • We = (${std_u_arc}V × ${std_i_peak}A × ${stdRow.ti}μs) / 1000 = <strong>${std_we_mj} mJ</strong> (Điểm: ${std_we_score} đv)
                        </div>
                    </div>
                </div>

                <!-- BƯỚC 5: CÔNG SUẤT ĐIỆN PHÁT TRONG 1S Ptb -->
                <div class="lecture-step">
                    <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 5</span> Năng lượng phát trong 1s (Công suất trung bình Ptb) &amp; Dòng Ampe</div>
                    <p><strong>Bản chất:</strong> Tổng năng lượng điện phát ra trên rãnh cắt mỗi giây và dòng điện trung bình chỉ thị trên kim đồng hồ cơ.</p>
                    <div class="lecture-formula-box">
                        • Công suất: Ptb = f(Hz) × [We(mJ) / 1000] = η × Uarc × Ipeak (Watts = J/s)<br>
                        • Dòng Ampe kế: Itb = Ipeak × η × k(phóng) (≈ 3.8 - 4.2A với tủ lớn; ≈ 1.3 - 1.5A với tủ nhỏ)
                    </div>
                    <div class="lecture-calc-grid">
                        <div class="lecture-calc-col custom-col">
                            <strong>Chế độ nhập:</strong><br>
                            • Công suất Ptb = ${c_freq_hz} × (${c_we_mj}/1000) = <strong>${c_power_watts} W</strong><br>
                            • Đồng hồ Ampe cơ: <strong>≈ 3.8 - 4.2 A</strong>
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            • Công suất Ptb = ${std_freq_hz} × (${std_we_mj}/1000) = <strong>${std_power_watts} W</strong><br>
                            • Đồng hồ Ampe cơ: <strong>≈ 3.8 - 4.2 A</strong>
                        </div>
                    </div>
                </div>

                <!-- BƯỚC 6: TỐC ĐỘ CẮT DIỆN TÍCH Fc & TỐC ĐỘ TIẾN BÀN Ft -->
                <div class="lecture-step">
                    <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 6</span> Tốc độ cắt diện tích (Fc), Tốc độ tiến bàn (Ft) &amp; Thời gian cắt</div>
                    <p><strong>Quy luật bóc phôi phi tuyến:</strong> Thể tích bóc phôi tăng theo hàm năng lượng nổ bốc hơi MRR ∝ f × (We)¹·²⁵.</p>
                    <div class="lecture-formula-box">
                        • Fc = Fc(std) × [(f / f_std) × (We / We_std)¹·²⁵] × K(VF) (mm²/phút)<br>
                        • Tốc độ tiến bàn: Ft = Fc / H (mm/phút)<br>
                        • Thời gian cắt chi tiết: t(cắt) = L / Ft (phút)
                    </div>
                    <div class="lecture-calc-grid">
                        <div class="lecture-calc-col custom-col">
                            <strong>Chế độ nhập:</strong><br>
                            • Tốc độ diện tích: Fc = <strong>${c_speedArea} mm²/p</strong><br>
                            • Tốc độ tiến bàn (H=${H}mm): Ft = ${c_speedArea}/${H} = <strong>${c_feedRate} mm/p</strong><br>
                            • Thời gian (L=${L}mm): t = ${L}/${c_feedRate} = <strong>${formatTimeMinSec(c_time_min)}</strong>
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            • Tốc độ diện tích: Fc = <strong>${stdRow.speedArea} mm²/p</strong><br>
                            • Tốc độ tiến bàn (H=${H}mm): Ft = ${stdRow.speedArea}/${H} = <strong>${std_feedRate} mm/p</strong><br>
                            • Thời gian (L=${L}mm): t = ${L}/${std_feedRate} = <strong>${formatTimeMinSec(std_time_min)}</strong>
                        </div>
                    </div>
                </div>

                <!-- BƯỚC 7: KHE HỞ PHÓNG ĐIỆN δ & BÙ DAO OFFSET -->
                <div class="lecture-step">
                    <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 7</span> Khe hở phóng tia lửa (δ) &amp; Sai số kích thước bù dao Offset</div>
                    <p><strong>Nguyên lý:</strong> Khe hở tia lửa δ quyết định giá trị bù bán kính dây Offset = Rdây + δ (với dây Φ0.18mm → Rdây = 0.090mm).</p>
                    <div class="lecture-formula-box">
                        • Khe hở tia lửa: δ = 0.015 + 0.00035 × Ton × (IP / 3) + ΔU (mm)<br>
                        • Sai lệch biên dạng: Δ = δ(thực) - δ(chuẩn) (micron)
                    </div>
                    <div class="lecture-calc-grid">
                        <div class="lecture-calc-col custom-col">
                            <strong>Chế độ nhập:</strong><br>
                            • Khe hở: δ ≈ <strong>${c_sparkGap} mm</strong><br>
                            • Đánh giá sai số: <strong>${gapDiff > 4 ? `Lẹm âm -${gapDiff} μm (-${(gapDiff/1000).toFixed(3)}mm)` : (gapDiff < -4 ? `Dư dương +${Math.abs(gapDiff)} μm` : 'Chuẩn xác ±0.005mm')}</strong><br>
                            • Độ nhám bề mặt: <strong>Ra ≈ ${c_ra_min} - ${c_ra_max} μm</strong>
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>Chế độ Standard:</strong><br>
                            • Khe hở: δ ≈ <strong>${std_sparkGap} mm</strong><br>
                            • Đánh giá sai số: <strong>✅ Chuẩn xác ±0.005 mm</strong><br>
                            • Độ nhám bề mặt: <strong>Ra ≈ ${stdRow.Ra} μm (Đều, mịn)</strong>
                        </div>
                    </div>
                </div>
            `;
        }

        // Luôn hiển thị khung so sánh mặc định
        analysisContainer.style.display = 'block';
        if (shouldScroll) {
            analysisContainer.scrollIntoView({ behavior: 'smooth' });
        }
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

        // Tự động nạp chế độ bề mặt mịn tương ứng vào ô nhập riêng & Chạy phân tích so sánh mặc định
        populateSmoothCustomDefaults();
        runCustomAnalysis(false);
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
    const CURRENT_VERSION = "2.9.7";

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

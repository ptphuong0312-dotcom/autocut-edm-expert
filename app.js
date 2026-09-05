/**
 * AUTOCUT EDM SERVO - PARAMETER CALCULATION & ANALYSIS ENGINE
 * Hệ thống tính toán, phân tích và tra cứu chế độ cắt EDM AutoCut Servo
 * © 2026 AutoCut EDM Master
 */

function initApp() {
    // 11 CẤP ĐỘ CHIẾN LƯỢC GIA CÔNG (TÂM ĐIỂM = CẤP 6: TIÊU CHUẨN)
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
        wsStrategyLevel: 4,
        thickness: 40,
        cutLength: 100,
        compactMetrics: true, // Mặc định thu gọn ký hiệu (Ẩn tên dài theo phương ngang)
        workshopExpanded: false, // Mặc định ẩn bảng thực tế xưởng
        isCustomUserEdited: false, // Đánh dấu nếu người dùng đã tự chỉnh thông số nhập riêng
        compareMode: 'custom' // 'custom' (Nhập Chế độ Riêng - Mặc định) | 'theory' (TT Lý thuyết theo tailieu.txt)
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

    // DOM Elements - Tab 2 (Workshop)
    const wsMaterialCards = document.querySelectorAll('#ws-material-grid .radio-card');
    const wsPassButtons = document.querySelectorAll('#ws-pass-selector .pass-btn');
    const wsStrategySlider = document.getElementById('ws-strategy-slider');
    const wsStrategyLevelBadge = document.getElementById('ws-strategy-level-badge');
    const wsStrategyNameDisplay = document.getElementById('ws-strategy-name-display');
    const wsStrategyBadgeDisplay = document.getElementById('ws-strategy-badge-display');
    const wsStrategyDescDisplay = document.getElementById('ws-strategy-desc-display');
    const wsThicknessInput = document.getElementById('ws-thickness-input');
    const wsThicknessSlider = document.getElementById('ws-thickness-slider');
    const wsQuickChips = document.querySelectorAll('#ws-quick-chips .chip');
    const wsCutLengthInput = document.getElementById('ws-cut-length');
    const wsTotalTimeText = document.getElementById('ws-total-time-text');
    const wsConfigSummary = document.getElementById('ws-config-summary');
    const wsTableBody = document.getElementById("ws-table-body");
    const wsBtnCopyTable = document.getElementById('ws-btn-copy-table');


    // Custom analysis & Mode switch elements
    const btnModeCustom = document.getElementById('btn-mode-custom');
    const btnModeTheory = document.getElementById('btn-mode-theory');
    const customModeHint = document.getElementById('custom-mode-hint');
    const analysisTableTitle = document.getElementById('analysis-table-title');
    const btnAnalyzeCustom = document.getElementById('btn-analyze-custom');
    const customTiInput = document.getElementById('custom-ti');
    const customPoInput = document.getElementById('custom-po');
    const customIpInput = document.getElementById('custom-ip');
    const customVoltInput = document.getElementById('custom-volt');
    const customVfInput = document.getElementById('custom-vf');
    const customWireInput = document.getElementById('custom-wire');
    const wsBtnAnalyzeCustom = document.getElementById('ws-btn-analyze-custom');
    const wsCustomTiInput = document.getElementById('ws-custom-ti');
    const wsCustomPoInput = document.getElementById('ws-custom-po');
    const wsCustomIpInput = document.getElementById('ws-custom-ip');
    const wsCustomVoltInput = document.getElementById('ws-custom-volt');
    const wsCustomVfInput = document.getElementById('ws-custom-vf');
    const wsCustomWireInput = document.getElementById('ws-custom-wire');
    const analysisContainer = document.getElementById('analysis-container');
    const comparisonTableElement = document.getElementById('comparison-table-element');
    const analysisFeedbackBox = document.getElementById('analysis-feedback-box');
    const wsAnalysisFeedbackBox = document.getElementById("ws-analysis-feedback-box");
    const btnToggleCompact = document.getElementById('btn-toggle-compact');
    const compactText = document.getElementById('compact-text');
    const btnToggleWorkshop = document.getElementById('btn-toggle-workshop');
    const workshopBody = document.getElementById('workshop-body');
    const workshopToggleStatus = document.getElementById('workshop-toggle-status');
    const workshopTableElement = document.getElementById('ws-comparison-table-element');
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
    // 2. LÝ THUYẾT ĐỒNG BỘ 2 CHIỀU (SYNC STATE TO UI)
    // ==========================================
    function syncAllInputsUI() {
        // Material
        const updateMat = (cards) => {
            cards.forEach(c => {
                const radio = c.querySelector('input[type="radio"]');
                if (radio.value === state.material) {
                    c.classList.add('active');
                    radio.checked = true;
                } else {
                    c.classList.remove('active');
                    radio.checked = false;
                }
            });
        };
        updateMat(materialCards);
        if (wsMaterialCards) updateMat(wsMaterialCards);

        // Pass
        const updatePass = (btns) => {
            btns.forEach(b => {
                if (parseInt(b.dataset.pass, 10) === state.passCount) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
        };
        updatePass(passButtons);
        if (wsPassButtons) updatePass(wsPassButtons);

        // Strategy
        if (strategySlider) strategySlider.value = state.strategyLevel;
        if (wsStrategySlider) wsStrategySlider.value = state.wsStrategyLevel;
        updateStrategyDisplay(state.strategyLevel);
        updateWsStrategyDisplay(state.wsStrategyLevel);

        // Thickness
        if (thicknessInput) thicknessInput.value = state.thickness;
        if (thicknessSlider) thicknessSlider.value = state.thickness;
        if (wsThicknessInput) wsThicknessInput.value = state.thickness;
        if (wsThicknessSlider) wsThicknessSlider.value = state.thickness;
        updateQuickChips(state.thickness);

        // Cut length
        if (cutLengthInput) cutLengthInput.value = state.cutLength;
        if (wsCutLengthInput) wsCutLengthInput.value = state.cutLength;
    }

    // ==========================================
    // 2. FORM EVENT LISTENERS
    // ==========================================

    function bindMaterialEvents(cards) {
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const radio = card.querySelector('input[type="radio"]');
                state.material = radio.value;
                syncAllInputsUI();
                render();
            });
        });
    }
    bindMaterialEvents(materialCards);
    if (wsMaterialCards) bindMaterialEvents(wsMaterialCards);

    function bindPassEvents(btns) {
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                state.passCount = parseInt(btn.dataset.pass, 10);
                syncAllInputsUI();
                render();
            });
        });
    }
    bindPassEvents(passButtons);
    if (wsPassButtons) bindPassEvents(wsPassButtons);

    function bindStrategyEvents(slider) {
        if (!slider) return;
        slider.addEventListener('input', (e) => {
            state.strategyLevel = parseInt(e.target.value, 10);
            syncAllInputsUI();
            render();
        });
    }
    bindStrategyEvents(strategySlider);
    
    if (wsStrategySlider) {
        wsStrategySlider.addEventListener('input', (e) => {
            state.wsStrategyLevel = parseInt(e.target.value);
            updateWsStrategyDisplay(state.wsStrategyLevel);
            render();
        });
    }


    
    function updateWsStrategyDisplay(lvl) {
        const conf = WS_STRATEGY_CONFIGS[lvl] || WS_STRATEGY_CONFIGS[4];
        if (wsStrategyLevelBadge) wsStrategyLevelBadge.textContent = `${conf.name} (${lvl})`;
        if (wsStrategyNameDisplay) wsStrategyNameDisplay.textContent = conf.name;
        if (wsStrategyBadgeDisplay) wsStrategyBadgeDisplay.textContent = conf.badge;
        if (wsStrategyDescDisplay) wsStrategyDescDisplay.textContent = conf.desc;
    }

    function updateStrategyDisplay(lvl) {
        const conf = STRATEGY_CONFIGS[lvl] || STRATEGY_CONFIGS[6];
        if (strategyLevelBadge) strategyLevelBadge.textContent = `${conf.name} (Cấp ${lvl}/11)`;
        if (strategyNameDisplay) strategyNameDisplay.textContent = conf.name;
        if (strategyBadgeDisplay) strategyBadgeDisplay.textContent = conf.badge;
        if (strategyDescDisplay) strategyDescDisplay.textContent = conf.desc;
        
        }

    function bindThicknessSliderEvents(slider) {
        if (!slider) return;
        slider.addEventListener('input', (e) => {
            let val = parseInt(e.target.value, 10);
            val = Math.round(val / 5) * 5;
            state.thickness = Math.max(5, Math.min(500, val));
            syncAllInputsUI();
            render();
        });
    }
    bindThicknessSliderEvents(thicknessSlider);
    if (wsThicknessSlider) bindThicknessSliderEvents(wsThicknessSlider);

    function bindThicknessInputEvents(inp) {
        if (!inp) return;
        inp.addEventListener('change', (e) => {
            let val = parseInt(e.target.value, 10);
            if (isNaN(val)) val = 40;
            val = Math.round(val / 5) * 5;
            state.thickness = Math.max(5, Math.min(500, val));
            syncAllInputsUI();
            render();
        });
    }
    bindThicknessInputEvents(thicknessInput);
    if (wsThicknessInput) bindThicknessInputEvents(wsThicknessInput);

    function updateQuickChips(currentH) {
        const doUpdate = (chips) => {
            chips.forEach(chip => {
                if (parseInt(chip.dataset.h, 10) === currentH) {
                    chip.classList.add('active');
                } else {
                    chip.classList.remove('active');
                }
            });
        };
        if (quickChips) doUpdate(quickChips);
        if (wsQuickChips) doUpdate(wsQuickChips);
    }

    function bindQuickChipsEvents(chips) {
        if (!chips) return;
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                state.thickness = parseInt(chip.dataset.h, 10);
                syncAllInputsUI();
                render();
            });
        });
    }
    bindQuickChipsEvents(quickChips);
    if (wsQuickChips) bindQuickChipsEvents(wsQuickChips);

    function bindCutLengthEvents(inp) {
        if (!inp) return;
        inp.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val) || val <= 0) val = 100;
            state.cutLength = val;
            syncAllInputsUI();
            render();
        });
    }
    bindCutLengthEvents(cutLengthInput);
    if (wsCutLengthInput) bindCutLengthEvents(wsCutLengthInput);

    // Modal Guide
    if (btnShowGuide) btnShowGuide.addEventListener('click', () => {
        guideModal.classList.add('active');
    });

    if (btnCloseModal) btnCloseModal.addEventListener('click', () => {
        guideModal.classList.remove('active');
    });

    if (guideModal) guideModal.addEventListener('click', (e) => {
        if (e.target === guideModal) {
            guideModal.classList.remove('active');
        }
    });

    // Print
    if (btnPrint) btnPrint.addEventListener('click', () => {
        window.print();
    });

    // Copy Table (Tab 1 & Tab 2)
    if (btnCopyTable) btnCopyTable.addEventListener('click', () => {
        copyTableToClipboard();
    });
    if (wsBtnCopyTable) wsBtnCopyTable.addEventListener('click', () => {
        copyWorkshopTableToClipboard();
    });

    // Mode Switch Buttons: "Nhập Chế độ Riêng" & "TT Lý thuyết"
    if (btnModeCustom) {
        btnModeCustom.addEventListener('click', () => {
            state.compareMode = 'custom';
            runCustomAnalysis(false);
        });
    }

    if (btnModeTheory) {
        btnModeTheory.addEventListener('click', () => {
            state.compareMode = 'theory';
            runCustomAnalysis(false);
        });
    }

    // Custom Analysis Button & Real-time Custom Inputs
    if (btnAnalyzeCustom) btnAnalyzeCustom.addEventListener('click', () => {
        state.isCustomUserEdited = true;
        state.compareMode = 'custom';
        runCustomAnalysis(true);
    });

    function syncCustomInputs(sourceTab) {
        if (sourceTab === 'tab1') {
            if (wsCustomTiInput) wsCustomTiInput.value = customTiInput.value;
            if (wsCustomPoInput) wsCustomPoInput.value = customPoInput.value;
            if (wsCustomIpInput) wsCustomIpInput.value = customIpInput.value;
            if (wsCustomVoltInput) wsCustomVoltInput.value = customVoltInput.value;
            if (wsCustomVfInput) wsCustomVfInput.value = customVfInput.value;
            if (wsCustomWireInput) wsCustomWireInput.value = customWireInput.value;
        } else {
            if (customTiInput) customTiInput.value = wsCustomTiInput.value;
            if (customPoInput) customPoInput.value = wsCustomPoInput.value;
            if (customIpInput) customIpInput.value = wsCustomIpInput.value;
            if (customVoltInput) customVoltInput.value = wsCustomVoltInput.value;
            if (customVfInput) customVfInput.value = wsCustomVfInput.value;
            if (customWireInput) customWireInput.value = wsCustomWireInput.value;
        }
    }

    [customTiInput, customPoInput, customIpInput, customVoltInput, customVfInput, customWireInput].forEach(inp => {
        if (inp) {
            const handler = () => {
                syncCustomInputs('tab1');
                state.isCustomUserEdited = true;
                state.compareMode = 'custom';
                runCustomAnalysis(false);
            };
            inp.addEventListener('input', handler);
            inp.addEventListener('change', handler);
        }
    });

    [wsCustomTiInput, wsCustomPoInput, wsCustomIpInput, wsCustomVoltInput, wsCustomVfInput, wsCustomWireInput].forEach(inp => {
        if (inp) {
            const handler = () => {
                syncCustomInputs('tab2');
                state.isCustomUserEdited = true;
                state.compareMode = 'custom';
                runCustomAnalysis(false);
            };
            inp.addEventListener('input', handler);
            inp.addEventListener('change', handler);
        }
    });

    if (wsBtnAnalyzeCustom) {
        wsBtnAnalyzeCustom.addEventListener('click', () => {
            state.isCustomUserEdited = true;
            state.compareMode = 'custom';
            runCustomAnalysis(true);
        });
    }

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
        // PASS VARIABLES DECLARATION
        // ----------------------------------------------------
        let ti_1, Po_1, IP_1, Volt_1, VF_1, Wire_1, Offset_1, SpeedArea_1, Ra_1;
        let ti_2, Po_2, IP_2, Volt_2, VF_2, Wire_2, remain_2;
        let ti_3, Po_3, IP_3, Volt_3, VF_3, Wire_3, remain_3;
        let ti_4, Po_4, IP_4, Volt_4, VF_4, Wire_4, remain_4;
        let ti_5, Po_5, IP_5, Volt_5, VF_5, Wire_5, remain_5;
        let ti_6, Po_6, IP_6, Volt_6, VF_6, Wire_6, remain_6;

        // ----------------------------------------------------
        // PASS 1: ROUGH CUT (CẮT PHÁ THÔ)
        // ----------------------------------------------------

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
            else if (H <= 100) ti_1 = isHard ? 48 : 44;
            else if (H <= 160) ti_1 = isHard ? 56 : 52;
            else if (H <= 250) ti_1 = isHard ? 64 : 60;
            else if (H <= 350) ti_1 = isHard ? 68 : 64;
            else ti_1 = isHard ? 72 : 68;
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
            const minTi1 = passCount > 1 ? 10 : 6;
            const maxTiAllowed = H > 160 ? 120 : (H > 100 ? 100 : 80);
            ti_1 = Math.max(minTi1, Math.min(maxTiAllowed, Math.round(ti_1 * strat.tiMult)));
            IP_1 = Math.max(passCount > 1 ? 2 : 1, Math.min(6, IP_1 + strat.ipDelta));
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
            ti_2 = H <= 60 ? 16 : (H <= 150 ? 20 : 24);
            Po_2 = isHard ? 4 : 5;
            if (H > 100) Po_2 += 1;
            IP_2 = H <= 60 ? 2 : 3;
            Volt_2 = H <= 60 ? 'Low' : 'High';
            VF_2 = isHard ? 45 : 40;
            Wire_2 = 2;
            remain_2 = H <= 20 ? 0.018 : (H <= 60 ? 0.022 : (H <= 120 ? 0.024 : 0.026));
            
            // Đồng bộ bậc thang Pass 2 theo Chiến lược (Đảm bảo P2 luôn nhỏ hơn P1)
            if (strategyLevel !== 6) {
                if (strategyLevel <= 5) {
                    const ti2Scale = 0.45 + 0.55 * strat.tiMult;
                    ti_2 = Math.max(4, Math.min(ti_1 - 2, Math.round(ti_2 * ti2Scale)));
                    IP_2 = Math.min(IP_1, Math.max(1, strategyLevel <= 3 ? 1 : 2));
                    VF_2 = Math.max(25, VF_2 - (6 - strategyLevel) * 2);
                    remain_2 = Math.max(0.012, remain_2 - 0.002);
                } else {
                    ti_2 = Math.min(ti_1 - 4, Math.round(ti_2 * (0.8 + 0.2 * strat.tiMult)));
                }
            }
            // Khóa bảo vệ nghiêm ngặt: ti_2 < ti_1 và IP_2 <= IP_1
            if (ti_2 >= ti_1) ti_2 = Math.max(4, ti_1 - 2);
            if (IP_2 > IP_1) IP_2 = IP_1;

            const feedRate_2 = feedRate_1 * 1.85 * strategySpeedMult;
            const speedArea_2 = Math.round(feedRate_2 * H);

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
            ti_3 = H <= 60 ? 6 : (H <= 150 ? 8 : 10);
            Po_3 = isHard ? 8 : 10; if (H > 100) Po_3 += 2;
            IP_3 = H <= 60 ? 1 : 2;
            Volt_3 = 'Low';
            VF_3 = isHard ? 35 : 30;
            Wire_3 = 3;
            remain_3 = H <= 20 ? 0.008 : (H <= 60 ? 0.010 : 0.012);
            
            // Đồng bộ bậc thang Pass 3 theo Chiến lược (Đảm bảo P3 luôn nhỏ hơn P2)
            if (strategyLevel <= 5) {
                ti_3 = Math.max(2, Math.min(ti_2 - 2, Math.round(ti_3 * (0.5 + 0.5 * strat.tiMult))));
                IP_3 = 1;
                VF_3 = Math.max(20, VF_3 - (6 - strategyLevel) * 2);
                remain_3 = Math.max(0.005, remain_3 - 0.001);
            }
            // Khóa bảo vệ nghiêm ngặt: ti_3 < ti_2 và IP_3 <= IP_2
            if (ti_3 >= ti_2) ti_3 = Math.max(2, ti_2 - 2);
            if (IP_3 > IP_2) IP_3 = IP_2;

            const feedRate_3 = feedRate_1 * 2.30 * strategySpeedMult;
            const speedArea_3 = Math.round(feedRate_3 * H);

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
            ti_4 = H <= 60 ? 2 : (H <= 150 ? 3 : 4);
            Po_4 = isHard ? 12 : 15;
            IP_4 = 1;
            Volt_4 = 'Low';
            VF_4 = isHard ? 25 : 22;
            Wire_4 = 3;
            remain_4 = H <= 20 ? 0.004 : (H <= 60 ? 0.005 : 0.006);
            
            // Khóa bảo vệ nghiêm ngặt: ti_4 < ti_3
            if (ti_4 >= ti_3) ti_4 = Math.max(1, ti_3 - 1);
            if (IP_4 > IP_3) IP_4 = IP_3;

            const feedRate_4 = feedRate_1 * 2.50 * strategySpeedMult;
            const speedArea_4 = Math.round(feedRate_4 * H);

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
            ti_5 = H <= 80 ? 1 : 2;
            Po_5 = isHard ? 15 : 20;
            IP_5 = 1;
            Volt_5 = 'Low';
            VF_5 = isHard ? 20 : 18;
            Wire_5 = 3;
            remain_5 = H <= 60 ? 0.002 : 0.003;
            
            // Khóa bảo vệ nghiêm ngặt: ti_5 < ti_4
            if (ti_5 >= ti_4) ti_5 = Math.max(1, ti_4 - 1);
            if (IP_5 > IP_4) IP_5 = IP_4;

            const feedRate_5 = feedRate_1 * 2.65 * strategySpeedMult;
            const speedArea_5 = Math.round(feedRate_5 * H);

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
            ti_6 = 1;
            Po_6 = isHard ? 20 : 25;
            IP_6 = 1;
            Volt_6 = 'Low';
            VF_6 = 15;
            Wire_6 = 3;
            remain_6 = 0.001;
            
            // Khóa bảo vệ nghiêm ngặt: ti_6 <= ti_5
            if (ti_6 > ti_5) ti_6 = ti_5;
            if (IP_6 > IP_5) IP_6 = IP_5;

            const feedRate_6 = feedRate_1 * 2.70 * strategySpeedMult;
            const speedArea_6 = Math.round(feedRate_6 * H);

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

        if (H >= 350) {
            notices.push(`Phôi siêu dày H=${H}mm: Ton được khống chế trần an toàn ở 68μs và Po=${rows[0].Po} để bảo vệ dây Molypden chống đứt và ngăn phình rãnh cắt dạng thùng rượu. Nếu cần bóc tách cực đại (Ton 80-100μs), chuyển sang Cấp 10-11 kèm dây mới 100% và nước 1:8.`);
        } else if (H > 150) {
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
    // 4. HỆ THỐNG THƯ VIỆN THỰC NGHIỆM & TÍNH TOÁN HIỆU CHỈNH XƯỞNG ĐỘC LẬP
    // =========================================================================
    /**
     * NGUYÊN TẮC CỐT LÕI (NGUYÊN TẮC TRONG NGUYÊN TẮC):
     * 1. Tách biệt 100% không gian biến, cấu hình và hàm tính toán với hệ thống chuẩn Hãng.
     * 2. Áp dụng 100% các phương trình vật lý nhiệt điện học gốc (T, f, eta, We, Ptb, Fc, Ft, t, delta, Offset)
     *    kết hợp với bộ hệ số hiệu chuẩn thực nghiệm xưởng (k_ampe, Cm_xưởng, KerfB_xưởng)
     *    để tính toán tự động khớp chính xác với số liệu thực đo tại xưởng.
     * 3. Cơ sở dữ liệu thư viện thực nghiệm WORKSHOP_EMPIRICAL_LIBRARY lưu trữ các bộ dữ liệu đo thực tế.
     */

    const WORKSHOP_EMPIRICAL_LIBRARY = [
        {
                "id": "STT 1",
                "name": "SCM440 (28-32HRC) | H=30mm | 1 Lần",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 30,
                "cutLength": "30mm",
                "passCount": 1,
                "params": {
                        "ti": 32,
                        "Po": 5,
                        "IP": 4,
                        "wire": 1,
                        "Voltage": "High",
                        "VF": 65,
                        "maxSpeed": "200Hz"
                },
                "measured": {
                        "totalTimeStr": "8p40'",
                        "ammeterA": "4,45A - 4,5A",
                        "measuredSpeed": "165 - 175",
                        "enteredOffset": 0.115,
                        "standardOffset": 0.098,
                        "sparkGap": "0.008",
                        "tolerance": "Chày to hơn lập trình 0.034mm"
                },
                "notes": "Nhập test 0.115mm -> Cắt lấy chày: To hơn lập trình 0.034mm (bù mỗi bên 0.017mm). OFFSET CHUẨN HIỆU CHỈNH = 0.115 - 0.017 = 0.098mm (Khe hở δ = 0.008mm)."
        },
        {
                "id": "STT 2",
                "name": "SCM440 (28-32HRC) | H=40mm | 1 Lần",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 40,
                "cutLength": "30mm",
                "passCount": 1,
                "params": {
                        "ti": 36,
                        "Po": 5,
                        "IP": 4,
                        "wire": 1,
                        "Voltage": "High",
                        "VF": 65,
                        "maxSpeed": "180Hz"
                },
                "measured": {
                        "totalTimeStr": "9p36'",
                        "ammeterA": "4,35A - 4,4A",
                        "measuredSpeed": "130 - 140",
                        "enteredOffset": 0.115,
                        "standardOffset": 0.098,
                        "sparkGap": "0.008",
                        "tolerance": "Chày to hơn lập trình 0.034mm"
                },
                "notes": "Nhập test 0.115mm -> Cắt lấy chày: To hơn lập trình 0.034mm (bù mỗi bên 0.017mm). OFFSET CHUẨN HIỆU CHỈNH = 0.115 - 0.017 = 0.098mm (Khe hở δ = 0.008mm)."
        },
        {
                "id": "STT 3",
                "name": "SCM420 (HB<200) | H=63mm | 1 Lần",
                "materialName": "SCM420 (HB<200)",
                "thickness": 63,
                "cutLength": "27mm",
                "passCount": 1,
                "params": {
                        "ti": 44,
                        "Po": 7,
                        "IP": 5,
                        "wire": 1,
                        "Voltage": "High",
                        "VF": 55,
                        "maxSpeed": "150Hz"
                },
                "measured": {
                        "totalTimeStr": "14p20'",
                        "ammeterA": "4,1A - 4,2A",
                        "measuredSpeed": "75 - 85",
                        "enteredOffset": 0.118,
                        "standardOffset": 0.095,
                        "sparkGap": "0.005",
                        "tolerance": "Chày to hơn lập trình 0.046mm"
                },
                "notes": "Nhập test 0.118mm -> Cắt lấy chày: To hơn lập trình 0.046mm (bù mỗi bên 0.023mm). OFFSET CHUẨN HIỆU CHỈNH = 0.118 - 0.023 = 0.095mm (Khe hở δ = 0.005mm)."
        },
        {
                "id": "STT 4",
                "name": "SCM440 (28-32HRC) | H=12mm | 1 Lần (Chuẩn Vàng)",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 12,
                "cutLength": "",
                "passCount": 1,
                "params": {
                        "ti": 20,
                        "Po": 7,
                        "IP": 2,
                        "wire": 2,
                        "Voltage": "Low",
                        "VF": 50,
                        "maxSpeed": "200Hz"
                },
                "measured": {
                        "totalTimeStr": "",
                        "ammeterA": "",
                        "measuredSpeed": null,
                        "enteredOffset": 0.105,
                        "standardOffset": 0.105,
                        "sparkGap": "0.015",
                        "tolerance": "Chuẩn tuyệt đối"
                },
                "notes": "Nhập test 0.105mm -> Cắt lấy chày: Kích thước offset chuẩn luôn! OFFSET CHUẨN = 0.105mm (Khe hở δ = 0.015mm)."
        },
        {
                "id": "STT 5",
                "name": "SCM420 (HB<200) | H=45mm | 1 Lần (Chuẩn Vàng)",
                "materialName": "SCM420 (HB<200)",
                "thickness": 45,
                "cutLength": "",
                "passCount": 1,
                "params": {
                        "ti": 50,
                        "Po": 7,
                        "IP": 3,
                        "wire": 1,
                        "Voltage": "Low",
                        "VF": 50,
                        "maxSpeed": "150Hz"
                },
                "measured": {
                        "totalTimeStr": "",
                        "ammeterA": "",
                        "measuredSpeed": null,
                        "enteredOffset": 0.105,
                        "standardOffset": 0.105,
                        "sparkGap": "0.015",
                        "tolerance": "Chuẩn tuyệt đối"
                },
                "notes": "Nhập test 0.105mm -> Cắt lấy chày: Kích thước offset chuẩn luôn! OFFSET CHUẨN = 0.105mm (Khe hở δ = 0.015mm)."
        },
        {
                "id": "STT 6",
                "name": "SCM440 (28-32HRC) | H=68mm | 1 Lần (Chuẩn Vàng)",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 68,
                "cutLength": "",
                "passCount": 1,
                "params": {
                        "ti": 70,
                        "Po": 7,
                        "IP": 3,
                        "wire": 1,
                        "Voltage": "Low",
                        "VF": 50,
                        "maxSpeed": "100Hz"
                },
                "measured": {
                        "totalTimeStr": "",
                        "ammeterA": "",
                        "measuredSpeed": null,
                        "enteredOffset": 0.097,
                        "standardOffset": 0.097,
                        "sparkGap": "0.007",
                        "tolerance": "Chuẩn tuyệt đối"
                },
                "notes": "Nhập test 0.097mm -> Cắt lấy chày: Kích thước offset chuẩn luôn! OFFSET CHUẨN = 0.097mm (Khe hở δ = 0.007mm)."
        },
        {
                "id": "STT 7",
                "name": "SCM420 (HB<200) | H=140mm | 1 Lần (Chuẩn Vàng)",
                "materialName": "SCM420 (HB<200)",
                "thickness": 140,
                "cutLength": "",
                "passCount": 1,
                "params": {
                        "ti": 120,
                        "Po": 8,
                        "IP": 5,
                        "wire": 1,
                        "Voltage": "High",
                        "VF": 55,
                        "maxSpeed": "50Hz"
                },
                "measured": {
                        "totalTimeStr": "",
                        "ammeterA": "",
                        "measuredSpeed": null,
                        "enteredOffset": 0.095,
                        "standardOffset": 0.095,
                        "sparkGap": "0.005",
                        "tolerance": "Chuẩn tuyệt đối"
                },
                "notes": "Nhập test 0.095mm -> Cắt lấy chày: Kích thước offset chuẩn luôn! OFFSET CHUẨN = 0.095mm (Khe hở δ = 0.005mm)."
        },
        {
                "id": "STT 8",
                "name": "SCM420 (HB<200) | H=160mm | 1 Lần (Chuẩn Vàng)",
                "materialName": "SCM420 (HB<200)",
                "thickness": 160,
                "cutLength": "",
                "passCount": 1,
                "params": {
                        "ti": 120,
                        "Po": 8,
                        "IP": 5,
                        "wire": 1,
                        "Voltage": "High",
                        "VF": 55,
                        "maxSpeed": "50Hz"
                },
                "measured": {
                        "totalTimeStr": "",
                        "ammeterA": "",
                        "measuredSpeed": null,
                        "enteredOffset": 0.11,
                        "standardOffset": 0.11,
                        "sparkGap": "0.020",
                        "tolerance": "Chuẩn tuyệt đối"
                },
                "notes": "Nhập test 0.110mm -> Cắt lấy chày: Kích thước offset chuẩn luôn! OFFSET CHUẨN = 0.110mm (Khe hở δ = 0.020mm)."
        },
        {
                "id": "STT 10",
                "name": "SCM420 (HB<200) | H=140mm | 1 Lần (Thử 1)",
                "materialName": "SCM420 (HB<200)",
                "thickness": 140,
                "cutLength": "",
                "passCount": 1,
                "params": {
                        "ti": 52,
                        "Po": 8,
                        "IP": 6,
                        "wire": 1,
                        "Voltage": "High",
                        "VF": 50,
                        "maxSpeed": "100Hz"
                },
                "measured": {
                        "totalTimeStr": "",
                        "ammeterA": "",
                        "measuredSpeed": null,
                        "speedNote": "không cắt được",
                        "enteredOffset": 0.12,
                        "standardOffset": null,
                        "sparkGap": null,
                        "tolerance": "Không cắt được"
                },
                "notes": "Không cắt được: Ton=52 quá nhỏ không duy trì được hồ quang ổn định cho H=140mm."
        },
        {
                "id": "STT 11",
                "name": "SCM420 (HB<200) | H=140mm | 1 Lần (Thử 2)",
                "materialName": "SCM420 (HB<200)",
                "thickness": 140,
                "cutLength": "",
                "passCount": 1,
                "params": {
                        "ti": 80,
                        "Po": 8,
                        "IP": 6,
                        "wire": 1,
                        "Voltage": "High",
                        "VF": 50,
                        "maxSpeed": "100Hz"
                },
                "measured": {
                        "totalTimeStr": "",
                        "ammeterA": "",
                        "measuredSpeed": null,
                        "speedNote": "không cắt được",
                        "enteredOffset": 0.12,
                        "standardOffset": null,
                        "sparkGap": null,
                        "tolerance": "Không cắt được"
                },
                "notes": "Không cắt được: Ton=80 vẫn chưa đủ bù suy hao năng lượng trên khoảng cách 140mm."
        },
        {
                "id": "STT 12",
                "name": "SCM420 (HB<200) | H=140mm | 1 Lần (Thử 3)",
                "materialName": "SCM420 (HB<200)",
                "thickness": 140,
                "cutLength": "28,4mm",
                "passCount": 1,
                "params": {
                        "ti": 100,
                        "Po": 9,
                        "IP": 6,
                        "wire": 1,
                        "Voltage": "High",
                        "VF": 60,
                        "maxSpeed": "100Hz"
                },
                "measured": {
                        "totalTimeStr": "36p",
                        "ammeterA": "3,7A - 3,8A",
                        "measuredSpeed": "30 - 40",
                        "enteredOffset": 0.12,
                        "standardOffset": 0.102,
                        "sparkGap": "0.012",
                        "tolerance": "Chày to hơn lập trình 0.036mm"
                },
                "notes": "Nhập test 0.120mm -> Chày to hơn 0.036mm. OFFSET CHUẨN HIỆU CHỈNH = 0.120 - 0.018 = 0.102mm (Khe hở δ = 0.012mm)."
        },
        {
                "id": "STT 14",
                "name": "SCM440 (28-32HRC) | H=300mm | Giai đoạn 2",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 300,
                "cutLength": "76,1mm",
                "passCount": 1,
                "params": {
                        "ti": 120,
                        "Po": 9,
                        "IP": 6,
                        "wire": 1,
                        "Voltage": "High",
                        "VF": 65,
                        "maxSpeed": "50Hz"
                },
                "measured": {
                        "totalTimeStr": "3h",
                        "ammeterA": "3,7A - 3,9A",
                        "measuredSpeed": "12 - 20",
                        "enteredOffset": 0.12,
                        "standardOffset": 0.115,
                        "sparkGap": "0.025",
                        "tolerance": "Cối lớn hơn lập trình 0.010mm"
                },
                "notes": "GĐ 2: Cắt cối lỗ lớn hơn lập trình 0.010mm. OFFSET CHUẨN HIỆU CHỈNH = 0.120 - 0.005 = 0.115mm (Khe hở δ = 0.025mm)."
        },
        {
                "id": "2P-02",
                "name": "SCM420 | H=63mm | 2 Lần (Cấp 6)",
                "materialName": "SCM420 (HB<200)",
                "thickness": 63,
                "cutLength": "30mm",
                "passCount": 2,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 44,
                                "Po": 7,
                                "IP": 5,
                                "wire": 1,
                                "voltage": "High",
                                "vf": 55,
                                "maxSpeed": "150Hz",
                                "offset": 0.118,
                                "time": "16p26'",
                                "ampe": "4,2A",
                                "speed": "75-85 mm²/p"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 20,
                                "Po": 5,
                                "IP": 3,
                                "wire": 2,
                                "voltage": "High",
                                "vf": 40,
                                "maxSpeed": "100Hz",
                                "offset": 0.024,
                                "time": "5p20'",
                                "ampe": "0,1-0,2A",
                                "speed": "240 mm²/p"
                        }
                ],
                "measured": {
                        "totalTimeStr": "21p46'",
                        "ammeterA": "4.2A (P1) | 0.1-0.2A (P2)",
                        "measuredSpeed": "75-85 (P1) | 240 (P2)",
                        "enteredOffsetP1": 0.118,
                        "enteredOffsetP2": 0.024,
                        "recommendedOffsetP1": 0.093,
                        "recommendedOffsetP2": 0.024,
                        "actualDimension": "Chày to hơn lập trình 0.050mm"
                },
                "notes": "Nhập test P1=0.118, P2=0.024 -> Chày to hơn 0.050mm. Offset chuẩn hiệu chỉnh: P1=0.093mm, P2=0.024mm."
        },
        {
                "id": "2P-03",
                "name": "SCM420 | H=30mm | 2 Lần (Cắt Cối)",
                "materialName": "SCM420 (HB<200)",
                "thickness": 30,
                "cutLength": "644mm",
                "passCount": 2,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 28,
                                "Po": 6,
                                "IP": 4,
                                "wire": 1,
                                "voltage": "High",
                                "vf": 60,
                                "maxSpeed": "200Hz",
                                "offset": 0.115,
                                "time": "3h08p",
                                "ampe": "4,1A",
                                "speed": "140-150 mm²/p"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 16,
                                "Po": 5,
                                "IP": 2,
                                "wire": 2,
                                "voltage": "Low",
                                "vf": 40,
                                "maxSpeed": "150Hz",
                                "offset": 0.022,
                                "time": "1h12p",
                                "ampe": "0,1-0,2A",
                                "speed": "360 mm²/p"
                        }
                ],
                "measured": {
                        "totalTimeStr": "4h20p",
                        "ammeterA": "4.1A (P1) | 0.1-0.2A (P2)",
                        "measuredSpeed": "140-150 (P1) | 360 (P2)",
                        "enteredOffsetP1": 0.115,
                        "enteredOffsetP2": 0.022,
                        "recommendedOffsetP1": 0.1075,
                        "recommendedOffsetP2": 0.022,
                        "actualDimension": "Cối nhỏ hơn lập trình 0.015mm"
                },
                "notes": "Cắt cối L=644mm. Nhập test P1=0.115, P2=0.022 -> Cối nhỏ hơn 0.015mm. Offset chuẩn hiệu chỉnh: P1=0.1075mm, P2=0.022mm."
        },
        {
                "id": "2P-04",
                "name": "SCM440 | H=12mm | 2 Lần (Đã Chuẩn)",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 12,
                "cutLength": "--",
                "passCount": 2,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 20,
                                "Po": 7,
                                "IP": 2,
                                "wire": 2,
                                "voltage": "Low",
                                "vf": 50,
                                "maxSpeed": "150Hz",
                                "offset": 0.098,
                                "time": "--",
                                "ampe": "--",
                                "speed": "--"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 12,
                                "Po": 7,
                                "IP": 2,
                                "wire": 2,
                                "voltage": "Low",
                                "vf": 20,
                                "maxSpeed": "130Hz",
                                "offset": 0.04,
                                "time": "--",
                                "ampe": "--",
                                "speed": "--"
                        }
                ],
                "measured": {
                        "totalTimeStr": "--",
                        "ammeterA": "--",
                        "measuredSpeed": "--",
                        "enteredOffsetP1": 0.098,
                        "enteredOffsetP2": 0.04,
                        "recommendedOffsetP1": 0.098,
                        "recommendedOffsetP2": 0.04,
                        "actualDimension": "Kích thước đã chuẩn 100%"
                },
                "notes": "H=12mm Thép SCM440. P1(Ton=20, IP=2, Low, VF=50, O1=0.098) + P2(Ton=12, IP=2, Low, VF=20, O2=0.040) -> Kích thước đã chuẩn."
        },
        {
                "id": "2P-05",
                "name": "SCM440 | H=32mm | 2 Lần (Đã Chuẩn)",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 32,
                "cutLength": "--",
                "passCount": 2,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 30,
                                "Po": 7,
                                "IP": 3,
                                "wire": 1,
                                "voltage": "Low",
                                "vf": 50,
                                "maxSpeed": "200Hz",
                                "offset": 0.091,
                                "time": "--",
                                "ampe": "--",
                                "speed": "--"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 5,
                                "Po": 15,
                                "IP": 1,
                                "wire": 1,
                                "voltage": "Low",
                                "vf": 10,
                                "maxSpeed": "130Hz",
                                "offset": 0.03,
                                "time": "--",
                                "ampe": "--",
                                "speed": "--"
                        }
                ],
                "measured": {
                        "totalTimeStr": "--",
                        "ammeterA": "--",
                        "measuredSpeed": "--",
                        "enteredOffsetP1": 0.091,
                        "enteredOffsetP2": 0.03,
                        "recommendedOffsetP1": 0.091,
                        "recommendedOffsetP2": 0.03,
                        "actualDimension": "Kích thước đã chuẩn 100%"
                },
                "notes": "H=32mm Thép SCM440. P1(Ton=30, IP=3, Low, VF=50, O1=0.091) + P2(Ton=5, IP=1, Low, VF=10, O2=0.030) -> Kích thước đã chuẩn."
        },
        {
                "id": "2P-06",
                "name": "SCM440 | H=62mm | 2 Lần (Đã Chuẩn)",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 62,
                "cutLength": "--",
                "passCount": 2,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 70,
                                "Po": 7,
                                "IP": 4,
                                "wire": 1,
                                "voltage": "High",
                                "vf": 50,
                                "maxSpeed": "150Hz",
                                "offset": 0.092,
                                "time": "--",
                                "ampe": "--",
                                "speed": "--"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 15,
                                "Po": 7,
                                "IP": 2,
                                "wire": 2,
                                "voltage": "Low",
                                "vf": 20,
                                "maxSpeed": "100Hz",
                                "offset": 0.03,
                                "time": "--",
                                "ampe": "--",
                                "speed": "--"
                        }
                ],
                "measured": {
                        "totalTimeStr": "--",
                        "ammeterA": "--",
                        "measuredSpeed": "--",
                        "enteredOffsetP1": 0.092,
                        "enteredOffsetP2": 0.03,
                        "recommendedOffsetP1": 0.092,
                        "recommendedOffsetP2": 0.03,
                        "actualDimension": "Kích thước đã chuẩn 100%"
                },
                "notes": "H=62mm Thép SCM440. P1(Ton=70, IP=4, High, VF=50, O1=0.092) + P2(Ton=15, IP=2, Low, VF=20, O2=0.030) -> Kích thước đã chuẩn."
        },
        {
                "id": "2P-09",
                "name": "SCM420 | H=140mm | 2 Lần (Đã Chuẩn)",
                "materialName": "SCM420 (HB<200)",
                "thickness": 140,
                "cutLength": "--",
                "passCount": 2,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 120,
                                "Po": 8,
                                "IP": 5,
                                "wire": 1,
                                "voltage": "High",
                                "vf": 55,
                                "maxSpeed": "60Hz",
                                "offset": 0.098,
                                "time": "--",
                                "ampe": "--",
                                "speed": "--"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 25,
                                "Po": 7,
                                "IP": 2,
                                "wire": 2,
                                "voltage": "Low",
                                "vf": 25,
                                "maxSpeed": "100Hz",
                                "offset": 0.03,
                                "time": "--",
                                "ampe": "--",
                                "speed": "--"
                        }
                ],
                "measured": {
                        "totalTimeStr": "--",
                        "ammeterA": "--",
                        "measuredSpeed": "--",
                        "enteredOffsetP1": 0.098,
                        "enteredOffsetP2": 0.03,
                        "recommendedOffsetP1": 0.098,
                        "recommendedOffsetP2": 0.03,
                        "actualDimension": "Kích thước đã chuẩn 100%"
                },
                "notes": "H=140mm Phôi dày SCM420. P1(Ton=120, IP=5, High, VF=55, O1=0.098) + P2(Ton=25, IP=2, Low, VF=25, O2=0.030) -> Kích thước đã chuẩn."
        }
,
        {
                "id": "2P-10",
                "name": "SCM440 | H=85mm | 2 Lần (Kiểm chứng Web App Tab 2)",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 85,
                "cutLength": "65,6mm",
                "passCount": 2,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 70,
                                "Po": 8,
                                "IP": 5,
                                "wire": 1,
                                "voltage": "High",
                                "vf": 61,
                                "maxSpeed": "150Hz",
                                "offset": 0.095,
                                "time": "48p",
                                "ampe": "3,6A - 3,7A",
                                "speed": "55 - 65 mm²/p"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 20,
                                "Po": 6,
                                "IP": 3,
                                "wire": 2,
                                "voltage": "High",
                                "vf": 36,
                                "maxSpeed": "100Hz",
                                "offset": 0.03,
                                "time": "10p24'",
                                "ampe": "0,5A - 1,0A",
                                "speed": "240 mm²/p"
                        }
                ],
                "measured": {
                        "totalTimeStr": "58p24' (P1: 48p, P2: 10p24')",
                        "ammeterA": "3.6 - 3.7A (P1) | 0.5 - 1.0A (P2)",
                        "measuredSpeed": "55 - 65 mm²/p (P1) | 240 mm²/p (P2)",
                        "enteredOffsetP1": 0.095,
                        "enteredOffsetP2": 0.03,
                        "recommendedOffsetP1": 0.1025,
                        "recommendedOffsetP2": 0.03,
                        "actualDimension": "Sau P1: 19.94-19.95mm | Sau P2: to hơn 0.015mm (20.015mm)"
                },
                "notes": "H=85mm SCM440 cắt 2 Pass theo chuẩn Web App Tab 2. Sau Pass 1 đo đạt 19.94-19.95mm (chừa đúng 0.0275mm lượng dư mỗi bên). Sau Pass 2 đạt 20.015mm (to hơn 0.015mm do Pass 2 ăn 0.035mm/bên). Offset P1 chuẩn hiệu chỉnh: 0.1025mm, Offset P2: 0.030mm."
        }
,
        {
                "id": "2P-11",
                "name": "SCM440 | H=165mm | 2 Lần (Hiệu chuẩn VF=70)",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 165,
                "cutLength": "43,6mm",
                "passCount": 2,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 135,
                                "Po": 11,
                                "IP": 6,
                                "wire": 1,
                                "voltage": "High",
                                "vf": 70,
                                "maxSpeed": "60Hz",
                                "offset": 0.110,
                                "time": "1h17'",
                                "ampe": "2,8A - 3,0A",
                                "speed": "15 - 35 mm²/p"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 24,
                                "Po": 6,
                                "IP": 3,
                                "wire": 2,
                                "voltage": "High",
                                "vf": 36,
                                "maxSpeed": "80Hz",
                                "offset": 0.030,
                                "time": "9p",
                                "ampe": "1,0A - 1,5A",
                                "speed": "190 mm²/p"
                        }
                ],
                "measured": {
                        "totalTimeStr": "1h26' (P1: 1h17', P2: 9p)",
                        "ammeterA": "2.8 - 3.0A (P1) | 1.0 - 1.5A (P2)",
                        "measuredSpeed": "15 - 35 mm²/p (P1) | 190 mm²/p (P2)",
                        "enteredOffsetP1": 0.110,
                        "enteredOffsetP2": 0.030,
                        "recommendedOffsetP1": 0.0875,
                        "recommendedOffsetP2": 0.020,
                        "actualDimension": "Sau P1: 23.95-23.96mm | Sau P2: 23.95-23.96mm (nhỏ hơn lập trình 0.045mm)"
                },
                "delta1Solid": 0.0275,
                        "equivalent1PassOffset": 0.1175,
                        "notes": "H=165mm SCM440 phôi siêu dày. LƯỢNG CÀO THÉP ĐẶC PASS 1: δ1 = 0.050 - 0.0225 = 0.0275mm (Bào mòn cực mạnh 27.5 micron). Quy đổi Offset 1-Pass chuẩn tương đương: O_1P = 0.090 + 0.0275 = 0.1175mm (dùng tinh chỉnh công thức 1-Pass). Phát hiện bước ngoặt: VF=70 tăng độ nhạy dò dây giúp máy đi chậm rãi, chống đâm sầm vào phôi. P2 hụt tầm vươn do O2 đặt lùi quá xa. Hiệu chỉnh 2 Pass chuẩn: P1=0.0875mm, P2=0.020mm."
        }
,
        {
                "id": "2P-12",
                "name": "SCM440 | H=165mm | 2 Lần (Mẫu 2: O1=0.100, O2=0.015)",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 165,
                "cutLength": "43,6mm",
                "passCount": 2,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 135,
                                "Po": 11,
                                "IP": 6,
                                "wire": 1,
                                "voltage": "High",
                                "vf": 70,
                                "maxSpeed": "60Hz",
                                "offset": 0.100,
                                "time": "1h17'",
                                "ampe": "2,8A - 3,0A",
                                "speed": "15 - 35 mm²/p"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 40,
                                "Po": 7,
                                "IP": 3,
                                "wire": 2,
                                "voltage": "High",
                                "vf": 36,
                                "maxSpeed": "80Hz",
                                "offset": 0.015,
                                "time": "9p",
                                "ampe": "0,5A (3/4 đường) | 1,0A-1,5A (1/4 đường)",
                                "speed": "190 mm²/p"
                        }
                ],
                "measured": {
                        "totalTimeStr": "1h26' (P1: 1h17', P2: 9p)",
                        "ammeterA": "2.8-3.0A (P1) | 0.5A ~ 1.0-1.5A (P2)",
                        "measuredSpeed": "15-35 mm²/p (P1) | 190 mm²/p (P2)",
                        "enteredOffsetP1": 0.100,
                        "enteredOffsetP2": 0.015,
                        "recommendedOffsetP1": 0.1075,
                        "recommendedOffsetP2": 0.015,
                        "delta1Solid": 0.0225,
                        "equivalent1PassOffset": 0.1125,
                        "actualDimension": "Sau P1: 23.99-24.00mm | Sau P2: 24.01-24.02mm (to hơn lập trình 0.015mm)"
                },
                "notes": "H=165mm SCM440 mẫu 2. P1 cào thép đặc δ1=0.0225mm (gần khớp 24.00mm). P2 tăng Ton=40 và ép O2=0.015mm giúp tia lửa cắn sâu vào vách, cối to hơn 0.015mm. Đúc kết vàng về kim Ampe P2: 3/4 đường kim chỉ 0.5A (đỉnh núi lửa thấp), 1/4 đường vọt lên 1-1.5A (đỉnh núi lửa cao còn nhiều lượng dư). Offset 2 Pass chuẩn: P1=0.1075mm, P2=0.015mm."
        }
,
        {
                "id": "2P-13",
                "name": "SCM440 | H=60mm | 2 Lần (Kiểm chứng Thực tế Xưởng)",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 60,
                "cutLength": "68mm",
                "passCount": 2,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 50,
                                "Po": 7,
                                "IP": 4,
                                "wire": 1,
                                "voltage": "High",
                                "vf": 62,
                                "maxSpeed": "150Hz",
                                "offset": 0.094,
                                "time": "40p20'",
                                "ampe": "3,5A - 3,6A",
                                "speed": "65 - 75 mm²/p"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 16,
                                "Po": 6,
                                "IP": 2,
                                "wire": 2,
                                "voltage": "High",
                                "vf": 40,
                                "maxSpeed": "100Hz",
                                "offset": 0.022,
                                "time": "12p",
                                "ampe": "0,5A - 0,6A",
                                "speed": "240 mm²/p"
                        }
                ],
                "measured": {
                        "totalTimeStr": "52p20' (P1: 40p20', P2: 12p)",
                        "ammeterA": "3.5 - 3.6A (P1) | 0.5 - 0.6A (P2)",
                        "measuredSpeed": "65 - 75 mm²/p (P1) | 240 mm²/p (P2)",
                        "enteredOffsetP1": 0.094,
                        "enteredOffsetP2": 0.022,
                        "recommendedOffsetP1": 0.099,
                        "recommendedOffsetP2": 0.022,
                        "actualDimension": "Cắt lấy cối: kích thước lớn hơn lập trình 0.010mm (lỗ cối rộng hơn 5μm/bên)"
                },
                "notes": "H=60mm SCM440 cắt 2 Pass kiểm chứng xưởng. Kích thước chày lớn hơn lập trình 0.010mm (chỉ lệch 5μm/bên). Offset P1 chuẩn: 0.099mm, Offset P2 chuẩn: 0.022mm. Khớp tuyệt đối với công thức lý thuyết: O1_calc = 0.0943mm (thực tế nhập 0.094), O2_calc = 0.022mm (thực tế nhập 0.022). Ampe P1 ăn 3.5-3.6A, P2 ăn 0.5-0.6A."
        },
        {
                "id": "5P-01",
                "name": "SCM440 | H=12mm | 5 Lần (Cắt Chày Kiểm Chứng Thực Tế)",
                "materialName": "SCM440 (28-32HRC)",
                "thickness": 12,
                "cutLength": "128mm",
                "passCount": 5,
                "multiPassDetails": [
                        {
                                "pass": "Pass 1",
                                "ti": 20,
                                "Po": 5,
                                "IP": 3,
                                "wire": 1,
                                "voltage": "High",
                                "vf": 65,
                                "maxSpeed": "150Hz",
                                "offset": 0.108,
                                "time": "19p50'",
                                "ampe": "4A",
                                "speed": "275-285 mm²/p"
                        },
                        {
                                "pass": "Pass 2",
                                "ti": 14,
                                "Po": 5,
                                "IP": 2,
                                "wire": 2,
                                "voltage": "Low",
                                "vf": 42,
                                "maxSpeed": "140Hz",
                                "offset": 0.018,
                                "time": "16p",
                                "ampe": "0,3A - 0,5A",
                                "speed": "232-340 mm²/p"
                        },
                        {
                                "pass": "Pass 3",
                                "ti": 6,
                                "Po": 8,
                                "IP": 1,
                                "wire": 3,
                                "voltage": "Low",
                                "vf": 35,
                                "maxSpeed": "120Hz",
                                "offset": 0.009,
                                "time": "--",
                                "ampe": "< 0,2A",
                                "speed": "--"
                        },
                        {
                                "pass": "Pass 4",
                                "ti": 2,
                                "Po": 12,
                                "IP": 1,
                                "wire": 3,
                                "voltage": "Low",
                                "vf": 25,
                                "maxSpeed": "100Hz",
                                "offset": 0.004,
                                "time": "--",
                                "ampe": "< 0,1A",
                                "speed": "--"
                        },
                        {
                                "pass": "Pass 5",
                                "ti": 1,
                                "Po": 16,
                                "IP": 1,
                                "wire": 3,
                                "voltage": "Low",
                                "vf": 20,
                                "maxSpeed": "80Hz",
                                "offset": 0.002,
                                "time": "--",
                                "ampe": "~ 0,05A",
                                "speed": "--"
                        }
                ],
                "measured": {
                        "totalTimeStr": "1h45p (Tổng 5 Pass)",
                        "ammeterA": "4A (P1) | 0.3-0.5A (P2) | <0.2A (P3) | <0.1A (P4) | ~0.05A (P5)",
                        "measuredSpeed": "275-285 (P1) | 232-340 (P2)",
                        "enteredOffsetP1": 0.108,
                        "enteredOffsetP2": 0.018,
                        "recommendedOffsetP1": 0.093,
                        "recommendedOffsetP2": 0.018,
                        "delta1Solid": 0.011,
                        "equivalent1PassOffset": 0.101,
                        "actualDimension": "Sau P1: 54.08mm (chừa 0.040mm/bên) | Sau P2: 54.045mm (gọt 0.0175mm/bên) | Sau P5: 54.030mm (to hơn lập trình 0.030mm)"
                },
                "notes": "H=12mm SCM440 cắt 5 Pass chày chu vi 128mm, tổng thời gian 1h45p. P1(Ton=20,Po=5,IP=3,High,VF=65) cào thép đặc δ1=0.011mm (Offset 1 Pass tương đương 0.101mm). P2(Ton=14,Po=5,IP=2,Low,VF=42) gọt đỉnh núi lửa 17.5μm/bên, Ampe 0.3-0.5A. P3-P5 gọt siêu mịn 7.5μm/bên. Kết thúc đo 54.030mm (chày to hơn lập trình 0.030mm -> dư 0.015mm/bên). Offset P1 chuẩn hiệu chỉnh: 0.093mm."
        }
    ];

    const WORKSHOP_CALIBRATION_MODEL = {
        kAmpe: 2.2857,               // Hệ số dòng Ampe thực tế xưởng (~4.0A với IP=5, Po=7)
        calibratedCm: 0.0111,        // Hệ số năng suất bóc tách phôi thực tế (mm3/J)
        calibratedKerfB: 0.276,      // Bề rộng rãnh cắt thực tế xưởng (mm)
        calibratedSparkGap: 0.048,   // Khe hở tia lửa thực tế xưởng (mm)
        speedCalibrationFactor: 1.0, // Hệ số tinh chỉnh tốc độ
        actualAmmeterReading: '≈ 4.0 A (Khớp kim đo thực tế xưởng)'
    };

    
    // HỆ THỐNG LAI TẠO DỮ LIỆU & NHÂN QUẢ BÙ DAO (RULE 06, 07, 08)
    function generateWorkshopRows(state) {
        const H = state.thickness;
        const passes = state.passCount;
        const strat = WS_STRATEGY_CONFIGS[state.wsStrategyLevel] || WS_STRATEGY_CONFIGS[4];
        const isAlu = state.material === 'ALUMINUM';
        const isCopper = state.material === 'COPPER';
        const isHard = state.material === 'SCM440';
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
        let baseTon, basePo, baseIP, baseVF, baseGap, baseVolt;

        if (isAlu) {
            if (H <= 15) baseTon = 18; else if (H <= 30) baseTon = 22; else if (H <= 60) baseTon = 26; else if (H <= 100) baseTon = 32; else if (H <= 160) baseTon = 38; else if (H <= 250) baseTon = 44; else if (H <= 350) baseTon = 50; else baseTon = 56;
            basePo = H <= 40 ? 7 : (H <= 120 ? 8 : 10);
            baseIP = H <= 30 ? 3 : (H <= 100 ? 4 : 5);
            baseVolt = 'High';
            baseVF = H <= 40 ? 65 : 60;
            baseGap = 0.010;
        } else if (isCopper) {
            if (H <= 15) baseTon = 26; else if (H <= 30) baseTon = 30; else if (H <= 60) baseTon = 36; else if (H <= 100) baseTon = 44; else if (H <= 160) baseTon = 52; else if (H <= 250) baseTon = 60; else if (H <= 350) baseTon = 64; else baseTon = 68;
            basePo = H <= 40 ? 5 : (H <= 120 ? 6 : 8);
            baseIP = H <= 30 ? 3 : (H <= 100 ? 5 : 6);
            baseVolt = 'High';
            baseVF = H <= 40 ? 60 : 55;
            baseGap = 0.012;
        } else {
            // THÉP SCM440 (28-32 HRC) VS SCM420 (HB < 200) - PHÂN ĐỊNH RÕ RÀNG THEO CƠ LÝ TÍNH VẬT LIỆU
            
            // 1.1. Điện áp Volt: Ngưỡng chuyển tiếp logic mượt mà
            baseVolt = H <= 15 ? 'Low' : 'High';

            if (H <= 170) {
                // =========================================================================
                // PHÂN VÙNG 1 (H <= 170mm): CÔNG THỨC TOÁN - VẬT LÝ NHIỆT ĐỘNG HỌC EDM TOÀN NĂNG (RULE 10)
                // =========================================================================
                // 1.2. Ton:
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

                // 1.3. IP & Po:
                if (H <= 15) {
                    baseIP = 2; basePo = isHard ? 5 : 6;
                } else if (H <= 30) {
                    baseIP = 3; basePo = isHard ? 6 : 7;
                } else if (H <= 60) {
                    baseIP = 4; basePo = isHard ? 7 : 8;
                } else if (H <= 100) {
                    baseIP = 5; basePo = isHard ? 8 : 9;
                } else if (H <= 140) {
                    baseIP = 5; basePo = 8;
                } else if (H <= 165) {
                    baseIP = 6; basePo = Math.round(8 + (H - 140) * (11 - 8) / (165 - 140));
                } else {
                    baseIP = 6; basePo = 11;
                }

                // 1.4. VF:
                const vfMax = isHard ? 65 : 60;
                const vfMin = isHard ? 55 : 50;
                if (H <= 40) baseVF = vfMax;
                else if (H <= 100) baseVF = Math.round(vfMax - (H - 40) * (vfMax - vfMin) / (100 - 40));
                else if (H <= 160) baseVF = Math.round(vfMin + (H - 100) * (70 - vfMin) / (160 - 100));
                else baseVF = 70;

                // Tính toán lượng cào phôi cơ sở (baseGap) theo đúng công thức vật lý:
                const u_ratio_base = baseVolt === 'High' ? 1.0 : (22.0 / 27.0);
                const d_elec_base = K_ELEC * Math.sqrt(baseTon * baseIP) * u_ratio_base;
                const d_low_base = baseVolt === 'Low' ? DELTA_LOW : 0.0;
                const ip_fac_base = Math.max(1.0, baseIP / 4.0);
                const d_slag_base = - K_SLAG * (H / 100.0) / ip_fac_base;
                const d_vibr_base = K_VIBR * Math.pow(H / 100.0, 2) * (baseIP / 5.0);
                baseGap = C0 + d_elec_base + d_low_base + d_slag_base + d_vibr_base;

            } else {
                // =========================================================================
                // PHÂN VÙNG 2 (H > 170mm): PHƯƠNG PHÁP THỐNG KÊ HỘI TỤ THỰC NGHIỆM XƯỞNG
                // Dựa trên số liệu cắt thực tế của người dùng: H=165 (STT 2P-12) -> H=300 (STT 14 - GĐ 2 hoàn chỉnh; STT 13 thuộc Vùng tham khảo C)
                // =========================================================================
                baseTon = isHard ? 135 : 120;
                baseIP = 6; // Sò kịch trần an toàn chống đứt dây Moly
                basePo = Math.round(11 + (H - 170) * (12 - 11) / (300 - 170)); // Po nới nhẹ 11 -> 12 để xối sạch xỉ lòng rãnh sâu
                baseVF = Math.min(72, Math.round(70 + (H - 170) * (72 - 70) / (300 - 170))); // VF 70 -> 72

                // Bù dao thực nghiệm hội tụ: từ 0.0187mm (tại H=170) lên 0.0250mm (tại H=300: O1 chuẩn xưởng = 0.115mm)
                baseGap = 0.0187 + (H - 170) * (0.0250 - 0.0187) / (300 - 170);
            }
        }

        // Apply Tab 2 7-level Strategy strictly adhering to Regular Ammeter Stepping (ΔI = 0.5 - 0.7A)
        let Ton, Po, IP, Volt, VF;
        const lvl = state.wsStrategyLevel || 4;

        if (lvl === 4) {
            // CẤP 4: TIÊU CHUẨN (CHUẨN XƯỞNG RULE 12 - 2.7A TẠI H30)
            Ton = baseTon;
            Po = basePo;
            IP = baseIP;
            Volt = baseVolt;
            VF = baseVF;
        } else if (lvl === 3) {
            // CẤP 3: BỀ MẶT MỊN (GIẢM 0.5 - 0.7A -> 2.0 - 2.2A TẠI H30)
            Ton = Math.max(8, baseTon - 6);
            Po = basePo + 2;
            IP = baseIP;
            Volt = baseVolt;
            VF = Math.max(25, baseVF - 5);
        } else if (lvl === 2) {
            // CẤP 2: SIÊU MỊN (GIẢM 1.0 - 1.3A -> 1.3 - 1.5A TẠI H30)
            Ton = Math.max(8, baseTon - 12);
            IP = Math.max(1, baseIP - 1);
            Po = basePo + 1;
            Volt = H <= 40 ? 'Low' : baseVolt;
            VF = Math.max(25, baseVF - 10);
        } else if (lvl === 1) {
            // CẤP 1: CỰC HẠN SIÊU MỊN (GIẢM 1.6 - 1.9A -> 0.7 - 0.9A TẠI H30)
            Ton = Math.max(6, baseTon - 18);
            IP = H <= 30 ? 1 : (H <= 120 ? 2 : 3);
            Po = basePo + (IP > 1 ? 2 : 0);
            Volt = 'Low';
            VF = Math.max(25, baseVF - 15);
        } else if (lvl === 5) {
            // CẤP 5: NĂNG SUẤT (TĂNG 0.5 - 0.7A -> 3.2 - 3.4A TẠI H30)
            Ton = baseTon + 6;
            Po = Math.max(3, basePo - 1);
            IP = baseIP;
            Volt = 'High';
            VF = Math.min(85, baseVF + 5);
        } else if (lvl === 6) {
            // CẤP 6: NĂNG SUẤT CAO (TĂNG 1.0 - 1.3A -> 3.8 - 4.0A TẠI H30)
            Ton = baseTon + 14;
            Po = Math.max(3, basePo - 2);
            IP = baseIP;
            Volt = 'High';
            VF = Math.min(88, baseVF + 10);
        } else {
            // CẤP 7: SIÊU NĂNG SUẤT PHÁ THÔ (TĂNG 1.6 - 1.9A -> 4.3 - 4.6A TẠI H30)
            Ton = baseTon + 22;
            if (H <= 60 && baseIP <= 4) {
                IP = baseIP + 1;
                Po = Math.max(3, basePo - 1);
            } else {
                IP = baseIP;
                Po = Math.max(3, basePo - 3);
            }
            Volt = 'High';
            VF = Math.min(90, baseVF + 15);
        }

        // TÍNH TOÁN LƯỢNG CÀO PHÔI THỰC TẾ PASS 1 (GAP1 / DELTA1)
        let gap;
        if (isAlu || isCopper) {
            gap = baseGap + (lvl - 4) * 0.002;
        } else if (H <= 170) {
            // REGIME 1: H <= 170mm (CÔNG THỨC TOÁN - VẬT LÝ NHIỆT ĐỘNG HỌC LIÊN TỤC)
            const u_ratio_actual = Volt === 'High' ? 1.0 : (22.0 / 27.0);
            const d_elec_actual = K_ELEC * Math.sqrt(Ton * IP) * u_ratio_actual;
            const d_low_actual = Volt === 'Low' ? DELTA_LOW : 0.0;
            const ip_fac_actual = Math.max(1.0, IP / 4.0);
            const d_slag_actual = - K_SLAG * (H / 100.0) / ip_fac_actual;
            const d_vibr_actual = K_VIBR * Math.pow(H / 100.0, 2) * (IP / 5.0);
            gap = C0 + d_elec_actual + d_low_actual + d_slag_actual + d_vibr_actual;
        } else {
            // REGIME 2: H > 170mm (THỐNG KÊ HỘI TỤ THỰC NGHIỆM XƯỞNG)
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
            else if (H <= 165) p2_ton = Math.round(24 + (H - 140) * (40 - 24) / (165 - 140)); // Nâng lên 40μs để tia lửa không bị hụt tầm vươn
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
        let p2_hz = H <= 40 ? 150 : (H <= 120 ? 120 : (H <= 150 ? 100 : 80));

        if (state.wsStrategyLevel === 1) { p2_ton = Math.max(2, p2_ton - 2); p2_ip = Math.max(1, p2_ip - 1); }
        else if (state.wsStrategyLevel === 5) { p2_ton += 4; }

        // BÙ DAO PASS 2 (O2 - REMAIN / LƯỢNG CHỪA PHÔI):
        let calculated_O2;
        if (isAlu || isCopper) {
            calculated_O2 = 0.025;
        } else if (H <= 170) {
            // REGIME 1: H <= 170mm (CÔNG THỨC VẬT LÝ NÚI LỬA O2 = Rz1 + delta_2)
            const u_ratio_actual = Volt === 'High' ? 1.0 : (22.0 / 27.0);
            const Rz_p1 = K_RZ * Math.sqrt(Ton * IP) * u_ratio_actual;
            const u_ratio_p2 = p2_volt === 'High' ? 1.0 : (22.0 / 27.0);
            const d_elec_p2 = K_ELEC * Math.sqrt(p2_ton * p2_ip) * u_ratio_p2;
            const d_low_p2 = p2_volt === 'Low' ? DELTA_LOW : 0.0;
            const delta_2_calc = C0 + d_elec_p2 + d_low_p2 - K_SLAG * (H / 100.0) / (p2_ip / 4.0);

            calculated_O2 = Rz_p1 + Math.max(0.005, Math.min(0.015, delta_2_calc));
            if (H > 140) {
                // Phôi siêu dày H > 140mm: Khống chế cự ly mép dây 15 - 18μm để tia lửa bám sát vách, chống trượt gió trong rãnh xỉ sâu (STT 2P-12)
                calculated_O2 = Math.min(calculated_O2, 0.015 + 0.005 * Math.max(0.0, 1.0 - (H - 140) / 160.0));
            }
        } else {
            // REGIME 2: H > 170mm (THỐNG KÊ HỘI TỤ THỰC NGHIỆM: Khóa chặt O2 = 0.015mm theo mốc Mẫu 2 H=165 STT 2P-12)
            calculated_O2 = 0.015;
        }

                for (let i = 0; i < passes; i++) {
            let row = { passName: `Pass ${i + 1}`, badgeClass: i === 0 ? 'badge-primary' : 'badge-secondary' };
            if (i === 0) {
                // Multi-pass kinematics (Rule 03 & Rule 04 & Rule 10):
                // For 1 Pass: Offset = R_wire + gap (0.090 + gap)
                // For 2 Pass: Offset = R_wire + gap + Remain_2 (0.090 + gap + O2)
                // AutoCut Kinematics:
                // O1 = R_wire (0.090) + gap1 (Lượng cào phôi của Pass 1)
                // O2 = gap2 (Lượng cào phôi của Pass 2)
                // AutoCut tự động cộng Path1 = O1 + O2 khi chạy máy
                let O1 = 0.090 + gap;
                
                let toff = Ton * Po;
                let true_cycle = Ton + toff;
                let duty = Ton / true_cycle;
                
                // Fc from factory formula
                let eta_eff = (isHard ? 0.88 : 0.80) * Math.pow(Math.max(1, Ton) / 50, 0.40);
                if (Ton > 80) eta_eff = Math.min(0.95, eta_eff);
                if (H > 100) eta_eff *= Math.max(0.72, 1.0 - (H - 100) * 0.0012);
                
                const u_arc = Volt === 'Low' ? 22 : 27;
                const i_peak = IP * 2.8;
                const power_watts = u_arc * i_peak * duty;
                
                let Cm = 0.012;
                if (isCopper) Cm = 0.015;
                if (isAlu) Cm = 0.028;
                
                const mrr_vol = 60 * Cm * power_watts * eta_eff;
                const B = 0.23;
                let speedArea = Math.round(mrr_vol / B);
                let feedRate = (speedArea / H).toFixed(2);

                // Tần số giới hạn Hz Pass 1: Nội suy chuẩn từ 150Hz (H=12) -> 60Hz (H=165) -> 50Hz (H=300)
                if (H <= 140) {
                    row.hz = Math.round(150 - (Math.max(12, H) - 12) * ((150 - 60) / (140 - 12)));
                } else {
                    row.hz = Math.round(60 - (Math.min(300, H) - 140) * ((60 - 50) / (300 - 140)));
                }

                // Ammeter mapping (Factory formula matching with U_arc factor)
                row.ampe = (i_peak * duty * 2.2857 * (u_arc / 27)).toFixed(1);

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
                row.Ra = passes === 1 ? (strat.RaStr || '~ 2.8') : (isHard ? '1.0 - 1.4' : '1.2 - 1.6');
                
                // Expose internal properties for calculateWorkshopEDM
                row._gap = gap;
                row._duty = duty;
                row._power_watts = power_watts;
                row._eta_eff = eta_eff;

            } else {
                row.ti = p2_ton;
                row.Po = p2_po;
                row.IP = p2_ip;
                row.Voltage = p2_volt;
                row.VF = p2_vf;
                row.Wire = '2';
                row.offsetText = calculated_O2.toFixed(3);
                
                // Tốc độ thực Pass 2 (Hiệu chuẩn từ 2P-03, 2P-10, 2P-12)
                let p2SpeedArea = H <= 40 ? 360 : (H <= 140 ? 240 : 190);
                let p2FeedRate = (p2SpeedArea / H).toFixed(2);
                let p2SpeedAreaH40 = Math.round(parseFloat(p2FeedRate) * 40);
                row.speedArea = `≈ ${p2SpeedArea}`;
                row.speedAreaH40 = `≈ ${p2SpeedAreaH40}`;
                row.feedRate = p2FeedRate;
                row.Ra = passes === 2 ? (isHard ? '1.0 - 1.4' : '1.2 - 1.6') : '~ 1.8 - 2.0';
                row.hz = p2_hz;

                // Ampe Pass 2: Phản chiếu quy luật đỉnh núi lửa thực tế xưởng
                if (p2_volt === 'Low') {
                    row.ampe = '< 0.2';
                } else if (H > 140) {
                    row.ampe = '0.5 - 1.5'; // 0.5A vùng đỉnh thấp, 1.0-1.5A vùng đỉnh nhô cao (STT 2P-12)
                } else {
                    row.ampe = '0.5 - 1.0'; // Chuẩn phôi vừa (STT 2P-10)
                }
            }
            wsRows.push(row);
        }
        return wsRows;
    }

    function calculateWorkshopEDM(state) {
        // Delegate logic perfectly to the Pass 1 generation to ensure zero mismatches
        const wsRows = generateWorkshopRows(state);
        const p1 = wsRows[0];
        
        const L = state.cutLength || 100;
        const H = state.thickness;
        const isAlu = state.material === 'ALUMINUM';
        const isCopper = state.material === 'COPPER';

        const ti_w = p1.ti;
        const Po_w = p1.Po;
        const IP_w = p1.IP;
        const Volt_w = p1.Voltage;
        const VF_w = p1.VF;
        const Wire_w = 1;
        const gap_w = p1._gap;

        // 2. Tính toán các đặc trưng điện động lực học
        const toff_w = ti_w * Po_w;
        const cycle_w = ti_w + toff_w;
        const cycle_ms_w = (cycle_w / 1000).toFixed(3);
        const freq_hz_w = Math.round(1000000 / cycle_w);
        const freq_khz_w = (freq_hz_w / 1000).toFixed(2);
        const duty_factor_w = (p1._duty * 100).toFixed(1);

        const u_arc_w = Volt_w === 'Low' ? 22 : 27;
        const i_peak_w = IP_w * 2.8;
        const we_mj_w = ((u_arc_w * i_peak_w * ti_w) / 1000).toFixed(2);
        const we_score_w = ti_w * IP_w;
        const power_watts_w = p1._power_watts.toFixed(2);

        // 3. Dòng Ampe xưởng (Matches Factory exactly)
        const i_tb_high = p1.ampe;
        const i_tb_std = (i_peak_w * p1._duty * 0.75).toFixed(1);

        // 4. Năng suất bóc phôi Fc, Tốc độ tiến bàn Ft
        const feedRate_num = parseFloat(p1.feedRate);
        const feedRate_w = p1.feedRate;
        const speedArea_w = p1.speedArea;
        
        let Cm = 0.012;
        if (isCopper) Cm = 0.015;
        if (isAlu) Cm = 0.028;
        
        const B = 0.23;
        const mrr_vol_w = (60 * Cm * p1._power_watts * p1._eta_eff).toFixed(2);
        let total_ws_time_min = 0;
        wsRows.forEach(r => {
            const f = parseFloat(r.feedRate);
            if (f > 0) {
                total_ws_time_min += L / f;
            }
        });
        const time_min_w = total_ws_time_min;

        // 5. Khe hở phóng điện và Lượng bù dao Offset
        const sparkGap_w = gap_w.toFixed(3);
        const offset_w = parseFloat(p1.offsetText).toFixed(3);
        const ra_w = p1.Ra !== '--' ? p1.Ra : (state.material === 'SCM440' ? '2.4 - 2.8' : '2.8 - 3.2');

        return {
            ti: ti_w, Po: Po_w, IP: IP_w, Voltage: Volt_w, VF: VF_w, Wire: Wire_w,
            toff: toff_w, cycle: cycle_w, cycle_ms: cycle_ms_w,
            freq_hz: freq_hz_w, freq_khz: freq_khz_w, duty_factor: duty_factor_w,
            we_mj: we_mj_w, we_score: we_score_w, power_watts: power_watts_w,
            speedArea: speedArea_w, feedRate: feedRate_w, sparkGap: sparkGap_w,
            offset: offset_w, time_min: time_min_w, Ra: ra_w,
            i_tb_high, i_tb_std, mrr_vol: mrr_vol_w, kerfB: B,
            ammeterDisplay: `≈ ${i_tb_high} A (Khớp theo điện gốc)`
        };
    }

    function computeTheoryKinematics({ ti, Po, IP, Voltage, VF, Wire, H, material, cutLength = 100 }) {
        const isHard = material === 'SCM440';
        const isCopper = material === 'COPPER';
        const isAlu = material === 'ALUMINUM';

        // 1. Chu kỳ & Thời gian nghỉ (Mục I tailieu.txt)
        const toff = ti * Po; // μs
        const cycle = ti + toff; // μs
        const cycle_ms = (cycle / 1000).toFixed(3); // ms
        const freq_hz = Math.round(1000000 / cycle);
        const freq_khz = (freq_hz / 1000).toFixed(2);
        const duty_factor = (ti / cycle) * 100; // η (%)

        // 2. Điện áp & Dòng điện (Mục I tailieu.txt)
        const u_arc = Voltage === 'Low' ? 22 : 27; // V
        const i_peak = IP * 2.8; // A
        const we_mj = (u_arc * i_peak * ti) / 1000; // mJ
        const we_score = ti * IP;

        // 3. Công suất phóng điện trung bình Ptb (Watts = J/s) (Dòng 211-214 tailieu.txt)
        // Ptb = U_arc * I_peak * η = U_arc * (IP * 2.8) * [1 / (1 + Po)]
        const power_watts = u_arc * i_peak * (duty_factor / 100);
        const power_score = Math.round(freq_hz * we_score);

        // 4. Dòng điện chỉ thị Ampe kế (Itb thực tế)
        const i_tb_std = (i_peak * (duty_factor / 100) * 0.75).toFixed(1);
        const i_tb_high = (i_peak * (duty_factor / 100) * 1.85).toFixed(1);

        // 5. NĂNG SUẤT BÓC PHÔI THEO TAILIEU.TXT (Dòng 207-258):
        // Fc = (60 * Cm * Ptb * η_eff) / B
        let Cm = 0.012; // Thép SCM420/SCM440: 0.012 mm3/J (Theo phép nhân chuẩn dòng 247 tailieu.txt)
        if (isCopper) Cm = 0.015; // Đồng: 0.015 mm3/J
        if (isAlu) Cm = 0.028; // Nhôm: 0.028 mm3/J

        // Bề rộng rãnh cắt thực tế B = Phi_dây + 2 * g = 0.18 + 2 * 0.025 = 0.23 mm (Dòng 223 & 343 tailieu.txt)
        const B = 0.23;

        // Hiệu suất nhiệt hữu dụng η_eff (Dòng 226 tailieu.txt: 0.70 - 0.85)
        // Khớp chính xác 100% các ví dụ TH1 (Ton=32 -> 105 mm2/p), TH2 (Ton=40 -> 115 mm2/p), TH3 (Ton=50 -> 125 mm2/p)
        let eta_eff = 0.85 * Math.pow(Math.max(1, ti) / 50, 0.40);
        if (ti > 80) eta_eff = Math.min(0.95, eta_eff);
        if (H > 100) eta_eff *= Math.max(0.72, 1.0 - (H - 100) * 0.0012);

        // Thể tích kim loại bóc tách trong 1 phút MRR_vol (mm3/p) (Dòng 247 tailieu.txt)
        const mrr_vol = 60 * Cm * power_watts * eta_eff;

        // Năng suất cắt diện tích Fc (mm2/p) (Dòng 252 tailieu.txt)
        const speedArea = Math.round(mrr_vol / B);

        // Tốc độ tiến bàn Ft = Fc / H (mm/p) (Dòng 257 tailieu.txt)
        const feedRate = (speedArea / H).toFixed(2);
        const time_min = cutLength / parseFloat(feedRate);

        // 6. Độ nhám bề mặt Ra
        let ra_center;
        if (isHard) ra_center = 1.0 + 0.0125 * we_score;
        else if (isCopper) ra_center = 1.0 + 0.0115 * we_score;
        else if (isAlu) ra_center = 1.4 + 0.0145 * we_score;
        else ra_center = 1.2 + 0.0135 * we_score;

        const ra_low = Math.max(0.6, (ra_center - 0.3)).toFixed(1);
        const ra_high = (ra_center + 0.3).toFixed(1);
        const Ra = `${ra_low} - ${ra_high}`;

        const sparkGap_num = 0.015 + 0.00035 * ti * (IP / 3) + (Voltage === 'High' ? 0.004 : 0.001);
        const sparkGap = sparkGap_num.toFixed(3);

        return {
            ti, Po, toff, IP, Voltage, VF, Wire,
            cycle, cycle_ms,
            freq_hz, freq_khz,
            duty_factor: duty_factor.toFixed(1),
            u_arc, i_peak,
            we_mj: we_mj.toFixed(2),
            we_score,
            power_watts: power_watts.toFixed(1),
            power_score,
            i_tb_std,
            i_tb_high,
            speedArea,
            feedRate,
            time_min,
            Ra,
            sparkGap,
            mrr_vol: mrr_vol.toFixed(2),
            B: B.toFixed(3),
            Cm,
            eta_eff: eta_eff.toFixed(2)
        };
    }

    // 5b. Mô hình tính toán Vật lý Động học EDM Thống nhất cho mọi chế độ (Chuẩn Hãng, Tự Nhập, Workshop)
    function computePulseKinematics({ ti, Po, IP, Voltage, VF, Wire, H, material, cutLength = 100 }) {
        const isHard = material === 'SCM440';
        const isCopper = material === 'COPPER';
        const isAlu = material === 'ALUMINUM';

        // 1. Chu kỳ xung T và Thời gian nghỉ Toff
        const toff = ti * Po; // μs
        const cycle = ti + toff; // μs
        const cycle_ms = (cycle / 1000).toFixed(3); // ms
        const freq_hz = Math.round(1000000 / cycle);
        const freq_khz = (freq_hz / 1000).toFixed(2);
        const duty_factor = (ti / cycle) * 100;

        // 2. Điện áp hồ quang, Dòng đỉnh, Năng lượng tia We
        const u_arc = Voltage === 'Low' ? 22 : 27;
        const i_peak = IP * 2.8; // Amperes
        const we_mj = (u_arc * i_peak * ti) / 1000; // mJ
        const we_score = ti * IP;

        // 3. Công suất phát trung bình Ptb
        const power_watts = (freq_hz * we_mj) / 1000; // Watts
        const power_score = Math.round(freq_hz * we_score);

        // 4. Dòng điện chỉ thị Ampe kế (Itb thực tế) - Tính toán động học chính xác 100%
        // Tủ tiêu chuẩn: Itb_std = I_peak * duty * 0.75
        // Tủ công suất cao / Xưởng: Itb_high = I_peak * duty * 1.85 (Khớp thực tế ~3.8-4.3A khi cắt thô)
        const i_tb_std = (i_peak * (duty_factor / 100) * 0.75).toFixed(1);
        const i_tb_high = (i_peak * (duty_factor / 100) * 1.85).toFixed(1);

        // 5. Baseline Năng suất bóc phôi Fc (mm2/p) và Tốc độ tiến bàn Ft (mm/p)
        let standardFc_baseline = 115;
        if (isAlu) standardFc_baseline = 155;
        else if (isCopper) standardFc_baseline = 95;
        else if (isHard) standardFc_baseline = 125;

        // Hiệu suất theo chiều dày phôi H
        let heightEfficiency = 1.0;
        if (H > 100) {
            heightEfficiency = Math.max(0.70, 1.0 - (H - 100) * 0.0012);
        } else if (H < 25) {
            heightEfficiency = Math.max(0.75, 0.85 + H * 0.006);
        }

        // Điểm chuẩn Cấp 6 cơ sở
        let base_ti = 32;
        if (isAlu) base_ti = 26;
        else if (isCopper) base_ti = 36;
        const base_Po = 6;
        const base_IP = 4;
        const base_VF = isAlu || isHard ? 65 : 60;
        const base_cycle = base_ti * (1 + base_Po);
        const base_freq = 1000000 / base_cycle;
        const base_we = (27 * (base_IP * 2.8) * base_ti) / 1000;
        const base_power = (base_freq * base_we) / 1000;

        const power_ratio = power_watts / base_power;
        const we_ratio = we_mj / base_we;
        const vf_factor = 1 + (VF - base_VF) / 250;

        let speedArea = Math.round(standardFc_baseline * heightEfficiency * power_ratio * Math.pow(we_ratio, 0.12) * vf_factor);
        if (ti > 70 && H < 60) speedArea = Math.round(speedArea * 0.88);
        if (Po < 4 && H > 80) speedArea = Math.round(speedArea * 0.85);

        const feedRate = (speedArea / H).toFixed(2);
        const time_min = cutLength / parseFloat(feedRate);

        // 6. Độ nhám bề mặt Ra (Hàm toán học liên tục theo we_score)
        let ra_center;
        if (isHard) ra_center = 1.0 + 0.0125 * we_score;
        else if (isCopper) ra_center = 1.0 + 0.0115 * we_score;
        else if (isAlu) ra_center = 1.4 + 0.0145 * we_score;
        else ra_center = 1.2 + 0.0135 * we_score; // SCM420

        const ra_low = Math.max(0.6, (ra_center - 0.3)).toFixed(1);
        const ra_high = (ra_center + 0.3).toFixed(1);
        const Ra = `${ra_low} - ${ra_high}`;

        // 7. Khe hở tia lửa sparkGap (δ)
        const sparkGap = (0.015 + 0.00035 * ti * (IP / 3) + (Voltage === 'High' ? 0.004 : 0.001)).toFixed(3);

        return {
            ti, Po, toff, IP, Voltage, VF, Wire,
            cycle, cycle_ms,
            freq_hz, freq_khz,
            duty_factor: duty_factor.toFixed(1),
            u_arc, i_peak,
            we_mj: we_mj.toFixed(2),
            we_score,
            power_watts: power_watts.toFixed(1),
            power_score,
            i_tb_std,
            i_tb_high,
            speedArea,
            feedRate,
            time_min,
            Ra,
            sparkGap
        };
    }

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
            
            if (wsCustomTiInput) wsCustomTiInput.value = smoothRow.ti;
            if (wsCustomPoInput) wsCustomPoInput.value = smoothRow.Po;
            if (wsCustomIpInput) wsCustomIpInput.value = smoothRow.IP;
            if (wsCustomVoltInput) wsCustomVoltInput.value = smoothRow.Voltage;
            if (wsCustomVfInput) wsCustomVfInput.value = smoothRow.VF;
            if (wsCustomWireInput) wsCustomWireInput.value = smoothRow.Wire;
        }
    }

    function runCustomAnalysis(shouldScroll = false) {
        const H = state.thickness;
        const L = state.cutLength || 100;
        
        // 1. LẤY THÔNG SỐ CHIẾN LƯỢC HÃNG TỪ THANH TRƯỢT 11 CẤP ĐỘ
        const activeStrat = STRATEGY_CONFIGS[state.strategyLevel] || STRATEGY_CONFIGS[6];
        const activeStratName = activeStrat.shortName || activeStrat.name;
        const stdCalc = calculateEDM(state);
        const stdRow = stdCalc.rows[0];

        // 2. TÍNH TOÁN CỘT CHIẾN LƯỢC HÃNG (CỘT PHẢI)
        const std_phys = computePulseKinematics({
            ti: stdRow.ti, Po: stdRow.Po, IP: stdRow.IP, Voltage: stdRow.Voltage, VF: stdRow.VF, Wire: stdRow.Wire,
            H, material: state.material, cutLength: L
        });

        // 3. TÍNH TOÁN CỘT BÊN TRÁI TÙY THEO CHẾ ĐỘ: 'custom' (Nhập riêng) hoặc 'theory' (TT Lý thuyết theo tailieu.txt)
        let c_phys;
        let leftColTitle = 'Chế độ nhập';

        if (state.compareMode === 'theory') {
            // Chế độ TT Lý thuyết: Lấy 100% đầu vào từ thanh trượt chiến lược đang chọn
            customTiInput.value = stdRow.ti;
            customPoInput.value = stdRow.Po;
            customIpInput.value = stdRow.IP;
            customVoltInput.value = stdRow.Voltage;
            customVfInput.value = stdRow.VF;
            customWireInput.value = stdRow.Wire;

            if (customModeHint) {
                customModeHint.innerHTML = '(Đầu vào đồng bộ 100% từ Thanh trượt Chiến lược &amp; tính theo công thức tailieu.txt)';
            }
            if (analysisTableTitle) {
                analysisTableTitle.innerHTML = '📐 BẢNG SO SÁNH: TT Lý thuyết (tailieu.txt) vs Chuẩn Hãng Thực tế';
            }
            if (btnModeTheory) btnModeTheory.classList.add('active');
            if (btnModeCustom) btnModeCustom.classList.remove('active');

            leftColTitle = state.compactMetrics ? 'TT Lý thuyết' : 'TT Lý thuyết (tailieu.txt)';

            // Tính toán theo đúng công thức tài liệu tailieu.txt
            c_phys = computeTheoryKinematics({
                ti: stdRow.ti, Po: stdRow.Po, IP: stdRow.IP, Voltage: stdRow.Voltage, VF: stdRow.VF, Wire: stdRow.Wire,
                H, material: state.material, cutLength: L
            });
        } else {
            // Chế độ Nhập Riêng (Mặc định)
            if (customModeHint) {
                customModeHint.innerHTML = '(Nhập thông số tùy ý bên dưới rồi bấm nút Phân Tích)';
            }
            if (analysisTableTitle) {
                analysisTableTitle.innerHTML = '📊 BẢNG SO SÁNH: Chế độ nhập vs Chiến lược Hãng';
            }
            if (btnModeCustom) btnModeCustom.classList.add('active');
            if (btnModeTheory) btnModeTheory.classList.remove('active');

            const c_ti = parseInt(customTiInput.value, 10) || 28;
            const c_po = parseInt(customPoInput.value, 10) || 7;
            const c_ip = parseInt(customIpInput.value, 10) || 4;
            const c_volt = customVoltInput.value;
            const c_vf = parseInt(customVfInput.value, 10) || 55;
            const c_wire = parseInt(customWireInput.value, 10) || 1;

            leftColTitle = 'Chế độ nhập';

            c_phys = computePulseKinematics({
                ti: c_ti, Po: c_po, IP: c_ip, Voltage: c_volt, VF: c_vf, Wire: c_wire,
                H, material: state.material, cutLength: L
            });
        }

        // 4. Độ lệch khe hở tia lửa và Sai số
        let gapDiff = Math.round((parseFloat(c_phys.sparkGap) - parseFloat(std_phys.sparkGap)) * 1000); // micron
        if (Math.abs(gapDiff) <= 1) gapDiff = 0;

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

        // Ghi chú We và Ra so sánh tương quan
        const weNote = c_phys.we_score > std_phys.we_score ? ' ⚡ Tia to hơn' : (c_phys.we_score < std_phys.we_score ? ' 🔹 Tia nhỏ mịn hơn' : '');
        const raNote = c_phys.we_score < std_phys.we_score ? ' (Mịn bóng hơn)' : (c_phys.we_score > std_phys.we_score ? ' (Rỗ thô hơn)' : '');

        // 1. RENDER BẢNG SO SÁNH (CHẾ ĐỘ NHẬP / TT LÝ THUYẾT vs CHIẾN LƯỢC HÃNG)
        comparisonTableElement.innerHTML = `
            <thead>
                <tr>
                    <th class="col-metric">${isCompact ? 'Tiêu chí' : 'Tiêu chí Công nghệ'}</th>
                    <th class="col-user">${leftColTitle}</th>
                    <th class="col-std">${activeStratName}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="col-metric"><strong>${m_ti}</strong></td>
                    <td class="col-user"><strong>${c_phys.ti} μs</strong></td>
                    <td class="col-std"><strong>${std_phys.ti} μs</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_po}</strong></td>
                    <td class="col-user"><strong>${c_phys.toff} μs</strong> (Hệ số ${c_phys.Po})</td>
                    <td class="col-std"><strong>${std_phys.toff} μs</strong> (Hệ số ${std_phys.Po})</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_cycle}</strong></td>
                    <td class="col-user"><strong>${c_phys.cycle} μs</strong> (${c_phys.cycle_ms} ms)</td>
                    <td class="col-std"><strong>${std_phys.cycle} μs</strong> (${std_phys.cycle_ms} ms)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_freq}</strong></td>
                    <td class="col-user"><strong>${c_phys.freq_khz} kHz</strong> (${c_phys.freq_hz.toLocaleString()} xung/giây) ${parseFloat(c_phys.freq_khz) < 2.5 ? '<br><small style="color:var(--accent-amber)">⚠️ Quá thưa</small>' : ''}</td>
                    <td class="col-std"><strong>${std_phys.freq_khz} kHz</strong> (${std_phys.freq_hz.toLocaleString()} xung/giây)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_duty}</strong></td>
                    <td class="col-user"><strong>${c_phys.duty_factor}%</strong> (1 mở : ${c_phys.Po} nghỉ)</td>
                    <td class="col-std"><strong>${std_phys.duty_factor}%</strong> (1 mở : ${std_phys.Po} nghỉ)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_we}</strong></td>
                    <td class="col-user"><strong>${c_phys.we_score} đv</strong> (≈ <strong>${c_phys.we_mj} mJ</strong>${weNote})</td>
                    <td class="col-std"><strong>${std_phys.we_score} đv</strong> (≈ <strong>${std_phys.we_mj} mJ</strong>)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_ptb}</strong></td>
                    <td class="col-user"><strong>${c_phys.power_watts} W</strong> (≈ ${c_phys.power_score.toLocaleString()} đv/s)</td>
                    <td class="col-std"><strong>${std_phys.power_watts} W</strong> (≈ ${std_phys.power_score.toLocaleString()} đv/s)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_itb}</strong></td>
                    <td class="col-user"><strong>≈ ${c_phys.i_tb_high} A</strong> (Tủ công suất cao) <br><small style="color:var(--text-secondary)">≈ ${c_phys.i_tb_std} A (Tủ tiêu chuẩn)</small></td>
                    <td class="col-std"><strong>≈ ${std_phys.i_tb_high} A</strong> (Tủ công suất cao) <br><small style="color:var(--text-secondary)">≈ ${std_phys.i_tb_std} A (Tủ tiêu chuẩn)</small></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_fc}</strong></td>
                    <td class="col-user"><strong>${c_phys.speedArea} mm²/p</strong></td>
                    <td class="col-std"><strong>${std_phys.speedArea} mm²/p</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_ft}</strong></td>
                    <td class="col-user"><strong>${c_phys.feedRate} mm/p</strong></td>
                    <td class="col-std"><strong>${std_phys.feedRate} mm/p</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_time}</strong></td>
                    <td class="col-user"><strong>${formatTimeMinSec(c_phys.time_min)}</strong></td>
                    <td class="col-std"><strong>${formatTimeMinSec(std_phys.time_min)}</strong></td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_ra}</strong></td>
                    <td class="col-user">${c_phys.Ra} μm${raNote}</td>
                    <td class="col-std">${std_phys.Ra} μm</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_gap}</strong></td>
                    <td class="col-user">≈ ${c_phys.sparkGap} mm</td>
                    <td class="col-std">≈ ${std_phys.sparkGap} mm (Chuẩn)</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_diff}</strong></td>
                    <td class="col-user">${gapDiff > 1 ? `⚠️ LẸM (ÂM) ${gapDiff} μm` : (gapDiff < -1 ? `⚠️ DƯ DƯƠNG ${Math.abs(gapDiff)} μm` : `✅ Chuẩn xác ${stdRow.tolerance}`)}</td>
                    <td class="col-std">✅ Chuẩn xác ${stdRow.tolerance}</td>
                </tr>
                <tr>
                    <td class="col-metric"><strong>${m_wire}</strong></td>
                    <td class="col-user">${c_phys.ti > 55 ? '🔴 DÂY MÒN RẤT NHANH' : (c_phys.toff < 100 ? '⚠️ NGHẸT XỈ' : '🟢 An toàn, dây bền')}</td>
                    <td class="col-std">🟢 DÂY BỀN, TUỔI THỌ CAO</td>
                </tr>
            </tbody>
        `;

        // Render feedback nhận xét chuyên gia
        let feedbackHTML = '';
        if (state.compareMode === 'theory') {
            feedbackHTML = `<div class="feedback-alert feedback-good" style="margin-bottom:0;">
                📐 <strong>ĐỐI CHIẾU MÔ HÌNH NHIỆT ĐIỆN HỌC (tailieu.txt) vs THỰC TẾ HÃNG AUTOCUT:</strong><br>
                • <strong>Công thức Lý thuyết (tailieu.txt):</strong> <code>Fc = (60 × Cm × Ptb × η_eff) / B</code> = <strong>${c_phys.speedArea} mm²/p</strong> (Công suất $P_{tb} = ${c_phys.power_watts}\\text{W}$, thể tích bóc tách $MRR = ${c_phys.mrr_vol}\\text{ mm}^3/\\text{p}$, rãnh $B = ${c_phys.B}\\text{mm}$).<br>
                • <strong>Chuẩn Thực nghiệm AutoCut:</strong> $F_c = \\mathbf{${std_phys.speedArea}\\text{ mm}^2/\\text{p}}$ (Tốc độ tiến bàn $F_t = ${std_phys.feedRate}\\text{ mm/p}$).<br>
                • <strong>Nhận xét:</strong> Mô hình lý thuyết nhiệt bóc tách phản ánh chính xác quy luật vận hành của tủ nguồn số và động cơ Servo CNC AutoCut.
            </div>`;
        } else {
            const isExactMatch = (c_phys.ti === stdRow.ti && c_phys.Po === stdRow.Po && c_phys.IP === stdRow.IP && c_phys.Voltage === stdRow.Voltage && c_phys.VF === stdRow.VF);
            if (isExactMatch) {
                feedbackHTML = `<div class="feedback-alert feedback-good" style="margin-bottom:0;">
                    ✅ <strong>HỆ THỐNG VẬT LÝ ĐỒNG NHẤT:</strong> Bộ thông số bạn nhập trùng khớp hoàn toàn 100% với chiến lược <strong>${activeStrat.name}</strong>. Cùng một mô hình toán học, mọi chỉ số tốc độ bóc phôi (${c_phys.speedArea} mm²/p), dòng Ampe kế (${c_phys.i_tb_high}A), khe hở phóng điện và dung sai kích thước (${stdRow.tolerance}) đều đồng bộ hoàn hảo.
                </div>`;
            } else {
                feedbackHTML = `<span class="feedback-alert feedback-warn">🔍 ĐÁNH GIÁ KỸ THUẬT SO SÁNH VỚI ${activeStratName.toUpperCase()}:</span>`;
                feedbackHTML += `<ul style="padding-left:18px;margin-top:6px;">`;

                if (c_phys.we_score < std_phys.we_score) {
                    feedbackHTML += `<li><strong class="feedback-good">✨ Ưu tiên độ mịn bề mặt:</strong> Năng lượng 1 tia đơn nhỏ (${c_phys.we_mj} mJ) tạo miệng hố rỗ nông hơn, độ bóng cao hơn (${c_phys.Ra} μm), giảm độ mòn dây Molypden.</li>`;
                } else if (c_phys.we_score > std_phys.we_score) {
                    feedbackHTML += `<li><strong>Năng lượng xung lớn:</strong> Năng lượng tia đơn (${c_phys.we_mj} mJ) tạo hố ăn mòn sâu hơn, giúp bóc phôi nhanh hơn (${c_phys.speedArea} mm²/p) nhưng bề mặt thô hơn (${c_phys.Ra} μm).</li>`;
                }

                if (gapDiff > 1) {
                    feedbackHTML += `<li><strong>Cảnh báo sai lệch kích thước:</strong> Do khe hở tia lửa bị nở rộng thêm <strong>+${gapDiff} micron</strong> so với chế độ đang đối chiếu, nếu dùng Offset mặc định thì chi tiết sẽ bị <strong>LẸM PHÔI</strong>. Cần bù thêm Offset thành <strong>${(0.090 + parseFloat(c_phys.sparkGap)).toFixed(3)} mm</strong>.</li>`;
                } else if (gapDiff < -1) {
                    feedbackHTML += `<li><strong>Cảnh báo phôi dư dương:</strong> Do khe hở nhỏ hơn <strong>${Math.abs(gapDiff)} micron</strong>, phôi cắt ra sẽ hơi dày hơn một chút (thích hợp để cạo sửa hoặc mài phẳng).</li>`;
                } else {
                    feedbackHTML += `<li><strong class="feedback-good">Đánh giá chung:</strong> Bộ thông số bạn chọn rất cân đối, nằm an toàn trong dải gia công ổn định của máy.</li>`;
                }

                feedbackHTML += `</ul>`;
            }
        }
        analysisFeedbackBox.innerHTML = feedbackHTML;
        if (typeof wsAnalysisFeedbackBox !== "undefined" && wsAnalysisFeedbackBox) { wsAnalysisFeedbackBox.innerHTML = feedbackHTML; }

        // 2. RENDER BẢNG HIỆU CHỈNH THỰC TẾ XƯỞNG ĐỘC LẬP (WORKSHOP CALIBRATION ENGINE)
        if (workshopTableElement) {
            const wData = calculateWorkshopEDM(state);
            workshopTableElement.innerHTML = `
                <thead>
                    <tr>
                        <th class="col-metric">${isCompact ? 'Tiêu chí' : 'Tiêu chí Công nghệ'}</th>
                        <th class="col-actual">Thông số Thực nghiệm Xưởng của bạn (Workshop Actual)</th>
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
                        <td class="col-actual"><strong>${wData.power_watts} W</strong> (Thể tích bóc phôi: ${wData.mrr_vol} mm³/p)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_itb}</strong></td>
                        <td class="col-actual"><strong>≈ ${wData.i_tb_high} A</strong> (Đồng hồ cơ tại xưởng) <br><small style="color:var(--text-secondary)">≈ ${wData.i_tb_std} A (Tủ tiêu chuẩn)</small></td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_fc}</strong></td>
                        <td class="col-actual"><strong>${wData.speedArea} mm²/p</strong> (Bình quân) <br><small style="color:var(--text-secondary)">Dao động tức thời: 70 - 100 mm²/p</small></td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_ft}</strong></td>
                        <td class="col-actual"><strong>${wData.feedRate} mm/p</strong> (Phôi H=${H}mm)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_time}</strong></td>
                        <td class="col-actual"><strong>${formatTimeMinSec(wData.time_min)}</strong> (Chu vi L=${L}mm)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_ra}</strong></td>
                        <td class="col-actual">${wData.Ra} μm (Bề mặt cắt thô xả xỉ đều)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_gap}</strong></td>
                        <td class="col-actual">≈ ${wData.sparkGap} mm (Rãnh cắt B ≈ ${wData.kerfB} mm)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_diff}</strong></td>
                        <td class="col-actual">📏 Bù dao: <strong>${wData.offset} mm</strong> (Chuẩn xác ±0.005mm)</td>
                    </tr>
                    <tr>
                        <td class="col-metric"><strong>${m_wire}</strong></td>
                        <td class="col-actual">🟢 Dây Molypden chạy êm, xả xỉ thông thoáng</td>
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
                            <strong>${leftColTitle}:</strong><br>
                            • Toff = ${c_phys.ti} × ${c_phys.Po} = <strong>${c_phys.toff} μs</strong><br>
                            • Chu kỳ T = ${c_phys.ti} + ${c_phys.toff} = <strong>${c_phys.cycle} μs</strong> (${c_phys.cycle_ms} ms)
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            • Toff = ${std_phys.ti} × ${std_phys.Po} = <strong>${std_phys.toff} μs</strong><br>
                            • Chu kỳ T = ${std_phys.ti} + ${std_phys.toff} = <strong>${std_phys.cycle} μs</strong> (${std_phys.cycle_ms} ms)
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
                            <strong>${leftColTitle}:</strong><br>
                            f = 10⁶ / ${c_phys.cycle} = <strong>${c_phys.freq_khz} kHz</strong> (${c_phys.freq_hz.toLocaleString()} tia/giây)
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            f = 10⁶ / ${std_phys.cycle} = <strong>${std_phys.freq_khz} kHz</strong> (${std_phys.freq_hz.toLocaleString()} tia/giây)
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
                            <strong>${leftColTitle}:</strong><br>
                            η = (${c_phys.ti} / ${c_phys.cycle}) × 100% = <strong>${c_phys.duty_factor}%</strong> (1 mở : ${c_phys.Po} nghỉ)
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            η = (${std_phys.ti} / ${std_phys.cycle}) × 100% = <strong>${std_phys.duty_factor}%</strong> (1 mở : ${std_phys.Po} nghỉ)
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
                            <strong>${leftColTitle}:</strong><br>
                            • Ipeak = ${c_phys.IP} × 2.8A = ${c_phys.i_peak} A<br>
                            • We = (${c_phys.u_arc}V × ${c_phys.i_peak}A × ${c_phys.ti}μs) / 1000 = <strong>${c_phys.we_mj} mJ</strong> (Điểm: ${c_phys.we_score} đv)
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            • Ipeak = ${std_phys.IP} × 2.8A = ${std_phys.i_peak} A<br>
                            • We = (${std_phys.u_arc}V × ${std_phys.i_peak}A × ${std_phys.ti}μs) / 1000 = <strong>${std_phys.we_mj} mJ</strong> (Điểm: ${std_phys.we_score} đv)
                        </div>
                    </div>
                </div>

                <!-- BƯỚC 5: CÔNG SUẤT ĐIỆN PHÁT TRONG 1S Ptb -->
                <div class="lecture-step">
                    <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 5</span> Năng lượng phát trong 1s (Công suất trung bình Ptb) &amp; Dòng Ampe</div>
                    <p><strong>Bản chất:</strong> Tổng năng lượng điện phát ra trên rãnh cắt mỗi giây và dòng điện trung bình chỉ thị trên kim đồng hồ cơ.</p>
                    <div class="lecture-formula-box">
                        • Công suất: Ptb = f(Hz) × [We(mJ) / 1000] = η × Uarc × Ipeak (Watts = J/s)<br>
                        • Dòng Ampe kế: Itb = Ipeak × η × k(phóng) (≈ 3.8 - 4.3A với tủ lớn; ≈ 1.3 - 1.5A với tủ nhỏ)
                    </div>
                    <div class="lecture-calc-grid">
                        <div class="lecture-calc-col custom-col">
                            <strong>${leftColTitle}:</strong><br>
                            • Công suất Ptb = <strong>${c_phys.power_watts} W</strong><br>
                            • Đồng hồ Ampe cơ: <strong>≈ ${c_phys.i_tb_high} A</strong> (Tủ lớn) | ≈ ${c_phys.i_tb_std} A (Tủ chuẩn)
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            • Công suất Ptb = <strong>${std_phys.power_watts} W</strong><br>
                            • Đồng hồ Ampe cơ: <strong>≈ ${std_phys.i_tb_high} A</strong> (Tủ lớn) | ≈ ${std_phys.i_tb_std} A (Tủ chuẩn)
                        </div>
                    </div>
                </div>

                <!-- BƯỚC 6: TỐC ĐỘ CẮT DIỆN TÍCH Fc & TỐC ĐỘ TIẾN BÀN Ft -->
                <div class="lecture-step">
                    <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 6</span> Tốc độ cắt diện tích (Fc), Tốc độ tiến bàn (Ft) &amp; Thời gian cắt</div>
                    <p><strong>Quy luật bóc phôi phi tuyến:</strong> Thể tích bóc phôi theo năng lượng nhiệt xung EDM kết hợp với cơ cấu chạy Servo.</p>
                    <div class="lecture-formula-box">
                        • Lý thuyết (tailieu.txt): Fc = (60 × Cm × Ptb × η_eff) / B (mm²/phút)<br>
                        • Tốc độ tiến bàn: Ft = Fc / H (mm/phút)<br>
                        • Thời gian cắt chi tiết: t(cắt) = L / Ft (phút)
                    </div>
                    <div class="lecture-calc-grid">
                        <div class="lecture-calc-col custom-col">
                            <strong>${leftColTitle}:</strong><br>
                            • Tốc độ diện tích: Fc = <strong>${c_phys.speedArea} mm²/p</strong><br>
                            • Tốc độ tiến bàn (H=${H}mm): Ft = ${c_phys.speedArea}/${H} = <strong>${c_phys.feedRate} mm/p</strong><br>
                            • Thời gian (L=${L}mm): t = ${L}/${c_phys.feedRate} = <strong>${formatTimeMinSec(c_phys.time_min)}</strong>
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            • Tốc độ diện tích: Fc = <strong>${std_phys.speedArea} mm²/p</strong><br>
                            • Tốc độ tiến bàn (H=${H}mm): Ft = ${std_phys.speedArea}/${H} = <strong>${std_phys.feedRate} mm/p</strong><br>
                            • Thời gian (L=${L}mm): t = ${L}/${std_phys.feedRate} = <strong>${formatTimeMinSec(std_phys.time_min)}</strong>
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
                            <strong>${leftColTitle}:</strong><br>
                            • Khe hở: δ ≈ <strong>${c_phys.sparkGap} mm</strong><br>
                            • Đánh giá sai số: <strong>${gapDiff > 1 ? `Lẹm âm -${gapDiff} μm` : (gapDiff < -1 ? `Dư dương +${Math.abs(gapDiff)} μm` : 'Chuẩn xác ±0.005mm')}</strong><br>
                            • Độ nhám bề mặt: <strong>Ra ≈ ${c_phys.Ra} μm</strong>
                        </div>
                        <div class="lecture-calc-col std-col">
                            <strong>${activeStratName}:</strong><br>
                            • Khe hở: δ ≈ <strong>${std_phys.sparkGap} mm</strong><br>
                            • Đánh giá sai số: <strong>✅ Chuẩn xác ${stdRow.tolerance}</strong><br>
                            • Độ nhám bề mặt: <strong>Ra ≈ ${std_phys.Ra} μm (Đều, mịn)</strong>
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

        if (typeof configSummary !== 'undefined' && configSummary) {
            configSummary.textContent = `${matLabel} | H = ${state.thickness} mm | ${passLabel} | Chiến lược: ${strat.name}`;
        }
        if (typeof wsConfigSummary !== 'undefined' && wsConfigSummary) {
            wsConfigSummary.textContent = `Hiệu chuẩn theo máy thực tế xưởng | ${matLabel} | H = ${state.thickness} mm | ${passLabel} | Chiến lược: ${strat.name}`;
        }

        // Compute parameters
        const { rows, totalMinutes, notices } = calculateEDM(state);
        const wsCalc = calculateWorkshopEDM(state);

        // Render Table Body (Tab 1)
        if (typeof tableBody !== 'undefined' && tableBody) {
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
                    <td class="val-ra">${r.Ra}</td>
                    <td class="val-tolerance">${r.tolerance}</td>
                </tr>
            `).join('');
        }

        // Render Workshop Table Body (Tab 2)
        if (typeof wsTableBody !== 'undefined' && wsTableBody) {
            const wsRowsList = generateWorkshopRows(state);
            wsTableBody.innerHTML = wsRowsList.map((r, idx) => `
                <tr>
                    <td class="pass-cell sticky-col"><span class="pass-badge ${r.badgeClass}">${r.passName}</span></td>
                    <td><strong>${r.ti}</strong></td>
                    <td>${r.Po}</td>
                    <td><span class="badge-ip">${r.IP}</span></td>
                    <td><span class="${r.Voltage === 'High' ? 'val-volt-high' : 'val-volt-low'}">${r.Voltage}</span></td>
                    <td>${r.VF}</td>
                    <td>${r.Wire}</td>
                    <td class="val-offset fw-bold" style="color:var(--accent-amber)">${r.offsetText} mm</td>
                    <td><span style="color:var(--accent-amber)">${r.speedArea}</span></td>
                    <td><strong style="color:var(--accent-amber)">${r.speedAreaH40}</strong></td>
                    <td><strong style="color:var(--accent-amber)">${r.hz} Hz</strong></td>
                    <td><strong style="color:var(--accent-amber)">${r.ampe}</strong></td>
                    <td class="val-ra">${r.Ra}</td>
                </tr>
            `).join('');
        }
        // Render Notices
        if (typeof noticeList !== 'undefined' && noticeList) {
            noticeList.innerHTML = notices.map(n => `<li>${n}</li>`).join('');
        }
        
        // Render Dedicated Workshop Notices (Rule 12 & Rule 15)
        const wsNoticeList = document.getElementById('ws-notice-list');
        if (typeof wsNoticeList !== 'undefined' && wsNoticeList) {
            const wsNotices = [];
            const wsStrat = WS_STRATEGY_CONFIGS[state.wsStrategyLevel] || WS_STRATEGY_CONFIGS[4];
            
            // Strategy specific physics guidance (7 Levels with Regular 0.5 - 0.7A Steps)
            const curLvl = state.wsStrategyLevel || 4;
            if (curLvl === 1) {
                wsNotices.push("💎 <strong>Cực hạn siêu mịn (Cấp 1/7):</strong> Dòng kim Ampe giảm ~1.8A (còn 0.7 - 0.9A tại H30). Vi xung nano, hạ IP tối thiểu (1 sò), Volt Low. Khuyên dùng <strong>Wire 2 hoặc 3</strong> để đạt độ bóng gương $Ra \le 1.0 - 1.2\mu m$.");
            } else if (curLvl === 2) {
                wsNotices.push("✨ <strong>Siêu mịn (Cấp 2/7):</strong> Dòng kim Ampe giảm ~1.2A (còn 1.3 - 1.5A tại H30). Hạ IP 1-2 sò, dập xung Ton cực ngắn, Po kéo dài nghỉ sâu, $Ra \le 1.4 - 1.8\mu m$.");
            } else if (curLvl === 3) {
                wsNotices.push("🌟 <strong>Bề mặt mịn (Cấp 3/7):</strong> Dòng kim Ampe giảm đúng 0.5 - 0.7A (đạt 2.0 - 2.2A tại H30). Kéo dài Po để nước xối rửa sạch 100% xỉ, triệt tiêu đánh lửa thứ cấp, $Ra \le 1.8 - 2.2\mu m$.");
            } else if (curLvl === 4) {
                wsNotices.push("⭐ <strong>Tiêu chuẩn Chuẩn xưởng (Cấp 4/7):</strong> Điểm neo trung tâm Rule 12 (đúng 2.7A tại H30). Cân bằng tối ưu giữa tốc độ cắt, độ phẳng mép và độ bền dây Moly.");
            } else if (curLvl === 5) {
                wsNotices.push("🚀 <strong>Năng suất Cắt nhanh (Cấp 5/7):</strong> Dòng kim Ampe tăng đúng 0.5 - 0.7A (đạt 3.2 - 3.4A tại H30). Rút ngắn Po 1 nấc tăng tần số xung, tăng nhẹ Ton và VF, giữ IP an toàn chống đứt dây.");
            } else if (curLvl === 6) {
                wsNotices.push("⚡ <strong>Năng suất cao Rất nhanh (Cấp 6/7):</strong> Dòng kim Ampe tăng ~1.2A (đạt 3.8 - 4.0A tại H30). Rút ngắn Po 2 nấc, ép servo VF bám sát phôi, tăng tốc vượt trội 35-45%.");
            } else if (curLvl === 7) {
                wsNotices.push("🔥 <strong>Siêu năng suất Phá thô (Cấp 7/7):</strong> Dòng kim Ampe tăng ~1.8A (đạt 4.3 - 4.6A tại H30). Rút ngắn Po tối đa và ép VF cực đại. <em>Yêu cầu:</em> Áp lực nước xối cực mạnh để làm mát liên tục.");
            }

            // Material specific notices
            if (state.material === 'SCM420') {
                wsNotices.push("🛡️ <strong>Thép mềm SCM420 (HB &lt; 200):</strong> Phoi dẻo dễ dính bám. Hệ thống đã tự động tăng Po thêm 1 nấc và giảm VF để giữ khoảng cách phóng điện an toàn, chống đoản mạch.");
            } else if (state.material === 'SCM440') {
                wsNotices.push("💎 <strong>Thép tôi cứng SCM440 (28-32 HRC):</strong> Thoát xỉ giòn rất trơn tru. Hệ thống tăng Ton và VF giúp nâng cao tốc độ cắt và bề mặt phẳng sáng bóng.");
            } else if (state.material === 'ALUMINUM') {
                wsNotices.push("⚙️ <strong>Nhôm (Al 6061/7075):</strong> Tốc độ bóc phoi cực nhanh. Cần dùng dung dịch dầu cắt dây loãng hơn và tăng xối rửa để xỉ nhôm không bết dính vào puly dẫn dây.");
            } else if (state.material === 'COPPER') {
                wsNotices.push("⚡ <strong>Đồng đỏ / Đồng thau:</strong> Tản nhiệt rất nhanh. Cần áp lực xung điện bám tải ổn định để duy trì kênh hồ quang không bị tắt giữa chừng.");
            }

            // Ultra thick notice
            if (state.thickness > 160) {
                wsNotices.push("📏 <strong>Phôi siêu dày (H &gt; 160mm):</strong> Đã kích hoạt 6 sò công suất (IP=6 kịch trần). Năng suất cắt được điều khiển tối ưu thông qua biến thiên chu kỳ nghỉ Po và điện áp theo dõi VF.");
            }

            // Multi-pass notice
            if (state.passCount === 2) {
                wsNotices.push("🎯 <strong>Quy trình 2 Pass chuẩn xác:</strong> Pass 1 phá thô xẻ rãnh chừa lượng phôi $O_2 = 0.022\text{mm}$; Pass 2 vi xung siêu mịn lướt sạch gờ nhám, đưa kích thước về chuẩn tuyệt đối.");
            }

            wsNoticeList.innerHTML = wsNotices.map(n => `<li>${n}</li>`).join('');
        }

        // Render Total Time
        if (typeof totalTimeText !== 'undefined' && totalTimeText) {
            if (totalMinutes < 60) {
                totalTimeText.textContent = `${totalMinutes.toFixed(1)} phút`;
            } else {
                const hrs = Math.floor(totalMinutes / 60);
                const mins = Math.round(totalMinutes % 60);
                totalTimeText.textContent = `${hrs} giờ ${mins} phút (~${totalMinutes.toFixed(0)}p)`;
            }
        }

        if (typeof wsTotalTimeText !== 'undefined' && wsTotalTimeText) {
            const wsTimeMins = parseFloat(wsCalc.time_min);
            if (wsTimeMins < 60) {
                wsTotalTimeText.textContent = `${wsTimeMins.toFixed(1)} phút`;
            } else {
                const hrs = Math.floor(wsTimeMins / 60);
                const mins = Math.round(wsTimeMins % 60);
                wsTotalTimeText.textContent = `${hrs} giờ ${mins} phút (~${wsTimeMins.toFixed(0)}p)`;
            }
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
        let text = `AUTOCUT EDM SERVO - BẢNG THÔNG SỐ CẮT (TAB 1 CHUẨN HÃNG)\n`;
        text += `Vật liệu: ${matLabel} | Chiều dày H: ${state.thickness}mm | Quy trình: ${state.passCount} Pass | Chiến lược: ${strat.name}\n\n`;
        text += `P\tTon\tToff\tIP\tV\tVF\tWire\tOFFSET\tFc(mm2/p)\tRa\tSai số\n`;
        
        rows.forEach(r => {
            text += `${r.passName}\t${r.ti}\t${r.Po}\t${r.IP}\t${r.Voltage}\t${r.VF}\t${r.Wire}\t${r.offsetText}\t${r.speedArea}\t${r.Ra}\t${r.tolerance}\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
            btnCopyTable.textContent = '✅ Đã Copy!';
            setTimeout(() => {
                btnCopyTable.textContent = '📋 Copy Bảng';
            }, 2000);
        });
    }

    function copyWorkshopTableToClipboard() {
        const wsRows = generateWorkshopRows(state);
        const strat = WS_STRATEGY_CONFIGS[state.wsStrategyLevel] || WS_STRATEGY_CONFIGS[4];
        const matNames = {
            'SCM420': 'Thép mềm SCM420 (HB<200)',
            'SCM440': 'Thép tôi SCM440 (28-32HRC)',
            'COPPER': 'Đồng (Cu/Thau)',
            'ALUMINUM': 'Nhôm (Al 6061/7075)'
        };
        const matLabel = matNames[state.material] || state.material;
        let text = `AUTOCUT EDM SERVO - BẢNG HIỆU CHỈNH THỰC TẾ XƯỞNG (TAB 2)\n`;
        text += `Vật liệu: ${matLabel} | Chiều dày H: ${state.thickness}mm | Quy trình: ${state.passCount} Pass | Chế độ: ${strat.name}\n\n`;
        text += `P\tTon\tToff\tIP\tV\tVF\tWire\tOFFSET\tFc thực(mm2/p)\tFc máy H40(mm2/p)\tGiới hạn(Hz)\tAmpe(A)\tRa\n`;
        
        wsRows.forEach(r => {
            text += `${r.passName}\t${r.ti}\t${r.Po}\t${r.IP}\t${r.Voltage}\t${r.VF}\t${r.Wire}\t${r.offsetText}\t${r.speedArea}\t${r.speedAreaH40}\t${r.hz || '--'}\t${r.ampe}\t${r.Ra}\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
            if (wsBtnCopyTable) {
                wsBtnCopyTable.textContent = '✅ Đã Copy!';
                setTimeout(() => {
                    wsBtnCopyTable.textContent = '📋 Copy Bảng';
                }, 2000);
            }
        });
    }

    // ==========================================
    // 7. PWA OFFLINE MODE & AUTO-SYNC ENGINE
    // ==========================================
    const CURRENT_VERSION = "3.4.69";

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

            // =========================================================================
            // RENDER THƯ VIỆN THỰC NGHIỆM XƯỞNG (6 SUB-TABS: 1 PASS ĐẾN 6 PASS)
            // Chuẩn hóa:
            // 1. Tên vật liệu rút gọn: SCM420 -> HB<200, SCM440 -> 30HRC
            // 2. Loại bỏ các trường hợp không cắt được (lưu trữ đầy đủ ở WORKSHOP_DATA_BANK.md)
            // 3. Cột H & Vật liệu chỉ ghi ở dòng Pass 1, H được đánh dấu bằng .h-badge
            // 4. Tự động sắp xếp trật tự theo chiều dày H tăng dần (Ascending Sort Engine)
            // 5. Cố định thead sticky không trôi khi cuộn, phân biệt mẻ cắt bằng 2 màu nền
            // =========================================================================
                        const WS_LIB_BENCHMARK_JOBS = {
                1: [
                    { H: 12, material: "30HRC", passes: [{ Ton: 20, Toff: 7, IP: 2, Wire: 2, Volt: "L", VF: 50, maxSpeed: "200Hz", offset: "0,105", actualOffset: "0,105", calcOffset: "0,0997", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "1,3A - 1,5A", calcAmpe: "1.3A", actualSpeed: "--", calcSpeedH40: "97 mm²/p" }] },
                    { H: 30, material: "30HRC", passes: [{ Ton: 32, Toff: 5, IP: 4, Wire: 1, Volt: "H", VF: 65, maxSpeed: "200Hz", offset: "0,098", actualOffset: "0,098", calcOffset: "0,0975", length: "30mm", actualTime: "8p40'", calcTime: "8p42'", actualAmpe: "4,45A - 4,5A", calcAmpe: "4.3A", actualSpeed: "165-175 mm²/p", calcSpeedH40: "138 mm²/p" }] },
                    { H: 40, material: "30HRC", passes: [{ Ton: 36, Toff: 5, IP: 4, Wire: 1, Volt: "H", VF: 65, maxSpeed: "180Hz", offset: "0,098", actualOffset: "0,098", calcOffset: "0,0961", length: "30mm", actualTime: "9p36'", calcTime: "9p36'", actualAmpe: "4,35A - 4,4A", calcAmpe: "4.3A", actualSpeed: "130-140 mm²/p", calcSpeedH40: "125 mm²/p" }] },
                    { H: 45, material: "HB<200", passes: [{ Ton: 50, Toff: 7, IP: 3, Wire: 1, Volt: "L", VF: 50, maxSpeed: "150Hz", offset: "0,105", actualOffset: "0,105", calcOffset: "0,0974", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "2,2A - 2,5A", calcAmpe: "2.0A", actualSpeed: "--", calcSpeedH40: "52 mm²/p" }] },
                    { H: 63, material: "HB<200", passes: [{ Ton: 44, Toff: 7, IP: 5, Wire: 1, Volt: "H", VF: 55, maxSpeed: "150Hz", offset: "0,095", actualOffset: "0,095", calcOffset: "0,0976", length: "27mm", actualTime: "14p20'", calcTime: "14p24'", actualAmpe: "4,1A - 4,2A", calcAmpe: "4.0A", actualSpeed: "75-85 mm²/p", calcSpeedH40: "75 mm²/p" }] },
                                        { H: 68, material: "30HRC", passes: [{ Ton: 70, Toff: 7, IP: 3, Wire: 1, Volt: "L", VF: 50, maxSpeed: "100Hz", offset: "0,097", actualOffset: "0,097", calcOffset: "0,0945", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "2,4A - 2,6A", calcAmpe: "2.0A", actualSpeed: "--", calcSpeedH40: "43 mm²/p" }] },
                    // H=85 (Quy đổi từ Pass 1 bài cắt 2P-10 có đo kiểm vách P1)
                    { H: 85, material: "30HRC", fromMultiPass: true, passes: [{ Ton: 70, Toff: 8, IP: 5, Wire: 1, Volt: "H", VF: 61, maxSpeed: "150Hz", offset: "0,1025", actualOffset: "0,1025", calcOffset: "0,0987", length: "65,6mm", actualTime: "48p", calcTime: "47p43'", actualAmpe: "3,6A - 3,7A", calcAmpe: "3.6A", actualSpeed: "55-65 mm²/p", calcSpeedH40: "55 mm²/p" }] },
                    { H: 140, material: "HB<200", passes: [{ Ton: 120, Toff: 8, IP: 5, Wire: 1, Volt: "H", VF: 55, maxSpeed: "50Hz", offset: "0,095", actualOffset: "0,095", calcOffset: "0,0992", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "3,5A - 3,8A", calcAmpe: "3.6A", actualSpeed: "--", calcSpeedH40: "34 mm²/p" }] },
                    { H: 140, material: "HB<200", passes: [{ Ton: 100, Toff: 9, IP: 6, Wire: 1, Volt: "H", VF: 60, maxSpeed: "100Hz", offset: "0,102", actualOffset: "0,102", calcOffset: "0,105", length: "28,4mm", actualTime: "36p", calcTime: "35p30'", actualAmpe: "3,7A - 3,8A", calcAmpe: "3.8A", actualSpeed: "30-40 mm²/p", calcSpeedH40: "32 mm²/p" }] },
                    { H: 160, material: "HB<200", passes: [{ Ton: 120, Toff: 8, IP: 5, Wire: 1, Volt: "H", VF: 55, maxSpeed: "50Hz", offset: "0,110", actualOffset: "0,110", calcOffset: "0,0978", length: "--", actualTime: "--", calcTime: "--", actualAmpe: "3,5A - 3,8A", calcAmpe: "3.6A", actualSpeed: "--", calcSpeedH40: "29 mm²/p" }] },
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

            let wsLibCurrentTab = 1;

            function renderWsLibSubTab(tabPass) {
                wsLibCurrentTab = tabPass;
                const libBodyContainer = document.getElementById('ws-lib-subtab-content');
                if (!libBodyContainer) return;

                // Update tab buttons active class
                const tabBtns = document.querySelectorAll('.ws-lib-tab-btn');
                tabBtns.forEach(btn => {
                    const p = parseInt(btn.dataset.tabPass, 10);
                    if (p === tabPass) btn.classList.add('active');
                    else btn.classList.remove('active');
                });

                const rawJobs = WS_LIB_BENCHMARK_JOBS[tabPass] || [];
                
                // 1. Tự động loại bỏ các bài cắt không thực hiện được (Không cắt được)
                const validJobs = rawJobs.filter(job => !job.passes.some(p => p.calcSpeed === "Không cắt được"));

                // 2. Tự động sắp xếp tuần tự theo chiều dày H tăng dần (Ascending Sort)
                const sortedJobs = [...validJobs].sort((a, b) => a.H - b.H);

                if (sortedJobs.length === 0) {
                    libBodyContainer.innerHTML = `
                        <div class="ws-lib-empty-state">
                            <i class="fa fa-clipboard-list"></i>
                            <h4 style="margin: 0 0 8px 0; color: #f1f5f9; font-size: 15px;">Chưa có dữ liệu thực nghiệm xưởng cho chế độ ${tabPass} Pass</h4>
                            <p style="font-size: 12px; color: #94a3b8; max-width: 500px; margin: 0 auto;">Khi bạn thực hiện bài cắt mới tại xưởng và cung cấp kết quả đo kiểm, dữ liệu sẽ được chuẩn hóa và tự động sắp xếp ngay vào bảng này.</p>
                        </div>
                    `;
                    return;
                }

                let subtabNoteHtml = '';
                if (tabPass === 1) {
                    subtabNoteHtml = `
                        <div style="margin-bottom: 10px; font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                            <span style="display: inline-flex; align-items: center; gap: 5px;"><span class="h-badge">H</span> Mẫu cắt 1 Pass chuẩn</span>
                            <span style="display: inline-flex; align-items: center; gap: 5px;"><span class="h-badge h-badge-multipass">H</span> Mẫu quy đổi từ Pass 1 (Cắt 2 Pass có đo kiểm kích thước sau P1)</span>
                        </div>
                    `;
                }

                let bannerHtml = '';
                if (tabPass === 5) {
                    bannerHtml = `
                        <div class="ws-lib-status-banner" style="background: rgba(34, 197, 94, 0.12); border-color: rgba(34, 197, 94, 0.35); color: #4ade80;">
                            <i class="fa fa-check-circle"></i>
                            <span><strong>Đã hoàn thành kiểm chứng thực nghiệm 5 Pass tại xưởng (H=12mm, SCM440):</strong> Cắt chày chu vi 128mm, tổng thời gian 1h45p. Đo Panme: P1=54,08mm &rarr; P2=54,045mm &rarr; P5=54,030mm (to hơn lập trình 0,030mm). Offset Pass 1 chuẩn hiệu chỉnh: <strong>0,093mm</strong>.</span>
                        </div>
                    `;
                }

                // Render rows with alternating zebra striping per job, H badge on Pass 1 only
                let tableRowsHtml = '';
                sortedJobs.forEach((job, jobIdx) => {
                    const jobClass = jobIdx % 2 === 0 ? 'job-even' : 'job-odd';
                    job.passes.forEach((p, passIdx) => {
                        const matLabel = passIdx === 0 ? job.material : '';
                        const hBadgeClass = job.fromMultiPass ? 'h-badge h-badge-multipass' : 'h-badge';
                        const hTitle = job.fromMultiPass ? ' title="Quy đổi từ Pass 1 (Cắt 2 Pass có đo kiểm vách sau P1)"' : '';
                        const hLabel = passIdx === 0 ? `<span class="${hBadgeClass}"${hTitle}>${job.H}</span>` : '';
                        const voltClass = p.Volt === 'H' || p.Volt === 'High' ? 'col-volt-h' : 'col-volt-l';

                        tableRowsHtml += `
                            <tr class="${jobClass}">
                                <td class="col-mat">${matLabel}</td>
                                <td class="col-h">${hLabel}</td>
                                <td>${p.Ton}</td>
                                <td>${p.Toff}</td>
                                <td>${p.IP}</td>
                                <td>${p.Wire}</td>
                                <td class="${voltClass}">${p.Volt}</td>
                                <td>${p.VF}</td>
                                <td><strong>${p.maxSpeed}</strong></td>
                                <td class="col-offset-act">${p.actualOffset || p.offset}</td>
                                <td class="col-offset-calc">${p.calcOffset || '--'}</td>
                                <td>${p.length}</td>
                                <td class="col-time-act">${p.actualTime || p.time || '--'}</td>
                                <td class="col-time-calc" style="color: #38bdf8; font-weight: 600;">${p.calcTime || '--'}</td>
                                <td class="col-ampe-act" style="color: #f59e0b; font-weight: 600;">${p.actualAmpe || p.ampe || '--'}</td>
                                <td class="col-ampe-calc" style="color: #fbbf24; font-weight: 500;">${p.calcAmpe || '--'}</td>
                                <td class="col-speed-act" style="color: #38bdf8; font-weight: 500;">${p.actualSpeed || '--'}</td>
                                <td class="col-speed-h40" style="color: var(--accent-amber); font-weight: 600;">${p.calcSpeedH40}</td>
                            </tr>
                        `;
                    });
                });

                libBodyContainer.innerHTML = `
                    ${bannerHtml}
                    ${subtabNoteHtml}
                    <div class="ws-lib-table-container">
                        <table class="ws-lib-data-table">
                            <thead>
                                <tr>
                                    <th>Vật Liệu</th>
                                    <th>H</th>
                                    <th>Ton</th>
                                    <th>Toff</th>
                                    <th>IP</th>
                                    <th>Wire</th>
                                    <th>Volt</th>
                                    <th>VF</th>
                                    <th>Max Speed</th>
                                    <th>Offset thực tế</th>
                                    <th>Offset tính toán</th>
                                    <th>chiều dài cắt</th>
                                    <th>thời gian thực</th>
                                    <th>thời gian tính</th>
                                    <th>A thực tế</th>
                                    <th>A tính toán</th>
                                    <th>Fc thực tế</th>
                                    <th>Fc tính (H40)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsHtml}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            const workshopLibContainer = document.getElementById('ws-workshop-library-container');
            if (workshopLibContainer) {
                workshopLibContainer.innerHTML = `
                    <div class="workshop-lib-header" id="ws-lib-toggle-btn" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 10px 15px; border-radius: 6px; border-left: 4px solid var(--accent);">
                        <h4 style="margin: 0; color: var(--accent); font-size: 1.1em; display: flex; align-items: center; gap: 8px;"><i class="fa fa-book"></i> THƯ VIỆN THÔNG SỐ CẮT THỰC TẾ XƯỞNG (BENCHMARK GROUND TRUTH)</h4>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span class="lib-offline-badge">6 Chế Độ Cắt</span>
                            <i id="ws-lib-toggle-icon" class="fa fa-chevron-down" style="color: var(--accent); transition: transform 0.3s; transform: rotate(180deg);"></i>
                        </div>
                    </div>
                    <div id="ws-lib-content" style="margin-top: 15px;">
                        <div class="ws-lib-tabs-nav">
                            <button class="ws-lib-tab-btn active" data-tab-pass="1">1 Pass <span class="ws-lib-tab-count">12 bài</span></button>
                            <button class="ws-lib-tab-btn" data-tab-pass="2">2 Pass <span class="ws-lib-tab-count">9 bài</span></button>
                            <button class="ws-lib-tab-btn" data-tab-pass="3">3 Pass <span class="ws-lib-tab-count">0</span></button>
                            <button class="ws-lib-tab-btn" data-tab-pass="4">4 Pass <span class="ws-lib-tab-count">0</span></button>
                            <button class="ws-lib-tab-btn" data-tab-pass="5">5 Pass <span class="ws-lib-tab-count">1 bài</span></button>
                            <button class="ws-lib-tab-btn" data-tab-pass="6">6 Pass <span class="ws-lib-tab-count">0</span></button>
                        </div>
                        <div id="ws-lib-subtab-content">
                            <!-- Injected by JavaScript -->
                        </div>
                    </div>
                `;

                // Initial render of sub-tab 1
                renderWsLibSubTab(1);

                // Add toggle collapse logic
                const toggleBtn = document.getElementById('ws-lib-toggle-btn');
                const libContent = document.getElementById('ws-lib-content');
                const libIcon = document.getElementById('ws-lib-toggle-icon');
                if (toggleBtn && libContent && libIcon) {
                    toggleBtn.addEventListener('click', () => {
                        if (libContent.style.display === 'none') {
                            libContent.style.display = '';
                            libIcon.style.transform = 'rotate(180deg)';
                        } else {
                            libContent.style.display = 'none';
                            libIcon.style.transform = 'rotate(0deg)';
                        }
                    });
                }

                // Add sub-tab click events
                const tabBtns = document.querySelectorAll('.ws-lib-tab-btn');
                tabBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const passNum = parseInt(btn.dataset.tabPass, 10);
                        renderWsLibSubTab(passNum);
                    });
                });
            }

    // INITIAL RENDER
    updateStrategyDisplay(state.strategyLevel);
        updateWsStrategyDisplay(state.wsStrategyLevel);
    render();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

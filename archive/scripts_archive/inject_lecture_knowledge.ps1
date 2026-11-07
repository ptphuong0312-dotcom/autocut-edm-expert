$lines = [System.IO.File]::ReadAllLines("app.js", [System.Text.Encoding]::UTF8)
$newLines = [System.Collections.Generic.List[string]]::new()

$lectureCode = @'
    // =========================================================================
    // HÀM RENDER BÀI GIẢNG ĐỘNG LỰC HỌC 7 BƯỚC (ĐỒNG BỘ 100% THEO THÔNG SỐ XƯỞNG)
    // =========================================================================
    function renderLectureKnowledge() {
        if (!lectureKnowledgeBody) return;
        const H = state.thickness || 40;
        const L = state.cutLength || 100;
        const wsRows = generateWorkshopRows(state);
        if (!wsRows || wsRows.length === 0) return;
        const r1 = wsRows[0];

        const Pon = r1.ti;
        const Poff = r1.Po;
        const IP = r1.IP;
        const Volt = r1.Voltage;
        const VF = r1.VF;
        const Wire = r1.Wire;

        const toff_us = Pon * (Poff + 1);
        const cycle_us = Pon * (Poff + 2);
        const cycle_ms = (cycle_us / 1000).toFixed(3);
        const freq_hz = Math.round(1000000 / cycle_us);
        const freq_khz = (freq_hz / 1000).toFixed(2);
        const duty_pct = ((1.0 / (Poff + 2)) * 100).toFixed(1);

        const i_peak = IP * 2.8;
        const u_arc = (Volt === 'Low' || Volt === 'L') ? 22 : 27;
        const we_mj = ((u_arc * i_peak * Pon) / 1000).toFixed(2);
        const power_watts = Math.round((1.0 / (Poff + 2)) * u_arc * i_peak);
        const calculatedAmpe = calcTheoreticalAmpe(IP, Poff, H, Volt).toFixed(1);

        const speedArea = r1.speedArea;
        const feedRate = r1.feedRate;
        const timeMin = ((L * H) / Math.max(1, speedArea));
        const timeStr = timeMin < 60 ? `${timeMin.toFixed(1)} phút` : `${Math.floor(timeMin/60)}h ${Math.round(timeMin%60)}p`;

        const offset_1p = r1.offsetText;
        const delta_1p = (parseFloat(offset_1p) - 0.090).toFixed(4);

        const strat = WS_STRATEGY_CONFIGS[state.wsStrategyLevel] || WS_STRATEGY_CONFIGS[4];
        const matName = (state.wsMaterial || 'SCM420') === 'SCM440' ? 'SCM440 (28-32 HRC)' : 'SCM420 (HB < 200)';

        lectureKnowledgeBody.innerHTML = `
            <div style="background: rgba(14, 165, 233, 0.08); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 16px;">
                <span style="color: var(--accent-cyan); font-weight: 700;">⚙️ Thông số đang khảo sát:</span> 
                <strong>${matName} | H = ${H}mm | ${strat.name} (Cấp ${state.wsStrategyLevel}/7) | Pon = ${Pon}μs, Poff = ${Poff}, IP = ${IP}, Volt = ${Volt}, VF = ${VF}</strong>
            </div>

            <!-- BƯỚC 1 -->
            <div class="lecture-step">
                <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 1</span> Thời gian nghỉ xả xỉ (Poff) &amp; Tổng chu kỳ 1 xung (T)</div>
                <p><strong>Bản chất:</strong> <code>Pon</code> là thời gian mở van MOSFET phóng điện. <code>Poff</code> (Po) là hệ số thời gian ngắt xung để nước khử ion hóa và đẩy mạt xỉ ra ngoài.</p>
                <div class="lecture-formula-box">
                    • Poff (thực tế) = Pon × (Poff + 1) [μs]<br>
                    • Tổng chu kỳ T = Pon + Poff(thực) = Pon × (Poff + 2) [μs]
                </div>
                <div class="lecture-calc-grid">
                    <div class="lecture-calc-col std-col" style="grid-column: 1 / -1;">
                        • Poff thực = ${Pon} × (${Poff} + 1) = <strong>${toff_us} μs</strong><br>
                        • Tổng chu kỳ T = ${Pon} + ${toff_us} = <strong>${cycle_us} μs</strong> (${cycle_ms} ms)
                    </div>
                </div>
            </div>

            <!-- BƯỚC 2 -->
            <div class="lecture-step">
                <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 2</span> Tần số phát xung cao tần (Frequency - f)</div>
                <p><strong>Ý nghĩa:</strong> Số chu kỳ xung phóng điện bộc phát qua khe rãnh trong 1 giây.</p>
                <div class="lecture-formula-box">
                    f = 10⁶ / T [Hz] = 1000 / T [kHz]
                </div>
                <div class="lecture-calc-grid">
                    <div class="lecture-calc-col std-col" style="grid-column: 1 / -1;">
                        f = 10⁶ / ${cycle_us} = <strong>${freq_khz} kHz</strong> (${freq_hz.toLocaleString()} tia lửa/giây)
                    </div>
                </div>
            </div>

            <!-- BƯỚC 3 -->
            <div class="lecture-step">
                <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 3</span> Tỷ lệ mở van MOSFET (Duty Factor - η)</div>
                <p><strong>Bản chất:</strong> Tỷ lệ phần trăm thời gian van MOSFET dẫn dòng điện thực tế trong 1 chu kỳ.</p>
                <div class="lecture-formula-box">
                    η = Pon / T = 1 / (Poff + 2) × 100%
                </div>
                <div class="lecture-calc-grid">
                    <div class="lecture-calc-col std-col" style="grid-column: 1 / -1;">
                        η = 1 / (${Poff} + 2) = <strong>${duty_pct}%</strong> (1 xung mở : ${Poff + 1} xung nghỉ)
                    </div>
                </div>
            </div>

            <!-- BƯỚC 4 -->
            <div class="lecture-step">
                <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 4</span> Năng lượng 1 tia đơn (Single Spark Energy - We)</div>
                <p><strong>Bản chất:</strong> Nhiệt lượng bộc phá Joule của 1 xung điện để nung chảy kim loại phôi.</p>
                <div class="lecture-formula-box">
                    • We = (Uarc × Ipeak × Pon) / 1000 [mJ]<br>
                    • Trong đó: Uarc = 27V (High) / 22V (Low); Ipeak = IP × 2.8A (mỗi sò MOSFET)
                </div>
                <div class="lecture-calc-grid">
                    <div class="lecture-calc-col std-col" style="grid-column: 1 / -1;">
                        • Ipeak = ${IP} × 2.8A = <strong>${i_peak.toFixed(1)} A</strong><br>
                        • We = (${u_arc}V × ${i_peak.toFixed(1)}A × ${Pon}μs) / 1000 = <strong>${we_mj} mJ</strong>
                    </div>
                </div>
            </div>

            <!-- BƯỚC 5 -->
            <div class="lecture-step">
                <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 5</span> Công suất điện phát (Ptb) &amp; Dòng kim Ampe kế (Model Vòng 5)</div>
                <p><strong>Quy chuẩn Ampe Model Vòng 5:</strong> Mô hình toán nhiệt động học tính toán dòng ampe cơ liên tục, khắc phục trồi sụt ampe khi Po lớn và phôi siêu dày.</p>
                <div class="lecture-formula-box">
                    • Công suất: Ptb = η × Uarc × Ipeak [Watts]<br>
                    • Kim Ampe: I = IP × [1/(Poff + 2)] × 8.55 × [1 - 0.33(Poff - 5)/10] × [1 - 0.08·H/(H + 20)] × (Uarc/27) [A]
                </div>
                <div class="lecture-calc-grid">
                    <div class="lecture-calc-col std-col" style="grid-column: 1 / -1;">
                        • Công suất trung bình Ptb = <strong>${power_watts} W</strong><br>
                        • Đồng hồ Ampe kế chỉ thị: <strong>≈ ${calculatedAmpe} A</strong> (Độ chính xác MAE = 0.161A, chuẩn xưởng)
                    </div>
                </div>
            </div>

            <!-- BƯỚC 6 -->
            <div class="lecture-step">
                <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 6</span> Năng suất cắt diện tích (Fc), Tốc độ tiến bàn (Ft) &amp; Thời gian cắt</div>
                <p><strong>Động học Servo:</strong> Năng suất cắt diện tích kết hợp điện áp bám tải VF và chiều dày phôi.</p>
                <div class="lecture-formula-box">
                    • Tốc độ tiến bàn: Ft = Fc / H [mm/phút]<br>
                    • Thời gian cắt (với L = ${L}mm): t = (L × H) / Fc [phút]
                </div>
                <div class="lecture-calc-grid">
                    <div class="lecture-calc-col std-col" style="grid-column: 1 / -1;">
                        • Năng suất thực tế: Fc = <strong>${speedArea} mm²/phút</strong> (Fc quy đổi H40 = ${r1.speedAreaH40} mm²/p)<br>
                        • Tốc độ tiến bàn máy: Ft = <strong>${feedRate} mm/phút</strong> (Giới hạn bàn: ${r1.hz || '--'} Hz)<br>
                        • Thời gian cắt dự kiến: <strong>${timeStr}</strong>
                    </div>
                </div>
            </div>

            <!-- BƯỚC 7 -->
            <div class="lecture-step">
                <div class="lecture-step-title"><span class="lecture-step-num">BƯỚC 7</span> Khe hở tia lửa (δ) &amp; Bù dao Offset (Quy tắc Núi Lửa Panme &amp; Phân Vùng Kép)</div>
                <p><strong>Nguyên lý:</strong> Dây Molypden Φ0.18mm (R = 0.090mm). Bù dao Pass 1: O1 = 0.090 + δ1. Pass 2 phạt đỉnh núi lửa: O2 = Rz1 + δ2 (H ≤ 170mm) và khóa 0.0150mm (H > 170mm).</p>
                <div class="lecture-formula-box">
                    • Lượng cào phôi 1 Pass: δ = ${delta_1p} mm (${(delta_1p*1000).toFixed(1)} μm)<br>
                    • Bù dao Offset 1 Pass: Offset = Rdây + δ = 0.090 + ${delta_1p} = <strong>${offset_1p} mm</strong>
                </div>
                <div class="lecture-calc-grid">
                    <div class="lecture-calc-col std-col" style="grid-column: 1 / -1;">
                        • Bù dao Pass 1: <strong>${offset_1p} mm</strong><br>
                        • Độ nhám bề mặt: <strong>Ra ≈ ${r1.Ra} μm</strong><br>
                        • Kiểm soát độ chính xác: Phân vùng kép đảm bảo sai số &lt; 0.003mm cho phôi H ≤ 170mm và hội tụ 0.1150mm tại H=300mm.
                    </div>
                </div>
            </div>
        `;
    }
'@

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]

    # Insert renderLectureKnowledge before render()
    if ($line.Trim() -eq "function render() {") {
        $newLines.Add($lectureCode)
        $newLines.Add("")
        $newLines.Add($line)
        $i++
        continue
    }

    # Call renderLectureKnowledge at the end of render()
    if ($line.Contains("runCustomAnalysis(false);")) {
        $newLines.Add($line)
        $newLines.Add("        if (typeof renderLectureKnowledge === 'function') {")
        $newLines.Add("            renderLectureKnowledge();")
        $newLines.Add("        }")
        $i++
        continue
    }

    $newLines.Add($line)
}

[System.IO.File]::WriteAllLines("app.js", $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Injected renderLectureKnowledge successfully."

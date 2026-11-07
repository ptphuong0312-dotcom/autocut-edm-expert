with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """                // Offset: Workshop machine vibrates more, kerf is wider. Add 0.011mm to offset.
                const stdOffset = parseFloat(r.offsetText);
                const wsOffset = (stdOffset + 0.011).toFixed(3);
                
                // Fc & Ft: Workshop machine is ~15% slower due to flushing efficiency
                const wsSpeedArea = Math.round(r.speedArea * 0.85);
                const wsFeedRate = (wsSpeedArea / state.thickness).toFixed(2);
                
                // Hz: User specified 200Hz ~ 480mm2/min => Hz = Fc / 2.4
                const wsHz = Math.round(wsSpeedArea / 2.4);"""

new_logic = """                // Hiệu chuẩn Offset từ dữ liệu WS-EXP-02: 
                // Pass 1 chuẩn hãng bị dư, thực tế xưởng giảm ~0.017mm.
                // Các Pass sau xưởng dùng: P2: 0.018, P3: 0.008, P4: 0.004, P5: 0.002
                const stdOffset = parseFloat(r.offsetText);
                let wsOffsetNum = stdOffset;
                if (idx === 0) wsOffsetNum = Math.max(0.010, stdOffset - 0.017);
                else if (idx === 1) wsOffsetNum = 0.018;
                else if (idx === 2) wsOffsetNum = 0.008;
                else if (idx === 3) wsOffsetNum = 0.004;
                else if (idx === 4) wsOffsetNum = 0.002;
                else wsOffsetNum = 0.001;
                const wsOffset = wsOffsetNum.toFixed(3);
                
                // Fc & Ft: Thực tế xưởng chậm hơn khá nhiều so với lý thuyết (theo WS-EXP-02)
                const wsSpeedArea = Math.round(r.speedArea * 0.70);
                const wsFeedRate = (wsSpeedArea / state.thickness).toFixed(2);
                
                // Hz (Giới hạn tốc độ theo Hz quy đổi từ maxSpeed thực tế WS-EXP-02)
                // maxSpeed thực tế P1-P5: 300, 220, 140, 90, 60 (mm2/p)
                // Quy đổi Hz = maxSpeed / 2.4
                const hzLimits = [125, 92, 58, 38, 25, 17];
                const wsHz = hzLimits[idx] || 17;"""

content = content.replace(old_logic, new_logic)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

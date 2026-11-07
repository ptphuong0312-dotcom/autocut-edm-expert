$lines = [System.IO.File]::ReadAllLines("app.js", [System.Text.Encoding]::UTF8)
$newLines = [System.Collections.Generic.List[string]]::new()

$syncLogicCode = @'
        // NÚT LẤY THÔNG SỐ ĐẦU VÀO TỪ TAB 1 (TRA CỨU THÔNG SỐ CẮT)
        const btnSyncTab1 = document.getElementById('btn-sync-from-tab1');
        if (btnSyncTab1) {
            btnSyncTab1.addEventListener('click', () => {
                const wsRows = generateWorkshopRows(state);
                if (!wsRows || wsRows.length === 0) return;
                const r1 = wsRows[0];

                const H = state.thickness || 40;
                const material = (state.wsMaterial === 'SCM420') ? 'SCM420' : 'SCM440';
                const Pon = parseFloat(r1.ti) || 36;
                const Poff = parseFloat(r1.Po) || 5;
                const IP = parseFloat(r1.IP) || 4;
                const Volt = (r1.Voltage === 'Low' || r1.Voltage === 'L') ? 'Low' : 'High';
                const VF = parseFloat(r1.VF) || 55;

                // 1. Cập nhật state nội bộ của Tab 2
                vfResearchState.material = material;
                vfResearchState.H = H;
                vfResearchState.Ton = Pon;
                vfResearchState.Po = Poff;
                vfResearchState.IP = IP;
                vfResearchState.Volt = Volt;
                vfResearchState.VF = VF;

                // 2. Cập nhật các ô input & slider trên giao diện
                if (inputH) inputH.value = H;
                if (sliderH) sliderH.value = Math.min(300, Math.max(5, H));
                if (inputTon) inputTon.value = Pon;
                if (inputPo) inputPo.value = Poff;
                if (inputIP) inputIP.value = IP;
                if (inputVF) inputVF.value = VF;
                if (sliderVF) sliderVF.value = Math.min(85, Math.max(20, VF));

                // Cập nhật nút Vật Liệu
                if (matBtns) {
                    matBtns.forEach(btn => {
                        if (btn.dataset.mat === material) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }

                // Cập nhật nút Volt
                if (voltBtns) {
                    voltBtns.forEach(btn => {
                        if (btn.dataset.volt === Volt) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }

                // 3. Tính toán và hiển thị ngay lập tức kết quả Bù dao Offset
                renderResearchVF();

                // 4. Hiệu ứng phản hồi trên nút
                const origHtml = btnSyncTab1.innerHTML;
                btnSyncTab1.innerHTML = '<span>✅ Đã Nạp Thông Số!</span>';
                btnSyncTab1.style.background = '#10b981';
                setTimeout(() => {
                    btnSyncTab1.innerHTML = origHtml;
                    btnSyncTab1.style.background = '';
                }, 1800);

                // Cập nhật lại dòng preview
                updateTab1SyncPreview();

                // Hiển thị toast thông báo
                const matText = material === 'SCM420' ? 'SCM420 (Thép mềm)' : 'SCM440 (Thép cứng)';
                showToast(`✅ Đã nạp từ Tab Tra Cứu: ${matText} | H=${H}mm | Pon=${Pon} | Poff=${Poff} | IP=${IP} | ${Volt} | VF=${VF}`);
            });
        }
'@

$previewFnCode = @'
    // Cập nhật dòng chữ preview thông số hiện tại của Tab 1 ở nút đồng bộ Tab 2
    function updateTab1SyncPreview() {
        const previewEl = document.getElementById('vf-sync-preview-text');
        if (!previewEl) return;
        const wsRows = generateWorkshopRows(state);
        if (!wsRows || wsRows.length === 0) return;
        const r1 = wsRows[0];
        const H = state.thickness || 40;
        const material = (state.wsMaterial === 'SCM420') ? 'SCM420' : 'SCM440';
        previewEl.innerHTML = `Hiện tại ở Tab 1: <strong style="color:var(--accent-amber)">${material} | H=${H}mm | Pon=${r1.ti} | Poff=${r1.Po} | IP=${r1.IP} | ${r1.Voltage} | VF=${r1.VF}</strong> (Bấm nút bên để nạp)`;
    }
'@

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]

    # Insert updateTab1SyncPreview function before initResearchVF
    if ($line.Trim() -eq "function initResearchVF() {") {
        $newLines.Add($previewFnCode)
        $newLines.Add("")
    }

    # Insert sync listener at end of bindResearchVFEvents before its closing brace
    if ($line.Trim() -eq "function bindResearchVFEvents() {") {
        # Copy lines until voltBtns.forEach closing block
        $newLines.Add($line)
        $i++
        while ($i -lt $lines.Length -and -not ($lines[$i].Trim() -eq "}" -and $lines[$i+1].Trim() -eq "" -and $lines[$i+2].Contains("function initResearchVF"))) {
            $newLines.Add($lines[$i])
            $i++
        }
        $newLines.Add($syncLogicCode)
        $newLines.Add("    }")
        $i++
        continue
    }

    # Call updateTab1SyncPreview inside initResearchVF
    if ($line.Trim() -eq "renderResearchVF();" -and $i -gt 4600) {
        $newLines.Add($line)
        $newLines.Add("        updateTab1SyncPreview();")
        $i++
        continue
    }

    # Call updateTab1SyncPreview at end of render()
    if ($line.Contains("renderLectureKnowledge();") -and $i -gt 3500 -and $i -lt 3800) {
        $newLines.Add($line)
        $newLines.Add("        if (typeof updateTab1SyncPreview === 'function') {")
        $newLines.Add("            updateTab1SyncPreview();")
        $newLines.Add("        }")
        $i++
        continue
    }

    # Update Tab Click to refresh preview when switching to Tab 2
    if ($line.Contains("document.getElementById(target).classList.add('active');")) {
        $newLines.Add($line)
        $newLines.Add("            if (target === 'tab-vf-research' && typeof updateTab1SyncPreview === 'function') {")
        $newLines.Add("                updateTab1SyncPreview();")
        $newLines.Add("            }")
        $i++
        continue
    }

    $newLines.Add($line)
}

[System.IO.File]::WriteAllLines("app.js", $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Injected sync logic and preview into app.js successfully."

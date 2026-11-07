$lines = [System.IO.File]::ReadAllLines("app.js", [System.Text.Encoding]::UTF8)
$newLines = [System.Collections.Generic.List[string]]::new()

$syncLogic = @'
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

                // Cập nhật dòng preview
                updateTab1SyncPreview();

                // Hiển thị toast thông báo
                const matText = material === 'SCM420' ? 'SCM420 (Thép mềm)' : 'SCM440 (Thép cứng)';
                showToast(`✅ Đã nạp từ Tab Tra Cứu: ${matText} | H=${H}mm | Pon=${Pon} | Poff=${Poff} | IP=${IP} | ${Volt} | VF=${VF}`);
            });
        }
'@

$previewFn = @'
    // Cập nhật dòng preview thông số hiện tại của Tab 1 ở nút đồng bộ Tab 2
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

    # 1. Update navTabs click
    if ($line.Trim() -eq "document.getElementById(target).classList.add('active');" -and $i -lt 180) {
        $newLines.Add($line)
        $newLines.Add("            if (target === 'tab-vf-research' && typeof updateTab1SyncPreview === 'function') {")
        $newLines.Add("                updateTab1SyncPreview();")
        $newLines.Add("            }")
        continue
    }

    # 2. Update render() end
    if ($line.Trim() -eq "renderLectureKnowledge();" -and $i -gt 3720 -and $i -lt 3750) {
        $newLines.Add($line)
        $newLines.Add("        }")
        $newLines.Add("        if (typeof updateTab1SyncPreview === 'function') {")
        $newLines.Add("            updateTab1SyncPreview();")
        # skip the next line which was the closing brace for renderLectureKnowledge check
        if ($lines[$i+1].Trim() -eq "}") {
            $i++
        }
        continue
    }

    # 3. Add btnSyncTab1 before the closing brace of bindResearchVFEvents
    if ($line.Trim() -eq "function initResearchVF() {") {
        # Insert sync logic before this function
        $newLines.Add($syncLogic)
        $newLines.Add("    }")
        $newLines.Add("")
        $newLines.Add($previewFn)
        $newLines.Add("")
        $newLines.Add($line)
        continue
    }

    # 4. Call updateTab1SyncPreview inside initResearchVF
    if ($line.Trim() -eq "renderResearchVF();" -and $i -gt 4600) {
        $newLines.Add($line)
        $newLines.Add("        updateTab1SyncPreview();")
        continue
    }

    # 5. Version bump in app.js
    if ($line.Contains('const CURRENT_VERSION = "3.5.56";')) {
        $newLines.Add('    const CURRENT_VERSION = "3.5.57";')
        continue
    }

    # Remove the lone closing brace if it was just before function initResearchVF()
    if ($i -lt ($lines.Length - 1) -and $lines[$i].Trim() -eq "}" -and $lines[$i+1].Trim() -eq "" -and $lines[$i+2].Trim() -eq "function initResearchVF() {") {
        # This will be closed after $syncLogic
        continue
    }

    $newLines.Add($line)
}

[System.IO.File]::WriteAllLines("app.js", $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Updated app.js with sync button logic."

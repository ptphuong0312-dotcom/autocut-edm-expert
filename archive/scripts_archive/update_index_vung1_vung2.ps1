$lines = [System.IO.File]::ReadAllLines("index.html", [System.Text.Encoding]::UTF8)
$newLines = [System.Collections.Generic.List[string]]::new()

$vung1AndVung2Html = @'
                    <div class="results-header" style="margin-bottom: 12px;">
                        <div>
                            <h2 class="section-title" style="margin-bottom: 0;"><span class="badge-num" style="background: var(--accent-amber); color: #000;">2</span> Thông Số Cắt &amp; Bù Dao Offset</h2>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button type="button" class="btn btn-sm btn-outline" id="ws-btn-reset-params" style="border-color: rgba(251, 191, 36, 0.5); color: var(--accent-amber); font-size: 11.5px; padding: 5px 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; border-radius: 6px;" title="Khôi phục lại toàn bộ thông số tính toán chuẩn ban đầu của App">
                                <span>🔄 Trở Về Mặc Định</span>
                            </button>
                            <button class="btn btn-sm btn-copy" id="ws-btn-copy-table">📋 Copy Bảng</button>
                        </div>
                    </div>

                    <!-- VÙNG 1: THÔNG SỐ ĐIỆN XUNG & BÙ DAO OFFSET (XẾP DỌC) -->
                    <div style="margin-bottom: 18px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(14, 165, 233, 0.25); border-radius: var(--radius-sm); padding: 12px 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <h3 style="font-size: 13px; color: var(--accent-cyan); margin: 0; display: flex; align-items: center; gap: 6px;">
                                <span>⚡</span> VÙNG 1: THÔNG SỐ ĐIỆN XUNG &amp; BÙ DAO OFFSET <span style="font-size: 11px; color: var(--text-secondary); font-weight: 400;">(Có thể thay đổi trực tiếp)</span>
                            </h3>
                            <span style="font-size: 11px; color: var(--accent-amber);">💡 Chỉnh Pon, Poff, IP, Volt, VF &rarr; Offset &amp; Vùng 2 tự tính lại</span>
                        </div>
                        <div class="table-responsive">
                            <table class="edm-table workshop-table" id="ws-edm-table-vung1">
                                <thead>
                                    <tr>
                                        <th class="sticky-col">P</th>
                                        <th>Pon (μs)</th>
                                        <th>Poff (Po)</th>
                                        <th>IP (Sò)</th>
                                        <th>Volt</th>
                                        <th>VF</th>
                                        <th>Wire</th>
                                        <th style="color: var(--accent-amber); font-size: 13px;">OFFSET (mm)</th>
                                    </tr>
                                </thead>
                                <tbody id="ws-table-body-vung1">
                                    <!-- Injected by JavaScript -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- VÙNG 2: NĂNG SUẤT BỀ MẶT & ĐỘNG HỌC MÁY (XẾP DỌC BÊN DƯỚI) -->
                    <div style="margin-bottom: 16px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: var(--radius-sm); padding: 12px 14px;">
                        <div style="margin-bottom: 8px;">
                            <h3 style="font-size: 13px; color: var(--accent-purple); margin: 0; display: flex; align-items: center; gap: 6px;">
                                <span>📊</span> VÙNG 2: NĂNG SUẤT &amp; ĐỘNG HỌC MÁY <span style="font-size: 11px; color: var(--text-secondary); font-weight: 400;">(Tự động tính toán phản ứng theo Vùng 1)</span>
                            </h3>
                        </div>
                        <div class="table-responsive">
                            <table class="edm-table workshop-table" id="ws-edm-table-vung2">
                                <thead>
                                    <tr>
                                        <th class="sticky-col">P</th>
                                        <th>Fc thực (mm²/p)</th>
                                        <th>Fc máy (H40)</th>
                                        <th>Giới hạn (Hz)</th>
                                        <th>Ampe kế (A)</th>
                                        <th>Ra (μm)</th>
                                    </tr>
                                </thead>
                                <tbody id="ws-table-body-vung2">
                                    <!-- Injected by JavaScript -->
                                </tbody>
                            </table>
                        </div>
                    </div>
'@

$syncButtonBox = @'
                    <!-- NÚT LẤY THÔNG SỐ TỪ TAB TRA CỨU (TAB 1) -->
                    <div style="margin-bottom: 16px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: var(--radius-sm); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 22px;">⚡</span>
                            <div>
                                <strong style="font-size: 13px; color: var(--accent-cyan); display: block;">Lấy Thông Số Đầu Vào Từ Tab Tra Cứu:</strong>
                                <span style="font-size: 11.5px; color: var(--text-secondary);" id="vf-sync-preview-text">Nạp nhanh toàn bộ H, Pon, Poff, IP, Volt, VF đang tính ở Tab Tra Cứu sang đây</span>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary" id="btn-sync-from-tab1" style="background: linear-gradient(135deg, #0284c7, #7c3aed); border: 1px solid rgba(255, 255, 255, 0.2); padding: 8px 16px; font-weight: 700; font-size: 12.5px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 10px rgba(14, 165, 233, 0.4); cursor: pointer; border-radius: 6px; color: #fff; transition: all 0.2s ease;">
                            <span>📥 Nạp Thông Số Từ Tab 1</span>
                        </button>
                    </div>
'@

$i = 0
while ($i -lt $lines.Length) {
    # 1. Thay the Section 2 Tab 1 bang 2 Vung xep doc
    if ($lines[$i].Contains('<div class="results-header">')) {
        $newLines.Add($vung1AndVung2Html)
        # Skip until workshop-library-section
        while ($i -lt $lines.Length -and -not $lines[$i].Contains('id="ws-workshop-library-container"')) {
            $i++
        }
        continue
    }

    # 2. Chen khoi nut Sync vao Tab 2 truoc <!-- 1. VAT LIEU -->
    if ($lines[$i].Contains('<!-- 1. VẬT LIỆU -->') -and $i -gt 200 -and $i -lt 350) {
        $newLines.Add($syncButtonBox)
        $newLines.Add("")
        $newLines.Add($lines[$i])
        $i++
        continue
    }

    $newLines.Add($lines[$i])
    $i++
}

[System.IO.File]::WriteAllLines("index.html", $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Updated index.html with 2 Vertical Zones and Tab 2 Sync Button successfully."

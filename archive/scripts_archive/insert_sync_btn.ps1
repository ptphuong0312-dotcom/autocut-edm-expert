$lines = [System.IO.File]::ReadAllLines("index.html", [System.Text.Encoding]::UTF8)
$newLines = [System.Collections.Generic.List[string]]::new()

$syncBox = @"
                    <!-- NÚT LẤY THÔNG SỐ TỪ TAB TRA CỨU -->
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
"@

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line.Contains("<!-- 1. VẬT LIỆU -->") -and $i -gt 240 -and $i -lt 300) {
        $newLines.Add($syncBox)
        $newLines.Add("")
    }
    $newLines.Add($line)
}

[System.IO.File]::WriteAllLines("index.html", $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Injected sync button into index.html."

$cardsHtml = @'

                    <!-- 12. DONG DIEN AMPE DONG HOC VONG 5 -->
                    <div class="kb-card">
                        <div class="kb-card-header">
                            <span class="kb-badge" style="background: var(--accent-amber); color: #000;">12</span>
                            <h3>Động Lực Học Đồng Hồ Ampe &amp; Mô Hình Nhiệt Điện Vòng 5</h3>
                        </div>
                        <div class="kb-body">
                            <p><strong>Bản chất:</strong> Kim đồng hồ Ampe là cảm ứng từ đo dòng điện trung bình tích phân của toàn bộ xung phóng trong rãnh cắt.</p>
                            <div class="formula-box" style="border-left-color: var(--accent-amber);">
                                I<sub>Ampe</sub> = IP × [1 / (Poff + 2)] × 8.55 × η<sub>po</sub> × η<sub>h</sub> × (U<sub>arc</sub> / 27)<br>
                                • η<sub>po</sub> = 1.0 - 0.33 × [(Poff - 5) / 10] (Hiệu ứng khử ion hóa lạnh khi Poff kéo dài)<br>
                                • η<sub>h</sub> = 1.0 - 0.08 × [H / (H + 20)] (Độ bão hòa thủy lực rãnh sâu theo chiều dày phôi)
                            </div>
                            <ul>
                                <li><strong>Tại phôi mỏng H &le; 40mm:</strong> Dung dịch xối mạnh, mồi xung liên tục, dòng kim đạt <strong>4.3A - 4.7A</strong>.</li>
                                <li><strong>Tại phôi dày H=160-165mm (Poff=11):</strong> Thời gian nghỉ dài làm màng ion nguội hoàn toàn, dòng kim tụt êm dịu về đúng <strong>2.8A - 3.0A</strong> (khớp 100% số đo thực tế xưởng).</li>
                                <li><strong>Tại phôi siêu dày H=300mm:</strong> Nhờ cơ chế bão hòa thủy lực Langmuir, dòng kim duy trì vững vàng <strong>3.7A - 3.9A</strong>, không bị sụt áp đột ngột.</li>
                            </ul>
                        </div>
                    </div>

                    <!-- 13. PHAN VUNG KEP H <= 170mm VS H > 170mm -->
                    <div class="kb-card">
                        <div class="kb-card-header">
                            <span class="kb-badge" style="background: var(--accent-cyan); color: #000;">13</span>
                            <h3>Kiến Trúc Bù Dao Phân Vùng Kép (H &le; 170mm vs H &gt; 170mm)</h3>
                        </div>
                        <div class="kb-body">
                            <p><strong>Tuân thủ Hiến pháp AGENTS.md (Rule 16 &amp; 17):</strong></p>
                            <div class="formula-box" style="border-left-color: var(--accent-cyan);">
                                • <strong>Phân vùng 1 (H &le; 170mm):</strong> Vận hành 100% bằng Phương trình Toán - Vật lý Nhiệt động học liên tục δ = f(H, Pon, IP, Volt). Tuyệt đối cấm chia mảnh if-else hay bảng tra tĩnh!<br>
                                • <strong>Phân vùng 2 (H &gt; 170mm):</strong> Mô hình Thống kê Hội tụ Thực nghiệm Xưởng, hội tụ êm ái về O1 = 0.1150 mm tại H=300mm và khóa O2 = 0.0150 mm.
                            </div>
                            <ul>
                                <li><strong>5 thành phần vi mô cấu thành lượng cào δ (H &le; 170mm):</strong> C0 (màng ion) + d<sub>elec</sub> (bộc phá xung đơn) + d<sub>vf</sub> (trễ servo) + d<sub>vibr</sub> (rung võng dây Moly) + d<sub>h_conf</sub> (áp suất thủy tĩnh rãnh sâu) + d<sub>sec</sub> (đánh lửa thứ cấp do mạt xỉ dẻo).</li>
                                <li>Đảm bảo hệ thống thích ứng chính xác với mọi vật liệu (SCM440, SCM420) và mọi chế độ xung.</li>
                            </ul>
                        </div>
                    </div>

                    <!-- 14. BAC THANG AMPE 7 CAP DO -->
                    <div class="kb-card">
                        <div class="kb-card-header">
                            <span class="kb-badge" style="background: var(--accent-green); color: #000;">14</span>
                            <h3>Quy Luật Bậc Thang Ampe 7 Cấp Độ Đối Xứng (Tab Tra Cứu)</h3>
                        </div>
                        <div class="kb-body">
                            <p><strong>Chuẩn hóa 7 cấp độ chiến lược gia công đối xứng quanh Cấp 4 (Tiêu chuẩn):</strong></p>
                            <ul>
                                <li><strong>Cấp 1 - Cấp 3 (Chuyên cắt mịn &amp; siêu mịn):</strong> Hạ IP (1-2 sò), Poff kéo dài, Volt Low. Dòng Ampe giảm đều đặn -1.8A, -1.2A, -0.6A so với chuẩn. Bề mặt siêu mịn Ra &le; 1.0 - 2.2 μm.</li>
                                <li><strong>Cấp 4 (⭐ Tiêu Chuẩn Chuẩn Xưởng):</strong> Cân bằng tối ưu giữa tốc độ, độ nhám và độ bền dây Molypden. Tuân thủ nghiêm ngặt 4 dải Ampe Rule 12.</li>
                                <li><strong>Cấp 5 - Cấp 7 (Tăng tốc &amp; Bứt phá năng suất):</strong> Rút ngắn Poff, tăng Pon và VF, giữ IP an toàn. Dòng Ampe tăng đều đặn +0.6A, +1.2A, +1.8A so với chuẩn. Năng suất tăng 25% - 60%.</li>
                            </ul>
                        </div>
                    </div>
'@

$enc = [System.Text.Encoding]::UTF8
$lines = [System.IO.File]::ReadAllLines("index.html", $enc)

$newLines = [System.Collections.Generic.List[string]]::new()
for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line.Trim() -eq '<!-- FOOTER -->' -and $i -ge 4) {
        $insertIdx = $newLines.Count - 3
        foreach ($cardLine in ($cardsHtml.Split("`n") | ForEach-Object { $_.TrimEnd("`r") })) {
            $newLines.Insert($insertIdx, $cardLine)
            $insertIdx++
        }
        Write-Host "Inserted cards at index $($insertIdx)"
    }
    $newLines.Add($line)
}

[System.IO.File]::WriteAllLines("index.html", $newLines, $enc)
Write-Host "Saved index.html successfully"

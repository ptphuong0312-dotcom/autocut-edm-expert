[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$html = [IO.File]::ReadAllText("index.html", [Text.Encoding]::UTF8)

# Card 1: ti -> Pon
$html = $html.Replace('<h3>ti (Pulse Width / Độ rộng xung / 脉宽 - μs)</h3>', '<h3>Pon (Pulse Width / Độ rộng xung phát / 脉宽 - μs)</h3>')
$html = $html.Replace('Năng lượng xung đơn: W<sub>e</sub> ≈ V<sub>m</sub> × I<sub>p</sub> × ti', 'Năng lượng xung đơn: W<sub>e</sub> ≈ (U<sub>arc</sub> × I<sub>peak</sub> × Pon) / 1000 (mJ)')
$html = $html.Replace('Khi ti lớn (36 - 60 μs):', 'Khi Pon lớn (36 - 135 μs):')
$html = $html.Replace('Khi ti nhỏ (1 - 8 μs):', 'Khi Pon nhỏ (1 - 8 μs):')

# Card 2: Po -> Poff
$html = $html.Replace('<h3>Po (Pulse Interval Ratio / Hệ số nghỉ xung / 脉间)</h3>', '<h3>Poff (Pulse Interval Ratio / Po - Hệ số thời gian nghỉ xả xỉ / 脉间)</h3>')
$html = $html.Replace('T<sub>off</sub> = ti × (Po + 1) (μs) &nbsp;|&nbsp; Tần số phát: f = 1000 / [ti × (Po + 2)] (kHz) &nbsp;|&nbsp; Chu kỳ: T = ti × (Po + 2) (μs)', 'P<sub>off(thực)</sub> = Pon × (Poff + 1) (μs) &nbsp;|&nbsp; Chu kỳ: T = Pon × (Poff + 2) (μs) &nbsp;|&nbsp; Tần số: f = 10⁶ / T (Hz)')

# Card 3: IP
$html = $html.Replace('Dòng điện đỉnh cực đại: I<sub>p</sub> ≈ IP × (1.2 ~ 1.5A)', 'Dòng điện đỉnh cực đại: I<sub>peak</sub> = IP × 2.8A (Mỗi kênh van công suất ≈ 2.8A)')

# Card 5: VF Monotonic explanation
$oldVfAdvice = @'
                                1. <strong>Khi cắt thô (Pass 1):</strong> Luôn để <strong>VF = 60 - 65</strong> (với phôi mỏng/vừa) hoặc <strong>VF = 50 - 55</strong> (với phôi dày &gt; 100 mm).<br>
                                2. <strong>Khi cắt tinh (Pass 2, 3, 4, 5):</strong> Hạ <strong>VF = 20 - 35</strong> để Servo bám lùi nhẹ nhàng, gọt êm phẳng đỉnh nhấp nhô.<br>
                                3. <strong>Mẹo kiểm tra:</strong> Nếu thấy máy cắt chậm, hãy thử tăng nhẹ VF lên +5 nấc. Nếu kim Ampe kế giật cục và Servo thỉnh thoảng lùi lại thì tức là VF đã chạm ngưỡng giới hạn, cần hạ bớt lại 2 - 3 nấc.
'@

$newVfAdvice = @'
                                1. <strong>ĐÍNH CHÍNH VẬT LÝ VỀ GIÁ TRỊ VF:</strong> Thang đo VF trên máy biến thiên từ <strong>1 đến 99</strong>. Mức <strong>50 - 55 là giá trị trung bình</strong> của bộ điều khiển, không phải là thông số tiêu chuẩn cố định.<br>
                                2. <strong>QUY LUẬT BIẾN THIÊN THUẬN THEO CHIỀU DÀY PHÔI H (PASS 1):</strong><br>
                                • <strong>Phôi mỏng / thấp (H &le; 20 - 30 mm):</strong> Cài đặt <strong>VF = 50 - 52</strong> (bám bước êm dịu, không giật cáp, hồ quang cực kỳ ổn định).<br>
                                • <strong>Phôi trung bình (H = 40 - 90 mm):</strong> Nâng dần <strong>VF = 54 - 60</strong> để duy trì tốc độ tiến bàn.<br>
                                • <strong>Phôi dày &amp; siêu dày (H &ge; 100 - 300 mm):</strong> BẮT BUỘC NÂNG CAO <strong>VF = 65 - 75</strong> để tăng lực kéo servo, khắc phục độ trễ bước tiến trong rãnh sâu, ép tia lửa bám sát đáy rãnh và thoát phoi mạnh mẽ!<br>
                                3. <strong>Khi cắt tinh (Pass 2 - Pass 6):</strong> Hạ <strong>VF = 20 - 36</strong> để Servo bám nhẹ nhàng, triệt tiêu phóng điện thứ cấp, gọt phẳng đỉnh núi lửa Rz1.
'@

if ($html.Contains($oldVfAdvice)) {
    $html = $html.Replace($oldVfAdvice, $newVfAdvice)
    Write-Host "[OK] Replaced VF Advice"
} else {
    Write-Host "[WARN] oldVfAdvice not matched directly"
}

# Card 7: Volcano rule & Dual-regime offset
$oldOffsetBox = @'
                            <div class="formula-box">
                                Offset Pass 1 = R<sub>dây</sub> + Khe hở tia lửa δ<sub>1</sub> = 0.090 + 0.025 = 0.115 mm
                            </div>
                            <p><strong>Cơ chế Lượng bào (Remain) các lần sau:</strong></p>
                            <ul>
                                <li>Pass 2: Hớt bỏ 0.022 mm (xóa vệt sóng thô).</li>
                                <li>Pass 3: Hớt bỏ 0.010 mm (hạ độ nhám).</li>
                                <li>Pass 4: Hớt bỏ 0.005 mm (xóa biến trắng).</li>
                                <li>Pass 5: Hớt bỏ 0.002 mm (đánh bóng gương).</li>
                                <li>Tổng lượng hớt đúng bằng lượng dư gia công để chi tiết đạt chuẩn 1:1 (±0.005 mm).</li>
                            </ul>
'@

$newOffsetBox = @'
                            <div class="formula-box">
                                • Bù dao Pass 1: O<sub>1</sub> = R<sub>dây</sub> + δ<sub>1</sub> = 0.090 + δ<sub>1</sub> (mm)<br>
                                • Bù dao Pass 2: O<sub>2</sub> = R<sub>z1</sub> + δ<sub>2</sub> (Quy tắc Núi Lửa: Gọt phạt đỉnh nhấp nhô rỗng xốp Rz1 + Khe hở tia δ2)<br>
                                • Bù dao các Pass sau: O<sub>n</sub> = R<sub>z(n-1)</sub> + δ<sub>n</sub>
                            </div>
                            <p><strong>Cơ chế Lượng bào (Remain) &amp; Chống nhầm lẫn năng lực cào phôi:</strong></p>
                            <ul>
                                <li><strong>Pass 2 không cào được 0.035mm thép phẳng đặc:</strong> Năng lực cào thép đặc thực chất của Pass 2 chỉ là 8 - 12 μm. Lượng bóc tách 0.035mm đo được là do Pass 2 đã gọt các đỉnh nhọn rỗng xốp của miệng núi lửa Rz1 do Pass 1 để lại!</li>
                                <li><strong>Phân vùng kép:</strong> Ở phôi dày H &gt; 170mm, bù dao Pass 2 được khóa chặt tại <strong>O2 = 0.0150 mm</strong> để tia lửa Pass 2 luôn bám sát chân vách, không bị trượt gió.</li>
                                <li><strong>Pass 3 - Pass 5:</strong> Bóc tách vi mô 0.005 - 0.002 mm xóa hoàn toàn biến trắng và đánh bóng gương Ra &le; 0.4 - 0.6 μm.</li>
                            </ul>
'@

if ($html.Contains($oldOffsetBox)) {
    $html = $html.Replace($oldOffsetBox, $newOffsetBox)
    Write-Host "[OK] Replaced Offset Box"
} else {
    Write-Host "[WARN] oldOffsetBox not matched directly"
}

# Cards 12, 13, 14 insertion
$extraCards = @'

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

# Insert extra cards before closing knowledge-grid
$insertTarget = '                </div>' + [char]13 + [char]10 + '            </div>' + [char]13 + [char]10 + '        </div>'
if ($html.Contains($insertTarget)) {
    $html = $html.Replace($insertTarget, $extraCards + [char]13 + [char]10 + $insertTarget)
    Write-Host "[OK] Inserted Extra Cards 12, 13, 14"
} else {
    Write-Host "[WARN] insertTarget not matched directly, checking alternate"
    $altTarget = "                </div>`n            </div>`n        </div>"
    if ($html.Contains($altTarget)) {
        $html = $html.Replace($altTarget, $extraCards + "`n" + $altTarget)
        Write-Host "[OK] Inserted Extra Cards (alt)"
    }
}

# Update version in index.html
$html = $html.Replace('v3.5.55 (Chuẩn Hóa Đường Cong VF &amp; Thuật Ngữ Pon/Poff)', 'v3.5.56 (Triệt Tiêu Tab 1 &amp; Tối Ưu Ampe Vòng 5 Toàn Diện)')
$html = $html.Replace('app.js?v=3.5.55', 'app.js?v=3.5.56')

[IO.File]::WriteAllText("index.html", $html, [Text.Encoding]::UTF8)
Write-Host "[DONE] Finished updating Knowledge Tab in index.html"

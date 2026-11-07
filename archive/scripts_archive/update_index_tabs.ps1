[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$html = [IO.File]::ReadAllText("index.html", [Text.Encoding]::UTF8)

# 1. Update nav tabs
$oldNav = @'
        <!-- NAVIGATION TABS -->
        <nav class="nav-tabs">
            <button class="nav-tab active" data-tab="tab-calculator">⚡ Tra Cứu &amp; Phân Tích (Chuẩn Hãng)</button>
            <button class="nav-tab" data-tab="tab-workshop">🏭 Tra Cứu &amp; Phân Tích (Hiệu Chỉnh Xưởng)</button>
            <button class="nav-tab" data-tab="tab-vf-research">🔬 Thí Nghiệm VF (1 Pass Tự Do)</button>
            <button class="nav-tab" data-tab="tab-knowledge">📚 Kiến Thức Chuyên Sâu EDM</button>
        </nav>
'@

$newNav = @'
        <!-- NAVIGATION TABS -->
        <nav class="nav-tabs">
            <button class="nav-tab active" data-tab="tab-workshop">⚡ Tra Cứu Thông Số Cắt</button>
            <button class="nav-tab" data-tab="tab-vf-research">📝 Nhập Thông Số Cắt</button>
            <button class="nav-tab" data-tab="tab-knowledge">📚 Kiến Thức EDM</button>
        </nav>
'@

if ($html.Contains($oldNav)) {
    $html = $html.Replace($oldNav, $newNav)
    Write-Host "[OK] Updated nav tabs"
} else {
    Write-Host "[WARN] oldNav not exact match, using regex"
    $html = [regex]::Replace($html, '(?s)<nav class="nav-tabs">.*?</nav>', $newNav.Trim())
}

# 2. Remove Tab 1 (tab-calculator) completely
# Find from <!-- TAB 1: BẢNG TRA CỨU & PHÂN TÍCH --> to before <!-- TAB 2: TRA CỨU & PHÂN TÍCH (HIỆU CHỈNH THỰC TẾ XƯỞNG) -->
$tab1Regex = '(?s)\s*<!-- TAB 1: BẢNG TRA CỨU & PHÂN TÍCH -->\s*<div class="tab-content active" id="tab-calculator">.*?</div>\s*(?=<!-- TAB 2:)'
if ($html -match $tab1Regex) {
    $html = [regex]::Replace($html, $tab1Regex, "`n`n        ")
    Write-Host "[OK] Removed tab-calculator"
} else {
    Write-Host "[WARN] tab-calculator regex not matched, checking alternate pattern"
    $tab1Alt = '(?s)<div class="tab-content active" id="tab-calculator">.*?</div>\s*<!-- TAB 2'
    if ($html -match $tab1Alt) {
        $html = [regex]::Replace($html, '(?s)<div class="tab-content active" id="tab-calculator">.*?</div>\s*(?=<div class="tab-content" id="tab-workshop">)', "")
        Write-Host "[OK] Removed tab-calculator (alt)"
    }
}

# 3. Activate tab-workshop
$html = $html.Replace('<!-- TAB 2: TRA CỨU & PHÂN TÍCH (HIỆU CHỈNH THỰC TẾ XƯỞNG) -->', '<!-- PHÂN HỆ 1: TRA CỨU THÔNG SỐ CẮT -->')
$html = $html.Replace('<div class="tab-content" id="tab-workshop">', '<div class="tab-content active" id="tab-workshop">')
$html = $html.Replace('Điều kiện Gia công (Xưởng)', 'Điều kiện Gia công')
$html = $html.Replace('Chế độ Cắt &amp; Bù Dao Offset (Hiệu Chuẩn Xưởng)', 'Tra Cứu Thông Số Cắt &amp; Bù Dao Offset')

# 4. Rename Tab 3 (tab-vf-research)
$html = $html.Replace('<!-- TAB 3: PHÒNG THÍ NGHIỆM & NGHIÊN CỨU VF BÙ DAO 1 PASS -->', '<!-- PHÂN HỆ 2: NHẬP THÔNG SỐ CẮT -->')
$html = $html.Replace('<h2>🔬 PHÒNG THÍ NGHIỆM TỰ DO &amp; NGHIÊN CỨU VF BÙ DAO 1 PASS</h2>', '<h2>📝 NHẬP THÔNG SỐ CẮT &amp; MÔ PHỎNG ĐỘNG HỌC XUNG 1 PASS</h2>')
$html = $html.Replace('Thí nghiệm tùy biến mọi thông số gia công để so sánh trực quan tác động của VF', 'Tự do nhập bất kỳ thông số nào (Pon, Poff, IP, Volt, VF, Tần số Max) để tính toán chính xác Lượng cào phôi δ, Bù dao Offset, Dòng Ampe và Năng suất bóc phoi')

# 5. Rename Tab 4 (tab-knowledge)
$html = $html.Replace('<!-- TAB 3: KIẾN THỨC CHUYÊN SÂU EDM -->', '<!-- PHÂN HỆ 3: KIẾN THỨC EDM -->')
$html = $html.Replace('<h2>📚 CẨM NANG TOÀN TẬP VỀ CHẾ ĐỘ ĐIỆN CẮT DÂY MOLYPEN AUTOCUT SERVO</h2>', '<h2>📚 CẨM NANG TOÀN TẬP KIẾN THỨC EDM AUTOCUT SERVO</h2>')
$html = $html.Replace('Giải thích chi tiết bản chất vật lý, cơ chế điều khiển và các công thức tính toán thực nghiệm trong gia công EDM.', 'Hệ thống giáo trình chuyên sâu giải thích bản chất vật lý, cơ chế động học xung, quy luật dòng điện Ampe và phương trình bù dao thực chiến.')

[IO.File]::WriteAllText("index.html", $html, [Text.Encoding]::UTF8)
Write-Host "[DONE] Successfully updated index.html"

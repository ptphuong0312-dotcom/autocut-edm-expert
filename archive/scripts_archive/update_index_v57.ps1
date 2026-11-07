$lines = [System.IO.File]::ReadAllLines("index.html", [System.Text.Encoding]::UTF8)
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i].Contains("style.css?v=3.5.56")) {
        $lines[$i] = $lines[$i].Replace("style.css?v=3.5.56", "style.css?v=3.5.57")
    }
    if ($lines[$i].Contains("app.js?v=3.5.56")) {
        $lines[$i] = $lines[$i].Replace("app.js?v=3.5.56", "app.js?v=3.5.57")
    }
    if ($lines[$i].Contains("v3.5.56")) {
        $lines[$i] = $lines[$i].Replace("v3.5.56 (Triệt Tiêu Tab 1 &amp; Tối Ưu Ampe Vòng 5 Toàn Diện)", "v3.5.57 (Tính Năng Nạp Thông Số Cắt Đầu Vào Từ Tab 1)")
    }
}
[System.IO.File]::WriteAllLines("index.html", $lines, [System.Text.Encoding]::UTF8)
Write-Host "Updated index.html to v3.5.57"

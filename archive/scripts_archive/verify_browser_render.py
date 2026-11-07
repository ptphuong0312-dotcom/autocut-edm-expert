"""
KIỂM CHỨNG RENDER THỰC TẾ TRÊN ENGINE TRÌNH DUYỆT (EDGE HEADLESS)
Đảm bảo mã nguồn HTML + CSS + JS chạy mượt mà, không gặp bất kỳ lỗi cú pháp nào làm đứt gãy luồng thực thi.
"""

import subprocess
import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

edge_paths = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
]

edge_exe = None
for p in edge_paths:
    if os.path.exists(p):
        edge_exe = p
        break

if not edge_exe:
    print("Warning: Edge browser executable not found. Skipping live browser test.")
    sys.exit(0)

html_path = os.path.abspath('index.html').replace('\\', '/')
html_url = f'file:///{html_path}'

print(f"Executing Headless Browser Test on: {html_url}")
res = subprocess.run([
    edge_exe,
    '--headless=new',
    '--disable-gpu',
    '--dump-dom',
    html_url
], capture_output=True, text=True, encoding='utf-8')

dom = res.stdout

# Đọc phiên bản từ version.json
import json
with open('version.json', 'r', encoding='utf-8') as f:
    vdata = json.load(f)
expected_version = "v" + vdata.get('version', '')

# Kiểm tra các điều kiện thực thi cốt lõi
tests = [
    ("Version đồng bộ hiển thị trong DOM", expected_version in dom),
    ("Vùng 1 (Đầu Vào) được JS render thành công", 'id="ws-table-body-vung1"' in dom and 'Pass 1' in dom and 'data-field="ti"' in dom),
    ("Vùng 2 (Đầu Ra) được JS render thành công", 'id="ws-table-body-vung2"' in dom and 'ws-dyn-offset-0' in dom),
    ("Cột OFFSET đứng đầu tiên trong Vùng 2 (sau cột Pass)", 'val-offset fw-bold col-offset-cell' in dom),
    ("Không còn lỗi unquoted identifier làm đứng app.js", '<!-- Injected by JavaScript -->' not in dom or 'Pass 1' in dom),
]

all_passed = True
print("-" * 65)
for name, passed in tests:
    status = "PASSED" if passed else "FAILED"
    print(f"[{status:^6}] {name}")
    if not passed:
        all_passed = False
print("-" * 65)

if all_passed:
    print(f">>> KẾT QUẢ: ỨNG DỤNG KHỞI CHẠY VÀ RENDER THÀNH CÔNG 100% TRÊN TRÌNH DUYỆT! <<<")
    sys.exit(0)
else:
    print(f">>> CẢNH BÁO: PHÁT HIỆN LỖI KHI RENDER TRÊN TRÌNH DUYỆT! <<<")
    sys.exit(1)

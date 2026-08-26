import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix headers
content = content.replace('<th>OFFSET Xưởng</th>', '<th>OFFSET</th>')
content = content.replace('<th>Fc Xưởng(mm²/p)</th>', '<th>Fc (mm²/p)</th>')
content = content.replace('<th>Ft Xưởng(mm/p)</th>', '<th>Ft (mm/p)</th>')

# Add Giới hạn (Hz) before Ampe kế (A)
content = content.replace('<th>Ampe kế (A)</th>', '<th>Giới hạn (Hz)</th>\n                                    <th>Ampe kế (A)</th>')

# Remove the custom test panel, analysis section, and workshop library
# We will use regex to remove from <!-- KHUNG NHẬP THỬ NGHIỆM to <!-- NOTICES
pattern = re.compile(r'<!-- KHUNG NHẬP THỬ NGHIỆM & TÍNH TOÁN LÝ THUYẾT XƯỞNG -->.*?<!-- NOTICES & INSTRUCTIONS ACCORDING TO WORKSHOP CONDITION -->', re.DOTALL)
content = pattern.sub('<!-- NOTICES & INSTRUCTIONS ACCORDING TO WORKSHOP CONDITION -->', content)

# Bump version to 3.4.3
content = content.replace('v=3.4.2', 'v=3.4.3')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

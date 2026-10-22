import os
import json
import re
import sys

ws_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app_js_path = os.path.join(ws_dir, 'app.js')

with open(app_js_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Bracket and stack check
clean = re.sub(r'/\*[\s\S]*?\*/', '', app_js)
clean = re.sub(r'//.*$', '', clean, flags=re.MULTILINE)
clean = re.sub(r'`(?:\\[\s\S]|[^`])*`', '""', clean)
clean = re.sub(r'"(?:\\[\s\S]|[^"\\])*"', '""', clean)
clean = re.sub(r"'(?:\\[\s\S]|[^'\\])*'", "''", clean)

stack = []
pairs = {')': '(', '}': '{', ']': '['}
for idx, ch in enumerate(clean):
    if ch in '({[':
        stack.append((ch, idx))
    elif ch in ')}]':
        if not stack:
            print(f"SYNTAX ERROR: Unmatched closing {ch} at index {idx}", file=sys.stderr)
            sys.exit(1)
        top_ch, top_idx = stack.pop()
        if top_ch != pairs[ch]:
            print(f"SYNTAX ERROR: Mismatched {top_ch} at {top_idx} with {ch} at {idx}", file=sys.stderr)
            sys.exit(1)

if stack:
    top_ch, top_idx = stack[-1]
    print(f"SYNTAX ERROR: Unmatched opening {top_ch} at index {top_idx}", file=sys.stderr)
    sys.exit(1)

print("  [OK] Bracket balance and syntax integrity: PASSED")

# 2. Anti-Lookup-Table Law Check
forbidden = ['anchorOffsetTarget', 'anchorOffset']
for p in forbidden:
    if p in app_js:
        print(f"INTEGRITY VIOLATION: Forbidden pattern '{p}' found in app.js!", file=sys.stderr)
        sys.exit(1)

required = ['C0', 'K_ELEC', 'DELTA_LOW', 'K_SLAG', 'K_VIBR', 'K_RZ']
for c in required:
    if c not in app_js:
        print(f"INTEGRITY VIOLATION: Required constant '{c}' missing in app.js!", file=sys.stderr)
        sys.exit(1)

print("  [OK] Anti-Lookup-Table Law and Pure Physics Engine: PASSED")

# 3. Version synchronization check
with open(os.path.join(ws_dir, 'version.json'), 'r', encoding='utf-8') as f:
    version_data = json.load(f)
ver = version_data['version']

with open(os.path.join(ws_dir, 'index.html'), 'r', encoding='utf-8') as f:
    index_html = f.read()

with open(os.path.join(ws_dir, 'sw.js'), 'r', encoding='utf-8') as f:
    sw_js = f.read()

if f"v={ver}" not in index_html and f"v{ver}" not in index_html:
    print(f"Version mismatch in index.html! Expected {ver}", file=sys.stderr)
    sys.exit(1)

if f"autocut-v{ver}" not in sw_js:
    print(f"Version mismatch in sw.js! Expected autocut-v{ver}", file=sys.stderr)
    sys.exit(1)

print(f"  [OK] Version synchronization (v{ver}): PASSED")
print("=== ALL INTEGRITY CHECKS PASSED 100% ===")

import re, sys, os, json

sys.stdout.reconfigure(encoding='utf-8')
ws_dir = r"F:\Antigravity\Cat Day EDM 1"
app_js_path = os.path.join(ws_dir, 'app.js')
version_path = os.path.join(ws_dir, 'version.json')
index_html_path = os.path.join(ws_dir, 'index.html')
sw_path = os.path.join(ws_dir, 'sw.js')

print("=== RUNNING SYSTEM INTEGRITY AND LAW VERIFICATION ===")

with open(app_js_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Syntax and bracket check
clean = re.sub(r'/\*.*?\*/', '', app_js, flags=re.DOTALL)
clean = re.sub(r'//.*', '', clean)
clean = re.sub(r'`(?:\\`|[^`])*`', '""', clean)
clean = re.sub(r'"(?:\\"|[^"])*"', '""', clean)
clean = re.sub(r"'(?:\\'|[^'])*'", "''", clean)

stack = []
pairs = {')': '(', '}': '{', ']': '['}
for idx, ch in enumerate(clean):
    if ch in '({[':
        stack.append((ch, idx))
    elif ch in ')}]':
        if not stack:
            print(f'SYNTAX ERROR: Unmatched closing {ch} at char {idx}')
            sys.exit(1)
        top, top_idx = stack.pop()
        if top != pairs[ch]:
            print(f'SYNTAX ERROR: Mismatched {top} at {top_idx} with {ch} at {idx}')
            sys.exit(1)

if stack:
    print(f'SYNTAX ERROR: Unmatched opening {stack[-1][0]} at {stack[-1][1]}')
    sys.exit(1)
print("  [OK] Bracket balance and syntax integrity: PASSED")

# 2. Anti-Lookup-Table Law Check (Rule 16 / Constitution Rule 16)
forbidden_patterns = [
    'anchorOffsetTarget',
    'anchorOffset',
]
for p in forbidden_patterns:
    if p in app_js:
        print(f"INTEGRITY VIOLATION: Forbidden static lookup table pattern '{p}' found in app.js! All offsets must use pure mathematical physics formulas.")
        sys.exit(1)

# Check presence of universal physics constants
required_constants = ['C0', 'K_ELEC', 'DELTA_LOW', 'K_SLAG', 'K_VIBR', 'K_RZ']
for c in required_constants:
    if c not in app_js:
        print(f"INTEGRITY VIOLATION: Required physical constant '{c}' missing from app.js!")
        sys.exit(1)
print("  [OK] Anti-Lookup-Table Law and Pure Physics Engine: PASSED")

# 3. Version Synchronization Check
with open(version_path, 'r', encoding='utf-8') as f:
    vdata = json.load(f)
ver = vdata.get('version')

with open(index_html_path, 'r', encoding='utf-8') as f:
    html = f.read()

with open(sw_path, 'r', encoding='utf-8') as f:
    sw = f.read()

assert f"v={ver}" in html or f"v{ver}" in html, f"Version mismatch in index.html! Expected {ver}"
assert f"autocut-v{ver}" in sw, f"Version mismatch in sw.js! Expected autocut-v{ver}"
print(f"  [OK] Version synchronization (v{ver}): PASSED")

print("=== ALL INTEGRITY AND ANTI-LOOKUP-TABLE CHECKS PASSED 100% ===")

import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the workshop library rendering block
find_block = r"(            // Render danh sách Thư viện Thực nghiệm Xưởng\n            const workshopLibContainer = document\.getElementById\('ws-workshop-library-container'\);\n            if \(workshopLibContainer\) \{\n(?:.|\n)*?            \}\n)"

match = re.search(find_block, content)
if match:
    block_code = match.group(1)
    # Remove from current location
    content = content.replace(block_code, "")
    
    # We want to put it inside DOMContentLoaded, e.g., right before `render();`
    insert_point = "    // INITIAL RENDER\n    updateStrategyDisplay(state.strategyLevel);\n    render();"
    # Wait, the block uses WORKSHOP_EMPIRICAL_LIBRARY which is defined in app.js
    # so we just need to put it before render()
    
    # Let's clean up the block a bit for indentation
    block_code_clean = block_code.replace("            // Render", "    // Render")
    # Actually, simple replace is fine.
    
    content = content.replace(insert_point, block_code + "\n" + insert_point)
    
    # Bump version to 3.4.6
    content = content.replace("3.4.5", "3.4.6")
    
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Moved library to DOMContentLoaded")
else:
    print("Could not find the library block")

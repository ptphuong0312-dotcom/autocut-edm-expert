import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The block to move starts at:
#             // Render danh sách Thư viện Thực nghiệm Xưởng
# and ends at the closing brace of the workshopLibContainer block, which is right before the closing brace of `if (workshopTableElement)`.

# Let's find the closing brace of `if (workshopTableElement)`
# It's at line 1775 roughly.

find_block = r"(            // Render danh sách Thư viện Thực nghiệm Xưởng\n            const workshopLibContainer = document\.getElementById\('ws-workshop-library-container'\);\n            if \(workshopLibContainer\) \{\n(?:.|\n)*?            \}\n)"

match = re.search(find_block, content)
if match:
    block_code = match.group(1)
    # Remove it from inside the if
    content = content.replace(block_code, "")
    
    # Place it OUTSIDE the if, just after it.
    # The if (workshopTableElement) ends with:
    #             if (wsBtnToggleCompact) {
    #                 ...
    #             }
    #         }
    #         
    #         // Luôn hiển thị khung so sánh mặc định
    
    insert_point = "        // Luôn hiển thị khung so sánh mặc định"
    content = content.replace(insert_point, block_code + "\n" + insert_point)
    
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed library location in app.js")
else:
    print("Could not find the library block")

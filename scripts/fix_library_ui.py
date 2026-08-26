import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """                workshopLibContainer.innerHTML = `
                    <div class="workshop-lib-header">
                        <h4>📚 THƯ VIỆN THÔNG SỐ CẮT THỰC TẾ XƯỞNG (${WORKSHOP_EMPIRICAL_LIBRARY.length} bản ghi)</h4>
                        <span class="lib-offline-badge">🔒 Lưu trữ Cục bộ (Offline Local)</span>
                    </div>
                    <div class="workshop-lib-list">
                        ${WORKSHOP_EMPIRICAL_LIBRARY.map(item => `"""

new_block = """                workshopLibContainer.innerHTML = `
                    <div class="workshop-lib-header" id="ws-lib-toggle-btn" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 10px 15px; border-radius: 6px; border-left: 4px solid var(--accent);">
                        <h4 style="margin: 0; color: var(--accent); font-size: 1.1em; display: flex; align-items: center; gap: 8px;"><i class="fa fa-book"></i> THƯ VIỆN THÔNG SỐ CẮT THỰC TẾ XƯỞNG</h4>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span class="lib-offline-badge">🔒 Offline Local</span>
                            <i id="ws-lib-toggle-icon" class="fa fa-chevron-down" style="color: var(--accent); transition: transform 0.3s;"></i>
                        </div>
                    </div>
                    <div id="ws-lib-content" class="workshop-lib-list" style="display: none; margin-top: 15px;">
                        ${WORKSHOP_EMPIRICAL_LIBRARY.map(item => `"""

content = content.replace(old_block, new_block)

# Also need to add the event listener. Where does it end?
# Let's search for the end of the `workshopLibContainer.innerHTML` block.
old_end = """                    </div>
                `;"""

new_end = """                    </div>
                `;
                
                // Add toggle logic
                const toggleBtn = document.getElementById('ws-lib-toggle-btn');
                const libContent = document.getElementById('ws-lib-content');
                const libIcon = document.getElementById('ws-lib-toggle-icon');
                if (toggleBtn && libContent && libIcon) {
                    toggleBtn.addEventListener('click', () => {
                        if (libContent.style.display === 'none') {
                            libContent.style.display = 'grid'; // because workshop-lib-list uses grid
                            libIcon.style.transform = 'rotate(180deg)';
                        } else {
                            libContent.style.display = 'none';
                            libIcon.style.transform = 'rotate(0deg)';
                        }
                    });
                }"""

# Wait, `workshop-lib-list` uses CSS grid?
# Let's check style.css just to be sure. I'll just use 'grid' or 'flex' or 'block' depending on CSS. 
# Usually, removing the inline style `display: none` is enough. 
# Better: `libContent.style.display = libContent.style.display === 'none' ? '' : 'none';`

new_end = """                    </div>
                `;
                
                // Add toggle logic
                const toggleBtn = document.getElementById('ws-lib-toggle-btn');
                const libContent = document.getElementById('ws-lib-content');
                const libIcon = document.getElementById('ws-lib-toggle-icon');
                if (toggleBtn && libContent && libIcon) {
                    toggleBtn.addEventListener('click', () => {
                        if (libContent.style.display === 'none') {
                            libContent.style.display = '';
                            libIcon.style.transform = 'rotate(180deg)';
                        } else {
                            libContent.style.display = 'none';
                            libIcon.style.transform = 'rotate(0deg)';
                        }
                    });
                }"""

content = content.replace(old_end, new_end)
content = content.replace("3.4.10", "3.4.11")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

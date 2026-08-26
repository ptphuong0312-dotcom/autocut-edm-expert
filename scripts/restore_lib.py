import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

lib_html = """                    <!-- THƯ VIỆN THÔNG SỐ THỰC NGHIỆM XƯỞNG -->
                    <div class="workshop-library-section" id="ws-workshop-library-container" style="margin-top: 20px;">
                        <!-- Injected by JavaScript: Workshop Empirical Library -->
                    </div>

                    <!-- NOTICES & INSTRUCTIONS ACCORDING TO WORKSHOP CONDITION -->"""

content = content.replace("<!-- NOTICES & INSTRUCTIONS ACCORDING TO WORKSHOP CONDITION -->", lib_html)

# Bump version to 3.4.4
content = content.replace("v=3.4.3", "v=3.4.4")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

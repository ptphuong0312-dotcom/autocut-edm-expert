import re

with open('AGENTS.md', 'r', encoding='utf-8') as f:
    content = f.read()

old_text = "## 🚨 MANDATORY CHECK BEFORE ANY ACTION (NGUYÊN TẮC TRONG NGUYÊN TẮC)\nBefore modifying ANY file or executing any logic, you MUST adhere to the following:\n1. **IMMUTABILITY"

new_text = "## 🚨 MANDATORY CHECK BEFORE ANY ACTION (NGUYÊN TẮC TRONG NGUYÊN TẮC)\nBefore modifying ANY file or executing any logic, you MUST adhere to the following:\n0. **READ ALL RULES AND SKILLS FIRST:**\n   - You MUST deeply review all knowledge in `.agents/rules/` and `.agents/skills/` to ensure your proposed solution aligns with the established physics logic and project architecture before writing a single line of code.\n1. **IMMUTABILITY"

content = content.replace(old_text, new_text)

with open('AGENTS.md', 'w', encoding='utf-8') as f:
    f.write(content)

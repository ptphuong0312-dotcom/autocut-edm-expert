const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('app.js', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
window.fetch = async () => ({ json: async () => ({ version: '3.4.8' }) });

const scriptEl = window.document.createElement("script");
scriptEl.textContent = script;
window.document.body.appendChild(scriptEl);

setTimeout(() => {
    // Set multicut to 5
    const multiCutBtns = window.document.querySelectorAll('.pass-btn');
    if (multiCutBtns.length > 4) {
        multiCutBtns[4].click();
    }
    
    // Set H=10
    const slider = window.document.getElementById('thickness-slider');
    slider.value = 10;
    slider.dispatchEvent(new window.Event('input'));
    
    // Get Tab 2 table
    const wsTableBody = window.document.getElementById('ws-table-body');
    if (wsTableBody) {
        const rows = wsTableBody.querySelectorAll('tr');
        rows.forEach((row, idx) => {
            let text = [];
            row.querySelectorAll('td').forEach(td => text.push(td.textContent.trim().replace(/\s+/g, ' ')));
            console.log(`Pass ${idx + 1}:`, text.join(' | '));
        });
    }
}, 500);

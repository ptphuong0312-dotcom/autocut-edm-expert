const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

const scriptCode = fs.readFileSync('app.js', 'utf8');

dom.window.eval(scriptCode);

// Fire DOMContentLoaded
const event = new dom.window.Event('DOMContentLoaded');
dom.window.document.dispatchEvent(event);

setTimeout(() => {
    const tbody1 = dom.window.document.getElementById('table-body');
    const tbody2 = dom.window.document.getElementById('ws-table-body');
    const comp2 = dom.window.document.getElementById('ws-comparison-table-element');
    
    console.log("Tab 1 Table length:", tbody1 ? tbody1.innerHTML.length : 'null');
    console.log("Tab 2 Table length:", tbody2 ? tbody2.innerHTML.length : 'null');
    console.log("Tab 2 Comparison length:", comp2 ? comp2.innerHTML.length : 'null');
}, 100);

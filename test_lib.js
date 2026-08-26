const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('app.js', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;

// Define fetch mockup
window.fetch = async () => ({
    json: async () => ({ version: '3.4.5' })
});

const scriptEl = window.document.createElement("script");
scriptEl.textContent = script;
window.document.body.appendChild(scriptEl);

setTimeout(() => {
    const wsLib = window.document.getElementById('ws-workshop-library-container');
    console.log('Workshop Lib HTML:', wsLib ? wsLib.innerHTML : 'null');
}, 500);

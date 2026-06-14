const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('d:\\tinygames\\public\\tictactoe.html', 'utf8');

const dom = new JSDOM(html, {
    url: "http://localhost:3000/tictactoe.html",
    runScripts: "dangerously",
    resources: "usable"
});

dom.window.console.log = function() { console.log('LOG:', ...arguments); };
dom.window.console.warn = function() { console.warn('WARN:', ...arguments); };
dom.window.console.error = function() { console.error('ERR:', ...arguments); };

setTimeout(() => {
    try {
        const btn = dom.window.document.getElementById('create-room-btn');
        if (btn) {
            btn.click();
            console.log("Clicked create room");
        } else {
            console.log("Btn not found");
        }
    } catch(e) {
        console.error("Crash:", e);
    }
}, 2000);

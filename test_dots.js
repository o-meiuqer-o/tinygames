const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('http://localhost:3000/dotsandboxes.html', { waitUntil: 'networkidle2' });
    
    await page.click('#create-room-btn').catch(e => console.log('Click error:', e.message));
    
    await browser.close();
})();

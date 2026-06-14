const fs = require('fs');
const html = fs.readFileSync('d:\\tinygames\\public\\dotsandboxes.html', 'utf8');
const js = fs.readFileSync('d:\\tinygames\\public\\js\\dotsandboxes.js', 'utf8');

const domMatch = js.match(/const DOM = \{([\s\S]*?)\};/);
if (domMatch) {
    const lines = domMatch[1].split('\n');
    for (let line of lines) {
        const idMatch = line.match(/getElementById\('([^']+)'\)/);
        if (idMatch) {
            const id = idMatch[1];
            if (!html.includes('id="' + id + '"')) {
                console.log('MISSING IN HTML:', id);
            }
        }
    }
}

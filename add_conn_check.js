const fs = require('fs');

const files = [
    'd:\\tinygames\\public\\js\\tictactoe.js',
    'd:\\tinygames\\public\\js\\dotsandboxes.js',
    'd:\\tinygames\\public\\js\\aadu-puli-aattam.js',
    'd:\\tinygames\\public\\js\\pallanguzhi.js'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Add check to createBtn
    content = content.replace(
        /DOM\.createBtn\.addEventListener\('click', \(\) => {/g,
        `DOM.createBtn.addEventListener('click', () => {\n    if (!socket.connected) {\n        alert("Disconnected from server! Please refresh the page.");\n        return;\n    }`
    );
    
    // Add check to joinBtn
    content = content.replace(
        /DOM\.joinBtn\.addEventListener\('click', \(\) => {/g,
        `DOM.joinBtn.addEventListener('click', () => {\n    if (!socket.connected) {\n        alert("Disconnected from server! Please refresh the page.");\n        return;\n    }`
    );
    
    fs.writeFileSync(file, content, 'utf8');
}
console.log('Added connection check.');

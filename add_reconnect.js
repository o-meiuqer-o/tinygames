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
    
    // Check if auto-reconnect already exists
    if (!content.includes("socket.on('connect', () => {")) {
        // Insert it after const socket = io();
        content = content.replace(
            /(const socket = io\(\);.*?)\n/s,
            `$1\n\nsocket.on('connect', () => {\n    if (typeof gameMode !== 'undefined' && gameMode === 'online' && typeof myRoomId !== 'undefined' && myRoomId) {\n        let gridSize = (typeof ROWS !== 'undefined') ? ROWS : 6;\n        socket.emit('join_game', { gameType, roomId: myRoomId, gridSize });\n    }\n});\n`
        );
        fs.writeFileSync(file, content, 'utf8');
    }
}
console.log('Added auto-reconnect logic.');

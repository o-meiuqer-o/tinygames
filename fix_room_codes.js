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
    
    // Replace room code generation
    content = content.replace(
        /const code = Math\.random\(\)\.toString\(36\)\.substring\(2, 8\)\.toUpperCase\(\);/g,
        "const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';\n    let code = '';\n    for(let i=0; i<6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));"
    );
    
    fs.writeFileSync(file, content, 'utf8');
}
console.log('Room generation fixed');

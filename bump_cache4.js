const fs = require('fs');

const files = [
    'd:\\tinygames\\public\\tictactoe.html',
    'd:\\tinygames\\public\\aadu-puli-aattam.html',
    'd:\\tinygames\\public\\pallanguzhi.html',
    'd:\\tinygames\\public\\dotsandboxes.html'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Bump version
    content = content.replace(/\?v=3/g, '?v=4');
    
    fs.writeFileSync(file, content, 'utf8');
}
console.log('Bumped cache version to v4.');

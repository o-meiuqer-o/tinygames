const fs = require('fs');

const files = [
    'd:\\tinygames\\public\\tictactoe.html',
    'd:\\tinygames\\public\\aadu-puli-aattam.html',
    'd:\\tinygames\\public\\pallanguzhi.html'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix double quote
    content = content.replace(/\?v=2""/g, '?v=2"');
    
    fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed double quotes.');

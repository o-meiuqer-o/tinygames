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
    
    // Replace script src
    content = content.replace(
        /<script src="js\/(tictactoe|dotsandboxes|aadu-puli-aattam|pallanguzhi)\.js(?!.*?\?v=2)(".*?)><\/script>/g,
        '<script src="js/$1.js?v=2"$2></script>'
    );
    
    fs.writeFileSync(file, content, 'utf8');
}
console.log('Cache-bust query parameters added.');

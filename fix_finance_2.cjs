const fs = require('fs');
const path = 'src/pages/Finance.jsx';
const lines = fs.readFileSync(path, 'utf8').split('\n');

// Remove 1-indexed lines 728-738
// 0-indexed: 727-737

const newLines = lines.filter((_, i) => {
    if (i >= 727 && i <= 737) return false;
    return true;
});

fs.writeFileSync(path, newLines.join('\n'));
console.log(`Cleaned up Finance.jsx part 2. Original lines: ${lines.length}, New lines: ${newLines.length}`);

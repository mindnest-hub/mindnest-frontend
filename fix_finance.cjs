const fs = require('fs');
const path = 'src/pages/Finance.jsx';
const lines = fs.readFileSync(path, 'utf8').split('\n');

// 1-indexed content to remove:
// 611-700 (Duplicate Arcade 1 Handlers)
// 844-917 (Obsolete Level 12/15 Handlers)
// Converted to 0-indexed:
// 610-699
// 843-916

const newLines = lines.filter((_, i) => {
    // Check if index is in Bad Block 1
    if (i >= 610 && i <= 699) return false;
    // Check if index is in Bad Block 2
    if (i >= 843 && i <= 916) return false;
    return true;
});

fs.writeFileSync(path, newLines.join('\n'));
console.log(`Cleaned up Finance.jsx. Original lines: ${lines.length}, New lines: ${newLines.length}`);

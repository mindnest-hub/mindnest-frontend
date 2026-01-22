const fs = require('fs');
const path = 'src/pages/Finance.jsx';
const lines = fs.readFileSync(path, 'utf8').split('\n');

// Remove 1-indexed line 966
// 0-indexed: 965

const newLines = lines.filter((_, i) => i !== 965);

fs.writeFileSync(path, newLines.join('\n'));
console.log(`Cleaned up Finance.jsx part 3. Original lines: ${lines.length}, New lines: ${newLines.length}`);

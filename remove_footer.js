const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Regex to match the footer tag and its content until the closing </footer>
  // Uses [\s\S]*? for non-greedy match across multiple lines
  const newContent = content.replace(/<footer[\s\S]*?<\/footer>/g, '');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Removed footer from ${file}`);
  }
});
console.log('Done!');

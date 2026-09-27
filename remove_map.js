const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<a href="map\.html"[^>]*>Map<\/a>/gi, '');
  content = content.replace(/<a href="map\.html"[^>]*>Interactive Map<\/a>/gi, '');
  fs.writeFileSync(f, content);
});
console.log('Removed map links');

const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.css') || f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove CSS transitions and animations
  const newContent = content
    .replace(/transition:[\s\S]*?;/g, '')
    .replace(/animation:[\s\S]*?;/g, '')
    .replace(/@keyframes[\s\S]*?\{[\s\S]*?\}/g, '')
    // Also specifically from style tag in html
    .replace(/\.story-card:hover \{ transform: translateY\(-6px\); box-shadow: var\(--shadow-lg\); \}/g, '.story-card:hover { box-shadow: var(--shadow-lg); }')
    // For style.css
    .replace(/\.dest-hub-card:hover \.dest-hub-bg \{.*?transform.*?}/g, '.dest-hub-card:hover .dest-hub-bg { filter: grayscale(0%) brightness(0.8); }')
    .replace(/transform:.*?translateY.*?;/g, '')
    .replace(/transform:.*?scale.*?;/g, '')
    .replace(/box-shadow:.*?var\(--transition\).*?;/g, '');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Cleaned animations from ${file}`);
  }
});

// Also remove `scroll-hint` from home.html which was a bouncy arrow
const homeHtmlPath = 'home.html';
if (fs.existsSync(homeHtmlPath)) {
  let homeHtml = fs.readFileSync(homeHtmlPath, 'utf8');
  homeHtml = homeHtml.replace(/<div class="scroll-hint">Scroll to Explore<\/div>/g, '');
  fs.writeFileSync(homeHtmlPath, homeHtml, 'utf8');
}

// Clean index.html zoom effect
const indexHtmlPath = 'index.html';
if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  indexHtml = indexHtml.replace(/animation: zoomIn 20s linear infinite alternate;/g, '');
  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
}

console.log('Cleanup done!');

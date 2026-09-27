const fs = require('fs');

const states = [
  { id: 'delhi', name: 'Delhi', img: 'assets/img/delhi_0.jpg', intro: 'The capital city where centuries of empires have left their indelible mark. A sensory overload of ancient monuments, vibrant bazaars, and cutting-edge culture.' },
  { id: 'rajasthan', name: 'Rajasthan', img: 'assets/img/rajasthan_0.jpg', intro: 'The land of kings. A vivid tapestry of sweeping deserts, majestic forts, and palaces that seem to float on lakes.' },
  { id: 'kerala', name: 'Kerala', img: 'assets/img/kerala_0.jpg', intro: 'God\'s own country. Serene backwaters, rolling tea plantations, and pristine palm-fringed coastlines.' },
  { id: 'goa', name: 'Goa', img: 'assets/img/goa_0.jpg', intro: 'Where the jungle meets the sea. Portuguese heritage, spice plantations, and some of the most laid-back beaches in the world.' },
  { id: 'gujarat', name: 'Gujarat', img: 'assets/img/gujarat_3.jpg', intro: 'A diverse ecosystem ranging from the stark white salt desert of the Rann to the last sanctuary of the Asiatic lion.' },
  { id: 'assam', name: 'Assam', img: 'assets/img/assam_1.jpg', intro: 'The gateway to the northeast. Follow the mighty Brahmaputra river through dense wildlife sanctuaries and emerald tea estates.' }
];

states.forEach(state => {
  const file = `${state.id}.html`;
  if (!fs.existsSync(file)) return;
  
  let html = fs.readFileSync(file, 'utf8');

  // Remove the old map links and logout logic
  html = html.replace(/<a href="map\.html"[^>]*>.*?<\/a>/gi, '');
  html = html.replace(/<a href="index\.html" onclick="localStorage\.removeItem\('yatra_user'\)">Logout<\/a>/gi, '');
  html = html.replace('Your Yatra (0)', 'Saved Locally (<span id="savedCount">0</span>)');

  // Redesign the CSS inside the state page for the hub layout
  const newStyles = `
    <style>
      body { background: var(--paper); }
      .hub-hero {
        width: 100%; height: 60vh; min-height: 400px;
        position: relative; display: flex; align-items: center; justify-content: center;
        background-size: cover; background-position: center;
        color: white; text-align: center; margin-bottom: 80px;
      }
      .hub-hero::after {
        content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.5);
      }
      .hub-hero-inner {
        position: relative; z-index: 10; max-width: 800px; padding: 20px;
      }
      .hub-hero-inner h1 { font-family: var(--font-display); font-size: 80px; margin: 0; font-weight: 400; font-style: italic; }
      .hub-hero-inner p { font-family: var(--font-body); font-size: 20px; font-weight: 300; opacity: 0.9; margin-top: 16px; line-height: 1.6; }

      .hub-layout {
        max-width: 1200px; margin: 0 auto 100px; padding: 0 20px;
        display: grid; grid-template-columns: 2fr 1fr; gap: 60px;
      }
      @media(max-width: 900px) { .hub-layout { grid-template-columns: 1fr; } }
      
      .hub-main-list { display: flex; flex-direction: column; gap: 40px; }
      .hub-story {
        display: grid; grid-template-columns: 200px 1fr; gap: 24px; text-decoration: none; color: inherit; align-items: center;
      }
      .hub-story-img {
        width: 200px; height: 200px; background-size: cover; background-position: center; border-radius: 4px;
      }
      .hub-story-body h3 { font-family: var(--font-display); font-size: 28px; margin: 0 0 12px; transition: color 0.2s; }
      .hub-story:hover .hub-story-body h3 { color: var(--terracotta); }
      .hub-story-body p { font-family: var(--font-body); font-size: 15px; color: var(--muted); margin: 0 0 16px; line-height: 1.6; }
      .hub-story-meta { font-family: var(--font-body); font-size: 11px; text-transform: uppercase; color: var(--light-muted); letter-spacing: 1px; }
      
      @media(max-width: 600px) {
        .hub-story { grid-template-columns: 1fr; }
        .hub-story-img { width: 100%; height: 250px; }
      }
    </style>
  `;

  // Inject styles in <head>
  if (!html.includes('.hub-hero')) {
    html = html.replace('</head>', `${newStyles}\n</head>`);
  }

  // Find the exact boundaries of what to replace
  // We want to replace everything from <header class="article-hero"... down to right before <section class="reviews-section">
  const startIndex = html.indexOf('<header class="article-hero"');
  let endIndex = html.indexOf('<section class="reviews-section">');
  
  if (startIndex > -1 && endIndex > -1) {
    const replacement = `
      <div class="hub-hero" style="background-image: url('${state.img}')">
        <div class="hub-hero-inner">
          <h1>${state.name}</h1>
          <p>${state.intro}</p>
        </div>
      </div>

      <div class="hub-layout" id="hubLayout">
        <div class="hub-main-list" id="hubStoryList">
          <!-- Populated by JS -->
          <div style="padding: 40px; text-align: center; color: var(--muted);">Loading editorial stories...</div>
        </div>
        <aside>
          <div class="sw">
            <h4 style="font-family: var(--font-display); font-size: 24px; margin-bottom: 20px;">Why We Love ${state.name}</h4>
            <p style="font-family: var(--font-body); font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 20px;">
              There is an undeniable rhythm to this state that captures the imagination of every traveler. Whether you are exploring ancient ruins or tasting the vibrant local cuisine, it leaves a lasting impression.
            </p>
            <button class="btn-primary" onclick="window.saveToYatra('${state.name}')" style="width: 100%; display: block; text-align: center;">Save Destination</button>
          </div>
        </aside>
      </div>

      <script src="js/articles.js"></script>
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const list = document.getElementById('hubStoryList');
          if (!window.articlesData) {
            list.innerHTML = '<p style="color:red;">Failed to load stories.</p>';
            return;
          }
          
          const stateArticles = Object.entries(window.articlesData)
            .map(([id, data]) => ({id, ...data}))
            .filter(a => a.state && a.state.toLowerCase() === '${state.id}');
            
          if (stateArticles.length === 0) {
            list.innerHTML = '<p>No stories found for this destination yet.</p>';
            return;
          }
          
          list.innerHTML = stateArticles.map(a => \`
            <a href="blog.html?id=\${a.id}" class="hub-story">
              <div class="hub-story-img" style="background-image: url('\${a.heroImg}')"></div>
              <div class="hub-story-body">
                <span class="feed-cat" style="color: var(--terracotta); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">\${a.category}</span>
                <h3>\${a.title}</h3>
                <p>\${a.excerpt || ''}</p>
                <div class="hub-story-meta">\${a.date} &middot; \${a.readTime} &middot; By \${a.author}</div>
              </div>
            </a>
          \`).join('');
        });
      </script>
    `;

    html = html.substring(0, startIndex) + replacement + html.substring(endIndex);
    fs.writeFileSync(file, html);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Could not find replacement boundaries in ${file}`);
  }
});

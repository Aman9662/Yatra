const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\aman7\\OneDrive\\Desktop\\sem 3\\blog website\\yatra';
const imgDir = path.join(dir, 'assets', 'img');

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

const statePages = {
  delhi: ['India Gate', 'Chandni Chowk', 'Humayun\'s Tomb', 'Lodhi Gardens', 'Jama Masjid, Delhi', 'Qutb Minar', 'Samosa'],
  kerala: ['Kerala backwaters', 'Alappuzha', 'Fort Kochi', 'Munnar', 'Varkala Beach', 'Wayanad district', 'Theyyam'],
  rajasthan: ['Amer Fort', 'Jodhpur', 'Jaisalmer', 'Lake Palace', 'Pushkar Lake', 'Hawa Mahal', 'Ranthambore National Park'],
  goa: ['Goa', 'Panaji', 'Dudhsagar Falls', 'Basilica of Bom Jesus', 'Palolem Beach', 'Spice', 'Anjuna, Goa'],
  gujarat: ['Rann of Kutch', 'Rann Utsav', 'Gir National Park', 'Ahmedabad', 'Dwarkadhish Temple', 'Rani ki vav', 'Mandvi, Kutch'],
  assam: ['Brahmaputra River', 'Kaziranga National Park', 'Majuli', 'Assam tea', 'Kamakhya Temple', 'Indian rhinoceros', 'Rang Ghar']
};

async function fetchWikiImageUrl(topic) {
  return new Promise((resolve) => {
    https.get(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(topic)}&prop=pageimages&format=json&pithumbsize=800`, {
      headers: { 'User-Agent': 'YatraBot/1.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch(e) { resolve(null); }
      });
    });
  });
}

async function downloadImage(url, filename) {
  return new Promise((resolve) => {
    const dest = path.join(imgDir, filename);
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'YatraBot/1.0' } }, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(`assets/img/${filename}`);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      resolve(null);
    });
  });
}

// Fallback images in case Wikipedia doesn't have one
const fallbacks = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
];

async function run() {
  for (const [state, topics] of Object.entries(statePages)) {
    const htmlFile = path.join(dir, `${state}.html`);
    if (!fs.existsSync(htmlFile)) continue;
    
    let content = fs.readFileSync(htmlFile, 'utf-8');
    
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      console.log(`Processing ${topic}...`);
      
      let url = await fetchWikiImageUrl(topic);
      if (!url) {
        url = fallbacks[i % fallbacks.length];
      }
      
      const localFilename = `${state}_${i}.jpg`;
      const localPath = await downloadImage(url, localFilename);
      
      if (localPath) {
        if (i === 0) {
          content = content.replace(/<header class="[a-zA-Z0-9_-]*hero"[^>]*style="background-image:\s*url\('[^']+'\);"/, 
            (match) => match.replace(/url\('[^']+'\)/, `url('${localPath}')`));
        } else if (i === 1) {
          content = content.replace(/<div class="featured-img"[^>]*style="background-image:\s*url\('[^']+'\);"/, 
            (match) => match.replace(/url\('[^']+'\)/, `url('${localPath}')`));
        } else {
          // Replace nth card image
          let matchCount = 0;
          const cardIndexTarget = i - 2;
          content = content.replace(/<div class="story-card-img"[^>]*style="background-image:\s*url\('[^']+'\);"/g, (match) => {
            if (matchCount === cardIndexTarget) {
              matchCount++;
              return match.replace(/url\('[^']+'\)/, `url('${localPath}')`);
            }
            matchCount++;
            return match;
          });
        }
      }
    }
    fs.writeFileSync(htmlFile, content, 'utf-8');
    console.log(`Saved ${state}.html`);
  }
  
  // Fix home.html too
  const homeHtmlFile = path.join(dir, `home.html`);
  if (fs.existsSync(homeHtmlFile)) {
      let homeContent = fs.readFileSync(homeHtmlFile, 'utf-8');
      
      // Hero
      homeContent = homeContent.replace(/<section class="blog-hero"[^>]*style="background-image:\s*url\('[^']+'\);"/, 
        (match) => match.replace(/url\('[^']+'\)/, `url('assets/img/delhi_0.jpg')`));
        
      // 5 Featured
      const featured = ['assets/img/delhi_2.jpg', 'assets/img/kerala_1.jpg', 'assets/img/goa_1.jpg', 'assets/img/assam_3.jpg', 'assets/img/gujarat_1.jpg'];
      let idx = 0;
      homeContent = homeContent.replace(/class="featured-card"[^>]*style="background-image:\s*url\('[^']+'\);"/g, (match) => {
        if (idx < featured.length) {
          const newMatch = match.replace(/url\('[^']+'\)/, `url('${featured[idx]}')`);
          idx++;
          return newMatch;
        }
        return match;
      });
      
      // Latest stories
      idx = 0;
      homeContent = homeContent.replace(/<div class="story-card-img"[^>]*style="background-image:\s*url\('[^']+'\);"/g, (match) => {
        if (idx < featured.length) {
          const newMatch = match.replace(/url\('[^']+'\)/, `url('${featured[idx]}')`);
          idx++;
          return newMatch;
        }
        return match;
      });
      
      fs.writeFileSync(homeHtmlFile, homeContent, 'utf-8');
      console.log('Saved home.html');
  }
}

run();

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

async function fetchWikiImage(topic) {
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
            // Fallback to Wikipedia article parse
            resolve(null);
          }
        } catch(e) { resolve(null); }
      });
    });
  });
}

async function run() {
  for (const [state, topics] of Object.entries(statePages)) {
    const htmlFile = path.join(dir, `${state}.html`);
    if (!fs.existsSync(htmlFile)) continue;
    
    let content = fs.readFileSync(htmlFile, 'utf-8');
    
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      console.log(`Fetching ${topic}...`);
      let url = await fetchWikiImage(topic);
      
      if (!url) {
        // Fallback placeholder if Wikipedia fails completely
        url = `https://picsum.photos/seed/${state}${i}/800/600`;
      }
      
      if (i === 0) {
        content = content.replace(/<header class="[a-zA-Z0-9_-]*hero"[^>]*style="background-image:\s*url\('[^']+'\);"/, 
          (match) => match.replace(/url\('[^']+'\)/, `url('${url}')`));
      } else if (i === 1) {
        content = content.replace(/<div class="featured-img"[^>]*style="background-image:\s*url\('[^']+'\);"/, 
          (match) => match.replace(/url\('[^']+'\)/, `url('${url}')`));
      } else {
        // Nth card
        let matchCount = 0;
        const cardIndexTarget = i - 2;
        content = content.replace(/<div class="story-card-img"[^>]*style="background-image:\s*url\('[^']+'\);"/g, (match) => {
          if (matchCount === cardIndexTarget) {
            matchCount++;
            return match.replace(/url\('[^']+'\)/, `url('${url}')`);
          }
          matchCount++;
          return match;
        });
      }
    }
    fs.writeFileSync(htmlFile, content, 'utf-8');
    console.log(`Saved ${state}.html`);
  }
}

run();

const https = require('https');
const fs = require('fs');

const topics = {
  'delhi': [
    { title: 'India_Gate', var: 'delhi_hero' },
    { title: 'Chandni_Chowk', var: 'delhi_featured' },
    { title: 'Humayun\'s_Tomb', var: 'delhi_1' },
    { title: 'Lodhi_Gardens', var: 'delhi_2' },
    { title: 'Jama_Masjid,_Delhi', var: 'delhi_3' },
    { title: 'Qutb_Minar', var: 'delhi_4' },
    { title: 'Samosa', var: 'delhi_5' }
  ],
  'kerala': [
    { title: 'Kerala_backwaters', var: 'kerala_hero' },
    { title: 'Alappuzha', var: 'kerala_featured' },
    { title: 'Fort_Kochi', var: 'kerala_1' },
    { title: 'Munnar', var: 'kerala_2' },
    { title: 'Varkala_Beach', var: 'kerala_3' },
    { title: 'Wayanad_district', var: 'kerala_4' },
    { title: 'Theyyam', var: 'kerala_5' }
  ],
  'rajasthan': [
    { title: 'Amer_Fort', var: 'raj_hero' },
    { title: 'Jodhpur', var: 'raj_featured' },
    { title: 'Jaisalmer', var: 'raj_1' },
    { title: 'Lake_Palace', var: 'raj_2' },
    { title: 'Pushkar_Lake', var: 'raj_3' },
    { title: 'Amer_Fort', var: 'raj_4' },
    { title: 'Ranthambore_National_Park', var: 'raj_5' }
  ],
  'goa': [
    { title: 'Goa', var: 'goa_hero' },
    { title: 'Panaji', var: 'goa_featured' },
    { title: 'Dudhsagar_Falls', var: 'goa_1' },
    { title: 'Basilica_of_Bom_Jesus', var: 'goa_2' },
    { title: 'Palolem_Beach', var: 'goa_3' },
    { title: 'Spice', var: 'goa_4' },
    { title: 'Anjuna,_Goa', var: 'goa_5' }
  ],
  'gujarat': [
    { title: 'Rann_of_Kutch', var: 'guj_hero' },
    { title: 'Rann_Utsav', var: 'guj_featured' },
    { title: 'Gir_National_Park', var: 'guj_1' },
    { title: 'Ahmedabad', var: 'guj_2' },
    { title: 'Dwarkadhish_Temple', var: 'guj_3' },
    { title: 'Rani_ki_vav', var: 'guj_4' },
    { title: 'Mandvi,_Kutch', var: 'guj_5' }
  ],
  'assam': [
    { title: 'Brahmaputra_River', var: 'assam_hero' },
    { title: 'Kaziranga_National_Park', var: 'assam_featured' },
    { title: 'Majuli', var: 'assam_1' },
    { title: 'Assam_tea', var: 'assam_2' },
    { title: 'Kamakhya_Temple', var: 'assam_3' },
    { title: 'Indian_rhinoceros', var: 'assam_4' },
    { title: 'Rang_Ghar', var: 'assam_5' }
  ]
};

const output = {};

async function fetchImage(title) {
  return new Promise(resolve => {
    const req = https.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title), {
      headers: { 'User-Agent': 'YatraBlogBot/1.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.originalimage && json.originalimage.source) {
            let src = json.originalimage.source;
            // Convert to 800px thumb
            src = src.replace(/\d+px-/, '800px-');
            resolve(src);
          } else {
            resolve('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png');
          }
        } catch(e) { resolve('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png'); }
      });
    });
    req.on('error', () => resolve('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png'));
  });
}

async function run() {
  for (const [state, list] of Object.entries(topics)) {
    output[state] = {};
    for (const item of list) {
      const url = await fetchImage(item.title);
      output[state][item.var] = url;
    }
  }
  fs.writeFileSync('wiki_urls.json', JSON.stringify(output, null, 2));
  console.log('URLs fetched and saved to wiki_urls.json');
}

run();

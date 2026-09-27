const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\aman7\\OneDrive\\Desktop\\sem 3\\blog website\\yatra';
const htmlFile = path.join(dir, 'home.html');

let content = fs.readFileSync(htmlFile, 'utf-8');

// Replace Hero with Taj Mahal
content = content.replace(/<section class="blog-hero"[^>]*style="background-image:\s*url\('[^']+'\);"/, 
  (match) => match.replace(/url\('[^']+'\)/, `url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Taj_Mahal_in_March_2004.jpg/1280px-Taj_Mahal_in_March_2004.jpg')`));

// Replace the 5 featured cards with proper images
const featuredUrls = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Taj_Mahal_in_March_2004.jpg/800px-Taj_Mahal_in_March_2004.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Alappuzha_Boat_Beauty_W.jpg/800px-Alappuzha_Boat_Beauty_W.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Panaji_City.JPG/800px-Panaji_City.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Assam_Tea_Garden.jpg/800px-Assam_Tea_Garden.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tent_City_-_Rann_Utsav.jpg/800px-Tent_City_-_Rann_Utsav.jpg'
];

let idx = 0;
content = content.replace(/class="featured-card"[^>]*style="background-image:\s*url\('[^']+'\);"/g, (match) => {
  if (idx < featuredUrls.length) {
    const newMatch = match.replace(/url\('[^']+'\)/, `url('${featuredUrls[idx]}')`);
    idx++;
    return newMatch;
  }
  return match;
});

// Latest stories
idx = 0;
content = content.replace(/<div class="story-card-img"[^>]*style="background-image:\s*url\('[^']+'\);"/g, (match) => {
  if (idx < featuredUrls.length) {
    const newMatch = match.replace(/url\('[^']+'\)/, `url('${featuredUrls[idx]}')`);
    idx++;
    return newMatch;
  }
  return match;
});

fs.writeFileSync(htmlFile, content, 'utf-8');
console.log('Saved home.html');

const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\aman7\\OneDrive\\Desktop\\sem 3\\blog website\\yatra\\';

const states = ['kerala.html', 'rajasthan.html', 'delhi.html', 'goa.html', 'gujarat.html', 'assam.html'];

const extraCards = {
  'kerala': `
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Nature / Wildlife</span>
            <h3>Wayanad Wildlife</h3>
            <p class="teaser">Deep in the Western Ghats, misty forests hide elephants, tigers, and ancient tribal communities.</p>
          </div>
        </article>
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Culture / Tradition</span>
            <h3>Theyyam Rituals</h3>
            <p class="teaser">An ancient art form where dancers become gods, performing elaborate fire rituals at twilight temples.</p>
          </div>
        </article>`,
  'rajasthan': `
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Heritage / Architecture</span>
            <h3>Amer Fort at Dawn</h3>
            <p class="teaser">The massive hilltop fortress near Jaipur, where elephants once carried royalty up the winding path.</p>
          </div>
        </article>
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1561731216-c3a4d514b312?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Nature / Wildlife</span>
            <h3>Ranthambore Tigers</h3>
            <p class="teaser">Tracking Bengal tigers through the ruins of an ancient fort, where wildlife and history merge.</p>
          </div>
        </article>`,
  'delhi': `
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1585135497273-1a86d9471b8d?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Heritage / History</span>
            <h3>Qutub Minar Complex</h3>
            <p class="teaser">The 73-meter victory tower, surrounded by ruins spanning a thousand years of Delhi history.</p>
          </div>
        </article>
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Food / Culture</span>
            <h3>Street Food Trail</h3>
            <p class="teaser">From chole bhature in Sita Ram to butter chicken at Moti Mahal — eating through 400 years of food history.</p>
          </div>
        </article>`,
  'goa': `
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Nature / Food</span>
            <h3>Spice Plantations</h3>
            <p class="teaser">Deep in the Western Ghats hinterland, where vanilla, cardamom, and pepper grow wild among tropical trees.</p>
          </div>
        </article>
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Culture / Shopping</span>
            <h3>Anjuna Flea Market</h3>
            <p class="teaser">Wednesday mornings come alive with color as vendors spread handmade jewelry, fabrics, and spices.</p>
          </div>
        </article>`,
  'gujarat': `
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1585135497273-1a86d9471b8d?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Heritage / Architecture</span>
            <h3>Rani ki Vav</h3>
            <p class="teaser">A UNESCO step-well so intricately carved it feels like descending into a cathedral beneath the earth.</p>
          </div>
        </article>
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Coast / Slow Travel</span>
            <h3>Mandvi Beach</h3>
            <p class="teaser">A quiet, windswept beach where traditional wooden dhows are still built by hand on the shore.</p>
          </div>
        </article>`,
  'assam': `
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Nature / Wildlife</span>
            <h3>Manas National Park</h3>
            <p class="teaser">A UNESCO site where tigers, elephants, and wild buffalo roam through dense subtropical forest.</p>
          </div>
        </article>
        <article class="story-card">
          <div class="story-card-img" style="background-image: url('https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80');"></div>
          <div class="story-card-body">
            <span class="story-cat">Heritage / History</span>
            <h3>Sivasagar Heritage</h3>
            <p class="teaser">The ancient Ahom capital with stunning temple tanks and ruins that predate the Mughal empire.</p>
          </div>
        </article>`
};

const reviewsHtml = \`
<section class="reviews-section">
  <div class="container">
    <div class="section-header"><h2>Traveller Reviews</h2></div>
    
    <!-- Review Form -->
    <div class="review-form-card">
      <h3>Share your experience</h3>
      <form id="reviewForm">
        <div class="review-form-row">
          <input class="form-input" type="text" id="reviewName" placeholder="Your name" required>
          <select class="form-input" id="reviewRating" required>
            <option value="">Rating</option>
            <option value="5">★★★★★ Excellent</option>
            <option value="4">★★★★☆ Good</option>
            <option value="3">★★★☆☆ Average</option>
            <option value="2">★★☆☆☆ Poor</option>
            <option value="1">★☆☆☆☆ Bad</option>
          </select>
        </div>
        <textarea class="form-input" id="reviewText" rows="4" placeholder="Tell others about your experience..." required></textarea>
        <button type="submit" class="btn-primary">Post Review</button>
      </form>
    </div>
    
    <!-- Reviews List -->
    <div id="reviewsList" class="reviews-list"></div>
  </div>
</section>
\`;

const relatedPosts = {
  kerala: [
    { state: 'rajasthan', name: 'Rajasthan', title: 'Amer Fort at Dawn', teaser: 'The massive hilltop fortress near Jaipur.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
    { state: 'delhi', name: 'Delhi', title: 'Street Food Trail', teaser: 'Eating through 400 years of food history.', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
    { state: 'goa', name: 'Goa', title: 'Spice Plantations', teaser: 'Deep in the Western Ghats hinterland.', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80' }
  ],
  rajasthan: [
    { state: 'kerala', name: 'Kerala', title: 'Wayanad Wildlife', teaser: 'Misty forests hiding elephants and tigers.', img: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=600&q=80' },
    { state: 'goa', name: 'Goa', title: 'Anjuna Flea Market', teaser: 'Wednesday mornings come alive with color.', img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80' },
    { state: 'assam', name: 'Assam', title: 'Sivasagar Heritage', teaser: 'The ancient Ahom capital with stunning ruins.', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80' }
  ],
  delhi: [
    { state: 'gujarat', name: 'Gujarat', title: 'Mandvi Beach', teaser: 'A quiet, windswept beach with traditional dhows.', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    { state: 'kerala', name: 'Kerala', title: 'Theyyam Rituals', teaser: 'An ancient art form where dancers become gods.', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' },
    { state: 'rajasthan', name: 'Rajasthan', title: 'Ranthambore Tigers', teaser: 'Tracking Bengal tigers through ruins.', img: 'https://images.unsplash.com/photo-1561731216-c3a4d514b312?auto=format&fit=crop&w=600&q=80' }
  ],
  goa: [
    { state: 'assam', name: 'Assam', title: 'Manas National Park', teaser: 'Tigers, elephants, and wild buffalo roam here.', img: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80' },
    { state: 'delhi', name: 'Delhi', title: 'Qutub Minar Complex', teaser: 'Surrounded by ruins spanning a thousand years.', img: 'https://images.unsplash.com/photo-1585135497273-1a86d9471b8d?auto=format&fit=crop&w=600&q=80' },
    { state: 'gujarat', name: 'Gujarat', title: 'Rani ki Vav', teaser: 'A UNESCO step-well so intricately carved.', img: 'https://images.unsplash.com/photo-1585135497273-1a86d9471b8d?auto=format&fit=crop&w=600&q=80' }
  ],
  gujarat: [
    { state: 'kerala', name: 'Kerala', title: 'Wayanad Wildlife', teaser: 'Misty forests hiding elephants and tigers.', img: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=600&q=80' },
    { state: 'goa', name: 'Goa', title: 'Anjuna Flea Market', teaser: 'Wednesday mornings come alive with color.', img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80' },
    { state: 'assam', name: 'Assam', title: 'Sivasagar Heritage', teaser: 'The ancient Ahom capital with stunning ruins.', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80' }
  ],
  assam: [
    { state: 'rajasthan', name: 'Rajasthan', title: 'Amer Fort at Dawn', teaser: 'The massive hilltop fortress near Jaipur.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
    { state: 'delhi', name: 'Delhi', title: 'Street Food Trail', teaser: 'Eating through 400 years of food history.', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
    { state: 'goa', name: 'Goa', title: 'Spice Plantations', teaser: 'Deep in the Western Ghats hinterland.', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80' }
  ]
};

function generateRelatedHtml(stateKey) {
  let cardsHtml = relatedPosts[stateKey].map(p => \`
      <a href="\${p.state}.html" class="story-card">
        <div class="story-card-img" style="background-image: url('\${p.img}');"></div>
        <div class="story-card-body">
          <span class="story-cat">\${p.name}</span>
          <h3>\${p.title}</h3>
          <p class="teaser">\${p.teaser}</p>
        </div>
      </a>\`).join('');

  return \`
<section class="related-section">
  <div class="container">
    <div class="section-header"><h2>Read Next</h2></div>
    <div class="dest-grid">
\${cardsHtml}
    </div>
  </div>
</section>
\`;
}

for(let f of states) {
  let p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  let sKey = f.replace('.html', '');
  
  // 1. Add extra cards
  content = content.replace(/<\\/div>\\s*<\\/section>\\s*<\\/div>/, (match) => {
    return extraCards[sKey] + "\\n      </div>\\n    </section>\\n  </div>";
  });
  
  // 2. Add reviews section AFTER destination cards, BEFORE sentiment
  content = content.replace(/<\\/div>\\s*<section class="sentiment-section">/, (match) => {
    return \`</div>\\n\\n  \${reviewsHtml}\\n\\n  <section class="sentiment-section">\`;
  });
  
  // 3. Add related posts section AFTER sentiment, BEFORE footer
  content = content.replace(/<\\/section>\\s*<footer class="site-footer">/, (match) => {
    return \`</section>\\n\\n  \${generateRelatedHtml(sKey)}\\n\\n  <footer class="site-footer">\`;
  });
  
  // 4. Add reviews script tag before </body>
  content = content.replace(/<\\/body>/, (match) => {
    return \`  <script src="js/reviews.js"></script>\\n</body>\`;
  });
  
  fs.writeFileSync(p, content, 'utf8');
  console.log("Updated " + f);
}

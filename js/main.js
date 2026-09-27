// main.js — YATRA Blog Core Interactions (ES6 only)

// ─── HELPERS ───
const getSaved = () => {
  try {
    return JSON.parse(localStorage.getItem('yatra_saved') || '[]');
  } catch { return []; }
};

const setSaved = (arr) => localStorage.setItem('yatra_saved', JSON.stringify(arr));

const stateInfo = {
  Delhi:     { img: 'assets/img/delhi_0.jpg', tag: 'Seven cities. One heartbeat.' },
  Rajasthan: { img: 'assets/img/rajasthan_0.jpg', tag: 'Where every wall remembers a kingdom.' },
  Gujarat:   { img: 'assets/img/gujarat_0.jpg', tag: 'Where the white desert meets the sea.' },
  Goa:       { img: 'assets/img/goa_0.jpg', tag: 'Beyond the beach.' },
  Kerala:    { img: 'assets/img/kerala_0.jpg', tag: 'Where water slows the world down.' },
  Assam:     { img: 'assets/img/assam_0.jpg', tag: 'Where the river shapes life.' }
};

// ─── NAVBAR COUNT ───
window.updateNav = () => {
  const el = document.getElementById('savedLink');
  if (el) el.textContent = `Saved Locally (${getSaved().length})`;
};
window.updateNav();

// ─── SAVE BUTTON (state pages) ───
const saveBtn = document.getElementById('saveStateBtn');
const stateEl = document.getElementById('stateNameData');

if (saveBtn && stateEl) {
  const name = stateEl.dataset.state;
  const refresh = () => {
    const saved = getSaved();
    if (saved.includes(name)) {
      saveBtn.classList.add('saved');
      saveBtn.innerHTML = '&#9733; Saved to Your Yatra';
    } else {
      saveBtn.classList.remove('saved');
      saveBtn.innerHTML = '&#9734; Save to Your Yatra';
    }
  };
  refresh();

  saveBtn.addEventListener('click', () => {
    let saved = getSaved();
    saved = saved.includes(name) ? saved.filter(s => s !== name) : [...saved, name];
    setSaved(saved);
    refresh();
    window.updateNav();
  });
}

// ─── YOUR YATRA PAGE ───
const grid = document.getElementById('savedGrid');
const counter = document.getElementById('savedCounter');
const clearBtn = document.getElementById('clearBtn');

if (grid) {
  const saved = getSaved();

  if (counter) {
    counter.textContent = saved.length > 0 ? `${saved.length} of 6 states saved` : '';
  }

  if (saved.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h2>Your journey hasn't started yet.</h2>
        <p>Browse the stories, discover destinations, and save the ones that call to you.</p>
        <a href="home.html" class="btn-primary">Explore stories &rarr;</a>
      </div>`;
  } else {
    if (clearBtn) clearBtn.style.display = 'inline-flex';
    saved.forEach(name => {
      const info = stateInfo[name] || { img: '', tag: '' };
      const el = document.createElement('article');
      el.className = 'story-card';
      el.innerHTML = `
        <div class="story-card-img" style="background-image:url('${info.img}');"></div>
        <div class="story-card-body">
          <span class="story-cat">Saved Destination</span>
          <h3>${name}</h3>
          <p class="teaser">${info.tag}</p>
          <a href="${name.toLowerCase()}.html" class="read-link" style="margin-top:12px;">Read stories &rarr;</a>
        </div>`;
      grid.appendChild(el);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('yatra_saved');
      window.location.reload();
    });
  }
}

// --- MOOD FILTERING (home.html) ---
document.addEventListener('DOMContentLoaded', () => {
  const moodBtns = document.querySelectorAll('.mood-btn');
  const cards = document.querySelectorAll('.story-card, .featured-card');
  
  if(moodBtns.length > 0) {
    moodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        moodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mood = btn.innerText;
        
        cards.forEach(card => {
          if (mood === 'All') {
            card.style.display = '';
          } else {
            // Find category span inside the card
            const cat = card.querySelector('.story-cat, .hero-cat');
            if (cat && cat.innerText.includes(mood.split(' ')[0])) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  }
});





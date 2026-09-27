// reviews.js — User Reviews & Community Feedback (ES6 & localStorage)
// Semester 3 Web Development Project — YATRA India Travel Blog

// ─── DEMO / SEED REVIEWS BY STATE ───
const demoReviewsByState = {
  Kerala: [
    {
      name: 'Ananya Sharma',
      rating: 5,
      text: "The morning houseboat cruise on the Alleppey backwaters was pure serenity. Fresh karimeen fry prepared onboard was unforgettable. Kerala truly lives up to God's Own Country!",
      date: '2026-08-15T09:30:00Z'
    },
    {
      name: 'Rohan Mehta',
      rating: 5,
      text: "Fort Kochi has so much historic character! The colonial bungalows, spice warehouses, and Chinese fishing nets make you feel like you stepped back in time. Munnar tea estates were also breathtaking.",
      date: '2026-07-28T14:15:00Z'
    },
    {
      name: 'Maya Pillai',
      rating: 4,
      text: "Loved the sunset from the Varkala cliffs overlooking the Arabian sea. Strolling past clifftop cafes with sea breeze and live music in the evening was an absolute highlight.",
      date: '2026-06-12T18:45:00Z'
    }
  ],
  Delhi: [
    {
      name: 'Priyansh Verma',
      rating: 5,
      text: "An extraordinary blend of ancient history and bustling street life. The Old Delhi food walk through Chandni Chowk and Jama Masjid was an incredible sensory feast!",
      date: '2026-08-20T11:20:00Z'
    },
    {
      name: 'Tanvi Sen',
      rating: 4,
      text: "Humayun's Tomb and Qutub Minar are architectural marvels. Delhi Metro made travelling between Mughal heritage and chic South Delhi cafes seamless.",
      date: '2026-07-14T16:05:00Z'
    },
    {
      name: 'Kabir Kapoor',
      rating: 5,
      text: "Sunder Nursery on a winter Sunday afternoon was magnificent. Strolling through the restored Mughal garden pavilions with local artisan crafts was truly memorable.",
      date: '2026-06-05T10:10:00Z'
    }
  ],
  Rajasthan: [
    {
      name: 'Vikramaditya Rathore',
      rating: 5,
      text: "Watching the golden sunset over Jaisalmer Fort from a rooftop cafe felt straight out of a fairy tale. The desert camp and folk music in Sam dunes were surreal.",
      date: '2026-08-24T20:00:00Z'
    },
    {
      name: 'Meera Joshi',
      rating: 5,
      text: "Udaipur's Lake Pichola at sunset is breathtaking. Wandering the royal courtyards of City Palace and staying in a heritage haveli made us feel like royalty.",
      date: '2026-07-30T12:40:00Z'
    },
    {
      name: 'Siddharth Malhotra',
      rating: 4,
      text: "Mehrangarh Fort towering above the blue houses of Jodhpur is the most imposing fort I have ever seen. Don't skip the pyaaz kachori at local sweet shops!",
      date: '2026-06-18T15:30:00Z'
    }
  ],
  Goa: [
    {
      name: 'Zoya Farooqui',
      rating: 5,
      text: "Exploring the vibrant pastel alleys of Fontainhas in Panaji felt like stepping into Portugal. South Goa beaches like Palolem were calm, pristine, and wonderfully serene.",
      date: '2026-08-18T13:25:00Z'
    },
    {
      name: 'Kevin D’Souza',
      rating: 5,
      text: "Authentic Goan prawn curry with poi at a quaint beach shack. Watching the crimson sunset while listening to waves is the quintessential susegad lifestyle.",
      date: '2026-07-22T19:10:00Z'
    },
    {
      name: 'Aisha Nair',
      rating: 4,
      text: "Kayaking through the mangrove backwaters of Chorao island was a fantastic eco-adventure away from the crowded tourist strips. Old Goa churches are deeply awe-inspiring.",
      date: '2026-06-25T08:50:00Z'
    }
  ],
  Gujarat: [
    {
      name: 'Harshit Trivedi',
      rating: 5,
      text: "The White Rann of Kutch under the moonlight is one of the most surreal landscapes on earth. The vibrant Rogan embroidery and folk songs around the campfire were unforgettable.",
      date: '2026-08-10T21:15:00Z'
    },
    {
      name: 'Swati Patel',
      rating: 5,
      text: "The intricate stone carvings at Rani ki Vav stepwell in Patan left me speechless. We also took a safari at Sasan Gir and were fortunate enough to spot Asiatic lions!",
      date: '2026-07-19T17:35:00Z'
    },
    {
      name: 'Deepak Shah',
      rating: 4,
      text: "Ahmedabad's old city heritage pols and the late-night street food feast at Manek Chowk are legendary. Super safe, wonderful roads, and warm hospitality.",
      date: '2026-06-08T11:45:00Z'
    }
  ],
  Assam: [
    {
      name: 'Debashish Barua',
      rating: 5,
      text: "Spotting majestic one-horned rhinos during the Kaziranga morning safari was an absolute dream come true. The tea garden hills across Golaghat are breathtakingly lush.",
      date: '2026-08-22T07:40:00Z'
    },
    {
      name: 'Shalini Hazarika',
      rating: 5,
      text: "Majuli Island opened my eyes to the serene monastic culture of Assam's satras. The mask-making tradition at Samaguri Satra and river sunsets are unforgettable.",
      date: '2026-07-25T16:20:00Z'
    },
    {
      name: 'Aditya Saxena',
      rating: 4,
      text: "A serene evening cruise on the mighty Brahmaputra river paired with piping hot Assam CTC tea. Peaceful, unexplored, and genuinely heartwarming hospitality.",
      date: '2026-06-14T10:00:00Z'
    }
  ]
};

// Generic fallback seed reviews for any state not listed above
const defaultDemoReviews = [
  {
    name: 'Aarav Malhotra',
    rating: 5,
    text: 'An unforgettable travel experience! The local food, scenic viewpoints, and hospitable people made every moment memorable.',
    date: '2026-08-01T10:00:00Z'
  },
  {
    name: 'Sneha Kulkarni',
    rating: 4,
    text: 'Great destination to explore over a long weekend. Be sure to arrive early in the morning to beat the crowds at popular spots.',
    date: '2026-07-15T15:30:00Z'
  }
];

// ─── STORAGE HELPERS (localStorage + try/catch) ───
const getStorageKey = (state) => `yatra_reviews_${state}`;

const loadReviews = (state) => {
  try {
    const raw = localStorage.getItem(getStorageKey(state));
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to parse reviews from localStorage:', err);
    return null;
  }
};

const persistReviews = (state, reviews) => {
  try {
    localStorage.setItem(getStorageKey(state), JSON.stringify(reviews));
  } catch (err) {
    console.error('Failed to save reviews to localStorage:', err);
  }
};

// Seed initial reviews if localStorage is empty for this state
const getOrSeedReviews = (state) => {
  const existing = loadReviews(state);
  if (!existing || existing.length === 0) {
    const seed = demoReviewsByState[state] || defaultDemoReviews;
    persistReviews(state, seed);
    return seed;
  }
  return existing;
};

// ─── FORMATTING HELPERS ───
const formatStars = (rating) => {
  const count = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));
  return '★'.repeat(count) + '☆'.repeat(5 - count);
};

const formatDate = (dateString) => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Recently';
  }
};

// Helper to sanitize user input before template literal rendering
const sanitize = (text) => {
  const temp = document.createElement('div');
  temp.textContent = text || '';
  return temp.innerHTML;
};

// ─── RENDER FUNCTION ───
const renderReviewsList = (reviews, container) => {
  if (!container) return;

  if (!reviews || reviews.length === 0) {
    container.innerHTML = `
      <div class="review-card" style="text-align: center; color: var(--muted); padding: 40px 20px;">
        <p>No reviews yet for this state. Be the first to share your journey!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reviews.map((rev) => {
    const { name, rating, text, date } = rev;
    return `
      <div class="review-card">
        <div class="review-header">
          <div class="review-author">${sanitize(name)}</div>
          <div class="review-stars">${formatStars(rating)}</div>
          <div class="review-date">${formatDate(date)}</div>
        </div>
        <p class="review-text">${sanitize(text)}</p>
      </div>
    `;
  }).join('');
};

// ─── SUCCESS MESSAGE ───
const showSuccessNotification = (formEl) => {
  const parent = formEl.parentNode;
  const existing = parent.querySelector('.review-success');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.className = 'review-success';
  msg.textContent = '✓ Thank you! Your review has been posted successfully.';

  parent.insertBefore(msg, formEl);

  setTimeout(() => {
    msg.style.transition = 'opacity 0.4s ease';
    msg.style.opacity = '0';
    setTimeout(() => msg.remove(), 400);
  }, 3500);
};

// ─── INITIALIZATION ───
const initReviews = () => {
  // 1. Identify the current state from <body id="stateNameData" data-state="...">
  const stateEl = document.getElementById('stateNameData');
  if (!stateEl) return;

  const stateName = stateEl.dataset.state || stateEl.getAttribute('data-state');
  if (!stateName) return;

  const reviewForm = document.getElementById('reviewForm');
  const reviewsList = document.getElementById('reviewsList');

  if (!reviewsList) return;

  // 2. Load seeded/stored reviews and render them
  const reviews = getOrSeedReviews(stateName);
  renderReviewsList(reviews, reviewsList);

  // 3. Form submission handling
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('reviewName');
      const ratingInput = document.getElementById('reviewRating');
      const textInput = document.getElementById('reviewText');

      const name = nameInput ? nameInput.value.trim() : '';
      const rating = ratingInput ? Number(ratingInput.value) : 5;
      const text = textInput ? textInput.value.trim() : '';

      // Basic validation
      if (!name || !text) {
        alert('Please provide your name and your review experience.');
        return;
      }

      // Create new review object
      const newReview = {
        name,
        rating,
        text,
        date: new Date().toISOString()
      };

      // Add to beginning of reviews array
      const currentReviews = loadReviews(stateName) || [];
      const updatedReviews = [newReview, ...currentReviews];

      // Save to localStorage
      persistReviews(stateName, updatedReviews);

      // Re-render reviews list
      renderReviewsList(updatedReviews, reviewsList);

      // Reset the form
      reviewForm.reset();

      // Show brief success alert
      showSuccessNotification(reviewForm);
    });
  }
};

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReviews);
} else {
  initReviews();
}

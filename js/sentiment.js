// sentiment.js — Tourist Sentiment Dashboard (Units 4 & 5)
// Uses: ES6 async/await, fetch(), try/catch, Chart.js, DOM manipulation

const loadSentimentData = async () => {
  const chartCanvas = document.getElementById('sentimentChart');
  const tableBody = document.getElementById('sentimentTableBody');
  const insightText = document.getElementById('quickInsight');
  
  if (!chartCanvas || !tableBody) return;

  const currentStateEl = document.getElementById('stateNameData');
  if (!currentStateEl) return;
  const currentState = currentStateEl.getAttribute('data-state');

  try {
    // Fetch mock JSON data (Unit 4: fetch, async/await, try/catch)
    const response = await fetch('data/sentiment.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    // Find this state's data
    const stateInfo = data.find(item => item.state === currentState);
    
    // Update insight text
    if (stateInfo && insightText) {
      insightText.textContent = `"${stateInfo.insight}"`;
    }

    // Build Chart.js horizontal bar chart (Unit 5)
    if (stateInfo && typeof Chart !== 'undefined') {
      Chart.defaults.font.family = "'Inter', sans-serif";
      Chart.defaults.color = '#8A8780';

      new Chart(chartCanvas, {
        type: 'bar',
        data: {
          labels: ['Positive', 'Neutral', 'Negative'],
          datasets: [{
            label: 'Tourist Reviews (%)',
            data: [stateInfo.positive, stateInfo.neutral, stateInfo.negative],
            backgroundColor: ['#1D5B4A', '#C9C1F7', '#D96B3B'],
            borderWidth: 0,
            borderRadius: 6,
            barThickness: 28
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1B1A17',
              titleFont: { family: "'Inter', sans-serif", size: 13 },
              bodyFont: { family: "'Inter', sans-serif", size: 13 },
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.x}% of reviews`
              }
            }
          },
          scales: {
            x: {
              max: 100,
              grid: { color: 'rgba(0,0,0,0.04)' },
              ticks: {
                callback: (val) => `${val}%`,
                font: { size: 12 }
              }
            },
            y: {
              grid: { display: false },
              ticks: {
                font: { size: 13, weight: 600 },
                color: '#1B1A17'
              }
            }
          }
        }
      });
    }

    // Build dynamic table (Unit 5: insertRow, insertCell)
    data.forEach(item => {
      const row = tableBody.insertRow();
      
      // Destination name
      row.insertCell().textContent = item.state;
      
      // Total reviews
      row.insertCell().textContent = item.reviews.toLocaleString();
      
      // Positive (green)
      const posCell = row.insertCell();
      posCell.textContent = `${item.positive}%`;
      posCell.style.color = '#1D5B4A';
      posCell.style.fontWeight = '600';

      // Neutral
      row.insertCell().textContent = `${item.neutral}%`;
      
      // Negative (highlight if high)
      const negCell = row.insertCell();
      negCell.textContent = `${item.negative}%`;
      if (item.negative >= 10) {
        negCell.style.color = '#D96B3B';
        negCell.style.fontWeight = '600';
      }

      // AI conclusion
      row.insertCell().textContent = item.insight;
    });

  } catch (error) {
    console.error('Sentiment load error:', error);
    if (insightText) {
      insightText.textContent = 'Unable to load demo data. Please ensure you are running on a local server.';
    }
  }
};

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', loadSentimentData);

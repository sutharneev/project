const grid=document.getElementById("moodGrid");
const saveBtn=document.getElementById("saveBtn");
const noteInput=document.getElementById("noteInput");
const quoteEl=document.getElementById("quote");
const musicEl=document.getElementById("music");
const historyEl=document.getElementById("history");
let selectedMood=null;
let historyDisplayLimit = 10;
const quotes={
  happy:[
    "Let your smile change the world.",
    "Joy is a net of love by which you can catch souls.",
    "The more grateful you are, the more beauty you see."
  ],
  calm:[
    "Breathe. You are exactly where you need to be.",
    "Within you there is a stillness and a sanctuary.",
    "Peace begins with a pause."
  ],
  tired:[
    "Rest is productive.",
    "Close your eyes for a minute, breathe.",
    "A gentle pause can renew your strength."
  ],
  sad:[
    "No feeling is final.",
    "You are not alone.",
    "Be gentle with yourself today."
  ],
  angry:[
    "Pause, feel, choose your next step.",
    "Let the storm pass before you sail.",
    "You can respond, not react."
  ],
  love:[
    "Love begins with you.",
    "Your heart is a powerful guide.",
    "Share kindness, it always returns."
  ]
};
const music = {
  happy:   { t: "😊 Anxiety Relief & Positive Energy",u:"https://open.spotify.com/track/7MXVkk9YMctZqd1Srtv4MB?si=4df90c0fc092433b" },
  neutral: { t: "😐 Mindfulness & Balance",u: "https://open.spotify.com/track/7AzlLxHn24DxjgQX73F9fU?si=7a2940eadd0e43cf" },
  calm:    { t: "😌 Deep Meditation & Inner Peace",u:"https://open.spotify.com/track/5p4OjRDaSEDL9lNsSD67R9?si=b755f37eccf5414b" },
  tired:   { t: "😴 Sleep Therapy & Healing",u:"https://open.spotify.com/track/5w9c2J52mkdntKOmRLeM2m?si=1ef0d3c22b8c4c0f" },
  sad:     { t: "😢 Depression Support & Healing",u:"https://open.spotify.com/track/0JGTfiC4Z41GEEpMYLbWwO?si=8b6dd8c0f2cf4f63" },
  angry:   { t: "😠 Release Tension & Stress Relief",u:"https://open.spotify.com/track/06Muk6IyarouV5CXeQ2yBN?si=1a68682fe72e47ab" },
  love:    { t: "❤️ Self-Love & Compassion", u:"https://open.spotify.com/track/7gymMiUpp1AOYR5EiRDDrO?si=b5eebf71db6b41fe" }
};


// Mood labels for tooltips
const moodLabels = {
  angry: "Frustrated",
  sad: "Down",
  tired: "Exhausted",
  neutral: "Okay",
  calm: "Peaceful",
  happy: "Joyful",
  love: "Loved"
};
// Tooltip functionality
function createTooltip(button, text) {
  const tooltip = document.createElement('span');
  tooltip.className = 'mood-tooltip';
  tooltip.textContent = text;
  tooltip.setAttribute('role', 'tooltip');
  button.appendChild(tooltip);
  
  // Add screen reader support
  button.setAttribute('aria-describedby', `tooltip-${button.dataset.mood}`);
  tooltip.id = `tooltip-${button.dataset.mood}`;
  
  // Position tooltip to prevent going off-screen
  function positionTooltip() {
    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    if (rect.right > viewportWidth - 10) {
      tooltip.style.left = 'auto';
      tooltip.style.right = '0';
      tooltip.style.transform = 'none';
    }
    
    if (rect.left < 10) {
      tooltip.style.left = '0';
      tooltip.style.right = 'auto';
      tooltip.style.transform = 'none';
    }
  }
  
  // Position on hover
  button.addEventListener('mouseenter', positionTooltip);
  button.addEventListener('focus', positionTooltip);
}

function initializeTooltips() {
  const moodButtons = document.querySelectorAll('.mood');
  moodButtons.forEach(button => {
    const mood = button.dataset.mood;
    const label = moodLabels[mood];
    if (label) {
      createTooltip(button, label);
    }
  });
  
  // Add touch device support
  let touchTimeout;
  moodButtons.forEach(button => {
    button.addEventListener('touchstart', function() {
      clearTimeout(touchTimeout);
      // Show tooltip immediately on touch
      const tooltip = this.querySelector('.mood-tooltip');
      if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
      }
      // Hide after 2 seconds
      touchTimeout = setTimeout(() => {
        const tooltip = this.querySelector('.mood-tooltip');
        if (tooltip) {
          tooltip.style.opacity = '';
          tooltip.style.visibility = '';
        }
      }, 2000);
    });
  });
}
function getYouTubeEmbedUrl(url) {
  // Convert YouTube watch URL to embed URL
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } else if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
  return null;
}

function renderMusicLink(mood) {
  const entry = music[mood];
  if (!entry || !entry.u || !entry.t) {
    console.warn("No music entry for mood:", mood);
    return "";
  }
  
  const embedUrl = getYouTubeEmbedUrl(entry.u);
  if (embedUrl) {
    return `
      <div class="video-container">
        <iframe 
          src="${embedUrl}" 
          title="${entry.t}"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
      <div class="video-title">${entry.t}</div>
    `;
  }
  
  // Fallback to link if embed URL cannot be created
  return `<a href="${entry.u}" target="_blank" rel="noopener noreferrer">${entry.t}</a>`;
}
const aliases={


};
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function load(){try{return JSON.parse(localStorage.getItem("mh_entries")||"[]")}catch(e){return []}}
function save(entries){localStorage.setItem("mh_entries",JSON.stringify(entries))}
function moodFromText(text){const t=(text||"").toLowerCase();
  const kw={
    happy:["happy","good","great","grateful","joy","smile"],
    calm:["calm","peace","relaxed","okay","fine","neutral"],
    sad:["sad","down","low","tired","lonely","blue"],
    angry:["angry","mad","frustrated","annoyed","irritated"],
    love:["love","heart","affection","care","kindness"]
  };
  for(const k of Object.keys(kw)){if(kw[k].some(w=>t.includes(w)))return k}
  return null
}
function normalizeMood(m){return aliases[m]||m}
function showLoadingState() {
  quoteEl.textContent = "Loading supportive content...";
  musicEl.innerHTML = '<div class="loading">Loading video...</div>';
}

function showErrorState() {
  quoteEl.textContent = "We're here to support you. Please try again.";
  musicEl.innerHTML = '<div class="error">Unable to load video. Please check your connection.</div>';
}

function renderSuggestions(mood){if(!mood){quoteEl.textContent="Select a mood or add a note.";musicEl.innerHTML="";return}
  const key=normalizeMood(mood);
  
  // Show loading state
  showLoadingState();
  
  try {
    // Check if quotes[key] exists and has length
    if (quotes[key] && quotes[key].length > 0) {
      quoteEl.textContent = pick(quotes[key]);
    } else {
      quoteEl.textContent = "Take a moment to reflect on your feelings.";
    }
    
    const item = music[key];
    musicEl.innerHTML = item ? renderMusicLink(key) : "";
  } catch (error) {
    console.error("Error rendering suggestions:", error);
    showErrorState();
  }
}
function renderHistory() {
  const allEntries = load().slice().reverse();
  const entries = allEntries.slice(0, historyDisplayLimit);
  
  historyEl.innerHTML = entries.map(e => {
    const emoji = {
      happy: "😊", neutral: "😐", calm: "😌", tired: "😴",
      sad: "😢", angry: "😠", love: "❤️"
    }[e.mood] || "📝";
    const note = e.note ? `<div>${e.note.replace(/</g, "&lt;")}</div>` : "";
    const when = new Date(e.ts).toLocaleString();
    return `<li><span class="pill" data-mood="${e.mood}">${emoji}<span>${e.mood}</span></span><div><div class="meta">${when}</div>${note}</div></li>`
  }).join("")
  
  // Add load more button if there are more entries
  if (allEntries.length > historyDisplayLimit) {
    const loadMoreBtn = document.createElement('li');
    loadMoreBtn.innerHTML = `
      <div style="text-align: center; padding: 12px;">
        <button onclick="loadMoreHistory()" class="load-more-btn" style="
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid var(--calm-blue);
          color: var(--calm-blue);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        ">Load More Entries</button>
      </div>
    `;
    historyEl.appendChild(loadMoreBtn);
  }
}

function loadMoreHistory() {
  historyDisplayLimit += 10;
  renderHistory();
}
grid.addEventListener("click",e=>{
  const b=e.target.closest(".mood");
  if(!b)return;
  selectedMood=b.getAttribute("data-mood");
  Array.from(grid.children).forEach(x=>x.classList.toggle("active",x===b));
  renderSuggestions(selectedMood)
});
saveBtn.addEventListener("click",()=>{
  const text=noteInput.value.trim();
  const inferred=moodFromText(text);
  const mood=selectedMood||inferred;
  if(!mood&&text.length===0){alert("Select a mood or write a note.");return}
  const entries=load();
  entries.push({mood:mood||"note",note:text,ts:Date.now()});
  save(entries);
  noteInput.value="";
  selectedMood=null;
  Array.from(grid.children).forEach(x=>x.classList.remove("active"));
  renderHistory();
  renderSuggestions(mood)
});
renderHistory();
renderSuggestions(null);

// Initialize tooltips when page loads
document.addEventListener('DOMContentLoaded', initializeTooltips);
// Also initialize immediately in case DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTooltips);
} else {
  initializeTooltips();
}

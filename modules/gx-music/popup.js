// GX Music sidebar module logic
document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('play');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const visualizer = document.getElementById('visualizer');
  const providerBtns = document.querySelectorAll('.provider button');
  const trackTitle = document.querySelector('.track-title');
  const trackArtist = document.querySelector('.track-artist');

  let currentProvider = 'youtube';
  let isPlaying = false;
  let visInterval = null;

  // Create visualizer bars
  for (let i = 0; i < 20; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = '4px';
    visualizer.appendChild(bar);
  }
  const bars = visualizer.querySelectorAll('.bar');

  providerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      providerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentProvider = btn.id;
      updateTrackInfo();
    });
  });

  function updateTrackInfo() {
    const tracks = {
      youtube: { title: 'Twilight Dragon - ZenFire', artist: 'Living Sin Audio' },
      spotify: { title: 'Double Koi Dreams', artist: 'Firedragon FM' },
      soundcloud: { title: 'Indigo Koi Flow', artist: 'ZenFire Beats' }
    };
    const track = tracks[currentProvider];
    trackTitle.textContent = isPlaying ? track.title : 'No track playing';
    trackArtist.textContent = isPlaying ? track.artist : 'Select a provider to start';
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸' : '▶';
    updateTrackInfo();
    if (isPlaying) {
      visInterval = setInterval(animateVisualizer, 120);
    } else {
      clearInterval(visInterval);
      bars.forEach(b => b.style.height = '4px');
    }
  }

  function animateVisualizer() {
    bars.forEach(bar => {
      const h = Math.floor(Math.random() * 36) + 4;
      bar.style.height = h + 'px';
    });
  }

  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', () => {
    trackTitle.textContent = 'Previous track';
    setTimeout(updateTrackInfo, 800);
  });
  nextBtn.addEventListener('click', () => {
    trackTitle.textContent = 'Next track';
    setTimeout(updateTrackInfo, 800);
  });
});

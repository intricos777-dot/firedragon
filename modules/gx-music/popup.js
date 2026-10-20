// Watermark: Living_Sin (intricos777-dot) + AI agents (Hermes, Lia, opencode) - collaborative work
// GX Music sidebar module logic
document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('play');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const shuffleBtn = document.getElementById('shuffle');
  const visualizer = document.getElementById('visualizer');
  const providerBtns = document.querySelectorAll('.provider button');
  const trackTitle = document.querySelector('.track-title');
  const trackArtist = document.querySelector('.track-artist');
  const shuffleStatus = document.getElementById('shuffle-status');
  const trackTitleInput = document.getElementById('track-title-input');
  const trackArtistInput = document.getElementById('track-artist-input');
  const addTrackBtn = document.getElementById('add-track');
  const trackList = document.getElementById('track-list');

  let currentProvider = 'youtube';
  let isPlaying = false;
  let visInterval = null;
  let shuffleEnabled = false;

  const providerTracks = {
    youtube: [
      { title: 'Twilight Dragon - ZenFire', artist: 'Living Sin Audio' },
      { title: 'Dark Souls: First Step', artist: 'FROMSOFTWARE' },
      { title: 'Soul of Cinder', artist: 'FROMSOFTWARE' }
    ],
    spotify: [
      { title: 'Double Koi Dreams', artist: 'Firedragon FM' },
      { title: 'Lofi Gaming Beats', artist: 'ChillStream' },
      { title: 'Night Drive', artist: 'Synthwave Co.' }
    ],
    soundcloud: [
      { title: 'Indigo Koi Flow', artist: 'ZenFire Beats' },
      { title: 'Dark Ambient Mix', artist: 'Gamer Audio' },
      { title: 'Retro Game Soundtrack', artist: '8-Bit Hero' }
    ]
  };

  let currentProviderPlaylist = [...(providerTracks[currentProvider] || [])];
  let currentTrackIndex = 0;

  function getCurrentPlaylist() {
    return providerTracks[currentProvider] || [];
  }

  function getActiveTracks() {
    return shuffleEnabled ? currentProviderPlaylist : getCurrentPlaylist();
  }

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function updateShuffleStatus() {
    if (shuffleStatus) {
      shuffleStatus.textContent = shuffleEnabled ? '🔀 Shuffle ON' : '↕ Sequential';
      shuffleStatus.style.color = shuffleEnabled ? '#ff7b5c' : '#9d7aff';
    }
    shuffleBtn.classList.toggle('active', shuffleEnabled);
  }

  function getCurrentTrack() {
    const playlist = getActiveTracks();
    if (playlist.length === 0) return null;
    const idx = currentTrackIndex % playlist.length;
    return playlist[idx];
  }

  function updateTrackInfo() {
    const track = getCurrentTrack();
    if (track) {
      trackTitle.textContent = isPlaying ? track.title : 'No track playing';
      trackArtist.textContent = isPlaying ? track.artist : 'Select a provider to start';
    } else {
      trackTitle.textContent = 'No tracks available';
      trackArtist.textContent = 'Add tracks to the library';
    }
    updateShuffleStatus();
  }

  function renderTrackList() {
    const tracks = getActiveTracks();
    trackList.innerHTML = '';
    tracks.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = 'track-item';
      const titleSpan = document.createElement('span');
      titleSpan.className = 'track-item-title';
      titleSpan.textContent = `${index + 1}. ${track.title}`;
      const artistSpan = document.createElement('span');
      artistSpan.className = 'track-item-artist';
      artistSpan.textContent = track.artist;
      const removeBtn = document.createElement('button');
      removeBtn.className = 'track-item-remove';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => {
        removeTrack(index);
      });
      item.appendChild(titleSpan);
      item.appendChild(artistSpan);
      item.appendChild(removeBtn);
      trackList.appendChild(item);
    });
  }

  function removeTrack(index) {
    if (shuffleEnabled) {
      const removed = currentProviderPlaylist.splice(index, 1)[0];
      if (currentTrackIndex >= currentProviderPlaylist.length) {
        currentTrackIndex = 0;
      }
    } else {
      const removed = providerTracks[currentProvider].splice(index, 1)[0];
      if (currentTrackIndex >= providerTracks[currentProvider].length) {
        currentTrackIndex = 0;
      }
    }
    renderTrackList();
    updateTrackInfo();
  }

  function addTrack() {
    const title = trackTitleInput.value.trim();
    const artist = trackArtistInput.value.trim() || 'Unknown Artist';
    if (!title) {
      trackTitleInput.style.borderColor = '#ff7b5c';
      setTimeout(() => { trackTitleInput.style.borderColor = '#4a3a8a'; }, 1000);
      return;
    }
    providerTracks[currentProvider].push({ title, artist });
    if (shuffleEnabled) {
      currentProviderPlaylist = shuffleArray(getCurrentPlaylist());
      currentTrackIndex = 0;
    }
    trackTitleInput.value = '';
    trackArtistInput.value = '';
    renderTrackList();
    updateTrackInfo();
    trackTitle.textContent = 'Track added';
    setTimeout(updateTrackInfo, 800);
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

  function toggleShuffle() {
    shuffleEnabled = !shuffleEnabled;
    if (shuffleEnabled) {
      currentProviderPlaylist = shuffleArray(getCurrentPlaylist());
      currentTrackIndex = 0;
    } else {
      currentTrackIndex = 0;
    }
    renderTrackList();
    updateTrackInfo();
    if (shuffleEnabled) {
      trackTitle.textContent = 'Shuffle enabled';
      setTimeout(updateTrackInfo, 800);
    }
  }

  function playNext() {
    const playlist = getActiveTracks();
    if (playlist.length > 0) {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      if (shuffleEnabled && currentTrackIndex === 0) {
        currentProviderPlaylist = shuffleArray(getCurrentPlaylist());
        renderTrackList();
      }
    }
    updateTrackInfo();
    renderTrackList();
  }

  function playPrev() {
    const playlist = getActiveTracks();
    if (playlist.length > 0) {
      currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    }
    updateTrackInfo();
    renderTrackList();
  }

  function animateVisualizer() {
    bars.forEach(bar => {
      const h = Math.floor(Math.random() * 36) + 4;
      bar.style.height = h + 'px';
    });
  }

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
      currentProviderPlaylist = [...getCurrentPlaylist()];
      currentTrackIndex = 0;
      renderTrackList();
      updateTrackInfo();
    });
  });

  shuffleBtn.addEventListener('click', toggleShuffle);
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', playPrev);
  nextBtn.addEventListener('click', playNext);
  addTrackBtn.addEventListener('click', addTrack);
  trackTitleInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTrack();
  });
  trackArtistInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTrack();
  });

  renderTrackList();
  updateShuffleStatus();
});

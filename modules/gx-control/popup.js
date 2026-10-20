// Watermark: Living_Sin (intricos777-dot) + AI agents (Hermes, Lia, opencode) - collaborative work
// GX Control popup logic
document.addEventListener('DOMContentLoaded', () => {
  const ramText = document.getElementById('ram-text');
  const cpuText = document.getElementById('cpu-text');
  const ramBar = document.getElementById('ram-bar');
  const cpuBar = document.getElementById('cpu-bar');
  const boostBtn = document.getElementById('boost');
  const toggles = document.querySelectorAll('.toggle');

  let currentRAM = 0;
  let currentCPU = 0;

  function updateStats() {
    const freeRAM = Math.max(0, 1400 - currentRAM);
    const totalRAM = 1400;
    const ramPercent = Math.min(100, Math.max(0, (currentRAM / totalRAM) * 100));

    const cpuPercent = Math.min(100, Math.max(0, currentCPU));

    ramText.textContent = Math.round(currentRAM) + ' / ' + totalRAM + ' MB';
    cpuText.textContent = Math.round(currentCPU) + '%';
    ramBar.style.width = ramPercent + '%';
    cpuBar.style.width = cpuPercent + '%';

    if (ramPercent > 80) {
      ramBar.style.background = 'linear-gradient(to right, #ff3333, #ff7b5c)';
    } else if (ramPercent > 60) {
      ramBar.style.background = 'linear-gradient(to right, #ff7b5c, #ffc48c)';
    } else {
      ramBar.style.background = 'linear-gradient(to right, #2b1d5e, #9d7aff)';
    }
  }

  function animateStats() {
    currentRAM = Math.max(200, Math.min(1400, currentRAM + (Math.random() - 0.5) * 200));
    currentCPU = Math.max(5, Math.min(100, currentCPU + (Math.random() - 0.5) * 30));
    updateStats();
  }

  // Initialize
  currentRAM = 450 + Math.random() * 300;
  currentCPU = 15 + Math.random() * 25;
  updateStats();

  const interval = setInterval(animateStats, 2000);

  boostBtn.addEventListener('click', () => {
    currentRAM = Math.max(200, currentRAM * 0.6);
    currentCPU = Math.max(5, currentCPU * 0.5);
    updateStats();
    boostBtn.textContent = '✓ Boosted!';
    setTimeout(() => {
      boostBtn.textContent = '🚀 Boost Now';
    }, 1500);
  });

  toggles.forEach(toggle => {
    const key = toggle.dataset.key;
    const saved = localStorage.getItem('gx-control-' + key);
    if (saved !== null) {
      toggle.classList.toggle('on', saved === 'true');
    }
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
      localStorage.setItem('gx-control-' + key, toggle.classList.contains('on'));
    });
  });

  // Cleanup on unload
  window.addEventListener('unload', () => clearInterval(interval));
});

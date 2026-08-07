// GX Theater popup logic
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.toggle');
  const defaults = { cinema_mode: true, pop_out: true, subtitle_enhance: false };

  toggles.forEach(toggle => {
    const key = toggle.dataset.key;
    const saved = localStorage.getItem('gx-theater-' + key);
    if (saved !== null) {
      toggle.classList.toggle('on', saved === 'true');
    } else if (defaults[key]) {
      toggle.classList.add('on');
    }

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
      const val = toggle.classList.contains('on');
      localStorage.setItem('gx-theater-' + key, val);
      // Send message to background/content script
      if (typeof browser !== 'undefined' && browser.runtime) {
        browser.runtime.sendMessage({ module: 'gx-theater', key, value: val }).catch(() => {});
      }
    });
  });
});

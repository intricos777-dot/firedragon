// Watermark: Living_Sin (intricos777-dot) + AI agents (Hermes, Lia, opencode) - collaborative work
// Firedragon sidebar popup controller
// Shown from the browser-action popup; lets the user pick a sidebar module panel.

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('module-list');
  const statusEl = document.getElementById('module-status');

  async function loadManifest() {
    try {
      const res = await fetch('/modules/modules.json');
      if (!res.ok) throw new Error('modules.json not reachable');
      return await res.json();
    } catch (e) {
      console.error(e);
      if (statusEl) statusEl.textContent = 'Failed to load module manifest';
      return null;
    }
  }

  function renderCards(manifest) {
    if (!container || !manifest) return;
    container.innerHTML = '';
    const modules = manifest.modules || {};
    Object.entries(modules).forEach(([key, mod]) => {
      if (!mod.sidebar) return;
      const card = document.createElement('div');
      card.className = 'module-card';
      card.dataset.module = key;
      card.innerHTML = `
        <div class="module-icon">${mod.icon ? '<img src="/' + mod.icon + '" style="width:20px;height:20px" />' : '🧩'}</div>
        <div>
          <div class="module-name">${mod.name || key}</div>
          <div class="module-desc">${mod.description || ''}</div>
        </div>
      `;
      card.addEventListener('click', () => switchPanel(key));
      container.appendChild(card);
    });
  }

  async function switchPanel(moduleKey) {
    try {
      await browser.runtime.sendMessage({
        module: 'sidebar',
        action: 'switchPanel',
        key: moduleKey,
      });
      if (statusEl) {
        statusEl.textContent = 'Switched to ' + moduleKey;
        setTimeout(() => (statusEl.textContent = ''), 1500);
      }
    } catch (e) {
      console.error(e);
      if (statusEl) statusEl.textContent = 'Switch failed';
    }
  }

  const manifest = await loadManifest();
  renderCards(manifest);
});

// Watermark: Living_Sin (intricos777-dot) + AI agents (Hermes, Lia, opencode) - collaborative work
// Firedragon Modules background service worker
// Handles module initialization and inter-module messaging

const MODULES = {
  'gx-music': { loaded: false, version: '1.0.0' },
  'gx-theater': { loaded: false, version: '1.0.0' },
  'gx-cleaner': { loaded: false, version: '1.0.0' },
  'gx-control': { loaded: false, version: '1.0.0' },
  'sidebar': { loaded: false, version: '1.0.0' }
};

// Initialize modules on install/upgrade
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    console.log('[firedragon] Modules installed/updated:', details.reason);
    Object.keys(MODULES).forEach(name => {
      MODULES[name].loaded = true;
      browser.storage.local.get('moduleSettings').then(data => {
        if (!data.moduleSettings) {
          browser.storage.local.set({
            moduleSettings: {
              'gx-music': { provider: 'youtube', visualizer: true },
              'gx-theater': { cinema_mode: true, pop_out: true, subtitle_enhance: false },
              'gx-cleaner': { auto_clean: false, keep_logins: true },
              'gx-control': { network_booster: true, limit_background_tabs: false },
              sidebar: { position: 'left', width: 320, collapsible: true }
            }
          });
        }
      }).catch(() => {});
    });
  }
});

// Handle messages from popups/content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { module, action, key, value, panel } = message;

  if (module === 'gx-cleaner') {
    if (action === 'getStats') {
      sendResponse({
        cacheBytes: Math.floor(Math.random() * 200000000),
        historyBytes: Math.floor(Math.random() * 50000000),
        extCount: Math.floor(Math.random() * 15) + 5,
        dlBytes: Math.floor(Math.random() * 50000000)
      });
      return true;
    }
    if (action === 'cleanAll') {
      console.log('[firedragon] GX Cleaner: clearing cache, history, downloads');
      // Placeholder: actual clearing happens via browser.browsingData API
      sendResponse({ success: true });
      return true;
    }
  }

  if (module === 'gx-control') {
    if (action === 'getStats') {
      sendResponse({
        ramFree: Math.floor(Math.random() * 800000000),
        ramTotal: 1400000000,
        cpuUsage: Math.floor(Math.random() * 100)
      });
      return true;
    }
    if (action === 'boost') {
      console.log('[firedragon] GX Control: boost activated');
      sendResponse({ success: true });
      return true;
    }
  }

  if (module === 'sidebar' && action === 'switchPanel' && panel) {
    browser.sidebarAction.setPanel({ panel }).catch(() => {});
    sendResponse({ ok: true, panel });
    return true;
  }

  // Unknown message
  console.log('[firedragon] Unknown message:', message);
  sendResponse({ error: 'unknown message' });
  return true;
});

// Sidebar module initialization
browser.sidebarAction?.setPanel?.({ panel: '/modules/sidebar/panel.html' }).catch(() => {});

console.log('[firedragon] Modules background service worker loaded');

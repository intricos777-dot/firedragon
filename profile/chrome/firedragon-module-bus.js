/* Firedragon module bus bridge */
(function() {
  'use strict';

  const MODULE_KEY = '__firedragon_modules__';
  const DEFAULT_MODULES = ['gx-music','gx-theater','gx-cleaner','gx-control','sidebar'];

  function getState() {
    try {
      const raw = localStorage.getItem(MODULE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { enabled: {}, settings: {} };
  }

  function setState(state) {
    localStorage.setItem(MODULE_KEY, JSON.stringify(state));
  }

  function init() {
    const state = getState();
    DEFAULT_MODULES.forEach((m) => {
      if (!Object.prototype.hasOwnProperty.call(state.enabled, m)) {
        state.enabled[m] = true;
      }
    });
    setState(state);
    document.documentElement.dataset.firedragonModules = Object.keys(state.enabled).filter(m => state.enabled[m]).join(',');
  }

  function bus() {
    const handlers = new Map();
    return {
      on(module, event, fn) {
        const key = module + ':' + event;
        if (!handlers.has(key)) handlers.set(key, []);
        handlers.get(key).push(fn);
      },
      emit(module, event, payload) {
        const key = module + ':' + event;
        (handlers.get(key) || []).forEach(fn => {
          try { fn(payload); } catch {}
        });
      }
    };
  }

  if (typeof window !== 'undefined') {
    window.__firedragon = window.__firedragon || {};
    window.__firedragon.state = getState;
    window.__firedragon.setState = setState;
    window.__firedragon.bus = bus;
    init();
  }
})();

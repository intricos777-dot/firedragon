// Firedragon Browser - Mozilla-based with Opera GX-style modules
// Profile: user.js overrides for privacy, performance, and module support

// === Identity ===
user_pref("browser.startup.homepage", "https://intricos777.github.io/firedragon-start");
user_pref("browser.startup.page", 1);
user_pref("browser.newtabpage.enabled", true);

// === Sidebar + Modules ===
user_pref("sidebar.revamp", true);
user_pref("sidebar.main.tools", "addons|history|bookmarks|downloads|extensions");
user_pref("sidebar.verticalTabs", true);

// === Privacy / Grey-hat friendly ===
user_pref("privacy.resistFingerprinting", true);
user_pref("privacy.trackingprotection.enabled", true);
user_pref("network.cookie.cookieBehavior", 1);
user_pref("beacon.enabled", false);
user_pref("network.telemetry.enabled", false);
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("browser.discovery.enabled", false);

// === Performance ===
user_pref("gfx.webrender.all", true);
user_pref("layers.acceleration.force-enabled", true);
user_pref("browser.tabs.unloadOnLowMemory", true);
user_pref("browser.sessionstore.interval", 15000);

// === Extension compatibility ===
user_pref("extensions.autoDisableScopes", 0);
user_pref("extensions.enabledScopes", 15);
user_pref("extensions.installDistroAddons", false);

// === Module APIs ===
user_pref("firedragon.modules.enabled", true);
user_pref("firedragon.sidebar.position", "left");
user_pref("firedragon.music.enabled", true);
user_pref("firedragon.themes.enabled", true);

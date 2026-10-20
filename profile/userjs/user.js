// Watermark: Living_Sin (intricos777-dot) + AI agents (Hermes, Lia, opencode) - collaborative work
// Firedragon Browser - Mozilla-based with Opera GX-style modules
// Profile: user.js overrides for privacy, performance, and module support

// === Identity ===
user_pref("browser.startup.homepage", "https://intricos777.github.io/firedragon-start");
user_pref("browser.startup.page", 1);
user_pref("browser.newtabpage.enabled", true);

// === Module APIs ===
user_pref("firedragon.modules.enabled", true);
user_pref("firedragon.sidebar.position", "left");
user_pref("firedragon.music.enabled", true);
user_pref("firedragon.themes.enabled", true);

// === Chrome customizations ===
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
user_pref("sidebar.revamp", true);
user_pref("sidebar.main.tools", "addons|history|bookmarks|downloads|extensions");
user_pref("sidebar.verticalTabs", true);

// === Firedragon scripts ===
user_pref("firedragon.profile.chrome", true);
user_pref("firedragon.scripts.sidebar", true);
user_pref("firedragon.scripts.moduleBus", true);
user_pref("firedragon.sidebar.pinned", "gx-music,gx-theater,gx-control,gx-cleaner");

// === Grey-hat friendly defaults ===
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
user_pref("extensions.enabledAddonTypes", "extension,theme,locale,experiment");
user_pref("extensions.installDistroAddons", true);
user_pref("extensions.systemAddonUpdate.url", "");
user_pref("extensions.systemAddon.update.enabled", false);
user_pref("extensions.update.enabled", true);
user_pref("extensions.update.autoUpdateDefault", true);
user_pref("extensions.logging.enabled", true);
user_pref("extensions.getAddons.cache.enabled", true);
user_pref("extensions.getAddons.showPane", true);
user_pref("extensions.blocklist.enabled", false);
user_pref("xpinstall.signatures.required", false);
user_pref("xpinstall.whitelist.required", false);
user_pref("xpinstall.signatures.dev-root", true);
user_pref("browser.cache.disk.enable", false);
user_pref("browser.cache.memory.enable", false);

// === UA / site compat for Opera-targeted assets/extensions ===
user_pref("general.useragent.override", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36");
user_pref("network.http.useragent.override", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36");
user_pref("network.http.accept.default", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");

// === Media/DRM/Gaming ===
user_pref("media.gmp-manager.url", "https://version.gmp.mozilla.org/1.0/");
user_pref("media.gmp-provider.enabled", true);
user_pref("media.gmp-gmpopenh264.enabled", true);
user_pref("media.gmp-widevinecdm.enabled", true);
user_pref("browser.eme.ui.enabled", true);
user_pref("media.eme.enabled", true);
user_pref("media.mediasession.enabled", true);
user_pref("media.getusermedia.screensharing.enabled", true);
user_pref("media.autoplay.default", 0);
user_pref("media.autoplay.blocking_policy", 0);
user_pref("media.hardware-video-decoding.enabled", true);
user_pref("media.ffmpeg.vaapi.enabled", true);
user_pref("gfx.webrender.compositor", true);
user_pref("dom.gamepad.enabled", true);
user_pref("dom.gamepad.non-standard-joysticks.enabled", true);

// === Networking / privacy-tuned for gaming/CDN caches ===
user_pref("network.http.connection-timeout", 45);
user_pref("network.http.response.timeout", 90);
user_pref("network.proxy.socks_remote_dns", true);
user_pref("network.dns.disablePrefetch", true);
user_pref("network.dns.disablePrefetchFromHTTPS", true);
user_pref("network.predictor.enabled", false);
user_pref("network.prefetch-next", true);
user_pref("network.http.speculative-parallel-limit", 0);
user_pref("browser.safebrowsing.blockedURIs.enabled", false);
user_pref("browser.safebrowsing.downloads.enabled", false);
user_pref("browser.safebrowsing.malware.enabled", false);
user_pref("browser.safebrowsing.phishing.enabled", false);

// === Perf / memory ===
user_pref("browser.tabs.unloadOnLowMemory", true);
user_pref("browser.tabs.lowUsageThresholdIdleProfiles", 8);
user_pref("browser.tabs.maxOpenTabs", 512);
user_pref("browser.sessionstore.interval", 10000);
user_pref("browser.sessionstore.max_tabs_undo", 16);
user_pref("browser.sessionstore.max_windows_undo", 3);
user_pref("browser.cache.disk.capacity", 10240);
user_pref("browser.cache.memory.capacity", 65536);
user_pref("browser.privatebrowsing.vpnpromourl", "");
user_pref("browser.privatebrowsing.promocap", 0);
user_pref("browser.rights.override", true);
user_pref("browser.warnOnQuitShortcut", false);
user_pref("browser.quitShortcut.disabled", true);
user_pref("browser.fullscreen.autohide", false);
user_pref("browser.tabs.drawInTitlebar", true);
user_pref("browser.display.use_document_fonts", 0);

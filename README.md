# Firedragon Browser
Mozilla Firefox-based browser with Opera GX-style modules, music integration, and Pinterest theme support.

## Features
- **GX Music**: Spotify/YouTube Music sidebar player with visualizer
- **GX Theater**: Cinema mode, pop-out player, subtitle enhancement
- **GX Cleaner**: Cache, history, extension, and data cleanup
- **GX Control**: RAM/CPU monitor, network booster, background tab limiter
- **Sidebar**: Custom module panel with collapsible layout
- **Pinterest Themes**: Generate browser themes from Pinterest board colors

## Quick Start
```bash
cd /home/sin/Projects/firedragon
./launcher/firedragon
```

## Extension Compatibility
Install Chrome/Edge extensions:
```bash
python3 ext-compat/installer/convert.py extension.crx --install
```

## Pinterest Theme Integration
```bash
python3 ext-compat/installer/pinterest-theme.py "https://pinterest.com/username/board/"
```

## Profile
Custom Firefox profile with privacy, performance, and module prefs in `profile/userjs/user.js`.

## Author
Living Sin — intricos777

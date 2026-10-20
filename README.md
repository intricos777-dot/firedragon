<!-- Watermark: Living_Sin (intricos777-dot) + AI agents (Hermes, Lia, opencode) - collaborative work -->
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

## Control Panel
```bash
cd /home/sin/Projects/firedragon
./control-panel/serve.sh
# open http://127.0.0.1:43127
```

## Extension Compatibility
Install Chrome/Edge extensions:
```bash
python3 ext-compat/installer/convert.py extension.crx --install
```

## Pinterest Theme Integration
```bash
# generate theme from board
python3 ext-compat/installer/pinterest-theme.py "https://pinterest.com/username/board/"

# list generated themes
python3 ext-compat/installer/pinterest-theme.py --list

# apply theme to active Firedragon profile
python3 ext-compat/installer/apply-theme.py <theme_id>
```

## Profile
Custom Firefox profile with privacy, performance, and module prefs in `profile/userjs/user.js`.

## Author
Living Sin — intricos777

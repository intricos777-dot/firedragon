#!/usr/bin/env python3
"""
Pinterest Theme Integration for Firedragon Browser
Downloads Pinterest board images and applies them as browser themes.
Supports: CSS theme generation, image downloading, theme preview.
"""

import json
import os
import re
import sys
import urllib.request
import urllib.parse
from pathlib import Path
from html import escape

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
THEME_DIR = PROJECT_ROOT / "assets" / "themes"
PROFILE_DIR = PROJECT_ROOT / "profile"
THEME_DIR.mkdir(parents=True, exist_ok=True)


def extract_board_id(url: str) -> str:
    """Extract board ID or username/board from Pinterest URL."""
    # https://www.pinterest.com/username/boardname/
    match = re.search(r'pinterest\.com/([^/]+)/([^/]+)/?$', url)
    if match:
        return f"{match.group(1)}_{match.group(2)}"
    # Fallback: use last path component
    path = urllib.parse.urlparse(url).path.strip('/')
    return path.replace('/', '_') or 'default'


def generate_firefox_css_theme(board_name: str, primary_color: str, accent_color: str) -> str:
    """Generate a Firefox userChrome.css theme from Pinterest board colors."""
    return f"""/* Firedragon Theme: {escape(board_name)} */
:root {{
  --firedragon-primary: {primary_color};
  --firedragon-accent: {accent_color};
  --firedragon-bg: #1a0f3a;
  --firedragon-sidebar-bg: #0b0d17;
}}

/* Tab bar */
#tabbrowser-tabs {{
  background: var(--firedragon-bg) !important;
  border-color: var(--firedragon-primary) !important;
}}

/* Sidebar */
#sidebar-box {{
  background: var(--firedragon-sidebar-bg) !important;
  border-right: 2px solid var(--firedragon-accent) !important;
}}

/* URL bar */
#urlbar {{
  background: #2b1d5e !important;
  border-color: var(--firedragon-accent) !important;
  color: #ffd2a3 !important;
}}

#urlbar:focus {{
  outline: 2px solid var(--firedragon-accent) !important;
}}

/* Toolbar */
#nav-bar {{
  background: var(--firedragon-bg) !important;
  border-bottom: 1px solid var(--firedragon-primary) !important;
}}

/* Buttons */
toolbarbutton {{
  color: #ffd2a3 !important;
}}

toolbarbutton:hover {{
  background: var(--firedragon-primary) !important;
  color: #0b0d17 !important;
}}

/* Scrollbar */
scrollbar {{
  background: var(--firedragon-bg) !important;
}}

scrollbarbutton, scrollcorner {{
  background: var(--firedragon-accent) !important;
}}

/* Context menu */
menupopup, popup {{
  background: var(--firedragon-bg) !important;
  color: #ffd2a3 !important;
  border: 1px solid var(--firedragon-primary) !important;
}}

menuitem:hover, menu:hover {{
  background: var(--firedragon-accent) !important;
  color: #0b0d17 !important;
}}
"""


def generate_webextension_theme(board_name: str, colors: dict) -> dict:
    """Generate a WebExtension manifest for a browser theme."""
    colors_data = {
        "bookmark_text": colors.get("text", "#ffd2a3"),
        "frame": colors.get("frame", "#2b1d5e"),
        "popup": colors.get("popup", "#1a0f3a"),
        "popup_text": colors.get("popup_text", "#ffd2a3"),
        "sidebar": colors.get("sidebar", "#0b0d17"),
        "sidebar_text": colors.get("sidebar_text", "#b8a3ff"),
        "tab_background_text": colors.get("tab_text", "#ffe4cc"),
        "toolbar": colors.get("toolbar", "#1a0f3a"),
        "toolbar_text": colors.get("toolbar_text", "#ffd2a3"),
        "ntp_background": colors.get("ntp", "#0b0d17"),
        "ntp_text": colors.get("ntp_text", "#9d7aff"),
        "button_background_active": colors.get("accent", "#ff7b5c"),
        "icons": colors.get("icons", "#b8a3ff")
    }

    manifest = {
        "manifest_version": 2,
        "name": f"Firedragon Theme: {board_name}",
        "version": "1.0.0",
        "description": f"Pinterest board theme for Firedragon Browser",
        "author": "Living Sin",
        "theme": {
            "colors": colors_data,
            "images": {
                "theme_frame": "assets/icons/sidebar-48.png",
                "theme_toolbar": "assets/icons/firedragon-96.png"
            }
        },
        "browser_specific_settings": {
            "gecko": {"id": f"theme-{board_name.replace(' ', '_').lower()}@firedragon"}
        }
    }
    return manifest


def preview_theme(theme_dir: Path) -> str:
    """Generate HTML preview of the theme."""
    themes = sorted(theme_dir.glob("*/manifest.json"))
    if not themes:
        return "<p>No themes available yet. Add Pinterest board URLs to generate themes.</p>"

    html = ['<h2>Available Firedragon Themes</h2>']
    for theme_path in themes:
        try:
            manifest = json.loads(theme_path.read_text())
            name = manifest.get("name", theme_path.parent.name)
            desc = manifest.get("description", "No description")
            colors = manifest.get("theme", {}).get("colors", {})

            html.append(f'<div style="background:#2b1d5e;border:1px solid #4a3a8a;padding:12px;margin:8px 0;border-radius:4px;">')
            html.append(f'<strong style="color:#b8a3ff;">{escape(name)}</strong>')
            html.append(f'<p style="color:#9d7aff;font-size:12px;">{escape(desc)}</p>')
            html.append(f'<div style="display:flex;gap:4px;">')
            for key, val in list(colors.items())[:6]:
                html.append(f'<div style="width:24px;height:24px;background:{val};border:1px solid #fff;border-radius:3px;" title="{key}"></div>')
            html.append('</div></div>')
        except Exception:
            continue

    return '\n'.join(html)


def main():
    if len(sys.argv) < 2:
        print("Usage: pinterest-theme.py <pinterest-board-url> [--preview]")
        print("       pinterest-theme.py --list")
        sys.exit(1)

    if sys.argv[1] == '--list':
        print(preview_theme(THEME_DIR))
        return

    if sys.argv[1] == '--preview':
        print(preview_theme(THEME_DIR))
        return

    url = sys.argv[1]
    board_id = extract_board_id(url)
    board_name = board_id.replace('_', ' ').title()

    # Default twilight theme colors
    colors = {
        "frame": "#2b1d5e",
        "popup": "#1a0f3a",
        "sidebar": "#0b0d17",
        "toolbar": "#1a0f3a",
        "accent": "#ff7b5c",
        "text": "#ffd2a3",
        "ntp": "#0b0d17",
        "icons": "#b8a3ff"
    }

    # Generate userChrome.css theme
    css = generate_firefox_css_theme(board_name, colors["frame"], colors["accent"])
    theme_dir = THEME_DIR / board_id
    theme_dir.mkdir(parents=True, exist_ok=True)

    with open(theme_dir / "userChrome.css", "w") as f:
        f.write(css)

    # Generate WebExtension theme
    ext_manifest = generate_webextension_theme(board_name, colors)
    with open(theme_dir / "manifest.json", "w") as f:
        json.dump(ext_manifest, f, indent=2)

    print(f"[pinterest-theme] Generated theme: {board_name}")
    print(f"  userChrome.css: {theme_dir / 'userChrome.css'}")
    print(f"  WebExtension: {theme_dir / 'manifest.json'}")

    # Copy to profile chrome dir if exists
    chrome_dir = PROFILE_DIR / "chrome"
    chrome_dir.mkdir(parents=True, exist_ok=True)
    chrome_target = chrome_dir / f"theme-{board_id}.css"
    import shutil
    shutil.copy2(theme_dir / "userChrome.css", chrome_target)
    print(f"  Installed to profile: {chrome_target}")


if __name__ == "__main__":
    main()

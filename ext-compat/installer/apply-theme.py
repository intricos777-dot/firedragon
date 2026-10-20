#!/usr/bin/env python3
# Watermark: Living_Sin (intricos777-dot) + AI agents (Hermes, Lia, opencode) - collaborative work
"""
Firedragon Theme Applier
Applies generated themes into the active Firedragon Firefox profile.
Copies userChrome.css and installs WebExtension theme XPI if present.
"""

import json
import shutil
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
THEME_DIR = PROJECT_ROOT / "assets" / "themes"
PROFILE_DIR = PROJECT_ROOT / "profile"
FIREFOX_DIR = Path.home() / ".mozilla" / "firefox"

DEFAULT_INI = FIREFOX_DIR / "profiles.ini"


def find_profile_ini() -> Path | None:
    if DEFAULT_INI.exists():
        return DEFAULT_INI
    candidates = sorted(FIREFOX_DIR.glob("*.default*"))
    return candidates[0] if candidates else None


def load_profiles(ini: Path) -> dict[str, Path]:
    profiles: dict[str, Path] = {}
    current: dict[str, str] = {}
    for line in ini.read_text().splitlines():
        line = line.strip()
        if not line:
            if current.get("Name"):
                profiles[current["Name"]] = FIREFOX_DIR / current["Path"]
            current = {}
            continue
        if "=" in line:
            k, v = line.split("=", 1)
            current[k.strip()] = v.strip()
    if current.get("Name"):
        profiles[current["Name"]] = FIREFOX_DIR / current["Path"]
    return profiles


def resolve_profile_dir(name: str) -> Path:
    ini = find_profile_ini()
    if ini:
        profiles = load_profiles(ini)
        if name in profiles:
            return profiles[name]
    # Fallback: ensure project-local profile exists for non-Firefox setups
    profile_dir = PROFILE_DIR / name
    profile_dir.mkdir(parents=True, exist_ok=True)
    return profile_dir


def apply_theme(theme_id: str, profile_name: str = "firedragon") -> None:
    theme_root = THEME_DIR / theme_id
    if not theme_root.exists():
        raise FileNotFoundError(f"Theme not found: {theme_root}")

    profile_dir = resolve_profile_dir(profile_name)
    chrome_dir = profile_dir / "chrome"
    chrome_dir.mkdir(parents=True, exist_ok=True)
    extensions_dir = profile_dir / "extensions"
    extensions_dir.mkdir(parents=True, exist_ok=True)

    src_css = theme_root / "userChrome.css"
    if src_css.exists():
        shutil.copy2(src_css, chrome_dir / f"{theme_id}.css")

    src_manifest = theme_root / "manifest.json"
    if src_manifest.exists():
        manifest = json.loads(src_manifest.read_text())
        ext_id = manifest.get("browser_specific_settings", {}).get("gecko", {}).get("id")
        if not ext_id:
            raise ValueError("Theme manifest missing gecko id")
        dst_xpi = extensions_dir / f"{ext_id}.xpi"
        # If already unpacked as directory, Firefox accepts it directly
        dst_unpacked = extensions_dir / ext_id
        dst_unpacked.mkdir(parents=True, exist_ok=True)
        if src_manifest.exists():
            shutil.copy2(src_manifest, dst_unpacked / "manifest.json")
        for f in theme_root.iterdir():
            if f.is_file() and f.name != "manifest.json":
                shutil.copy2(f, dst_unpacked / f.name)
        print(f"[theme-applier] Installed theme files to: {dst_unpacked}")
    else:
        print(f"[theme-applier] No WebExtension manifest found for: {theme_id}")

    # Ensure user Chrome is enabled
    user_js = profile_dir / "user.js"
    if user_js.exists() and "toolkit.legacyUserProfileCustomizations.stylesheets" not in user_js.read_text():
        with open(user_js, "a") as f:
            f.write("\nuser_pref(\"toolkit.legacyUserProfileCustomizations.stylesheets\", true);\n")
    print(f"[theme-applier] Theme applied: {theme_id}")


def list_themes() -> None:
    if not THEME_DIR.exists():
        print("No themes directory.")
        return
    themes = sorted([p.name for p in THEME_DIR.iterdir() if p.is_dir()])
    print("\n".join(themes) or "No themes available.")


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: apply-theme.py <theme_id|--list>")
        sys.exit(1)
    if sys.argv[1] == "--list":
        list_themes()
        return
    profile = "firedragon"
    if "--profile" in sys.argv:
        idx = sys.argv.index("--profile")
        if idx + 1 < len(sys.argv):
            profile = sys.argv[idx + 1]
    apply_theme(sys.argv[1], profile)


if __name__ == "__main__":
    main()

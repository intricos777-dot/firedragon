#!/usr/bin/env python3
"""
Firedragon Extension Compatibility Layer
Converts Chrome CRX/Edge extensions to Firefox XPI format.
Supports: .crx, .zip, .xpi
"""

import sys
import os
import json
import zipfile
import shutil
import subprocess
from pathlib import Path
from urllib.request import urlopen, Request
from html import escape

EXT_DIR = Path(__file__).resolve().parent.parent.parent / "profile" / "extensions"
EXT_DIR.mkdir(parents=True, exist_ok=True)


def detect_format(path: Path) -> str:
    """Detect extension format: crx, zip, or xpi."""
    with open(path, "rb") as f:
        magic = f.read(4)
    if magic.startswith(b"Cr24"):
        return "crx"
    if magic.startswith(b"PK\x03\x04"):
        return "zip"
    return "unknown"


def extract_crx(path: Path, dest: Path) -> None:
    """Extract CRX format (header + zip payload)."""
    with open(path, "rb") as f:
        magic = f.read(4)
        if magic.startswith(b"Cr24"):
            version = int.from_bytes(f.read(4), "little")
            pub_len = int.from_bytes(f.read(4), "little")
            f.read(pub_len)
            priv_len = int.from_bytes(f.read(4), "little")
            f.read(priv_len)
            zip_data = f.read()
            with open(dest, "wb") as out:
                out.write(zip_data)
            return
    raise ValueError("Invalid CRX format")


def extract_zip(path: Path, dest: Path) -> None:
    """Extract ZIP/CRX payload to destination directory."""
    with zipfile.ZipFile(path, "r") as z:
        z.extractall(dest)


def patch_manifest(manifest: dict) -> dict:
    """Patch Chrome manifest for Firefox compatibility."""
    m = json.loads(json.dumps(manifest))  # deep copy

    # Firefox requires manifest_version 2
    if m.get("manifest_version") == 3:
        m["manifest_version"] = 2
        if "background" in m and isinstance(m["background"], dict):
            if "service_worker" in m["background"]:
                m["background"]["scripts"] = [m["background"]["service_worker"]]
                del m["background"]["service_worker"]

    # Remove Chrome-specific keys
    for key in [
        "update_url",
        "minimum_chrome_version",
        "storage",
        "system.memory",
        "system.cpu",
    ]:
        m.pop(key, None)

    # Ensure browser_specific_settings
    if "browser_specific_settings" not in m:
        m["browser_specific_settings"] = {}
    if "gecko" not in m["browser_specific_settings"]:
        m["browser_specific_settings"]["gecko"] = {"id": m.get("name", "extension") + "@firedragon"}

    return m


def convert_extension(src: Path, dest_dir: Path) -> Path:
    """Convert any supported extension to Firefox XPI."""
    src = src.resolve()
    if not src.exists():
        raise FileNotFoundError(f"Extension not found: {src}")

    fmt = detect_format(src)
    print(f"[ext-compat] Detected format: {fmt}")

    tmp = dest_dir / "_tmp_extract"
    if tmp.exists():
        shutil.rmtree(tmp)
    tmp.mkdir(parents=True)

    try:
        if fmt == "crx":
            zip_path = tmp / "payload.zip"
            extract_crx(src, zip_path)
            extract_zip(zip_path, tmp)
        elif fmt == "zip":
            extract_zip(src, tmp)
        else:
            raise ValueError(f"Unsupported format: {fmt}")

        # Find manifest
        manifest_path = tmp / "manifest.json"
        if not manifest_path.exists():
            for p in tmp.rglob("manifest.json"):
                manifest_path = p
                break

        if not manifest_path.exists():
            raise FileNotFoundError("No manifest.json found in extension")

        manifest = json.loads(manifest_path.read_text())
        name = manifest.get("name", "unknown").replace(" ", "_")
        version = manifest.get("version", "1.0.0")
        safe_name = "".join(c if c.isalnum() or c in "-_." else "_" for c in name)

        # Patch for Firefox compatibility
        patched = patch_manifest(manifest)
        manifest_path.write_text(json.dumps(patched, indent=2))

        # Build XPI
        xpi_name = f"{safe_name}-{version}.xpi"
        xpi_path = dest_dir / xpi_name
        with zipfile.ZipFile(xpi_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in tmp.rglob("*"):
                if f.is_file():
                    zf.write(f, f.relative_to(tmp))

        print(f"[ext-compat] Converted: {xpi_name}")
        return xpi_path
    finally:
        if tmp.exists():
            shutil.rmtree(tmp)


def install_extension(xpi: Path) -> None:
    """Install XPI into Firedragon profile extensions directory."""
    dest = EXT_DIR / xpi.name
    shutil.copy2(xpi, dest)
    print(f"[ext-compat] Installed to: {dest}")


def main():
    if len(sys.argv) < 2:
        print("Usage: convert.py <path/to/extension.crx|xpi|zip> [--install]")
        sys.exit(1)

    src = Path(sys.argv[1])
    install = "--install" in sys.argv

    try:
        xpi = convert_extension(src, EXT_DIR)
        if install:
            install_extension(xpi)
        print(f"[ext-compat] OK: {xpi}")
    except Exception as e:
        print(f"[ext-compat] FAIL: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

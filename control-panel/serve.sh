#!/usr/bin/env bash
# Firedragon control-panel launcher
# Simple local web UI for theme/module management

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PORT="${FIREDRAGON_CTRL_PORT:-43127}"
ENTRY="$PROJECT_ROOT/control-panel/index.html"

if [ ! -f "$ENTRY" ]; then
  echo "Error: $ENTRY not found" >&2
  exit 1
fi

if command -v python3 &>/dev/null; then
  echo "[*] Firedragon Control Panel: http://127.0.0.1:$PORT"
  exec python3 -m http.server "$PORT" --directory "$PROJECT_ROOT/control-panel"
else
  echo "Error: python3 not found for control-panel server" >&2
  exit 1
fi

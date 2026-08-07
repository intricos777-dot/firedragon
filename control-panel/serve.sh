#!/usr/bin/env bash
# Firedragon control-panel launcher
# Starts backend server and opens local web UI

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PORT="${FIREDRAGON_CTRL_PORT:-43127}"
SERVER="$PROJECT_ROOT/control-panel/server.py"

if [ ! -f "$SERVER" ]; then
  echo "Error: $SERVER not found" >&2
  exit 1
fi

if ! command -v python3 &>/dev/null; then
  echo "Error: python3 not found for control-panel server" >&2
  exit 1
fi

echo "[*] Firedragon Control Panel: http://127.0.0.1:$PORT"
exec python3 "$SERVER" "$PORT"

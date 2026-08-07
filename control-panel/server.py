#!/usr/bin/env python3
"""
Firedragon Control Panel Backend
Serves a small web UI and proxies selected project commands.
"""

from __future__ import annotations

import json
import subprocess
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
THEME_DIR = PROJECT_ROOT / "assets" / "themes"


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/health":
            self._send_json({"status": "ok", "project": str(PROJECT_ROOT)})
            return
        if self.path == "/api/themes":
            themes = []
            if THEME_DIR.exists():
                for p in sorted(THEME_DIR.iterdir()):
                    if p.is_dir():
                        themes.append(p.name)
            self._send_json({"themes": themes})
            return
        if self.path == "/" or self.path.startswith("/index.html"):
            html = (PROJECT_ROOT / "control-panel" / "index.html").read_text()
            self._send_html(html)
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/run":
            self.send_response(404)
            self.end_headers()
            return
        length = int(self.headers.get("content-length", 0))
        body = json.loads(self.rfile.read(length) or "{}")
        cmd = body.get("cmd")
        if not isinstance(cmd, list) or not cmd:
            self._send_json({"error": "cmd must be a non-empty list"}, status=400)
            return
        try:
            proc = subprocess.run(cmd, cwd=PROJECT_ROOT, capture_output=True, text=True, timeout=120)
            self._send_json({
                "ok": proc.returncode == 0,
                "rc": proc.returncode,
                "stdout": proc.stdout,
                "stderr": proc.stderr,
            })
        except Exception as e:
            self._send_json({"error": str(e)}, status=500)

    def _send_json(self, payload, status: int = 200):
        data = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _send_html(self, html: str, status: int = 200):
        body = html.encode()
        self.send_response(status)
        self.send_header("content-type", "text/html; charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):  # noqa: A002
        sys.stderr.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), format % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 43127
    server = HTTPServer(("127.0.0.1", port), Handler)
    print(f"[control-panel] serving http://127.0.0.1:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()


if __name__ == "__main__":
    main()

# Watermark: Living_Sin (intricos777-dot) + AI agents (Hermes, Lia, opencode) - collaborative work
# Copyright (c) 2026 Living Sin (intricos777-dot) + AI agents (Hermes, Lia, opencode) - collaborative work
# Licensed under Living Sin Proprietary License (LSPL-1.0)
# See LICENSE file for details.
import json, os, subprocess, sys, tempfile, time, unittest
from pathlib import Path

REPO = Path("/home/livings/Projects/firedragon")
PORT = 43130


class TestFiredragonPackaging(unittest.TestCase):
    @classmethod
    def _start_control_panel(cls):
        env = dict(os.environ)
        env["HOME"] = tempfile.mkdtemp(prefix="firedragon_test_")
        cls._server = subprocess.Popen(
            [sys.executable, str(REPO / "control-panel/server.py"), str(PORT)],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            env=env,
        )
        time.sleep(1.5)

    @classmethod
    def _stop(cls):
        try:
            cls._server.terminate()
            cls._server.wait(timeout=5)
        except Exception:
            pass

    @classmethod
    def setUpClass(cls):
        cls._start_control_panel()

    @classmethod
    def tearDownClass(cls):
        cls._stop()

    def test_module_manifest_modules(self):
        manifest = json.loads((REPO / "modules/modules.json").read_text())
        self.assertIn("modules", manifest)
        for key in ["gx-music", "gx-theater", "gx-cleaner", "gx-control", "sidebar"]:
            self.assertIn(key, manifest["modules"])

    def test_extension_manifest_present(self):
        manifest = json.loads((REPO / "profile/extensions/firedragon-modules@living.sin/manifest.json").read_text())
        self.assertEqual(manifest.get("manifest_version"), 2)
        self.assertIn("sidebar_action", manifest)

    def test_sidebar_popup_present(self):
        self.assertTrue((REPO / "modules/sidebar/popup.js").exists())

    def test_launcher_bash_syntax(self):
        proc = subprocess.run(["bash", "-n", str(REPO / "launcher/firedragon")], capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, proc.stderr)

    def test_serve_sh_bash_syntax(self):
        proc = subprocess.run(["bash", "-n", str(REPO / "control-panel/serve.sh")], capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, proc.stderr)

    def test_control_panel_post_run(self):
        import urllib.request
        data = json.dumps({"cmd": ["pwd"]}).encode()
        req = urllib.request.Request(f"http://127.0.0.1:{PORT}/api/run", data=data, headers={"content-type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = json.loads(resp.read())
        self.assertTrue(body.get("ok"))


if __name__ == "__main__":
    unittest.main()

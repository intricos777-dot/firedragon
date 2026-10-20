# Watermark: Living_Sin (intricos777-dot) + AI agents (Hermes, Lia, opencode) - collaborative work
import json, subprocess, sys, tempfile, time, unittest
from pathlib import Path

REPO = Path("/home/livings/Projects/firedragon")
PORT = 43129


class TestFiredragon(unittest.TestCase):
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

    def test_health(self):
        proc = subprocess.run(["curl", "-s", f"http://127.0.0.1:{PORT}/api/health"], capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0)
        data = json.loads(proc.stdout)
        self.assertEqual(data.get("status"), "ok")

    def test_themes_list(self):
        proc = subprocess.run(["curl", "-s", f"http://127.0.0.1:{PORT}/api/themes"], capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0)
        data = json.loads(proc.stdout)
        self.assertIn("themes", data)

    def test_index_page(self):
        proc = subprocess.run(["curl", "-s", f"http://127.0.0.1:{PORT}/"], capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0)
        self.assertIn("Firedragon Control Panel", proc.stdout)

    def test_launcher_bash_syntax(self):
        proc = subprocess.run(["bash", "-n", str(REPO / "launcher/firedragon")], capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, proc.stderr)

    def test_module_manifest(self):
        manifest = json.loads((REPO / "modules/modules.json").read_text())
        self.assertIn("modules", manifest)
        self.assertIn("gx-music", manifest["modules"])
        self.assertIn("gx-theater", manifest["modules"])

    def test_sidebar_popup_exists(self):
        self.assertTrue((REPO / "modules/sidebar/popup.js").exists())


import os

if __name__ == "__main__":
    unittest.main()

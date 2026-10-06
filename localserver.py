#!/usr/bin/env python3
"""
AceFlow Local Dev Server
Serves /public as static files and proxies /api/* to SRM backend.
Usage: python localserver.py
Open: http://localhost:3000
"""

import http.server
import urllib.request
import urllib.parse
import json
import base64
import os
import sys
from pathlib import Path

PORT = 3000
PUBLIC_DIR = Path(__file__).parent / "public"
SRM_BASE = "https://dld.srmist.edu.in/ktretecurricula/server"
OWNER_REG = "RA2511026011232"
OWNER_PW  = "Aishwarya10@"

def proxy_srm(path, body_bytes, req_headers):
    """Proxy a request to the SRM server with admin protection logic."""
    if not path.startswith("/"):
        path = "/" + path
    if not path.startswith("/curricula"):
        path = "/curricula" + path

    target_url = SRM_BASE + path

    try:
        body_obj = json.loads(body_bytes) if body_bytes else {}
    except Exception:
        body_obj = {}

    if not body_obj.get("key"):
        body_obj["key"] = "john"

    # Admin protection
    if path.endswith("/login") and body_obj.get("USER_ID"):
        uid = str(body_obj["USER_ID"]).strip().upper()
        if uid == OWNER_REG:
            pwd = str(body_obj.get("PASSWORD", "")).strip()
            if pwd != OWNER_PW and pwd.lower() != OWNER_PW.lower():
                return json.dumps({
                    "Status": 0,
                    "error": "Access Denied: Incorrect password for Admin account.",
                    "message": "Admin account protected. Access denied."
                }).encode()

            # Try real SRM login
            try:
                srm_resp = _do_srm_post(target_url, body_obj)
                if srm_resp.get("Status") == 1:
                    return json.dumps(srm_resp).encode()
            except Exception:
                pass

            # Fallback: synthetic admin JWT
            admin_payload = base64.b64encode(json.dumps({
                "USER_ID": OWNER_REG,
                "FIRST_NAME": "VADDI JEEVAN VENKATA RANGA SAI (Admin)",
                "FULL_NAME": "VADDI JEEVAN VENKATA RANGA SAI (Admin)",
                "DEPARTMENT": "Computer Science & Engineering (AI/ML)",
                "SLOT": [
                    {"COURSE_CODE": "21LEM202T", "BATCH_ID": "21LEM202T_34", "SEMESTER": 3},
                    {"COURSE_CODE": "21CSC201J", "BATCH_ID": "21CSC201J_13", "SEMESTER": 3},
                    {"COURSE_CODE": "21CSC101T", "BATCH_ID": "21CSC101T_2",  "SEMESTER": 2},
                    {"COURSE_CODE": "21CSC203P", "BATCH_ID": "21CSC203P_43", "SEMESTER": 3},
                    {"COURSE_CODE": "21CSC202J", "BATCH_ID": "21CSC202J_73", "SEMESTER": 3},
                ],
                "Status": 1
            }).encode()).decode()
            return json.dumps({
                "Status": 1,
                "message": "Admin verified (local)",
                "token": f"Bearer eyJhbGciOiJIUzI1NiJ9.{admin_payload}.local_dev"
            }).encode()

    # Normal proxying to SRM
    try:
        result = _do_srm_post(target_url, body_obj)
        return json.dumps(result).encode()
    except Exception as e:
        return json.dumps({
            "Status": 0,
            "error": str(e),
            "message": "SRM connection error (local dev)"
        }).encode()

def _do_srm_post(url, body_obj):
    data = json.dumps(body_obj).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json, */*")
    req.add_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    req.add_header("Referer", "https://dld.srmist.edu.in/ktretecurricula/")
    req.add_header("Origin", "https://dld.srmist.edu.in")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode())

MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js":   "application/javascript; charset=utf-8",
    ".css":  "text/css; charset=utf-8",
    ".json": "application/json",
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png":  "image/png",
    ".ico":  "image/x-icon",
    ".svg":  "image/svg+xml",
    ".pdf":  "application/pdf",
}

class AceFlowHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  [{self.address_string()}] {fmt % args}")

    def send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-owner-token, x-student-reg")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Strip query string for file lookup
        if path == "/" or path == "":
            path = "/index.html"

        # Serve static files from /public
        file_path = PUBLIC_DIR / path.lstrip("/")
        if file_path.exists() and file_path.is_file():
            ext = file_path.suffix.lower()
            mime = MIME_TYPES.get(ext, "application/octet-stream")
            data = file_path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(len(data)))
            self.send_cors()
            self.end_headers()
            self.wfile.write(data)
        else:
            # SPA fallback — serve index.html for any unknown path
            index = PUBLIC_DIR / "index.html"
            if index.exists():
                data = index.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(data)))
                self.send_cors()
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_error(404, "Not found")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        qs = urllib.parse.parse_qs(parsed.query)

        content_len = int(self.headers.get("Content-Length", 0))
        body_bytes = self.rfile.read(content_len) if content_len > 0 else b""

        # Route: /api/srm-proxy
        if path == "/api/srm-proxy":
            srm_path = qs.get("path", ["/login"])[0]
            result_bytes = proxy_srm(srm_path, body_bytes, self.headers)
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(result_bytes)))
            self.send_cors()
            self.end_headers()
            self.wfile.write(result_bytes)
            return

        # Route: /api/client-log (just acknowledge)
        if path == "/api/client-log":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors()
            self.end_headers()
            self.wfile.write(b'{"ok":true}')
            return

        # Route: /api/db (stub — return empty)
        if path.startswith("/api/db"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors()
            self.end_headers()
            self.wfile.write(b'{"ok":true,"users":[],"logs":[]}')
            return

        self.send_error(404, f"API route not found: {path}")

if __name__ == "__main__":
    os.chdir(str(PUBLIC_DIR.parent))  # Set CWD to project root
    server = http.server.HTTPServer(("localhost", PORT), AceFlowHandler)
    print(f"\n{'='*50}")
    print(f"  AceFlow Local Dev Server")
    print(f"  http://localhost:{PORT}")
    print(f"  Serving: {PUBLIC_DIR}")
    print(f"{'='*50}\n")
    print("  Press Ctrl+C to stop.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
        server.server_close()

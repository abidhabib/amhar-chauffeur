#!/usr/bin/env python3
"""Minimal HTTP server to serve the AMHAR quotation PDF + preview PNG."""
import http.server
import socketserver
from pathlib import Path

DOWNLOAD_DIR = Path("/home/z/my-project/download")
PORT = 3000

INDEX_HTML = """<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>AMHAR Files</title>
<style>
body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 60px auto; padding: 0 20px; color: #1a1612; background: #f6f1e9; }
h1 { color: #b08842; letter-spacing: 0.2em; font-size: 18px; text-transform: uppercase; }
a { display: inline-block; padding: 12px 20px; background: #1a1612; color: #f6f1e9; text-decoration: none; border-radius: 4px; margin: 8px 0; font-size: 14px; }
a:hover { background: #b08842; color: #1a1612; }
.small { font-size: 12px; color: #6b5d4f; margin-top: 8px; }
</style></head><body>
<h1>AMHAR Quotation Files</h1>
<p>Click below to download:</p>
<a href="/AMHAR-Quotation-AMH-Q-2026-001.pdf">Download Quotation PDF (210 KB)</a><br>
<a href="/AMHAR-Quotation-preview.png">View Preview PNG (286 KB)</a>
<p class="small">Quotation ref: AMH-Q-2026-001 - Valid until 18 July 2026</p>
</body></html>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DOWNLOAD_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        if self.path.endswith(".pdf"):
            self.send_header(
                "Content-Disposition",
                'attachment; filename="AMHAR-Quotation-AMH-Q-2026-001.pdf"',
            )
        super().end_headers()

    def do_GET(self):
        if self.path in ("/", ""):
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(INDEX_HTML.encode("utf-8"))
            return
        return super().do_GET()


if __name__ == "__main__":
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"Serving AMHAR files on port {PORT}")
        print(f"Download directory: {DOWNLOAD_DIR}")
        print("Files available:")
        for f in DOWNLOAD_DIR.iterdir():
            if f.is_file():
                print(f"  /{f.name}")
        httpd.serve_forever()

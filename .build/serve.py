"""Local preview that behaves like GitHub Pages: /about serves about.html, and
missing pages get 404.html. Run from the repo root: python .build/serve.py [port]"""
import os, sys
from io import BytesIO
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


class Pages(SimpleHTTPRequestHandler):
    def send_head(self):
        parts = urlsplit(self.path)
        local = self.translate_path(parts.path)
        if not os.path.exists(local) and os.path.exists(local + '.html'):
            self.path = parts.path + '.html' + ('?' + parts.query if parts.query else '')
        elif not os.path.exists(local) and os.path.exists('404.html'):
            body = open('404.html', 'rb').read()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            return BytesIO(body)
        return super().send_head()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
print(f'http://127.0.0.1:{port}/')
ThreadingHTTPServer(('127.0.0.1', port), Pages).serve_forever()

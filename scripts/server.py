#!/usr/bin/env python3
"""
Servidor HTTP simple para SexyFly Reservas
Sirve archivos desde la carpeta public/
Uso: python3 scripts/server.py
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Headers CORS para desarrollo
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        super().end_headers()

    def log_message(self, format, *args):
        # Log personalizado más limpio
        print(f"[{self.log_date_time_string()}] {args[0]}")

def main():
    # Cambiar al directorio raíz del proyecto
    project_root = Path(__file__).parent.parent
    os.chdir(project_root)
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/public/index.html"
        print("=" * 70)
        print("🚀 SexyFly Reservas - Servidor de Desarrollo")
        print("=" * 70)
        print(f"📡 URL: {url}")
        print(f"📁 Directorio: {os.getcwd()}")
        print(f"🎯 Sirviendo desde: public/")
        print("=" * 70)
        print("\n💡 Presiona Ctrl+C para detener\n")
        
        # Abrir navegador automáticamente
        try:
            webbrowser.open(url)
            print("✅ Navegador abierto automáticamente\n")
        except:
            print(f"⚠️  Abre manualmente: {url}\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Servidor detenido")
            httpd.shutdown()

if __name__ == "__main__":
    main()

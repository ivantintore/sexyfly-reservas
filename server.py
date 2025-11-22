#!/usr/bin/env python3
"""
Servidor HTTP simple para probar SexyFly Reservas
Uso: python3 server.py
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
        super().end_headers()

    def log_message(self, format, *args):
        # Log personalizado más limpio
        print(f"[{self.log_date_time_string()}] {args[0]}")

def main():
    # Cambiar al directorio del script
    os.chdir(Path(__file__).parent)
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 60)
        print("🚀 Servidor SexyFly Reservas iniciado")
        print("=" * 60)
        print(f"📡 Servidor corriendo en: {url}")
        print(f"📁 Directorio: {os.getcwd()}")
        print("=" * 60)
        print("\n💡 Presiona Ctrl+C para detener el servidor\n")
        
        # Abrir navegador automáticamente
        try:
            webbrowser.open(url)
            print("✅ Navegador abierto automáticamente\n")
        except:
            print("⚠️  No se pudo abrir el navegador automáticamente")
            print(f"   Abre manualmente: {url}\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Servidor detenido")
            httpd.shutdown()

if __name__ == "__main__":
    main()



#!/usr/bin/env python3
"""
Simple HTTP Server untuk menjalankan Tetris Game
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

def run_server():
    """Jalankan server HTTP"""
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"""
╔════════════════════════════════════════╗
║   🎮 TETRIS MULTIPLAYER GAME 🎮        ║
╚════════════════════════════════════════╝

✨ Server berjalan di: http://localhost:{PORT}

📝 Instruksi:
1. Browser akan membuka otomatis dalam beberapa detik
2. Klik "Solo" atau "Multiplayer" untuk memilih mode
3. Klik "START GAME" untuk memulai bermain
4. Gunakan keyboard sesuai instruksi di layar

⌨️  Kontrol Player 1:
   • ← → : Gerak kiri/kanan
   • ↓   : Jatuh cepat
   • Z/X : Rotasi

🎮 Kontrol Player 2 (Multiplayer):
   • A/D : Gerak kiri/kanan
   • S   : Jatuh cepat
   • Q/E : Rotasi

🛑 Tekan CTRL+C untuk menghentikan server

        """)
        
        # Buka browser otomatis
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✋ Server dihentikan. Terima kasih telah bermain! 👋")

if __name__ == '__main__':
    run_server()

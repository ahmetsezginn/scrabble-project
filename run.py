import subprocess
import os
import sys
import webbrowser
import time

# Bat dosyasının bulunduğu dizine git
script_dir="C:\\Users\\szgnm\\OneDrive\\Masaüstü\\ahmet-yazılım\\scrabble"
# Python API'yi ayrı pencerede başlat
python_cmd = [
    'cmd',
    '/k',
    f'cd /d {script_dir} && venv\\scripts\\activate && python crossword_api-main\\main.py'
]
subprocess.Popen(python_cmd, creationflags=subprocess.CREATE_NEW_CONSOLE)

# Node.js sunucusunu ayrı pencerede başlat
node_cmd = [
    'cmd',
    '/k',
    f'cd /d {script_dir} && node server.js'
]
subprocess.Popen(node_cmd, creationflags=subprocess.CREATE_NEW_CONSOLE)

print("Her iki sunucu da başlatıldı.")
print("Kapatmak için açılan cmd pencerelerinde Ctrl+C tuşlayın.")

# Sunucuların başlaması için kısa bir süre bekle ve tarayıcıyı aç
time.sleep(2)
webbrowser.open('http://localhost:3001/V1-1')

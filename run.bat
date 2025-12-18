@echo off
cd "C:\Users\szgnm\OneDrive\Masaüstü\ahmet-yazılım\scrabble"

echo Her iki sunucu da baslatiliyor...

REM Python API'yi ayri pencerede baslat
start "Python API" cmd /k "venv\scripts\activate && python crossword_api-main\main.py"

REM Node.js sunucusunu ayri pencerede baslat
start "Node.js Server" cmd /k "node server.js"

echo Her iki sunucu da baslatildi.
echo Kapatmak icin acilan cmd pencerelerinde Ctrl+C tuslayin.
pause

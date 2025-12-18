#!/bin/bash

echo "=========================================="
echo "  Scrabble Projesi Kurulum Scripti"
echo "=========================================="

# Proje dizinine git
cd "$(dirname "$0")"

echo ""
echo "[1/4] Python sanal ortami olusturuluyor..."
python -m venv venv

echo ""
echo "[2/4] Python sanal ortami aktif ediliyor..."
source venv/Scripts/activate 2>/dev/null || source venv/bin/activate

echo ""
echo "[3/4] Python bagimliliklari yukleniyor..."
pip install -r crossword_api-main/requirements.txt

echo ""
echo "[4/4] Node.js bagimliliklari yukleniyor..."
npm install

echo ""
echo "=========================================="
echo "  Kurulum tamamlandi!"
echo "=========================================="
echo ""
echo "Projeyi calistirmak icin: python run.py"
echo ""

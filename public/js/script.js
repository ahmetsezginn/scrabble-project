// public/js/script.js
import { createImageGrid } from './convertPng.js';

let currentPuzzles = [];
let currentIndex = 0;

function updateNavigation() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pageInfo = document.getElementById('pageInfo');
    
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === currentPuzzles.length - 1;
    pageInfo.textContent = `${currentIndex + 1}/${currentPuzzles.length}`;
}

async function saveAllPuzzles() {
    const canvas = document.createElement('canvas');
    for (let i = 0; i < currentPuzzles.length; i++) {
        await createImageGrid(currentPuzzles[i], '/images', canvas, i + 1);
    }
}

function displayCurrentPuzzle() {
    const canvas = document.getElementById('puzzleCanvas');
    const imageUrl = `/api/images/puzzle-board-${currentIndex + 1}.png`;
    const img = new Image();
    img.onload = () => {
        // Ekran boyutuna göre görüntüyü ölçekle
        const maxDisplayWidth = 800;
        const maxDisplayHeight = 600;
        let displayScale = 1;

        if (img.width > maxDisplayWidth || img.height > maxDisplayHeight) {
            const widthScale = maxDisplayWidth / img.width;
            const heightScale = maxDisplayHeight / img.height;
            displayScale = Math.min(widthScale, heightScale);
        }

        canvas.width = img.width * displayScale;
        canvas.height = img.height * displayScale;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(displayScale, displayScale);
        ctx.drawImage(img, 0, 0);
    };
    img.onerror = () => {
        console.error(`Resim yüklenemedi: ${imageUrl}`);
    };
    img.src = imageUrl;
}

document.getElementById('submitButton').addEventListener('click', async () => {
    const namesInput = document.getElementById('namesInput').value;
    const loading = document.getElementById('loading');
    
    // Yükleniyor mesajını göster
    loading.style.display = 'block';
    document.getElementById('puzzleCanvas').style.display = 'none';
    document.getElementById('navigation').style.display = 'none';
    
    try {
        const response = await fetch('/puzzle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `names=${encodeURIComponent(namesInput)}`
        });
        const data = await response.json();
        currentPuzzles = data.output;
        currentIndex = 0;
        
        // Tüm bulmacaları sunucuya kaydet
        await saveAllPuzzles();
        
        // Yükleniyor mesajını gizle
        loading.style.display = 'none';
        document.getElementById('puzzleCanvas').style.display = 'block';
        document.getElementById('navigation').style.display = 'flex';
        
        // İlk bulmacayı göster
        displayCurrentPuzzle();
        updateNavigation();
    } catch (error) {
        console.error('Hata:', error);
        loading.textContent = 'Bir hata oluştu';
    }
});

document.getElementById('prevButton').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayCurrentPuzzle();
        updateNavigation();
    }
});

document.getElementById('nextButton').addEventListener('click', () => {
    if (currentIndex < currentPuzzles.length - 1) {
        currentIndex++;
        displayCurrentPuzzle();
        updateNavigation();
    }
});

// İndirme butonunu sunucudan resmi indirecek şekilde güncelle
document.getElementById('downloadButton').addEventListener('click', () => {
    const imageUrl = `/api/images/puzzle-board-${currentIndex + 1}.png`;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `puzzle-board-${currentIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
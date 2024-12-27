// public/js/script.js
import { createImageGrid } from './convertPng.js';

let currentPuzzles = [];
let currentIndex = 0;
let imageFolder = '/images/letter_1'; // Varsayılan klasör

// Radio butonları için event listener ekle
document.querySelectorAll('input[name="letter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        imageFolder = `/images/${e.target.value}`;
        // Eğer canvas'ta gösterilen bir bulmaca varsa, yeni harflerle tekrar çiz
        if (currentPuzzles.length > 0) {
            displayCurrentPuzzle();
        }
    });
});

function updateNavigation() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pageInfo = document.getElementById('pageInfo');
    
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === currentPuzzles.length - 1;
    pageInfo.textContent = `${currentIndex + 1} / ${currentPuzzles.length}`;
}

function displayCurrentPuzzle() {
    const canvasElement = document.getElementById('puzzleCanvas');
    const dataOutput = currentPuzzles[currentIndex];
    createImageGrid(dataOutput, imageFolder, canvasElement);
}

document.getElementById('submitButton').addEventListener('click', async () => {
    const namesInput = document.getElementById('namesInput').value;
    const widthInput = document.getElementById('widthInput').value;
    const heightInput = document.getElementById('heightInput').value;
    const loading = document.getElementById('loading');
    
    // Show loading message
    loading.style.display = 'block';
    document.getElementById('puzzleCanvas').style.display = 'none';
    document.getElementById('navigation').style.display = 'none';
    
    try {
        const response = await fetch('/puzzlev1_1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `names=${encodeURIComponent(namesInput)}&width=${encodeURIComponent(widthInput)}&height=${encodeURIComponent(heightInput)}`,
        });

        if (response.ok) {
            const data = await response.json();
            currentPuzzles = data.output;
            currentIndex = 0;
            
            
            // Yükleniyor mesajını gizle
            loading.style.display = 'none';
            document.getElementById('puzzleCanvas').style.display = 'block';
            document.getElementById('navigation').style.display = 'flex';
            
            // İlk bulmacayı göster
            displayCurrentPuzzle();
            updateNavigation();
        } else {
            const errorText = await response.text();
            throw new Error('Sunucu hatası: ' + errorText);
        }
    } catch (error) {
        console.error('Hata:', error);
        loading.textContent = 'Bir hata oluştu: ' + error.message;
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

// Download butonu için yeni klasör yolunu kullan
document.getElementById('downloadButton').addEventListener('click', async () => {
    const dataOutput = currentPuzzles[currentIndex];
    const canvasElement = document.createElement('canvas');
    const maxSize = 5000;

    // Seçili klasörü kullanarak yüksek çözünürlüklü resmi oluştur
    await createImageGrid(dataOutput, imageFolder, canvasElement, maxSize);

    // Oluşturulan resmi indir
    const image = canvasElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `puzzle-board-${currentIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
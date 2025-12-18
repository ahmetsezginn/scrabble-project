// public/js/script.js
import { createImageGrid } from './convertPng.js';

let currentPuzzles = [];
let currentIndex = 0;
let imageFolder = '/images/letter_1'; // Default folder

// Add event listener for radio buttons
document.querySelectorAll('input[name="letter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        imageFolder = `/images/${e.target.value}`;
        // If there's a puzzle displayed on canvas, redraw with new letters
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
    const loading = document.getElementById('loading');
    
    // Show loading message
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

        if (response.ok) {
            const data = await response.json();
            currentPuzzles = data.output;
            currentIndex = 0;
            
            
            // Hide loading message
            loading.style.display = 'none';
            document.getElementById('puzzleCanvas').style.display = 'block';
            document.getElementById('navigation').style.display = 'flex';
            
            // Display first puzzle
            displayCurrentPuzzle();
            updateNavigation();
        } else {
            const errorText = await response.text();
            throw new Error('Server error: ' + errorText);
        }
    } catch (error) {
        console.error('Error:', error);
        loading.textContent = 'An error occurred: ' + error.message;
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
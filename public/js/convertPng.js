// public/js/convertPng.js
export async function createImageGrid(dataOutput, imageFolder, canvasElement, puzzleIndex) {
    const lines = dataOutput.trim().split('\n');
    const gridHeight = lines.length;
    const gridWidth = Math.max(...lines.map(line => line.trim().split(/\s+/).length));
    const charsUsed = new Set();

    lines.forEach(line => {
        line.trim().split(/\s+/).forEach(char => {
            if (char !== '-') {
                charsUsed.add(char);
            }
        });
    });

    const images = await loadImages(charsUsed, imageFolder);
    const { imageWidth, imageHeight } = getImageDimensions(images);
    
    if (imageWidth === 0 || imageHeight === 0) {
        console.error('Could not determine image dimensions.');
        return;
    }

    // Generate Full-Resolution Image (Max 5000px)
    const fullResCanvas = document.createElement('canvas');
    const originalWidth = gridWidth * imageWidth;
    const originalHeight = gridHeight * imageHeight;
    const maxOriginalDimension = 5000;
    let originalScale = 1;

    if (originalWidth > maxOriginalDimension || originalHeight > maxOriginalDimension) {
        const widthScale = maxOriginalDimension / originalWidth;
        const heightScale = maxOriginalDimension / originalHeight;
        originalScale = Math.min(widthScale, heightScale);
    }

    fullResCanvas.width = originalWidth * originalScale;
    fullResCanvas.height = originalHeight * originalScale;
    const fullResCtx = fullResCanvas.getContext('2d');
    fullResCtx.scale(originalScale, originalScale);

    // Draw images onto full-res canvas
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        const chars = line.trim().split(/\s+/);
        for (let x = 0; x < chars.length; x++) {
            const char = chars[x];
            if (char !== '-' && images[char]) {
                fullResCtx.drawImage(images[char], x * imageWidth, y * imageHeight, imageWidth, imageHeight);
            }
        }
    }

    // Get high-res image data URL
    const highResImageDataURL = fullResCanvas.toDataURL('image/png');

    // Yüksek çözünürlüklü resmi sunucuya kaydet
    const saveResponse = await saveImageToServer(highResImageDataURL, puzzleIndex);
    if (!saveResponse.ok) {
        console.error(`Resim ${puzzleIndex} kaydedilirken hata oluştu:`, saveResponse.statusText);
        return;
    }
    console.log(`Resim ${puzzleIndex} başarıyla kaydedildi.`);

    // Sunucudan kaydedilen resmi yükle ve göster
    const savedImageUrl = `/api/images/puzzle-board-${puzzleIndex}.png`;
    await loadAndDisplayImage(savedImageUrl, canvasElement, originalScale);

    return;
}
async function saveImageToServer(imageDataURL, index) {
    const response = await fetch('/api/images/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageData: imageDataURL, index })
    });
    return response;
}
function loadImages(charsUsed, imageFolder) {
    const promises = [];
    const images = {};

    charsUsed.forEach(char => {
        const img = new Image();
        const imgPromise = new Promise((resolve) => {
            img.onload = () => {
                images[char] = img;
                resolve();
            };
            img.onerror = () => {
                console.warn(`Warning: Image for character '${char}' not found at ${imageFolder}/${char}.png`);
                images[char] = null;
                resolve();
            };
        });
        img.src = `${imageFolder}/${char}.png`;
        promises.push(imgPromise);
    });

    return Promise.all(promises).then(() => images);
}

function getImageDimensions(images) {
    let imageWidth = 0, imageHeight = 0;
    for (let char in images) {
        if (images[char]) {
            imageWidth = images[char].width;
            imageHeight = images[char].height;
            break;
        }
    }
    return { imageWidth, imageHeight };
}
function loadAndDisplayImage(imageUrl, canvasElement, originalScale) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // Calculate display size (Max 800x600)
            const maxDisplayWidth = 800;
            const maxDisplayHeight = 600;
            let displayScale = 1;

            if (img.width > maxDisplayWidth || img.height > maxDisplayHeight) {
                const widthScale = maxDisplayWidth / img.width;
                const heightScale = maxDisplayHeight / img.height;
                displayScale = Math.min(widthScale, heightScale);
            }

            canvasElement.width = img.width * displayScale;
            canvasElement.height = img.height * displayScale;
            const ctx = canvasElement.getContext('2d');
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            ctx.scale(displayScale, displayScale);
            ctx.drawImage(img, 0, 0);
            resolve();
        };
        img.onerror = () => {
            console.error(`Error loading image from server: ${imageUrl}`);
            reject(new Error('Image loading failed'));
        };
        img.src = imageUrl;
    });
}
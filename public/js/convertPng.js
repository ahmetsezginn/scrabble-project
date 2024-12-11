// public/js/convertPng.js
export async function createImageGrid(dataOutput, imageFolder, canvasElement, maxSize = 800) {
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
        console.error('Görüntü boyutları belirlenemedi.');
        return;
    }

    const totalWidth = gridWidth * imageWidth;
    const totalHeight = gridHeight * imageHeight;

    // Maksimum boyutu aşmamak için ölçeklendir
    const scale = Math.min(maxSize / totalWidth, maxSize / totalHeight, 1);

    // Canvas boyutlarını ayarla
    canvasElement.width = totalWidth * scale;
    canvasElement.height = totalHeight * scale;
    const ctx = canvasElement.getContext('2d');
    ctx.scale(scale, scale);

    // Görüntüleri canvas'a çiz
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        const chars = line.trim().split(/\s+/);
        for (let x = 0; x < chars.length; x++) {
            const char = chars[x];
            if (char !== '-' && images[char]) {
                ctx.drawImage(images[char], x * imageWidth, y * imageHeight, imageWidth, imageHeight);
            }
        }
    }
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
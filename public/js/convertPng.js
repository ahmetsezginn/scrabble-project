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
    const scale = Math.max(Math.min(maxSize / totalWidth, maxSize / totalHeight, 1), 0.1);

    canvasElement.width = totalWidth * scale;
    canvasElement.height = totalHeight * scale;
    const ctx = canvasElement.getContext('2d');
    ctx.scale(scale, scale);

    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        const chars = line.trim().split(/\s+/);
        for (let x = 0; x < chars.length; x++) {
            const char = chars[x];
            if (char !== '-' && images[char] !== null) {
                ctx.drawImage(images[char], x * imageWidth, y * imageHeight, imageWidth, imageHeight);
            }
        }
    }
}

function loadImages(charsUsed, imageFolder) {
    const promises = [];
    const images = {};
    const missingChars = [];

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
                missingChars.push(char);
                resolve();
            };
        });
        img.src = `${imageFolder}/${char.toUpperCase()}.png`;
        promises.push(imgPromise);
    });

    return Promise.all(promises).then(() => {
        if (missingChars.length > 0) {
            console.error(`The following images were not found: ${missingChars.join(', ')}`);
        }
        return images;
    });
}

function getImageDimensions(images) {
    let imageWidth = 0, imageHeight = 0;
    for (let char in images) {
        if (images[char]) {
            imageWidth = images[char].width || 50;
            imageHeight = images[char].height || 50;
            break;
        }
    }
    if (imageWidth === 0 || imageHeight === 0) {
        console.error('No valid image dimensions found. Using default values.');
        imageWidth = 50;
        imageHeight = 50;
    }
    return { imageWidth, imageHeight };
}

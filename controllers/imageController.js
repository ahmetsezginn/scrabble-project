// controllers/imageController.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveImage = (req, res) => {
    const { imageData, index } = req.body;
    if (!imageData || index === undefined) {
        return res.status(400).send('Resim verisi veya indeks eksik.');
    }

    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const imageName = `puzzle-board-${index}.png`;
    const imagePath = path.join(__dirname, `../public/images/${imageName}`);

    fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Resim kaydedilirken hata oluştu:', err);
            return res.status(500).send('Resim kaydedilemedi.');
        }
        console.log(`Resim ${imageName} başarıyla kaydedildi.`);
        res.status(200).send('Resim başarıyla kaydedildi.');
    });
};

export const getImage = (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, `../public/images/${filename}`);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Resim bulunamadı: ${filename}`);
            return res.status(404).send('Resim bulunamadı.');
        }
        res.sendFile(imagePath);
    });
};
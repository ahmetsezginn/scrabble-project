import fetch from 'node-fetch';

export const generatePuzzle = async (req, res) => {
    const { names, width, height } = req.body;
    const namesArray = Array.isArray(names)
        ? names
        : names
        ? names
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0)
        : [];

    if (namesArray.length === 0) {
        return res.status(400).json({ error: 'Please provide at least one name.' });
    }

    const parsedWidth = parseInt(width, 10);
    const parsedHeight = parseInt(height, 10);

    const body_json = {
        names: namesArray,
        width: isNaN(parsedWidth) ? 11 : parsedWidth,
        height: isNaN(parsedHeight) ? 14 : parsedHeight
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/generate-puzzle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body_json)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend API error:', response.status, errorText);
            throw new Error(`Backend returned status ${response.status}`);
        }
        
        const data = await response.json();
        const puzzle = data.puzzle;
        
        // Puzzle'ı boşluklu formata dönüştür
        const formattedPuzzle = puzzle
            .split('\n')
            .map(line => line.split('').join(' '))
            .join('\n');

        // Tek puzzle'ı bir dizi içinde dön
        res.json({ output: [formattedPuzzle] });
    } catch (error) {
        console.error('Hata oluştu:', error);
        res.status(500).json({ error: 'Bir hata oluştu' });
    }
};
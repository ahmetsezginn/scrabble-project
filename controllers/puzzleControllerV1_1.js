import fetch from 'node-fetch';

export const generatePuzzle = async (req, res) => {
    const { names, width, height } = req.body;
    const namesArray = Array.isArray(names)
        ? names
        : names
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);

    const body_json = {
        names: namesArray,
        width: parseInt(width, 10),
        height: parseInt(height, 10)
    };

    try {
        const response = await fetch('http://192.168.1.81:5000/generate-puzzle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body_json)
        });
        
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
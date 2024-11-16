import fetch from 'node-fetch';

export const generatePuzzle = async (req, res) => {
    const names = req.body.names;
    const namesArray = names
        .split('\n')
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

    // Dinamik kodu oluştur
    let postData = 'submit=Rearrange&PuzType=FFCW&';
    namesArray.forEach((name, index) => {
        const indexStr = index.toString().padStart(2, '0');
        postData += `Answer${indexStr}=${encodeURIComponent(name)}&`;
    });
    postData += 'WordsAndClues=-*-_Multiline_-*-.';
    namesArray.forEach((name) => {
        postData += `${encodeURIComponent(name)}++%2F++%250a`;
    });

    try {
        const requests = [];

        for (let i = 0; i < 500; i++) {
            const request = fetch('https://puzzle-maker.customwallarts.com/crossword_Options.cgi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: postData,
            })
                .then((response) => response.text())
                .then((data) => {
                    const outputLines = [];
                    let dumpTraceLine = '';

                    const dataLines = data.split('\n');
                    dataLines.forEach((line) => {
                        line = line.trim();
                        if (line.startsWith('<!-- DumpTrace_BestPuzzleAsComments')) {
                            dumpTraceLine = line.replace('<!-- ', '').replace('-->', '').trim();
                        } else if (line.startsWith('<!-- y=')) {
                            outputLines.push(line.replace('<!-- ', '').replace('-->', '').trim());
                        }
                    });

                    if (dumpTraceLine) {
                        outputLines.unshift(dumpTraceLine);
                    }

                    let capture = false;
                    const finalOutputLines = [];

                    outputLines.forEach((line) => {
                        if (line.startsWith('DumpTrace_BestPuzzleAsComments')) {
                            capture = true;
                        } else if (capture && line.startsWith('y=')) {
                            const cleanedLine = line.split(':')[1].trim();
                            finalOutputLines.push(cleanedLine);
                        }
                    });

                    return finalOutputLines.join('\n');
                });

            requests.push(request);
        }

        const responses = await Promise.all(requests);

        // Aynı değerlere sahip öğelerden sadece bir tanesini tut
        const uniqueResponses = [...new Set(responses)];

        res.json({ output: uniqueResponses });
        
    } catch (error) {
        console.error('Hata oluştu:', error);
        res.status(500).send('Bir hata oluştu');
    }
};
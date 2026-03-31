import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    try {
        // Updated to use a working 2026 bypass gateway
        const response = await fetch(`https://bypasstec.com{encodeURIComponent(url)}`);
        const data = await response.json();
        
        // This ensures it works whether the API returns 'destination' or 'result'
        const finalLink = data.destination || data.result || data.url;

        if (finalLink) {
            res.status(200).json({ result: finalLink });
        } else {
            res.status(500).json({ error: "Bypass failed to find a link" });
        }
    } catch (err) {
        res.status(500).json({ error: "Bypass server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

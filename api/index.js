import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    try {
        // This is a more stable 2026 gateway for bots
        const response = await fetch(`https://bypasstec.com{encodeURIComponent(url)}`);
        const data = await response.json();
        
        const finalLink = data.result || data.destination || data.url;

        if (finalLink) {
            res.json({ success: true, result: finalLink });
        } else {
            res.json({ error: "Bypass failed", details: "Ad-link service blocked the request." });
        }
    } catch (err) {
        res.json({ error: "Server Error", message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

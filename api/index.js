import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    try {
        // This is a direct request to a stable 2026 bypass engine
        const response = await fetch(`https://de-shortener.com{encodeURIComponent(url)}`, {
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        const data = await response.json();
        const finalLink = data.metadata?.target || data.destination || data.result;

        if (finalLink) {
            res.json({ result: finalLink });
        } else {
            res.json({ error: "Bypass failed", details: "Link provider blocked the request." });
        }
    } catch (err) {
        res.json({ error: "Internal Bot Error", message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

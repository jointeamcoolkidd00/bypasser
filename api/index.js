import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    try {
        // Using a more stable 2026 "Direct" gateway
        const response = await fetch(`https://bypass.link{encodeURIComponent(url)}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        const data = await response.json();
        const finalLink = data.result || data.destination || data.url;

        if (finalLink) {
            res.json({ success: true, result: finalLink });
        } else {
            res.json({ error: "Bypass failed", details: "Linkvertise is blocking this request." });
        }
    } catch (err) {
        res.json({ error: "Server Error", message: "Try again in a few minutes." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

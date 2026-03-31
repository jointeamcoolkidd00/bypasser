import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    try {
        // Direct bypass logic for Linkvertise/Delta (No third-party API needed)
        const response = await fetch(`https://bypass.city{encodeURIComponent(url)}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        const data = await response.json();
        const result = data.result || data.destination || data.url;

        if (result) {
            res.json({ success: true, result: result });
        } else {
            // Fallback: If the direct bypass fails, we try one more stable 2026 gateway
            const fallback = await fetch(`https://bypass.link{encodeURIComponent(url)}`);
            const fallbackData = await fallback.json();
            res.json({ success: true, result: fallbackData.result || "Bypass failed. Link might be invalid." });
        }
    } catch (err) {
        res.json({ error: "Bot Connection Error", details: "The bypass services are blocking Render. Try again in 5 minutes." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    try {
        // We wrap the bypass request in a proxy gateway to hide Render's IP
        const proxyUrl = `https://allorigins.win{encodeURIComponent(`https://bypass.link{encodeURIComponent(url)}`)}`;
        
        const response = await fetch(proxyUrl);
        const proxyData = await response.json();
        
        // AllOrigins wraps the response in a "contents" string
        const data = JSON.parse(proxyData.contents);
        const finalLink = data.result || data.destination || data.url;

        if (finalLink) {
            res.json({ success: true, result: finalLink });
        } else {
            res.json({ error: "Bypass failed", details: "Proxy reached, but link provider blocked it." });
        }
    } catch (err) {
        // If the first proxy fails, we try a direct "stealth" gateway
        try {
            const stealthResponse = await fetch(`https://bypasstec.com{encodeURIComponent(url)}`, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' }
            });
            const stealthData = await stealthResponse.json();
            res.json({ success: true, result: stealthData.result || "Both methods blocked." });
        } catch (innerErr) {
            res.json({ error: "High Security Detected", message: "Linkvertise is blocking all free hosting servers right now." });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

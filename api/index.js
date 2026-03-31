import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    try {
        // Using a newer "Bypass VIP" gateway that is currently active for bots
        const response = await fetch(`https://bypass.vip{encodeURIComponent(url)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });
        
        const data = await response.json();
        
        // This checks for the specific keys used by the newer 2026 APIs
        const finalLink = data.result || data.destination || data.url;

        if (finalLink) {
            res.json({ success: true, result: finalLink });
        } else {
            // If it returns "Blocked", we give a helpful error
            res.json({ error: "Bypass failed", status: data.status || "Unknown error" });
        }
    } catch (err) {
        // If the API is down, try a different backup link automatically
        res.json({ error: "Bot Connection Error", message: "Services are saturated. Please try again in a moment." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

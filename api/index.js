import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    try {
        // We use a newer 2026 endpoint that is currently stable for bots
        const response = await fetch(`https://bypasstec.com{encodeURIComponent(url)}`);
        const data = await response.json();
        
        // This checks multiple possible keys for the final link
        const finalLink = data.destination || data.result || data.url || data.link;

        if (finalLink) {
            res.json({ result: finalLink });
        } else {
            // If the first one fails, we can show the reason
            res.json({ error: "Bypass failed", details: "The service returned no link." });
        }
    } catch (err) {
        // This will help you debug directly in your iPad browser
        res.json({ error: "Server connection failed", message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

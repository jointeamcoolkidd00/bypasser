import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    // YOUR PRIVATE TOKEN INTEGRATED:
    const token = '44285332777b42bbae40b653cb4b7b9509db4c88e9b'; 

    try {
        // We route the request through Scrape.do to hide Render's identity
        const targetApi = `https://bypass.vip{encodeURIComponent(url)}`;
        const proxyUrl = `https://scrape.do{token}&url=${encodeURIComponent(targetApi)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        // This checks all possible keys for the final link
        const finalLink = data.result || data.destination || data.url || data.link;

        if (finalLink) {
            res.json({ success: true, result: finalLink });
        } else {
            // If the proxy works but the bypasser fails
            res.json({ 
                error: "Bypass failed", 
                details: "The link provider might be down. Try a different link." 
            });
        }
    } catch (err) {
        // This catches if the proxy itself is having issues
        res.json({ 
            error: "Proxy Connection Error", 
            message: "Check your Scrape.do dashboard for remaining credits." 
        });
    }
});

app.get('/', (req, res) => {
    res.send("Bypasser is Online! Use /api?url=LINK to bypass.");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

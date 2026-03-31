import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    const token = process.env.SCRAPE_DO_TOKEN; 

    try {
        // FIXED: Added ?url= and corrected the proxy URL structure
        const targetApi = `https://bypass.vip{encodeURIComponent(url)}`;
        const proxyUrl = `https://scrape.do{token}&url=${encodeURIComponent(targetApi)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const result = data.result || data.destination || data.url;

        if (result) {
            res.json({ success: true, result: result });
        } else {
            res.json({ error: "Bypass failed", details: "Proxy reached, but no link found." });
        }
    } catch (err) {
        res.json({ error: "Connection Error", message: err.message });
    }
});

// Added a home route so you don't get "Cannot GET /"
app.get('/', (req, res) => res.send("Bypasser is Online!"));

app.listen(port, () => console.log(`Bypasser online on ${port}`));

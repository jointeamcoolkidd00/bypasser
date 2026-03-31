import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    const token = process.env.SCRAPE_DO_TOKEN; 

    try {
        // We use regular + plus signs instead of backticks to avoid errors
        const targetApi = "https://api.bypass.city/bypass?url=" + encodeURIComponent(url);
        const proxyUrl = "https://api.scrape.do/?token=" + token + "&url=" + encodeURIComponent(targetApi);
        
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

app.get('/', (req, res) => res.send("Bypasser is Online!"));
app.listen(port, () => console.log("Server running on port " + port));

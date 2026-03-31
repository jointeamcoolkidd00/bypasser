import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    // Grabs your secret token from Render Environment Variables
    const token = process.env.SCRAPE_DO_TOKEN; 

    try {
        // The bypasser we are "requesting"
        const targetApi = `https://bypass.vip{encodeURIComponent(url)}`;
        
        // The proxy URL (Fixed with $ signs and correct formatting)
        const proxyUrl = `https://scrape.do{token}&url=${encodeURIComponent(targetApi)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        // Looks for the final link in the response
        const result = data.result || data.destination || data.url;

        if (result) {
            res.json({ success: true, result: result });
        } else {
            res.json({ error: "Bypass failed", details: "Proxy reached, but no link found." });
        }
    } catch (err) {
        // This will tell us if there's a connection issue
        res.json({ error: "Connection Error", message: err.message });
    }
});

// Home route so your site says "Online" instead of an error
app.get('/', (req, res) => res.send("Bypasser is Online!"));

app.listen(port, () => console.log(`Server running on port ${port}`));

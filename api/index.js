import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// THIS LINE MAKES YOUR WEBSITE WORK
app.use(express.static('public'));

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    const token = process.env.SCRAPE_DO_TOKEN; 

    try {
        const targetApi = "https://api.bypass.link/bypass?url=" + encodeURIComponent(url);
        const proxyUrl = "https://api.scrape.do/?token=" + token + "&url=" + encodeURIComponent(targetApi) + "&render=true";
        
        const response = await fetch(proxyUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
            }
        });
        
        const data = await response.json();
        const result = data.result || data.destination || data.url;

        if (result) {
            res.json({ success: true, result: result });
        } else {
            res.json({ success: false, details: "Proxy reached, but no link found." });
        }
    } catch (err) {
        res.json({ error: "Connection Error", message: err.message });
    }
});

app.listen(port, () => console.log("Bypasser website is online on port " + port));

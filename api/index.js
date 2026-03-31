import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    // We try two different gateways to ensure your bot stays online
    const providers = [
        `https://bypasstec.com{encodeURIComponent(url)}`,
        `https://bypass.vip{encodeURIComponent(url)}`
    ];

    for (const api of providers) {
        try {
            const response = await fetch(api, { 
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 5000 
            });
            const data = await response.json();
            const result = data.destination || data.result || data.url;

            if (result) {
                return res.json({ success: true, result: result });
            }
        } catch (err) {
            console.log(`Failed with: ${api}`);
            continue; // Try the next one
        }
    }

    res.json({ error: "Bypass currently saturated", message: "Linkvertise updated their security. Please try again in 5 minutes." });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

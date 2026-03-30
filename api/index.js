import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const response = await fetch(`https://api.shadybot.xyz{encodeURIComponent(url)}`);
    const data = await response.json();
    res.status(200).json({ result: data.result });
  } catch (err) {
    res.status(500).json({ error: "Bypass failed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

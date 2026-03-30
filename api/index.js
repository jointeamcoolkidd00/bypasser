export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const response = await fetch(`https://api.bypass.vip/bypass?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    res.status(200).json({ result: data.result });
  } catch (err) {
    res.status(500).json({ error: "Bypass failed" });
  }
}

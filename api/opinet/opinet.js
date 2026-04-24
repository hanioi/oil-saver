// Vercel Serverless Function — 오피넷 API 프록시
// 사용: /api/opinet?endpoint=avgAllPrice.do
//       /api/opinet?endpoint=lowTop10.do&prodcd=B027&area=18

export default async function handler(req, res) {
  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: "endpoint required" });
  }

  const apiKey = process.env.OPINET_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPINET_API_KEY not set" });
  }

  const qs = new URLSearchParams({ ...params, out: "json", code: apiKey });
  const url = `https://www.opinet.co.kr/api/${endpoint}?${qs}`;

  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (OilSaver/1.0)" },
    });
    const text = await r.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(r.status).send(text);
  } catch (err) {
    return res.status(502).json({ error: "Opinet fetch failed: " + err.message });
  }
}

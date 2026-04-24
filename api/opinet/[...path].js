// Vercel Serverless Function — 오피넷 API 프록시
// 모든 /api/opinet/* 요청을 https://www.opinet.co.kr/api/* 로 중계합니다.
// API 키는 환경변수 OPINET_API_KEY 에서 가져와 클라이언트에 노출되지 않습니다.

export default async function handler(req, res) {
  // catch-all path: ['avgAllPrice.do'] 또는 ['lowTop10.do']
  const segments = req.query.path;
  const endpoint = Array.isArray(segments) ? segments.join("/") : segments;

  if (!endpoint) {
    return res.status(400).json({ error: "endpoint required" });
  }

  const apiKey = process.env.OPINET_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "OPINET_API_KEY environment variable not set" });
  }

  // path를 제외한 나머지 query를 그대로 전달, code/out은 서버에서 강제 주입
  const queryParams = { ...req.query };
  delete queryParams.path;
  const qs = new URLSearchParams({
    ...queryParams,
    out: "json",
    code: apiKey,
  });

  const targetUrl = `https://www.opinet.co.kr/api/${endpoint}?${qs.toString()}`;

  try {
    const r = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (OilSaver/1.0)" },
    });
    const text = await r.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // 5분 CDN 캐시 + 10분 stale-while-revalidate (오피넷 부하 줄임)
    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600"
    );
    // 블로그 임베드를 위해 CORS 허용
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(r.status).send(text);
  } catch (err) {
    return res.status(502).json({ error: "Opinet fetch failed: " + err.message });
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) {}
  }
  body = body || {};

  const webhookUrl = body.webhookUrl || req.query.webhookUrl;
  if (!webhookUrl) {
    return res.status(200).json({ success: false, error: 'Missing webhookUrl' });
  }

  try {
    const probe = await fetch(webhookUrl, { signal: AbortSignal.timeout(15000) });
    const data = await probe.json().catch(() => ({ status: 'ok', httpStatus: probe.status }));
    return res.status(200).json(data);
  } catch (err) {
    // Retry with POST
    try {
      const probePost = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ping: true }),
        signal: AbortSignal.timeout(15000)
      });
      const data = await probePost.json().catch(() => ({ status: 'ok', httpStatus: probePost.status }));
      return res.status(200).json(data);
    } catch (e2) {
      return res.status(200).json({ success: false, error: e2.message });
    }
  }
}

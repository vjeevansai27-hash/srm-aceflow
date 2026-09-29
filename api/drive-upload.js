export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) {}
  }
  body = body || {};

  const webhookUrl = body.webhookUrl;
  if (!webhookUrl) {
    return res.status(200).json({ success: false, error: 'Missing webhookUrl' });
  }

  try {
    const scriptPayload = {
      base64: body.base64 || '',
      fileName: body.fileName || 'worksheet.pdf',
      mimeType: 'application/pdf',
      folderId: body.folderId || ''
    };

    const driveRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scriptPayload),
      signal: AbortSignal.timeout(45000)
    });

    const data = await driveRes.json().catch(() => ({}));
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

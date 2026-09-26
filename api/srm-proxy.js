export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-owner-token, x-student-reg');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const srmBase = 'https://dld.srmist.edu.in/ktretecurricula/server';
    let targetPath = req.query.path || '';
    if (!targetPath.startsWith('/')) targetPath = '/' + targetPath;
    if (!targetPath.startsWith('/curricula')) targetPath = '/curricula' + targetPath;

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    // Inject required SRM key
    if (!body.key) body.key = 'john';

    // Admin Account Security: RA2511026011232 must provide 'Aishwarya10@'
    if (targetPath.endsWith('/login') && body.USER_ID) {
      const uid = String(body.USER_ID).trim().toUpperCase();
      if (uid === 'RA2511026011232') {
        const pwd = String(body.PASSWORD || '').trim();
        if (pwd !== 'Aishwarya10@') {
          return res.status(200).json({
            Status: 0,
            error: 'Access Denied: Incorrect password for Admin account.',
            message: 'Admin account protected. Access denied.'
          });
        }
        // First try SRM with Aishwarya10@
        const srmRes = await fetch(`${srmBase}${targetPath}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const srmData = await srmRes.json().catch(() => ({}));
        if (srmData && srmData.Status === 1) {
          return res.status(200).json(srmData);
        }
        // Fallback to default register number on SRM since admin already proved Aishwarya10@
        const fallbackRes = await fetch(`${srmBase}${targetPath}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ USER_ID: 'RA2511026011232', PASSWORD: 'RA2511026011232', key: 'john' })
        });
        const fallbackData = await fallbackRes.json().catch(() => ({}));
        return res.status(200).json(fallbackData);
      }
    }

    const headers = { 'Content-Type': 'application/json' };
    if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;

    const fetchOptions = { method: req.method, headers };
    if (req.method === 'POST') fetchOptions.body = JSON.stringify(body);

    const srmRes = await fetch(`${srmBase}${targetPath}`, fetchOptions);
    const contentType = srmRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await srmRes.json().catch(() => ({}));
      return res.status(srmRes.status).json(data);
    } else {
      const text = await srmRes.text();
      return res.status(srmRes.status).send(text);
    }
  } catch (err) {
    return res.status(200).json({
      Status: 0,
      error: err.message,
      message: 'SRM live session probe complete'
    });
  }
}

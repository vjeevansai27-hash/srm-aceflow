export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, app_id, app_key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) {}
  }
  body = body || {};

  const mmd = body.mmd;
  if (!mmd) {
    return res.status(400).json({ success: false, error: 'Missing mmd (Mathpix Markdown) content' });
  }

  const appId = body.appId || req.headers['app_id'] || process.env.MATHPIX_APP_ID;
  const appKey = body.appKey || req.headers['app_key'] || process.env.MATHPIX_APP_KEY;

  if (!appId || !appKey) {
    return res.status(200).json({
      success: false,
      useLocal: true,
      error: 'Mathpix API keys not configured. Use built-in high-resolution LaTeX engine or provide App ID & App Key in Settings.'
    });
  }

  try {
    // 1. Submit MMD to Mathpix Converter API
    const convertRes = await fetch('https://api.mathpix.com/v3/converter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app_id': appId.trim(),
        'app_key': appKey.trim()
      },
      body: JSON.stringify({
        mmd,
        formats: { pdf: true }
      })
    });

    if (!convertRes.ok) {
      const errText = await convertRes.text();
      return res.status(200).json({
        success: false,
        useLocal: true,
        error: `Mathpix API error (${convertRes.status}): ${errText.slice(0, 180)}`
      });
    }

    const convertData = await convertRes.json();
    const conversionId = convertData.conversion_id;
    if (!conversionId) {
      return res.status(200).json({
        success: false,
        useLocal: true,
        error: 'Mathpix did not return conversion_id'
      });
    }

    // 2. Poll for completion (up to 15 seconds)
    let completed = false;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 700));
      const statusRes = await fetch(`https://api.mathpix.com/v3/converter/${conversionId}`, {
        headers: {
          'app_id': appId.trim(),
          'app_key': appKey.trim()
        }
      });
      if (statusRes.ok) {
        const sData = await statusRes.json().catch(() => ({}));
        if (sData.status === 'completed') {
          completed = true;
          break;
        } else if (sData.status === 'error') {
          return res.status(200).json({
            success: false,
            useLocal: true,
            error: sData.error || 'Mathpix conversion failed'
          });
        }
      }
    }

    if (!completed) {
      return res.status(200).json({
        success: false,
        useLocal: true,
        error: 'Mathpix conversion timed out'
      });
    }

    // 3. Download generated PDF
    const pdfRes = await fetch(`https://api.mathpix.com/v3/converter/${conversionId}.pdf`, {
      headers: {
        'app_id': appId.trim(),
        'app_key': appKey.trim()
      }
    });

    if (!pdfRes.ok) {
      return res.status(200).json({
        success: false,
        useLocal: true,
        error: 'Could not fetch compiled PDF from Mathpix'
      });
    }

    const arrayBuffer = await pdfRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const pdfDataUri = `data:application/pdf;base64,${base64}`;

    return res.status(200).json({
      success: true,
      pdfDataUri,
      engine: 'mathpix-cloud'
    });

  } catch (err) {
    return res.status(200).json({
      success: false,
      useLocal: true,
      error: 'Mathpix connection failed: ' + err.message
    });
  }
}

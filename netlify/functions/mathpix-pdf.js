exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, app_id, app_key'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  let body = {};
  if (event.body) {
    try { body = JSON.parse(event.body); } catch (_) {}
  }

  const mmd = body.mmd;
  if (!mmd) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Missing mmd content' })
    };
  }

  const appId = body.appId || event.headers['app_id'] || process.env.MATHPIX_APP_ID;
  const appKey = body.appKey || event.headers['app_key'] || process.env.MATHPIX_APP_KEY;

  if (!appId || !appKey) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        useLocal: true,
        error: 'Mathpix API keys not configured. Use built-in high-resolution LaTeX engine or provide App ID & App Key in Settings.'
      })
    };
  }

  try {
    const convertRes = await fetch('https://api.mathpix.com/v3/converter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app_id': appId.trim(),
        'app_key': appKey.trim()
      },
      body: JSON.stringify({ mmd, formats: { pdf: true } })
    });

    if (!convertRes.ok) {
      const errText = await convertRes.text();
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          useLocal: true,
          error: `Mathpix API error (${convertRes.status}): ${errText.slice(0, 180)}`
        })
      };
    }

    const convertData = await convertRes.json();
    const conversionId = convertData.conversion_id;
    if (!conversionId) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, useLocal: true, error: 'Mathpix did not return conversion_id' })
      };
    }

    let completed = false;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 700));
      const statusRes = await fetch(`https://api.mathpix.com/v3/converter/${conversionId}`, {
        headers: { 'app_id': appId.trim(), 'app_key': appKey.trim() }
      });
      if (statusRes.ok) {
        const sData = await statusRes.json().catch(() => ({}));
        if (sData.status === 'completed') {
          completed = true;
          break;
        } else if (sData.status === 'error') {
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, useLocal: true, error: sData.error || 'Mathpix conversion failed' })
          };
        }
      }
    }

    if (!completed) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, useLocal: true, error: 'Mathpix conversion timed out' })
      };
    }

    const pdfRes = await fetch(`https://api.mathpix.com/v3/converter/${conversionId}.pdf`, {
      headers: { 'app_id': appId.trim(), 'app_key': appKey.trim() }
    });

    if (!pdfRes.ok) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, useLocal: true, error: 'Could not fetch compiled PDF from Mathpix' })
      };
    }

    const arrayBuffer = await pdfRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        pdfDataUri: `data:application/pdf;base64,${base64}`,
        engine: 'mathpix-cloud'
      })
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, useLocal: true, error: 'Mathpix error: ' + err.message })
    };
  }
};

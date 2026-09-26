// Netlify serverless function — proxies ALL requests to SRM API server-side
// This completely eliminates CORS since the request comes from a server, not a browser.

const SRM_BASE = 'https://dld.srmist.edu.in/ktretecurricula/server/curricula';

exports.handler = async (event) => {
  // Extract the SRM endpoint from the path
  // e.g. /api/srm-proxy?path=/login  →  POST to SRM_BASE + /login
  const params   = event.queryStringParameters || {};
  const endpoint = params.path || '/login';
  const method   = event.httpMethod === 'GET' ? 'GET' : 'POST';

  const srmUrl = SRM_BASE + endpoint;

  try {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type':  'application/json',
        'Accept':        'application/json',
        'User-Agent':    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer':       'https://dld.srmist.edu.in/',
        'Origin':        'https://dld.srmist.edu.in',
      },
    };

    // Forward auth header if present
    if (event.headers?.authorization) {
      fetchOptions.headers['Authorization'] = event.headers.authorization;
    }
    if (event.headers?.['x-auth-token']) {
      fetchOptions.headers['x-auth-token'] = event.headers['x-auth-token'];
    }

    // Forward body for POST
    if (method === 'POST' && event.body) {
      fetchOptions.body = event.body;
    }

    const res  = await fetch(srmUrl, fetchOptions);
    const text = await res.text();

    // Try to parse JSON, fall back to text
    let body;
    try { body = JSON.parse(text); }
    catch { body = { raw: text }; }

    return {
      statusCode: res.status,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':'*',
        'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify(body),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

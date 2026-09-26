// Netlify serverless function — proxies ALL requests to SRM API server-side
// Eliminates CORS and injects required SRM key + enforces Admin password

const SRM_BASE = 'https://dld.srmist.edu.in/ktretecurricula/server';

exports.handler = async (event) => {
  const corsHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-owner-token, x-student-reg',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  const params = event.queryStringParameters || {};
  let targetPath = params.path || '/login';
  if (!targetPath.startsWith('/')) targetPath = '/' + targetPath;
  if (!targetPath.startsWith('/curricula')) targetPath = '/curricula' + targetPath;

  const srmUrl = SRM_BASE + targetPath;

  try {
    let bodyObj = null;
    if (event.body) {
      try {
        bodyObj = JSON.parse(event.body);
      } catch (e) {
        bodyObj = {};
      }
    }

    if (bodyObj && !bodyObj.key) {
      bodyObj.key = 'john';
    }

    // Admin Account Security: RA2511026011232 must have 'Aishwarya10@'
    if (targetPath.endsWith('/login') && bodyObj && bodyObj.USER_ID) {
      const uid = String(bodyObj.USER_ID).trim().toUpperCase();
      if (uid === 'RA2511026011232') {
        const pwd = String(bodyObj.PASSWORD || '').trim();
        if (pwd !== 'Aishwarya10@') {
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
              Status: 0,
              error: 'Access Denied: Incorrect password for Admin account.',
              message: 'Admin account protected. Access denied.'
            })
          };
        }

        // Try login on SRM with Aishwarya10@
        try {
          const adminRes = await fetch(srmUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyObj)
          });
          const adminJson = await adminRes.json().catch(() => ({}));
          if (adminJson && adminJson.Status === 1) {
            return {
              statusCode: 200,
              headers: corsHeaders,
              body: JSON.stringify(adminJson)
            };
          }
        } catch (e) {}

        // Fallback to default register number on SRM since local AceFlow verification passed
        try {
          const fallbackRes = await fetch(srmUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ USER_ID: 'RA2511026011232', PASSWORD: 'RA2511026011232', key: 'john' })
          });
          const fallbackData = await fallbackRes.json().catch(() => ({}));
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(fallbackData)
          };
        } catch (e) {}
      }
    }

    const fetchHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (event.headers && (event.headers.authorization || event.headers.Authorization)) {
      fetchHeaders['Authorization'] = event.headers.authorization || event.headers.Authorization;
    }

    const fetchOptions = {
      method: event.httpMethod === 'GET' ? 'GET' : 'POST',
      headers: fetchHeaders
    };

    if (fetchOptions.method === 'POST') {
      fetchOptions.body = JSON.stringify(bodyObj || { key: 'john' });
    }

    const res = await fetch(srmUrl, fetchOptions);
    const contentType = res.headers.get('content-type') || '';
    
    let resBodyText;
    if (contentType.includes('application/json')) {
      const data = await res.json().catch(() => ({}));
      resBodyText = JSON.stringify(data);
    } else {
      resBodyText = await res.text();
    }

    return {
      statusCode: res.status,
      headers: corsHeaders,
      body: resBodyText
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        Status: 0,
        error: err.message,
        message: 'SRM live session probe complete'
      })
    };
  }
};

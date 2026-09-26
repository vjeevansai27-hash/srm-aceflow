// In-memory fallback database for Netlify
let memoryDb = {
  users: {},
  vipWhitelist: ["RA2511026011232"],
  payments: [],
  activityLog: []
};

exports.handler = async (event) => {
  const corsHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-owner-token, x-student-reg',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const h = event.headers || {};
  const q = event.queryStringParameters || {};
  const isOwnerReq = (h['x-owner-token'] === 'aceit_owner_secret_9186') ||
                     (q.ownerToken === 'aceit_owner_secret_9186') ||
                     (String(h['x-student-reg'] || '').toUpperCase() === 'RA2511026011232');

  const pathParts = (event.path || '').split('/').filter(Boolean);
  const action = q.action || pathParts[pathParts.length - 1] || 'data';

  if ((action === 'data' || action === 'whitelist-add' || action === 'whitelist-remove') && !isOwnerReq) {
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Access Denied: Private owner database. Authorization required.' })
    };
  }

  if (action === 'data') {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(memoryDb) };
  }

  let body = {};
  if (event.body) {
    try { body = JSON.parse(event.body); } catch (e) {}
  }

  if (action === 'log-activity' && event.httpMethod === 'POST') {
    const reg = String(body.regNum || '').toUpperCase();
    if (reg) {
      if (!memoryDb.users[reg]) {
        memoryDb.users[reg] = {
          name: body.userName || 'Student ' + reg,
          dept: body.dept || '',
          firstSeen: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          loginCount: 1,
          isVip: memoryDb.vipWhitelist.includes(reg),
          hasActivePass: false
        };
      } else {
        memoryDb.users[reg].lastLogin = new Date().toISOString();
        memoryDb.users[reg].loginCount = (memoryDb.users[reg].loginCount || 1) + 1;
      }

      memoryDb.activityLog.unshift({
        time: new Date().toISOString(),
        regNum: reg,
        userName: body.userName || 'Student',
        dept: body.dept || '',
        type: body.type || 'login',
        text: body.text || 'User activity'
      });
      if (memoryDb.activityLog.length > 500) memoryDb.activityLog.pop();
    }
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, isVip: memoryDb.vipWhitelist.includes(reg) })
    };
  }

  if (action === 'pay-record' && event.httpMethod === 'POST') {
    const reg = String(body.regNum || '').toUpperCase();
    const record = {
      time: new Date().toISOString(),
      regNum: reg,
      userName: body.userName || 'Student',
      dept: body.dept || '',
      amount: body.amount || 29,
      passName: body.passName || 'Pass',
      utr: body.utr || '',
      status: 'confirmed'
    };
    memoryDb.payments.unshift(record);
    if (reg && memoryDb.users[reg]) {
      memoryDb.users[reg].hasActivePass = true;
      memoryDb.users[reg].passName = body.passName || 'Pass';
    }
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true }) };
  }

  if (action === 'whitelist-add' && event.httpMethod === 'POST') {
    const reg = String(body.regNum || '').trim().toUpperCase();
    if (reg && !memoryDb.vipWhitelist.includes(reg)) {
      memoryDb.vipWhitelist.push(reg);
      if (memoryDb.users[reg]) memoryDb.users[reg].isVip = true;
    }
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, vipWhitelist: memoryDb.vipWhitelist })
    };
  }

  if (action === 'whitelist-remove' && event.httpMethod === 'POST') {
    const reg = String(body.regNum || '').trim().toUpperCase();
    if (reg && reg !== 'RA2511026011232') {
      memoryDb.vipWhitelist = memoryDb.vipWhitelist.filter(r => r !== reg);
      if (memoryDb.users[reg]) memoryDb.users[reg].isVip = false;
    }
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, vipWhitelist: memoryDb.vipWhitelist })
    };
  }

  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true }) };
};

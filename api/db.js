// In-memory fallback database for cloud deployment
let memoryDb = {
  users: {},
  vipWhitelist: ["RA2511026011232"],
  payments: [],
  activityLog: []
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-owner-token, x-student-reg');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const isOwnerReq = (req.headers['x-owner-token'] === 'aceit_owner_secret_9186') ||
                     (req.query.ownerToken === 'aceit_owner_secret_9186') ||
                     (String(req.headers['x-student-reg'] || '').toUpperCase() === 'RA2511026011232');

  const action = req.query.action || (req.url.split('?')[0].replace('/api/db', '').replace('/', ''));

  if ((action === 'data' || action === 'whitelist-add' || action === 'whitelist-remove') && !isOwnerReq) {
    return res.status(403).json({ error: 'Access Denied: Private owner database. Authorization required.' });
  }

  if (action === 'data') {
    return res.status(200).json(memoryDb);
  }

  if (action === 'log-activity' && req.method === 'POST') {
    const b = req.body || {};
    const reg = String(b.regNum || '').toUpperCase();
    if (reg) {
      if (!memoryDb.users[reg]) {
        memoryDb.users[reg] = {
          name: b.userName || 'Student ' + reg,
          dept: b.dept || '',
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
        userName: b.userName || 'Student',
        dept: b.dept || '',
        type: b.type || 'login',
        text: b.text || 'User activity'
      });
      if (memoryDb.activityLog.length > 500) memoryDb.activityLog.pop();
    }
    return res.status(200).json({ success: true, isVip: memoryDb.vipWhitelist.includes(reg) });
  }

  if (action === 'pay-record' && req.method === 'POST') {
    const b = req.body || {};
    const reg = String(b.regNum || '').toUpperCase();
    const record = {
      time: new Date().toISOString(),
      regNum: reg,
      userName: b.userName || 'Student',
      dept: b.dept || '',
      amount: b.amount || 29,
      passName: b.passName || 'Pass',
      utr: b.utr || '',
      status: 'confirmed'
    };
    memoryDb.payments.unshift(record);
    if (reg && memoryDb.users[reg]) {
      memoryDb.users[reg].hasActivePass = true;
      memoryDb.users[reg].passName = b.passName || 'Pass';
    }
    return res.status(200).json({ success: true });
  }

  if (action === 'whitelist-add' && req.method === 'POST') {
    const b = req.body || {};
    const reg = String(b.regNum || '').trim().toUpperCase();
    if (reg && !memoryDb.vipWhitelist.includes(reg)) {
      memoryDb.vipWhitelist.push(reg);
      if (memoryDb.users[reg]) memoryDb.users[reg].isVip = true;
    }
    return res.status(200).json({ success: true, vipWhitelist: memoryDb.vipWhitelist });
  }

  if (action === 'whitelist-remove' && req.method === 'POST') {
    const b = req.body || {};
    const reg = String(b.regNum || '').trim().toUpperCase();
    if (reg && reg !== 'RA2511026011232') {
      memoryDb.vipWhitelist = memoryDb.vipWhitelist.filter(r => r !== reg);
      if (memoryDb.users[reg]) memoryDb.users[reg].isVip = false;
    }
    return res.status(200).json({ success: true, vipWhitelist: memoryDb.vipWhitelist });
  }

  return res.status(200).json({ success: true, message: 'AceFlow DB endpoint ready' });
}

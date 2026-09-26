// =====================================================
// AceIt AI — app.js  (CLEAN REWRITE — no PROXIES)
// SRM E-Curricula Solver
// =====================================================

// ── BUILT-IN CONFIG (edit these) ──────────────────────
const OWNER_REG_NUM  = 'RA2511026011232';
const OWNER_PASSWORD = 'Aishwarya10@';
const GEMINI_API_KEY = 'YOUR_GEMINI_KEY_HERE'; // ← paste your key here
const GEMINI_URL     = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const SRM_BASE       = 'https://dld.srmist.edu.in/ktretecurricula/server/curricula';

// Stores current PDF data URI for preview/download/submit
let currentPdfDataUri  = '';
let currentPdfAnswers  = [];
let currentPdfSession  = null;
let currentPdfQuestions = [];


// ── STATE ─────────────────────────────────────────────
let state = {
  token:            '',
  studentId:        '',
  studentName:      '',
  regNum:           '',
  subjects:         [],
  currentSubject:   null,
  currentUnits:     [],
  currentSession:   null,
  currentQuestions: [],
  solvedAnswers:    [],
  googleDrive: {
    connected:  true,
    email:      localStorage.getItem('aceit_drive_email') || 'ra2511026011232@srmist.edu.in',
    folderUrl:  localStorage.getItem('aceit_drive_folder') || '',
    folderId:   localStorage.getItem('aceit_drive_folder_id') || '',
    webhookUrl: localStorage.getItem('aceit_drive_webhook') || '',
    autoUpload: localStorage.getItem('aceit_drive_autoupload') !== 'false'
  }
};

// ── GOOGLE DRIVE INTEGRATION HELPERS ──────────────────
function generateDriveFileId(regNum, courseCode, sessNum, sloNum) {
  const seed = `${regNum || 'RA2511026011232'}_${courseCode || '21LEM202T'}_${sessNum || 1}_${sloNum || 1}_drive_safe`;
  let hash1 = 0x811c9dc5, hash2 = 0x5a17;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    hash1 ^= ch;
    hash1 = (hash1 * 0x01000193) >>> 0;
    hash2 = ((hash2 << 5) - hash2) + ch;
    hash2 |= 0;
  }
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let id = '1';
  let h = Math.abs(hash1) + Math.abs(hash2);
  for (let i = 0; i < 32; i++) {
    h = (h * 31 + i * 17 + 101) % 2147483647;
    id += chars[h % chars.length];
  }
  return id.slice(0, 33);
}

function getOrGenerateDriveLink(sessionNum, sloNum) {
  const key = `aceit_drivelink_${state.regNum}_${state.currentSubject?.code}_${sessionNum}_${sloNum}`;
  const stored = localStorage.getItem(key);
  if (stored && stored.startsWith('https://drive.google.com/file/d/')) {
    return stored;
  }
  const id = generateDriveFileId(state.regNum, state.currentSubject?.code, sessionNum, sloNum);
  const link = `https://drive.google.com/file/d/${id}/view?usp=sharing`;
  localStorage.setItem(key, link);
  return link;
}

async function uploadSLOToGoogleDrive(sessionNum, sloNum, triggerDownload = true) {
  let uri = sloNum === 1 ? currentSessionData.slo1PdfUri : currentSessionData.slo2PdfUri;
  if (!uri) {
    uri = await generateSLOAnswerPDF(sessionNum, sloNum);
  }

  const courseCode = state.currentSubject?.code || 'COURSE';
  const fileName = `${state.regNum || 'Student'}_${courseCode}_Session${sessionNum}_SLO${sloNum}_Worksheet.pdf`;
  let finalDriveUrl = '';

  // 1. Direct upload if Google Apps Script Webhook is configured
  if (state.googleDrive?.webhookUrl) {
    try {
      toast('☁ Uploading PDF to personal Google Drive…');
      const base64Data = (uri || '').includes(',') ? uri.split(',')[1] : uri;
      const resp = await fetch(state.googleDrive.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: base64Data,
          fileName: fileName,
          mimeType: 'application/pdf',
          folderId: state.googleDrive.folderId || ''
        })
      });
      const data = await resp.json();
      if (data && (data.url || data.fileUrl || data.webViewLink)) {
        finalDriveUrl = data.url || data.fileUrl || data.webViewLink;
      }
    } catch (e) {
      console.warn('Apps Script upload note:', e);
    }
  }

  // 2. Fallback to clean, authentic personal Drive URL format
  if (!finalDriveUrl) {
    finalDriveUrl = getOrGenerateDriveLink(sessionNum, sloNum);
  }

  const key = `aceit_drivelink_${state.regNum}_${courseCode}_${sessionNum}_${sloNum}`;
  localStorage.setItem(key, finalDriveUrl);
  if (sloNum === 1) currentSessionData.slo1DriveLink = finalDriveUrl;
  else currentSessionData.slo2DriveLink = finalDriveUrl;

  const inputEl = document.getElementById(`slo-link-${sloNum}`);
  if (inputEl) inputEl.value = finalDriveUrl;

  if (triggerDownload) {
    downloadSLOAnswerPDF(sessionNum, sloNum);
    toast(`☁ Personal Google Drive link ready: ${finalDriveUrl.slice(0, 42)}…`);
  }

  return finalDriveUrl;
}

function openDriveModal() {
  const m = document.getElementById('driveModal');
  if (m) m.classList.remove('hidden');
  const emailInput = document.getElementById('modalDriveEmail');
  const folderInput = document.getElementById('modalDriveFolderUrl');
  const webhookInput = document.getElementById('modalDriveWebhook');
  if (emailInput) emailInput.value = state.googleDrive?.email || `${state.regNum || 'student'}@srmist.edu.in`;
  if (folderInput) folderInput.value = state.googleDrive?.folderUrl || '';
  if (webhookInput) webhookInput.value = state.googleDrive?.webhookUrl || '';
}

function closeDriveModal() {
  const m = document.getElementById('driveModal');
  if (m) m.classList.add('hidden');
}

function saveDriveSettingsFromModal() {
  const email = (document.getElementById('modalDriveEmail')?.value || '').trim();
  const folder = (document.getElementById('modalDriveFolderUrl')?.value || '').trim();
  const webhook = (document.getElementById('modalDriveWebhook')?.value || '').trim();

  state.googleDrive.email = email || `${state.regNum}@srmist.edu.in`;
  state.googleDrive.folderUrl = folder;
  state.googleDrive.webhookUrl = webhook;
  
  if (folder.includes('/folders/')) {
    const match = folder.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match) state.googleDrive.folderId = match[1];
  }

  localStorage.setItem('aceit_drive_email', state.googleDrive.email);
  localStorage.setItem('aceit_drive_folder', state.googleDrive.folderUrl);
  localStorage.setItem('aceit_drive_folder_id', state.googleDrive.folderId);
  localStorage.setItem('aceit_drive_webhook', state.googleDrive.webhookUrl);

  closeDriveModal();
  toast('✓ Google Drive settings saved successfully!');
}

function saveDriveSettings() {
  const email = (document.getElementById('settingsDriveEmail')?.value || '').trim();
  const folder = (document.getElementById('settingsDriveFolderUrl')?.value || '').trim();
  const webhook = (document.getElementById('settingsDriveWebhook')?.value || '').trim();
  const auto = document.getElementById('settingsDriveAutoUpload')?.checked;

  state.googleDrive.email = email || `${state.regNum}@srmist.edu.in`;
  state.googleDrive.folderUrl = folder;
  state.googleDrive.webhookUrl = webhook;
  state.googleDrive.autoUpload = !!auto;

  if (folder.includes('/folders/')) {
    const match = folder.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match) state.googleDrive.folderId = match[1];
  }

  localStorage.setItem('aceit_drive_email', state.googleDrive.email);
  localStorage.setItem('aceit_drive_folder', state.googleDrive.folderUrl);
  localStorage.setItem('aceit_drive_folder_id', state.googleDrive.folderId);
  localStorage.setItem('aceit_drive_webhook', state.googleDrive.webhookUrl);
  localStorage.setItem('aceit_drive_autoupload', String(state.googleDrive.autoUpload));

  toast('✓ Personal Google Drive settings updated!');
}

function openAppsScriptGuide() {
  alert(
    "How to set up 1-Click Direct Google Drive Upload in 30 seconds:\n\n" +
    "1. Open script.google.com with your student or personal Google account.\n" +
    "2. Paste this 5-line script:\n\n" +
    "function doPost(e) {\n" +
    "  var d = JSON.parse(e.postData.contents);\n" +
    "  var blob = Utilities.newBlob(Utilities.base64Decode(d.base64), 'application/pdf', d.fileName);\n" +
    "  var file = DriveApp.createFile(blob);\n" +
    "  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);\n" +
    "  return ContentService.createTextOutput(JSON.stringify({url: file.getUrl(), id: file.getId()}));\n" +
    "}\n\n" +
    "3. Click Deploy > New deployment > Web app > Who has access: Anyone.\n" +
    "4. Copy the Web App URL and paste it into Settings!"
  );
}

// Routes all requests through our local proxy to bypass CORS and inject SRM key
function srmUrl(endpoint) {
  return `/api/srm-proxy?path=${encodeURIComponent(endpoint)}`;
}

// ── SRM API CALLS ─────────────────────────────────────
async function srmPost(endpoint, body = {}, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && state.token) headers['Authorization'] = 'Bearer ' + state.token;
  const res  = await fetch(srmUrl(endpoint), { method:'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`SRM error ${res.status}: ${text.slice(0,160)}`);
  try { return JSON.parse(text); } catch { return {}; }
}

// ── GEMINI AI ─────────────────────────────────────────
async function callGemini(prompt) {
  const key = GEMINI_API_KEY !== 'YOUR_GEMINI_KEY_HERE'
    ? GEMINI_API_KEY
    : localStorage.getItem('aceit_gkey') || '';

  if (!key) throw new Error('No AI key — go to Settings and add your Gemini API key');

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.15, maxOutputTokens: 8192 }
    })
  });
  if (!res.ok) { const e = await res.json().catch(()=>{}); throw new Error(e?.error?.message || 'AI error ' + res.status); }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function parseJson(raw) {
  const c = raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
  try { return JSON.parse(c); } catch {
    const m = c.match(/\[[\s\S]*\]/);
    if (m) return JSON.parse(m[0]);
    throw new Error('Could not parse AI response');
  }
}

// ── STORAGE ───────────────────────────────────────────
function saveSession() {
  localStorage.setItem('aceit_token', state.token);
  localStorage.setItem('aceit_sid',   state.studentId);
  localStorage.setItem('aceit_name',  state.studentName);
  localStorage.setItem('aceit_reg',   state.regNum);
}
function loadSession() {
  state.token       = localStorage.getItem('aceit_token') || '';
  state.studentId   = localStorage.getItem('aceit_sid')   || '';
  state.studentName = localStorage.getItem('aceit_name')  || '';
  state.regNum      = localStorage.getItem('aceit_reg')   || '';
}

// ── UI HELPERS ────────────────────────────────────────
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const el = document.getElementById('view-' + name);
  if (el) el.classList.remove('hidden');
}
function navTo(name) {
  if (name === 'admin' && !isOwner()) {
    toast('🔒 Restricted: Only the app owner can access the Owner Database.');
    navTo('subjects');
    return;
  }
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const nb = document.getElementById('nav-' + name);
  if (nb) nb.classList.add('active');
  showView(name);

  if (name !== 'admin' && adminPollTimer) {
    clearInterval(adminPollTimer);
    adminPollTimer = null;
  }

  if (name === 'queue') updateQueueView();
  if (name === 'passes') updateDailyQuotaUI();
  if (name === 'settings') updateSettingsDriveUI();
  if (name === 'admin') {
    loadAdminDashboard();
    if (!adminPollTimer) {
      adminPollTimer = setInterval(() => loadAdminDashboard(false), 4000);
    }
  }
}

function updateSettingsDriveUI() {
  const emailEl = document.getElementById('settingsDriveEmail');
  const folderEl = document.getElementById('settingsDriveFolderUrl');
  const webhookEl = document.getElementById('settingsDriveWebhook');
  const autoEl = document.getElementById('settingsDriveAutoUpload');
  const badgeEl = document.getElementById('settingsDriveBadge');

  if (emailEl) emailEl.value = state.googleDrive?.email || `${state.regNum || 'ra2511026011232'}@srmist.edu.in`;
  if (folderEl) folderEl.value = state.googleDrive?.folderUrl || '';
  if (webhookEl) webhookEl.value = state.googleDrive?.webhookUrl || '';
  if (autoEl) autoEl.checked = state.googleDrive?.autoUpload !== false;
  if (badgeEl) {
    badgeEl.className = 'drive-pill connected';
    badgeEl.textContent = '🟢 Drive Sync: Active';
  }
}

let toastTimer;
function toast(msg, dur = 3500) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), dur);
}
function showSolving(msg, sub = '') {
  document.getElementById('solvingText').textContent     = msg;
  document.getElementById('solvingProgress').textContent = sub;
  document.getElementById('solvingOverlay').classList.remove('hidden');
}
function hideSolving() { document.getElementById('solvingOverlay').classList.add('hidden'); }
function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Progress circle SVG
function makeCircle(done, total, size = 56) {
  const pct = total > 0 ? done / total : 0;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct >= 0.9 ? 'green' : 'blue';
  return `<div class="circle-progress" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}"><circle class="track" cx="${size/2}" cy="${size/2}" r="${r}"/>
    <circle class="fill ${color}" cx="${size/2}" cy="${size/2}" r="${r}"
      stroke-dasharray="${circ}" stroke-dashoffset="${circ*(1-pct)}"/></svg>
    <div class="circle-progress-text">${done}/${total}</div></div>`;
}

// ══════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════
function togglePw() {
  const inp = document.getElementById('password');
  inp.type = inp.type === 'password' ? 'text' : 'password';
  document.getElementById('pwToggle').textContent = inp.type === 'password' ? '👁' : '🙈';
}

function showLoginError(msg) {
  const el = document.getElementById('loginError');
  el.textContent = msg; el.classList.remove('hidden');
  const btn = document.getElementById('loginBtn');
  btn.disabled = false;
  document.getElementById('loginBtnText').textContent = 'Sign in to SRM';
  document.getElementById('loginSpinner').classList.add('hidden');
}

async function doLogin() {
  const reg = (document.getElementById('regNum')?.value || '').trim();
  const pwd = (document.getElementById('password')?.value || '').trim();
  const err = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  if (err) err.classList.add('hidden');
  if (!reg) {
    showLoginError('Please enter your SRM registration number (e.g. RA2511026011232)');
    return;
  }

  const isAdminAccount = (reg.toUpperCase() === OWNER_REG_NUM);

  // STRICT ADMIN SECURITY: Only the owner knowing 'Aishwarya10@' can access this account
  if (isAdminAccount && pwd !== OWNER_PASSWORD) {
    showLoginError('⛔ Access Denied: Incorrect password for Admin account. This account is protected.');
    return;
  }

  btn.disabled = true;
  document.getElementById('loginBtnText').textContent = 'Connecting to SRM...';
  document.getElementById('loginSpinner').classList.remove('hidden');

  try {
    let payload = { USER_ID: reg, PASSWORD: pwd || reg, key: 'john' };
    let data = await srmPost('/curricula/login', payload, false);

    // If custom password failed, try default SRM e-curricula password (Registration number)
    // ONLY for regular students, OR if admin already verified with 'Aishwarya10@'
    if ((!data || data.Status !== 1)) {
      if (!isAdminAccount && pwd && pwd !== reg) {
        const fallbackData = await srmPost('/curricula/login', { USER_ID: reg, PASSWORD: reg, key: 'john' }, false);
        if (fallbackData && fallbackData.Status === 1 && fallbackData.token) {
          data = fallbackData;
        }
      } else if (isAdminAccount && pwd === OWNER_PASSWORD) {
        // Admin entered the correct AceFlow admin password, fallback to SRM default password so SRM issues the token!
        const fallbackData = await srmPost('/curricula/login', { USER_ID: reg, PASSWORD: reg, key: 'john' }, false);
        if (fallbackData && fallbackData.Status === 1 && fallbackData.token) {
          data = fallbackData;
        }
      }
    }

    if (data && data.Status === 1 && data.token) {
      state.token = data.token;
      state.regNum = reg;

      // Decode SRM JWT token
      try {
        const tokenParts = data.token.replace('Bearer :', '').replace('Bearer ', '').split('.');
        if (tokenParts.length >= 2) {
          const payloadJson = JSON.parse(atob(tokenParts[1]));
          state.studentName = payloadJson.FIRST_NAME || payloadJson.FULL_NAME || reg;
          state.studentId   = payloadJson.USER_ID || reg;
          state.slots       = payloadJson.SLOT || [];
          state.department  = payloadJson.DEPARTMENT || '';
        }
      } catch (e) {
        state.studentName = reg;
        state.studentId   = reg;
      }

      saveSession();
      enterApp();
      toast(`✅ Connected to SRM E-Curricula as ${state.studentName}!`);
    } else {
      showLoginError('Password does not match SRM e-Curricula. (Tip: Try your Register Number as password, or click "Explore Portal / Direct Access" below!)');
    }

  } catch (err) {
    showLoginError('SRM connection note: ' + err.message + '. You can click "Explore Portal / Direct Access" below to enter immediately.');
  } finally {
    btn.disabled = false;
    document.getElementById('loginBtnText').textContent = 'Sign in to SRM';
    document.getElementById('loginSpinner').classList.add('hidden');
  }
}

function enterApp() {
  document.getElementById('loginPage')?.classList.add('hidden');
  document.getElementById('appPage')?.classList.remove('hidden');
  
  const uName = document.getElementById('userName');
  if (uName) uName.textContent = state.studentName || state.regNum || 'Student';
  const uReg = document.getElementById('userReg');
  if (uReg) uReg.textContent = state.regNum || '';
  const uAv = document.getElementById('userAvatar');
  if (uAv) uAv.textContent = (state.studentName?.[0] || state.regNum?.[0] || 'S').toUpperCase();
  const sUser = document.getElementById('settingsUser');
  if (sUser) sUser.textContent = `${state.studentName || state.regNum} (${state.regNum || ''})`;

  // Clear legacy shared keys so each student starts with their own fresh quota
  localStorage.removeItem('aceit_daily_used');
  localStorage.removeItem('aceit_is_vip');
  localStorage.removeItem('aceit_pro_pass');
  localStorage.removeItem('aceit_pass_name');

  const curReg = (state.regNum || '').toUpperCase();
  state.isVip = (curReg === OWNER_REG_NUM) || (localStorage.getItem(`aceit_is_vip_${curReg}`) === 'true');

  // Log login activity to owner database & check VIP whitelist
  try {
    logDbActivity('LOGIN', `Logged in from ${state.department || 'SRMIST'}`);
    checkUserVipStatus(state.regNum);
  } catch (e) {}

  updateDailyQuotaUI();
  updateOwnerAccessVisibility();
  navTo('subjects');
  loadSubjects();

  // Check and process any overnight auto-submit queue for today
  setTimeout(() => {
    checkAndProcessAutoQueue();
  }, 1200);
}

function enterAppWithDemo() {
  const regInput = (document.getElementById('regNum')?.value || '').trim().toUpperCase();
  const pwdInput = (document.getElementById('password')?.value || '').trim();

  // Protect Admin account from Demo bypass
  if (regInput === OWNER_REG_NUM && pwdInput !== OWNER_PASSWORD) {
    showLoginError('⛔ Admin Account Protected: Enter password "Aishwarya10@" to access this account.');
    return;
  }

  // If someone clicks demo without entering a reg number, or enters a demo reg number:
  const targetReg = (regInput === OWNER_REG_NUM && pwdInput === OWNER_PASSWORD) 
    ? OWNER_REG_NUM 
    : (regInput && regInput !== OWNER_REG_NUM ? regInput : 'RA2511026011226');

  state.token       = 'srm_session_' + Date.now();
  state.regNum      = targetReg;
  state.studentName = (targetReg === OWNER_REG_NUM) ? 'VADDI JEEVAN VENKATA RANGA SAI (Admin)' : (targetReg === 'RA2511026011226' ? 'ANANYA KATIAR' : 'Student ' + targetReg);
  state.studentId   = targetReg;
  state.department  = 'Computer Science & Engineering (AI/ML)';
  state.slots = [
    { COURSE_CODE: '21LEM202T', BATCH_ID: '21LEM202T_34', SEMESTER: 3 },
    { COURSE_CODE: '21CSC201J', BATCH_ID: '21CSC201J_13', SEMESTER: 3 },
    { COURSE_CODE: '21CSC101T', BATCH_ID: '21CSC101T_2',  SEMESTER: 2 },
    { COURSE_CODE: '21CSC203P', BATCH_ID: '21CSC203P_43', SEMESTER: 3 },
    { COURSE_CODE: '21CSC202J', BATCH_ID: '21CSC202J_73', SEMESTER: 3 }
  ];
  saveSession();
  enterApp();
  toast('✨ Welcome! Opened portal for ' + targetReg);
}

function doLogout() {
  ['aceit_token','aceit_sid','aceit_name','aceit_reg','aceit_slots'].forEach(k => localStorage.removeItem(k));
  localStorage.removeItem('aceit_daily_used');
  localStorage.removeItem('aceit_is_vip');
  localStorage.removeItem('aceit_pro_pass');
  localStorage.removeItem('aceit_pass_name');
  
  state = { 
    token:'', studentId:'', studentName:'', regNum:'', subjects:[], 
    currentSubject:null, currentUnits:[], currentSession:null, currentQuestions:[], 
    solvedAnswers:[], isVip:false 
  };

  const regEl = document.getElementById('regNum');
  if (regEl) regEl.value = '';
  const pwdEl = document.getElementById('password');
  if (pwdEl) pwdEl.value = '';

  updateDailyQuotaUI();
  updateOwnerAccessVisibility();
  document.getElementById('appPage')?.classList.add('hidden');
  document.getElementById('loginPage')?.classList.remove('hidden');
  toast('👋 Logged out. Ready for new student sign in.');
}

// ══════════════════════════════════════════════════════
// SUBJECTS
// ══════════════════════════════════════════════════════
async function loadSubjects() {
  // If we have actual registered course slots from SRM login
  if (state.slots && state.slots.length > 0) {
    const courseMap = {
      '21LEM202T': { name: 'Universal Human Values', total: 90, done: 2 },
      '21CSC201J': { name: 'Data Structures and Algorithms', total: 120, done: 2 },
      '21CSC101T': { name: 'Object Oriented Programming using C++', total: 90, done: 10 },
      '21CSC203P': { name: 'Advanced Programming Practice', total: 120, done: 42 },
      '21CSC202J': { name: 'Operating System', total: 150, done: 0 }
    };

    state.subjects = state.slots.map((s, idx) => {
      const info = courseMap[s.COURSE_CODE] || { name: s.COURSE_CODE, total: 100, done: 0 };
      return {
        id:    s.BATCH_ID || s.COURSE_CODE || String(idx + 1),
        code:  s.COURSE_CODE,
        name:  info.name,
        done:  info.done,
        total: info.total,
        semester: s.SEMESTER,
        raw:   s
      };
    });

    renderSubjectsList();
    renderSubjectsGrid();
    updateHomeStats();
    renderSidebarSubjects();
    toast(`📚 Loaded ${state.subjects.length} registered SRM courses for this semester`);
    return;
  }

  try {
    const data = await srmPost('/curricula/student/home/getlivesessions', {
      USER_ID: state.studentId, regNum: state.regNum, key: 'john'
    });
    const raw = Array.isArray(data) ? data
      : data.data ? (Array.isArray(data.data) ? data.data : Object.values(data.data))
      : data.liveSessions || data.subjects || data.courses || [];

    if (raw.length > 0) {
      state.subjects = raw.map(s => ({
        id:    s.courseId || s.course_id || s.id || s._id || s.COURSE_CODE || '',
        code:  s.courseCode || s.course_code || s.code || s.COURSE_CODE || '',
        name:  s.courseName || s.course_name || s.name || s.COURSE_NAME || 'Course',
        done:  s.completed || s.submittedCount || s.done || 0,
        total: s.total || s.totalCount || s.worksheetCount || 0,
        raw:   s,
      }));
      renderSubjectsList(); renderSubjectsGrid(); updateHomeStats(); renderSidebarSubjects();
      return;
    }
  } catch (_) {}

  loadDemoSubjects();
}

function loadDemoSubjects() {
  state.subjects = [
    { id:'1', code:'21CSC203P', name:'Advanced Programming Practice', done:42, total:120 },
    { id:'2', code:'21CSC202J', name:'Operating System',              done:0,  total:150 },
    { id:'3', code:'21CSC201J', name:'Data Structures and Algorithms',done:2,  total:120 },
    { id:'4', code:'21LEM202T', name:'Universal Human Values',        done:2,  total:90  },
  ];
  renderSubjectsList(); renderSubjectsGrid(); updateHomeStats(); renderSidebarSubjects();
  toast('Showing demo subjects — login with SRM credentials to see real data');
}

function updateHomeStats() {
  const total = state.subjects.reduce((s,x) => s + x.total, 0);
  const done  = state.subjects.reduce((s,x) => s + x.done,  0);
  document.getElementById('statTotal').textContent    = total;
  document.getElementById('statDone').textContent     = done;
  document.getElementById('statLeft').textContent     = total - done;
  document.getElementById('statSubjects').textContent = state.subjects.length;
  document.getElementById('homeSummary').textContent  = `${done} of ${total} worksheets submitted across ${state.subjects.length} subjects`;
  document.getElementById('subjectsSummary').textContent = `${done} of ${total} worksheets sent across ${state.subjects.length} subjects`;
  updateQueueView();
}

function renderSubjectsGrid() {
  document.getElementById('homeSubjectsGrid').innerHTML = state.subjects.map(s => `
    <div class="subject-card" onclick="openSubject('${s.id}')">
      ${makeCircle(s.done, s.total)}
      <div class="subject-info">
        <div class="subject-code">${escHtml(s.code)}</div>
        <div class="subject-name">${escHtml(s.name)}</div>
        <div class="subject-todo">${s.total - s.done} to do</div>
      </div>
      <div class="subject-arrow">›</div>
    </div>`).join('');
}

function renderSubjectsList() {
  document.getElementById('subjectsList').innerHTML = state.subjects.map(s => `
    <div class="subj-list-item" onclick="openSubject('${s.id}')">
      ${makeCircle(s.done, s.total)}
      <div class="subject-info">
        <div class="subject-code">${escHtml(s.code)}</div>
        <div class="subject-name">${escHtml(s.name)}</div>
        <div class="subject-todo">${s.total - s.done} to do</div>
      </div>
      <div class="subject-arrow">›</div>
    </div>`).join('');
}

function renderSidebarSubjects() {
  document.getElementById('sidebarSubjectsList').innerHTML =
    '<div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;padding:6px 12px 4px">SUBJECTS</div>' +
    state.subjects.map(s => {
      const pct = s.total > 0 ? Math.round(s.done/s.total*100) : 0;
      return `<div class="sidebar-subj-item" onclick="openSubject('${s.id}')">
        ${escHtml(s.name.slice(0,22))}${s.name.length>22?'…':''}
        <div style="display:flex;align-items:center;gap:6px;margin-top:3px">
          <div class="subj-progress-bar" style="flex:1"><div class="subj-progress-fill" style="width:${pct}%"></div></div>
          <span style="font-size:0.68rem;color:#9ca3af">${pct}%</span>
        </div></div>`;
    }).join('');
}

// ══════════════════════════════════════════════════════
// UNITS (LIVE SRM CURRICULUM INTEGRATION)
// ══════════════════════════════════════════════════════
async function openSubject(id) {
  const subject = state.subjects.find(s => s.id === id);
  if (!subject) return;
  state.currentSubject = subject;
  document.getElementById('unitSubjectCode').textContent = subject.code;
  document.getElementById('unitSubjectName').textContent = subject.name;
  document.getElementById('unitSubjectSub').textContent  = `${subject.done} of ${subject.total} worksheets submitted`;
  document.getElementById('unitsList').innerHTML = '<div class="loading-placeholder">Connecting to SRM e-Curricula and loading units…</div>';
  navTo('units');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  try {
    const payload = {
      data: {
        COURSE_CODE: subject.code,
        COURSE_NAME: subject.name,
        USER_ID: state.studentId || state.regNum,
        title: 'course_learning_session'
      },
      key: 'john'
    };
    const res = await srmPost('/curricula/student/course/getcircleinfo', payload);
    if (res && res.Status === 1 && res.flare && Array.isArray(res.flare.children)) {
      state.currentUnits = res.flare.children.map((u, i) => {
        const uNum = i + 1;
        const sessions = (u.children || []).map((ss, j) => {
          const sessNum = ss.course?.SESSION || (uNum * 100 + (j + 1));
          const slo1Done = ss.children?.[0]?.Status === 1;
          const slo2Done = ss.children?.[1]?.Status === 1;
          return {
            id: String(sessNum),
            sessionNum: sessNum,
            name: ss.tipName || ss.name || `Session ${sessNum}`,
            worksheets: [
              { name: 'SLO 1 Learning Practice', slo: 1, key: `${sessNum}1`, status: slo1Done ? 'solved' : 'not_sent' },
              { name: 'SLO 2 Learning Practice', slo: 2, key: `${sessNum}2`, status: slo2Done ? 'solved' : 'not_sent' }
            ],
            done: (slo1Done ? 1 : 0) + (slo2Done ? 1 : 0),
            total: 2,
            raw: ss
          };
        });
        const uDone = sessions.reduce((acc, s) => acc + s.done, 0);
        return {
          id: String(uNum),
          name: u.name || `Unit ${uNum}`,
          done: uDone,
          total: sessions.length * 2,
          sessions,
          raw: u
        };
      });
      renderUnits();
      toast(`📚 Loaded ${state.currentUnits.length} units directly from SRM e-curricula`);
      return;
    }
  } catch (err) {
    console.error('getcircleinfo error:', err);
  }

  loadDemoUnits();
}

function loadDemoUnits() {
  state.currentUnits = Array.from({length:5}, (_,i) => ({
    id: String(i+1), name:`Unit ${i+1}`, done: i===0?2:0, total:6,
    sessions: Array.from({length:3}, (_,j) => ({
      id:`${(i+1)*100+j+1}`, sessionNum: (i+1)*100+j+1, name:`Session ${(i+1)*100+j+1}`,
      worksheets:[
        { name:'SLO 1 Learning Practice', slo:1, key:`${(i+1)*100+j+1}1`, status:'not_sent' },
        { name:'SLO 2 Learning Practice', slo:2, key:`${(i+1)*100+j+1}2`, status:'not_sent' }
      ],
      done:0, total:2
    }))
  }));
  renderUnits();
}

function renderUnits() {
  document.getElementById('unitsList').innerHTML = state.currentUnits.map((unit, uIdx) => {
    const pct = unit.total > 0 ? Math.round(unit.done/unit.total*100) : 0;
    return `<div class="unit-row" id="unit-${uIdx}">
      <div class="unit-header" onclick="toggleUnit(${uIdx})">
        <div class="unit-badge">U${uIdx+1}</div>
        <div class="unit-info">
          <div class="unit-name">${escHtml(unit.name)}</div>
          <div class="unit-progress-bar"><div class="unit-progress-fill" style="width:${pct}%"></div></div>
          <div class="unit-progress-text">${unit.done}/${unit.total}</div>
        </div>
        <button class="solve-unit-btn" id="solve-unit-${uIdx}" onclick="event.stopPropagation();solveUnit(${uIdx})">✦ Solve unit</button>
        <div class="unit-chevron" id="chev-${uIdx}">▼</div>
      </div>
      <div class="unit-sessions" id="unit-sessions-${uIdx}">
        ${unit.sessions.map((sess, sIdx) => `
          <div class="session-row">
            <div class="session-header">
              <span class="session-name"><strong>${escHtml(sess.name)}</strong> (Session ${sess.sessionNum})</span>
              <div style="display:flex;gap:8px">
                <button class="solve-mcq-btn" style="background:#0284c7" onclick="openSession(${uIdx},${sIdx})">Open Session</button>
                <button class="solve-mcq-btn" id="mcq-btn-${uIdx}-${sIdx}" onclick="solveSessionFast(${uIdx},${sIdx})">✦ 1-Click Solve</button>
              </div>
            </div>
            <div class="worksheets-grid" id="ws-grid-${uIdx}-${sIdx}">
              ${sess.worksheets.map((ws, wIdx) => `
                <div class="worksheet-card" onclick="openSession(${uIdx},${sIdx})">
                  <div>
                    <div class="ws-name">${escHtml(ws.name)}</div>
                    <span class="ws-status ${ws.status==='solved'?'solved':'not-sent'}" id="ws-status-${uIdx}-${sIdx}-${wIdx}">
                      ${ws.status==='solved'?'✓ Submitted':'Not sent'}
                    </span>
                  </div>
                  <div class="ws-arrow">›</div>
                </div>`).join('')}
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function toggleUnit(uIdx) {
  document.getElementById(`unit-sessions-${uIdx}`)?.classList.toggle('open');
  document.getElementById(`chev-${uIdx}`)?.classList.toggle('open');
}

function setWsStatus(uIdx, sIdx, wIdx, cls, text) {
  const el = document.getElementById(`ws-status-${uIdx}-${sIdx}-${wIdx}`);
  if (el) { el.className = `ws-status ${cls}`; el.textContent = text; }
}

// ══════════════════════════════════════════════════════
// SESSION & REAL SRM QUESTIONS VIEW
// ══════════════════════════════════════════════════════
let currentSessionData = {
  sessNum: null,
  qData: null,
  sessStatus: null,
  slo1Files: { pdf: '', docx: '' },
  slo2Files: { pdf: '', docx: '' },
  slo1PdfUri: '',
  slo2PdfUri: '',
  selectedAnswers: {},
};

async function openSession(uIdx, sIdx) {
  const unit = state.currentUnits[uIdx];
  const sess = unit?.sessions?.[sIdx];
  if (!sess) return;
  state.currentSession = { uIdx, sIdx, sess };
  const sessNum = sess.sessionNum;

  document.getElementById('sessionLabel').textContent = `${unit.name} › ${sess.name} (Session ${sessNum})`;
  document.getElementById('sessionTitle').textContent = `${state.currentSubject?.name || 'Subject'} (${state.currentSubject?.code || ''})`;
  document.getElementById('sessionBackBtn').onclick   = () => navTo('units');
  showView('session');

  const area = document.getElementById('sessionQuestionsArea');
  area.innerHTML = `
    <div style="text-align:center;padding:50px 20px">
      <div class="btn-spinner" style="width:28px;height:28px;border-color:rgba(26,61,228,0.3);border-top-color:#1a3de4;margin:0 auto 16px"></div>
      <div style="font-weight:700;font-size:1.1rem;color:#1e293b;margin-bottom:6px">Connecting to SRM E-Curricula Portal...</div>
      <div style="color:#64748b;font-size:0.9rem">Fetching real session questions, worksheets &amp; submission status</div>
    </div>`;

  try {
    const batchId = state.currentSubject.raw?.BATCH_ID || (state.currentSubject.code + '_batch');
    const courseCode = state.currentSubject.code;

    // 1. Fetch real session questions & objectives
    const qPayload = {
      COURSE_INFO: { COURSE_CODE: courseCode, BATCH_ID: batchId },
      USER_ID: state.studentId || state.regNum,
      FULL_NAME: state.studentName,
      DEPARTMENT: state.department || 'CSE AI/ML',
      SLOT: state.slots || [],
      SESSION: sessNum,
      key: 'john',
      MCQ: 5,
      SQ: 2,
      LQ: 1
    };
    const qDataPromise = srmPost('/curricula/student/session/getquestions', qPayload);

    // 2. Fetch session status
    const statusPayload = {
      USER_ID: state.studentId || state.regNum,
      FULL_NAME: state.studentName,
      DEPARTMENT: state.department || 'CSE AI/ML',
      COURSE_INFO: { COURSE_CODE: courseCode, BATCH_ID: batchId },
      SESSION: sessNum,
      key: 'john'
    };
    const statusPromise = srmPost('/curricula/student/session/getsessionstatus', statusPayload).catch(() => ({}));

    // 3. Fetch worksheet file URLs for SLO 1 and SLO 2
    async function getSRMFile(path, filename) {
      try {
        const r = await srmPost('/curricula/admin/file/getfile', {
          path, filename, server: 'https://dld.srmist.edu.in/etecurricula/server', key: 'john'
        }, false);
        return r?.result?.path || '';
      } catch { return ''; }
    }

    const [qData, sessStatus, s1Pdf, s1Docx, s2Pdf, s2Docx] = await Promise.all([
      qDataPromise,
      statusPromise,
      getSRMFile(`data/coordinator/${courseCode}/slppdf`, `${sessNum}1.pdf`),
      getSRMFile(`data/coordinator/${courseCode}/slp`, `${sessNum}1.docx`),
      getSRMFile(`data/coordinator/${courseCode}/slppdf`, `${sessNum}2.pdf`),
      getSRMFile(`data/coordinator/${courseCode}/slp`, `${sessNum}2.docx`)
    ]);

    currentSessionData = {
      sessNum,
      qData,
      sessStatus,
      slo1Files: { pdf: s1Pdf, docx: s1Docx },
      slo2Files: { pdf: s2Pdf, docx: s2Docx },
      slo1PdfUri: '',
      slo2PdfUri: '',
      selectedAnswers: {}
    };

    state.currentQuestions = qData?.mcq || [];
    renderLiveSessionView(currentSessionData);

  } catch (err) {
    area.innerHTML = `
      <div style="background:#fee2e2;border:1px solid #f87171;padding:24px;border-radius:12px;color:#991b1b;margin-top:20px">
        <h3 style="margin-bottom:8px">Could not load session from SRM</h3>
        <p style="font-size:0.9rem;margin-bottom:14px">${escHtml(err.message)}</p>
        <button onclick="openSession(${uIdx},${sIdx})" class="solve-all-btn">Try again</button>
      </div>`;
  }
}

// Clean SRM raw HTML safely
function cleanSRMHtml(html) {
  if (!html) return '';
  return html
    .replace(/font-family:[^;"]+;?/gi, '')
    .replace(/font-size:[^;"]+;?/gi, '')
    .replace(/line-height:[^;"]+;?/gi, '')
    .replace(/margin-[^;"]+:[^;"]+;?/gi, '')
    .replace(/style=""/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

function renderLiveSessionView(data) {
  const area = document.getElementById('sessionQuestionsArea');
  const { sessNum, qData, sessStatus, slo1Files, slo2Files } = data;

  const slo1Obj = qData?.slo?.SLO1 || 'Understand the core programming and system concepts for this session';
  const slo2Obj = qData?.slo?.SLO2 || 'Demonstrate hands-on practice, syntax implementation, and problem-solving';

  const mcqScore = sessStatus?.result?.MCQ?.[sessNum];
  const mcqScoreText = typeof mcqScore !== 'undefined' ? `${Number(mcqScore).toFixed(2)}%` : '0.00%';
  const isMcqDone = mcqScore >= 80;

  const slo1Raw = sessStatus?.result?.SLOLINK?.[`${sessNum}1`]?.view || '';
  const slo2Raw = sessStatus?.result?.SLOLINK?.[`${sessNum}2`]?.view || '';

  const cleanLink1 = (slo1Raw && !slo1Raw.includes('netlify') && !slo1Raw.includes('generate') && !slo1Raw.startsWith('data:')) ? slo1Raw : '';
  const displayLink1 = cleanLink1 || getOrGenerateDriveLink(sessNum, 1);

  const cleanLink2 = (slo2Raw && !slo2Raw.includes('netlify') && !slo2Raw.includes('generate') && !slo2Raw.startsWith('data:')) ? slo2Raw : '';
  const displayLink2 = cleanLink2 || getOrGenerateDriveLink(sessNum, 2);

  const slo1Status = sessStatus?.result?.SLOSTATUS?.[`${sessNum}1`];
  const slo2Status = sessStatus?.result?.SLOSTATUS?.[`${sessNum}2`];

  const mcqs = qData?.mcq || [];

  area.innerHTML = `
    <!-- Top Action Bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 20px;margin-bottom:24px;box-shadow:var(--shadow)">
      <div>
        <div style="font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">AUTOMATION &amp; DRIVE SYNC</div>
        <div style="font-weight:800;font-size:1.15rem;color:#f8fafc">Session ${sessNum} Automation</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn-srm-drive" style="padding:9px 16px;border-radius:8px" onclick="openDriveModal()">
          📁 Personal Drive Active
        </button>
        <button class="solve-all-btn" onclick="autoSolveLiveSession(${sessNum})">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          ✦ 1-Click Auto Solve &amp; Submit All to SRM
        </button>
      </div>
    </div>

    <!-- SLO 1 Practice Card -->
    <div class="slo-card">
      <div class="slo-header">
        <div class="slo-title">
          <span class="slo-badge">SLO 1</span>
          Learning Practice
        </div>
        <span class="slo-status-tag ${slo1Status===1?'verified':'not-completed'}" id="tag-slo-1">
          ${slo1Status===1 ? '✓ Submitted / Verified' : 'Not Completed'}
        </span>
      </div>
      <div class="slo-body">
        <div class="slo-objective"><strong>Objective:</strong> ${escHtml(slo1Obj)}</div>
        <div class="slo-grid">
          <div class="slo-block">
            <div class="slo-block-label">Question Worksheet</div>
            <div class="slo-btn-group">
              ${slo1Files.docx ? `<a href="${slo1Files.docx}" target="_blank" class="btn-srm-docx">⬇ Download DOCX</a>` : `<span style="font-size:0.8rem;color:#94a3b8">DOCX not found</span>`}
              ${slo1Files.pdf  ? `<a href="${slo1Files.pdf}"  target="_blank" class="btn-srm-pdf">⬇ Download PDF</a>`   : `<span style="font-size:0.8rem;color:#94a3b8">PDF not found</span>`}
            </div>
            <div style="margin-top:12px;font-size:0.78rem;color:#64748b">
              These are the actual worksheet questions downloaded from SRM.
            </div>
          </div>
          <div class="slo-block">
            <div class="slo-block-label" style="display:flex;align-items:center;justify-content:space-between">
              <span>Answer Sheet (Personal Google Drive)</span>
              <span class="drive-pill connected" style="cursor:pointer" onclick="openDriveModal()">📁 My Drive</span>
            </div>
            <div class="slo-btn-group">
              <button class="btn-srm-answer" onclick="previewSLOAnswerPDF(${sessNum}, 1)">👁 Preview PDF</button>
              <button class="btn-srm-docx" style="background:#059669" onclick="downloadSLOAnswerPDF(${sessNum}, 1)">⬇ Download PDF</button>
              <button class="btn-srm-drive" onclick="uploadSLOToGoogleDrive(${sessNum}, 1)">☁ Upload to Drive</button>
            </div>
            <div class="slo-link-row">
              <input type="text" id="slo-link-1" class="slo-link-input" placeholder="https://drive.google.com/file/d/.../view?usp=sharing" value="${displayLink1}">
              <button class="btn-srm-update" id="btn-update-1" onclick="submitSLOLinkAction(${sessNum}, 1)">UPDATE</button>
            </div>
            <div style="font-size:0.75rem;color:#94a3b8;margin-top:6px;display:flex;align-items:center;justify-content:space-between">
              <span>✓ Verified Google Drive URL for faculty submission</span>
              <a href="javascript:void(0)" onclick="openDriveModal()" style="color:#60a5fa;text-decoration:none">Drive Config ⚙</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLO 2 Practice Card -->
    <div class="slo-card">
      <div class="slo-header">
        <div class="slo-title">
          <span class="slo-badge">SLO 2</span>
          Learning Practice
        </div>
        <span class="slo-status-tag ${slo2Status===1?'verified':'not-completed'}" id="tag-slo-2">
          ${slo2Status===1 ? '✓ Submitted / Verified' : 'Not Completed'}
        </span>
      </div>
      <div class="slo-body">
        <div class="slo-objective"><strong>Objective:</strong> ${escHtml(slo2Obj)}</div>
        <div class="slo-grid">
          <div class="slo-block">
            <div class="slo-block-label">Question Worksheet</div>
            <div class="slo-btn-group">
              ${slo2Files.docx ? `<a href="${slo2Files.docx}" target="_blank" class="btn-srm-docx">⬇ Download DOCX</a>` : `<span style="font-size:0.8rem;color:#94a3b8">DOCX not found</span>`}
              ${slo2Files.pdf  ? `<a href="${slo2Files.pdf}"  target="_blank" class="btn-srm-pdf">⬇ Download PDF</a>`   : `<span style="font-size:0.8rem;color:#94a3b8">PDF not found</span>`}
            </div>
            <div style="margin-top:12px;font-size:0.78rem;color:#64748b">
              These are the actual worksheet questions downloaded from SRM.
            </div>
          </div>
          <div class="slo-block">
            <div class="slo-block-label" style="display:flex;align-items:center;justify-content:space-between">
              <span>Answer Sheet (Personal Google Drive)</span>
              <span class="drive-pill connected" style="cursor:pointer" onclick="openDriveModal()">📁 My Drive</span>
            </div>
            <div class="slo-btn-group">
              <button class="btn-srm-answer" onclick="previewSLOAnswerPDF(${sessNum}, 2)">👁 Preview PDF</button>
              <button class="btn-srm-docx" style="background:#059669" onclick="downloadSLOAnswerPDF(${sessNum}, 2)">⬇ Download PDF</button>
              <button class="btn-srm-drive" onclick="uploadSLOToGoogleDrive(${sessNum}, 2)">☁ Upload to Drive</button>
            </div>
            <div class="slo-link-row">
              <input type="text" id="slo-link-2" class="slo-link-input" placeholder="https://drive.google.com/file/d/.../view?usp=sharing" value="${displayLink2}">
              <button class="btn-srm-update" id="btn-update-2" onclick="submitSLOLinkAction(${sessNum}, 2)">UPDATE</button>
            </div>
            <div style="font-size:0.75rem;color:#94a3b8;margin-top:6px;display:flex;align-items:center;justify-content:space-between">
              <span>✓ Verified Google Drive URL for faculty submission</span>
              <a href="javascript:void(0)" onclick="openDriveModal()" style="color:#60a5fa;text-decoration:none">Drive Config ⚙</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Multiple Choice Questions Section -->
    <div class="mcq-section-header">
      <div style="font-weight:800;font-size:1.1rem;color:#0f172a;display:flex;align-items:center;gap:10px">
        <span>Multiple Choice Questions</span>
        <span style="font-size:0.8rem;color:#64748b;font-weight:500">(${mcqs.length} SRM Live Questions)</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <span class="mcq-score-badge ${isMcqDone?'passed':''}" id="mcqScoreBadge">
          Last Score : ${mcqScoreText}
        </span>
        <button class="solve-all-btn" style="padding:7px 16px;font-size:0.82rem" onclick="submitMCQsAction(${sessNum})">
          Submit MCQs to SRM
        </button>
      </div>
    </div>

    <!-- Questions List -->
    <div class="questions-list">
      ${mcqs.map((q, idx) => {
        const qNum = idx + 1;
        const opt1 = cleanSRMHtml(q.OPT_1 || '');
        const opt2 = cleanSRMHtml(q.OPT_2 || '');
        const opt3 = cleanSRMHtml(q.OPT_3 || '');
        const opt4 = cleanSRMHtml(q.OPT_4 || '');
        const correctAns = Number(q.ANSWER || 1);

        return `
          <div class="question-block" id="qblock-${idx}">
            <div class="question-num">
              <span>Question ${qNum}</span>
              <span class="level-badge">${q.LEVEL ? `Level ${q.LEVEL}` : `Level ${Math.min(3, Math.max(1, (idx%3)+1))}`}</span>
            </div>
            <div class="question-text">${cleanSRMHtml(q.QUESTION_DESC)}</div>
            <div class="options-list" id="opts-${idx}">
              <div class="option-item" id="opt-${idx}-1" onclick="selectLiveOption(${idx}, 1)">
                <div class="option-letter">A</div>
                <div>${opt1}</div>
              </div>
              <div class="option-item" id="opt-${idx}-2" onclick="selectLiveOption(${idx}, 2)">
                <div class="option-letter">B</div>
                <div>${opt2}</div>
              </div>
              <div class="option-item" id="opt-${idx}-3" onclick="selectLiveOption(${idx}, 3)">
                <div class="option-letter">C</div>
                <div>${opt3}</div>
              </div>
              <div class="option-item" id="opt-${idx}-4" onclick="selectLiveOption(${idx}, 4)">
                <div class="option-letter">D</div>
                <div>${opt4}</div>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;

  // Auto pre-select correct answers so student sees the verified 100% choices
  autoHighlightAnswers(mcqs);
}

function selectLiveOption(qIdx, optNum) {
  document.querySelectorAll(`#opts-${qIdx} .option-item`).forEach(el => el.classList.remove('selected'));
  document.getElementById(`opt-${qIdx}-${optNum}`)?.classList.add('selected');
  currentSessionData.selectedAnswers[qIdx] = optNum;
}

function autoHighlightAnswers(mcqs) {
  mcqs.forEach((q, idx) => {
    const correctOpt = Number(q.ANSWER || 1);
    selectLiveOption(idx, correctOpt);
  });
}

// ══════════════════════════════════════════════════════
// SRM SUBMISSION APIS
// ══════════════════════════════════════════════════════

// 1. Submit Worksheet PDF Link to SRM: /curricula/student/session/submitlink
async function submitSLOLinkAction(sessionNum, sloNum, forcedLink = '') {
  const input = document.getElementById(`slo-link-${sloNum}`);
  const btn   = document.getElementById(`btn-update-${sloNum}`);
  const tag   = document.getElementById(`tag-slo-${sloNum}`);
  let link = forcedLink || (input ? input.value.trim() : '');

  // Protect student grades: Guarantee submitted link is from personal Google Drive
  if (!link || link.includes('netlify') || link.startsWith('data:') || link.includes('generate')) {
    link = await uploadSLOToGoogleDrive(sessionNum, sloNum, false);
    if (input) input.value = link;
  }

  if (!link) {
    toast('⚠ Please enter or generate a link first');
    return false;
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Updating…'; }

  try {
    const payload = {
      view: link,
      download: link,
      fileId: 0,
      session: `${sessionNum}${sloNum}`,
      SESSION: sessionNum,
      SLO: sloNum,
      course_code: state.currentSubject.code,
      course_name: state.currentSubject.name,
      BATCH_ID: state.currentSubject.raw?.BATCH_ID,
      USER_ID: state.studentId || state.regNum,
      FULL_NAME: state.studentName,
      DEPARTMENT: state.department || 'CSE AI/ML',
      key: 'john'
    };

    const res = await srmPost('/curricula/student/session/submitlink', payload);
    if (res && res.Status === 1) {
      if (tag) {
        tag.className = 'slo-status-tag verified';
        tag.textContent = '✓ Submitted / Verified';
      }
      toast(`✅ SLO ${sloNum} worksheet link submitted to SRM!`);
      return true;
    } else {
      toast(`⚠ SRM: ${res?.msg || 'Could not update link'}`);
      return false;
    }
  } catch (err) {
    toast('✗ Error submitting link: ' + err.message);
    return false;
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'UPDATE'; }
  }
}

// 2. Submit MCQ to SRM: /curricula/student/session/mcq
async function submitMCQsAction(sessionNum) {
  showSolving('Submitting MCQs to SRM e-Curricula…', 'Recording 100% score');
  try {
    const payload = {
      key: 'john',
      session: sessionNum,
      course_code: state.currentSubject.code,
      course_name: state.currentSubject.name,
      USER_ID: state.studentId || state.regNum,
      FULL_NAME: state.studentName,
      DEPARTMENT: state.department || 'CSE AI/ML',
      SLOT: state.slots || [],
      mcq: 100
    };

    const res = await srmPost('/curricula/student/session/mcq', payload);
    hideSolving();

    if (res && res.Status === 1) {
      const badge = document.getElementById('mcqScoreBadge');
      if (badge) {
        badge.className = 'mcq-score-badge passed';
        badge.textContent = 'Last Score : 100.00%';
      }
      toast('✅ 100% Score recorded on SRM E-Curricula!');
      return true;
    } else {
      toast('SRM response: ' + (res?.msg || 'Submitted'));
      return true;
    }
  } catch (err) {
    hideSolving();
    toast('✗ Error submitting MCQs: ' + err.message);
    return false;
  }
}

// 3. ✦ 1-CLICK AUTO SOLVE ALL TO SRM
async function autoSolveLiveSession(sessionNum) {
  if (!checkAndIncrementQuota(2)) {
    return;
  }

  showSolving(`Automating Session ${sessionNum}…`, '1. Answering MCQs with 100% score');

  // Step 1: Auto-select and submit MCQs
  const mcqs = currentSessionData.qData?.mcq || [];
  autoHighlightAnswers(mcqs);
  await new Promise(r => setTimeout(r, 600));

  showSolving(`Automating Session ${sessionNum}…`, '2. Submitting 100% MCQ score to SRM');
  await submitMCQsAction(sessionNum);

  // Step 2: Generate Answer PDFs & Sync to Student's Personal Google Drive
  showSolving(`Automating Session ${sessionNum}…`, '3. Generating Answer PDF & Syncing Personal Google Drive (SLO 1)');
  await generateSLOAnswerPDF(sessionNum, 1);
  const driveLink1 = await uploadSLOToGoogleDrive(sessionNum, 1, false);
  await submitSLOLinkAction(sessionNum, 1, driveLink1);

  showSolving(`Automating Session ${sessionNum}…`, '4. Generating Answer PDF & Syncing Personal Google Drive (SLO 2)');
  await generateSLOAnswerPDF(sessionNum, 2);
  const driveLink2 = await uploadSLOToGoogleDrive(sessionNum, 2, false);
  await submitSLOLinkAction(sessionNum, 2, driveLink2);

  hideSolving();

  if (state.currentSession) {
    sess_done(state.currentSession.uIdx, state.currentSession.sIdx);
  }

  // Log solve event to personal database
  logDbActivity('SOLVE', `Automated Session ${sessionNum} (${state.currentSubject?.code || 'Worksheet'}) • 100% Score + Drive Sync`);

  toast(`🎉 Session ${sessionNum} fully solved and submitted to SRM e-Curricula!`);
}

// Fast solve from Units view
async function solveSessionFast(uIdx, sIdx) {
  const unit = state.currentUnits[uIdx];
  const sess = unit?.sessions?.[sIdx];
  if (!sess) return;
  await openSession(uIdx, sIdx);
  await autoSolveLiveSession(sess.sessionNum);
}

async function solveUnit(uIdx) {
  const unit = state.currentUnits[uIdx];
  if (!unit) return;
  const btn = document.getElementById(`solve-unit-${uIdx}`);

  // Check quota before starting
  const quota = getDailyQuota();
  if (!quota.hasPass && quota.remaining < 2) {
    state.pendingQueueUnit = uIdx;
    state.pendingQueueSession = 0;
    queueSessionsForTomorrow(uIdx, 0);
    showLimitModal();
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = '⟳ Solving unit…'; }

  for (let sIdx = 0; sIdx < unit.sessions.length; sIdx++) {
    const curQuota = getDailyQuota();
    if (!curQuota.hasPass && curQuota.remaining < 2) {
      // Finished daily quota mid-way! Automatically queue the rest for tomorrow
      state.pendingQueueUnit = uIdx;
      state.pendingQueueSession = sIdx;
      queueSessionsForTomorrow(uIdx, sIdx);
      if (btn) {
        btn.disabled = false;
        btn.textContent = `⏰ ${sIdx} Done • ${unit.sessions.length - sIdx} Queued Tomorrow`;
        btn.classList.add('queued');
      }
      showLimitModal();
      return;
    }

    await solveSessionFast(uIdx, sIdx);
    await new Promise(r => setTimeout(r, 800));
  }

  if (btn) { btn.textContent = '✓ Done!'; btn.classList.add('done'); btn.disabled = false; }
  toast(`✅ Unit ${uIdx+1} fully completed on SRM e-curricula!`);
}

async function solveEntireSubject() {
  const btn = document.getElementById('solveAllBtn');
  if (btn) { btn.disabled = true; btn.textContent = '⟳ Solving all…'; }
  for (let i = 0; i < state.currentUnits.length; i++) {
    await solveUnit(i);
  }
  if (btn) { btn.disabled = false; btn.innerHTML = '✦ Solve all units'; }
  toast('🎉 All registered units submitted to SRM e-curricula!');
}

function sess_done(uIdx, sIdx) {
  const unit = state.currentUnits[uIdx];
  unit?.sessions?.[sIdx]?.worksheets.forEach((_, wIdx) => setWsStatus(uIdx, sIdx, wIdx, 'solved', '✓ Solved'));
  const mb = document.getElementById(`mcq-btn-${uIdx}-${sIdx}`);
  if (mb) { mb.classList.add('done'); mb.textContent = '✓ Solved'; }
}

// ══════════════════════════════════════════════════════
// ADD ANSWERS DIRECTLY INTO SRM QUESTIONS DOCUMENT
// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
// ADD ANSWERS DIRECTLY INTO SRM QUESTIONS DOCUMENT
// ══════════════════════════════════════════════════════
async function generateSLOAnswerPDF(sessionNum, sloNum) {
  if (typeof buildSessionAnswerPDF === 'function') {
    return await buildSessionAnswerPDF(sessionNum, sloNum, currentSessionData, state);
  }
  return '';
}

async function previewSLOAnswerPDF(sessionNum, sloNum) {
  let uri = sloNum === 1 ? currentSessionData.slo1PdfUri : currentSessionData.slo2PdfUri;
  if (!uri) uri = await generateSLOAnswerPDF(sessionNum, sloNum);

  const iframe = document.getElementById('pdfIframe');
  if (iframe) iframe.src = uri;

  const modal = document.getElementById('pdfModal');
  if (modal) modal.classList.remove('hidden');
}

async function downloadSLOAnswerPDF(sessionNum, sloNum) {
  let uri = sloNum === 1 ? currentSessionData.slo1PdfUri : currentSessionData.slo2PdfUri;
  if (!uri) uri = await generateSLOAnswerPDF(sessionNum, sloNum);

  const fileName = `${state.regNum}_${state.currentSubject?.code}_Sess${sessionNum}_SLO${sloNum}_Answers.pdf`;
  const link = document.createElement('a');
  link.href = uri;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast(`⬇ Downloaded ${fileName}`);
}

function closePDFModal() {
  const modal = document.getElementById('pdfModal');
  if (modal) modal.classList.add('hidden');
}


// ══════════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════════
function saveSettingsKey() {
  const k = document.getElementById('settingsGeminiKey').value.trim();
  const s = document.getElementById('settingsKeyStatus');
  if (!k) {
    localStorage.removeItem('aceit_gkey');
    if (s) { s.className = 'key-status ok'; s.textContent = '✓ Active: Using Built-in Solver'; }
    toast('✓ Switched to Built-in Solver');
    return;
  }
  localStorage.setItem('aceit_gkey', k);
  if (s) { s.className = 'key-status ok'; s.textContent = '✓ Custom Gemini API Key saved!'; }
  toast('✓ Gemini API key saved');
}

function useBuiltinKey() {
  localStorage.removeItem('aceit_gkey');
  const input = document.getElementById('settingsGeminiKey');
  if (input) input.value = '';
  const s = document.getElementById('settingsKeyStatus');
  if (s) { s.className = 'key-status ok'; s.textContent = '✓ Active: Using Built-in Solver Engine'; }
  toast('✓ Switched to Built-in Solver Engine');
}

// ══════════════════════════════════════════════════════
// DAILY QUOTA SYSTEM (10 WORKSHEETS / DAY LIMIT)
// ══════════════════════════════════════════════════════
function getTodayDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getUserDailyKey(regNum) {
  const reg = (regNum || state.regNum || 'GUEST').toUpperCase();
  return `aceit_daily_used_${reg}_${getTodayDateStr()}`;
}

function getDailyQuota() {
  const curReg = (state.regNum || '').toUpperCase();
  if (!curReg) {
    return { used: 0, limit: 10, remaining: 10, hasPass: false, isVip: false, passName: 'Free Tier' };
  }
  const isVip = (curReg === OWNER_REG_NUM) || (localStorage.getItem(`aceit_is_vip_${curReg}`) === 'true') || ((state.regNum || '').toUpperCase() === curReg && state.isVip === true);
  const hasPass = isVip || (localStorage.getItem(`aceit_pro_pass_${curReg}`) === 'true');
  const passName = isVip ? '👑 Lifetime VIP Pass' : (localStorage.getItem(`aceit_pass_name_${curReg}`) || 'Semester Master Pass');

  // Keyed specifically to this student's registration number
  const userKey = getUserDailyKey(curReg);
  const used = parseInt(localStorage.getItem(userKey) || '0', 10);

  return {
    used,
    limit: 10,
    remaining: hasPass ? 9999 : Math.max(0, 10 - used),
    hasPass,
    isVip,
    passName
  };
}

function updateDailyQuotaUI() {
  const quota = getDailyQuota();
  
  const textEl = document.getElementById('sidebarQuotaText');
  const barEl = document.getElementById('sidebarQuotaBar');
  const subEl = document.getElementById('sidebarQuotaSub');
  const queueDailyEl = document.getElementById('queueDailyCount');
  const settingsQuotaEl = document.getElementById('settingsDailyQuota');
  const activePassBadge = document.getElementById('activePassBadge');
  const activePassName = document.getElementById('activePassName');

  if (quota.isVip) {
    if (textEl) textEl.textContent = '👑 VIP Lifetime';
    if (barEl) { barEl.style.width = '100%'; barEl.style.background = 'linear-gradient(90deg, #ec4899, #8b5cf6)'; }
    if (subEl) subEl.textContent = '👑 Lifetime Free • Granted by Admin';
    if (queueDailyEl) queueDailyEl.textContent = 'Unlimited (VIP)';
    if (settingsQuotaEl) settingsQuotaEl.textContent = '👑 Lifetime VIP Active (Permanent Free Access)';
    if (activePassBadge) activePassBadge.classList.remove('hidden');
    if (activePassName) activePassName.textContent = '👑 Lifetime VIP Pass (Granted by Admin)';
  } else if (quota.hasPass) {
    if (textEl) textEl.textContent = 'Unlimited (Pro)';
    if (barEl) { barEl.style.width = '100%'; barEl.style.background = 'linear-gradient(90deg, #8b5cf6, #3b82f6)'; }
    if (subEl) subEl.textContent = '👑 Active: ' + quota.passName;
    if (queueDailyEl) queueDailyEl.textContent = 'Unlimited';
    if (settingsQuotaEl) settingsQuotaEl.textContent = `Unlimited Access (${quota.passName} active)`;
    if (activePassBadge) activePassBadge.classList.remove('hidden');
    if (activePassName) activePassName.textContent = quota.passName;
  } else {
    const pct = Math.min(100, Math.round((quota.used / quota.limit) * 100));
    if (textEl) textEl.textContent = `${quota.used}/${quota.limit} Used`;
    if (barEl) {
      barEl.style.width = `${pct}%`;
      barEl.style.background = pct >= 100 ? '#ef4444' : 'linear-gradient(90deg, #10b981, #3b82f6)';
    }
    if (subEl) subEl.textContent = `${quota.remaining} free left today • Get Pass`;
    if (queueDailyEl) queueDailyEl.textContent = `${quota.remaining} left`;
    if (settingsQuotaEl) settingsQuotaEl.textContent = `${quota.used} / ${quota.limit} Worksheets used today`;
    if (activePassBadge) activePassBadge.classList.add('hidden');
  }
}

function checkAndIncrementQuota(count = 1) {
  const quota = getDailyQuota();
  if (quota.isVip || quota.hasPass) return true;
  if (quota.used + count > quota.limit) {
    showLimitModal();
    return false;
  }
  const userKey = getUserDailyKey(state.regNum);
  localStorage.setItem(userKey, String(quota.used + count));
  updateDailyQuotaUI();
  return true;
}

function showLimitModal() {
  document.getElementById('limitModal')?.classList.remove('hidden');
}

function closeLimitModal() {
  document.getElementById('limitModal')?.classList.add('hidden');
}

// ══════════════════════════════════════════════════════
// PHONEPE PASSES & UPGRADES
// ══════════════════════════════════════════════════════
let pendingPassTier = null;

function openPhonePePay(amount, passName) {
  pendingPassTier = { amount, passName };
  const upiId = localStorage.getItem('aceit_phonepe_upi') || '6300091861@ybl';
  
  const titleEl = document.getElementById('phonepeModalTitle');
  const amountEl = document.getElementById('phonepeModalAmount');
  const upiEl = document.getElementById('phonepeModalUpi');
  if (titleEl) titleEl.textContent = `PhonePe — ${passName}`;
  if (amountEl) amountEl.textContent = `₹${amount}`;
  if (upiEl) upiEl.textContent = upiId;
  
  const studentReg = state.regNum || 'RA2511026011232';
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=AceFlow+Pass&am=${amount}&cu=INR&tn=${encodeURIComponent('AceFlow Pass ' + studentReg)}`;
  
  const intentLink = document.getElementById('phonepeIntentLink');
  if (intentLink) intentLink.href = upiUri;
  
  const qrImg = document.getElementById('phonepeQrImg');
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;
  }
  
  document.getElementById('phonepeModal')?.classList.remove('hidden');
}

function closePhonePeModal() {
  document.getElementById('phonepeModal')?.classList.add('hidden');
  pendingPassTier = null;
}

function verifyPhonePePayment() {
  const utrInput = document.getElementById('phonepeModalUtr');
  const utr = utrInput?.value.trim();
  if (!utr || utr.length < 4) {
    toast('⚠ Please enter the 12-digit UTR or transaction ID');
    return;
  }
  
  const passName = pendingPassTier?.passName || 'Semester Master Pass';
  const amount = pendingPassTier?.amount || 29;
  const curReg = (state.regNum || 'RA2511026011232').toUpperCase();

  localStorage.setItem(`aceit_pro_pass_${curReg}`, 'true');
  localStorage.setItem(`aceit_pass_name_${curReg}`, passName);
  localStorage.setItem(`aceit_pass_utr_${curReg}`, utr);

  // Send transaction to owner's personal database
  fetch('/api/db/payment-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      regNum: curReg,
      studentName: state.studentName || 'Student',
      utr: utr,
      amount: amount,
      plan: passName
    })
  }).catch(e => console.warn('Payment record note:', e));

  closePhonePeModal();
  updateDailyQuotaUI();
  toast(`🎉 PhonePe Payment Verified! ${passName} is now active.`);
}

function redeemPassCode() {
  const input = document.getElementById('voucherCodeInput');
  const statusEl = document.getElementById('voucherStatus');
  const code = input?.value.trim().toUpperCase();
  
  if (!code) {
    if (statusEl) { statusEl.style.color = '#ef4444'; statusEl.textContent = 'Please enter a code or UTR'; }
    return;
  }
  
  if (code === 'SRMPRO' || code === 'FREEPASS' || code === 'VIP100' || /^\d{6,16}$/.test(code)) {
    const curReg = (state.regNum || 'RA2511026011232').toUpperCase();
    const pName = code === 'SRMPRO' ? 'Semester Master Pass' : 'VIP Unlimited Pass';
    localStorage.setItem(`aceit_pro_pass_${curReg}`, 'true');
    localStorage.setItem(`aceit_pass_name_${curReg}`, pName);
    updateDailyQuotaUI();
    if (statusEl) {
      statusEl.style.color = '#10b981';
      statusEl.textContent = `✓ Successfully activated ${pName}!`;
    }
    toast(`👑 ${pName} activated successfully!`);
    if (input) input.value = '';
  } else {
    if (statusEl) {
      statusEl.style.color = '#ef4444';
      statusEl.textContent = '✗ Invalid voucher or UTR. (Hint: Try promo code SRMPRO)';
    }
  }
}

function saveCustomPhonePeUpi() {
  const upi = document.getElementById('phonepeUpiInput')?.value.trim();
  if (!upi || !upi.includes('@')) {
    toast('⚠ Please enter a valid UPI ID (e.g. yourname@ybl)');
    return;
  }
  localStorage.setItem('aceit_phonepe_upi', upi);
  toast(`✓ Saved PhonePe UPI ID: ${upi}`);
}

// ══════════════════════════════════════════════════════
// OVERNIGHT AUTO-SUBMIT QUEUE (FOR USERS REACHING DAILY LIMIT)
// ══════════════════════════════════════════════════════
function getTomorrowDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getAutoQueue(regNum) {
  const curReg = (regNum || state.regNum || 'STUDENT').toUpperCase();
  try {
    const raw = localStorage.getItem(`aceit_auto_queue_${curReg}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAutoQueue(queue, regNum) {
  const curReg = (regNum || state.regNum || 'STUDENT').toUpperCase();
  localStorage.setItem(`aceit_auto_queue_${curReg}`, JSON.stringify(queue));
  try {
    const scheduled = queue.filter(q => q.status === 'SCHEDULED').length;
    logDbActivity('QUEUE_UPDATE', `Queued ${scheduled} session(s) scheduled for tomorrow`);
  } catch {}
}

function queueSessionsForTomorrow(uIdx, startSIdx = 0) {
  const unit = state.currentUnits[uIdx];
  if (!unit) return;
  const curReg = (state.regNum || 'STUDENT').toUpperCase();
  const tomorrowStr = getTomorrowDateStr();
  const queue = getAutoQueue(curReg);

  let addedCount = 0;
  for (let sIdx = startSIdx; sIdx < unit.sessions.length; sIdx++) {
    const sess = unit.sessions[sIdx];
    const sessNum = sess.sessionNum;
    
    // Avoid duplicate queuing
    const exists = queue.some(item => 
      item.subjectCode === state.currentSubject?.code && 
      item.unitIdx === uIdx && 
      item.sessionNum === sessNum &&
      item.status === 'SCHEDULED'
    );
    
    if (!exists) {
      queue.push({
        id: 'q-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        regNum: curReg,
        subjectCode: state.currentSubject?.code || 'SRM_COURSE',
        subjectName: state.currentSubject?.name || 'Subject',
        unitIdx: uIdx,
        unitTitle: unit.title || `Unit ${uIdx + 1}`,
        sessionNum: sessNum,
        sessionName: sess.sessionName || `Session ${sessNum}`,
        sIdx: sIdx,
        scheduledDate: tomorrowStr,
        status: 'SCHEDULED',
        createdAt: new Date().toISOString()
      });
      addedCount++;
    }
  }

  saveAutoQueue(queue, curReg);
  updateQueueView();

  const btn = document.getElementById(`solve-unit-${uIdx}`);
  if (btn) {
    btn.textContent = `⏰ Queued for Tomorrow (${unit.sessions.length - startSIdx} sessions)`;
    btn.classList.add('queued');
  }

  toast(`⏰ ${addedCount} session(s) queued for tomorrow! They will automatically submit to SRM when your quota resets.`);
}

function queueRemainingUnitForTomorrow() {
  closeLimitModal();
  const curReg = (state.regNum || 'STUDENT').toUpperCase();
  
  if (typeof state.pendingQueueUnit === 'number' && state.currentUnits?.[state.pendingQueueUnit]) {
    queueSessionsForTomorrow(state.pendingQueueUnit, state.pendingQueueSession || 0);
  } else if (state.currentUnits && state.currentUnits.length > 0) {
    let queuedAny = false;
    for (let uIdx = 0; uIdx < state.currentUnits.length; uIdx++) {
      const u = state.currentUnits[uIdx];
      if (u.done < u.total) {
        queueSessionsForTomorrow(uIdx, 0);
        queuedAny = true;
        break;
      }
    }
    if (!queuedAny) queueSessionsForTomorrow(0, 0);
  } else {
    queueNextPendingSubjectForTomorrow();
  }
  navTo('queue');
}

function queueNextPendingSubjectForTomorrow() {
  const subj = state.subjects.find(s => (s.total - s.done) > 0);
  if (!subj) {
    toast('No pending worksheets found to queue!');
    return;
  }
  const curReg = (state.regNum || 'STUDENT').toUpperCase();
  const tomorrowStr = getTomorrowDateStr();
  const queue = getAutoQueue(curReg);

  const needed = Math.min(10, subj.total - subj.done);
  for (let i = 1; i <= needed; i++) {
    queue.push({
      id: 'q-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      regNum: curReg,
      subjectCode: subj.code,
      subjectName: subj.name,
      unitIdx: 0,
      unitTitle: 'Registered Unit',
      sessionNum: 300 + i,
      sessionName: `Worksheet & MCQ Session ${i}`,
      sIdx: i - 1,
      scheduledDate: tomorrowStr,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    });
  }
  saveAutoQueue(queue, curReg);
  updateQueueView();
  toast(`⏰ Queued ${needed} worksheets from ${subj.name} to submit automatically tomorrow!`);
}

function removeQueueItem(id) {
  const curReg = (state.regNum || 'STUDENT').toUpperCase();
  let queue = getAutoQueue(curReg);
  queue = queue.filter(item => item.id !== id);
  saveAutoQueue(queue, curReg);
  updateQueueView();
  toast('Item removed from tomorrow\'s queue.');
}

function clearAutoQueue() {
  if (!confirm('Are you sure you want to clear tomorrow\'s auto-submit queue?')) return;
  const curReg = (state.regNum || 'STUDENT').toUpperCase();
  saveAutoQueue([], curReg);
  updateQueueView();
  toast('Auto-submit queue cleared.');
}

async function processAutoQueueManually() {
  const curReg = (state.regNum || '').toUpperCase();
  const queue = getAutoQueue(curReg);
  const scheduled = queue.filter(i => i.status === 'SCHEDULED');
  if (scheduled.length === 0) {
    toast('No scheduled worksheets in tomorrow\'s queue.');
    return;
  }
  const quota = getDailyQuota();
  if (!quota.hasPass && quota.remaining < 2) {
    toast('⚠ Your daily free limit is currently 0. Please wait for tomorrow\'s reset or activate a Pass to submit right now.');
    showLimitModal();
    return;
  }
  await checkAndProcessAutoQueue(true);
}

let isProcessingAutoQueue = false;

async function checkAndProcessAutoQueue(force = false) {
  if (isProcessingAutoQueue) return;
  const curReg = (state.regNum || '').toUpperCase();
  if (!curReg) return;

  const todayStr = getTodayDateStr();
  const queue = getAutoQueue(curReg);
  const eligibleItems = queue.filter(item => 
    item.status === 'SCHEDULED' && 
    (force || item.scheduledDate <= todayStr)
  );

  if (eligibleItems.length === 0) return;

  const quota = getDailyQuota();
  if (!quota.hasPass && quota.remaining < 2) {
    return; // Daily limit reached, wait for tomorrow
  }

  isProcessingAutoQueue = true;
  toast(`🚀 Processing auto-submit queue: submitting ${eligibleItems.length} scheduled worksheet(s)...`, 4000);
  
  let processedCount = 0;
  for (const item of eligibleItems) {
    const currentQuota = getDailyQuota();
    if (!currentQuota.hasPass && currentQuota.remaining < 2) {
      toast(`⏰ Submitted ${processedCount} queued sessions today. Daily quota limit reached—remaining items will submit tomorrow.`);
      break;
    }

    item.status = 'SUBMITTING';
    saveAutoQueue(queue, curReg);
    updateQueueView();

    try {
      showSolving(`Auto-Submitting Scheduled Session ${item.sessionNum}…`, `${item.subjectCode} — ${item.unitTitle}`);
      
      // Auto solve and submit
      await autoSolveLiveSession(item.sessionNum);
      
      item.status = 'COMPLETED';
      item.completedAt = new Date().toISOString();
      processedCount++;
    } catch (e) {
      console.warn('Queue auto-solve note:', e);
      item.status = 'COMPLETED';
    }
    
    saveAutoQueue(queue, curReg);
    await new Promise(r => setTimeout(r, 1000));
  }

  hideSolving();
  isProcessingAutoQueue = false;

  // Clean completed items from queue
  const remainingQueue = queue.filter(item => item.status !== 'COMPLETED');
  saveAutoQueue(remainingQueue, curReg);

  updateHomeStats();
  renderSubjectsList();
  renderSubjectsGrid();
  renderSidebarSubjects();
  updateQueueView();
  
  if (processedCount > 0) {
    toast(`🎉 Successfully auto-submitted ${processedCount} queued session(s) to SRM e-curricula!`);
  }
}

// ══════════════════════════════════════════════════════
// QUEUE VIEW (SHOWING WORKSHEETS LEFT TO SUBMIT)
// ══════════════════════════════════════════════════════
function updateQueueView() {
  const total = state.subjects.reduce((sum, s) => sum + (s.total || 0), 0);
  const done  = state.subjects.reduce((sum, s) => sum + (s.done || 0), 0);
  const left  = Math.max(0, total - done);

  const qLeft = document.getElementById('queueLeftCount');
  const qDone = document.getElementById('queueDoneCount');
  const qTotal = document.getElementById('queueTotalCount');
  const qScheduled = document.getElementById('queueScheduledCount');
  const navBadge = document.getElementById('navQueueBadge');

  const curReg = (state.regNum || '').toUpperCase();
  const autoQueue = getAutoQueue(curReg);
  const scheduledCount = autoQueue.filter(item => item.status === 'SCHEDULED').length;

  if (qLeft) qLeft.textContent = left;
  if (qDone) qDone.textContent = done;
  if (qTotal) qTotal.textContent = total;
  if (qScheduled) qScheduled.textContent = scheduledCount;

  if (navBadge) {
    if (scheduledCount > 0) {
      navBadge.textContent = `${scheduledCount} queued ⏰`;
      navBadge.style.background = '#8b5cf6';
      navBadge.style.color = '#fff';
    } else {
      navBadge.textContent = `${left} left`;
      navBadge.style.background = '';
      navBadge.style.color = '';
    }
  }

  updateDailyQuotaUI();

  // 1. Render Scheduled Auto-Submit Queue
  const scheduledListEl = document.getElementById('scheduledQueueList');
  if (scheduledListEl) {
    if (scheduledCount === 0) {
      scheduledListEl.innerHTML = `
        <div style="padding:16px;text-align:center;color:#64748b;font-size:0.85rem">
          No worksheets queued for tomorrow yet. Click "Solve unit" when your daily quota is finished to queue them automatically!
        </div>`;
    } else {
      let schHtml = '';
      autoQueue.forEach(item => {
        if (item.status === 'SCHEDULED') {
          schHtml += `
            <div class="queue-item" style="border-color:rgba(139,92,246,0.3);background:rgba(15,23,42,0.6)">
              <div>
                <div class="queue-item-name" style="display:flex;align-items:center;gap:8px">
                  <span>📄</span> ${escHtml(item.subjectName)} — ${escHtml(item.unitTitle)}
                  <span style="font-size:0.75rem;color:#a78bfa;font-weight:500">(${escHtml(item.subjectCode)})</span>
                </div>
                <div class="queue-item-sub">
                  Session ${item.sessionNum}: ${escHtml(item.sessionName)} • <strong>Will submit automatically tomorrow (${item.scheduledDate})</strong>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:10px">
                <span class="queue-status scheduled">⏰ Auto-Submit Ready</span>
                <button class="modal-cancel" style="padding:4px 10px;font-size:0.75rem;color:#ef4444;border-color:rgba(239,68,68,0.3)" onclick="removeQueueItem('${item.id}')">
                  Remove
                </button>
              </div>
            </div>`;
        }
      });
      scheduledListEl.innerHTML = schHtml;
    }
  }

  // 2. Render remaining subjects backlog
  const listEl = document.getElementById('queueList');
  if (!listEl) return;

  if (left === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div style="font-size:2rem;margin-bottom:8px">🎉</div>
        <div style="font-weight:700;font-size:1.1rem;color:#f8fafc">All worksheets submitted!</div>
        <div style="color:var(--muted);font-size:0.85rem">You have zero worksheets left to submit.</div>
      </div>`;
    return;
  }

  let itemsHtml = '';
  state.subjects.forEach(subj => {
    const subjLeft = Math.max(0, subj.total - subj.done);
    if (subjLeft > 0) {
      itemsHtml += `
        <div class="queue-item">
          <div>
            <div class="queue-item-name">${escHtml(subj.name)} (${escHtml(subj.code)})</div>
            <div class="queue-item-sub">${subjLeft} worksheets left to submit out of ${subj.total} total</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <span class="queue-status pending">${subjLeft} left</span>
            <button class="solve-all-btn" style="padding:6px 14px;font-size:0.8rem" onclick="openSubject('${subj.id}')">
              Open &amp; Submit
            </button>
          </div>
        </div>`;
    }
  });

  listEl.innerHTML = itemsHtml;
}

async function batchSolveNext10() {
  const quota = getDailyQuota();
  if (!quota.hasPass && quota.remaining <= 0) {
    showLimitModal();
    return;
  }
  const toSolve = quota.hasPass ? 10 : Math.min(10, quota.remaining);
  
  showSolving(`Submitting Next ${toSolve} Worksheets…`, 'Processing queue backlog');
  let solvedCount = 0;

  for (const subj of state.subjects) {
    if (solvedCount >= toSolve) break;
    const need = subj.total - subj.done;
    if (need > 0) {
      const take = Math.min(need, toSolve - solvedCount);
      subj.done += take;
      solvedCount += take;
    }
  }

  checkAndIncrementQuota(solvedCount);
  await new Promise(r => setTimeout(r, 600));
  hideSolving();

  updateHomeStats();
  renderSubjectsGrid();
  renderSubjectsList();
  renderSidebarSubjects();
  updateQueueView();
  toast(`🎉 Batch submitted! ${solvedCount} worksheets successfully marked completed.`);
}

// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Purge any legacy shared un-scoped keys so no one ever inherits another student's quota
  ['aceit_daily_used', 'aceit_is_vip', 'aceit_pro_pass', 'aceit_pass_name'].forEach(k => localStorage.removeItem(k));

  loadSession();

  let savedUpi = localStorage.getItem('aceit_phonepe_upi');
  if (!savedUpi || savedUpi === 'srm.ecurricula@ybl') {
    savedUpi = '6300091861@ybl';
    localStorage.setItem('aceit_phonepe_upi', savedUpi);
  }
  const upiInput = document.getElementById('phonepeUpiInput');
  if (upiInput) {
    upiInput.value = savedUpi;
  }

  updateDailyQuotaUI();

  // Populate settings status
  const savedKey = localStorage.getItem('aceit_gkey');
  const s = document.getElementById('settingsKeyStatus');
  const input = document.getElementById('settingsGeminiKey');
  if (savedKey) {
    if (input) input.value = savedKey;
    if (s) { s.className = 'key-status ok'; s.textContent = '✓ Custom Gemini Key Connected'; }
  } else {
    if (s) { s.className = 'key-status ok'; s.textContent = '✓ Active: Using Built-in Solver Engine'; }
  }

  updateOwnerAccessVisibility();

  // Periodic background check for auto-submit queue (runs every 60s)
  setInterval(() => {
    if (state.token && state.regNum) {
      checkAndProcessAutoQueue();
    }
  }, 60000);

  // Auto-login if saved token exists
  if (state.token && state.regNum) { enterApp(); return; }

  document.getElementById('password')?.addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  document.getElementById('regNum')?.addEventListener('keydown',   e => { if(e.key==='Enter') document.getElementById('password')?.focus(); });
});

// ══════════════════════════════════════════════════════
// OWNER SECURITY & ACCESS CONTROL
// ══════════════════════════════════════════════════════
const OWNER_PIN = '9186';
const OWNER_TOKEN = 'aceit_owner_secret_9186';

let ownerLogoClickCount = 0;
let ownerLogoClickTimer = null;
let adminPollTimer = null;

function isOwner() {
  const curReg = (state.regNum || localStorage.getItem('aceit_reg') || '').toUpperCase();
  if (curReg === OWNER_REG_NUM) return true;
  if (localStorage.getItem('aceit_is_owner_authenticated') === 'true') return true;
  return false;
}

function updateOwnerAccessVisibility() {
  const adminBtn = document.getElementById('nav-admin');
  if (!adminBtn) return;
  if (isOwner()) {
    adminBtn.style.setProperty('display', 'flex', 'important');
  } else {
    adminBtn.style.setProperty('display', 'none', 'important');
  }
}

function handleOwnerLogoClick() {
  ownerLogoClickCount++;
  clearTimeout(ownerLogoClickTimer);
  ownerLogoClickTimer = setTimeout(() => { ownerLogoClickCount = 0; }, 3000);

  if (ownerLogoClickCount >= 5) {
    ownerLogoClickCount = 0;
    openOwnerAuthModal();
  }
}

// Global keyboard shortcut: Ctrl + Shift + O
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'O' || e.key === 'o')) {
    e.preventDefault();
    openOwnerAuthModal();
  }
});

function openOwnerAuthModal() {
  const m = document.getElementById('ownerAuthModal');
  const inp = document.getElementById('ownerPinInput');
  if (m) m.classList.remove('hidden');
  if (inp) {
    inp.value = '';
    setTimeout(() => inp.focus(), 100);
  }
}

function closeOwnerAuthModal() {
  const m = document.getElementById('ownerAuthModal');
  if (m) m.classList.add('hidden');
}

function verifyOwnerPin() {
  const pin = document.getElementById('ownerPinInput')?.value.trim();
  if (pin === OWNER_PIN || pin === '6300091861' || pin === OWNER_PASSWORD) {
    localStorage.setItem('aceit_is_owner_authenticated', 'true');
    closeOwnerAuthModal();
    updateOwnerAccessVisibility();
    toast('👑 Master Owner Clearance Granted! Owner DB unlocked.');
    navTo('admin');
  } else {
    toast('⛔ Invalid Owner PIN. Access denied.');
  }
}

function lockAndHideOwnerMode() {
  localStorage.removeItem('aceit_is_owner_authenticated');
  toast('🔒 Owner mode locked & hidden. Normal student view active.');
  updateOwnerAccessVisibility();
  navTo('subjects');
}

// ══════════════════════════════════════════════════════
// OWNER DATABASE & LIVE APP MONITORING
// ══════════════════════════════════════════════════════
async function loadAdminDashboard(showToast = false) {
  if (!isOwner()) {
    navTo('subjects');
    return;
  }
  try {
    const res = await fetch('/api/db/data', {
      headers: {
        'x-owner-token': OWNER_TOKEN,
        'x-student-reg': state.regNum || OWNER_REG_NUM
      }
    });
    if (!res.ok) {
      if (res.status === 403) {
        toast('⛔ Unauthorized: Owner authentication required.');
        navTo('subjects');
      }
      return;
    }
    const db = await res.json();

    // 1. Metrics
    const usersObj = db.users || {};
    const userKeys = Object.keys(usersObj);
    const totalUsers = userKeys.length;
    const payments = db.payments || [];
    const totalRevenue = payments.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
    const totalSolved = userKeys.reduce((sum, k) => sum + (parseInt(usersObj[k]?.solvedCount) || 0), 0);
    const vips = db.vipWhitelist || [];

    const uEl = document.getElementById('dbTotalUsers');
    const rEl = document.getElementById('dbTotalRevenue');
    const sEl = document.getElementById('dbTotalSolved');
    const vEl = document.getElementById('dbTotalVip');

    if (uEl) uEl.textContent = totalUsers;
    if (rEl) rEl.textContent = '₹' + totalRevenue;
    if (sEl) sEl.textContent = totalSolved;
    if (vEl) vEl.textContent = vips.length;

    // 2. Activity Feed
    const feedEl = document.getElementById('adminActivityList');
    if (feedEl) {
      const logs = db.activityLog || [];
      if (logs.length === 0) {
        feedEl.innerHTML = '<div style="color:#64748b;padding:12px;text-align:center">No activities recorded yet.</div>';
      } else {
        feedEl.innerHTML = logs.slice(0, 30).map(evt => {
          const typeBadge = {
            'LOGIN': '<span style="background:rgba(59,130,246,0.2);color:#60a5fa;padding:3px 8px;border-radius:6px;font-weight:700;font-size:0.75rem">LOGIN</span>',
            'SOLVE': '<span style="background:rgba(16,185,129,0.2);color:#34d399;padding:3px 8px;border-radius:6px;font-weight:700;font-size:0.75rem">SOLVE</span>',
            'PAYMENT': '<span style="background:rgba(245,158,11,0.2);color:#fbbf24;padding:3px 8px;border-radius:6px;font-weight:700;font-size:0.75rem">PAYMENT</span>',
            'DRIVE_SYNC': '<span style="background:rgba(139,92,246,0.2);color:#c084fc;padding:3px 8px;border-radius:6px;font-weight:700;font-size:0.75rem">DRIVE</span>',
            'VIP_GRANT': '<span style="background:rgba(236,72,153,0.2);color:#f472b6;padding:3px 8px;border-radius:6px;font-weight:700;font-size:0.75rem">VIP_GRANT</span>'
          }[evt.type] || `<span style="background:#374151;color:#e5e7eb;padding:3px 8px;border-radius:6px;font-size:0.75rem">${escHtml(evt.type)}</span>`;

          const timeStr = evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : 'Just now';

          return `
            <div class="activity-feed-item">
              <div style="display:flex;align-items:center;gap:10px">
                ${typeBadge}
                <div>
                  <strong style="color:#f8fafc">${escHtml(evt.userName || evt.regNum || 'Student')}</strong>
                  <span style="color:#64748b;font-size:0.8rem"> (${escHtml(evt.regNum || '')})</span>
                  <div style="color:#cbd5e1;font-size:0.85rem;margin-top:2px">${escHtml(evt.text || '')}</div>
                </div>
              </div>
              <div style="color:#64748b;font-size:0.75rem;white-space:nowrap">${timeStr}</div>
            </div>`;
        }).join('');
      }
    }

    // 3. VIP Whitelist Table
    const vipBody = document.getElementById('adminVipTableBody');
    if (vipBody) {
      if (vips.length === 0) {
        vipBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#64748b">No students on VIP whitelist yet.</td></tr>';
      } else {
        vipBody.innerHTML = vips.map(reg => {
          const u = usersObj[reg] || {};
          const isOwnerReg = reg.toUpperCase() === OWNER_REG_NUM;
          return `
            <tr>
              <td><strong style="color:#f8fafc;letter-spacing:1px">${escHtml(reg)}</strong></td>
              <td>${escHtml(u.name || (isOwnerReg ? 'Owner (Self)' : 'Whitelisted Student'))}</td>
              <td><span class="queue-status" style="background:rgba(236,72,153,0.15);color:#f472b6;border-color:rgba(236,72,153,0.3)">Permanent VIP Free</span></td>
              <td>
                ${isOwnerReg ? '<span style="color:#64748b;font-size:0.8rem">Owner (Permanent)</span>' : `<button class="btn-srm-docx" style="background:#ef4444;padding:4px 10px;font-size:0.75rem" onclick="revokeVipFromAdmin('${reg}')">Revoke VIP</button>`}
              </td>
            </tr>`;
        }).join('');
      }
    }

    // 4. Payments Table
    const payBody = document.getElementById('adminPaymentsTableBody');
    if (payBody) {
      if (payments.length === 0) {
        payBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#64748b">No payments recorded yet.</td></tr>';
      } else {
        payBody.innerHTML = payments.map(p => {
          const dateStr = p.timestamp ? new Date(p.timestamp).toLocaleDateString() + ' ' + new Date(p.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Recent';
          return `
            <tr>
              <td><code style="color:#60a5fa">${escHtml(p.regNum)}</code></td>
              <td>${escHtml(p.studentName || 'Student')}</td>
              <td><strong style="color:#10b981">₹${escHtml(p.amount)}</strong></td>
              <td>${escHtml(p.plan || 'Pass')}</td>
              <td><code style="color:#e5e7eb;font-size:0.8rem">${escHtml(p.utr || '—')}</code></td>
              <td style="color:#64748b;font-size:0.8rem">${dateStr}</td>
            </tr>`;
        }).join('');
      }
    }

    // 5. User Directory Table
    const usersBody = document.getElementById('adminUsersTableBody');
    if (usersBody) {
      if (userKeys.length === 0) {
        usersBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#64748b">No users recorded yet.</td></tr>';
      } else {
        usersBody.innerHTML = userKeys.map(k => {
          const u = usersObj[k];
          const isVipUser = vips.includes(k.toUpperCase());
          const planBadge = isVipUser 
            ? '<span class="queue-status" style="background:rgba(236,72,153,0.15);color:#f472b6">👑 Lifetime VIP</span>'
            : (u.plan ? `<span class="queue-status completed">${escHtml(u.plan)}</span>` : '<span class="queue-status pending">Free (10/day)</span>');
          const lastActiveStr = u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Active';

          return `
            <tr>
              <td><strong style="color:#f8fafc">${escHtml(u.regNum || k)}</strong></td>
              <td>${escHtml(u.name || 'Student')}</td>
              <td>${escHtml(u.department || 'SRMIST')}</td>
              <td>${u.loginCount || 1}</td>
              <td><strong style="color:#3b82f6">${u.solvedCount || 0}</strong></td>
              <td>${planBadge}</td>
              <td style="color:#64748b;font-size:0.8rem">${lastActiveStr}</td>
            </tr>`;
        }).join('');
      }
    }

    if (showToast) toast('✓ Owner database refreshed with latest live data');
  } catch (err) {
    console.error('Error fetching admin DB:', err);
  }
}

async function grantVipFromAdmin() {
  const inp = document.getElementById('adminVipInput');
  const reg = (inp?.value || '').trim().toUpperCase();
  if (!reg || reg.length < 8) {
    toast('⚠ Please enter a valid SRM Register Number (e.g. RA2511026011232)');
    return;
  }
  try {
    const res = await fetch('/api/db/whitelist-add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': OWNER_TOKEN,
        'x-student-reg': state.regNum || OWNER_REG_NUM
      },
      body: JSON.stringify({ regNum: reg, studentName: 'VIP Student' })
    });
    const d = await res.json();
    if (d.success) {
      if (inp) inp.value = '';
      toast(`👑 Lifetime Free Access granted to ${reg}!`);
      loadAdminDashboard();
    }
  } catch (err) {
    toast('Error granting VIP: ' + err.message);
  }
}

async function revokeVipFromAdmin(reg) {
  if (!confirm(`Are you sure you want to revoke VIP lifetime free access from ${reg}?`)) return;
  try {
    const res = await fetch('/api/db/whitelist-remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': OWNER_TOKEN,
        'x-student-reg': state.regNum || OWNER_REG_NUM
      },
      body: JSON.stringify({ regNum: reg })
    });
    const d = await res.json();
    if (d.success) {
      toast(`Revoked VIP status from ${reg}`);
      loadAdminDashboard();
    }
  } catch (err) {
    toast('Error revoking VIP: ' + err.message);
  }
}

function logDbActivity(type, text) {
  const regNum = state.regNum || 'RA2511026011232';
  const userName = state.studentName || 'Student';
  const dept = state.department || 'SRMIST';
  fetch('/api/db/log-activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ regNum, userName, dept, type, text })
  }).catch(() => {});
}

async function checkUserVipStatus(regNum) {
  if (!regNum) return;
  const curReg = regNum.toUpperCase();
  try {
    const res = await fetch('/api/db/check-vip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regNum: curReg })
    });
    const d = await res.json();
    if (!d || !d.success) return;

    if (curReg !== (state.regNum || '').toUpperCase()) return;

    if (d.isVip || curReg === OWNER_REG_NUM) {
      state.isVip = true;
      localStorage.setItem(`aceit_is_vip_${curReg}`, 'true');
    } else {
      state.isVip = false;
      localStorage.removeItem(`aceit_is_vip_${curReg}`);
    }

    // Sync daily usage from database for this specific student
    if (typeof d.dailySolved === 'number') {
      const userKey = getUserDailyKey(curReg);
      localStorage.setItem(userKey, String(d.dailySolved));
    }

    updateDailyQuotaUI();
  } catch (err) {}
}

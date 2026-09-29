export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const cCode = req.query.course || '';
  const sNum = req.query.session || '';
  const slo = req.query.slo || '';
  const uNum = req.query.unit || '';

  const foundObj = { success: false, url: '', ext: '', filename: '', docx: '', pdf: '' };

  if (cCode && sNum && slo) {
    const numOnly = parseInt(String(sNum).replace(/\D/g, ''), 10) || 0;
    const uInt = parseInt(String(uNum).replace(/\D/g, ''), 10) || 0;

    const candidates = [];
    if (numOnly > 0) candidates.push(numOnly);
    if (uInt > 0 && numOnly < 100) candidates.push(uInt * 100 + numOnly);
    if (numOnly >= 100) candidates.push(numOnly % 100);

    const baseUpload = `https://dld.srmist.edu.in/etecurricula/server/uploads/data/coordinator/${cCode}`;

    for (const cand of candidates) {
      // Check PDF first (slppdf)
      if (!foundObj.pdf) {
        const pdfUrl = `${baseUpload}/slppdf/${cand}${slo}.pdf`;
        try {
          const probe = await fetch(pdfUrl, { method: 'HEAD', signal: AbortSignal.timeout(1500) });
          if (probe.status === 200) {
            foundObj.pdf = pdfUrl;
            if (!foundObj.url) {
              foundObj.url = pdfUrl;
              foundObj.ext = 'pdf';
              foundObj.filename = `${cand}${slo}.pdf`;
              foundObj.success = true;
            }
          }
        } catch (_) {}
      }

      // Check DOCX (slp)
      if (!foundObj.docx) {
        const docxUrl = `${baseUpload}/slp/${cand}${slo}.docx`;
        try {
          const probe = await fetch(docxUrl, { method: 'HEAD', signal: AbortSignal.timeout(1500) });
          if (probe.status === 200) {
            foundObj.docx = docxUrl;
            if (!foundObj.url) {
              foundObj.url = docxUrl;
              foundObj.ext = 'docx';
              foundObj.filename = `${cand}${slo}.docx`;
              foundObj.success = true;
            }
          }
        } catch (_) {}
      }

      if (foundObj.pdf && foundObj.docx) break;
    }
  }

  return res.status(200).json(foundObj);
}

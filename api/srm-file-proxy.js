export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const fileUrl = req.query.url;
  let reqFilename = req.query.filename;

  if (!fileUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const srmResp = await fetch(fileUrl, { signal: AbortSignal.timeout(15000) });
    if (!srmResp.ok) {
      return res.status(srmResp.status).send(`Failed to fetch remote file: HTTP ${srmResp.status}`);
    }

    if (!reqFilename) {
      reqFilename = fileUrl.split('/').pop() || 'file';
    }

    if (reqFilename.endsWith('.docx')) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    } else if (reqFilename.endsWith('.doc')) {
      res.setHeader('Content-Type', 'application/msword');
    } else if (reqFilename.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    } else {
      res.setHeader('Content-Type', 'application/octet-stream');
    }

    res.setHeader('Content-Disposition', `attachment; filename="${reqFilename}"`);

    const arrayBuffer = await srmResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader('Content-Length', buffer.length);
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('[srm-file-proxy error]', err);
    return res.status(500).send(`File proxy error: ${err.message}`);
  }
}

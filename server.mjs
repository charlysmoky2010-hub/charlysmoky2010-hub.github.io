import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('public');
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html':'text/html; charset=utf-8', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.png':'image/png', '.webp':'image/webp', '.mp4':'video/mp4',
  '.pdf':'application/pdf', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8'
};

http.createServer(async (req, res) => {
  try {
    const raw = decodeURIComponent((req.url || '/').split('?')[0]);
    const rel = raw === '/' ? '/index.html' : raw;
    const file = path.resolve(root, '.' + rel);
    if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not file');
    const type = mime[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const common = {'Content-Type':type,'Accept-Ranges':'bytes','Cache-Control':rel==='/index.html'?'no-cache':'public, max-age=31536000, immutable'};
    const range = req.headers.range;
    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!m) { res.writeHead(416); return res.end(); }
      const start = m[1] ? Number(m[1]) : 0;
      const end = m[2] ? Math.min(Number(m[2]), info.size - 1) : info.size - 1;
      if (start > end || start >= info.size) { res.writeHead(416, {'Content-Range':`bytes */${info.size}`}); return res.end(); }
      res.writeHead(206, {...common,'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1});
      if (req.method === 'HEAD') return res.end();
      return createReadStream(file,{start,end}).pipe(res);
    }
    res.writeHead(200, {...common,'Content-Length':info.size});
    if (req.method === 'HEAD') return res.end();
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    res.end('Not found');
  }
}).listen(port, '0.0.0.0', () => console.log(`Water Remembers listening on ${port}`));

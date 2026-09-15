import { mkdir, copyFile, writeFile } from 'node:fs/promises';

const source = 'https://blair-thick-barbie-checking.trycloudflare.com';
const files = [
  ['art-atlas.jpg', '/art-atlas.jpg'],
  ['Gece_Lalesi_Ebru_Filmi.mp4', '/assets/Gece_Lalesi_Ebru_Filmi.mp4'],
  ['Yusuf_Sen_Portfolio_2026.pdf', '/assets/Yusuf_Sen_Portfolio_2026.pdf']
];

await mkdir('public/assets', { recursive: true });
await copyFile('index.html', 'public/index.html');

for (const [name, path] of files) {
  const url = source + path;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed ${url}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(`public/assets/${name}`, bytes);
  console.log(`captured ${name}: ${bytes.length} bytes`);
}

console.log('Water Remembers media capture complete.');

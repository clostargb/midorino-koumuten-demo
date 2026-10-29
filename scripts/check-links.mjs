// dist の HTML にあるサイト内リンク(/ で始まる href・src)が、すべて実在するかを調べる
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

function exists(url) {
  const path = decodeURI(url.split('#')[0].split('?')[0]);
  const target = join(DIST, path);
  if (path.endsWith('/')) return existsSync(join(target, 'index.html'));
  return existsSync(target) || existsSync(join(target, 'index.html'));
}

const broken = [];
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (url.startsWith('//')) continue;
    if (!exists(url)) broken.push(`${file} → ${url}`);
  }
}

if (broken.length) {
  console.error(`NG リンク切れ ${broken.length} 件`);
  for (const line of broken) console.error('  ' + line);
  process.exit(1);
}
console.log('OK リンク切れなし');

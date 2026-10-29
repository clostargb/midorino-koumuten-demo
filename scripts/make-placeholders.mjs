// 写真が届くまでの仮画像(単色)を作る。本物の写真に差し替えたら使わない
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';

const dir = 'src/assets/photos';
mkdirSync(dir, { recursive: true });

const photos = [
  ['hero', '#c9b79c'],
  ['about', '#b9a99a'],
  ['recruit', '#a7b3ab'],
  ['work-01', '#b8a587'],
  ['work-02', '#a9b8a0'],
  ['work-03', '#cfc6b4'],
  ['work-04', '#c4b49c'],
  ['work-05', '#b0a48f'],
  ['work-06', '#bfb5a2'],
];

for (const [name, color] of photos) {
  const file = `${dir}/${name}.jpg`;
  if (existsSync(file)) continue; // 本物の写真を上書きしない
  await sharp({ create: { width: 1600, height: 1067, channels: 3, background: color } })
    .jpeg({ quality: 80 })
    .toFile(file);
  console.log('作成', file);
}

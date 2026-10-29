// 壊れた原稿を1つずつ置き、ビルドが止まる(公開されない)ことを確かめる
import { writeFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const FILE = 'src/content/works/zz-guard-test.md';

const valid = `---
title: 確認用の施工実績
date: 2026-10-01
area: みどり野市
category: 新築
cover: ../../assets/photos/work-01.jpg
coverAlt: 確認用の写真
summary: 関所の試験に使う原稿です。
---
本文です。
`;

const brokenCases = [
  ['必須の項目(地域)がない', valid.replace('area: みどり野市\n', '')],
  ['選択肢にないカテゴリ', valid.replace('category: 新築', 'category: 店舗')],
  ['存在しない写真', valid.replace('work-01.jpg', 'not-found.jpg')],
  ['日付の形が違う', valid.replace('date: 2026-10-01', 'date: 先週')],
  ['概要が120字を超える', valid.replace('summary: 関所の試験に使う原稿です。', `summary: ${'あ'.repeat(121)}`)],
];

function build() {
  return spawnSync('npx', ['astro', 'build'], { shell: true, encoding: 'utf8' });
}

let failed = 0;
try {
  writeFileSync(FILE, valid);
  const base = build();
  if (base.status !== 0) {
    console.error('NG 正しい原稿なのにビルドが失敗した\n' + base.stdout + base.stderr);
    process.exit(1);
  }
  console.log('OK 正しい原稿はビルドが通る');

  for (const [name, body] of brokenCases) {
    writeFileSync(FILE, body);
    const result = build();
    if (result.status === 0) {
      console.error(`NG ${name}: ビルドが通ってしまった`);
      failed++;
    } else {
      console.log(`OK ${name}: ビルドで止まった`);
    }
  }
} finally {
  rmSync(FILE, { force: true });
}

process.exit(failed ? 1 : 0);

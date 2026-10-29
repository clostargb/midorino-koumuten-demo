// 原稿の型(content.config.ts)と画面の両方で使う選択肢
export const WORK_CATEGORIES = ['新築', 'リフォーム', '外壁・屋根', '水まわり', 'その他'] as const;
export type WorkCategory = (typeof WORK_CATEGORIES)[number];

// 施工実績のカテゴリ別ページの URL 名
export const WORK_CATEGORY_SLUGS: Record<WorkCategory, string> = {
  '新築': 'shinchiku',
  'リフォーム': 'reform',
  '外壁・屋根': 'gaiheki',
  '水まわり': 'mizumawari',
  'その他': 'other',
};

export const NEWS_CATEGORIES = ['お知らせ', '休業', 'イベント'] as const;

export const EMPLOYMENT_TYPES = ['正社員', '契約社員', 'パート・アルバイト'] as const;

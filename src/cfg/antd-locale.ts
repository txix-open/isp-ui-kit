import locale from 'antd/locale/ru_RU.js';

// Ant Design exposes a CJS wrapper here; native ESM and bundlers unwrap it differently.
export const ruRU =
  (locale as typeof locale & { default?: typeof locale }).default ?? locale;

export const texts = {
  'finishPage.deputyLength': '{{firstDeputy}} и еще {{deputiesLength}}',
  'table.empty': 'Нет данных',
} as const;

export type TextKeys = keyof typeof texts;

export const pluralize = (value: number, forms: [string, string, string]) => {
  const absValue = Math.abs(value) % 100;
  const lastDigit = absValue % 10;

  if (absValue > 10 && absValue < 20) return forms[2];
  if (lastDigit > 1 && lastDigit < 5) return forms[1];
  if (lastDigit === 1) return forms[0];
  return forms[2];
};

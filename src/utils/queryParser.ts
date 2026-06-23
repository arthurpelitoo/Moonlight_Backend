export const toString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export const toInt = (value: unknown, defaultValue: number): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : defaultValue;
}

export const toBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined) return undefined;
  return value === 'true';
};

export const toFloat = (value: unknown): number | undefined => {
  const parsed = parseFloat(value as string);
  return isNaN(parsed) ? undefined : parsed
}
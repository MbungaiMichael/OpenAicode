export function parseList(value: string): string[] {
  try {
    const v = JSON.parse(value);
    return Array.isArray(v) ? v : [];
  } catch {
    return value ? [value] : [];
  }
}

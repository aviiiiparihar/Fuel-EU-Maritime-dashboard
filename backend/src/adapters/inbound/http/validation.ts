export function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string.`);
  }
  return value;
}

export function requireNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${field} must be a number.`);
  }
  return value;
}

export function requireIntFromQuery(value: unknown, field: string): number {
  const str = requireString(value, field);
  const parsed = Number(str);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${field} must be an integer.`);
  }
  return parsed;
}

export function requireStringFromQuery(value: unknown, field: string): string {
  return requireString(value, field);
}

export function requireStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array.`);
  }
  const out: string[] = [];
  for (const item of value) {
    out.push(requireString(item, `${field}[]`));
  }
  if (out.length === 0) {
    throw new Error(`${field} must not be empty.`);
  }
  return out;
}


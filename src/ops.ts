export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete (result as Record<string, unknown>)[key as string];
  }
  return result as Omit<T, K>;
}

function getDeep(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function setDeep(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current) || typeof current[parts[i]] !== 'object') {
      current[parts[i]] = {};
    }
    current = current[parts[i]] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

function deleteDeep(obj: Record<string, unknown>, path: string): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current) || typeof current[parts[i]] !== 'object') return;
    current = current[parts[i]] as Record<string, unknown>;
  }
  delete current[parts[parts.length - 1]];
}

export function deepPick(obj: Record<string, unknown>, ...paths: string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const path of paths) {
    const value = getDeep(obj, path);
    if (value !== undefined) setDeep(result, path, value);
  }
  return result;
}

export function deepOmit(obj: Record<string, unknown>, ...paths: string[]): Record<string, unknown> {
  const result = structuredClone(obj);
  for (const path of paths) {
    deleteDeep(result, path);
  }
  return result;
}

export function pickBy<T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: unknown, key: string) => boolean,
): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key)) result[key] = value;
  }
  return result as Partial<T>;
}

export function omitBy<T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: unknown, key: string) => boolean,
): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!predicate(value, key)) result[key] = value;
  }
  return result as Partial<T>;
}

export type TypeName =
  | 'string'
  | 'number'
  | 'boolean'
  | 'function'
  | 'object'
  | 'undefined'
  | 'symbol'
  | 'bigint';

export function pickByType<T extends Record<string, unknown>>(
  obj: T,
  typeName: TypeName,
): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === typeName) result[key] = value;
  }
  return result as Partial<T>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function flatten(obj: object, separator: string = '.'): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  const walk = (value: unknown, prefix: string): void => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        result[prefix] = [];
        return;
      }
      for (let i = 0; i < value.length; i++) {
        const nextKey = prefix === '' ? String(i) : `${prefix}${separator}${i}`;
        walk(value[i], nextKey);
      }
      return;
    }

    if (isPlainObject(value)) {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        if (prefix !== '') result[prefix] = {};
        return;
      }
      for (const key of keys) {
        const nextKey = prefix === '' ? key : `${prefix}${separator}${key}`;
        walk((value as Record<string, unknown>)[key], nextKey);
      }
      return;
    }

    result[prefix] = value;
  };

  walk(obj, '');
  return result;
}

export function unflatten(
  obj: Record<string, unknown>,
  separator: string = '.',
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const flatKey of Object.keys(obj)) {
    const value = obj[flatKey];
    const parts = flatKey.split(separator);

    let current: Record<string, unknown> | unknown[] = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      const nextIsIndex = /^\d+$/.test(nextPart);

      if (Array.isArray(current)) {
        const idx = Number(part);
        if (current[idx] == null) {
          current[idx] = nextIsIndex ? [] : {};
        }
        current = current[idx] as Record<string, unknown> | unknown[];
      } else {
        if (current[part] == null) {
          current[part] = nextIsIndex ? [] : {};
        }
        current = current[part] as Record<string, unknown> | unknown[];
      }
    }

    const lastPart = parts[parts.length - 1];
    if (Array.isArray(current)) {
      current[Number(lastPart)] = value;
    } else {
      current[lastPart] = value;
    }
  }

  return result;
}

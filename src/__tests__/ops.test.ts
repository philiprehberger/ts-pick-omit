import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  pick,
  omit,
  deepPick,
  deepOmit,
  pickBy,
  omitBy,
  pickByType,
  flatten,
  unflatten,
} from '../../dist/index.js';

describe('pick', () => {
  it('should pick specified keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    assert.deepEqual(pick(obj, 'a', 'c'), { a: 1, c: 3 });
  });

  it('should ignore missing keys', () => {
    const obj = { a: 1, b: 2 } as Record<string, unknown>;
    assert.deepEqual(pick(obj, 'a', 'z' as keyof typeof obj), { a: 1 });
  });

  it('should return empty object for no keys', () => {
    const obj = { a: 1 };
    assert.deepEqual(pick(obj), {});
  });
});

describe('omit', () => {
  it('should omit specified keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    assert.deepEqual(omit(obj, 'b', 'd'), { a: 1, c: 3 });
  });

  it('should return full object when no keys omitted', () => {
    const obj = { a: 1, b: 2 };
    assert.deepEqual(omit(obj), { a: 1, b: 2 });
  });
});

describe('deepPick', () => {
  it('should pick nested paths with dot notation', () => {
    const obj = { a: { b: { c: 1 } }, d: 2 };
    assert.deepEqual(deepPick(obj, 'a.b.c'), { a: { b: { c: 1 } } });
  });

  it('should pick multiple nested paths', () => {
    const obj = { user: { name: 'Alice', age: 30 }, meta: { id: 1 } };
    assert.deepEqual(deepPick(obj, 'user.name', 'meta.id'), {
      user: { name: 'Alice' },
      meta: { id: 1 },
    });
  });

  it('should ignore undefined paths', () => {
    const obj = { a: 1 };
    assert.deepEqual(deepPick(obj, 'b.c.d'), {});
  });
});

describe('deepOmit', () => {
  it('should remove nested paths', () => {
    const obj = { a: { b: 1, c: 2 }, d: 3 };
    const result = deepOmit(obj, 'a.b');
    assert.deepEqual(result, { a: { c: 2 }, d: 3 });
  });

  it('should not mutate the original object', () => {
    const obj = { a: { b: 1 } };
    deepOmit(obj, 'a.b');
    assert.deepEqual(obj, { a: { b: 1 } });
  });
});

describe('pickBy', () => {
  it('should pick entries matching a predicate', () => {
    const obj = { a: 1, b: null, c: 'hello', d: 0 };
    const result = pickBy(obj, (value) => Boolean(value));
    assert.deepEqual(result, { a: 1, c: 'hello' });
  });

  it('should pass key to predicate', () => {
    const obj = { name: 'Alice', _private: 'secret', age: 30 };
    const result = pickBy(obj, (_value, key) => !key.startsWith('_'));
    assert.deepEqual(result, { name: 'Alice', age: 30 });
  });
});

describe('omitBy', () => {
  it('should omit entries matching a predicate', () => {
    const obj = { a: 1, b: null, c: undefined, d: 'ok' };
    const result = omitBy(obj, (value) => value == null);
    assert.deepEqual(result, { a: 1, d: 'ok' });
  });
});

describe('edge cases', () => {
  it('should handle empty object', () => {
    assert.deepEqual(pick({} as Record<string, unknown>), {});
    assert.deepEqual(omit({} as Record<string, unknown>), {});
    assert.deepEqual(deepPick({}, 'a'), {});
    assert.deepEqual(deepOmit({}, 'a'), {});
  });

  it('should handle single key operations', () => {
    const obj = { x: 42, y: 99 };
    assert.deepEqual(pick(obj, 'x'), { x: 42 });
    assert.deepEqual(omit(obj, 'x'), { y: 99 });
  });
});

describe('pickByType', () => {
  it('should pick string properties', () => {
    const obj = { name: 'Alice', age: 30, active: true };
    assert.deepEqual(pickByType(obj, 'string'), { name: 'Alice' });
  });

  it('should pick number properties', () => {
    const obj = { name: 'Alice', age: 30, score: 99.5, active: true };
    assert.deepEqual(pickByType(obj, 'number'), { age: 30, score: 99.5 });
  });

  it('should pick boolean properties', () => {
    const obj = { name: 'Alice', active: true, admin: false, age: 30 };
    assert.deepEqual(pickByType(obj, 'boolean'), { active: true, admin: false });
  });

  it('should pick function properties', () => {
    const fn = () => 1;
    const obj = { name: 'Alice', run: fn, age: 30 };
    assert.deepEqual(pickByType(obj, 'function'), { run: fn });
  });

  it('should pick object properties', () => {
    const nested = { a: 1 };
    const obj = { name: 'Alice', meta: nested, age: 30, n: null };
    const result = pickByType(obj, 'object');
    assert.deepEqual(result, { meta: nested, n: null });
  });

  it('should pick undefined properties', () => {
    const obj = { a: 1, b: undefined, c: 'hi' };
    assert.deepEqual(pickByType(obj, 'undefined'), { b: undefined });
  });

  it('should pick bigint properties', () => {
    const obj = { a: 1, b: 10n, c: 'hi' };
    assert.deepEqual(pickByType(obj, 'bigint'), { b: 10n });
  });

  it('should pick symbol properties', () => {
    const sym = Symbol('s');
    const obj = { a: 1, b: sym };
    assert.deepEqual(pickByType(obj, 'symbol'), { b: sym });
  });

  it('should return empty for no matches', () => {
    const obj = { a: 1, b: 2 };
    assert.deepEqual(pickByType(obj, 'string'), {});
  });
});

describe('flatten', () => {
  it('should flatten a nested object with default separator', () => {
    const obj = { a: { b: { c: 1 } }, d: 2 };
    assert.deepEqual(flatten(obj), { 'a.b.c': 1, d: 2 });
  });

  it('should flatten arrays to indexed keys', () => {
    const obj = { a: [10, 20, 30] };
    assert.deepEqual(flatten(obj), { 'a.0': 10, 'a.1': 20, 'a.2': 30 });
  });

  it('should flatten arrays of objects', () => {
    const obj = { items: [{ id: 1 }, { id: 2 }] };
    assert.deepEqual(flatten(obj), { 'items.0.id': 1, 'items.1.id': 2 });
  });

  it('should support a custom separator', () => {
    const obj = { a: { b: 1 } };
    assert.deepEqual(flatten(obj, '/'), { 'a/b': 1 });
  });

  it('should preserve primitive scalars', () => {
    const obj = { s: 'hello', n: 42, b: true, z: null };
    assert.deepEqual(flatten(obj), { s: 'hello', n: 42, b: true, z: null });
  });

  it('should handle empty objects and arrays at top-level', () => {
    assert.deepEqual(flatten({}), {});
  });

  it('should handle deeply nested mixed structures', () => {
    const obj = { user: { name: 'Alice', tags: ['admin', 'staff'] } };
    assert.deepEqual(flatten(obj), {
      'user.name': 'Alice',
      'user.tags.0': 'admin',
      'user.tags.1': 'staff',
    });
  });
});

describe('unflatten', () => {
  it('should rebuild a nested object', () => {
    const flat = { 'a.b.c': 1, d: 2 };
    assert.deepEqual(unflatten(flat), { a: { b: { c: 1 } }, d: 2 });
  });

  it('should produce arrays for numeric segments', () => {
    const flat = { 'a.0': 10, 'a.1': 20, 'a.2': 30 };
    const result = unflatten(flat);
    assert.deepEqual(result, { a: [10, 20, 30] });
    assert.ok(Array.isArray((result as { a: unknown }).a));
  });

  it('should rebuild arrays of objects', () => {
    const flat = { 'items.0.id': 1, 'items.1.id': 2 };
    const result = unflatten(flat);
    assert.deepEqual(result, { items: [{ id: 1 }, { id: 2 }] });
    assert.ok(Array.isArray((result as { items: unknown }).items));
  });

  it('should support a custom separator', () => {
    const flat = { 'a/b/c': 1 };
    assert.deepEqual(unflatten(flat, '/'), { a: { b: { c: 1 } } });
  });

  it('should round-trip flatten -> unflatten for nested objects', () => {
    const obj = { a: { b: { c: 1, d: 'two' } }, e: 3 };
    assert.deepEqual(unflatten(flatten(obj)), obj);
  });

  it('should round-trip flatten -> unflatten with arrays', () => {
    const obj = { user: { name: 'Alice', tags: ['admin', 'staff'] }, ids: [1, 2, 3] };
    assert.deepEqual(unflatten(flatten(obj)), obj);
  });

  it('should round-trip with a custom separator', () => {
    const obj = { a: { b: { c: [1, 2] } } };
    assert.deepEqual(unflatten(flatten(obj, '/'), '/'), obj);
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { pick, omit, deepPick, deepOmit, pickBy, omitBy } from '../../dist/index.js';

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

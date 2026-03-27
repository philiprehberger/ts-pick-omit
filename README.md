# @philiprehberger/pick-omit

[![CI](https://github.com/philiprehberger/ts-pick-omit/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-pick-omit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/pick-omit)](https://www.npmjs.com/package/@philiprehberger/pick-omit)
[![License](https://img.shields.io/github/license/philiprehberger/ts-pick-omit)](LICENSE)
[![Sponsor](https://img.shields.io/badge/sponsor-GitHub%20Sponsors-ec6cb9)](https://github.com/sponsors/philiprehberger)

Type-safe shallow and deep pick/omit for JavaScript objects.

## Installation

```bash
npm install @philiprehberger/pick-omit
```

## Usage

```ts
import { pick, omit, deepPick, deepOmit, pickBy, omitBy } from '@philiprehberger/pick-omit';

// Shallow pick/omit
pick({ a: 1, b: 2, c: 3 }, 'a', 'c');   // { a: 1, c: 3 }
omit({ a: 1, b: 2, c: 3 }, 'b');         // { a: 1, c: 3 }

// Deep pick/omit with dot notation
const user = { name: 'Alice', address: { city: 'NYC', zip: '10001' } };
deepPick(user, 'name', 'address.city');   // { name: 'Alice', address: { city: 'NYC' } }
deepOmit(user, 'address.zip');            // { name: 'Alice', address: { city: 'NYC' } }

// Predicate-based
pickBy({ a: 1, b: null, c: 'ok' }, (v) => v != null);  // { a: 1, c: 'ok' }
omitBy({ a: 1, b: null, c: 'ok' }, (v) => v == null);   // { a: 1, c: 'ok' }
```

## API

### `pick<T, K>(obj: T, ...keys: K[]): Pick<T, K>`

Returns a new object with only the specified keys. Type-safe with full inference.

### `omit<T, K>(obj: T, ...keys: K[]): Omit<T, K>`

Returns a new object without the specified keys.

### `deepPick(obj, ...paths): Record<string, unknown>`

Picks nested values using dot-notation paths (e.g., `'user.address.city'`).

### `deepOmit(obj, ...paths): Record<string, unknown>`

Removes nested values using dot-notation paths. Does not mutate the original.

### `pickBy<T>(obj: T, predicate: (value, key) => boolean): Partial<T>`

Picks entries where the predicate returns `true`.

### `omitBy<T>(obj: T, predicate: (value, key) => boolean): Partial<T>`

Omits entries where the predicate returns `true`.

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT

# @philiprehberger/pick-omit

[![CI](https://github.com/philiprehberger/ts-pick-omit/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-pick-omit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/pick-omit.svg)](https://www.npmjs.com/package/@philiprehberger/pick-omit)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/ts-pick-omit)](https://github.com/philiprehberger/ts-pick-omit/commits/main)

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

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/ts-pick-omit)

🐛 [Report issues](https://github.com/philiprehberger/ts-pick-omit/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/ts-pick-omit/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)

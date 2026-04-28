# @philiprehberger/pick-omit

[![CI](https://github.com/philiprehberger/ts-pick-omit/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-pick-omit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/pick-omit.svg)](https://www.npmjs.com/package/@philiprehberger/pick-omit)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/ts-pick-omit)](https://github.com/philiprehberger/ts-pick-omit/commits/main)

Type-safe shallow and deep pick/omit utilities for JavaScript objects

## Installation

```bash
npm install @philiprehberger/pick-omit
```

## Usage

```ts
import { pick, omit } from '@philiprehberger/pick-omit';

pick({ a: 1, b: 2, c: 3 }, 'a', 'c'); // { a: 1, c: 3 }
omit({ a: 1, b: 2, c: 3 }, 'b');      // { a: 1, c: 3 }
```

### Deep pick/omit

```ts
import { deepPick, deepOmit } from '@philiprehberger/pick-omit';

const user = { name: 'Alice', address: { city: 'NYC', zip: '10001' } };

deepPick(user, 'name', 'address.city'); // { name: 'Alice', address: { city: 'NYC' } }
deepOmit(user, 'address.zip');          // { name: 'Alice', address: { city: 'NYC' } }
```

### Predicate-based filters

```ts
import { pickBy, omitBy } from '@philiprehberger/pick-omit';

pickBy({ a: 1, b: null, c: 'ok' }, (v) => v != null); // { a: 1, c: 'ok' }
omitBy({ a: 1, b: null, c: 'ok' }, (v) => v == null); // { a: 1, c: 'ok' }
```

### Pick by `typeof`

```ts
import { pickByType } from '@philiprehberger/pick-omit';

const obj = { name: 'Alice', age: 30, active: true };

pickByType(obj, 'string');  // { name: 'Alice' }
pickByType(obj, 'number');  // { age: 30 }
pickByType(obj, 'boolean'); // { active: true }
```

### Flatten and unflatten

```ts
import { flatten, unflatten } from '@philiprehberger/pick-omit';

const nested = { user: { name: 'Alice', tags: ['admin', 'staff'] } };

const flat = flatten(nested);
// { 'user.name': 'Alice', 'user.tags.0': 'admin', 'user.tags.1': 'staff' }

unflatten(flat);
// { user: { name: 'Alice', tags: ['admin', 'staff'] } }

flatten({ a: { b: 1 } }, '/'); // { 'a/b': 1 }
```

## API

| Method | Description |
|--------|-------------|
| `pick(obj, ...keys)` | Returns a new object with only the specified keys |
| `omit(obj, ...keys)` | Returns a new object without the specified keys |
| `deepPick(obj, ...paths)` | Picks nested values using dot-notation paths |
| `deepOmit(obj, ...paths)` | Removes nested values using dot-notation paths |
| `pickBy(obj, predicate)` | Picks entries where the predicate returns `true` |
| `omitBy(obj, predicate)` | Omits entries where the predicate returns `true` |
| `pickByType(obj, typeName)` | Keeps properties whose `typeof` matches `typeName` |
| `flatten(obj, separator?)` | Converts a nested object/array into a flat dot-notation map |
| `unflatten(obj, separator?)` | Inverse of `flatten`; numeric segments become array indices |

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

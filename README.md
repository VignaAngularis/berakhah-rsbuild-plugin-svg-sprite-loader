# @berakhah/rsbuild-plugin-svg-sprite-loader

Example plugin for Rsbuild.

<p>
  <a href="https://npmjs.com/package/@berakhah/rsbuild-plugin-svg-sprite-loader">
   <img src="https://img.shields.io/npm/v/@berakhah/rsbuild-plugin-svg-sprite-loader?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/@berakhah/rsbuild-plugin-svg-sprite-loader?minimal=true"><img src="https://img.shields.io/npm/dm/@berakhah/rsbuild-plugin-svg-sprite-loader.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

## Usage

Install:

```bash
npm add @berakhah/rsbuild-plugin-svg-sprite-loader -D
```

Add plugin to your `rsbuild.config.ts`:

```ts
// rsbuild.config.ts
import { pluginExample } from "@berakhah/rsbuild-plugin-svg-sprite-loader";

export default {
  plugins: [pluginExample()],
};
```

## Options

### foo

Some description.

- Type: `string`
- Default: `undefined`
- Example:

```js
pluginExample({
  foo: "bar",
});
```

## License

[MIT](./LICENSE).

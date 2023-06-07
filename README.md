# UnoMario

`UnoMario` is a lightweight library that combines custom CSS value [handlers](https://github.com/unocss/unocss/blob/main/packages/preset-mini/src/_utils/handlers/handlers.ts) into the pipeline for processing strings and returning generated CSS styles. Compared to the [built-in implementation](https://github.com/unocss/unocss/blob/main/packages/core/src/utils/handlers.ts#L10), the library grants you complete control over every aspect of the process.

If you are willing to help, feel free to do your magic 🧙🏻‍♂️ 

Here are ongoing plans:

- [ ] Create a list of basic handlers;
- [ ] Replicate TailwindCSS preset using EM units.

## Getting Started

To install the library running the following command:

```bash
npm i -D unomario @unocss/core
```

Create a set of handlers: 

```ts
// handlers.ts
import type { UnoHandler } from 'unomario'

export const auto: UnoHandler<{ skip: boolean }> = (str, ctx) => !ctx?.skip && str === 'auto' ? 'auto' : null
export const bracket: UnoHandler = str => str && str.startsWith('[') && str.endsWith(']') ? str.slice(1, -1) : null
```

Create an instance of the library using your handlers and write your `DynamicRule`:

```ts
import { defineConfig } from 'unocss'
import { Mario } from 'unomario'
import * as handlers from './handlers'

const mario = new Mario(handlers)

const sizeMap = {
  h: 'height',
  w: 'width',
}

export default defineConfig({
  
  /**
   * @example
   *  min-w-[44vw]  → min-width: 44vw;
   *  h-auto        → height: auto;
   *  max-w-auto    → no styles, no selectors 🫢
   */
  rules: [
    [/^(min-|max-)(w|h)-(.+)$/, ([_, minmax = '', hw, size]) => mario
      .pipe('bracket')
      .pipe('auto', { skip: minmax === 'max-' }) // max-width doesn't have the `auto` value
      .toStyles(`${minmax}${sizeMap[hw]}`, size)
    ]
  ]
})
```

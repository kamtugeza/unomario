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
import type { UnoMapper } from 'unomario'

function auto(opts?: { skip?: boolean }): UnoMapper {
  return val => !opts?.skip && val === 'auto' ? 'auto' : null
}

function bracket(): UnoMapper {
  return val => val.startsWith('[') && val.endsWith(']') ? val.slice(1, -1) : null
}
```

Do magic and build `DynamicRules` using your handlers created earlier

```ts
import { defineConfig } from 'unocss'
import { Mario } from 'unomario'
import { auto, bracket } from './handlers'

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
    [/^(min-|max-)(w|h)-(.+)$/, ([_, minmax = '', hw, size]) =>
      Mario.of(`${minmax}${sizeMap[hw]}`, size)
        .toStyles(
          bracket(),
          auto({ skip: minmax === 'max-' }) // max-width doesn't have the `auto` value
        )
    ]
  ]
})
```

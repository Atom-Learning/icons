# Icons

This package exports the [Ikonate](https://ikonate.com/) icon set as React components alongside custom icons specific to Atom Learning.

## Installation & usage

```bash
yarn add @atom-learning/icons
```

```jsx
import { Danger } from '@atom-learning/icons`

const Component = () => (
  <Danger />
)
```

To use alongside the `@atom-learning/components` package, you can combine any imported icon with the `Icon` primitive to provide a set of default sizes and props for styling.

```jsx
import { Icon } from '@atom-learning/components`
import { Danger } from '@atom-learning/icons`

const Component = () => (
  <Icon is={Danger} css={{ color: 'red' }} size="lg" />
)
```

## Contributing

Custom SVG icons can be added to `./src` and will automatically be bundled. When adding to the custom icon set you must follow the following guidelines:

- The `viewBox` must be `0 0 24 24` and no `height` or `width` should be set
- Visually the contents of the icon should work when `stroke-width: 2` and `fill: none` are applied

You can remove all attributes that we default to in our `@atom-learning/components` `Icon` component to save on file size:

  - `fill` (default `fill="none"`)
  - `stroke` (default `stroke="currentcolor"`)
  - `stroke-linecap` (default `stroke-linecap="round"`)
  - `stroke-linejoin` (default `stroke-linejoin="round"`)
  - `stroke-width` (default `stroke-width="2"`)

However, you may include these if necessary if you need to override these default styles used above, e.g. `fill="currentColor"` and `stroke-width="0"` for a filled path

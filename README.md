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

Custom SVG icons can be added to `./src` and will automatically be bundled, when adding to the custom icon set you must follow the following guidelines:

- The `viewBox` must be `0 0 24 24`
- No `height` or `width` should be set
- Visually the contents of the icon should work when `stroke-width: 2` and `fill: none` are applied

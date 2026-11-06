# @neja-digital/css

Plain CSS for the Neja Digital design system: design tokens, component styles and page sections. It is used together
with `@neja-digital/react-ui`, but works on its own with plain HTML.

## Install and use

Needs access to the private `@neja-digital` GitHub Packages registry.

```
pnpm add @neja-digital/css
```

```css
@import '@neja-digital/css/index.css';
```

or, in a bundler, `import '@neja-digital/css/index.css';`.

The package ships one built, minified file (`dist/index.css`, about 12 kB). `index.css` and `.` both resolve to it.
The source folders (`vars/`, `components/`, `sections/`) are included for reading, but they are **not usable on their
own**: breakpoints are written as `@custom-media` and nesting is used, and both are resolved by `pnpm build`. Always
import the package entry point, never a file from the source folders.

### Browser support

Chrome and Edge 111+, Firefox 113+, Safari and iOS Safari 16.4+ (early 2023 and newer). This is what lets the CSS use
`color-mix()` and `:is()` / `:where()` without fallbacks. The baseline is defined in `scripts/build.mjs`; CSS nesting
is lowered by the build, so it is not a requirement.

## Themes and colours

A theme is a set of CSS variables (colour tokens). The package ships a light and a dark theme, and everything is
built on the tokens, so a client can add any number of their own themes.

| Token | Role |
| --- | --- |
| `--background` | page background |
| `--surface` | panels, cards and sections that sit on the background |
| `--surface-raised` | elements stacked above a surface (menus, modals, nested cards) |
| `--text`, `--text-muted` | body and secondary text; must be readable on all three surfaces |
| `--border-color` | dividers and control borders |
| `--focus-ring` | keyboard focus outline |
| `--shadow-rgb` | shadow colour as space-separated `r g b` (`16 24 40`; dark themes use `0 0 0`) |
| `--primary`, `--secondary`, `--accent` | brand fills |
| `--success`, `--warning`, `--danger` | status fills |
| `--on-primary`, `--on-secondary`, `--on-accent`, `--on-success`, `--on-warning`, `--on-danger` | text/icon colour to use **on top of** the matching fill; must be readable on it |

Surfaces have no `--on-*` partner: `--text` is the text colour for them.

### Choosing a theme

Set `data-theme` on `<html>`, or on any wrapper element to theme just that part of the page:

| Value | Result |
| --- | --- |
| none, or `light` | the light baseline |
| `dark` | the dark theme |
| `auto` | follows the visitor's OS setting (`prefers-color-scheme`): light or dark |

`.nj-theme` and any `[data-theme]` element also paint `--background` and `--text`, so a themed region has the right
background and text colour. Nothing is painted until you opt in with one of these.

### Adding your own themes

Override any of the tokens under your own `data-theme` value. Tokens you leave out keep the light baseline value, so
a theme can be as small as one colour. Use `vars/colors.css` (the `dark` block) as a starting point.

```css
[data-theme='forest'] {
  color-scheme: dark; /* so native controls (scrollbars, inputs) match */
  --background: #0f1a14;
  --surface: #16261d;
  --text: #e6f0ea;
  --primary: #5fbf8a;
  --on-primary: #08140d;
}
```

```js
document.documentElement.dataset.theme = 'forest';
```

Check contrast yourself when adding a theme: `--text` and `--text-muted` on every surface, and each `--on-X` on its
`--X`.

## Component variables

Components read their colours from variables with sensible defaults, so they look right with no setup. Set a variable
on the element (or any parent) to change it. `@neja-digital/react-ui` sets these for you from its `njColor` props.

| Variable | Used by | Default |
| --- | --- | --- |
| `--button-color`, `--input-color`, `--select-color`, `--textarea-color` | fill/accent of `.variant-solid` and `.variant-light` controls | `--primary` |
| `--button-on-color`, `--input-on-color`, `--select-on-color`, `--textarea-on-color` | text on a solid control | `--on-primary` |
| `--card-color` | `.nj-card` background | `--surface` |
| `--section-background-color` | `.nj-full-section` background | `transparent` |
| `--mobileBg`, `--tabletBg`, `--tabletHBg`, `--desktopBg` | `.nj-hero` background images (`url(...)`) | each falls back to the previous size, down to `--mobileBg` |
| `--overlay-opacity`, `--content-blur` | hero overlay opacity and content blur | `0.4`, `none` |
| `--navbar-*` | navbar (see the comment at the top of `components/navbar.css`) | `--navbar-color` defaults to `--primary` |

## Design tokens

- **Spacing:** `--spacer-3xs` to `--spacer-3xl`, in rem (2px to 64px at the default font size).
- **Type:** `--text-3xs` to `--text-3xl`, in rem. `--text-2xl` and `--text-3xl` are fluid (`clamp()`): they shrink
  smoothly on phones and reach their full size (2rem, 2.5rem) at 800px and up.
- **Borders:** `--border-thin|medium|thick` (px, so hairlines stay thin) and `--border-radius-*` (rem).
- **Shadows:** `--box-shadow-tight|medium|large|emphasized`, coloured by `--shadow-rgb`.
- **Breakpoints:** mobile first, defined once in `vars/breakpoints.css` as `@custom-media`: `--mobile-std` 360px,
  `--phablet` 480px, `--tablet` 600px, `--small-laptop` 768px, `--desktop` 1024px, `--desktop-large` 1440px. They
  are resolved at build time, so they work inside this package only (`@media (--tablet)`); in your own CSS use the
  pixel values.

Everything is rem-based so the layout follows the user's browser font-size setting. Don't override
`html { font-size }` with a fixed pixel value.

## Modifier classes

Components take shared modifier classes (react-ui builds them from its props): `size-*`, `text-*`, `variant-solid|light`,
`rounded-*`, `border-*`, `raised-*`. These are **global and unprefixed**, so they can collide with other CSS on the
page. A prefixed version is planned.

## Reduced motion

When the visitor has "reduce motion" turned on in their OS, every `nj-` element drops its transitions and animations
(one block at the end of `components/shared.css`). Components added later are covered automatically.

## Development

```
pnpm install
pnpm build   # bundles index.css into dist/index.css
```

Release: bump `version`, commit, tag `vX.Y.Z`, publish a GitHub release (the workflow installs, builds and publishes).
`@neja-digital/css` and `@neja-digital/react-ui` share minor and major versions; patch releases are independent.

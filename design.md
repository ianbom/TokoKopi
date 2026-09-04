# Declasse Coffee Design System

Last synchronized: **September 3, 2026**.

This document is the visual source of truth for customer-facing Declasse pages. The direction follows the editorial coffee storefront shown in `design/new-welcome.png`: bright white space, deep teal structure, restrained gold accents, full-bleed photography, thin grid lines, and condensed campaign typography.

## Source of Truth

Use these files in order:

1. `resources/css/app.css` for tokens, fonts, radii, focus, shadows, and motion.
2. `resources/js/layouts/shop-layout.tsx` for the storefront shell.
3. `resources/js/components/Navbar.tsx` and `resources/js/components/Footer.tsx` for global navigation.
4. `resources/js/pages/welcome.tsx` for canonical editorial composition.
5. This document for extending the design consistently.

Generated Wayfinder files are never edited manually. Customer navigation uses generated route helpers.

## Brand Direction

Declasse is a contemporary specialty-coffee brand. The interface is:

- clean and predominantly white,
- structured by thin teal dividers,
- editorial rather than card-heavy,
- photographic and product-led,
- compact in navigation and metadata,
- expressive through large condensed headlines,
- accented with gold only for actions and small emphasis.

Avoid brown-heavy café palettes, beige page backgrounds, gradients, glassmorphism, detached SaaS cards, large shadows, excessive decoration, and inconsistent local hex colors.

## Core Palette

Always use semantic Tailwind tokens from `app.css`.

| Role       | Token                          | Value     | Usage                                      |
| ---------- | ------------------------------ | --------- | ------------------------------------------ |
| White      | `canvas`, `background`, `card` | `#ffffff` | Page, header, product cells, light panels  |
| Teal       | `teal`, `ink`, `surface-dark`  | `#135d60` | Brand text, dark panels, footer, marquee   |
| Gold       | `primary`, `accent`            | `#dbac5e` | Arrows, active emphasis, CTA highlights    |
| Warm white | `sand`, `surface-soft`         | `#f8f8f5` | Quiet image support and secondary surfaces |
| Stone      | `oat`, `surface-muted`         | `#dedad3` | Muted separators and neutral support       |
| Body teal  | `body`                         | `#315e60` | Supporting copy on white                   |
| Muted teal | `muted-foreground`             | `#718482` | Secondary labels and helper text           |

Rules:

- White must remain the dominant storefront color.
- Teal owns headings, navigation, structural bands, and footer surfaces.
- Gold is an accent, never a large page background.
- Borders use translucent teal through `hairline` or `hairline-strong`.
- New pages must not add page-local brand hex values.

## Typography

| Role      | Font             | Utility          | Usage                                      |
| --------- | ---------------- | ---------------- | ------------------------------------------ |
| Interface | DM Sans          | `font-sans`      | Navigation, labels, body, prices, controls |
| Wordmark  | Bodoni Moda      | `font-serif`     | Declasse logo only or rare editorial names |
| Campaign  | Barlow Condensed | `font-condensed` | Hero and campaign statements               |

Typography rules:

- Major statements use condensed uppercase text, line-height `0.81–0.84`, and tight negative tracking.
- Wordmark remains serif, centered, normal case, and lightly tracked inward.
- Navigation and metadata use `10–12px`, uppercase, medium or semibold weight.
- Body copy generally uses `12–14px` with compact `16–20px` line-height.
- Prices use tabular numerals and Indonesian Rupiah formatting.
- Do not use serif as the default product-card headline.

Canonical scale:

- Wordmark: `30–46px`.
- Hero statement: `clamp(64px, 8vw, 138px)`.
- Editorial statement: `clamp(56px, 5.8vw, 95px)`.
- Category statement: `clamp(52px, 5vw, 82px)`.
- Product name: `12–14px` uppercase.

## Structure

Storefront composition is a connected grid, not a stack of floating cards.

- Sections touch each other directly.
- Use `1px` semantic hairlines between cells.
- Desktop editorial sections normally use balanced two-column grids.
- Product strips use two columns on mobile and four on large screens.
- Images remain full-bleed inside their grid cell.
- Avoid outer rounded containers and large section gaps.
- Default section padding is `28px` mobile, `48–56px` desktop.

## Buttons and Links

Primary editorial CTAs use a restrained outlined pill matching the reference.

- Border: current teal or gold.
- Radius: fully rounded.
- Height is compact; use `10–11px` uppercase copy.
- Arrow uses gold.
- Hover may invert to gold with teal text.
- Do not use gradients, heavy shadows, or oversized buttons.

Administrative controls may keep their existing square control language. This pill rule applies to the customer storefront editorial CTA only.

## Storefront Shell

`ShopLayout` provides:

- white page background,
- teal default foreground,
- sticky global Navbar,
- full-width growing main area,
- global Toaster,
- global Footer,
- horizontal overflow protection.

Pages own their sections. Do not place the whole customer page inside a detached centered card.

## Navbar

Desktop:

- White background with one teal hairline below.
- Internal height around `68px`.
- Three-column grid: left navigation, centered wordmark, right utilities.
- Left: Shop, Subscriptions, Story.
- Center: Declasse serif wordmark.
- Right: Search, Account, Bag count.
- Text remains small, uppercase, and teal.
- Hover uses gold.

Mobile:

- Keep wordmark and Bag visible.
- Use one menu icon only.
- Open a full-screen white drawer from the right.
- Separate navigation rows with teal hairlines.
- Preserve accessible open and close labels.

## Canonical Homepage

### Split Hero

- Desktop uses equal white-copy and lifestyle-image columns.
- Mobile stacks copy before image.
- Copy panel distributes intro, CTA, and oversized headline vertically.
- Hero photography is full-height, lightly desaturated, and editorial.

Canonical statement:

```text
COFFEE
WITHOUT
THE ROUTINE.
```

### Marquee

- Teal background, white `10px` uppercase copy.
- Compact height around `32px`.
- Short gold dividers separate phrases.
- Keep the strip horizontally clipped.

### Product Strips

- Use real Inertia product props, never frontend dummy arrays.
- Two columns mobile, four columns desktop.
- White cells with shared teal hairlines.
- Image above, centered metadata below.
- Show two-digit index, uppercase product name, one-line category/description, and Rupiah price.
- No wishlist, badge, floating overlay, or rounded card shell.
- Use a product image fallback only when backend image data is empty.

### Editorial Story

- Balanced image and teal copy panel.
- Gold eyebrow and text action.
- White condensed headline and supporting copy.
- Image and panel share a direct edge without gap or radius.

### Ritual Categories

- Left side contains campaign statement and compact category links.
- Category links use hairline divisions and gold arrows.
- Right side uses full-bleed coffee photography.

### Closing Campaign

- White copy panel paired with full-bleed lifestyle photography.
- Repeat the large teal condensed statement language.
- Use one compact outline CTA.

## Footer

Footer uses one continuous teal field.

- Subscription band uses white copy, teal background, white translucent dividers, and gold CTA treatment.
- Newsletter and link columns remain compact and aligned to the grid.
- Inputs use transparent backgrounds with a light bottom border.
- Link hover uses gold.
- Legal row uses small uppercase neutral text.
- No contrasting brown or terracotta footer block.

## Images

- Prefer high-resolution coffee product and ritual photography.
- Use `object-cover` for full-bleed editorial images.
- Product images may use `object-cover` within a warm-white support cell.
- Keep color treatment restrained with mild saturation or contrast adjustments.
- Provide meaningful alt text.
- Avoid low-resolution crops and decorative imagery unrelated to coffee.

## Motion and Accessibility

- Default interaction duration: `200ms`.
- Image hover scale: maximum `1.025` over `500ms`.
- Mobile drawer: `300ms` horizontal transform.
- Keyboard focus: visible `2px` teal outline with offset.
- Maintain WCAG-readable white/teal contrast.
- Respect reduced-motion preferences for nonessential motion.
- Controls require accessible names and keyboard operation.

## Responsive Rules

- Mobile is the default layout.
- Stack split sections below `lg` unless a smaller split remains readable.
- Product grids use `2 → 4` columns.
- Keep headline clamps; do not hardcode desktop sizes on mobile.
- Prevent horizontal overflow in marquee, navigation, and grid sections.
- Do not hide essential shopping actions on mobile.

## Review Checklist

- Dominant background is white.
- Brand structure uses `#135d60` teal.
- Accent is limited to `#dbac5e` gold.
- Sections share edges and hairlines.
- Hero and editorial headings use condensed uppercase typography.
- Navbar wordmark remains centered.
- Product grids use backend data and Rupiah pricing.
- Footer is a continuous teal composition.
- No old beige, brown, or terracotta visual dominance remains.
- Mobile layout has no overflow and all actions remain reachable.

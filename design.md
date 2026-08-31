# Declasse Coffee Design System

Last synchronized: **August 31, 2026**.

This document is the visual and implementation reference for future customer-facing pages. It describes the design already established by the active storefront, not a separate aspirational redesign.

## Source of Truth

Use these files in this order when resolving inconsistencies:

1. `resources/css/app.css` for fonts, colors, radii, shadows, focus states, and global motion.
2. `resources/js/layouts/shop-layout.tsx` for the storefront shell.
3. `resources/js/components/Navbar.tsx` and `resources/js/components/Footer.tsx` for global navigation.
4. `resources/js/pages/welcome.tsx` for the canonical editorial page composition.
5. This document for applying those patterns consistently to new pages.

If this document and active source code disagree, active source code wins. Update this document in the same change whenever the design language changes intentionally.

## Brand Direction

Declasse is a contemporary specialty-coffee storefront with an editorial, fashion-influenced visual language.

The interface should feel:

- warm,
- calm,
- structured,
- premium,
- photographic,
- product-focused,
- direct rather than decorative.

Visual character comes from typography, full-bleed photography, thin borders, split layouts, controlled contrast, and generous negative space.

Avoid generic café styling, rustic wood textures, brown-heavy palettes, glassmorphism, floating SaaS cards, large soft shadows, decorative gradients, and excessive rounded corners.

## Design Tokens

### Typography

The storefront uses three font families defined in `app.css`:

| Role              | Font             | Tailwind utility | Usage                                                 |
| ----------------- | ---------------- | ---------------- | ----------------------------------------------------- |
| Interface         | DM Sans          | `font-sans`      | Navigation, body copy, controls, prices, captions     |
| Editorial serif   | Bodoni Moda      | `font-serif`     | Declasse wordmark and product-card names              |
| Display condensed | Barlow Condensed | `font-condensed` | Hero statements, campaign headings, footer statements |

Typography rules:

- Use condensed uppercase display text for major editorial statements.
- Use the serif selectively; it is not the default body or heading font.
- Keep navigation and metadata small, uppercase, and letter-spaced.
- Use tight line-height and negative tracking on large display headings.
- Use compact body copy with a restrained line length.
- Preserve tabular numerals for prices, quantities, and counts.
- Headings use balanced wrapping; prose uses pretty wrapping through global CSS.

Canonical scales from the active storefront:

- Wordmark: `text-3xl` to `lg:text-[46px]`.
- Hero display: responsive `clamp(64px, 8vw, 138px)`, line-height near `0.81`.
- Story display: responsive `clamp(56px, 5.8vw, 95px)`.
- Section display: responsive `clamp(56px, 5.7vw, 100px)`.
- Product-card name: serif `20–28px`.
- Body: typically `14px` with `20px` line-height.
- Navigation: `11–12px` uppercase.
- Labels and marquee: `10–11px` uppercase.

### Color Palette

Use semantic Tailwind tokens. Do not introduce page-local hex values when an existing token fits.

| Token               | Value                  | Primary usage                                            |
| ------------------- | ---------------------- | -------------------------------------------------------- |
| `canvas`            | `#FAF6EE`              | Global page background, light surfaces                   |
| `sand`              | `#F2E7D8`              | Hero copy panels, alternate warm sections                |
| `oat`               | `#DDD0BA`              | Muted surfaces, image support areas                      |
| `ink`               | `#1F2923`              | Text, borders, dark sections, primary structure          |
| `primary`           | `#B65C3A`              | Interaction accent, subscription band, selected emphasis |
| `primary-hover`     | `#A75034`              | Accent hover state                                       |
| `primary-active`    | `#8F432B`              | Accent pressed state                                     |
| `primary-soft`      | `#F4E0D6`              | Soft accent surface                                      |
| `hairline`          | `rgb(31 41 35 / 0.18)` | Default structural divider                               |
| `hairline-strong`   | `rgb(31 41 35 / 0.32)` | Stronger control or section divider                      |
| `surface-soft`      | `#F7F1E8`              | Quiet secondary surface                                  |
| `surface-dark`      | `#1F2923`              | Story sections and footer                                |
| `surface-dark-soft` | `#2B352E`              | Secondary dark surface                                   |
| `body`              | `#344039`              | Secondary body text                                      |
| `muted-soft`        | `#6F786F`              | Muted supporting text                                    |

Usage hierarchy:

1. Canvas and sand dominate the page.
2. Ink provides structure and high contrast.
3. Oat supports muted image or content regions.
4. Terracotta is reserved for meaningful emphasis and interaction.

Do not use terracotta as the only indicator of state. Pair color with text, weight, border, or position.

### Borders

Borders are the main layout device.

- Use `border-hairline` for modular section dividers.
- Use `border-ink` for the global header boundary.
- Use light cream borders over photographic or dark product cards.
- Prefer shared borders between grid cells over gaps and floating cards.
- Let photography reach the border edge.

### Radius

The theme radius tokens are all `0px`. The default interface is sharp.

- Buttons, CTA links, and navigation controls use sharp `0px` corners.
- Do not use pill-shaped controls in the storefront or authentication flows.

### Shadows

The storefront remains mostly flat.

| Token             | Value                              | Usage                       |
| ----------------- | ---------------------------------- | --------------------------- |
| `shadow-subtle`   | `0 1px 2px rgb(31 41 35 / 0.06)`   | Small utility emphasis only |
| `shadow-dropdown` | `0 10px 28px rgb(31 41 35 / 0.14)` | Dropdown menus              |
| `shadow-modal`    | `0 24px 64px rgb(31 41 35 / 0.20)` | Modal overlays              |

Do not add shadows to ordinary cards or editorial sections.

### Motion

- Global interactive transition duration is `200ms`.
- Image hover scale may use `500ms` and should remain subtle, around `1.025`.
- Mobile navigation uses a `300ms` horizontal transform.
- Motion must clarify state, not decorate the page.
- Respect reduced-motion preferences for any new nonessential animation.

### Focus and Selection

- Interactive elements receive a visible `2px` ink outline with offset.
- Text selection uses an ink background with canvas text.
- Never remove keyboard focus without an equivalent visible replacement.

## Storefront Shell

All customer-facing commerce pages should use `ShopLayout`.

The shell provides:

- a flex column with `min-h-screen`,
- canvas background,
- sans-serif interface typography,
- ink foreground,
- horizontal overflow protection,
- global Navbar,
- a full-width growing main region,
- global Toaster,
- global Footer.

Pages own their internal sections. Do not add a second page-wide card or unrelated outer container inside the shell.

## Navbar

### Desktop

The active Navbar is sticky, full-width, and capped internally at `1600px`.

- Height: `64px` base, `76px` at large screens.
- Background: canvas.
- Bottom border: solid ink.
- Layout: three-column grid, `1fr auto 1fr`.
- Left: Shop, Subscriptions, Story.
- Center: Declasse serif wordmark.
- Right: Search, Account, Bag count.
- Hover: terracotta text or reduced wordmark opacity.

Bag count is always visible and formatted with at least two digits; values above 99 display `99+`.

### Mobile

- Keep the wordmark centered within the grid.
- Keep Bag visible.
- Hide desktop navigation utilities.
- Use a 40px menu trigger.
- Open a full-viewport canvas drawer from the right.
- Use large uppercase rows separated by hairlines.
- Include Shop, Subscriptions, Story, Account, and Bag.
- Provide explicit open and close labels for assistive technology.

Do not use a floating hamburger card, blurred header, or translucent backdrop.

## Footer

The Footer is part of every `ShopLayout` page and has three layers.

### Subscription Band

- Background: primary terracotta.
- Text: canvas.
- Desktop grid: `1fr 1.2fr 1fr`.
- Use white dividers at 20% opacity.
- First cell: condensed campaign statement.
- Second cell: compact explanatory copy and a sharp outline CTA.
- Third cell: quiet oat color block on medium screens and above.

### Newsletter and Link Grid

- Background: surface-dark.
- Desktop grid: wide newsletter column plus Shop, About, and Follow columns.
- Newsletter uses a condensed statement and bottom-border-only email field.
- Link hover color is terracotta.
- Keep footer links small and calm; hierarchy comes from spacing and typography.

### Legal Row

- Use small uppercase oat text.
- Stack on mobile; align horizontally from small screens upward.
- Include copyright, Privacy, Shipping, and Terms.

## Canonical Homepage Composition

`welcome.tsx` is the canonical example for building editorial storefront pages.

### 1. Split Hero

- Desktop uses two balanced columns.
- Left panel uses sand and substantial padding.
- Left content is vertically distributed: short prose, sharp outline CTA, oversized condensed statement.
- Right panel is full-height lifestyle photography.
- Mobile stacks content before image.
- Images remain full-bleed and use restrained saturation or contrast adjustments.

Canonical statement style:

```text
COFFEE
WITHOUT
THE ROUTINE.
```

### 2. Announcement Strip

- Background: surface-dark.
- Text: canvas.
- Height is compact, currently at least `32px`.
- Use uppercase `10px` copy with wide tracking.
- Separate phrases with short oat hairlines.
- Current implementation is static, not an animated marquee.

### 3. Product Image Grid

- Two columns on mobile, four columns on large screens.
- Use shared borders and no card gap.
- Default card ratio is `4/5`; square from small screens upward.
- Product photography fills the card.
- Add a dark top-to-bottom readability scrim.
- Show a two-digit index at the top-left.
- Place serif product name, supporting label, and price at the bottom-left.
- Use subtle image scale on hover.
- Do not add badges, rounded containers, or detached text panels by default.

### 4. Story Split

- Two equal columns on large screens.
- Photography occupies one side edge-to-edge.
- Surface-dark editorial copy occupies the other side.
- Use an oat uppercase eyebrow, large condensed statement, compact body copy, and a small terracotta text link.
- Mobile stacks the image above the copy panel.

### 5. Secondary Product Grid

Reuse the product-grid language instead of inventing a second card system. Content may change; structure should remain consistent.

### 6. Closing Campaign Split

- Use an asymmetric desktop split around `0.9fr 1.1fr`.
- Copy panel contains compact prose, a condensed multiline statement, and sharp outline CTA.
- Image remains full-bleed.
- Mobile stacks copy before image.

### 7. Footer

Do not create a page-specific homepage footer. Use the global Footer supplied by `ShopLayout`.

## Reusable Composition Patterns

### Editorial Split

Use for heroes, brand stories, policy introductions, account highlights, and campaigns.

- Prefer CSS Grid.
- Keep one side photographic and one side typographic.
- Use borders rather than gap-based floating panels.
- Stack in reading order on mobile.

### Modular Grid

Use for product catalogs, related products, category navigation, and structured data.

- Share hairline borders.
- Keep cells square or intentionally editorial in proportion.
- Avoid independent rounded card shells.
- Preserve clear hover and focus states.

### Dark Editorial Panel

Use surface-dark with canvas text for one meaningful story section, not as a repeated alternating stripe.

- Eyebrow: small uppercase oat.
- Heading: condensed uppercase.
- Body: narrow and compact.
- Link: restrained terracotta.

### Outline Pill CTA

Use for quiet editorial actions such as Shop Coffee or Start a Subscription.

- Transparent background.
- Current-color 1px border.
- Rounded full.
- Small uppercase copy.
- Compact horizontal padding.
- Include a simple arrow.

Primary commerce actions remain sharp and filled; buttons never use pill corners.

## Responsive Rules

Follow Tailwind's mobile-first breakpoints used by the active codebase.

### Mobile

- Page sections stack vertically.
- Product grids remain two columns where product recognition remains clear.
- Use `20–32px` horizontal padding depending density.
- Keep photography prominent.
- Use the fullscreen navigation drawer.
- Footer columns stack or use a simple two-column arrangement.

### Medium Screens

- Activate desktop navigation at `md`.
- Footer subscription band becomes three columns.
- Footer content begins splitting into multiple columns.

### Large Screens

- Use split editorial sections.
- Use four-column product grids.
- Increase section padding to approximately `40–64px`.
- Keep global navigation content capped at `1600px`.

Do not center every section inside a narrow container. The established storefront is predominantly full-bleed with controlled internal padding.

## Photography

- Use high-resolution product or coffee lifestyle photography.
- Prefer architectural light, natural shadow, warm surfaces, and minimal compositions.
- Use `object-cover` for editorial image cells.
- Preserve consistent crop intent across responsive sizes.
- Add meaningful alt text for content images; decorative repeats use empty alt text.
- Avoid decorative coffee-bean patterns and low-quality café stock imagery.

## Content Hierarchy

New customer pages should generally prioritize:

1. page identity,
2. primary customer action,
3. product or service imagery,
4. supporting information,
5. secondary navigation.

Keep metadata and helper copy visually quieter than titles and primary actions.

## Accessibility

- Use semantic headings in document order.
- Use buttons for actions and links for navigation.
- Keep visible labels or accessible names on icon-only controls.
- Maintain the global focus-visible treatment.
- Do not rely on color alone for selection or validation.
- Preserve readable contrast on image overlays.
- Use appropriate alt text.
- Keep primary touch targets near 40–48px.
- Respect reduced-motion preferences for new animation.

## Implementation Defaults

When building a new customer-facing page:

1. Wrap it in `ShopLayout`.
2. Use tokens from `app.css` through Tailwind utilities.
3. Use generated Wayfinder functions for Laravel navigation and forms.
4. Start with full-bleed grid structure and hairline borders.
5. Choose one dominant editorial statement, not several competing displays.
6. Use serif only for the wordmark or selected editorial/product naming.
7. Use real backend data for product and commerce content.
8. Provide responsive image behavior and accessible interactions.
9. Reuse existing patterns before creating a new component language.
10. Update this document if a deliberate global design change is shipped.

## Anti-Patterns

Do not introduce:

- generic brown café palettes,
- pure-black luxury styling,
- gold or neon accents,
- glassmorphism,
- blurred sticky navigation,
- gradient page backgrounds,
- floating card dashboards,
- large rounded content cards,
- shadows on ordinary sections,
- multiple unrelated card systems,
- excessive badges,
- oversized iconography,
- decorative motion without state meaning,
- page-specific headers or footers that duplicate `ShopLayout`,
- hardcoded routes where Wayfinder exists,
- page-local colors that duplicate theme tokens.

## Review Checklist

Before accepting a new customer page, verify:

- It uses `ShopLayout`.
- Typography follows the three established font roles.
- Colors use active semantic tokens.
- Borders create the layout structure.
- Radius and shadows remain restrained.
- The page has a clear editorial hierarchy.
- Mobile reading order is correct.
- Navigation uses Wayfinder.
- Interactions have hover, focus, disabled, and loading states where relevant.
- Images have intentional crops and alt text.
- No dummy commerce data is displayed when backend data exists.
- The page feels consistent beside `welcome.tsx`, Navbar, and Footer.

## Final Standard

Every Declasse storefront page should look like part of one system:

> Specialty coffee, contemporary editorial composition, warm structured commerce.

The result should be recognizable as the same brand even when page content and functionality differ.

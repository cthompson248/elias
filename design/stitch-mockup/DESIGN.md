---
name: Clinical Precision
colors:
  surface: '#f6f7f8'
  surface-dim: '#acbac2'
  surface-bright: '#f6f7f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eaedef'
  surface-container: '#eaedef'
  surface-container-high: '#dbe1e4'
  surface-container-highest: '#acbac2'
  on-surface: '#171d20'
  on-surface-variant: '#5f7581'
  inverse-surface: '#171d20'
  inverse-on-surface: '#f6f7f8'
  outline: '#dbe1e4'
  outline-variant: '#acbac2'
  surface-tint: '#a4152d'
  primary: '#5e0024'
  on-primary: '#ffffff'
  primary-container: '#a4152d'
  on-primary-container: '#fcf4f2'
  inverse-primary: '#f9c9bf'
  secondary: '#165766'
  on-secondary: '#ffffff'
  secondary-container: '#e8f2f4'
  on-secondary-container: '#165766'
  tertiary: '#3b3b3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#eaedef'
  on-tertiary-container: '#5f7581'
  error: '#a51b00'
  on-error: '#ffffff'
  error-container: '#fcf4f2'
  on-error-container: '#a51b00'
  primary-fixed: '#fcf4f2'
  primary-fixed-dim: '#f9c9bf'
  on-primary-fixed: '#5e0024'
  on-primary-fixed-variant: '#851024'
  secondary-fixed: '#e8f2f4'
  secondary-fixed-dim: '#c5dde3'
  on-secondary-fixed: '#165766'
  on-secondary-fixed-variant: '#0f3d47'
  tertiary-fixed: '#eaedef'
  tertiary-fixed-dim: '#dbe1e4'
  on-tertiary-fixed: '#171d20'
  on-tertiary-fixed-variant: '#5f7581'
  background: '#f6f7f8'
  on-background: '#171d20'
  surface-variant: '#eaedef'
  success: '#3fa21c'
  on-success: '#ffffff'
  success-container: '#f3faef'
  on-success-container: '#3fa21c'
  warning: '#aa761c'
  on-warning: '#ffffff'
  warning-container: '#fdf8ed'
  on-warning-container: '#734c00'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  sidebar-width: 320px
---

## Brand & Style

This design system is engineered for high-stakes medical environments where clarity, speed of cognition, and trust are paramount. The brand personality is clinical, authoritative, and calm, designed to reduce the cognitive load on healthcare professionals and the anxiety of patients.

The palette aligns with [Australian Red Cross Lifeblood](https://www.lifeblood.com.au/): red is the hero brand colour, but the UI leans on soft warm neutrals and gentle rose/cream tints rather than saturated red everywhere. This mirrors Lifeblood's public-facing site — authoritative without feeling clinical or cold.

The aesthetic follows a **Corporate / Modern** approach with a heavy emphasis on **Minimalism**. It prioritizes functional utility over decorative flair. By utilizing expansive whitespace and a rigorous grid, the system ensures that critical medical data remains the focal point. The emotional response should be one of absolute reliability—the digital equivalent of a clean, well-organized donor centre.

## Colors

The palette is rooted in Lifeblood brand red (#A4152D) with deep Jarrah (#5E0024) for primary actions. Soft rose and cream tints carry most of the surface weight, keeping the interface calm and readable.

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Brand red | `primary-container` | `#A4152D` | Links, accents, active states |
| Deep red | `primary` | `#5E0024` | Primary buttons, pressed states |
| Soft rose | `primary-fixed` | `#FCF4F2` | Info banners, selected rows |
| Rose border | `primary-fixed-dim` | `#F9C9BF` | Subtle primary borders |
| Teal | `secondary` | `#165766` | Focus rings, secondary accent |
| Background | `surface` | `#F6F7F8` | App background |
| Insights panel | `surface-container-low` | `#EAEDEF` | Guidance / support sidebar tint |
| Muted text | `on-surface-variant` | `#5F7581` | Labels, secondary copy |
| Border | `outline` | `#DBE1E4` | Card and input borders |
| Success | `success` / `success-container` | `#3FA21C` / `#F3FAEF` | Eligible, cleared, OK |
| Warning | `warning` / `warning-container` | `#AA761C` / `#FDF8ED` | Nurse review, caution |
| Error | `error` / `error-container` | `#A51B00` / `#FCF4F2` | Deferral, high risk |

- **Primary:** Brand red for accents and interactive highlights; deep Jarrah for filled buttons and strong emphasis.
- **Secondary (Teal):** Focus states and secondary UI elements — a calming contrast to the warm red palette.
- **Neutral:** Warm greys (hue 201°, 15% saturation) create hierarchy between surfaces and containers without the cool blue cast of the previous NHS palette.
- **Semantic:** Status colours use Lifeblood's soft tinted backgrounds (rose for error/deferral, cream for warning, green tint for success) with saturated foreground text. Use sparingly to maintain urgency.

## Typography

The system utilizes a dual-font approach for maximum legibility. **Public Sans** is used for headings to provide a sturdy, institutional feel that conveys stability. **Inter** is used for all body copy and data labels due to its exceptional readability in high-density information environments and its neutral, systematic tone.

Text hierarchy is strictly enforced. Labels for data points (e.g., "Blood Pressure") use `label-sm` in uppercase to distinguish them from the data values themselves, which use `body-md` or `title-lg`.

## Layout & Spacing

This design system uses a **Fixed Grid** model on desktop to prevent data rows from becoming too wide to read comfortably.

- **Desktop:** 12-column grid with a 24px gutter. The AI decision-support panel is an integrated right-hand sidebar with a fixed width of 320px, allowing the main content area to reflow beside it.
- **Spacing Rhythm:** An 8px linear scale is used. Generous padding (`lg` or `xl`) must be applied around critical decision points (e.g., "Approve Patient" buttons) to prevent accidental clicks.
- **Information Density:** For data tables and donor lists, the vertical spacing is reduced to `sm` (12px) to allow more records to be visible without scrolling, while maintaining horizontal "breathability" via large margins.

## Elevation & Depth

The system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a clean, calm feel.

- **Level 0 (Background):** #F6F7F8 (warm light grey) for the main application background.
- **Level 1 (Cards/Containers):** #FFFFFF (pure white) with a 1px solid border in #DBE1E4. No shadow.
- **Level 2 (Active/Hover):** #FFFFFF with a subtle, ultra-diffused shadow (0px 4px 12px rgba(0, 0, 0, 0.05)) to indicate interactivity. Selected rows use a soft rose tint (#FCF4F2).
- **Guidance Sidebar:** Uses a slight warm tint (#EAEDEF) to visually separate the "support" layer from the "active" data layer.

## Shapes

The shape language is "Rounded" (8px/0.5rem base) to strike a balance between modern software design and professional approachability.

- **Buttons & Inputs:** Use the base 0.5rem radius.
- **Status Badges:** Use a pill-shape (full radius) to distinguish them from interactive buttons.
- **Data Cards:** Use `rounded-lg` (1rem) to create a soft container for complex data.

## Components

### Buttons
Primary buttons use deep Jarrah (#5E0024) with white text; hover transitions to brand red (#A4152D). Secondary buttons use a teal outline (#165766). Avoid "Ghost" buttons for critical actions; use a light grey background (#EAEDEF) instead to ensure the hit area is visible.

### Status Badges & Flags
Status indicators must include both a colour and a text label (e.g., "DEFERRED") for accessibility. Use Lifeblood's soft tinted backgrounds with saturated foreground text:

- **Eligible / OK:** green on `#F3FAEF`
- **Review / Caution:** gold on `#FDF8ED`
- **Deferred / Error:** brand red on `#FCF4F2`

High-risk flags should include an icon (e.g., an exclamation mark) to ensure they stand out in high-density lists.

### Input Fields
Inputs use a 1px border in `#DBE1E4`. When focused, the border transitions to brand red (#A4152D) with a 2px ring. Error states use semantic red (#A51B00) for the border and a soft rose background (#FCF4F2) with supporting text below the field.

### Guidance Panel
The sidebar is a distinct component. Guidance banners and escalation notices use soft rose (#FCF4F2) or cream (#FDF8ED) backgrounds with matching subtle borders — never full-strength red fills for informational content.

### Lists & Tables
Rows in medical tables should have a hover state (#F6F7F8) and 1px horizontal dividers in #DBE1E4. Use "Sticky" headers for long lists of patient history.

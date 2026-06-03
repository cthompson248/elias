---
name: Clinical Precision
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#424752'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#727783'
  outline-variant: '#c2c6d4'
  surface-tint: '#005db6'
  primary: '#00478d'
  on-primary: '#ffffff'
  primary-container: '#005eb8'
  on-primary-container: '#c8daff'
  inverse-primary: '#a9c7ff'
  secondary: '#006970'
  on-secondary: '#ffffff'
  secondary-container: '#7af1fc'
  on-secondary-container: '#006e75'
  tertiary: '#404850'
  on-tertiary: '#ffffff'
  tertiary-container: '#576068'
  on-tertiary-container: '#d1dae4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468c'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#5dd8e2'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#dbe4ed'
  tertiary-fixed-dim: '#bfc8d0'
  on-tertiary-fixed: '#141d23'
  on-tertiary-fixed-variant: '#3f484f'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
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

The aesthetic follows a **Corporate / Modern** approach with a heavy emphasis on **Minimalism**. It prioritizes functional utility over decorative flair. By utilizing expansive whitespace and a rigorous grid, the system ensures that critical medical data remains the focal point. The emotional response should be one of absolute reliability—the digital equivalent of a clean, well-organized medical facility.

## Colors

The palette is rooted in "NHS Blue" (#005EB8) to instantly signal professional medical authority. 

- **Primary:** Used for primary actions, active navigation states, and branding elements.
- **Secondary (Teal):** Used for supportive UI elements and secondary data visualizations to provide a calming contrast to the primary blue.
- **Neutral:** A range of cool greys is used to create hierarchy between background surfaces and card containers.
- **Semantic:** These colors are used strictly for status indicators. Red signifies high risk or immediate deferral; Amber is reserved for nurse review or caution; Green indicates eligibility or low risk. These must be used sparingly to maintain their urgency.

## Typography

The system utilizes a dual-font approach for maximum legibility. **Public Sans** is used for headings to provide a sturdy, institutional feel that conveys stability. **Inter** is used for all body copy and data labels due to its exceptional readability in high-density information environments and its neutral, systematic tone.

Text hierarchy is strictly enforced. Labels for data points (e.g., "Blood Pressure") use `label-sm` in uppercase to distinguish them from the data values themselves, which use `body-md` or `title-lg`.

## Layout & Spacing

This design system uses a **Fixed Grid** model on desktop to prevent data rows from becoming too wide to read comfortably. 

- **Desktop:** 12-column grid with a 24px gutter. The AI decision-support panel is an integrated right-hand sidebar with a fixed width of 320px, allowing the main content area to reflow beside it.
- **Spacing Rhythm:** An 8px linear scale is used. Generous padding (`lg` or `xl`) must be applied around critical decision points (e.g., "Approve Patient" buttons) to prevent accidental clicks.
- **Information Density:** For data tables and donor lists, the vertical spacing is reduced to `sm` (12px) to allow more records to be visible without scrolling, while maintaining horizontal "breathability" via large margins.

## Elevation & Depth

The system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a sterile, clean feel.

- **Level 0 (Background):** #F8F9FA (Very light grey) for the main application background.
- **Level 1 (Cards/Containers):** #FFFFFF (Pure white) with a 1px solid border in #E9ECEF. No shadow.
- **Level 2 (Active/Hover):** #FFFFFF with a subtle, ultra-diffused shadow (0px 4px 12px rgba(0, 0, 0, 0.05)) to indicate interactivity.
- **AI Sidebar:** Uses a slight tint (#F1F5F9) to visually separate the "support" layer from the "active" data layer.

## Shapes

The shape language is "Rounded" (8px/0.5rem base) to strike a balance between modern software design and professional approachability. 

- **Buttons & Inputs:** Use the base 0.5rem radius.
- **Status Badges:** Use a pill-shape (full radius) to distinguish them from interactive buttons.
- **Data Cards:** Use `rounded-lg` (1rem) to create a soft container for complex data.

## Components

### Buttons
Primary buttons use the Medical Blue background with white text. Secondary buttons use a teal outline. Avoid "Ghost" buttons for critical actions; use a light grey background instead to ensure the hit area is visible.

### Status Badges & Flags
Status indicators must include both a color and a text label (e.g., "DEFERRED") for accessibility. High-risk flags should include an icon (e.g., an exclamation mark) to ensure they stand out in high-density lists.

### Input Fields
Inputs use a 1px border. When focused, the border transitions to Primary Blue with a 2px thickness. Error states use the Semantic Red for the border and a supporting text hint below the field.

### AI Decision-Support Panel
The sidebar is a distinct component. AI-generated suggestions should be styled in a specialized "Intelligence Card" with a subtle Secondary (Teal) left-border accent to distinguish machine logic from manual data entry.

### Lists & Tables
Rows in medical tables should have a hover state (#F8F9FA) and 1px horizontal dividers. Use "Sticky" headers for long lists of patient history.
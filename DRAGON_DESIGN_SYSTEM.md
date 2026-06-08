# DRAGON Unified Design System v1.0

## Overview

The Dragon Design System provides a consistent, cohesive visual and interaction language across all Dragon modules (KASSA, Monitor, Control Panel, Menu Management, Client View, etc.).

All styling is now consolidated into a single **`dragon-theme.css`** file that serves as the single source of truth for the entire application.

## Quick Start

### Linking the Theme

Every HTML file should include the theme link in the `<head>`:

```html
<link rel="stylesheet" href="dragon-theme.css">
```

For subfolders like `dlv_po/`:
```html
<link rel="stylesheet" href="../dragon-theme.css">
```

### Using CSS Variables

The design system is built on CSS custom properties for consistency:

```css
/* Colors */
background: var(--bg-primary);
color: var(--text-primary);
border: 1px solid var(--border-default);

/* Spacing */
padding: var(--spacing-lg);
margin: var(--spacing-md);

/* Shadows */
box-shadow: var(--shadow-md);

/* Transitions */
transition: all var(--transition-base);
```

## Color Palette

### Backgrounds
- `--bg-primary`: #06040d (main background)
- `--bg-secondary`: #130a24 (secondary)
- `--bg-dark`: #030000 (dark accent)
- `--bg-light`: #0c1030 (light accent)

### Text & Content
- `--text-primary`: #f7f2ff (main text)
- `--text-secondary`: #b2a8d2 (secondary text)
- `--text-muted`: #6d5549 (muted text)

### Accent Colors
- `--accent-primary`: #ff160d (primary action)
- `--accent-secondary`: #ff7a24 (secondary action)
- `--accent-blue`: #58b5ff (info accent)
- `--accent-glow`: #b14dff (glowing effect)

### Status Colors
- `--status-new`: #ff160d (new orders)
- `--status-cooking`: #ffe600 (being prepared)
- `--status-ready`: #39ff88 (ready to serve)
- `--status-success`: #37d483 (success)
- `--status-warning`: #ffc55c (warning)
- `--status-danger`: #ff6d7a (danger)

### Borders & Lines
- `--border-default`: rgba(207, 187, 255, 0.12)
- `--border-strong`: rgba(232, 219, 255, 0.22)
- `--border-subtle`: rgba(160, 180, 255, 0.16)

## Spacing System

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px
--spacing-2xl: 32px
--spacing-3xl: 48px
```

**Usage:**
```css
padding: var(--spacing-lg);        /* 16px */
margin: var(--spacing-md);         /* 12px */
gap: var(--spacing-sm);            /* 8px */
```

## Border Radius

```css
--radius-xs: 10px
--radius-sm: 12px
--radius-md: 14px
--radius-lg: 18px
--radius-xl: 26px
--radius-2xl: 28px
--radius-3xl: 32px
--radius-pill: 999px
```

**Common usage:**
```css
border-radius: var(--radius-lg);   /* 18px for cards */
border-radius: var(--radius-pill); /* 999px for pills */
```

## Shadows

```css
--shadow-sm: 0 18px 44px rgba(5, 3, 18, 0.42)
--shadow-md: 0 18px 40px rgba(4, 8, 30, 0.3)
--shadow-lg: 0 28px 80px rgba(4, 8, 30, 0.46)
--shadow-xl: 0 32px 80px rgba(5, 2, 18, 0.62)
--shadow-glow: 0 0 30px rgba(153, 110, 255, 0.18)
--shadow-danger: 0 0 30px rgba(255, 22, 13, 0.22)
```

**Usage:**
```css
box-shadow: var(--shadow-md);  /* Standard elevation */
box-shadow: var(--shadow-glow); /* Highlight/focus state */
```

## Typography

### Font Families
- `--font-display`: Space Grotesk (headings, bold text)
- `--font-body`: Manrope (body text, default)
- `--font-mono`: Courier New (code, technical)

### Font Sizes
Responsive headings are defined automatically:
- `h1`: 2.5rem
- `h2`: 2rem
- `h3`: 1.5rem
- `h4`: 1.25rem
- `h5`: 1.1rem
- `h6`: 1rem

**Mobile:**
- `h1`: 1.5rem
- `h2`: 1.25rem

## Component Classes

### Buttons

**Primary Button:**
```html
<button class="btn btn-primary">Action</button>
```

**Secondary Button:**
```html
<button class="btn btn-secondary">Cancel</button>
```

**Variants:**
```html
<button class="btn btn-success">Confirm</button>
<button class="btn btn-danger">Delete</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-lg">Large</button>
```

### Cards

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

**Alternative (Glass effect):**
```html
<div class="panel">Content with glass background</div>
```

### Badges & Status

```html
<!-- Status badges -->
<span class="badge badge-new">New</span>
<span class="badge badge-cooking">Cooking</span>
<span class="badge badge-ready">Ready</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
```

### Layout Utilities

**Grid:**
```html
<div class="grid grid-cols-2">
  <!-- 2 columns on desktop, 1 on mobile -->
</div>
```

**Flexbox:**
```html
<div class="flex-between">
  <!-- Space-between flex layout -->
</div>

<div class="flex-center">
  <!-- Centered flex layout -->
</div>
```

### Order Items

Display orders with status indicators:

```html
<div class="order-item status-new">
  Order #123 - 2 items
</div>

<div class="order-item status-cooking">
  Order #124 - In preparation
</div>

<div class="order-item status-ready">
  Order #125 - Ready to serve
</div>
```

## Transitions & Animations

```css
--transition-fast: 150ms ease-out
--transition-base: 250ms ease-out
--transition-slow: 350ms ease-out
```

**Usage:**
```css
transition: all var(--transition-base);
transition: background-color var(--transition-fast);
```

**Predefined Animations:**
```css
.animate-pulse {}     /* Pulsing opacity */
.animate-slide-in {}  /* Slide in from top */
```

## Responsive Breakpoints

The design system uses mobile-first approach:

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

**Media Query Example:**
```css
@media (max-width: 768px) {
  .shell {
    padding: 8px;
  }
}
```

## Glass & Backdrop Effects

```css
--glass-default: rgba(183, 142, 255, 0.08)
--glass-elevated: rgba(215, 191, 255, 0.14)
--glass-dark: rgba(23, 15, 41, 0.8)
--glass-blur: 24px
```

**Usage:**
```css
background: var(--glass-default);
backdrop-filter: blur(var(--glass-blur)) saturate(150%);
```

## Examples

### Example: Card with Status

```html
<div class="card">
  <div class="flex-between">
    <h4>Order #123</h4>
    <span class="badge badge-ready">Ready</span>
  </div>
  <p>2x Burger, 1x Fries</p>
  <button class="btn btn-primary">Serve</button>
</div>
```

### Example: Form Input

```html
<input 
  type="text" 
  placeholder="Enter order number"
  style="padding: var(--spacing-md); border-radius: var(--radius-md);"
>
```

### Example: Grid Layout

```html
<div class="shell">
  <div class="grid grid-cols-3">
    <div class="card">Item 1</div>
    <div class="card">Item 2</div>
    <div class="card">Item 3</div>
  </div>
</div>
```

## Migration Guide

### From Old System to New

**Before (scattered styles):**
```html
<link rel="stylesheet" href="base.css">
<style>
  :root { --bg: #030000; }
</style>
```

**After (unified):**
```html
<link rel="stylesheet" href="dragon-theme.css">
```

The new system automatically provides all needed colors, spacing, and component styles.

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 13+)
- Internet Explorer: ❌ Not supported (CSS variables not available)

## Performance Notes

- Single CSS file reduces HTTP requests
- CSS variables are cached and reused
- No JavaScript dependencies for styling
- ~50KB minified size

## Customization

To customize specific modules, add additional CSS **after** the theme link:

```html
<link rel="stylesheet" href="dragon-theme.css">
<style>
  /* Module-specific overrides */
  .my-module {
    --accent-primary: #ff7a24; /* Override for this module */
  }
</style>
```

## Best Practices

1. **Always use variables** instead of hardcoded colors
2. **Maintain spacing consistency** using the spacing scale
3. **Use semantic class names** (.btn, .card, .badge, not .red-button)
4. **Leverage responsive utilities** for mobile support
5. **Test on multiple devices** (mobile, tablet, desktop)
6. **Follow the color system** for status indicators
7. **Use transitions** for smooth interactions

## Support & Updates

For issues or suggestions regarding the design system, please document them in:
- Design System Issues tracking
- Module-specific discussions

The design system is version 1.0 and will be updated as needed for consistency across all Dragon modules.

---

**Last Updated:** June 5, 2026  
**Version:** 1.0  
**Files:** `dragon-theme.css`

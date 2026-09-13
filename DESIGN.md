# Favicon Studio & Size Guide Design System (DESIGN.md)

**Domain:** favvicon.com  
**Application:** Favicon Size Guide & Generator  
**Design Philosophy:** Precision developer utility meets modern web design. High-contrast, hyper-clean aesthetic with vivid cyan and electric violet accents on a deep slate canvas. Engineered for instant feedback, pixel-perfect accuracy, and zero friction.

---

## 1. Color Palette (OKLCH Color Space)

We utilize the `oklch` perceptual color model for consistent perceived lightness across dark and light themes, ensuring superior contrast and accessibility.

### 1.1 Base & Surface Tokens

| Token | Dark Mode Value (Default) | Light Mode Value | Usage |
|---|---|---|---|
| `--background` | `oklch(0.13 0.015 255)` | `oklch(0.985 0.005 250)` | Main application canvas |
| `--foreground` | `oklch(0.98 0.005 250)` | `oklch(0.16 0.02 260)` | Primary body typography |
| `--card` | `oklch(0.165 0.018 255)` | `oklch(1 0 0)` | Elevated surfaces and tool cards |
| `--card-foreground` | `oklch(0.98 0.005 250)` | `oklch(0.16 0.02 260)` | Text inside cards |
| `--muted` | `oklch(0.20 0.02 255)` | `oklch(0.94 0.008 250)` | Inactive pills, tags, input wells |
| `--muted-foreground` | `oklch(0.68 0.02 255)` | `oklch(0.44 0.03 260)` | Secondary labels, descriptions |
| `--border` | `oklch(0.25 0.02 255)` | `oklch(0.89 0.012 250)` | Card borders, dividers |
| `--input` | `oklch(0.23 0.02 255)` | `oklch(0.90 0.012 250)` | Form input wells and borders |
| `--ring` | `oklch(0.68 0.20 235)` | `oklch(0.55 0.22 255)` | Focus states and active outlines |

### 1.2 Brand Accents (Cyan Neon & Electric Indigo)

| Token | Dark Mode Value | Light Mode Value | Usage |
|---|---|---|---|
| `--primary` | `oklch(0.68 0.20 235)` | `oklch(0.55 0.22 255)` | Primary CTAs, active pills, export buttons |
| `--primary-foreground` | `oklch(0.10 0.02 260)` | `oklch(0.99 0 0)` | Text on primary backgrounds |
| `--secondary` | `oklch(0.72 0.16 195)` | `oklch(0.58 0.18 195)` | Cyan highlight accents, live preview badges |
| `--secondary-foreground` | `oklch(0.10 0.02 260)` | `oklch(0.99 0 0)` | Text on cyan accents |
| `--accent` | `oklch(0.25 0.05 255)` | `oklch(0.94 0.04 250)` | Interactive hovers, highlight backdrops |
| `--accent-foreground` | `oklch(0.88 0.12 235)` | `oklch(0.38 0.18 250)` | Highlight text / icons |
| `--success` | `oklch(0.72 0.18 150)` | `oklch(0.58 0.18 145)` | Copy confirmations, validation pass |
| `--warning` | `oklch(0.78 0.18 75)` | `oklch(0.65 0.18 75)` | Aspect ratio alert, size notice |

---

## 2. Typography

1. **Display & Body Font:** Inter Variable
   - Font family: `'Inter Variable', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
   - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold), `800` (ExtraBold)
2. **Numeric & Code Font:** Tabular Monospace
   - Font family: `ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Monaco, Consolas, monospace`
   - Numeric features: `font-variant-numeric: tabular-nums lining-nums;`
   - Used for: Pixel dimensions (e.g. `512×512`), `<link>` tags, JSON WebManifest configs, file sizes.

---

## 3. Elevation & Radius

- **Border Radius:**
  - Outer Cards: `1rem` (16px)
  - Tool Wells & Device Frames: `0.75rem` (12px)
  - Inputs & Buttons: `0.5rem` (8px)
  - Badges & Pills: `9999px` (Pill)
- **Glassmorphic Depth:**
  - Backdrop blur `backdrop-blur-md`
  - Subtle borders: `1px solid var(--border)`
  - Ambient glow for dark mode: `shadow-[0_4px_24px_rgba(0,0,0,0.4)]`

---

## 4. Key Component Patterns

### 4.1 Live Multi-Device Mockup Studio
- Realistic browser chrome frames (Chrome Light Tab, Chrome Dark Tab, macOS Safari Tab, Google SERP Mobile/Desktop preview, iOS 18 Home Screen squircle, Android circle icon).
- Interactive tab preview with dynamic page title and favicon.

### 4.2 Asset Health & Size Validator
- Visual meter showing Aspect Ratio (1:1 square check), Resolution health (>512px pass), Alpha transparency check, and 16px contrast legibility.

### 4.3 Instant Code Generator
- Multi-stack tab switcher: Minimal (2026 standard 3 lines), Full Enterprise, Next.js App Router, Astro, SvelteKit.
- One-click copy with immediate tactile checkmark animation and toast notification.

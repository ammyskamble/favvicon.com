export interface FaviconSpec {
  id: string;
  name: string;
  category: 'browsers' | 'apple' | 'android' | 'google' | 'legacy';
  categoryLabel: string;
  width: number;
  height: number;
  dimensionStr: string;
  format: 'ICO' | 'PNG' | 'SVG' | 'JSON';
  filename: string;
  importance: 'Essential' | 'Recommended' | 'Optional' | 'Legacy';
  purpose: string;
  tagSnippet: string;
  notes: string;
}

export const FAVICON_SPECS: FaviconSpec[] = [
  {
    id: 'svg-icon',
    name: 'Modern Vector Favicon',
    category: 'browsers',
    categoryLabel: 'Modern Browsers',
    width: 0,
    height: 0,
    dimensionStr: 'Scalable SVG',
    format: 'SVG',
    filename: 'favicon.svg',
    importance: 'Essential',
    purpose: 'Crisp vector icon on all screen resolutions with built-in dark/light theme switching.',
    tagSnippet: '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    notes: 'Supported by Chrome 80+, Firefox 41+, Safari 16+, and Edge 80+. Allows @media (prefers-color-scheme: dark).'
  },
  {
    id: 'ico-fallback',
    name: 'Multi-Resolution Classic ICO',
    category: 'browsers',
    categoryLabel: 'Modern Browsers',
    width: 32,
    height: 32,
    dimensionStr: '16×16 & 32×32',
    format: 'ICO',
    filename: 'favicon.ico',
    importance: 'Essential',
    purpose: 'Universal legacy fallback for browser tabs, bookmark bars, and automated bots.',
    tagSnippet: '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    notes: 'Stored in web root. Packs both 16x16 and 32x32 bitmapped frames into a single binary container.'
  },
  {
    id: 'png-32',
    name: 'High-DPI Browser Tab',
    category: 'browsers',
    categoryLabel: 'Modern Browsers',
    width: 32,
    height: 32,
    dimensionStr: '32×32 px',
    format: 'PNG',
    filename: 'favicon-32x32.png',
    importance: 'Essential',
    purpose: 'Standard desktop browser tabs on Retina / 2x / 4K displays.',
    tagSnippet: '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    notes: 'Clean transparent PNG for high-density desktop displays.'
  },
  {
    id: 'png-16',
    name: 'Standard Browser Tab',
    category: 'browsers',
    categoryLabel: 'Modern Browsers',
    width: 16,
    height: 16,
    dimensionStr: '16×16 px',
    format: 'PNG',
    filename: 'favicon-16x16.png',
    importance: 'Recommended',
    purpose: 'Classic 1x scale browser tabs, address bars, and history menus.',
    tagSnippet: '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    notes: 'Crucial to test for legibility at micro dimensions.'
  },
  {
    id: 'apple-touch-180',
    name: 'Apple Touch Icon (iPhone Retina)',
    category: 'apple',
    categoryLabel: 'Apple iOS & macOS',
    width: 180,
    height: 180,
    dimensionStr: '180×180 px',
    format: 'PNG',
    filename: 'apple-touch-icon.png',
    importance: 'Essential',
    purpose: 'iOS "Add to Home Screen" shortcut icon on modern iPhones and iPads.',
    tagSnippet: '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    notes: 'iOS automatically clips this image with the signature squircle radius and subtle shadow. Do not apply rounded corners yourself.'
  },
  {
    id: 'apple-touch-167',
    name: 'iPad Pro Touch Icon',
    category: 'apple',
    categoryLabel: 'Apple iOS & macOS',
    width: 167,
    height: 167,
    dimensionStr: '167×167 px',
    format: 'PNG',
    filename: 'apple-touch-icon-167x167.png',
    importance: 'Optional',
    purpose: 'Specialized high-density iPad Pro 10.5", 11", and 12.9" home screen icons.',
    tagSnippet: '<link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png">',
    notes: 'If omitted, iOS automatically scales the 180x180 icon with crisp bicubic interpolation.'
  },
  {
    id: 'safari-pinned-tab',
    name: 'Safari Pinned Tab (Mask Icon)',
    category: 'apple',
    categoryLabel: 'Apple iOS & macOS',
    width: 0,
    height: 0,
    dimensionStr: 'Single-layer SVG',
    format: 'SVG',
    filename: 'safari-pinned-tab.svg',
    importance: 'Optional',
    purpose: 'Monochrome silhouette vector used when a tab is pinned in macOS Safari.',
    tagSnippet: '<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#6366f1">',
    notes: 'Requires 100% black SVG vector shapes on transparent background; the color attribute sets the tint.'
  },
  {
    id: 'android-192',
    name: 'Android Chrome Home Screen',
    category: 'android',
    categoryLabel: 'Android & PWA',
    width: 192,
    height: 192,
    dimensionStr: '192×192 px',
    format: 'PNG',
    filename: 'android-chrome-192x192.png',
    importance: 'Essential',
    purpose: 'Progressive Web App launch icon and Android Chrome bookmark on home screen.',
    tagSnippet: 'Declared in site.webmanifest under icons array (192x192).',
    notes: 'Required for PWA installability criteria in Google Chrome and Samsung Internet.'
  },
  {
    id: 'android-512',
    name: 'PWA Splash Screen & App Store',
    category: 'android',
    categoryLabel: 'Android & PWA',
    width: 512,
    height: 512,
    dimensionStr: '512×512 px',
    format: 'PNG',
    filename: 'android-chrome-512x512.png',
    importance: 'Essential',
    purpose: 'PWA splash load screen, Chrome task switcher, and Google Play Store listing.',
    tagSnippet: 'Declared in site.webmanifest under icons array (512x512).',
    notes: 'Support both "any" and "maskable" purposes to prevent white halo borders on modern Android.'
  },
  {
    id: 'webmanifest',
    name: 'Web Application Manifest',
    category: 'android',
    categoryLabel: 'Android & PWA',
    width: 0,
    height: 0,
    dimensionStr: 'JSON Config',
    format: 'JSON',
    filename: 'site.webmanifest',
    importance: 'Essential',
    purpose: 'Configures app name, theme_color, background_color, and responsive icon mappings.',
    tagSnippet: '<link rel="manifest" href="/site.webmanifest">',
    notes: 'Pairs with <meta name="theme-color" content="#13141f"> for branded browser chrome bars.'
  },
  {
    id: 'google-serp-48',
    name: 'Google Search Result SERP Favicon',
    category: 'google',
    categoryLabel: 'Search Engines',
    width: 48,
    height: 48,
    dimensionStr: '48×48 px (or multiple)',
    format: 'PNG',
    filename: 'favicon-48x48.png',
    importance: 'Recommended',
    purpose: 'Displayed beside your website URL and title in Google Mobile & Desktop Search Results.',
    tagSnippet: '<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">',
    notes: 'Google search crawler explicitly requires favicons to be multiples of 48px square (e.g. 48x48, 96x96, 144x144, 192x192).'
  },
  {
    id: 'png-96',
    name: 'Google TV & Shortcut Icon',
    category: 'google',
    categoryLabel: 'Search Engines',
    width: 96,
    height: 96,
    dimensionStr: '96×96 px',
    format: 'PNG',
    filename: 'favicon-96x96.png',
    importance: 'Recommended',
    purpose: 'Google TV app grid, high-DPI desktop shortcuts, and modern search crawlers.',
    tagSnippet: '<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">',
    notes: 'Ideal 2x density asset for Google SERP 48px rendering.'
  },
  {
    id: 'mstile-150',
    name: 'Windows Medium Square Tile',
    category: 'legacy',
    categoryLabel: 'Windows & Legacy',
    width: 150,
    height: 150,
    dimensionStr: '150×150 px',
    format: 'PNG',
    filename: 'mstile-150x150.png',
    importance: 'Legacy',
    purpose: 'Windows 8.1 / 10 Start Menu live pinned tiles and Microsoft Edge legacy bookmarks.',
    tagSnippet: '<meta name="msapplication-TileImage" content="/mstile-150x150.png">',
    notes: 'Considered legacy in Windows 11 which uses standard Chromium browser icon declarations.'
  },
  {
    id: 'mstile-310',
    name: 'Windows Large Square Tile',
    category: 'legacy',
    categoryLabel: 'Windows & Legacy',
    width: 310,
    height: 310,
    dimensionStr: '310×310 px',
    format: 'PNG',
    filename: 'mstile-310x310.png',
    importance: 'Legacy',
    purpose: 'Large square tile in Windows 10 Start menu browser pinning.',
    tagSnippet: 'Specified in browserconfig.xml file.',
    notes: 'Only required if supporting specific enterprise Windows 10 Start Menu workflows.'
  }
];

export const CODE_SNIPPET_PRESETS = {
  modern2026: {
    title: 'Modern 2026 Recommended (Only 3 Lines)',
    description: 'The golden modern standard recommended by web performance experts. Covers 99.8% of global users with maximum speed and zero bloat.',
    code: `<!-- 1. Universal modern vector favicon (supports dark mode!) -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">

<!-- 2. Classic fallback for legacy browser tabs & bots -->
<link rel="icon" href="/favicon.ico" sizes="32x32">

<!-- 3. iOS & iPadOS Home Screen Icon -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">

<!-- 4. Android & PWA Manifest -->
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#13141f">`
  },
  comprehensive: {
    title: 'Full Enterprise & Legacy Stack',
    description: 'Guarantees 100% pixel-perfect matching across all legacy Android, iOS, Windows 10 tiles, and high-DPI desktop displays.',
    code: `<!-- Standard Web Favicons -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#6366f1">

<!-- PWA & Mobile Web Manifest -->
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#13141f">

<!-- Windows Tile Metadata (Optional Legacy) -->
<meta name="msapplication-TileColor" content="#13141f">
<meta name="msapplication-TileImage" content="/mstile-150x150.png">`
  },
  nextjs: {
    title: 'Next.js (App Router)',
    description: 'Modern Next.js 13+ / 14+ / 15+ App Router file-based convention. Place inside your app/ directory.',
    code: `// Next.js App Router automatically handles favicons if placed in app/
// app/favicon.ico  (Universal tab fallback)
// app/icon.svg     (Dynamic vector icon)
// app/apple-icon.png (180x180 Apple touch icon)

// Or add directly inside app/layout.tsx:
export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest'
};`
  },
  astro: {
    title: 'Astro.js Layout',
    description: 'Drop directly inside your primary src/layouts/Layout.astro <head> section.',
    code: `---
// src/layouts/Layout.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>

    <!-- Favicon Suite -->
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#13141f" />
  </head>
  <body>
    <slot />
  </body>
</html>`
  },
  webmanifestJson: {
    title: 'site.webmanifest (JSON Content)',
    description: 'Place in your public/ folder as site.webmanifest.',
    code: `{
  "name": "Favicon Studio",
  "short_name": "Favicon",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#13141f",
  "background_color": "#13141f",
  "display": "standalone"
}`
  }
};

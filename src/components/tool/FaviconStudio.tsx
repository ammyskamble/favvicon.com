import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { encodeIco, canvasToPngBuffer, type IcoImageEntry } from '../../utils/icoEncoder';
import { CODE_SNIPPET_PRESETS } from '../../data/faviconSizesData';
import {
  Upload,
  Download,
  Check,
  Copy,
  Layers,
  Smartphone,
  Monitor,
  Globe,
  Search,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Zap,
  Rocket,
  Diamond,
  Code2,
  Eye,
  ShieldCheck
} from 'lucide-react';

interface PresetIcon {
  id: string;
  name: string;
  renderSvg: (fgColor: string, bgColor: string) => string;
}

const PRESET_ICONS: PresetIcon[] = [
  {
    id: 'rocket',
    name: 'Rocket Launch',
    renderSvg: (fg, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" rx="112" fill="${bg}"/>
      <path d="M256 64c-70.7 0-128 57.3-128 128 0 42.4 20.6 80 52.6 103.3L160 384l64-32 32 96 32-96 64 32-20.6-88.7C363.4 272 384 234.4 384 192c0-70.7-57.3-128-128-128z" fill="${fg}"/>
      <circle cx="256" cy="192" r="40" fill="${bg}"/>
    </svg>`
  },
  {
    id: 'sparkles',
    name: 'AI Sparkles',
    renderSvg: (fg, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" rx="112" fill="${bg}"/>
      <path d="M256 96l40 100 100 40-100 40-40 100-40-100-100-40 100-40 40-100z" fill="${fg}"/>
      <path d="M384 320l16 40 40 16-40 16-16 40-16-40-40-16 40-16 16-40z" fill="${fg}" opacity="0.8"/>
      <path d="M128 128l12 30 30 12-30 12-12 30-12-30-30-12 30-12 12-30z" fill="${fg}" opacity="0.7"/>
    </svg>`
  },
  {
    id: 'diamond',
    name: 'Vector Gem',
    renderSvg: (fg, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" rx="112" fill="${bg}"/>
      <polygon points="256,96 384,192 336,416 176,416 128,192" fill="${fg}"/>
      <polygon points="256,96 336,192 256,416 176,192" fill="#ffffff" opacity="0.25"/>
    </svg>`
  },
  {
    id: 'lightning',
    name: 'Volt Bolt',
    renderSvg: (fg, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" rx="112" fill="${bg}"/>
      <polygon points="280,64 160,272 260,272 232,448 352,240 252,240" fill="${fg}"/>
    </svg>`
  }
];

export const FaviconStudio: React.FC = () => {
  const [sourceImgSrc, setSourceImgSrc] = useState<string>('');
  const [sourceFileName, setSourceFileName] = useState<string>('sample-favicon.svg');
  const [sourceFileType, setSourceFileType] = useState<string>('image/svg+xml');
  const [sourceDimensions, setSourceDimensions] = useState<{ width: number; height: number }>({ width: 512, height: 512 });
  const [isSquare, setIsSquare] = useState<boolean>(true);
  const [hasAlpha, setHasAlpha] = useState<boolean>(true);
  const [padToSquare, setPadToSquare] = useState<boolean>(true);

  // Customization presets
  const [primaryColor, setPrimaryColor] = useState<string>('#38bdf8');
  const [bgColor, setBgColor] = useState<string>('#0f172a');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rocket');

  // Preview interactive state
  const [previewTab, setPreviewTab] = useState<'chrome' | 'safari' | 'google' | 'ios' | 'android'>('chrome');
  const [chromeTheme, setChromeTheme] = useState<'dark' | 'light'>('dark');
  const [siteTitle, setSiteTitle] = useState<string>('My Awesome Website');
  const [siteDomain, setSiteDomain] = useState<string>('example.com');

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [activeSnippetKey, setActiveSnippetKey] = useState<keyof typeof CODE_SNIPPET_PRESETS>('modern2026');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with default preset
  useEffect(() => {
    loadPreset(selectedPresetId, primaryColor, bgColor);
  }, []);

  const loadPreset = (presetId: string, fg: string, bg: string) => {
    const preset = PRESET_ICONS.find((p) => p.id === presetId) || PRESET_ICONS[0];
    const svgString = preset.renderSvg(fg, bg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    setSourceImgSrc(url);
    setSourceFileName(`${preset.id}-icon.svg`);
    setSourceFileType('image/svg+xml');
    setSourceDimensions({ width: 512, height: 512 });
    setIsSquare(true);
    setHasAlpha(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setSourceFileName(file.name);
    setSourceFileType(file.type || 'image/png');

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 512;
        const h = img.naturalHeight || 512;
        setSourceDimensions({ width: w, height: h });
        setIsSquare(w === h);
        setSourceImgSrc(dataUrl);
        checkImageAlpha(img, w, h);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const checkImageAlpha = (img: HTMLImageElement, w: number, h: number) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(w, 64);
      canvas.height = Math.min(h, 64);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let alphaFound = false;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 250) {
          alphaFound = true;
          break;
        }
      }
      setHasAlpha(alphaFound);
    } catch {
      setHasAlpha(true);
    }
  };

  // Prepare normalized square canvas image source
  const getPreparedCanvas = async (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.max(img.width, img.height, 512);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No 2D context');

        ctx.clearRect(0, 0, size, size);

        if (padToSquare && img.width !== img.height) {
          const scale = Math.min(size / img.width, size / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const offsetX = (size - drawW) / 2;
          const offsetY = (size - drawH) / 2;
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        } else {
          ctx.drawImage(img, 0, 0, size, size);
        }

        resolve(canvas);
      };
      img.onerror = reject;
      img.src = sourceImgSrc;
    });
  };

  // Download complete 2026 modern production package
  const handleDownloadZip = async () => {
    try {
      setIsGenerating(true);
      const masterCanvas = await getPreparedCanvas();
      const zip = new JSZip();

      // 1. Generate ICO (16x16 and 32x32 binary bundle)
      const png16 = await canvasToPngBuffer(masterCanvas, 16);
      const png32 = await canvasToPngBuffer(masterCanvas, 32);
      const png48 = await canvasToPngBuffer(masterCanvas, 48);

      const icoEntries: IcoImageEntry[] = [
        { width: 16, height: 16, data: png16 },
        { width: 32, height: 32, data: png32 }
      ];
      const icoBlob = encodeIco(icoEntries);
      zip.file('favicon.ico', icoBlob);

      // 2. High-DPI PNG Favicons
      zip.file('favicon-16x16.png', png16);
      zip.file('favicon-32x32.png', png32);
      zip.file('favicon-48x48.png', png48);

      const png96 = await canvasToPngBuffer(masterCanvas, 96);
      zip.file('favicon-96x96.png', png96);

      // 3. Apple Touch Icon (180x180)
      const pngApple = await canvasToPngBuffer(masterCanvas, 180);
      zip.file('apple-touch-icon.png', pngApple);

      // 4. Android / PWA Icons (192x192 & 512x512)
      const pngAndroid192 = await canvasToPngBuffer(masterCanvas, 192);
      zip.file('android-chrome-192x192.png', pngAndroid192);

      const pngAndroid512 = await canvasToPngBuffer(masterCanvas, 512);
      zip.file('android-chrome-512x512.png', pngAndroid512);

      // 5. If source was SVG, include favicon.svg
      if (sourceFileType === 'image/svg+xml' && sourceImgSrc.startsWith('data:image/svg+xml')) {
        const svgContent = decodeURIComponent(sourceImgSrc.replace('data:image/svg+xml;utf8,', ''));
        zip.file('favicon.svg', svgContent);
      }

      // 6. site.webmanifest JSON
      const manifestJson = {
        name: siteTitle,
        short_name: siteTitle.split(' ')[0] || 'App',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        theme_color: bgColor || '#13141f',
        background_color: bgColor || '#13141f',
        display: 'standalone'
      };
      zip.file('site.webmanifest', JSON.stringify(manifestJson, null, 2));

      // 7. Quick installation guide README.txt
      const readme = `=== FAVVICON.COM PRODUCTION FAVICON PACK ===
Generated for: ${siteTitle} (${siteDomain})
Standard: 2026 Modern Clean Spec

FILES INCLUDED:
- favicon.ico (Binary multi-res 16x16 & 32x32 for legacy tabs & bots)
- favicon.svg (Scalable vector for modern browsers)
- favicon-16x16.png (Standard 1x tab)
- favicon-32x32.png (Retina 2x tab)
- favicon-48x48.png (Google SERP Search favicon)
- favicon-96x96.png (High-DPI search & TV)
- apple-touch-icon.png (180x180 for iOS Home Screen)
- android-chrome-192x192.png (PWA install icon)
- android-chrome-512x512.png (PWA splash screen)
- site.webmanifest (PWA configuration manifest)

QUICK INSTALLATION:
1. Extract all files into your website's root or /public/ directory.
2. Paste the following snippet into your HTML <head>:

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${bgColor}">

Generated with 100% privacy at https://favvicon.com
`;
      zip.file('README.txt', readme);

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `favicon-pack-${siteTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('ZIP generation failed', err);
      alert('Generation error. Please check your image file.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSingle = async (format: 'ico' | 'png180' | 'png32' | 'png512') => {
    try {
      const masterCanvas = await getPreparedCanvas();
      if (format === 'ico') {
        const png16 = await canvasToPngBuffer(masterCanvas, 16);
        const png32 = await canvasToPngBuffer(masterCanvas, 32);
        const icoBlob = encodeIco([
          { width: 16, height: 16, data: png16 },
          { width: 32, height: 32, data: png32 }
        ]);
        saveBlobAs(icoBlob, 'favicon.ico');
      } else if (format === 'png180') {
        const buf = await canvasToPngBuffer(masterCanvas, 180);
        saveBlobAs(new Blob([buf], { type: 'image/png' }), 'apple-touch-icon.png');
      } else if (format === 'png32') {
        const buf = await canvasToPngBuffer(masterCanvas, 32);
        saveBlobAs(new Blob([buf], { type: 'image/png' }), 'favicon-32x32.png');
      } else if (format === 'png512') {
        const buf = await canvasToPngBuffer(masterCanvas, 512);
        saveBlobAs(new Blob([buf], { type: 'image/png' }), 'android-chrome-512x512.png');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveBlobAs = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    setTimeout(() => {
      setCopiedSnippetId((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  return (
    <div className="w-full space-y-12">
      {/* Main Two-Column Studio Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Source Upload, Presets & Validator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload & Source Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                1. Upload Asset or Choose Preset
              </h3>
              <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                SVG • PNG • WebP
              </span>
            </div>

            {/* Drag & Drop Box */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="relative group border-2 border-dashed border-[var(--border)] hover:border-cyan-400 rounded-xl p-6 text-center cursor-pointer transition-all bg-[var(--muted)]/20 hover:bg-cyan-500/5 flex flex-col items-center justify-center gap-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 border border-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)]">
                  Click to browse or drop an icon/logo
                </p>
                <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
                  Square SVG or high-res PNG (512×512px+) recommended
                </p>
              </div>
            </div>

            {/* Preset Icons Quick Switcher */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span className="font-semibold text-[var(--foreground)]">Or pick a sample template:</span>
                <span className="text-[11px]">Instant live testing</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_ICONS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      loadPreset(preset.id, primaryColor, bgColor);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedPresetId === preset.id
                        ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-sm'
                        : 'border-[var(--border)] bg-[var(--muted)]/40 hover:border-[var(--muted-foreground)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {preset.id === 'rocket' && <Rocket className="w-5 h-5" />}
                    {preset.id === 'sparkles' && <Sparkles className="w-5 h-5" />}
                    {preset.id === 'diamond' && <Diamond className="w-5 h-5" />}
                    {preset.id === 'lightning' && <Zap className="w-5 h-5" />}
                    <span className="text-[10px] font-medium truncate w-full">{preset.name}</span>
                  </button>
                ))}
              </div>

              {/* Color tweaks for preset */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--muted-foreground)] block mb-1">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2 bg-[var(--muted)]/40 border border-[var(--border)] rounded-lg p-1.5">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value);
                        loadPreset(selectedPresetId, e.target.value, bgColor);
                      }}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-[var(--foreground)]">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--muted-foreground)] block mb-1">
                    Tile Background
                  </label>
                  <div className="flex items-center gap-2 bg-[var(--muted)]/40 border border-[var(--border)] rounded-lg p-1.5">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => {
                        setBgColor(e.target.value);
                        loadPreset(selectedPresetId, primaryColor, e.target.value);
                      }}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-[var(--foreground)]">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Health & Size Validator Card */}
            <div className="border-t border-[var(--border)] pt-4 space-y-3" id="validator">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Asset Health Audit
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {sourceDimensions.width}×{sourceDimensions.height} px
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 1:1 Square Check */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--muted)]/30 border border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    {isSquare ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-[var(--foreground)]">Aspect Ratio: 1:1 Square</span>
                  </div>
                  <span className={`text-[11px] font-semibold ${isSquare ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isSquare ? 'Perfect' : 'Non-Square'}
                  </span>
                </div>

                {!isSquare && (
                  <label className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={padToSquare}
                      onChange={(e) => setPadToSquare(e.target.checked)}
                      className="rounded accent-cyan-500"
                    />
                    <span>Auto-pad with transparent margins to square (Recommended)</span>
                  </label>
                )}

                {/* Resolution Sufficient */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--muted)]/30 border border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    {sourceDimensions.width >= 512 || sourceFileType === 'image/svg+xml' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-[var(--foreground)]">Resolution (&ge; 512×512)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {sourceFileType === 'image/svg+xml' ? 'Infinite (SVG)' : `${sourceDimensions.width}px`}
                  </span>
                </div>

                {/* Alpha Transparency */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--muted)]/30 border border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[var(--foreground)]">Alpha Transparency</span>
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-400">
                    {hasAlpha ? 'Detected' : 'Opaque'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Download Action Center */}
          <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-cyan-500/5 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                2. Export Production Package
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                100% Client-Side
              </span>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Instantly bundles <strong className="text-[var(--foreground)]">favicon.ico</strong> (multi-res 16×16 & 32×32), High-DPI PNGs (16, 32, 48, 96), <strong className="text-[var(--foreground)]">apple-touch-icon</strong> (180×180), Android Chrome icons (192, 512), and <strong className="text-[var(--foreground)]">site.webmanifest</strong> in a single ZIP.
            </p>

            <button
              onClick={handleDownloadZip}
              disabled={isGenerating}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-teal-400 hover:from-indigo-600 hover:via-cyan-600 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Packaging Favicon Suite (.ZIP)...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Favicon Pack Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>Download Complete 2026 Favicon Pack (.ZIP)</span>
                </>
              )}
            </button>

            {/* Quick Single Asset Downloads */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-[var(--muted-foreground)] mb-2">
                Quick Download Individual Files:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleDownloadSingle('ico')}
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 hover:bg-[var(--accent)] text-[11px] font-mono text-[var(--foreground)] hover:text-cyan-400 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  favicon.ico
                </button>
                <button
                  onClick={() => handleDownloadSingle('png180')}
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 hover:bg-[var(--accent)] text-[11px] font-mono text-[var(--foreground)] hover:text-cyan-400 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  180px iOS
                </button>
                <button
                  onClick={() => handleDownloadSingle('png32')}
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 hover:bg-[var(--accent)] text-[11px] font-mono text-[var(--foreground)] hover:text-cyan-400 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  32px Tab
                </button>
                <button
                  onClick={() => handleDownloadSingle('png512')}
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 hover:bg-[var(--accent)] text-[11px] font-mono text-[var(--foreground)] hover:text-cyan-400 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  512px PWA
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Device Mockups Studio & Code Snippets (7 cols) */}
        <div className="lg:col-span-7 space-y-6" id="mockup-studio">
          
          {/* Mockup Studio Frame */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden">
            
            {/* Studio Header Controls */}
            <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Live Multi-Device Mockup Studio
                </h3>
              </div>

              {/* Device Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[var(--card)] p-1 rounded-xl border border-[var(--border)]">
                <button
                  onClick={() => setPreviewTab('chrome')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewTab === 'chrome'
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Chrome Tab
                </button>
                <button
                  onClick={() => setPreviewTab('safari')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewTab === 'safari'
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Safari
                </button>
                <button
                  onClick={() => setPreviewTab('google')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewTab === 'google'
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  Google SERP
                </button>
                <button
                  onClick={() => setPreviewTab('ios')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewTab === 'ios'
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  iOS
                </button>
                <button
                  onClick={() => setPreviewTab('android')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewTab === 'android'
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Android
                </button>
              </div>
            </div>

            {/* Customizer Controls for Preview */}
            <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--muted)]/15 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[var(--muted-foreground)] font-medium">Page Title:</span>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="Website Title"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--muted-foreground)] font-medium">Domain:</span>
                <input
                  type="text"
                  value={siteDomain}
                  onChange={(e) => setSiteDomain(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="domain.com"
                />
              </div>
            </div>

            {/* Mockup Canvas Viewport */}
            <div className="p-8 min-h-[340px] flex items-center justify-center bg-gradient-to-b from-[var(--background)] to-[var(--muted)]/20">
              
              {/* 1. Chrome Tab Mockup */}
              {previewTab === 'chrome' && (
                <div className="w-full max-w-xl space-y-3">
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <span className="text-[var(--muted-foreground)]">Chrome Theme:</span>
                    <button
                      onClick={() => setChromeTheme('dark')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                        chromeTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-[var(--muted-foreground)]'
                      }`}
                    >
                      Dark Tab
                    </button>
                    <button
                      onClick={() => setChromeTheme('light')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                        chromeTheme === 'light' ? 'bg-slate-200 text-slate-900' : 'text-[var(--muted-foreground)]'
                      }`}
                    >
                      Light Tab
                    </button>
                  </div>

                  {/* Chrome Browser Window Shell */}
                  <div
                    className={`rounded-xl shadow-2xl border transition-colors overflow-hidden ${
                      chromeTheme === 'dark'
                        ? 'bg-[#202124] border-gray-700 text-gray-200'
                        : 'bg-[#dee1e6] border-gray-300 text-gray-800'
                    }`}
                  >
                    {/* Chrome Window Controls & Active Tab */}
                    <div className="pt-2 px-3 flex items-center gap-2">
                      <div className="flex items-center gap-1.5 pr-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                      </div>

                      {/* The Active Tab */}
                      <div
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-t-lg max-w-[220px] transition-colors border-t border-x ${
                          chromeTheme === 'dark'
                            ? 'bg-[#323639] border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {/* Live Favicon 16x16 / 32x32 */}
                        <div className="w-4 h-4 rounded shrink-0 overflow-hidden flex items-center justify-center">
                          <img
                            src={sourceImgSrc}
                            alt="Favicon preview"
                            className="w-4 h-4 object-contain"
                          />
                        </div>
                        <span className="text-xs font-medium truncate">{siteTitle}</span>
                        <span className="text-[10px] opacity-60 ml-auto hover:opacity-100 cursor-pointer">×</span>
                      </div>

                      <div className="text-xs opacity-50 px-2 cursor-pointer">+</div>
                    </div>

                    {/* Chrome Address Bar */}
                    <div
                      className={`p-2 border-t ${
                        chromeTheme === 'dark' ? 'bg-[#323639] border-gray-700' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div
                        className={`rounded-full px-4 py-1 text-xs flex items-center gap-2 ${
                          chromeTheme === 'dark' ? 'bg-[#202124] text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="text-emerald-500 font-bold text-xs">🔒</span>
                        <span className="font-mono text-[11px] truncate">https://{siteDomain}/</span>
                      </div>
                    </div>

                    {/* Dummy Browser Body Content */}
                    <div className="p-6 bg-[var(--background)] text-center text-xs text-[var(--muted-foreground)]">
                      <p className="font-semibold text-[var(--foreground)]">Testing 16×16 & 32×32 Tab Legibility</p>
                      <p className="text-[11px] mt-1">
                        Notice how your favicon looks against {chromeTheme === 'dark' ? 'dark tab chrome' : 'light tab chrome'}.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Safari macOS Tab Mockup */}
              {previewTab === 'safari' && (
                <div className="w-full max-w-xl space-y-3">
                  <div className="rounded-xl shadow-2xl border border-gray-700 bg-[#2b2b2b] text-white overflow-hidden">
                    <div className="p-3 flex items-center justify-between border-b border-gray-700 bg-[#1e1e1e]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                      </div>
                      <div className="w-1/2 bg-[#2d2d2d] rounded-md px-3 py-1 text-center text-xs text-gray-300 font-mono flex items-center justify-center gap-1.5">
                        <img src={sourceImgSrc} alt="Favicon" className="w-3.5 h-3.5 object-contain" />
                        <span className="truncate">{siteDomain}</span>
                      </div>
                      <div className="w-12"></div>
                    </div>
                    {/* Safari Tab Bar */}
                    <div className="flex items-center px-4 py-2 gap-2 bg-[#252525]">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#383838] text-xs font-medium">
                        <img src={sourceImgSrc} alt="Favicon" className="w-4 h-4 object-contain" />
                        <span className="truncate max-w-[140px]">{siteTitle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded opacity-50 text-xs">
                        <span className="w-3.5 h-3.5 rounded bg-gray-500/40 inline-block"></span>
                        <span>Other Tab</span>
                      </div>
                    </div>
                    <div className="p-6 bg-[var(--background)] text-center text-xs text-[var(--muted-foreground)]">
                      <p className="font-semibold text-[var(--foreground)]">macOS Safari Pinned & Regular Tabs</p>
                      <p className="text-[11px] mt-1">Supports crisp SVG vector rendering on Retina displays.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Google SERP Snippet Preview */}
              {previewTab === 'google' && (
                <div className="w-full max-w-lg p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-[11px] text-[var(--muted-foreground)]">
                    <span className="font-semibold text-[var(--foreground)]">Google Mobile & Desktop Search Result</span>
                    <span className="font-mono text-cyan-400">48×48 px Rule</span>
                  </div>

                  {/* The Google Search Result Snippet */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      {/* 48px / 28px Google Favicon Container */}
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 p-1 flex items-center justify-center border border-gray-200 dark:border-gray-700 shrink-0">
                        <img
                          src={sourceImgSrc}
                          alt="Google SERP Favicon"
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-[var(--foreground)] font-medium leading-tight">
                          {siteTitle}
                        </div>
                        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
                          https://www.{siteDomain} › guide
                        </div>
                      </div>
                    </div>

                    <a href="#mockup-studio" className="text-base font-semibold text-blue-500 dark:text-blue-400 hover:underline block pt-1">
                      {siteTitle} — Official Website & Guide 2026
                    </a>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                      Instant favicon size guide, cheat sheet, and generation tool. Find exact dimensions, formats (ICO, PNG, SVG), and device specifications.
                    </p>
                  </div>
                </div>
              )}

              {/* 4. iOS Home Screen Squircle Mockup */}
              {previewTab === 'ios' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    {/* iOS 18 Squircle with Authentic 180x180 Styling */}
                    <div
                      style={{
                        borderRadius: '22.37%',
                        boxShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                      }}
                      className="w-24 h-24 overflow-hidden bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-105"
                    >
                      <img
                        src={sourceImgSrc}
                        alt="Apple Touch Icon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold text-[var(--foreground)] block">
                      {siteTitle.split(' ')[0] || 'App'}
                    </span>
                    <span className="text-[11px] text-cyan-400 font-mono">
                      180×180 px Apple Touch Icon
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] text-center max-w-xs">
                    iOS automatically applies its signature rounded squircle mask and gentle elevation shadow.
                  </p>
                </div>
              )}

              {/* 5. Android Adaptive Circle Launcher Mockup */}
              {previewTab === 'android' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    {/* Android Material Circle Icon */}
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-900 shadow-2xl p-2 flex items-center justify-center border-2 border-white/10">
                      <img
                        src={sourceImgSrc}
                        alt="Android Chrome 192x192 Icon"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold text-[var(--foreground)] block">
                      {siteTitle.split(' ')[0] || 'App'}
                    </span>
                    <span className="text-[11px] text-cyan-400 font-mono">
                      192×192 & 512×512 PWA Icon
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] text-center max-w-xs">
                    Android adaptive icons support both circle masks and full bleed maskable PWA splash formats.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* Code Snippet Generator Hub */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg space-y-4" id="snippets">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  3. Instant Copy-Paste &lt;link&gt; Snippets
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Pre-configured tags for HTML5, Next.js, Astro, and PWA Web Manifest
                </p>
              </div>

              {/* Preset Switcher Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[var(--muted)]/40 p-1 rounded-xl border border-[var(--border)]">
                {(Object.keys(CODE_SNIPPET_PRESETS) as Array<keyof typeof CODE_SNIPPET_PRESETS>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveSnippetKey(key)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeSnippetKey === key
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-sm'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {key === 'modern2026'
                      ? 'Modern 2026'
                      : key === 'comprehensive'
                      ? 'Full Stack'
                      : key === 'nextjs'
                      ? 'Next.js'
                      : key === 'astro'
                      ? 'Astro'
                      : 'webmanifest'}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block with Copy Button */}
            <div className="relative rounded-xl border border-[var(--border)] bg-[#0f141c] overflow-hidden">
              <div className="py-2 px-4 border-b border-gray-800 flex items-center justify-between text-xs text-gray-400 bg-gray-900/50">
                <span className="font-semibold text-gray-200">
                  {CODE_SNIPPET_PRESETS[activeSnippetKey].title}
                </span>
                <button
                  onClick={() => copyCode(CODE_SNIPPET_PRESETS[activeSnippetKey].code, activeSnippetKey)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs transition-colors cursor-pointer"
                >
                  {copiedSnippetId === activeSnippetKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
                <code>{CODE_SNIPPET_PRESETS[activeSnippetKey].code}</code>
              </pre>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] italic">
              {CODE_SNIPPET_PRESETS[activeSnippetKey].description}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

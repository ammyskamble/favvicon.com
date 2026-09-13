import React, { useState, useMemo } from 'react';
import { FAVICON_SPECS, type FaviconSpec } from '../../data/faviconSizesData';
import { Search, Copy, Check, ShieldCheck, Sparkles } from 'lucide-react';

export const CheatSheetTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Dimensions' },
    { id: 'browsers', label: 'Modern Browsers' },
    { id: 'apple', label: 'Apple & iOS' },
    { id: 'android', label: 'Android & PWA' },
    { id: 'google', label: 'Google SERP' },
    { id: 'legacy', label: 'Legacy Windows' }
  ];

  const filteredSpecs = useMemo(() => {
    return FAVICON_SPECS.filter((spec) => {
      const matchesCategory =
        selectedCategory === 'all' || spec.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        spec.name.toLowerCase().includes(query) ||
        spec.dimensionStr.toLowerCase().includes(query) ||
        spec.filename.toLowerCase().includes(query) ||
        spec.purpose.toLowerCase().includes(query) ||
        spec.format.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current));
    }, 2000);
  };

  const getFormatBadgeStyle = (format: string) => {
    switch (format) {
      case 'SVG':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'ICO':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'PNG':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'JSON':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getImportanceBadgeStyle = (importance: string) => {
    switch (importance) {
      case 'Essential':
        return 'bg-cyan-500/20 text-cyan-300 font-semibold border-cyan-500/40';
      case 'Recommended':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Optional':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'Legacy':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30 line-through';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Filter Pills (Mobile-friendly horizontal scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full flex-nowrap sm:flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white border-transparent shadow-md shadow-indigo-500/20 font-semibold'
                  : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border-[var(--border)] hover:border-cyan-500/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full lg:w-auto lg:min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search size, platform, format..."
            className="w-full pl-10 pr-12 py-2 text-xs rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-lg">
        
        {/* 1. Mobile & Tablet Card View (Visible on screens < lg) */}
        <div className="lg:hidden divide-y divide-[var(--border)]">
          {filteredSpecs.length === 0 ? (
            <div className="py-12 px-4 text-center text-xs text-[var(--muted-foreground)]">
              No favicon dimensions match your search filter "{searchQuery}".
            </div>
          ) : (
            filteredSpecs.map((spec) => {
              const isCopied = copiedId === spec.id;
              return (
                <div key={spec.id} className="p-4 space-y-3 hover:bg-[var(--accent)]/30 transition-colors">
                  {/* Top Bar: Dimension Badge + Format + Priority */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-tabular font-black text-base text-[var(--foreground)] tracking-tight">
                        {spec.dimensionStr}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getFormatBadgeStyle(
                          spec.format
                        )}`}
                      >
                        {spec.format}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border ${getImportanceBadgeStyle(
                        spec.importance
                      )}`}
                    >
                      {spec.importance}
                    </span>
                  </div>

                  {/* Target Platform & File Name */}
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-[var(--foreground)]">
                      {spec.name}
                    </div>
                    <div className="font-mono text-xs text-cyan-400 font-medium">
                      {spec.filename}
                    </div>
                  </div>

                  {/* Purpose Description & Best Practices */}
                  <div className="text-xs text-[var(--muted-foreground)] leading-relaxed space-y-1">
                    <p>{spec.purpose}</p>
                    {spec.notes && (
                      <p className="text-[11px] text-[var(--muted-foreground)]/80 italic">
                        {spec.notes}
                      </p>
                    )}
                  </div>

                  {/* HTML Tag Snippet & 1-Tap Copy Action */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)]">
                    <code className="text-[11px] font-mono text-cyan-300 truncate max-w-full select-all">
                      {spec.tagSnippet}
                    </code>
                    <button
                      onClick={() => copyToClipboard(spec.tagSnippet, spec.id)}
                      className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                        isCopied
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                          : 'bg-[var(--card)] hover:bg-[var(--accent)] text-[var(--foreground)] border-[var(--border)] hover:border-cyan-400/50'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Copy Tag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. Desktop Tabular View (Visible on screens >= lg) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[880px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50 text-[11px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">
                <th className="py-3.5 px-4">Dimension</th>
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-4">Target & Filename</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4 min-w-[240px]">Role & Purpose</th>
                <th className="py-3.5 px-4 text-right">HTML Tag Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {filteredSpecs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--muted-foreground)]">
                    No favicon dimensions match your search filter "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredSpecs.map((spec) => {
                  const isCopied = copiedId === spec.id;
                  return (
                    <tr
                      key={spec.id}
                      className="hover:bg-[var(--accent)]/40 transition-colors group"
                    >
                      {/* Dimension */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-tabular font-bold text-sm text-[var(--foreground)] tracking-tight">
                          {spec.dimensionStr}
                        </span>
                      </td>

                      {/* Format */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getFormatBadgeStyle(
                            spec.format
                          )}`}
                        >
                          {spec.format}
                        </span>
                      </td>

                      {/* Target & Filename */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[var(--foreground)]">
                          {spec.name}
                        </div>
                        <div className="font-tabular text-[11px] text-cyan-400 font-medium">
                          {spec.filename}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border ${getImportanceBadgeStyle(
                            spec.importance
                          )}`}
                        >
                          {spec.importance}
                        </span>
                      </td>

                      {/* Role & Purpose */}
                      <td className="py-3.5 px-4 text-[var(--muted-foreground)] leading-relaxed">
                        <p className="text-xs">{spec.purpose}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)]/80 mt-0.5">
                          {spec.notes}
                        </p>
                      </td>

                      {/* Snippet Copy Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => copyToClipboard(spec.tagSnippet, spec.id)}
                          title="Copy <link> tag to clipboard"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
                            isCopied
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                              : 'bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] border-transparent'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-cyan-400 transition-colors" />
                              <span>Copy Tag</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Summary / Footer */}
        <div className="py-3 px-4 bg-[var(--muted)]/30 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Showing <strong className="text-[var(--foreground)]">{filteredSpecs.length}</strong> specifications compliant with W3C & modern OS standards.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Essential
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Recommended
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span> Optional
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

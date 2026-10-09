import React from 'react';
import { QuotaStatus } from '../types/generator';

interface NavbarProps {
  quota: QuotaStatus | null;
  onOpenExport?: () => void;
  hasGeneratedContent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  quota,
  onOpenExport,
  hasGeneratedContent,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-extrabold text-sm tracking-tighter">
            BK
          </span>
          <span>Book Kaaro</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
          <a href="#generator-tool" className="hover:text-neutral-900 transition-colors">
            Generator
          </a>
          <a href="#calendar-view" className="hover:text-neutral-900 transition-colors">
            Weekly Calendar
          </a>
          <a href="#marketplace-kits" className="hover:text-neutral-900 transition-colors">
            Templates & Kits
          </a>
          <a href="#platform-rules" className="hover:text-neutral-900 transition-colors">
            Platform Rules
          </a>
          <a href="#faq-section" className="hover:text-neutral-900 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {quota && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-neutral-600 tabular-nums bg-neutral-100 px-2.5 py-1.5 rounded-md border border-neutral-200">
              <span className={`w-2 h-2 rounded-full ${quota.remaining > 5 ? 'bg-emerald-500' : quota.remaining > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span>{quota.remaining}/{quota.limit} runs</span>
            </div>
          )}

          {hasGeneratedContent && onOpenExport ? (
            <button
              onClick={onOpenExport}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shadow-xs"
            >
              Export Pack
            </button>
          ) : (
            <a
              href="#generator-tool"
              className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Start Generating
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

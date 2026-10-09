import React from 'react';
import { PlatformKey } from '../types/generator';

interface ContentAuditBarProps {
  captionText: string;
  hashtags: string[];
  platform: PlatformKey;
}

export const ContentAuditBar: React.FC<ContentAuditBarProps> = ({
  captionText,
  hashtags,
  platform,
}) => {
  const words = captionText.trim() ? captionText.trim().split(/\s+/).length : 0;
  const readTimeSeconds = Math.max(1, Math.round((words / 200) * 60));

  // Hook check: check first line or first 120 characters
  const firstLine = captionText.split('\n')[0] || '';
  const hasStrongHook = firstLine.length > 10 && firstLine.length < 140;

  // The Fold check: is text under 125 chars (IG) or 150 (LinkedIn) or does it have an intentional hook before fold
  const foldCutoff = platform === 'instagram' ? 125 : platform === 'linkedin' ? 150 : 200;
  const isAboveFoldScannable = firstLine.length <= foldCutoff;

  // CTA check
  const ctaKeywords = ['comment', 'save', 'share', 'link', 'below', 'thoughts', 'drop', 'dm', 'let us know', 'what do you', 'how do you', 'tell me', 'agree?'];
  const hasCta = ctaKeywords.some((kw) => captionText.toLowerCase().includes(kw)) || captionText.includes('?');

  // Paragraph Scannability: check if multiple line breaks exist for long captions
  const lineCount = captionText.split('\n').filter((l) => l.trim().length > 0).length;
  const isScannable = words < 60 || lineCount >= 3;

  // Hashtag density check
  const tagCount = hashtags.length;
  const isHashtagOptimal =
    platform === 'instagram' ? tagCount >= 5 && tagCount <= 10 :
    platform === 'linkedin' ? tagCount >= 3 && tagCount <= 5 :
    platform === 'facebook' ? tagCount >= 2 && tagCount <= 4 :
    tagCount >= 3 && tagCount <= 6;

  // Calculate composite score (out of 100)
  let score = 20;
  if (hasStrongHook) score += 20;
  if (isAboveFoldScannable) score += 20;
  if (hasCta) score += 20;
  if (isScannable) score += 10;
  if (isHashtagOptimal) score += 10;

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-3.5 space-y-2.5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-800">
            Publishing Quality & Readability Audit
          </span>
          <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
            Score: <strong className={score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-neutral-700'}>{score}/100</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-neutral-500 font-mono text-[11px] tabular-nums">
          <span>{words} words</span>
          <span>·</span>
          <span>~{readTimeSeconds}s read</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        {/* Hook Check */}
        <div className="p-2 rounded bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
          <span className="text-neutral-600">Opening Hook</span>
          <span className={`font-semibold ${hasStrongHook ? 'text-emerald-700' : 'text-neutral-500'}`}>
            {hasStrongHook ? '✓ Concise' : 'Needs Polish'}
          </span>
        </div>

        {/* The Fold Check */}
        <div className="p-2 rounded bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
          <span className="text-neutral-600">The Fold</span>
          <span className={`font-semibold ${isAboveFoldScannable ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isAboveFoldScannable ? '✓ Fits Mobile' : 'Truncated'}
          </span>
        </div>

        {/* CTA Check */}
        <div className="p-2 rounded bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
          <span className="text-neutral-600">Call to Action</span>
          <span className={`font-semibold ${hasCta ? 'text-emerald-700' : 'text-amber-700'}`}>
            {hasCta ? '✓ Detected' : 'Missing'}
          </span>
        </div>

        {/* Hashtag Density */}
        <div className="p-2 rounded bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
          <span className="text-neutral-600">Tags ({tagCount})</span>
          <span className={`font-semibold ${isHashtagOptimal ? 'text-emerald-700' : 'text-neutral-500'}`}>
            {isHashtagOptimal ? '✓ Optimal' : 'Review Count'}
          </span>
        </div>
      </div>
    </div>
  );
};

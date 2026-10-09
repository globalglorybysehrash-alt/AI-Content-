import React, { useState } from 'react';
import { PlatformKey } from '../types/generator';

interface LivePlatformPreviewProps {
  platform: PlatformKey;
  captionText: string;
  hashtags: string[];
  visualPromptNote?: string;
  suggestedFormat?: string;
  brandName?: string;
}

export const LivePlatformPreview: React.FC<LivePlatformPreviewProps> = ({
  platform,
  captionText,
  hashtags,
  visualPromptNote,
  suggestedFormat,
  brandName = 'Book Kaaro',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  const cleanHandle = brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bookkaaro';

  // Fold simulation: truncate after ~125 chars for IG, ~140 for LinkedIn if not expanded
  const foldLimit = platform === 'instagram' ? 125 : platform === 'linkedin' ? 150 : platform === 'twitter' ? 280 : 200;
  const isOverFold = captionText.length > foldLimit;
  const displayText = !isExpanded && isOverFold ? `${captionText.slice(0, foldLimit)}...` : captionText;

  return (
    <div className="bg-neutral-100/80 rounded-xl border border-neutral-300/80 p-4 sm:p-6 space-y-4">
      {/* Preview Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live {platform.toUpperCase()} Feed Mockup
          </span>
          <span className="text-[11px] text-neutral-500">
            (Pixel-faithful client preview)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {platform === 'linkedin' && (
            <div className="flex items-center gap-1 p-0.5 bg-neutral-200 rounded-md text-[11px]">
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`px-2 py-0.5 rounded cursor-pointer ${deviceMode === 'mobile' ? 'bg-white shadow-xs font-semibold' : 'text-neutral-600'}`}
              >
                Mobile
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`px-2 py-0.5 rounded cursor-pointer ${deviceMode === 'desktop' ? 'bg-white shadow-xs font-semibold' : 'text-neutral-600'}`}
              >
                Desktop
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-2 py-1 rounded cursor-pointer"
          >
            {isExpanded ? 'Collapse Fold' : 'Simulate "...more"'}
          </button>
        </div>
      </div>

      {/* Mockup Container */}
      <div className="flex justify-center">
        {/* INSTAGRAM MOCKUP */}
        {platform === 'instagram' && (
          <div className="w-full max-w-sm bg-white rounded-xl border border-neutral-200 shadow-md overflow-hidden text-neutral-900 text-xs">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-[10px] text-neutral-900">
                    BK
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-xs leading-none">{cleanHandle}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Original audio</div>
                </div>
              </div>
              <span className="text-neutral-400 text-sm">•••</span>
            </div>

            {/* Media Area */}
            <div className="relative aspect-4/5 bg-neutral-900 flex items-center justify-center text-center p-6 text-white overflow-hidden">
              <div className="absolute inset-0 bg-radial from-neutral-800 to-neutral-950 opacity-90" />
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 font-semibold">
                  {suggestedFormat || 'Portrait Carousel'}
                </span>
                <p className="text-sm font-bold text-balance px-4 leading-snug">
                  {visualPromptNote || 'Minimalist typography slide with clean editorial layout'}
                </p>
                <div className="pt-2">
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs font-mono">
                    1 / 5
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-3 pb-2 space-y-2">
              <div className="flex items-center justify-between text-base">
                <div className="flex items-center gap-3">
                  <span className="cursor-pointer hover:opacity-70">❤️</span>
                  <span className="cursor-pointer hover:opacity-70">💬</span>
                  <span className="cursor-pointer hover:opacity-70">↗️</span>
                </div>
                <span className="cursor-pointer hover:opacity-70">🔖</span>
              </div>

              {/* Likes */}
              <div className="font-semibold text-[11px]">342 likes</div>

              {/* Caption */}
              <div className="text-xs leading-relaxed text-neutral-800 whitespace-pre-line">
                <strong className="font-semibold mr-1.5">{cleanHandle}</strong>
                {displayText}
                {isOverFold && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-neutral-400 ml-1 hover:underline cursor-pointer"
                  >
                    {isExpanded ? ' less' : ' more'}
                  </button>
                )}
              </div>

              {/* Hashtags display */}
              {hashtags.length > 0 && (
                <div className="text-[11px] text-blue-900/80 leading-normal pt-1">
                  {hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
                </div>
              )}

              <div className="text-[10px] text-neutral-400 uppercase pt-1 tracking-wider">
                2 hours ago · See translation
              </div>
            </div>
          </div>
        )}

        {/* LINKEDIN MOCKUP */}
        {platform === 'linkedin' && (
          <div className={`w-full ${deviceMode === 'desktop' ? 'max-w-lg' : 'max-w-sm'} bg-white rounded-xl border border-neutral-200 shadow-md p-4 text-xs space-y-3`}>
            {/* LinkedIn Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  BK
                </div>
                <div>
                  <div className="flex items-center gap-1 font-semibold text-neutral-900 text-xs">
                    <span>{brandName}</span>
                    <span className="text-neutral-400 text-[10px]">· 1st</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 leading-tight">
                    Creator Infrastructure & Publishing Strategy
                  </div>
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                    <span>1h · Edited</span>
                    <span>· 🌐</span>
                  </div>
                </div>
              </div>
              <button type="button" className="text-blue-600 font-semibold text-xs flex items-center gap-0.5 cursor-pointer">
                <span>+</span> Follow
              </button>
            </div>

            {/* Post Content */}
            <div className="text-neutral-800 leading-relaxed whitespace-pre-line text-xs">
              {displayText}
              {isOverFold && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-neutral-500 font-medium ml-1 hover:underline cursor-pointer"
                >
                  {isExpanded ? ' …see less' : ' …see more'}
                </button>
              )}
            </div>

            {/* Hashtags */}
            {hashtags.length > 0 && (
              <div className="text-blue-700 text-[11px] font-medium">
                {hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
              </div>
            )}

            {/* Document / Media Card Preview */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-center space-y-1">
              <div className="text-[11px] font-semibold text-neutral-800">
                📄 {suggestedFormat || 'Document Deck / Slide PDF'}
              </div>
              <div className="text-[10px] text-neutral-500">
                {visualPromptNote || 'Multi-page document formatted for high dwell time'}
              </div>
            </div>

            {/* Social Engagement counts */}
            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-b border-neutral-100 pb-2">
              <div className="flex items-center gap-1">
                <span>👏💡❤️</span>
                <span>89</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span>14 comments</span>
                <span>·</span>
                <span>6 reposts</span>
              </div>
            </div>

            {/* Reaction Bar */}
            <div className="grid grid-cols-4 gap-1 text-[11px] font-medium text-neutral-600 text-center pt-0.5">
              <span className="py-1 hover:bg-neutral-50 rounded cursor-pointer">👍 Like</span>
              <span className="py-1 hover:bg-neutral-50 rounded cursor-pointer">💬 Comment</span>
              <span className="py-1 hover:bg-neutral-50 rounded cursor-pointer">🔁 Repost</span>
              <span className="py-1 hover:bg-neutral-50 rounded cursor-pointer">📤 Send</span>
            </div>
          </div>
        )}

        {/* FACEBOOK MOCKUP */}
        {platform === 'facebook' && (
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl border border-neutral-200 shadow-md p-4 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  BK
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 text-xs flex items-center gap-1">
                    <span>{brandName}</span>
                    <span className="text-blue-500 text-[11px]">✓</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">Sponsored / Recommended · 🌐</div>
                </div>
              </div>
              <span className="text-neutral-400 font-bold">•••</span>
            </div>

            <div className="text-neutral-800 leading-relaxed whitespace-pre-line text-xs">
              {displayText}
              {isOverFold && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-neutral-500 font-medium ml-1 hover:underline cursor-pointer"
                >
                  {isExpanded ? ' See less' : ' See more'}
                </button>
              )}
            </div>

            {/* Media Box */}
            <div className="aspect-16/9 bg-neutral-900 rounded-lg flex items-center justify-center text-white p-4 text-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300">
                  {suggestedFormat || 'Photo & Discussion'}
                </span>
                <p className="text-xs font-semibold text-neutral-200 mt-1">
                  {visualPromptNote || 'Community conversation trigger'}
                </p>
              </div>
            </div>

            {/* Reactions */}
            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-100">
              <span>👍❤️ 128</span>
              <span>32 Comments · 19 Shares</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[11px] font-medium text-neutral-600 text-center border-t border-neutral-100 pt-2">
              <span className="cursor-pointer hover:bg-neutral-50 py-1 rounded">👍 Like</span>
              <span className="cursor-pointer hover:bg-neutral-50 py-1 rounded">💬 Comment</span>
              <span className="cursor-pointer hover:bg-neutral-50 py-1 rounded">↗️ Share</span>
            </div>
          </div>
        )}

        {/* TIKTOK MOCKUP */}
        {platform === 'tiktok' && (
          <div className="w-full max-w-xs bg-neutral-950 rounded-2xl border-4 border-neutral-800 shadow-2xl overflow-hidden aspect-9/16 flex flex-col justify-between text-white p-4 relative">
            {/* Top header */}
            <div className="flex items-center justify-between text-xs text-white/80 z-10 pt-1">
              <span className="text-neutral-400">LIVE</span>
              <div className="flex items-center gap-3 font-semibold text-xs">
                <span className="text-white/60">Following</span>
                <span className="text-white border-b-2 border-white pb-0.5">For You</span>
              </div>
              <span>🔍</span>
            </div>

            {/* On-screen visual hook card */}
            <div className="z-10 bg-black/60 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-center space-y-1 mx-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                {suggestedFormat || 'On-Screen Hook'}
              </span>
              <p className="text-xs font-extrabold leading-snug">
                {visualPromptNote || 'Hook text appears in center frame in seconds 0-3'}
              </p>
            </div>

            {/* Bottom info & right interaction rail */}
            <div className="z-10 flex items-end justify-between gap-3">
              {/* Bottom text */}
              <div className="space-y-1 max-w-[78%]">
                <div className="font-bold text-xs">@{cleanHandle}</div>
                <div className="text-[11px] leading-tight text-white/90 line-clamp-3">
                  {displayText}
                </div>
                {hashtags.length > 0 && (
                  <div className="text-[10px] text-white/80 font-bold truncate">
                    {hashtags.slice(0, 4).join(' ')}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[10px] text-white/70 pt-0.5">
                  <span>🎵</span>
                  <span className="truncate">Original Sound - {brandName} Audio</span>
                </div>
              </div>

              {/* Right interaction column */}
              <div className="flex flex-col items-center gap-3 text-center pb-1">
                <div className="w-9 h-9 rounded-full bg-white text-neutral-900 font-bold text-xs flex items-center justify-center border-2 border-red-500">
                  BK
                </div>
                <div className="space-y-0.5">
                  <span className="text-lg">❤️</span>
                  <div className="text-[9px] font-bold">14.2K</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-lg">💬</span>
                  <div className="text-[9px] font-bold">892</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-lg">🔖</span>
                  <div className="text-[9px] font-bold">3.1K</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-lg">↗️</span>
                  <div className="text-[9px] font-bold">Share</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* X / TWITTER MOCKUP */}
        {platform === 'twitter' && (
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl border border-neutral-200 shadow-md p-4 text-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs">
                  BK
                </div>
                <div>
                  <div className="font-bold text-neutral-900 text-xs flex items-center gap-1">
                    <span>{brandName}</span>
                    <span className="text-neutral-500 text-[10px]">@{cleanHandle} · 12m</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">Creator &amp; Founder</div>
                </div>
              </div>
              <span className="font-bold text-neutral-800 text-sm">𝕏</span>
            </div>

            <div className="text-neutral-900 leading-relaxed whitespace-pre-line text-xs font-normal">
              {displayText}
            </div>

            {hashtags.length > 0 && (
              <div className="text-blue-500 text-xs font-normal">
                {hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
              </div>
            )}

            {/* Post Visual Card */}
            {visualPromptNote && (
              <div className="rounded-xl border border-neutral-200 overflow-hidden bg-neutral-900 text-white p-4 text-center">
                <span className="text-[10px] text-amber-400 font-mono uppercase">{suggestedFormat || 'Card / Graphic'}</span>
                <p className="text-xs font-medium text-neutral-200 mt-0.5">{visualPromptNote}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-neutral-500 text-[11px] pt-2 border-t border-neutral-100">
              <span className="cursor-pointer hover:text-blue-500">💬 18</span>
              <span className="cursor-pointer hover:text-green-500">🔁 42</span>
              <span className="cursor-pointer hover:text-rose-500">❤️ 219</span>
              <span className="cursor-pointer hover:text-blue-500">📊 8.4K</span>
              <span className="cursor-pointer hover:text-neutral-800">🔖 31</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';

export const PlatformGuidelinesSection: React.FC = () => {
  return (
    <section id="platform-rules" className="py-12 md:py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            <span>Publishing Standards</span>
            <span aria-hidden="true">·</span>
            <span>Channel Specifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Platform-Specific Formatting & Publishing Rules
          </h2>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            Understanding platform-specific technical limits ensures your copy isn’t truncated at the wrong moment or flagged as spam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Instagram */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl">📸</span>
              <span className="text-[11px] font-mono text-neutral-500 font-semibold">2,200 char cap</span>
            </div>
            <h3 className="font-bold text-sm text-neutral-900">Instagram Rules</h3>
            <ul className="text-xs text-neutral-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>The Fold:</strong> Only the first 125 characters appear before "...more". Hook immediately.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>Hashtags:</strong> Stick to 5–8 niche-specific tags. Avoid generic 1M+ tags like #love or #viral.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>Aspect Ratios:</strong> 1:1 square or 4:5 portrait (1080x1350px) maximizes feed screen share.</span>
              </li>
            </ul>
          </div>

          {/* LinkedIn */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl">💼</span>
              <span className="text-[11px] font-mono text-neutral-500 font-semibold">3,000 char cap</span>
            </div>
            <h3 className="font-bold text-sm text-neutral-900">LinkedIn Standards</h3>
            <ul className="text-xs text-neutral-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>The Fold:</strong> First 2–3 lines (approx. 140–180 characters) determine click-through on "see more".</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>Formatting:</strong> Generous whitespace. Single-sentence paragraphs improve mobile skimmability.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>Hashtags:</strong> 3–5 targeted industry tags. Excessive tagging reduces professional authority.</span>
              </li>
            </ul>
          </div>

          {/* Facebook */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl">👥</span>
              <span className="text-[11px] font-mono text-neutral-500 font-semibold">5,000 char cap</span>
            </div>
            <h3 className="font-bold text-sm text-neutral-900">Facebook Engagement</h3>
            <ul className="text-xs text-neutral-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>Ideal Length:</strong> 80–150 words. Posts sparking respectful group comments perform best.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>Questions:</strong> End with an open-ended conversational inquiry rather than an abrupt sales pitch.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>Media:</strong> Native video and multi-photo sets generate significantly higher organic shares.</span>
              </li>
            </ul>
          </div>

          {/* TikTok */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl">🎵</span>
              <span className="text-[11px] font-mono text-neutral-500 font-semibold">2,200 char cap</span>
            </div>
            <h3 className="font-bold text-sm text-neutral-900">TikTok Scripting</h3>
            <ul className="text-xs text-neutral-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>3-Second Rule:</strong> Visual movement and verbal hook must sync within the first 3 seconds.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>On-Screen Text:</strong> Keep text overlays in the center "safe zone" to avoid app UI overlap.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-neutral-400">·</span>
                <span><strong>SEO Captions:</strong> Describe your video content clearly so TikTok search indexes the keywords.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Related Tool Ecosystem Links */}
        <div className="mt-10 p-6 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-neutral-900">
              Related Book Kaaro Publishing Utilities
            </h4>
            <p className="text-xs text-neutral-600 mt-0.5">
              Explore interconnected tools for scheduling, audience research, and brand kit alignment.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-md text-neutral-700 font-medium">
              Notion 90-Day Planner
            </span>
            <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-md text-neutral-700 font-medium">
              Hashtag Group Manager
            </span>
            <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-md text-neutral-700 font-medium">
              Figma Carousel Kit
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

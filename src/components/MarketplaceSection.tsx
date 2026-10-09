import React, { useState } from 'react';
import { MarketplaceKit } from '../types/generator';
import { BOOK_KAARO_MARKETPLACE_KITS } from '../data/marketplaceData';

export const MarketplaceSection: React.FC = () => {
  const [selectedKit, setSelectedKit] = useState<MarketplaceKit | null>(null);

  return (
    <section id="marketplace-kits" className="py-12 md:py-16 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              <span>Book Kaaro Marketplace</span>
              <span aria-hidden="true">·</span>
              <span>Official Creator Tools</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Connected Content Planners & Marketing Kits
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
              Turn your generated captions and schedules into organized production workflows with these vetted Book Kaaro templates.
            </p>
          </div>

          <div className="text-xs text-neutral-500 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shrink-0">
            <span className="font-semibold text-neutral-700">Transparency Note:</span> Catalog resource previews are free to inspect; no payment or account required.
          </div>
        </div>

        {/* 3 Marketplace Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BOOK_KAARO_MARKETPLACE_KITS.map((kit) => (
            <div
              key={kit.id}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden">
                  <img
                    src={kit.imageUrl}
                    alt={kit.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded">
                    {kit.badge}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {kit.category} · {kit.format}
                  </div>
                  <h3 className="font-bold text-base text-neutral-900 leading-snug">
                    {kit.title}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                    {kit.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-neutral-700 block mb-1">
                      Includes:
                    </span>
                    <ul className="text-xs text-neutral-600 space-y-1">
                      {kit.includes.slice(0, 2).map((inc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-neutral-400">·</span>
                          <span className="truncate">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-neutral-100 mt-4 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-medium">
                  {kit.priceLabel}
                </span>
                <button
                  onClick={() => setSelectedKit(kit)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kit Detail Preview Drawer/Modal */}
      {selectedKit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-neutral-200">
              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {selectedKit.category} · {selectedKit.format}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 mt-0.5">{selectedKit.title}</h3>
              </div>
              <button
                onClick={() => setSelectedKit(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm text-neutral-700">
              <div className="aspect-16/9 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                <img
                  src={selectedKit.imageUrl}
                  alt={selectedKit.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 mb-1">
                  How This Pairs With Your Generated Content
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
                  {selectedKit.previewOverview}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 mb-2">
                  Full Feature Checklist
                </h4>
                <ul className="text-xs space-y-2 text-neutral-600">
                  {selectedKit.includes.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900">
                <span className="font-bold">Catalog Integration Status:</span> This digital template is provided as a production blueprint placeholder for Book Kaaro users. You can immediately paste your generated CSV calendar and captions into your own workspace.
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-medium">
                {selectedKit.priceLabel}
              </span>
              <button
                onClick={() => setSelectedKit(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

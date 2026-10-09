import React, { useState } from 'react';
import { HookItem, CtaItem } from '../types/generator';

interface HooksAndCtasProps {
  hooks: HookItem[];
  ctas: CtaItem[];
  onUpdateHook: (id: string, newText: string) => void;
  onUpdateCta: (id: string, newText: string) => void;
  onRegenerateHooks: () => void;
  onRegenerateCtas: () => void;
  isRegeneratingHooks: boolean;
  isRegeneratingCtas: boolean;
}

export const HooksAndCtas: React.FC<HooksAndCtasProps> = ({
  hooks,
  ctas,
  onUpdateHook,
  onUpdateCta,
  onRegenerateHooks,
  onRegenerateCtas,
  isRegeneratingHooks,
  isRegeneratingCtas,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAllHooks, setCopiedAllHooks] = useState<boolean>(false);
  const [copiedAllCtas, setCopiedAllCtas] = useState<boolean>(false);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Fallback
    }
  };

  const handleCopyAllHooks = async () => {
    if (hooks.length === 0) return;
    const formatted = hooks
      .map((h, i) => `${i + 1}. [${h.style.replace('_', ' ').toUpperCase()}]: ${h.text}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(`🔥 High-Retention Opening Hooks:\n\n${formatted}`);
      setCopiedAllHooks(true);
      setTimeout(() => setCopiedAllHooks(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyAllCtas = async () => {
    if (ctas.length === 0) return;
    const formatted = ctas
      .map((c, i) => `${i + 1}. [${c.intent.replace('_', ' ').toUpperCase()}]: ${c.text}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(`🎯 Contextual Calls-To-Action (CTAs):\n\n${formatted}`);
      setCopiedAllCtas(true);
      setTimeout(() => setCopiedAllCtas(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hooks Column */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-neutral-100 gap-3">
            <div>
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                High-Retention Opening Hooks
              </h3>
              <p className="text-xs text-neutral-500">
                5 distinct psychological angles for video titles or post intros.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {/* Section-level Copy to Clipboard Button */}
              <button
                type="button"
                onClick={handleCopyAllHooks}
                className="text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Copy all hooks to clipboard"
              >
                <span>{copiedAllHooks ? '✓' : '📋'}</span>
                <span>{copiedAllHooks ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>

              <button
                type="button"
                onClick={onRegenerateHooks}
                disabled={isRegeneratingHooks}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
              >
                <span>↻</span>
                <span className="hidden sm:inline">{isRegeneratingHooks ? 'Updating...' : 'Regen'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {hooks.map((hook, index) => {
              const currentId = hook.id || `hook-${index}`;
              const isCopied = copiedId === currentId;
              return (
                <div
                  key={currentId}
                  className="p-3.5 rounded-lg border border-neutral-200/90 bg-neutral-50/50 hover:bg-white transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-700 capitalize">
                      {index + 1}. {hook.style.replace('_', ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(hook.text, currentId)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      <span>{isCopied ? '✓' : '📋'}</span>
                      <span>{isCopied ? 'Copied to Clipboard' : 'Copy to Clipboard'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={hook.text}
                    onChange={(e) => onUpdateHook(currentId, e.target.value)}
                    className="w-full text-xs sm:text-sm font-medium text-neutral-800 bg-white border border-neutral-200 rounded px-2.5 py-1.5 focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTAs Column */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-neutral-100 gap-3">
            <div>
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                Contextual Calls-To-Action (CTAs)
              </h3>
              <p className="text-xs text-neutral-500">
                Action-oriented closers categorized by conversion intent.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {/* Section-level Copy to Clipboard Button */}
              <button
                type="button"
                onClick={handleCopyAllCtas}
                className="text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Copy all CTAs to clipboard"
              >
                <span>{copiedAllCtas ? '✓' : '📋'}</span>
                <span>{copiedAllCtas ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>

              <button
                type="button"
                onClick={onRegenerateCtas}
                disabled={isRegeneratingCtas}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
              >
                <span>↻</span>
                <span className="hidden sm:inline">{isRegeneratingCtas ? 'Updating...' : 'Regen'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {ctas.map((cta, index) => {
              const currentId = cta.id || `cta-${index}`;
              const isCopied = copiedId === currentId;
              return (
                <div
                  key={currentId}
                  className="p-3.5 rounded-lg border border-neutral-200/90 bg-neutral-50/50 hover:bg-white transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-700 capitalize">
                      {index + 1}. Intent: {cta.intent.replace('_', ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(cta.text, currentId)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      <span>{isCopied ? '✓' : '📋'}</span>
                      <span>{isCopied ? 'Copied to Clipboard' : 'Copy to Clipboard'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cta.text}
                    onChange={(e) => onUpdateCta(currentId, e.target.value)}
                    className="w-full text-xs sm:text-sm font-medium text-neutral-800 bg-white border border-neutral-200 rounded px-2.5 py-1.5 focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

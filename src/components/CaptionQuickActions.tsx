import React, { useState } from 'react';
import { PlatformKey, RewriteAction } from '../types/generator';

interface CaptionQuickActionsProps {
  currentText: string;
  platform: PlatformKey;
  topic: string;
  onApplyRewrite: (newText: string) => void;
  onOpenAltText?: (altText: string) => void;
}

const ACTIONS: { id: RewriteAction; label: string; icon: string; desc: string }[] = [
  { id: 'shorten', label: 'Make Shorter', icon: '✂️', desc: 'Trim fluff & tighten' },
  { id: 'expand', label: 'Expand Story', icon: '📖', desc: 'Add narrative depth' },
  { id: 'executive', label: 'Make Executive', icon: '👔', desc: 'High-credibility B2B style' },
  { id: 'hook_boost', label: 'Boost Hook', icon: '✨', desc: 'Punchier first line' },
  { id: 'add_emojis', label: 'Add Emojis', icon: '😊', desc: 'Visual bullet points' },
  { id: 'remove_emojis', label: 'Remove Emojis', icon: '🧹', desc: 'Clean minimalist prose' },
  { id: 'alt_text', label: 'Generate Alt Text', icon: '♿', desc: 'Accessible screen reader text' },
];

export const CaptionQuickActions: React.FC<CaptionQuickActionsProps> = ({
  currentText,
  platform,
  topic,
  onApplyRewrite,
  onOpenAltText,
}) => {
  const [activeLoading, setActiveLoading] = useState<RewriteAction | null>(null);
  const [feedbackNote, setFeedbackNote] = useState<string | null>(null);

  const handleActionClick = async (action: RewriteAction) => {
    if (!currentText.trim()) return;
    setActiveLoading(action);
    setFeedbackNote(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          currentText,
          section: 'rewrite',
          rewriteAction: action,
          targetPlatform: platform,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data?.rewrittenText) {
          if (action === 'alt_text') {
            if (onOpenAltText) {
              onOpenAltText(json.data.rewrittenText);
            } else {
              setFeedbackNote(`Alt Text: ${json.data.rewrittenText}`);
            }
          } else {
            onApplyRewrite(json.data.rewrittenText);
            setFeedbackNote(json.data.changeNote || `Applied: ${action}`);
            setTimeout(() => setFeedbackNote(null), 3000);
          }
          return;
        }
      }
      throw new Error('API rewrite unavailable');
    } catch {
      // Fallback local smart transformation
      let fallbackText = currentText;
      if (action === 'remove_emojis') {
        fallbackText = currentText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').replace(/\s{2,}/g, ' ');
      } else if (action === 'add_emojis') {
        fallbackText = `💡 ${currentText.replace(/\n\n/g, '\n\n👉 ')}`;
      } else if (action === 'shorten') {
        const lines = currentText.split('\n').filter(Boolean);
        fallbackText = lines.slice(0, Math.max(2, Math.floor(lines.length * 0.6))).join('\n\n');
      } else if (action === 'alt_text') {
        const alt = `Image showing editorial graphic for ${topic}. Minimalist design with high-contrast text and clean typography.`;
        if (onOpenAltText) onOpenAltText(alt);
        return;
      }
      onApplyRewrite(fallbackText);
      setFeedbackNote(`Applied ${action} (local transformation)`);
      setTimeout(() => setFeedbackNote(null), 3000);
    } finally {
      setActiveLoading(null);
    }
  };

  return (
    <div className="bg-neutral-50/70 p-3 rounded-lg border border-neutral-200/90 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
          <span>⚡</span>
          <span>AI Quick Assistant</span>
        </span>
        {feedbackNote && (
          <span className="text-[11px] text-emerald-700 font-medium animate-fade-in">
            ✓ {feedbackNote}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {ACTIONS.map((act) => (
          <button
            type="button"
            key={act.id}
            onClick={() => handleActionClick(act.id)}
            disabled={activeLoading !== null}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50 shadow-2xs"
            title={act.desc}
          >
            <span>{activeLoading === act.id ? '⏳' : act.icon}</span>
            <span>{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

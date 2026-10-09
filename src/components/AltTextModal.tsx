import React, { useState } from 'react';
import { CharacterCounter } from './CharacterCounter';

interface AltTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  altText: string;
  onSave?: (text: string) => void;
}

export const AltTextModal: React.FC<AltTextModalProps> = ({
  isOpen,
  onClose,
  altText,
}) => {
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState(altText);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-md w-full border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <span className="text-base">♿</span>
            <h3 className="text-sm font-bold text-neutral-900">
              Accessibility & Alt Text (WCAG Compliant)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <p className="text-neutral-600 leading-relaxed">
            Leading international social platforms (Instagram, LinkedIn, X, Facebook) reward accessible posts with higher reach and screen-reader inclusivity.
          </p>

          <div className="space-y-1.5">
            <label className="font-semibold text-neutral-800 block">
              Suggested Image Alt Text:
            </label>
            <textarea
              rows={4}
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="w-full text-xs rounded-lg border border-neutral-300 p-3 text-neutral-800 focus:border-neutral-900 focus:outline-none"
            />
            <div className="flex justify-between items-center text-[11px] pt-0.5">
              <span className="text-neutral-400">Recommended &lt; 150 chars</span>
              <CharacterCounter currentLength={editableText.length} maxLength={150} showRadialGauge={true} />
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
            <span className="font-semibold text-neutral-800 block">Best Practices:</span>
            <p>• Avoid starting with "Image of" or "Photo of". Describe the actual information or diagram.</p>
            <p>• If text is embedded in a slide or carousel, transcribe the essential takeaway verbatim.</p>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">
            Ready to paste into platform media settings
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {copied ? '✓ Copied!' : 'Copy Alt Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

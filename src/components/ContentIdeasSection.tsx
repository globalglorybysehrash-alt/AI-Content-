import React, { useState } from 'react';
import { ContentIdea } from '../types/generator';

interface ContentIdeasSectionProps {
  ideas: ContentIdea[];
  onUpdateIdea: (id: string, updated: Partial<ContentIdea>) => void;
  onRegenerateIdeas: () => void;
  isRegenerating: boolean;
}

export const ContentIdeasSection: React.FC<ContentIdeasSectionProps> = ({
  ideas,
  onUpdateIdea,
  onRegenerateIdeas,
  isRegenerating,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const copyIdea = async (idea: ContentIdea) => {
    try {
      await navigator.clipboard.writeText(`${idea.title} (${idea.format})\nAngle: ${idea.angle}`);
      setCopiedId(idea.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Fallback
    }
  };

  const handleCopyAll = async () => {
    if (ideas.length === 0) return;
    const formatted = ideas
      .map((idea, i) => `${i + 1}. [${idea.format}]: ${idea.title}\n   Strategic Angle: ${idea.angle}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(`💡 Content Angles & Repurposing Blueprint:\n\n${formatted}`);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-neutral-100 gap-3">
        <div>
          <h3 className="text-base font-bold text-neutral-900 tracking-tight">
            Follow-Up Content Angles & Repurposing Ideas
          </h3>
          <p className="text-xs text-neutral-500">
            5 distinct perspectives to extend this single topic into multiple formats.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Section-level Copy to Clipboard */}
          <button
            type="button"
            onClick={handleCopyAll}
            className="text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Copy all content angles to clipboard"
          >
            <span>{copiedAll ? '✓' : '📋'}</span>
            <span>{copiedAll ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
          </button>

          <button
            onClick={onRegenerateIdeas}
            disabled={isRegenerating}
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
          >
            <span>↻</span>
            <span>{isRegenerating ? 'Generating...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea, index) => {
          const currentId = idea.id || `idea-${index}`;
          const isCopied = copiedId === currentId;
          return (
            <div
              key={currentId}
              className="p-4 rounded-lg border border-neutral-200/90 bg-neutral-50/50 hover:bg-white transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">
                    Angle {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyIdea(idea)}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                      isCopied
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
                    }`}
                  >
                    <span>{isCopied ? '✓' : '📋'}</span>
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Post Concept:</label>
                  <input
                    type="text"
                    value={idea.title}
                    onChange={(e) => onUpdateIdea(currentId, { title: e.target.value })}
                    className="w-full text-xs sm:text-sm font-semibold text-neutral-900 bg-white border border-neutral-200 rounded px-2.5 py-1.5 focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500 font-medium">Format:</span>
                  <input
                    type="text"
                    value={idea.format}
                    onChange={(e) => onUpdateIdea(currentId, { format: e.target.value })}
                    className="text-xs text-neutral-700 bg-white border border-neutral-200 rounded px-2 py-0.5 focus:border-neutral-900 focus:outline-none flex-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Strategic Angle:</label>
                  <textarea
                    rows={2}
                    value={idea.angle}
                    onChange={(e) => onUpdateIdea(currentId, { angle: e.target.value })}
                    className="w-full text-xs text-neutral-700 bg-white border border-neutral-200 rounded px-2.5 py-1.5 focus:border-neutral-900 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

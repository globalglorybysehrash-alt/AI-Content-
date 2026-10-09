import React, { useState, useRef } from 'react';
import { PlatformKey, PlatformContent } from '../types/generator';
import { HashtagGenerator } from './HashtagGenerator';
import { LivePlatformPreview } from './LivePlatformPreview';
import { CaptionQuickActions } from './CaptionQuickActions';
import { ContentAuditBar } from './ContentAuditBar';
import { AltTextModal } from './AltTextModal';
import { InlineEmojiPicker, QUICK_BRANDED_EMOJIS } from './InlineEmojiPicker';
import { CharacterCounter } from './CharacterCounter';

interface CaptionsWorkspaceProps {
  platformCaptions: Partial<Record<PlatformKey, PlatformContent>>;
  activePlatforms: PlatformKey[];
  topic?: string;
  brandName?: string;
  onUpdateCaption: (platform: PlatformKey, field: 'shortCaption' | 'longCaption', text: string) => void;
  onUpdateHashtags?: (platform: PlatformKey, hashtags: string[]) => void;
  onRegeneratePlatform: (platform: PlatformKey) => void;
  isRegenerating: boolean;
}

const PLATFORM_CONFIG: Record<
  PlatformKey,
  { name: string; icon: string; charLimit: number; foldLimit: number; tip: string }
> = {
  instagram: {
    name: 'Instagram',
    icon: '📸',
    charLimit: 2200,
    foldLimit: 125,
    tip: 'Visual first. Line breaks improve readability; 5-8 targeted hashtags perform best.',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    charLimit: 3000,
    foldLimit: 140,
    tip: 'Professional storytelling. 1-2 sentence spacing; hook within the first 140 characters.',
  },
  twitter: {
    name: 'X (Twitter)',
    icon: '𝕏',
    charLimit: 280,
    foldLimit: 280,
    tip: 'Punchy & concise. 280-character hard cap. 1-2 focused hashtags.',
  },
  facebook: {
    name: 'Facebook',
    icon: '👥',
    charLimit: 5000,
    foldLimit: 200,
    tip: 'Community-oriented. Close with an open question to spark genuine comment conversations.',
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    charLimit: 2200,
    foldLimit: 150,
    tip: 'Video pacing. Clear on-screen hook within 3 seconds, natural spoken delivery tone.',
  },
};

export const CaptionsWorkspace: React.FC<CaptionsWorkspaceProps> = ({
  platformCaptions,
  activePlatforms,
  topic = '',
  brandName = 'Book Kaaro',
  onUpdateCaption,
  onUpdateHashtags,
  onRegeneratePlatform,
  isRegenerating,
}) => {
  const availablePlatforms = activePlatforms.filter((p) => platformCaptions[p]);
  const defaultTab = availablePlatforms[0] || 'instagram';

  const [selectedTab, setSelectedTab] = useState<PlatformKey>(defaultTab);
  const [variation, setVariation] = useState<'short' | 'long'>('short');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [insertedFeedback, setInsertedFeedback] = useState(false);
  const [isHashtagGenOpen, setIsHashtagGenOpen] = useState(false);
  const [workspaceView, setWorkspaceView] = useState<'editor' | 'preview' | 'split'>('split');
  const [altTextModalData, setAltTextModalData] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // If selected platform was removed or empty, fallback
  const currentPlatform = availablePlatforms.includes(selectedTab) ? selectedTab : defaultTab;
  const content = platformCaptions[currentPlatform];
  const config = PLATFORM_CONFIG[currentPlatform];

  if (!content) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-neutral-200 text-neutral-500 text-sm">
        No platform captions generated yet. Select your platforms and click generate.
      </div>
    );
  }

  const activeText = variation === 'short' ? content.shortCaption : content.longCaption;
  const charCount = activeText.length;
  const isOverLimit = charCount > config.charLimit;

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(activeText);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyHashtags = async () => {
    if (!content.hashtags || content.hashtags.length === 0) return;
    try {
      await navigator.clipboard.writeText(content.hashtags.join(' '));
      setCopiedHashtags(true);
      setTimeout(() => setCopiedHashtags(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Insert hashtags into caption
  const handleInsertHashtagsIntoCaption = (tagsToInsert: string[], mode: 'append' | 'replace' = 'append') => {
    if (!tagsToInsert || tagsToInsert.length === 0) return;
    const tagsString = tagsToInsert.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ');
    const field = variation === 'short' ? 'shortCaption' : 'longCaption';

    let newCaption = activeText;
    if (mode === 'replace') {
      const lines = newCaption.split('\n');
      const filteredLines = lines.filter((line) => !line.trim().startsWith('#'));
      newCaption = `${filteredLines.join('\n').trim()}\n\n${tagsString}`;
    } else {
      if (!newCaption.includes(tagsString)) {
        newCaption = `${newCaption.trim()}\n\n${tagsString}`;
      }
    }

    onUpdateCaption(currentPlatform, field, newCaption);
    if (onUpdateHashtags) {
      onUpdateHashtags(currentPlatform, tagsToInsert);
    }

    setInsertedFeedback(true);
    setTimeout(() => setInsertedFeedback(false), 2000);
  };

  // Quick insertion of current curated hashtags
  const handleQuickInsertCuratedHashtags = () => {
    if (content.hashtags && content.hashtags.length > 0) {
      handleInsertHashtagsIntoCaption(content.hashtags, 'append');
    } else {
      setIsHashtagGenOpen(true);
    }
  };

  const handleApplyRewrite = (newText: string) => {
    const field = variation === 'short' ? 'shortCaption' : 'longCaption';
    onUpdateCaption(currentPlatform, field, newText);
  };

  const handleInsertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    const field = variation === 'short' ? 'shortCaption' : 'longCaption';

    if (!textarea) {
      onUpdateCaption(currentPlatform, field, `${activeText} ${emoji}`);
      return;
    }

    const start = textarea.selectionStart ?? activeText.length;
    const end = textarea.selectionEnd ?? activeText.length;
    const before = activeText.substring(0, start);
    const after = activeText.substring(end);
    const newText = `${before}${emoji}${after}`;

    onUpdateCaption(currentPlatform, field, newText);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + emoji.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
      {/* Platform Tabs Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-neutral-200 px-4 sm:px-6 py-3 bg-neutral-50/60 gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {availablePlatforms.map((p) => {
            const pConf = PLATFORM_CONFIG[p];
            const isTabActive = p === currentPlatform;
            return (
              <button
                key={p}
                onClick={() => {
                  setSelectedTab(p);
                  setCopiedCaption(false);
                  setCopiedHashtags(false);
                  setInsertedFeedback(false);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isTabActive
                    ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <span>{pConf.icon}</span>
                <span>{pConf.name}</span>
              </button>
            );
          })}
        </div>

        {/* View Switcher and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Workspace Layout Mode */}
          <div className="hidden sm:flex items-center gap-1 p-0.5 bg-neutral-200/80 rounded-md text-[11px]">
            <button
              type="button"
              onClick={() => setWorkspaceView('editor')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                workspaceView === 'editor' ? 'bg-white text-neutral-900 font-semibold shadow-xs' : 'text-neutral-600'
              }`}
            >
              Editor Only
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceView('split')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                workspaceView === 'split' ? 'bg-white text-neutral-900 font-semibold shadow-xs' : 'text-neutral-600'
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceView('preview')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                workspaceView === 'preview' ? 'bg-white text-neutral-900 font-semibold shadow-xs' : 'text-neutral-600'
              }`}
            >
              Feed Mockup
            </button>
          </div>

          {/* AI Hashtags trigger */}
          <button
            onClick={() => setIsHashtagGenOpen(true)}
            className="text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>#</span>
            <span>Hashtag Studio</span>
          </button>

          {/* Section-level Copy to Clipboard Button in Header */}
          <button
            onClick={handleCopyCaption}
            className="text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title={`Copy ${config.name} caption to clipboard`}
          >
            <span>{copiedCaption ? '✓' : '📋'}</span>
            <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
          </button>

          {/* Action: Regenerate Platform */}
          <button
            onClick={() => onRegeneratePlatform(currentPlatform)}
            disabled={isRegenerating}
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2.5 py-1 rounded-md border border-neutral-200 hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
            title={`Regenerate ${config.name} copy`}
          >
            <span>↻</span>
            <span>Regenerate {config.name}</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Suggested Format and Creative Direction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-lg border border-neutral-200/80">
          <div>
            <span className="font-semibold text-neutral-800 block mb-0.5">Recommended Format:</span>
            <span className="text-neutral-600">{content.suggestedFormat || 'Standard Feed Post'}</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-800 block mb-0.5">Visual Creative Direction:</span>
            <span className="text-neutral-600">{content.visualPromptNote || 'Natural creator photography or carousel card.'}</span>
          </div>
        </div>

        {/* Short vs Long Variation Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg max-w-fit">
            <button
              onClick={() => setVariation('short')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                variation === 'short'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Short Variation (Fast Scroll)
            </button>
            <button
              onClick={() => setVariation('long')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                variation === 'long'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Long Variation (Deep Value)
            </button>
          </div>

          {/* Character counter */}
          <CharacterCounter
            currentLength={charCount}
            maxLength={config.charLimit}
            foldLimit={config.foldLimit}
            label="Platform Capacity:"
          />
        </div>

        {/* MAIN WORKSPACE GRID: Split or Single View */}
        <div className={`grid gap-6 ${workspaceView === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
          {/* Left / Main Column: Editor & Controls */}
          {(workspaceView === 'editor' || workspaceView === 'split') && (
            <div className={`space-y-4 ${workspaceView === 'split' ? 'lg:col-span-7' : 'w-full'}`}>
              {/* AI Quick Actions Bar */}
              <CaptionQuickActions
                currentText={activeText}
                platform={currentPlatform}
                topic={topic}
                onApplyRewrite={handleApplyRewrite}
                onOpenAltText={(alt) => setAltTextModalData(alt)}
              />

              {/* Editable Caption Area with Integrated Emoji Toolbar & Character Counter */}
              <div className="space-y-0">
                {/* Header & Inline Emoji Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-neutral-100/80 px-3 py-2 rounded-t-lg border border-neutral-300 border-b-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-800">
                      Caption Text:
                    </span>
                    {/* Quick Branded Emojis strip */}
                    <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-neutral-300">
                      <span className="text-[10px] text-neutral-400 font-mono uppercase mr-0.5">Quick:</span>
                      {QUICK_BRANDED_EMOJIS.slice(0, 8).map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => handleInsertEmoji(em)}
                          className="w-6 h-6 text-xs rounded hover:bg-white hover:shadow-2xs flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                          title={`Insert ${em}`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Full Categorized Inline Emoji Picker */}
                    <InlineEmojiPicker onSelectEmoji={handleInsertEmoji} />
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  rows={workspaceView === 'split' ? 10 : 8}
                  value={activeText}
                  onChange={(e) =>
                    onUpdateCaption(
                      currentPlatform,
                      variation === 'short' ? 'shortCaption' : 'longCaption',
                      e.target.value
                    )
                  }
                  placeholder="Enter or refine your caption..."
                  className="w-full text-sm rounded-b-none border border-neutral-300 border-t-0 p-4 font-normal text-neutral-800 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-colors leading-relaxed resize-y bg-white font-sans"
                />

                {/* Attached Realtime Character Counter Status Dock */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-neutral-50/90 border border-neutral-300 border-t-0 rounded-b-lg text-xs text-neutral-500">
                  <div className="flex items-center gap-2.5 font-mono text-[11px] tabular-nums">
                    <span>{activeText.trim() ? activeText.trim().split(/\s+/).length : 0} words</span>
                    <span>·</span>
                    <span>~{Math.max(1, Math.round(((activeText.trim() ? activeText.trim().split(/\s+/).length : 0) / 200) * 60))}s read</span>
                    <span>·</span>
                    <span className="text-[10px] text-neutral-400 font-sans">{config.name} limit: {config.charLimit.toLocaleString()}</span>
                  </div>

                  <CharacterCounter
                    currentLength={charCount}
                    maxLength={config.charLimit}
                    foldLimit={config.foldLimit}
                    showRadialGauge={true}
                  />
                </div>
              </div>

              {/* Caption Action Toolbar with Insert Hashtags */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  {/* Insert Hashtags Action Button */}
                  <button
                    type="button"
                    onClick={handleQuickInsertCuratedHashtags}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer border border-neutral-300 flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>#</span>
                    <span>{insertedFeedback ? '✓ Hashtags Inserted!' : 'Insert Hashtags'}</span>
                  </button>

                  {/* Open Hashtag Generator Component */}
                  <button
                    type="button"
                    onClick={() => setIsHashtagGenOpen(true)}
                    className="px-3 py-2 text-xs font-medium rounded-lg text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>✨</span>
                    <span>Suggest Trending Tags...</span>
                  </button>
                </div>

                {/* Copy Caption to Clipboard Button */}
                <button
                  onClick={handleCopyCaption}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  title="Copy caption to clipboard"
                >
                  <span>{copiedCaption ? '✓' : '📋'}</span>
                  <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                </button>
              </div>

              {/* Content Health & Readability Audit */}
              <ContentAuditBar
                captionText={activeText}
                hashtags={content.hashtags || []}
                platform={currentPlatform}
              />
            </div>
          )}

          {/* Right Column: Live Feed Mockup */}
          {(workspaceView === 'preview' || workspaceView === 'split') && (
            <div className={`${workspaceView === 'split' ? 'lg:col-span-5' : 'w-full'}`}>
              <LivePlatformPreview
                platform={currentPlatform}
                captionText={activeText}
                hashtags={content.hashtags || []}
                suggestedFormat={content.suggestedFormat}
                visualPromptNote={content.visualPromptNote}
                brandName={brandName}
              />
            </div>
          )}
        </div>

        {/* Curated Hashtags Footer Bar */}
        {content.hashtags && content.hashtags.length > 0 && (
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-700">
                  Curated Hashtags ({content.hashtags.length}):
                </span>
                <button
                  type="button"
                  onClick={() => setIsHashtagGenOpen(true)}
                  className="text-[11px] text-indigo-600 hover:underline font-medium cursor-pointer"
                >
                  Explore More Trending Tags
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {content.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-neutral-700 font-mono bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/80"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleQuickInsertCuratedHashtags}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Insert Hashtags
              </button>

              <button
                onClick={handleCopyHashtags}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                title="Copy hashtags to clipboard"
              >
                <span>{copiedHashtags ? '✓' : '📋'}</span>
                <span>{copiedHashtags ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Hashtag Generator Modal */}
      <HashtagGenerator
        isOpen={isHashtagGenOpen}
        onClose={() => setIsHashtagGenOpen(false)}
        caption={activeText}
        platform={currentPlatform}
        topic={topic}
        initialHashtags={content.hashtags}
        onInsertHashtags={handleInsertHashtagsIntoCaption}
      />

      {/* Alt Text Modal */}
      <AltTextModal
        isOpen={altTextModalData !== null}
        onClose={() => setAltTextModalData(null)}
        altText={altTextModalData || ''}
      />
    </div>
  );
};

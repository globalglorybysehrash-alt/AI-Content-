import React, { useState, useEffect, useMemo } from 'react';
import { PlatformKey, HashtagCategorization } from '../types/generator';
import { CharacterCounter } from './CharacterCounter';

interface HashtagGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  caption: string;
  platform: PlatformKey;
  topic: string;
  initialHashtags?: string[];
  onInsertHashtags: (selectedTags: string[], mode: 'append' | 'replace') => void;
}

// Platform recommendations
const PLATFORM_HASHTAG_LIMITS: Record<
  PlatformKey,
  { recommendedMin: number; recommendedMax: number; hardCap: number; bestPractice: string }
> = {
  instagram: {
    recommendedMin: 5,
    recommendedMax: 10,
    hardCap: 30,
    bestPractice: '5–10 focused tags avoid shadowbans and reach target explore pages.',
  },
  linkedin: {
    recommendedMin: 3,
    recommendedMax: 5,
    hardCap: 10,
    bestPractice: '3–5 professional industry tags preserve executive authority.',
  },
  facebook: {
    recommendedMin: 2,
    recommendedMax: 4,
    hardCap: 10,
    bestPractice: '2–4 community tags encourage group sharing and discovery.',
  },
  tiktok: {
    recommendedMin: 4,
    recommendedMax: 6,
    hardCap: 15,
    bestPractice: '4–6 video niche tags signal TikTok search algorithms.',
  },
  twitter: {
    recommendedMin: 1,
    recommendedMax: 2,
    hardCap: 4,
    bestPractice: '1–2 hashtags max. Excessive hashtags drastically reduce engagement on X.',
  },
};

// Fallback intelligent semantic tag generator from caption
function extractSmartTags(text: string, platform: PlatformKey, topic: string): HashtagCategorization {
  const combined = `${topic} ${text}`.toLowerCase();
  const words = combined
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3);

  // Common stop words to exclude
  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'have', 'more', 'your', 'about', 'what', 'when',
    'where', 'which', 'there', 'their', 'they', 'will', 'would', 'could', 'should',
    'just', 'like', 'than', 'them', 'then', 'into', 'some', 'other', 'only', 'very',
  ]);

  const freq: Record<string, number> = {};
  for (const w of words) {
    if (!stopWords.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }

  const topKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => `#${w.charAt(0).toUpperCase() + w.slice(1)}`);

  const platformSpecific: Record<PlatformKey, string[]> = {
    instagram: ['#CreatorsOfInstagram', '#CarouselTips', '#InstagramGrowth', '#ReelsTips', '#AestheticFeed'],
    linkedin: ['#ThoughtLeadership', '#B2BStrategy', '#ProfessionalGrowth', '#ContentMarketing', '#LeadershipInsights'],
    facebook: ['#SmallBusinessTips', '#CommunityFirst', '#DigitalMarketingTips', '#LocalBusinessSupport', '#OnlineCommunity'],
    tiktok: ['#CreatorTips', '#TikTokTips', '#VideoMarketing', '#LearnOnTikTok', '#ShortFormContent'],
    twitter: ['#BuildInPublic', '#TechTwitter', '#CreatorHustle', '#GrowthTips', '#ContentMarketing'],
  };

  const trendingDefaults = ['#ContentStrategy', '#BookKaaro', '#CreatorEconomy', '#WorkflowHacks', ...topKeywords.slice(0, 3)];
  const nicheDefaults = [...platformSpecific[platform], ...topKeywords.slice(3, 6)];
  const industryDefaults = ['#DigitalPublishing', '#SocialMediaMarketing', '#BrandBuilding', '#OnlineBusiness', '#ProductivityHacks'];

  const clean = (arr: string[]) => Array.from(new Set(arr.map((t) => (t.startsWith('#') ? t : `#${t}`))));

  const trending = clean(trendingDefaults);
  const niche = clean(nicheDefaults);
  const industry = clean(industryDefaults);

  return {
    trending,
    niche,
    industry,
    recommendedGroup: clean([...trending.slice(0, 3), ...niche.slice(0, 3), ...industry.slice(0, 2)]),
  };
}

export const HashtagGenerator: React.FC<HashtagGeneratorProps> = ({
  isOpen,
  onClose,
  caption,
  platform,
  topic,
  initialHashtags = [],
  onInsertHashtags,
}) => {
  const [activeCategory, setActiveCategory] = useState<'recommended' | 'trending' | 'niche' | 'industry' | 'all'>('recommended');
  const [categorizedTags, setCategorizedTags] = useState<HashtagCategorization>(() =>
    extractSmartTags(caption, platform, topic)
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [insertSuccess, setInsertSuccess] = useState<boolean>(false);
  const [insertPlacement, setInsertPlacement] = useState<'append' | 'replace'>('append');

  const limits = PLATFORM_HASHTAG_LIMITS[platform] || PLATFORM_HASHTAG_LIMITS.instagram;

  // Initialize tags when opened or platform/caption changes
  useEffect(() => {
    if (isOpen) {
      const smart = extractSmartTags(caption, platform, topic);
      setCategorizedTags(smart);

      // Pre-select initial hashtags or recommended group
      if (initialHashtags.length > 0) {
        setSelectedTags(initialHashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)));
      } else {
        setSelectedTags(smart.recommendedGroup.slice(0, limits.recommendedMax));
      }
    }
  }, [isOpen, platform, caption, topic]);

  // Request fresh AI hashtags from Gemini
  const fetchAiHashtags = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          captionText: caption,
          platforms: [platform],
          targetPlatform: platform,
          section: 'hashtags',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data?.hashtags) {
          const cleanGroup = (arr: any[]) =>
            Array.isArray(arr)
              ? arr.map((t) => (typeof t === 'string' ? (t.startsWith('#') ? t : `#${t}`) : '')).filter(Boolean)
              : [];

          const newCategorized: HashtagCategorization = {
            trending: cleanGroup(json.data.hashtags.trending),
            niche: cleanGroup(json.data.hashtags.niche),
            industry: cleanGroup(json.data.hashtags.industry),
            recommendedGroup: cleanGroup(json.data.hashtags.recommendedGroup),
          };

          setCategorizedTags(newCategorized);
          setSelectedTags(newCategorized.recommendedGroup.slice(0, limits.recommendedMax));
        }
      }
    } catch {
      // Keep existing tags on error
    } finally {
      setIsLoadingAi(false);
    }
  };

  const allAvailableTags = useMemo(() => {
    const set = new Set<string>();
    categorizedTags.recommendedGroup.forEach((t) => set.add(t));
    categorizedTags.trending.forEach((t) => set.add(t));
    categorizedTags.niche.forEach((t) => set.add(t));
    categorizedTags.industry.forEach((t) => set.add(t));
    selectedTags.forEach((t) => set.add(t));
    return Array.from(set);
  }, [categorizedTags, selectedTags]);

  const displayedTags = useMemo(() => {
    if (activeCategory === 'recommended') return categorizedTags.recommendedGroup;
    if (activeCategory === 'trending') return categorizedTags.trending;
    if (activeCategory === 'niche') return categorizedTags.niche;
    if (activeCategory === 'industry') return categorizedTags.industry;
    return allAvailableTags;
  }, [activeCategory, categorizedTags, allAvailableTags]);

  const toggleTag = (tag: string) => {
    const formatted = tag.startsWith('#') ? tag : `#${tag}`;
    if (selectedTags.includes(formatted)) {
      setSelectedTags(selectedTags.filter((t) => t !== formatted));
    } else {
      setSelectedTags([...selectedTags, formatted]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    const cleanTag = `#${customTagInput.trim().replace(/^#+/, '').replace(/\s+/g, '')}`;
    if (!selectedTags.includes(cleanTag)) {
      setSelectedTags([...selectedTags, cleanTag]);
      setCategorizedTags((prev) => ({
        ...prev,
        recommendedGroup: [cleanTag, ...prev.recommendedGroup],
      }));
    }
    setCustomTagInput('');
  };

  const handleSelectRecommended = () => {
    setSelectedTags(categorizedTags.recommendedGroup.slice(0, limits.recommendedMax));
  };

  const handleSelectAllCategory = () => {
    const combined = Array.from(new Set([...selectedTags, ...displayedTags]));
    setSelectedTags(combined.slice(0, limits.hardCap));
  };

  const handleClearSelection = () => {
    setSelectedTags([]);
  };

  const handleCopyTags = async () => {
    if (selectedTags.length === 0) return;
    try {
      await navigator.clipboard.writeText(selectedTags.join(' '));
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleInsert = () => {
    if (selectedTags.length === 0) return;
    onInsertHashtags(selectedTags, insertPlacement);
    setInsertSuccess(true);
    setTimeout(() => {
      setInsertSuccess(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  const count = selectedTags.length;
  const isOverRecommended = count > limits.recommendedMax;
  const isOverHardCap = count > limits.hardCap;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 bg-neutral-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                AI Hashtag Generator & Optimizer
              </h3>
              <span className="text-[11px] font-semibold uppercase text-neutral-500 bg-neutral-200/80 px-2 py-0.5 rounded">
                {platform}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Analyzes your caption to recommend high-engagement, non-spammy tags.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAiHashtags}
              disabled={isLoadingAi}
              className="text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{isLoadingAi ? '⏳' : '✨'}</span>
              <span>{isLoadingAi ? 'Analyzing...' : 'AI Refresh'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Platform Rule Banner */}
        <div className="px-5 py-2.5 bg-neutral-100/70 border-b border-neutral-200 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="text-neutral-600">
            <strong className="text-neutral-800">{platform.toUpperCase()} Guidance:</strong> {limits.bestPractice}
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Optimal: <strong>{limits.recommendedMin}–{limits.recommendedMax}</strong></span>
            <span>·</span>
            <span>Max Cap: <strong>{limits.hardCap}</strong></span>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Caption Context Snippet */}
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200/80 text-xs">
            <span className="font-semibold text-neutral-700 block mb-1">
              Active Caption Preview:
            </span>
            <p className="text-neutral-600 line-clamp-2 italic">
              "{caption || 'No caption text provided yet. Using topic context.'}"
            </p>
          </div>

          {/* Strategy Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveCategory('recommended')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeCategory === 'recommended'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Recommended ({categorizedTags.recommendedGroup.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('trending')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeCategory === 'trending'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Trending ({categorizedTags.trending.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('niche')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeCategory === 'niche'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Niche ({categorizedTags.niche.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('industry')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeCategory === 'industry'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Industry ({categorizedTags.industry.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All ({allAvailableTags.length})
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleSelectRecommended}
                className="text-neutral-600 hover:text-neutral-900 font-medium cursor-pointer underline"
              >
                Auto-Select {limits.recommendedMax}
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-neutral-500 hover:text-neutral-800 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Interactive Tag Chips Grid */}
          <div>
            <div className="flex flex-wrap gap-2 min-h-24">
              {displayedTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs font-semibold'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Tag Input with Character Counter */}
          <div className="space-y-1 pt-1">
            <form onSubmit={handleAddCustomTag} className="flex items-center gap-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                maxLength={40}
                placeholder="Add custom hashtag (e.g. #MyBrand)..."
                className="text-xs px-3 py-2 rounded-lg border border-neutral-300 flex-1 focus:border-neutral-900 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Add Tag
              </button>
            </form>
            {customTagInput.length > 0 && (
              <div className="flex justify-end pr-1">
                <CharacterCounter currentLength={customTagInput.length} maxLength={40} showRadialGauge={false} />
              </div>
            )}
          </div>

          {/* Selected Tags Drawer Preview */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-800">
                Selected for Insertion ({count}):
              </span>
              <span
                className={`font-mono text-[11px] ${
                  isOverHardCap
                    ? 'text-red-600 font-bold'
                    : isOverRecommended
                    ? 'text-amber-600 font-semibold'
                    : 'text-neutral-500'
                }`}
              >
                {count} / {limits.recommendedMax} recommended {isOverHardCap ? '(Exceeds Hard Limit!)' : ''}
              </span>
            </div>

            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-white text-neutral-800 border border-neutral-300 px-2.5 py-1 rounded-md"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="text-neutral-400 hover:text-neutral-800 ml-0.5 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-neutral-400 italic py-2">
                Click tags above or click "Auto-Select {limits.recommendedMax}" to choose hashtags.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer & Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Insertion Mode Switcher */}
          <div className="flex items-center gap-3 text-xs text-neutral-600">
            <span className="font-medium text-neutral-500">Placement:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="placement"
                checked={insertPlacement === 'append'}
                onChange={() => setInsertPlacement('append')}
                className="accent-neutral-900"
              />
              <span>Append to Bottom</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="placement"
                checked={insertPlacement === 'replace'}
                onChange={() => setInsertPlacement('replace')}
                className="accent-neutral-900"
              />
              <span>Replace Existing</span>
            </label>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyTags}
              disabled={selectedTags.length === 0}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
            >
              {copiedSuccess ? '✓ Copied Tags!' : 'Copy Tags'}
            </button>

            <button
              type="button"
              onClick={handleInsert}
              disabled={selectedTags.length === 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-40 flex items-center gap-1.5"
            >
              {insertSuccess ? (
                <span>✓ Inserted into Caption!</span>
              ) : (
                <span>Insert Hashtags ({selectedTags.length})</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

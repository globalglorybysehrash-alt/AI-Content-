import React, { useState } from 'react';
import {
  PlatformKey,
  ToneOption,
  AudienceOption,
  LanguageOption,
  GeneratorInput,
  QuotaStatus,
} from '../types/generator';

interface GeneratorFormProps {
  input: GeneratorInput;
  onChange: (updated: Partial<GeneratorInput>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  quota: QuotaStatus | null;
  errorMessage?: string | null;
}

const PLATFORMS: { id: PlatformKey; label: string; icon: string; limitDesc: string }[] = [
  { id: 'instagram', label: 'Instagram', icon: '📸', limitDesc: '2,200 chars · Carousels & Reels' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', limitDesc: '3,000 chars · B2B & Insights' },
  { id: 'twitter', label: 'X (Twitter)', icon: '𝕏', limitDesc: '280 chars · Fast & punchy' },
  { id: 'facebook', label: 'Facebook', icon: '👥', limitDesc: 'Community & Discussions' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', limitDesc: 'Video Scripts & On-Screen Hooks' },
];

const TONES: { id: ToneOption; label: string; desc: string }[] = [
  { id: 'conversational', label: 'Conversational', desc: 'Friendly, relatable, natural rhythm' },
  { id: 'professional', label: 'Professional', desc: 'Authoritative, clear, B2B focus' },
  { id: 'educational', label: 'Educational', desc: 'Step-by-step, actionable takeaways' },
  { id: 'storytelling', label: 'Storytelling', desc: 'Narrative arc, personal experience' },
  { id: 'bold', label: 'Bold / Contrarian', desc: 'Challenging norms, thought-provoking' },
  { id: 'promotional', label: 'Promotional', desc: 'Direct offer, clear call to action' },
];

const AUDIENCES: { id: AudienceOption; label: string }[] = [
  { id: 'creators', label: 'Creators & Freelancers' },
  { id: 'b2b_founders', label: 'Founders & B2B Leaders' },
  { id: 'gen_z', label: 'Gen Z / Young Digital Natives' },
  { id: 'local_customers', label: 'Local Community & Shoppers' },
  { id: 'students', label: 'Students & Early Professionals' },
  { id: 'general', label: 'Broad General Audience' },
];

const LANGUAGES: LanguageOption[] = [
  'English',
  'Hinglish',
  'Hindi',
  'Urdu',
  'Spanish',
  'French',
  'Arabic',
  'German',
];

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
  quota,
  errorMessage,
}) => {
  const [localError, setLocalError] = useState<string | null>(null);

  const togglePlatform = (p: PlatformKey) => {
    if (input.platforms.includes(p)) {
      if (input.platforms.length === 1) {
        setLocalError('Please keep at least one platform selected.');
        return;
      }
      setLocalError(null);
      onChange({ platforms: input.platforms.filter((item) => item !== p) });
    } else {
      setLocalError(null);
      onChange({ platforms: [...input.platforms, p] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.topic.trim()) {
      setLocalError('Please enter a topic or core idea.');
      return;
    }
    if (input.topic.trim().length < 3) {
      setLocalError('Topic must be at least 3 characters.');
      return;
    }
    if (input.platforms.length === 0) {
      setLocalError('Please select at least one target social platform.');
      return;
    }
    setLocalError(null);
    onSubmit();
  };

  const activeError = errorMessage || localError;

  return (
    <div id="generator-tool" className="bg-white rounded-xl border border-neutral-200 shadow-xs p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-neutral-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            1. Configure Your Content Generation
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Specify your core concept, brand voice, and channel distribution.
          </p>
        </div>

        {quota && (
          <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
            <span>Quota:</span>
            <span className="font-bold text-neutral-900">{quota.remaining} of {quota.limit}</span>
            <span className="text-neutral-400">runs left</span>
          </div>
        )}
      </div>

      {activeError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs leading-relaxed flex items-start gap-2">
          <span className="font-bold shrink-0">Note:</span>
          <span>{activeError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Topic Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="topic-input" className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">
              Core Topic / Message <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs tabular-nums font-mono ${input.topic.length > 550 ? 'text-amber-600 font-bold' : 'text-neutral-400'}`}>
              {input.topic.length}/600 chars
            </span>
          </div>
          <textarea
            id="topic-input"
            rows={3}
            maxLength={600}
            value={input.topic}
            onChange={(e) => {
              onChange({ topic: e.target.value });
              if (localError) setLocalError(null);
            }}
            placeholder="e.g. Announcing our new community workspace for creators. Highlighting collaborative studios, silent desks, and weekly peer feedback sessions."
            className="w-full text-sm rounded-lg border border-neutral-300 p-3.5 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-colors placeholder:text-neutral-400 resize-y"
          />
        </div>

        {/* Brand / Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="brand-input" className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                Brand / Product Name <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <span className="text-xs text-neutral-400 tabular-nums font-mono">
                {(input.brandOrContext || '').length}/400
              </span>
            </div>
            <input
              id="brand-input"
              type="text"
              maxLength={400}
              value={input.brandOrContext || ''}
              onChange={(e) => onChange({ brandOrContext: e.target.value })}
              placeholder="e.g. Book Kaaro Spaces / @bookkaaro"
              className="w-full text-sm rounded-lg border border-neutral-300 px-3.5 py-2.5 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-colors placeholder:text-neutral-400"
            />
          </div>

          {/* Language Selector */}
          <div>
            <label htmlFor="language-select" className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2">
              Target Output Language
            </label>
            <select
              id="language-select"
              value={input.language}
              onChange={(e) => onChange({ language: e.target.value as LanguageOption })}
              className="w-full text-sm rounded-lg border border-neutral-300 px-3.5 py-2.5 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-colors bg-white cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang} {lang === 'Hinglish' ? '(Hindi in Roman English script)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Platforms */}
        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2.5">
            Target Platforms <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORMS.map((platform) => {
              const isSelected = input.platforms.includes(platform.id);
              return (
                <button
                  type="button"
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{platform.icon}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[10px] ${
                      isSelected ? 'border-white bg-white text-neutral-900' : 'border-neutral-300'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </div>
                  <div className="font-semibold text-xs">{platform.label}</div>
                  <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                    {platform.limitDesc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone and Audience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2.5">
              Tone & Voice
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((tone) => {
                const isSelected = input.tone === tone.id;
                return (
                  <button
                    type="button"
                    key={tone.id}
                    onClick={() => onChange({ tone: tone.id })}
                    className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-100 font-semibold text-neutral-900 ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600'
                    }`}
                  >
                    <div className="text-xs">{tone.label}</div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">{tone.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audience Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2.5">
              Target Audience
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AUDIENCES.map((aud) => {
                const isSelected = input.audience === aud.id;
                return (
                  <button
                    type="button"
                    key={aud.id}
                    onClick={() => onChange({ audience: aud.id })}
                    className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-100 font-semibold text-neutral-900 ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600'
                    }`}
                  >
                    <div className="text-xs">{aud.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-500">
            Includes platform captions, 5 hooks, 5 CTAs, 5 angles & 7-day schedule.
          </div>

          <button
            type="submit"
            disabled={isLoading || (quota !== null && quota.remaining <= 0)}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Structuring Social Pack...</span>
              </>
            ) : (
              <span>Generate Full Social Kit</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

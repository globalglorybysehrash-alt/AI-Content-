/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GeneratorInput,
  FullGeneratedContent,
  PlatformKey,
  QuotaStatus,
  CalendarDay,
  ContentIdea,
} from './types/generator';
import { INITIAL_SAMPLE_CONTENT } from './data/sampleContent';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GeneratorForm } from './components/GeneratorForm';
import { CaptionsWorkspace } from './components/CaptionsWorkspace';
import { HooksAndCtas } from './components/HooksAndCtas';
import { ContentCalendarView } from './components/ContentCalendarView';
import { ContentIdeasSection } from './components/ContentIdeasSection';
import { MarketplaceSection } from './components/MarketplaceSection';
import { PlatformGuidelinesSection } from './components/PlatformGuidelinesSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [input, setInput] = useState<GeneratorInput>({
    topic: 'How to structure a weekly content routine without creator burnout',
    brandOrContext: 'Book Kaaro',
    platforms: ['instagram', 'linkedin', 'facebook', 'tiktok'],
    tone: 'conversational',
    audience: 'creators',
    language: 'English',
  });

  const [content, setContent] = useState<FullGeneratedContent>(INITIAL_SAMPLE_CONTENT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [quota, setQuota] = useState<QuotaStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'captions' | 'hooks' | 'calendar' | 'ideas'>('captions');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Fetch initial quota on mount
  useEffect(() => {
    fetch('/api/quota')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) setQuota(data);
      })
      .catch(() => {
        // Silent catch for dev/preview
      });
  }, []);

  // Update input state partially
  const handleInputChange = (updated: Partial<GeneratorInput>) => {
    setInput((prev) => ({ ...prev, ...updated }));
  };

  // Full generation call
  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          section: 'full',
        }),
      });

      const json = await response.json();

      // Check quota headers if present
      const limitHeader = response.headers.get('X-RateLimit-Limit');
      const remHeader = response.headers.get('X-RateLimit-Remaining');
      if (limitHeader && remHeader) {
        setQuota({
          limit: parseInt(limitHeader, 10),
          remaining: parseInt(remHeader, 10),
          resetMinutes: 10,
        });
      }

      if (!response.ok) {
        throw new Error(json.message || json.error || 'Failed to generate content pack');
      }

      if (json.data) {
        setContent({
          platformCaptions: json.data.platformCaptions || {},
          hooks: json.data.hooks || [],
          ctas: json.data.ctas || [],
          contentIdeas: json.data.contentIdeas || [],
          calendar: json.data.calendar || [],
          meta: json.meta,
        });
        setActiveOutputTab('captions');

        // Smooth scroll to output
        const outputElem = document.getElementById('generated-workspace');
        if (outputElem) {
          outputElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while generating content.');
    } finally {
      setIsLoading(false);
    }
  };

  // Section-specific regeneration
  const handleRegenerateSection = async (section: 'hooks' | 'ctas' | 'ideas' | 'calendar') => {
    setRegeneratingSection(section);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          section,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || 'Failed to regenerate section');
      }

      if (section === 'hooks' && json.data?.hooks) {
        setContent((prev) => ({ ...prev, hooks: json.data.hooks }));
      } else if (section === 'ctas' && json.data?.ctas) {
        setContent((prev) => ({ ...prev, ctas: json.data.ctas }));
      } else if (section === 'ideas' && json.data?.contentIdeas) {
        setContent((prev) => ({ ...prev, contentIdeas: json.data.contentIdeas }));
      } else if (section === 'calendar' && json.data?.calendar) {
        setContent((prev) => ({ ...prev, calendar: json.data.calendar }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || `Failed to regenerate ${section}.`);
    } finally {
      setRegeneratingSection(null);
    }
  };

  // Single platform caption regeneration
  const handleRegeneratePlatform = async (platform: PlatformKey) => {
    setRegeneratingSection(`platform-${platform}`);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          section: 'single_platform',
          targetPlatform: platform,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || `Failed to regenerate ${platform} caption`);
      }

      if (json.data?.caption) {
        setContent((prev) => ({
          ...prev,
          platformCaptions: {
            ...prev.platformCaptions,
            [platform]: json.data.caption,
          },
        }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || `Failed to regenerate ${platform}.`);
    } finally {
      setRegeneratingSection(null);
    }
  };

  // Inline content updates
  const handleUpdateCaption = (
    platform: PlatformKey,
    field: 'shortCaption' | 'longCaption',
    text: string
  ) => {
    setContent((prev) => {
      const current = prev.platformCaptions[platform];
      if (!current) return prev;
      return {
        ...prev,
        platformCaptions: {
          ...prev.platformCaptions,
          [platform]: {
            ...current,
            [field]: text,
          },
        },
      };
    });
  };

  const handleUpdateHashtags = (platform: PlatformKey, hashtags: string[]) => {
    setContent((prev) => {
      const current = prev.platformCaptions[platform];
      if (!current) return prev;
      return {
        ...prev,
        platformCaptions: {
          ...prev.platformCaptions,
          [platform]: {
            ...current,
            hashtags,
          },
        },
      };
    });
  };

  const handleUpdateHook = (id: string, newText: string) => {
    setContent((prev) => ({
      ...prev,
      hooks: prev.hooks.map((h) => (h.id === id ? { ...h, text: newText } : h)),
    }));
  };

  const handleUpdateCta = (id: string, newText: string) => {
    setContent((prev) => ({
      ...prev,
      ctas: prev.ctas.map((c) => (c.id === id ? { ...c, text: newText } : c)),
    }));
  };

  const handleUpdateIdea = (id: string, updated: Partial<ContentIdea>) => {
    setContent((prev) => ({
      ...prev,
      contentIdeas: prev.contentIdeas.map((idea) =>
        idea.id === id ? { ...idea, ...updated } : idea
      ),
    }));
  };

  const handleUpdateCalendarDay = (index: number, updated: Partial<CalendarDay>) => {
    setContent((prev) => {
      const copy = [...prev.calendar];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updated };
      }
      return { ...prev, calendar: copy };
    });
  };

  const handleSelectPreset = (preset: {
    topic: string;
    brand: string;
    tone: string;
    audience: string;
  }) => {
    setInput((prev) => ({
      ...prev,
      topic: preset.topic,
      brandOrContext: preset.brand,
      tone: preset.tone as any,
      audience: preset.audience as any,
    }));
    const formElem = document.getElementById('generator-tool');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* 1. Global Navigation */}
      <Navbar
        quota={quota}
        hasGeneratedContent={!!content}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection onSelectPreset={handleSelectPreset} />

        {/* 3. Main Tool Workspace */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
          {/* Configuration Form */}
          <GeneratorForm
            input={input}
            onChange={handleInputChange}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            quota={quota}
            errorMessage={errorMessage}
          />

          {/* Generated Output Workspace */}
          <section id="generated-workspace" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-neutral-200 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  <span>Output Workspace</span>
                  <span aria-hidden="true">·</span>
                  <span>Fully Editable</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  Generated Social Media Content Suite
                </h2>
              </div>

              {/* Section Sub-Navigation Tabs */}
              <div className="flex items-center gap-1 p-1 bg-neutral-200/80 rounded-lg max-w-fit overflow-x-auto">
                <button
                  onClick={() => setActiveOutputTab('captions')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    activeOutputTab === 'captions'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Platform Captions
                </button>
                <button
                  onClick={() => setActiveOutputTab('hooks')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    activeOutputTab === 'hooks'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Hooks & CTAs
                </button>
                <button
                  onClick={() => setActiveOutputTab('calendar')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    activeOutputTab === 'calendar'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  7-Day Calendar
                </button>
                <button
                  onClick={() => setActiveOutputTab('ideas')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    activeOutputTab === 'ideas'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Content Angles
                </button>
              </div>
            </div>

            {/* Tab Views */}
            {activeOutputTab === 'captions' && (
              <CaptionsWorkspace
                platformCaptions={content.platformCaptions}
                activePlatforms={input.platforms}
                topic={input.topic}
                brandName={input.brandOrContext || 'Book Kaaro'}
                onUpdateCaption={handleUpdateCaption}
                onUpdateHashtags={handleUpdateHashtags}
                onRegeneratePlatform={handleRegeneratePlatform}
                isRegenerating={regeneratingSection?.startsWith('platform-') || false}
              />
            )}

            {activeOutputTab === 'hooks' && (
              <HooksAndCtas
                hooks={content.hooks}
                ctas={content.ctas}
                onUpdateHook={handleUpdateHook}
                onUpdateCta={handleUpdateCta}
                onRegenerateHooks={() => handleRegenerateSection('hooks')}
                onRegenerateCtas={() => handleRegenerateSection('ctas')}
                isRegeneratingHooks={regeneratingSection === 'hooks'}
                isRegeneratingCtas={regeneratingSection === 'ctas'}
              />
            )}

            {activeOutputTab === 'calendar' && (
              <ContentCalendarView
                calendar={content.calendar}
                onUpdateDay={handleUpdateCalendarDay}
                onRegenerateCalendar={() => handleRegenerateSection('calendar')}
                isRegenerating={regeneratingSection === 'calendar'}
              />
            )}

            {activeOutputTab === 'ideas' && (
              <ContentIdeasSection
                ideas={content.contentIdeas}
                onUpdateIdea={handleUpdateIdea}
                onRegenerateIdeas={() => handleRegenerateSection('ideas')}
                isRegenerating={regeneratingSection === 'ideas'}
              />
            )}
          </section>
        </div>

        {/* 4. Book Kaaro Marketplace Kits Showcase */}
        <MarketplaceSection />

        {/* 5. Platform Technical Rules & Publishing Guidelines */}
        <PlatformGuidelinesSection />

        {/* 6. FAQ Section */}
        <FaqSection />
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* 8. Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        content={content}
      />
    </div>
  );
}

import React from 'react';
import heroPlannerImg from '../assets/images/hero_workspace_planner_1790748603467.jpg';

interface HeroSectionProps {
  onSelectPreset: (preset: { topic: string; brand: string; tone: string; audience: string }) => void;
}

const PRESETS = [
  {
    label: 'Course / Workshop Launch',
    topic: 'Announcing our 4-week interactive cohort on digital branding, practical case breakdowns, and live teardowns.',
    brand: 'Book Kaaro Academy',
    tone: 'educational',
    audience: 'creators',
  },
  {
    label: 'Freelance Service Pitch',
    topic: 'Why clear client onboarding saves 10 hours a week and how we structure project milestones for predictable delivery.',
    brand: 'Studio Kaaro',
    tone: 'professional',
    audience: 'b2b_founders',
  },
  {
    label: 'Behind The Scenes Story',
    topic: 'The real challenges of building a creator product without venture funding: lessons learned from 6 months of shipping.',
    brand: 'Book Kaaro Labs',
    tone: 'storytelling',
    audience: 'creators',
  },
  {
    label: 'Weekly Practical Tip',
    topic: '3 simple formatting adjustments that make long LinkedIn and Instagram carousels 2x easier to read on mobile.',
    brand: 'Kaaro Creator Guild',
    tone: 'conversational',
    audience: 'general',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectPreset }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-18 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline and Positioning */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <span>Book Kaaro Creator Suite</span>
              <span aria-hidden="true">·</span>
              <span>Multi-Platform Studio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight text-balance leading-tight">
              Platform-Tailored Social Captions, Hooks & Content Calendars.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
              Generate structured copy for Instagram, LinkedIn, Facebook, and TikTok in seconds.
              Engineered with clean hooks, short and long variations, editable outputs, and instant CSV calendar exports—without generic AI fluff or inflated viral promises.
            </p>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className="block text-xs font-medium text-neutral-500 mb-2.5">
                Try a curated starter topic:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => onSelectPreset(preset)}
                    className="text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1.5 rounded-md transition-colors border border-neutral-200/80 whitespace-nowrap cursor-pointer text-left"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Anchor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-100 aspect-16/9 lg:aspect-4/3">
              <img
                src={heroPlannerImg}
                alt="Book Kaaro workspace showing social media editorial calendar on laptop and physical planner notebook"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <div className="text-white text-xs space-y-1">
                  <p className="font-semibold text-sm">Book Kaaro Publishing Pipeline</p>
                  <p className="text-white/80">Structured multi-channel workflow: Idea → Script → Calendar → Export</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export type PlatformKey = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'twitter';

export type ToneOption =
  | 'professional'
  | 'conversational'
  | 'bold'
  | 'educational'
  | 'storytelling'
  | 'promotional';

export type AudienceOption =
  | 'creators'
  | 'b2b_founders'
  | 'gen_z'
  | 'local_customers'
  | 'students'
  | 'shoppers'
  | 'general';

export type LanguageOption =
  | 'English'
  | 'Hindi'
  | 'Urdu'
  | 'Hinglish'
  | 'Spanish'
  | 'French'
  | 'Arabic'
  | 'German';

export interface PlatformContent {
  shortCaption: string;
  longCaption: string;
  hashtags: string[];
  suggestedFormat: string;
  visualPromptNote: string;
}

export interface HookItem {
  id: string;
  text: string;
  style: 'curiosity' | 'contrarian' | 'story' | 'question' | 'direct_value';
}

export interface CtaItem {
  id: string;
  text: string;
  intent: 'comment' | 'link_click' | 'save' | 'share' | 'dm';
}

export interface ContentIdea {
  id: string;
  title: string;
  format: string;
  angle: string;
}

export interface CalendarDay {
  day: string;
  platform: PlatformKey;
  theme: string;
  format: string;
  captionSummary: string;
  bestTimeSlot: string;
}

export interface FullGeneratedContent {
  platformCaptions: Partial<Record<PlatformKey, PlatformContent>>;
  hooks: HookItem[];
  ctas: CtaItem[];
  contentIdeas: ContentIdea[];
  calendar: CalendarDay[];
  meta?: {
    generatedAt: string;
    topic: string;
    tone: string;
    language: string;
  };
}

export type RewriteAction =
  | 'shorten'
  | 'expand'
  | 'executive'
  | 'hook_boost'
  | 'add_emojis'
  | 'remove_emojis'
  | 'alt_text';

export interface GeneratorInput {
  topic: string;
  brandOrContext?: string;
  captionText?: string;
  currentText?: string;
  rewriteAction?: RewriteAction;
  platforms: PlatformKey[];
  tone: ToneOption;
  audience: AudienceOption;
  language: LanguageOption;
  section?: 'full' | 'hooks' | 'ctas' | 'ideas' | 'calendar' | 'single_platform' | 'hashtags' | 'rewrite';
  targetPlatform?: PlatformKey;
}

export interface HashtagCategorization {
  trending: string[];
  niche: string[];
  industry: string[];
  recommendedGroup: string[];
}

export interface QuotaStatus {
  remaining: number;
  limit: number;
  resetMinutes: number;
}

export interface MarketplaceKit {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  format: string;
  description: string;
  imageUrl: string;
  badge: string;
  priceLabel: string;
  includes: string[];
  compatiblePlatforms: PlatformKey[];
  previewOverview: string;
}

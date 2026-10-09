import { FullGeneratedContent } from '../types/generator';

export const INITIAL_SAMPLE_CONTENT: FullGeneratedContent = {
  meta: {
    generatedAt: '2026-09-30T06:00:00.000Z',
    topic: 'How to structure a weekly content routine without creator burnout',
    tone: 'Conversational',
    language: 'English',
  },
  platformCaptions: {
    instagram: {
      shortCaption: `Stop trying to post 3x a day if you're already exhausted.\n\nA realistic 3-day rhythm that works:\n1. Tue: In-depth breakdown carousel\n2. Thu: Short behind-the-scenes video\n3. Sat: Community question & discussion\n\nWhich day do you find hardest to stay consistent? Drop your thoughts below. 👇`,
      longCaption: `The biggest mistake most creators and founders make isn't posting bad content—it's building an unsustainable posting schedule that guarantees burnout within 90 days.\n\nHere is how we structure our production pipeline at Book Kaaro:\n\n• Batch Research on Mondays: Spend 45 minutes gathering questions your audience asked over the weekend.\n• Write in Drafts on Tuesday: Never write and edit on the same day. Write freely, then refine the next morning.\n• Visual Assembly on Wednesday: Use pre-built templates so design decisions don't drain your creative energy.\n• Publish on Schedule (Tue/Thu/Sat): Focus on genuine comment replies for the first 30 minutes after posting.\n\nConsistency isn't about volume; it's about predictable reliability.\n\nSave this framework for your next planning session.`,
      hashtags: ['#ContentPlanning', '#CreatorEconomy', '#SocialMediaStrategy', '#CreativeWorkflow', '#BookKaaro'],
      suggestedFormat: 'Carousel (4-6 slides)',
      visualPromptNote: 'Clean typography slides with high-contrast neutral backgrounds and bold step numbers.',
    },
    linkedin: {
      shortCaption: `Sustainable creator output comes from systems, not late-night inspiration.\n\nIf your content calendar requires panic-writing every morning, you don't have a content problem—you have a workflow bottleneck.\n\nHere are the 3 stages that reduced our weekly production time by half:\n→ Mon: Topic ideation\n→ Tue: Structured writing\n→ Thu: Multi-platform distribution\n\nHow does your team schedule social content?`,
      longCaption: `Most social media advice encourages volume at the expense of sustainability.\n\n"Post twice daily. Repurpose everywhere. Never stop."\n\nFor independent teams and service providers, that pace leads directly to diminishing returns and creative fatigue.\n\nOver the past year supporting creators at Book Kaaro, we've noticed that teams with the highest long-term retention share three disciplined habits:\n\n1. They separate ideation from execution.\nSitting down to write without a defined topic is exhausting. Keep a running note of customer objections, questions, and observations.\n\n2. They publish depth over frequency.\nOne thoroughly researched case study or practical framework creates more real conversations than ten rushed superficial posts.\n\n3. They respect platform context.\nLinkedIn readers value context and lessons learned, while Instagram values visual scannability. Tailor the format to the reader's state of mind.\n\nSustainable consistency builds trust far better than sporadic blitzes.\n\nWhat workflow change has made the biggest difference in your publishing routine?`,
      hashtags: ['#SocialMediaStrategy', '#ContentMarketing', '#B2BGrowth', '#Leadership', '#Productivity'],
      suggestedFormat: 'Text Post with Document / Slide Deck',
      visualPromptNote: 'Document PDF preview showcasing the 3 workflow stages.',
    },
    facebook: {
      shortCaption: `Quick question for our community: How many hours a week do you spend creating social posts?\n\nIf it feels like too much, try our simple 3-day rhythm: Tuesday breakdown, Thursday video clip, Saturday discussion.\n\nLet us know your current schedule in the comments!`,
      longCaption: `Let's have an honest conversation about social media consistency.\n\nIt's very easy to feel pressured to be everywhere at once: reels, carousels, threads, and stories every single day. But for small business owners and solo creators, that usually means sacrificing client work or family time.\n\nWe recommend starting with just ONE core theme per week:\n- Break the concept into 3 simple posts\n- Spend 15 minutes each morning responding to comments\n- Review which questions generated the most thoughtful discussions\n\nQuality interactions with 50 real people will always be more valuable than 1,000 passive impressions.\n\nWhat is one topic you're planning to discuss this week?`,
      hashtags: ['#SmallBusinessTips', '#CommunityBuilding', '#ContentCreator', '#BookKaaro'],
      suggestedFormat: 'Photo with Community Question',
      visualPromptNote: 'Authentic desk flatlay showing notebook and coffee cup in morning light.',
    },
    tiktok: {
      shortCaption: `On-screen Hook: "Why your content calendar is burning you out (and how to fix it)"\n\nVideo Concept: Quick desk-side breakdown showing a physical notebook vs chaotic notes app. Talk directly to camera with relaxed, relatable tone.\n\nCaption: Stop overcomplicating your schedule. 3 posts a week done consistently beats 14 posts done in a panic. Link in bio for our free Notion planner layout!`,
      longCaption: `On-screen Hook: "If you feel tired of creating content, watch this."\n\nScript breakdown:\n[0-3s]: "You don't need to post every day to grow a loyal audience."\n[3-15s]: "Here's the exact 3-step system: Monday we brainstorm 3 questions people actually asked. Tuesday we write the answers. Thursday we schedule them."\n[15-30s]: "When you separate thinking from creating, the anxiety disappears."\n\nCaption: Content creation should support your business, not run your life. Save this video for when you plan next week's schedule!`,
      hashtags: ['#CreatorTips', '#ContentWorkflow', '#WorkSmart', '#SocialMediaTips'],
      suggestedFormat: '9:16 Talking Head with Quick Cuts',
      visualPromptNote: 'Natural window lighting, casual posture, clean captions centered on screen.',
    },
  },
  hooks: [
    {
      id: 'hook-1',
      text: 'Most creators don’t quit because of lack of ideas—they quit because of exhaustion.',
      style: 'contrarian',
    },
    {
      id: 'hook-2',
      text: 'Here is the exact 45-minute Monday routine that eliminated our weekly publishing anxiety.',
      style: 'curiosity',
    },
    {
      id: 'hook-3',
      text: 'Last year, we tried posting 14 times a week. Here is what actually happened to our workflow.',
      style: 'story',
    },
    {
      id: 'hook-4',
      text: 'Are you spending more time wondering WHAT to post than actually writing it?',
      style: 'question',
    },
    {
      id: 'hook-5',
      text: '3 simple calendar rules that protect your weekends without pausing your channel.',
      style: 'direct_value',
    },
  ],
  ctas: [
    {
      id: 'cta-1',
      text: 'Which step in your current routine takes the most time? Share below.',
      intent: 'comment',
    },
    {
      id: 'cta-2',
      text: 'Save this post so you can reference the 3-day schedule during your next planning session.',
      intent: 'save',
    },
    {
      id: 'cta-3',
      text: 'Know a fellow creator who is feeling overwhelmed? Send them this framework.',
      intent: 'share',
    },
    {
      id: 'cta-4',
      text: 'Explore the Book Kaaro 90-Day Planner template linked in our profile.',
      intent: 'link_click',
    },
    {
      id: 'cta-5',
      text: 'DM us "WORKFLOW" and we will send you the raw Notion template checklist.',
      intent: 'dm',
    },
  ],
  contentIdeas: [
    {
      id: 'idea-1',
      title: 'The "Single Question" Post Formula',
      format: 'Text + Graphic',
      angle: 'Take one customer inquiry and dissect it into 3 actionable advice bullets.',
    },
    {
      id: 'idea-2',
      title: 'Behind the Scenes Tool Stack',
      format: 'Carousel',
      angle: 'Show the minimalist apps used to run your content pipeline without expensive subscriptions.',
    },
    {
      id: 'idea-3',
      title: 'Mistakes I Made When Starting Out',
      format: 'Short Video / Reel',
      angle: 'Honest reflections on over-promising and how pacing changed the outcome.',
    },
    {
      id: 'idea-4',
      title: 'Step-by-Step Template Teardown',
      format: 'LinkedIn Document',
      angle: 'Walk through an empty weekly planner grid and fill it in real-time.',
    },
    {
      id: 'idea-5',
      title: 'Community Feedback Spotlight',
      format: 'Q&A Story / Post',
      angle: 'Highlight a community member’s question and answer it in detail.',
    },
  ],
  calendar: [
    {
      day: 'Day 1 - Monday',
      platform: 'linkedin',
      theme: 'Strategic Perspective',
      format: 'Text Post with Line Breaks',
      captionSummary: 'The philosophy of sustainable posting: why 3 quality posts beat 14 rushed ones.',
      bestTimeSlot: '08:30 AM EST',
    },
    {
      day: 'Day 2 - Tuesday',
      platform: 'instagram',
      theme: 'Educational Carousel',
      format: '5-Slide Portrait Carousel',
      captionSummary: 'Step-by-step breakdown of the Monday-Tuesday-Thursday production routine.',
      bestTimeSlot: '11:15 AM EST',
    },
    {
      day: 'Day 3 - Wednesday',
      platform: 'tiktok',
      theme: 'Behind The Scenes',
      format: 'Short Video (30s)',
      captionSummary: 'Desk tour showing how we organize draft notes before recording.',
      bestTimeSlot: '04:45 PM EST',
    },
    {
      day: 'Day 4 - Thursday',
      platform: 'linkedin',
      theme: 'Practical Framework',
      format: 'Document / PDF Slide Deck',
      captionSummary: 'Downloadable checklist of the 3-phase content workflow.',
      bestTimeSlot: '09:00 AM EST',
    },
    {
      day: 'Day 5 - Friday',
      platform: 'facebook',
      theme: 'Community Discussion',
      format: 'Photo + Question',
      captionSummary: 'Asking creators about their biggest scheduling hurdle this week.',
      bestTimeSlot: '01:30 PM EST',
    },
    {
      day: 'Day 6 - Saturday',
      platform: 'instagram',
      theme: 'Creator Mindset',
      format: 'Quote Graphic / Reel',
      captionSummary: 'Reminder that rest is an essential part of creative work.',
      bestTimeSlot: '10:00 AM EST',
    },
    {
      day: 'Day 7 - Sunday',
      platform: 'tiktok',
      theme: 'Weekly Reset',
      format: 'Casual Video (45s)',
      captionSummary: '15-minute weekly prep routine to start Monday with clarity.',
      bestTimeSlot: '07:30 PM EST',
    },
  ],
};

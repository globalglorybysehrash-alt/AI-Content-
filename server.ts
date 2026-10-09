import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '1mb' }));

// In-memory rate limiting and quota tracker
interface RateLimitBucket {
  count: number;
  resetAt: number;
}
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 20;
const rateLimitStore = new Map<string, RateLimitBucket>();

function getClientIdentifier(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'client-default';
}

function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction): void {
  const clientId = getClientIdentifier(req);
  const now = Date.now();
  let bucket = rateLimitStore.get(clientId);

  if (!bucket || now > bucket.resetAt) {
    bucket = {
      count: 0,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitStore.set(clientId, bucket);
  }

  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - bucket.count);
  const resetMinutes = Math.max(1, Math.ceil((bucket.resetAt - now) / 60000));

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', Math.ceil(bucket.resetAt / 1000));

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: `You have reached the limit of ${MAX_REQUESTS_PER_WINDOW} generations per 10 minutes. Please retry in ${resetMinutes} minute(s).`,
      remaining: 0,
      limit: MAX_REQUESTS_PER_WINDOW,
      resetMinutes,
    });
    return;
  }

  bucket.count += 1;
  next();
}

// Gemini Client initialization
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// GET /api/quota - Check current rate limit status without calling Gemini
app.get('/api/quota', (req: Request, res: Response) => {
  const clientId = getClientIdentifier(req);
  const now = Date.now();
  const bucket = rateLimitStore.get(clientId);

  if (!bucket || now > bucket.resetAt) {
    res.json({
      remaining: MAX_REQUESTS_PER_WINDOW,
      limit: MAX_REQUESTS_PER_WINDOW,
      resetMinutes: 10,
    });
    return;
  }

  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - bucket.count);
  const resetMinutes = Math.max(1, Math.ceil((bucket.resetAt - now) / 60000));

  res.json({
    remaining,
    limit: MAX_REQUESTS_PER_WINDOW,
    resetMinutes,
  });
});

// Validation helper
function validateGeneratorInput(body: any): { error?: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Request body must be a valid JSON object.' };
  }

  const { topic, platforms, tone, audience, language } = body;

  if (typeof topic !== 'string' || topic.trim().length < 3) {
    return { error: 'Topic must be at least 3 characters long.' };
  }
  if (topic.trim().length > 600) {
    return { error: 'Topic cannot exceed 600 characters to keep prompt sizes efficient.' };
  }

  if (body.brandOrContext && typeof body.brandOrContext === 'string' && body.brandOrContext.length > 400) {
    return { error: 'Brand context cannot exceed 400 characters.' };
  }

  const validPlatforms = ['instagram', 'facebook', 'linkedin', 'tiktok'];
  if (!Array.isArray(platforms) || platforms.length === 0) {
    return { error: 'At least one target social platform must be selected.' };
  }
  for (const p of platforms) {
    if (!validPlatforms.includes(p)) {
      return { error: `Invalid platform: ${p}. Allowed: ${validPlatforms.join(', ')}` };
    }
  }

  const validTones = ['professional', 'conversational', 'bold', 'educational', 'storytelling', 'promotional'];
  if (tone && !validTones.includes(tone)) {
    return { error: `Invalid tone: ${tone}.` };
  }

  const validAudiences = ['creators', 'b2b_founders', 'gen_z', 'local_customers', 'students', 'shoppers', 'general'];
  if (audience && !validAudiences.includes(audience)) {
    return { error: `Invalid audience: ${audience}.` };
  }

  const validLanguages = ['English', 'Hindi', 'Urdu', 'Hinglish', 'Spanish', 'French', 'Arabic', 'German'];
  if (language && !validLanguages.includes(language)) {
    return { error: `Invalid language: ${language}.` };
  }

  return {};
}

// POST /api/generate - Primary endpoint
app.post('/api/generate', rateLimiterMiddleware, async (req: Request, res: Response) => {
  try {
    if (!apiKey) {
      res.status(500).json({
        error: 'Configuration Error',
        message: 'GEMINI_API_KEY is not configured on the server. Please check the environment configuration.',
      });
      return;
    }

    const validation = validateGeneratorInput(req.body);
    if (validation.error) {
      res.status(400).json({
        error: 'Validation Error',
        message: validation.error,
      });
      return;
    }

    const {
      topic,
      brandOrContext,
      platforms,
      tone = 'conversational',
      audience = 'creators',
      language = 'English',
      section = 'full',
      targetPlatform,
    } = req.body;

    const brandNote = brandOrContext?.trim() ? `Brand/Project Name & Context: "${brandOrContext.trim()}"` : 'Brand: None specified';

    // System instruction strictly forbidding fake statistics, virality promises, etc.
    const systemInstruction = `You are the Book Kaaro Social Media Content Generator.
Your role is to produce high-quality, practical, platform-tailored social media content for real creators and businesses.
Strict Constraints & Guidelines:
1. NEVER fabricate statistics, fake research studies, fake customer endorsements, or unrealistic revenue/growth claims.
2. NEVER guarantee virality, guaranteed follower surges, algorithmic tricks, or specific engagement figures.
3. Tailor the tone (${tone}) and target audience (${audience}) precisely.
4. Language Requirement: Output all content in ${language}. If Hinglish is requested, use natural, authentic colloquial Romanized Hindi/English as used by contemporary creators.
5. Character limits & platform styling:
   - Instagram: Visual focus, engaging opening line, spaced paragraphs, 5-10 targeted hashtags, subtle CTA.
   - Facebook: Conversational, community discussion starter question, readable body, share-friendly.
   - LinkedIn: Professional insights, lessons learned, punchy single-line breaks, 3-5 focused hashtags, thoughtful takeaway.
   - TikTok: Short-form video concept, hook text for on-screen placement, speaking script summary, suggested audio/visual cue.
6. Return only valid structured JSON conforming to the requested schema.`;

    // Dynamic prompt based on requested section
    let userPrompt = '';
    let responseSchema: any = null;

    if (section === 'full') {
      userPrompt = `Generate a complete multi-platform social media content pack for:
Topic: "${topic.trim()}"
${brandNote}
Selected Platforms: ${platforms.join(', ')}
Tone: ${tone}
Target Audience: ${audience}
Language: ${language}

Generate:
1. Platform captions for each selected platform (${platforms.join(', ')}):
   - shortCaption: fast-scroll version (compact, punchy)
   - longCaption: deep-value version (detailed story/breakdown with line breaks)
   - hashtags: 5-8 relevant hashtags without generic spam
   - suggestedFormat: post format recommendation (e.g. Carousel, Short Video, Photo Post)
   - visualPromptNote: brief creative direction for visual/graphic
2. 5 Distinct Hooks (styles: curiosity, contrarian, story, question, direct_value)
3. 5 Call to Actions (intents: comment, link_click, save, share, dm)
4. 5 Content Ideas/Angles for upcoming posts
5. 7-Day Content Calendar (Day 1 to Day 7) mapping out daily theme, platform, format, captionSummary, and bestTimeSlot.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          platformCaptions: {
            type: Type.OBJECT,
            properties: {
              instagram: {
                type: Type.OBJECT,
                properties: {
                  shortCaption: { type: Type.STRING },
                  longCaption: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedFormat: { type: Type.STRING },
                  visualPromptNote: { type: Type.STRING },
                },
                required: ['shortCaption', 'longCaption', 'hashtags', 'suggestedFormat', 'visualPromptNote'],
              },
              facebook: {
                type: Type.OBJECT,
                properties: {
                  shortCaption: { type: Type.STRING },
                  longCaption: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedFormat: { type: Type.STRING },
                  visualPromptNote: { type: Type.STRING },
                },
                required: ['shortCaption', 'longCaption', 'hashtags', 'suggestedFormat', 'visualPromptNote'],
              },
              linkedin: {
                type: Type.OBJECT,
                properties: {
                  shortCaption: { type: Type.STRING },
                  longCaption: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedFormat: { type: Type.STRING },
                  visualPromptNote: { type: Type.STRING },
                },
                required: ['shortCaption', 'longCaption', 'hashtags', 'suggestedFormat', 'visualPromptNote'],
              },
              tiktok: {
                type: Type.OBJECT,
                properties: {
                  shortCaption: { type: Type.STRING },
                  longCaption: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedFormat: { type: Type.STRING },
                  visualPromptNote: { type: Type.STRING },
                },
                required: ['shortCaption', 'longCaption', 'hashtags', 'suggestedFormat', 'visualPromptNote'],
              },
            },
          },
          hooks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                style: { type: Type.STRING },
              },
              required: ['id', 'text', 'style'],
            },
          },
          ctas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                intent: { type: Type.STRING },
              },
              required: ['id', 'text', 'intent'],
            },
          },
          contentIdeas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                format: { type: Type.STRING },
                angle: { type: Type.STRING },
              },
              required: ['id', 'title', 'format', 'angle'],
            },
          },
          calendar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                platform: { type: Type.STRING },
                theme: { type: Type.STRING },
                format: { type: Type.STRING },
                captionSummary: { type: Type.STRING },
                bestTimeSlot: { type: Type.STRING },
              },
              required: ['day', 'platform', 'theme', 'format', 'captionSummary', 'bestTimeSlot'],
            },
          },
        },
        required: ['platformCaptions', 'hooks', 'ctas', 'contentIdeas', 'calendar'],
      };
    } else if (section === 'hooks') {
      userPrompt = `Regenerate 5 fresh hooks for topic "${topic.trim()}". Tone: ${tone}. Audience: ${audience}. Language: ${language}.
Provide 5 distinct styles: curiosity, contrarian, story, question, direct_value.`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          hooks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                style: { type: Type.STRING },
              },
              required: ['id', 'text', 'style'],
            },
          },
        },
        required: ['hooks'],
      };
    } else if (section === 'ctas') {
      userPrompt = `Regenerate 5 fresh call-to-actions for topic "${topic.trim()}". Tone: ${tone}. Audience: ${audience}. Language: ${language}.
Provide 5 distinct intents: comment, link_click, save, share, dm.`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          ctas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                intent: { type: Type.STRING },
              },
              required: ['id', 'text', 'intent'],
            },
          },
        },
        required: ['ctas'],
      };
    } else if (section === 'ideas') {
      userPrompt = `Regenerate 5 fresh creative content ideas/angles for topic "${topic.trim()}". Tone: ${tone}. Audience: ${audience}. Language: ${language}.`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          contentIdeas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                format: { type: Type.STRING },
                angle: { type: Type.STRING },
              },
              required: ['id', 'title', 'format', 'angle'],
            },
          },
        },
        required: ['contentIdeas'],
      };
    } else if (section === 'calendar') {
      userPrompt = `Regenerate a 7-day content calendar for topic "${topic.trim()}". Selected platforms: ${platforms.join(', ')}. Tone: ${tone}. Audience: ${audience}. Language: ${language}.
Provide 7 days (Day 1 - Monday to Day 7 - Sunday) with balanced platforms, post formats, themes, caption summaries, and best time slots.`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          calendar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                platform: { type: Type.STRING },
                theme: { type: Type.STRING },
                format: { type: Type.STRING },
                captionSummary: { type: Type.STRING },
                bestTimeSlot: { type: Type.STRING },
              },
              required: ['day', 'platform', 'theme', 'format', 'captionSummary', 'bestTimeSlot'],
            },
          },
        },
        required: ['calendar'],
      };
    } else if (section === 'single_platform' && targetPlatform) {
      userPrompt = `Regenerate captions specifically for ${targetPlatform} on topic "${topic.trim()}". Tone: ${tone}. Audience: ${audience}. Language: ${language}.
Provide shortCaption, longCaption, hashtags, suggestedFormat, and visualPromptNote.`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          caption: {
            type: Type.OBJECT,
            properties: {
              shortCaption: { type: Type.STRING },
              longCaption: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedFormat: { type: Type.STRING },
              visualPromptNote: { type: Type.STRING },
            },
            required: ['shortCaption', 'longCaption', 'hashtags', 'suggestedFormat', 'visualPromptNote'],
          },
        },
        required: ['caption'],
      };
    } else if (section === 'hashtags') {
      const captionSnippet = req.body.captionText ? String(req.body.captionText).slice(0, 1000) : topic.trim();
      userPrompt = `Analyze this social media caption and generate platform-appropriate, non-spammy hashtags for ${targetPlatform || 'Instagram & Social Media'}:
Caption Context: "${captionSnippet}"
Core Topic: "${topic.trim()}"
Language: ${language}

Generate 4 strategic groups of hashtags (ensure each hashtag includes the # symbol):
1. trending: 5-8 timely, discoverable tags directly relevant to current themes in this niche.
2. niche: 5-8 targeted community tags frequented by engaged enthusiasts and professionals.
3. industry: 5-8 domain authority and category tags.
4. recommendedGroup: 5-8 curated, well-balanced selection optimal for ${targetPlatform || 'this channel'}.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          hashtags: {
            type: Type.OBJECT,
            properties: {
              trending: { type: Type.ARRAY, items: { type: Type.STRING } },
              niche: { type: Type.ARRAY, items: { type: Type.STRING } },
              industry: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedGroup: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['trending', 'niche', 'industry', 'recommendedGroup'],
          },
        },
        required: ['hashtags'],
      };
    } else if (section === 'rewrite') {
      const { rewriteAction = 'shorten', currentText = '' } = req.body;
      const targetPlat = targetPlatform || 'social media';
      userPrompt = `You are an expert social media editor at a world-class agency.
Perform this specific transformation: "${rewriteAction}" for ${targetPlat}.
Tone: ${tone}.
Target Audience: ${audience}.
Language: ${language}.

Text to transform:
"""
${String(currentText || topic).slice(0, 1500)}
"""

Action rules:
- 'shorten': Cut unnecessary words by 40-50%, preserve the punchy hook and core message.
- 'expand': Add a thoughtful illustrative story or practical step-by-step clarity without fluff.
- 'executive': Reframe in high-credibility B2B thought leadership language with lessons learned.
- 'hook_boost': Supercharge the first 2 lines with curiosity or contrarian impact.
- 'add_emojis': Add tasteful, natural emojis to break up sections and highlight key bullets.
- 'remove_emojis': Strip all emojis completely for minimalist, clean prose.
- 'alt_text': Generate descriptive, accessible image alt-text (1-3 sentences) suitable for screen readers.

Return structured JSON with rewrittenText and a 1-sentence changeNote.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          rewrittenText: { type: Type.STRING },
          changeNote: { type: Type.STRING },
        },
        required: ['rewrittenText', 'changeNote'],
      };
    }

    // Call Gemini with primary model and automatic fallback on 503 high demand
    let response: any;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          topP: 0.9,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });
    } catch (primaryErr: any) {
      const errStr = primaryErr?.message || JSON.stringify(primaryErr);
      if (errStr.includes('503') || errStr.includes('high demand') || errStr.includes('UNAVAILABLE')) {
        console.warn('gemini-3.8-flash busy, falling back to gemini-3.1-flash-lite...');
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.9,
            responseMimeType: 'application/json',
            responseSchema,
          },
        });
      } else {
        throw primaryErr;
      }
    }

    const rawText = response.text || '';
    let parsedData: any;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', rawText);
      res.status(502).json({
        error: 'Model Generation Error',
        message: 'The model returned an invalid structured format. Please retry your generation.',
      });
      return;
    }

    // Attach metadata
    const result = {
      section,
      targetPlatform,
      data: parsedData,
      meta: {
        generatedAt: new Date().toISOString(),
        topic: topic.trim(),
        tone,
        audience,
        language,
      },
    };

    res.json(result);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Generation Failed',
      message: error?.message || 'An error occurred while generating content. Please check your prompt and try again.',
    });
  }
});

// Vite server integration
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Book Kaaro Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

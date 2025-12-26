/**
 * Bundestag Wrapped OG Image Service
 *
 * Generates speaker and quiz sharepics using Satori + resvg-js
 * Caches generated images to filesystem
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SpeakerTemplate, type SpeakerShareData } from './speaker-template.js';
import { QuizTemplate, type QuizShareData } from './quiz-template.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, '../.cache');
const DATA_DIR = process.env.DATA_DIR || join(__dirname, '../../public');

// Ensure cache directory exists
await mkdir(CACHE_DIR, { recursive: true });

// Load font for Satori (Inter or system font)
let fontData: ArrayBuffer | null = null;
let logoBase64: string | null = null;

async function loadFont(): Promise<ArrayBuffer> {
  if (fontData) return fontData;

  // Try to load Inter from Google Fonts CDN
  try {
    const response = await fetch(
      'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'
    );
    fontData = await response.arrayBuffer();
    console.log('Loaded Inter font from Google Fonts');
  } catch {
    // Fallback: create minimal font buffer (Satori requires at least one font)
    console.warn('Could not load Inter font, using fallback');
    fontData = new ArrayBuffer(0);
  }

  return fontData;
}

async function loadLogo(): Promise<string> {
  if (logoBase64) return logoBase64;

  try {
    const logoPath = join(__dirname, 'assets/logo.png');
    const logoBuffer = await readFile(logoPath);
    logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    console.log('Loaded logo from assets');
  } catch (error) {
    console.warn('Could not load logo:', error);
    logoBase64 = '';
  }

  return logoBase64;
}

// Load speaker data from JSON files
async function loadSpeakerData(slug: string): Promise<SpeakerShareData | null> {
  try {
    const filePath = join(DATA_DIR, 'speakers', `${slug}.json`);
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Extract share data from full speaker data
    const signatureWords = data.words?.signatureWords || [];
    const firstWord = signatureWords[0];

    return {
      name: data.name,
      party: data.party,
      spiritAnimal: data.spiritAnimal || null,
      signatureWord: firstWord ? {
        word: firstWord.word,
        ratioParty: firstWord.ratioParty || 1,
        ratioBundestag: firstWord.ratioBundestag || 1,
      } : null,
    };
  } catch (error) {
    console.error(`Failed to load speaker data for ${slug}:`, error);
    return null;
  }
}

// Check if cached image exists (generic)
async function getCachedImage(cacheKey: string): Promise<Uint8Array | null> {
  try {
    const cachePath = join(CACHE_DIR, `${cacheKey}.png`);
    await access(cachePath);
    const buffer = await readFile(cachePath);
    return new Uint8Array(buffer);
  } catch {
    return null;
  }
}

// Save image to cache (generic)
async function cacheImage(cacheKey: string, data: Uint8Array): Promise<void> {
  const cachePath = join(CACHE_DIR, `${cacheKey}.png`);
  await writeFile(cachePath, data);
}

// Generate quiz cache key from parameters
function getQuizCacheKey(score: number, total: number, name?: string): string {
  const sanitizedName = name?.trim().toLowerCase().replace(/[^a-z0-9]/g, '-') || 'anon';
  return `quiz-${score}-${total}-${sanitizedName}`;
}

// Shared font configuration for Satori
async function getSatoriFonts() {
  const font = await loadFont();
  return font.byteLength > 0 ? [
    { name: 'Inter', data: font, weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: font, weight: 600 as const, style: 'normal' as const },
    { name: 'Inter', data: font, weight: 700 as const, style: 'normal' as const },
    { name: 'Inter', data: font, weight: 900 as const, style: 'normal' as const },
  ] : [];
}

// Generate speaker image using Satori + resvg
async function generateSpeakerImage(data: SpeakerShareData, logo: string): Promise<Uint8Array> {
  const fonts = await getSatoriFonts();

  const svg = await satori(SpeakerTemplate({ data, logoBase64: logo }), {
    width: 1080,
    height: 1080,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1080 },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}

// Generate quiz result image using Satori + resvg
async function generateQuizImage(data: QuizShareData, logo: string): Promise<Uint8Array> {
  const fonts = await getSatoriFonts();

  const svg = await satori(QuizTemplate({ data, logoBase64: logo }), {
    width: 1080,
    height: 1080,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1080 },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}

// Create Hono app
const app = new Hono();

// CORS for cross-origin requests
app.use('/*', cors({
  origin: ['https://bundestag-wrapped.de', 'http://localhost:5173', 'http://localhost:3000'],
}));

// Health check
app.get('/health', (c) => c.json({ status: 'ok', service: 'og-image' }));

// Speaker OG image endpoint
app.get('/og/speaker/:slug', async (c) => {
  const slug = c.req.param('slug');
  const wordIndex = parseInt(c.req.query('word') || '0', 10);

  if (!slug) {
    return c.json({ error: 'Missing slug parameter' }, 400);
  }

  const cacheKey = `speaker-${slug}-${wordIndex}`;

  // Check cache first
  const cached = await getCachedImage(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return new Response(new Uint8Array(cached).buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
        'X-Cache': 'HIT',
      },
    });
  }

  // Load speaker data
  const data = await loadSpeakerData(slug);
  if (!data) {
    return c.json({ error: 'Speaker not found' }, 404);
  }

  // TODO: Handle wordIndex to select different signature words
  // For now, we use the first one loaded

  try {
    console.log(`Generating speaker image for: ${slug}`);
    const logo = await loadLogo();
    const imageBuffer = await generateSpeakerImage(data, logo);

    // Cache the result
    await cacheImage(cacheKey, imageBuffer);

    return new Response(new Uint8Array(imageBuffer).buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error(`Failed to generate image for ${slug}:`, error);
    return c.json({ error: 'Failed to generate image' }, 500);
  }
});

// Quiz result OG image endpoint
app.get('/og/quiz', async (c) => {
  const scoreParam = c.req.query('score');
  const totalParam = c.req.query('total');
  const name = c.req.query('name');

  // Validate required parameters
  if (!scoreParam || !totalParam) {
    return c.json({ error: 'Missing required parameters: score and total' }, 400);
  }

  const score = parseInt(scoreParam, 10);
  const total = parseInt(totalParam, 10);

  // Validate numbers
  if (isNaN(score) || isNaN(total) || score < 0 || total <= 0 || score > total) {
    return c.json({ error: 'Invalid score or total values' }, 400);
  }

  const cacheKey = getQuizCacheKey(score, total, name);

  // Check cache first
  const cached = await getCachedImage(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return new Response(new Uint8Array(cached).buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    console.log(`Generating quiz image: ${score}/${total} for ${name || 'anonymous'}`);
    const logo = await loadLogo();
    const data: QuizShareData = {
      correctCount: score,
      totalQuestions: total,
      userName: name || undefined,
    };
    const imageBuffer = await generateQuizImage(data, logo);

    // Cache the result
    await cacheImage(cacheKey, imageBuffer);

    return new Response(new Uint8Array(imageBuffer).buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error(`Failed to generate quiz image:`, error);
    return c.json({ error: 'Failed to generate image' }, 500);
  }
});

// Start server
const port = parseInt(process.env.PORT || '3001', 10);
console.log(`OG Image service starting on port ${port}`);
console.log(`Data directory: ${DATA_DIR}`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running at http://localhost:${port}`);

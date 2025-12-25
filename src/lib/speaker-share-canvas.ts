/**
 * Canvas rendering utilities for Abgeordnete (speaker) Wrapped sharepic.
 */

import { getPartyColor } from './party-colors';
import { BG_COLORS, BRAND_COLORS } from './design-tokens';

export interface SpeakerShareData {
  name: string;
  party: string;
  spiritAnimal: {
    emoji: string;
    name: string;
    title: string;
    reason: string;
  } | null;
  signatureWord: {
    word: string;
    ratioParty: number;
    ratioBundestag: number;
  } | null;
}

// German articles for spirit animals (der/die/das)
const ANIMAL_ARTICLES: Record<string, string> = {
  // Masculine (der)
  'Elefant': 'der',
  'Adler': 'der',
  'Löwe': 'der',
  'Pfau': 'der',
  'Wolf': 'der',
  'Bär': 'der',
  'Papagei': 'der',
  'Kolibri': 'der',
  'Delfin': 'der',
  'Schwan': 'der',
  'Fuchs': 'der',
  'Igel': 'der',
  'Biber': 'der',
  'Hase': 'der',
  'Otter': 'der',
  'Tiger': 'der',
  // Feminine (die)
  'Eule': 'die',
  'Schildkröte': 'die',
  'Biene': 'die',
  'Krabbe': 'die',
  // Neuter (das)
  'Pferd': 'das',
  'Eichhörnchen': 'das',
};

function getAnimalArticle(animalName: string): string {
  return ANIMAL_ARTICLES[animalName] || 'der';
}

// Logo image cache
let logoImage: HTMLImageElement | null = null;
let logoLoadPromise: Promise<HTMLImageElement> | null = null;

export function preloadLogo(): Promise<HTMLImageElement> {
  if (logoImage) return Promise.resolve(logoImage);
  if (logoLoadPromise) return logoLoadPromise;

  logoLoadPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      logoImage = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = '/logo.png';
  });

  return logoLoadPromise;
}

// For testing: reset logo state
export function _resetLogoForTesting(): void {
  logoImage = null;
  logoLoadPromise = null;
}

// For testing: set logo image directly
export function _setLogoForTesting(img: HTMLImageElement | null): void {
  logoImage = img;
}

// Preload on module load (browser only)
if (typeof window !== 'undefined') {
  preloadLogo();
}

function drawDecorativeOrbs(
  ctx: CanvasRenderingContext2D,
  size: number,
  partyColor: string
): void {
  const gradient1 = ctx.createRadialGradient(
    size * 0.82, size * 0.15, 0,
    size * 0.82, size * 0.15, 280
  );
  gradient1.addColorStop(0, `${partyColor}30`);
  gradient1.addColorStop(0.5, `${BRAND_COLORS.secondary}0a`);
  gradient1.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient1;
  ctx.beginPath();
  ctx.arc(size * 0.82, size * 0.15, 280, 0, Math.PI * 2);
  ctx.fill();

  const gradient2 = ctx.createRadialGradient(
    size * 0.15, size * 0.78, 0,
    size * 0.15, size * 0.78, 220
  );
  gradient2.addColorStop(0, `${partyColor}20`);
  gradient2.addColorStop(0.6, `${BRAND_COLORS.primary}08`);
  gradient2.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient2;
  ctx.beginPath();
  ctx.arc(size * 0.15, size * 0.78, 220, 0, Math.PI * 2);
  ctx.fill();
}

export function getResponsiveFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startSize: number,
  minSize: number
): number {
  let fontSize = startSize;
  while (fontSize > minSize) {
    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    fontSize -= 4;
  }
  return fontSize;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

export function renderSpeakerShareImage(
  canvas: HTMLCanvasElement,
  data: SpeakerShareData
): void {
  const { name, party, spiritAnimal, signatureWord } = data;
  const partyColor = getPartyColor(party);

  const SIZE = 1080;
  canvas.width = SIZE;
  canvas.height = SIZE;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, SIZE);
  bgGradient.addColorStop(0, BG_COLORS.primary);
  bgGradient.addColorStop(1, BG_COLORS.elevated);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, SIZE, SIZE);

  drawDecorativeOrbs(ctx, SIZE, partyColor);

  const centerX = SIZE / 2;
  const hasAnimal = !!spiritAnimal;

  // Header
  const headerY = 80;
  const headerX = 70;
  const logoSize = 40;

  if (logoImage) {
    const logoHeight = (logoImage.height / logoImage.width) * logoSize;
    ctx.shadowColor = BRAND_COLORS.primary;
    ctx.shadowBlur = 10;
    ctx.drawImage(logoImage, headerX, headerY - logoHeight / 2 - 4, logoSize, logoHeight);
    ctx.shadowBlur = 0;
  }

  ctx.font = '600 25px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('BUNDESTAG WRAPPED 2025', headerX + logoSize + 12, headerY);

  // Layout constants
  const leftX = 70;
  const maxWidth = SIZE - leftX * 2;

  // Pink gradient for highlighted words
  const pinkGradient = ctx.createLinearGradient(leftX, 0, SIZE - leftX, 0);
  pinkGradient.addColorStop(0, BRAND_COLORS.gradientStart);
  pinkGradient.addColorStop(0.5, BRAND_COLORS.primary);
  pinkGradient.addColorStop(1, BRAND_COLORS.light);

  // Calculate unified font size for both spirit and signature sections
  let mainFontSize = 55;
  if (hasAnimal) {
    const animal = spiritAnimal!;
    const article = getAnimalArticle(animal.name);
    const testLine1 = `${name}, dein Spirit Animal`;
    const testLine2 = `ist ${article} ${animal.name}`;
    const line1Size = getResponsiveFontSize(ctx, testLine1, maxWidth, 55, 38);
    const line2Size = getResponsiveFontSize(ctx, testLine2, maxWidth, 55, 38);
    mainFontSize = Math.min(line1Size, line2Size);
  }

  // Track vertical position for dynamic layout
  let y = 210;

  // Spirit Animal section
  if (hasAnimal) {
    const animal = spiritAnimal!;
    const article = getAnimalArticle(animal.name);

    ctx.textAlign = 'left';
    ctx.font = `bold ${mainFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

    // Line 1: "Name, dein" (white) + "Spirit" (pink)
    const nameDein = `${name}, dein `;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(nameDein, leftX, y);
    const nameDeinWidth = ctx.measureText(nameDein).width;
    ctx.fillStyle = pinkGradient;
    ctx.shadowColor = `${BRAND_COLORS.primary}40`;
    ctx.shadowBlur = 14;
    ctx.fillText('Spirit Animal', leftX + nameDeinWidth, y);
    ctx.shadowBlur = 0;

    // Line 2: "ist der/die/das" (white) + "Animal" (pink)
    y += mainFontSize + 7;
    const istArticle = `ist ${article} `;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(istArticle, leftX, y);
    const istArticleWidth = ctx.measureText(istArticle).width;
    ctx.fillStyle = pinkGradient;
    ctx.shadowColor = `${BRAND_COLORS.primary}40`;
    ctx.shadowBlur = 14;
    ctx.fillText(animal.name + '.', leftX + istArticleWidth, y);
    ctx.shadowBlur = 0;

    // Subtitle with animal title and reason (auto-wrap)
    y += 57;
    ctx.font = '30px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    const subtitleText = `${animal.title}: ${animal.reason}`;
    const subtitleLines = wrapText(ctx, subtitleText, maxWidth);
    for (const line of subtitleLines) {
      ctx.fillText(line, leftX, y);
      y += 36;
    }

    // Large emoji below (centered)
    const emojiY = y + 228;
    ctx.font = '266px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = `${partyColor}50`;
    ctx.shadowBlur = 57;
    ctx.fillText(animal.emoji, centerX, emojiY);
    ctx.shadowBlur = 0;
    y = emojiY + 120; // Update y to after emoji for signature word
  } else {
    // No animal: just show the name in pink (left-aligned)
    ctx.font = 'bold 61px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = pinkGradient;
    ctx.shadowColor = `${BRAND_COLORS.primary}40`;
    ctx.shadowBlur = 19;
    ctx.fillText(name, leftX, 250);
    ctx.shadowBlur = 0;
    y = 400; // Position for signature word without animal
  }

  // Signature word section (same style & size as spirit text)
  if (signatureWord) {
    const signatureY = y;
    const word = signatureWord.word;

    ctx.textAlign = 'left';
    ctx.font = `bold ${mainFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

    // Check if it fits on one line
    const prefix = 'Dein Signaturwort ist ';
    const prefixWidth = ctx.measureText(prefix).width;
    const wordWidth = ctx.measureText(word).width;
    const fitsOnOneLine = prefixWidth + wordWidth <= maxWidth;

    let subtitleY: number;
    if (fitsOnOneLine) {
      // Single line: "Dein Signaturwort ist " (white) + word. (pink)
      ctx.fillStyle = '#ffffff';
      ctx.fillText(prefix, leftX, signatureY);

      ctx.fillStyle = pinkGradient;
      ctx.shadowColor = `${BRAND_COLORS.primary}40`;
      ctx.shadowBlur = 14;
      ctx.fillText(word + '.', leftX + prefixWidth, signatureY);
      ctx.shadowBlur = 0;
      subtitleY = signatureY + 57;
    } else {
      // Two lines: "Dein Signaturwort ist" (white) on line 1, word. (pink) on line 2
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Dein Signaturwort ist', leftX, signatureY);

      ctx.fillStyle = pinkGradient;
      ctx.shadowColor = `${BRAND_COLORS.primary}40`;
      ctx.shadowBlur = 14;
      ctx.fillText(word + '.', leftX, signatureY + mainFontSize + 7);
      ctx.shadowBlur = 0;
      subtitleY = signatureY + mainFontSize + 7 + 57;
    }

    // Subtitle with ratio stats (same style as animal subtitle)
    ctx.font = '30px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    const ratioText = `${signatureWord.ratioParty}× häufiger als deine Fraktion`;
    const ratioLines = wrapText(ctx, ratioText, maxWidth);
    for (const line of ratioLines) {
      ctx.fillText(line, leftX, subtitleY);
      subtitleY += 36;
    }
  }

  // Footer CTA - fixed at center bottom, question-answer format
  ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';

  // Line 1: Question
  const questionY = SIZE - 95;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Du willst auch dein Spirit Animal und Signaturwort kennen?', centerX, questionY);

  // Line 2: Answer with mixed colors
  const answerY = SIZE - 55;
  const answerWhite = 'Finde dein eigenes Wrapped auf ';
  const answerPink = 'bundestag-wrapped.de';
  const answerWhiteWidth = ctx.measureText(answerWhite).width;
  const answerPinkWidth = ctx.measureText(answerPink).width;
  const answerTotalWidth = answerWhiteWidth + answerPinkWidth;
  const answerStartX = centerX - answerTotalWidth / 2;

  // Create pink gradient for URL
  const urlGradient = ctx.createLinearGradient(centerX - 200, 0, centerX + 200, 0);
  urlGradient.addColorStop(0, BRAND_COLORS.gradientStart);
  urlGradient.addColorStop(1, BRAND_COLORS.light);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(answerWhite, answerStartX, answerY);
  ctx.fillStyle = urlGradient;
  ctx.shadowColor = `${BRAND_COLORS.primary}40`;
  ctx.shadowBlur = 10;
  ctx.fillText(answerPink, answerStartX + answerWhiteWidth, answerY);
  ctx.shadowBlur = 0;
}

export function downloadSpeakerShareImage(
  canvas: HTMLCanvasElement,
  speakerName: string
): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const slug = speakerName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[äöü]/g, (m) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[m] || m));
    a.download = `bundestag-wrapped-${slug}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export async function shareSpeakerImage(
  canvas: HTMLCanvasElement,
  speakerName: string
): Promise<boolean> {
  if (!navigator.share || !navigator.canShare) return false;

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }

      try {
        const file = new File(
          [blob],
          `bundestag-wrapped-${speakerName}.png`,
          { type: 'image/png' }
        );
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${speakerName} - Bundestag Wrapped 2025`,
          });
          resolve(true);
        } else {
          resolve(false);
        }
      } catch {
        resolve(false);
      }
    }, 'image/png');
  });
}

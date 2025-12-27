/**
 * Unified slide sharepic renderers.
 * Renders various Bundestag Wrapped slides as shareable 1080x1080 canvas images.
 */

import { BG_COLORS, BRAND_COLORS } from './design-tokens';
import { getPartyColor } from './party-colors';

// ============ TYPES ============

export interface MoinSpeaker {
  name: string;
  party: string;
  count: number;
}

export interface Zwischenrufer {
  name: string;
  party: string;
  count: number;
}

export interface DramaStats {
  topZwischenrufer: Zwischenrufer[];
}

export interface PartyGenderStats {
  party: string;
  femaleRatio: number;
}

export interface GenderAnalysis {
  byParty: PartyGenderStats[];
}

// ============ CONSTANTS ============

const SIZE = 1080;

const CHAMPION_COLORS = {
  bg: '#f59e0b',
  bgLight: '#fbbf24',
  border: '#fcd34d',
  text: '#78350f',
};

// ============ LOGO CACHE ============

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

if (typeof window !== 'undefined') {
  preloadLogo();
}

// ============ SHARED UTILITIES ============

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

interface CanvasSetup {
  ctx: CanvasRenderingContext2D;
  SIZE: number;
  centerX: number;
}

function setupCanvas(canvas: HTMLCanvasElement): CanvasSetup | null {
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, SIZE);
  bgGradient.addColorStop(0, BG_COLORS.primary);
  bgGradient.addColorStop(1, BG_COLORS.elevated);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Decorative orbs
  const gradient1 = ctx.createRadialGradient(
    SIZE * 0.85, SIZE * 0.12, 0,
    SIZE * 0.85, SIZE * 0.12, 300
  );
  gradient1.addColorStop(0, `${BRAND_COLORS.primary}20`);
  gradient1.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient1;
  ctx.beginPath();
  ctx.arc(SIZE * 0.85, SIZE * 0.12, 300, 0, Math.PI * 2);
  ctx.fill();

  const gradient2 = ctx.createRadialGradient(
    SIZE * 0.1, SIZE * 0.85, 0,
    SIZE * 0.1, SIZE * 0.85, 250
  );
  gradient2.addColorStop(0, `${BRAND_COLORS.light}18`);
  gradient2.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient2;
  ctx.beginPath();
  ctx.arc(SIZE * 0.1, SIZE * 0.85, 250, 0, Math.PI * 2);
  ctx.fill();

  return { ctx, SIZE, centerX: SIZE / 2 };
}

function drawHeader(ctx: CanvasRenderingContext2D): void {
  const headerY = 70, headerX = 60, logoSize = 38;
  if (logoImage) {
    const logoHeight = (logoImage.height / logoImage.width) * logoSize;
    ctx.shadowColor = BRAND_COLORS.primary;
    ctx.shadowBlur = 10;
    ctx.drawImage(logoImage, headerX, headerY - logoHeight / 2 - 4, logoSize, logoHeight);
    ctx.shadowBlur = 0;
  }
  ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('BUNDESTAG WRAPPED 2025', headerX + logoSize + 12, headerY);
}

function drawFooter(ctx: CanvasRenderingContext2D, centerX: number): void {
  ctx.textAlign = 'center';
  const footerY = SIZE - 80;
  ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('Teste dein Wissen auf', centerX, footerY);

  ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const urlGradient = ctx.createLinearGradient(centerX - 180, 0, centerX + 180, 0);
  urlGradient.addColorStop(0, BRAND_COLORS.gradientStart);
  urlGradient.addColorStop(1, BRAND_COLORS.light);
  ctx.fillStyle = urlGradient;
  ctx.fillText('bundestag-wrapped.de', centerX, footerY + 40);
}

// ============ MOIN SLIDE ============

function drawMoinCard(
  ctx: CanvasRenderingContext2D,
  speaker: MoinSpeaker,
  rank: number,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  const isChampion = rank === 1;
  const partyColor = getPartyColor(speaker.party);

  // Background
  if (isChampion) {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, `${CHAMPION_COLORS.bg}50`);
    g.addColorStop(1, `${CHAMPION_COLORS.bgLight}30`);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  }
  drawRoundedRect(ctx, x, y, w, h, 24);
  ctx.fill();
  ctx.strokeStyle = isChampion ? `${CHAMPION_COLORS.border}80` : 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = isChampion ? 3 : 2;
  drawRoundedRect(ctx, x, y, w, h, 24);
  ctx.stroke();

  const cx = x + w / 2;
  let cy = y + 30;

  // Crown for champion
  if (isChampion) {
    ctx.font = '36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👑', cx + 50, cy + 10);
  }

  // Wave emoji
  ctx.font = `${isChampion ? 56 : 48}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  if (isChampion) {
    ctx.shadowColor = `${CHAMPION_COLORS.bg}80`;
    ctx.shadowBlur = 20;
  }
  ctx.fillText('👋', cx, cy + 45);
  ctx.shadowBlur = 0;
  cy += isChampion ? 70 : 60;

  // Rank badge
  ctx.beginPath();
  ctx.arc(x + 30, y + 30, 18, 0, Math.PI * 2);
  ctx.fillStyle = isChampion ? CHAMPION_COLORS.bg : 'rgba(255, 255, 255, 0.2)';
  ctx.fill();
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isChampion ? CHAMPION_COLORS.text : 'rgba(255, 255, 255, 0.8)';
  ctx.fillText(`#${rank}`, x + 30, y + 30);
  ctx.textBaseline = 'alphabetic';

  // Name
  ctx.font = `bold ${isChampion ? 22 : 20}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillStyle = '#ffffff';
  let name = speaker.name;
  while (ctx.measureText(name).width > w - 40 && name.length > 3) name = name.slice(0, -1);
  if (name !== speaker.name) name = name.slice(0, -2) + '...';
  ctx.fillText(name, cx, cy);
  cy += 32;

  // Party pill
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const pw = ctx.measureText(speaker.party).width + 24;
  drawRoundedRect(ctx, cx - pw / 2, cy - 16, pw, 26, 13);
  ctx.fillStyle = partyColor;
  ctx.fill();
  ctx.fillStyle = partyColor === '#FFFFFF' ? '#000' : '#fff';
  ctx.fillText(speaker.party, cx, cy);
  cy += 36;

  // Count pill
  const countText = `${speaker.count}× Moin`;
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const cw = ctx.measureText(countText).width + 28;
  drawRoundedRect(ctx, cx - cw / 2, cy - 22, cw, 34, 17);
  ctx.fillStyle = isChampion ? `${CHAMPION_COLORS.bg}40` : 'rgba(255, 255, 255, 0.1)';
  ctx.fill();
  ctx.fillStyle = isChampion ? CHAMPION_COLORS.border : 'rgba(255, 255, 255, 0.8)';
  ctx.fillText(countText, cx, cy);
}

export function renderMoinSharepic(
  canvas: HTMLCanvasElement,
  speakers: MoinSpeaker[]
): void {
  const setup = setupCanvas(canvas);
  if (!setup) return;
  const { ctx, centerX } = setup;
  const centerY = SIZE / 2;

  drawHeader(ctx);

  // Calculate content dimensions for centering
  const cardWidth = 230, cardHeight = 220, gap = 24;
  const speakerCount = Math.min(speakers.length, 4);
  const champW = 280, champH = 260;
  const titleHeight = 130; // emoji + title + subtitle
  const cardsHeight = speakerCount === 3
    ? champH + gap + cardHeight
    : cardHeight * 2 + gap;
  const totalHeight = titleHeight + 30 + cardsHeight;
  const startY = centerY - totalHeight / 2;

  // Title section
  ctx.font = '70px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = `${BRAND_COLORS.primary}50`;
  ctx.shadowBlur = 30;
  ctx.fillText('👋', centerX, startY + 50);
  ctx.shadowBlur = 0;

  ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Die Moin-Champions', centerX, startY + 105);

  ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Norddeutsche Grüße im Bundestag', centerX, startY + 135);

  const cardsY = startY + titleHeight + 30;

  if (speakerCount === 3) {
    // Pyramid: champion on top, 2 below
    drawMoinCard(ctx, speakers[0], 1, centerX - champW / 2, cardsY, champW, champH);
    const row2W = cardWidth * 2 + gap;
    const row2X = centerX - row2W / 2;
    drawMoinCard(ctx, speakers[1], 2, row2X, cardsY + champH + gap, cardWidth, cardHeight);
    drawMoinCard(ctx, speakers[2], 3, row2X + cardWidth + gap, cardsY + champH + gap, cardWidth, cardHeight);
  } else {
    // 2x2 grid
    const gridW = cardWidth * 2 + gap;
    const gridX = centerX - gridW / 2;
    speakers.slice(0, 4).forEach((s, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      drawMoinCard(ctx, s, i + 1, gridX + col * (cardWidth + gap), cardsY + row * (cardHeight + gap), cardWidth, cardHeight);
    });
  }

  drawFooter(ctx, centerX);
}

// ============ DRAMA SLIDE ============

export function renderDramaSharepic(
  canvas: HTMLCanvasElement,
  drama: DramaStats
): void {
  const setup = setupCanvas(canvas);
  if (!setup) return;
  const { ctx, centerX } = setup;
  const centerY = SIZE / 2;

  drawHeader(ctx);

  const leader = drama.topZwischenrufer?.[0];
  if (!leader) return;

  const partyColor = getPartyColor(leader.party);

  // Calculate content height for centering
  // emoji(70) + name(50) + party(40) + count(180) + label(40) + note(30) + spacing
  const totalHeight = 480;
  const startY = centerY - totalHeight / 2;

  // Emoji
  ctx.font = '80px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎭', centerX, startY + 60);

  // Name
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(leader.name, centerX, startY + 130);

  // Party
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const pw = ctx.measureText(leader.party).width + 28;
  drawRoundedRect(ctx, centerX - pw / 2, startY + 150, pw, 32, 16);
  ctx.fillStyle = partyColor;
  ctx.fill();
  ctx.fillStyle = partyColor === '#FFFFFF' ? '#000' : '#fff';
  ctx.textAlign = 'center';
  ctx.fillText(leader.party, centerX, startY + 172);

  // Big count
  ctx.font = '900 160px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = partyColor;
  ctx.shadowColor = `${partyColor}50`;
  ctx.shadowBlur = 80;
  ctx.fillText(leader.count.toLocaleString('de-DE'), centerX, startY + 350);
  ctx.shadowBlur = 0;

  // Label
  ctx.font = '30px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Zwischenrufe', centerX, startY + 410);

  // Note
  ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('Mit über 4.000 (!) Zwischenrufen stört die AfD am meisten.', centerX, startY + 470);

  drawFooter(ctx, centerX);
}

// ============ GENDER SLIDE ============

export function renderGenderSharepic(
  canvas: HTMLCanvasElement,
  genderAnalysis: GenderAnalysis
): void {
  const setup = setupCanvas(canvas);
  if (!setup) return;
  const { ctx, centerX } = setup;
  const centerY = SIZE / 2;

  drawHeader(ctx);

  const parties = (genderAnalysis.byParty || [])
    .filter((p) => p.party !== 'fraktionslos')
    .sort((a, b) => b.femaleRatio - a.femaleRatio);

  // Calculate content height for centering
  const barH = 44, gap = 16;
  const titleHeight = 120;
  const barsHeight = parties.length * barH + (parties.length - 1) * gap;
  const totalHeight = titleHeight + 30 + barsHeight;
  const startY = centerY - totalHeight / 2;

  // Title
  ctx.font = '60px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('👩‍💼', centerX, startY + 45);

  ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Frauenanteil bei Reden', centerX, startY + 100);

  ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Anteil weiblicher Rednerinnen pro Fraktion', centerX, startY + 130);

  // Bars
  const barW = 700;
  const barStartX = centerX - barW / 2;
  let y = startY + titleHeight + 30;

  parties.forEach((p) => {
    const partyColor = getPartyColor(p.party);
    const ratio = p.femaleRatio / 100;

    // BG bar
    drawRoundedRect(ctx, barStartX, y, barW, barH, barH / 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    // Filled bar
    const fillW = Math.max(barW * ratio, barH);
    drawRoundedRect(ctx, barStartX, y, fillW, barH, barH / 2);
    ctx.fillStyle = partyColor;
    ctx.fill();

    // Party name
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = partyColor === '#FFFFFF' ? '#000' : '#fff';
    ctx.fillText(p.party, barStartX + 16, y + barH / 2 + 5);

    // Percentage
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${p.femaleRatio.toFixed(0)}%`, barStartX + barW - 16, y + barH / 2 + 5);

    y += barH + gap;
  });

  drawFooter(ctx, centerX);
}

// ============ VOCABULARY SLIDE ============

export interface SignatureWord {
  word: string;
  ratio: number;
}

export interface PartyStats {
  party: string;
  signatureWords: SignatureWord[];
}

export interface VocabularyData {
  parties: PartyStats[];
}

function drawVocabularyBubble(
  ctx: CanvasRenderingContext2D,
  party: string,
  word: string,
  x: number,
  y: number,
  size: number
): void {
  const partyColor = getPartyColor(party);

  // Bubble background
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  const gradient = ctx.createRadialGradient(x - size * 0.2, y - size * 0.2, 0, x, y, size / 2);
  gradient.addColorStop(0, `${partyColor}40`);
  gradient.addColorStop(1, `${partyColor}20`);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = `${partyColor}80`;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Word
  ctx.font = `bold ${Math.floor(size * 0.22)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(word, x, y - 10);

  // Party label
  ctx.font = `bold ${Math.floor(size * 0.14)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillStyle = partyColor;
  ctx.fillText(party, x, y + size * 0.25);
  ctx.textBaseline = 'alphabetic';
}

export function renderVocabularySharepic(
  canvas: HTMLCanvasElement,
  data: VocabularyData
): void {
  const setup = setupCanvas(canvas);
  if (!setup) return;
  const { ctx, centerX } = setup;
  const centerY = SIZE / 2;

  drawHeader(ctx);

  const parties = data.parties
    .filter(p => p.party !== 'fraktionslos' && p.signatureWords.length > 0)
    .slice(0, 5);

  // Title
  ctx.font = '60px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📚', centerX, 180);

  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Partei-Vokabular', centerX, 240);

  ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Diese Wörter zeichnen die Parteien aus', centerX, 275);

  // Bubbles layout: 2 top, 3 bottom
  const bubbleSize = 200;
  const positions = [
    { x: centerX - 130, y: centerY - 60 },
    { x: centerX + 130, y: centerY - 60 },
    { x: centerX - 220, y: centerY + 150 },
    { x: centerX, y: centerY + 180 },
    { x: centerX + 220, y: centerY + 150 },
  ];

  parties.forEach((party, i) => {
    if (positions[i]) {
      const topWord = party.signatureWords[0]?.word || '—';
      drawVocabularyBubble(ctx, party.party, topWord, positions[i].x, positions[i].y, bubbleSize);
    }
  });

  drawFooter(ctx, centerX);
}

// ============ SPEECHES SLIDE ============

export interface SpeechesParty {
  party: string;
  speeches: number;
  wortbeitraege: number;
}

export interface SpeechesData {
  parties: SpeechesParty[];
  totalSpeeches?: number;
}

export function renderSpeechesSharepic(
  canvas: HTMLCanvasElement,
  data: SpeechesData
): void {
  const setup = setupCanvas(canvas);
  if (!setup) return;
  const { ctx, centerX } = setup;

  drawHeader(ctx);

  const parties = data.parties
    .filter(p => p.party !== 'fraktionslos')
    .sort((a, b) => b.speeches - a.speeches)
    .slice(0, 5);

  const total = data.totalSpeeches || parties.reduce((sum, p) => sum + p.speeches, 0);

  // Title
  ctx.font = '60px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎤', centerX, 180);

  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Die Reden', centerX, 240);

  ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText(`${total.toLocaleString('de-DE')} Reden im Bundestag`, centerX, 275);

  // Bar chart
  const barW = 700;
  const barH = 50;
  const gap = 16;
  const barStartX = centerX - barW / 2;
  let y = 340;

  const maxSpeeches = Math.max(...parties.map(p => p.speeches));

  parties.forEach((p) => {
    const partyColor = getPartyColor(p.party);
    const ratio = p.speeches / maxSpeeches;

    // BG bar
    drawRoundedRect(ctx, barStartX, y, barW, barH, barH / 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    // Filled bar
    const fillW = Math.max(barW * ratio, barH);
    drawRoundedRect(ctx, barStartX, y, fillW, barH, barH / 2);
    ctx.fillStyle = partyColor;
    ctx.fill();

    // Party name
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = partyColor === '#FFFFFF' ? '#000' : '#fff';
    ctx.fillText(p.party, barStartX + 18, y + barH / 2 + 5);

    // Count
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${p.speeches} Reden`, barStartX + barW - 18, y + barH / 2 + 5);

    y += barH + gap;
  });

  drawFooter(ctx, centerX);
}

// ============ COMMON WORDS SLIDE ============

export interface CommonWordsData {
  topics: string[];
}

const WORD_CLOUD_COLORS = [
  '#ec4899', '#8b5cf6', '#06b6d4', '#10b981',
  '#f59e0b', '#ef4444', '#3b82f6', '#84cc16',
];

export function renderCommonWordsSharepic(
  canvas: HTMLCanvasElement,
  data: CommonWordsData
): void {
  const setup = setupCanvas(canvas);
  if (!setup) return;
  const { ctx, centerX } = setup;

  drawHeader(ctx);

  const words = data.topics.slice(0, 12);

  // Title
  ctx.font = '60px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📊', centerX, 180);

  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Häufigste Wörter', centerX, 240);

  ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Die meistgenutzten Wörter im Bundestag', centerX, 275);

  // Word cloud - simple grid layout
  const startY = 340;
  const cols = 3;
  const rowH = 100;
  const colW = 300;

  words.forEach((word, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = centerX + (col - 1) * colW;
    const y = startY + row * rowH;

    // Size based on position (first words bigger)
    const fontSize = i < 2 ? 42 : i < 5 ? 34 : i < 8 ? 28 : 24;
    const color = WORD_CLOUD_COLORS[i % WORD_CLOUD_COLORS.length];

    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(word, x, y);
  });

  drawFooter(ctx, centerX);
}

// ============ TONE ANALYSIS SLIDE ============

export interface PartyProfile {
  party: string;
  emoji: string;
  traits: string[];
  categoryName?: string;
}

export interface ToneAnalysisData {
  partyProfiles: Record<string, PartyProfile>;
}

function drawToneBubble(
  ctx: CanvasRenderingContext2D,
  profile: PartyProfile,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  const partyColor = getPartyColor(profile.party);

  // Card background
  const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
  gradient.addColorStop(0, `${partyColor}30`);
  gradient.addColorStop(1, `${partyColor}15`);
  ctx.fillStyle = gradient;
  drawRoundedRect(ctx, x, y, w, h, 20);
  ctx.fill();
  ctx.strokeStyle = `${partyColor}60`;
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, x, y, w, h, 20);
  ctx.stroke();

  const cx = x + w / 2;

  // Emoji
  ctx.font = '40px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(profile.emoji || '🎭', cx, y + 50);

  // Party name
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = partyColor;
  ctx.fillText(profile.party, cx, y + 85);

  // Category/trait
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  const trait = profile.categoryName || profile.traits?.[0] || '';
  ctx.fillText(trait, cx, y + 110);
}

export function renderToneAnalysisSharepic(
  canvas: HTMLCanvasElement,
  data: ToneAnalysisData
): void {
  const setup = setupCanvas(canvas);
  if (!setup) return;
  const { ctx, centerX } = setup;

  drawHeader(ctx);

  const profiles = Object.values(data.partyProfiles)
    .filter(p => p.party !== 'fraktionslos')
    .slice(0, 6);

  // Title
  ctx.font = '60px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎭', centerX, 180);

  ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Fraktions-Persönlichkeiten', centerX, 240);

  ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Die Kommunikationsstile der Parteien', centerX, 275);

  // Grid: 3 columns, 2 rows
  const cardW = 180;
  const cardH = 130;
  const gap = 20;
  const gridW = cardW * 3 + gap * 2;
  const startX = centerX - gridW / 2;
  const startY = 320;

  profiles.forEach((profile, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);
    drawToneBubble(ctx, profile, x, y, cardW, cardH);
  });

  drawFooter(ctx, centerX);
}

// ============ SWIFTIE SLIDE ============

export interface SwiftieData {
  name: string;
  party: string;
}

export function renderSwiftieSharepic(
  canvas: HTMLCanvasElement,
  data: SwiftieData
): void {
  const setup = setupCanvas(canvas);
  if (!setup) return;
  const { ctx, centerX } = setup;
  const centerY = SIZE / 2;

  drawHeader(ctx);

  const partyColor = getPartyColor(data.party);

  // Purple decorative orb
  const purpleOrb = ctx.createRadialGradient(centerX, centerY - 100, 0, centerX, centerY - 100, 300);
  purpleOrb.addColorStop(0, '#9333ea30');
  purpleOrb.addColorStop(1, 'transparent');
  ctx.fillStyle = purpleOrb;
  ctx.beginPath();
  ctx.arc(centerX, centerY - 100, 300, 0, Math.PI * 2);
  ctx.fill();

  // Title
  ctx.font = '80px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('💜', centerX, 200);

  ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Der einzige Swiftie', centerX, 270);

  ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('im Bundestag', centerX, 310);

  // Card
  const cardW = 400;
  const cardH = 280;
  const cardX = centerX - cardW / 2;
  const cardY = 360;

  const cardGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  cardGradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
  cardGradient.addColorStop(1, 'rgba(236, 72, 153, 0.2)');
  ctx.fillStyle = cardGradient;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.stroke();

  // Crown
  ctx.font = '36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('👑', cardX + cardW - 40, cardY + 40);

  // Bracelets
  ctx.font = '44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('🩷💎🩵', centerX, cardY + 70);

  // Name
  ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = partyColor;
  ctx.shadowColor = `${partyColor}50`;
  ctx.shadowBlur = 30;
  ctx.fillText(data.name, centerX, cardY + 140);
  ctx.shadowBlur = 0;

  // Party badge
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const pw = ctx.measureText(data.party).width + 28;
  drawRoundedRect(ctx, centerX - pw / 2, cardY + 165, pw, 32, 16);
  ctx.fillStyle = partyColor;
  ctx.fill();
  ctx.fillStyle = partyColor === '#FFFFFF' ? '#000' : '#fff';
  ctx.fillText(data.party, centerX, cardY + 187);

  // Context
  ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Erwähnte "Taylor Swift" und "Swifties"', centerX, cardY + 230);
  ctx.fillText('in einer Rede über Cybersicherheit', centerX, cardY + 252);

  drawFooter(ctx, centerX);
}

// ============ DOWNLOAD/SHARE HELPERS ============

export function downloadSharepic(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export async function shareSharepic(
  canvas: HTMLCanvasElement,
  title: string
): Promise<boolean> {
  if (!navigator.share || !navigator.canShare) return false;

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }

      try {
        const file = new File([blob], 'bundestag-wrapped.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title,
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

// ============ UNIFIED DISPATCHER ============

export type SlideType =
  | 'moin'
  | 'drama'
  | 'gender'
  | 'vocabulary'
  | 'speeches'
  | 'commonWords'
  | 'toneAnalysis'
  | 'swiftie';

export type SlideData =
  | { type: 'moin'; speakers: MoinSpeaker[] }
  | { type: 'drama'; drama: DramaStats }
  | { type: 'gender'; genderAnalysis: GenderAnalysis }
  | { type: 'vocabulary'; data: VocabularyData }
  | { type: 'speeches'; data: SpeechesData }
  | { type: 'commonWords'; data: CommonWordsData }
  | { type: 'toneAnalysis'; data: ToneAnalysisData }
  | { type: 'swiftie'; data: SwiftieData };

export function renderSlideSharepic(canvas: HTMLCanvasElement, slideData: SlideData): void {
  switch (slideData.type) {
    case 'moin':
      renderMoinSharepic(canvas, slideData.speakers);
      break;
    case 'drama':
      renderDramaSharepic(canvas, slideData.drama);
      break;
    case 'gender':
      renderGenderSharepic(canvas, slideData.genderAnalysis);
      break;
    case 'vocabulary':
      renderVocabularySharepic(canvas, slideData.data);
      break;
    case 'speeches':
      renderSpeechesSharepic(canvas, slideData.data);
      break;
    case 'commonWords':
      renderCommonWordsSharepic(canvas, slideData.data);
      break;
    case 'toneAnalysis':
      renderToneAnalysisSharepic(canvas, slideData.data);
      break;
    case 'swiftie':
      renderSwiftieSharepic(canvas, slideData.data);
      break;
  }
}

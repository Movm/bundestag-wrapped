/**
 * Generate Play Store assets using canvas
 * - App icon: 512x512 PNG
 * - Feature graphic: 1024x500 PNG
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Design tokens (matching src/lib/design-tokens.ts)
const BRAND_COLORS = {
  primary: '#db2777',
  secondary: '#ec4899',
  light: '#f472b6',
  gradientStart: '#be185d',
};

const BG_COLORS = {
  primary: '#0a0a0f',
  secondary: '#12121a',
};

function drawDecorativeOrbs(ctx, width, height) {
  // Pink orb top-right
  const g1 = ctx.createRadialGradient(
    width * 0.85, height * 0.15, 0,
    width * 0.85, height * 0.15, Math.min(width, height) * 0.4
  );
  g1.addColorStop(0, BRAND_COLORS.primary + '25');
  g1.addColorStop(0.5, BRAND_COLORS.secondary + '10');
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.15, Math.min(width, height) * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Purple orb bottom-left
  const g2 = ctx.createRadialGradient(
    width * 0.15, height * 0.85, 0,
    width * 0.15, height * 0.85, Math.min(width, height) * 0.35
  );
  g2.addColorStop(0, BRAND_COLORS.light + '20');
  g2.addColorStop(0.6, BRAND_COLORS.primary + '08');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.beginPath();
  ctx.arc(width * 0.15, height * 0.85, Math.min(width, height) * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

async function generateAppIcon(logoPath, outputPath) {
  const SIZE = 512;
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bgGradient.addColorStop(0, BG_COLORS.primary);
  bgGradient.addColorStop(1, BG_COLORS.secondary);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Decorative orbs
  drawDecorativeOrbs(ctx, SIZE, SIZE);

  // Load and draw logo centered
  const logo = await loadImage(logoPath);
  const logoSize = SIZE * 0.7;
  const logoX = (SIZE - logoSize) / 2;
  const logoY = (SIZE - logoSize) / 2;

  // Add subtle glow behind logo
  ctx.shadowColor = BRAND_COLORS.primary;
  ctx.shadowBlur = 40;
  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
  ctx.shadowBlur = 0;

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`App icon saved: ${outputPath}`);
}

async function generateFeatureGraphic(logoPath, outputPath) {
  const WIDTH = 1024;
  const HEIGHT = 500;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGradient.addColorStop(0, BG_COLORS.primary);
  bgGradient.addColorStop(1, BG_COLORS.secondary);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Decorative orbs
  drawDecorativeOrbs(ctx, WIDTH, HEIGHT);

  // Load logo
  const logo = await loadImage(logoPath);

  // Logo on the left
  const logoSize = HEIGHT * 0.55;
  const logoX = WIDTH * 0.12;
  const logoY = (HEIGHT - logoSize) / 2;

  ctx.shadowColor = BRAND_COLORS.primary;
  ctx.shadowBlur = 30;
  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
  ctx.shadowBlur = 0;

  // Text on the right
  const textX = WIDTH * 0.42;
  const centerY = HEIGHT / 2;

  // Title gradient
  const titleGradient = ctx.createLinearGradient(textX, 0, textX + 400, 0);
  titleGradient.addColorStop(0, BRAND_COLORS.gradientStart);
  titleGradient.addColorStop(0.5, BRAND_COLORS.primary);
  titleGradient.addColorStop(1, BRAND_COLORS.light);

  // "BUNDESTAG" - large
  ctx.font = 'bold 72px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = titleGradient;
  ctx.textAlign = 'left';
  ctx.fillText('BUNDESTAG', textX, centerY - 20);

  // "WRAPPED 2025" - slightly smaller
  ctx.font = 'bold 56px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('WRAPPED 2025', textX, centerY + 50);

  // Tagline
  ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Das Jahr im Bundestag', textX, centerY + 100);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Feature graphic saved: ${outputPath}`);
}

async function main() {
  const logoPath = path.join(__dirname, '../public/logo.png');
  const outputDir = path.join(__dirname, '../android/store-assets');

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await generateAppIcon(logoPath, path.join(outputDir, 'app-icon-512.png'));
  await generateFeatureGraphic(logoPath, path.join(outputDir, 'feature-graphic-1024x500.png'));

  console.log('\nStore assets generated in:', outputDir);
}

main().catch(console.error);

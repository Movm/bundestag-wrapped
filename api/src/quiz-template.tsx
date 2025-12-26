/**
 * Satori JSX template for quiz result sharepics
 * Renders to 1080x1080 PNG via satori + resvg
 *
 * Ports the client-side share-canvas.ts logic to server-side rendering
 */

import { BRAND_COLORS, BG_COLORS } from './colors.js';

export interface QuizShareData {
  correctCount: number;
  totalQuestions: number;
  userName?: string;
}

interface ResultMessage {
  emoji: string;
  title: string;
  tagline: string;
}

function getResultMessage(correctCount: number, totalQuestions: number): ResultMessage {
  const score = Math.round((correctCount / totalQuestions) * 10);

  switch (score) {
    case 10: return {
      emoji: '🏆', title: 'Polit-Legende!',
      tagline: 'Perfekt! Du könntest im Bundestag hospitieren.'
    };
    case 9: return {
      emoji: '🏆', title: 'Polit-Legende!',
      tagline: 'Deine Eltern wären so stolz auf dich.'
    };
    case 8: return {
      emoji: '🏆', title: 'Polit-Legende!',
      tagline: 'Fast makellos – da wackelt der Kanzlerstuhl.'
    };
    case 7: return {
      emoji: '🌟', title: 'Demokratie-Star!',
      tagline: 'Mit dir würden wir in eine Koalition gehen.'
    };
    case 6: return {
      emoji: '🌟', title: 'Demokratie-Star!',
      tagline: 'Solide! Die Fraktion wäre beeindruckt.'
    };
    case 5: return {
      emoji: '🚀', title: 'Politik-Talent!',
      tagline: 'Die Hälfte ist geschafft, weiter so!'
    };
    case 4: return {
      emoji: '🚀', title: 'Politik-Talent!',
      tagline: 'Du bist auf einem guten Weg, bleib dran!'
    };
    case 3: return {
      emoji: '✨', title: 'Rising Star!',
      tagline: 'Rom wurde auch nicht an einem Tag erbaut.'
    };
    case 2: return {
      emoji: '✨', title: 'Rising Star!',
      tagline: 'Jeder Profi hat mal klein angefangen.'
    };
    case 1: return {
      emoji: '✨', title: 'Rising Star!',
      tagline: 'Ein Punkt ist besser als kein Punkt!'
    };
    default: return {
      emoji: '✨', title: 'Rising Star!',
      tagline: "Nächstes Mal wird's besser, versprochen!"
    };
  }
}

export function QuizTemplate({ data, logoBase64 }: { data: QuizShareData; logoBase64: string }) {
  const { correctCount, totalQuestions, userName } = data;
  const result = getResultMessage(correctCount, totalQuestions);
  const name = userName?.trim();

  // Text for hero section
  // Short names (≤14 chars): "Moritz, du bist" | Long names: "Moritz ist" | No name: "Du bist"
  const line1Text = name
    ? (name.length <= 14 ? `${name}, du bist` : `${name} ist`)
    : 'Du bist';
  const line2Text = `${result.title} ${result.emoji}`;

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(180deg, ${BG_COLORS.primary} 0%, ${BG_COLORS.elevated} 100%)`,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative orbs wrapper - 4 orbs like the client-side version */}
      <div style={{ display: 'flex', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Large pink orb (top-right) */}
        <div
          style={{
            position: 'absolute',
            top: -118,
            right: -86,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND_COLORS.primary}18 0%, ${BRAND_COLORS.secondary}0a 50%, transparent 70%)`,
          }}
        />
        {/* Medium orb (bottom-left) */}
        <div
          style={{
            position: 'absolute',
            bottom: 18,
            left: -58,
            width: 440,
            height: 440,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND_COLORS.light}14 0%, ${BRAND_COLORS.primary}08 60%, transparent 70%)`,
          }}
        />
        {/* Small accent orb (mid-left) */}
        <div
          style={{
            position: 'absolute',
            top: 366,
            left: -34,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND_COLORS.secondary}10 0%, transparent 70%)`,
          }}
        />
        {/* Small accent orb (bottom-right) */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND_COLORS.gradientStart}12 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Header: Logo + "BUNDESTAG WRAPPED 2025" */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '70px 70px 0',
          gap: 12,
        }}
      >
        {logoBase64 && (
          <img
            src={logoBase64}
            width={40}
            height={40}
            style={{
              filter: `drop-shadow(0 0 10px ${BRAND_COLORS.primary})`,
            }}
          />
        )}
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.02em',
          }}
        >
          BUNDESTAG WRAPPED 2025
        </div>
      </div>

      {/* Main content area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          padding: '0 70px',
          justifyContent: 'center',
        }}
      >
        {/* Hero: Two-line achievement text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: -80,
          }}
        >
          {/* Line 1: "Du bist" or "Name, du bist" */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              background: `linear-gradient(90deg, ${BRAND_COLORS.gradientStart}, ${BRAND_COLORS.primary}, ${BRAND_COLORS.light})`,
              backgroundClip: 'text',
              color: 'transparent',
              filter: `drop-shadow(0 0 50px ${BRAND_COLORS.primary}60)`,
            }}
          >
            {line1Text}
          </div>
          {/* Line 2: title + emoji */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              background: `linear-gradient(90deg, ${BRAND_COLORS.gradientStart}, ${BRAND_COLORS.primary}, ${BRAND_COLORS.light})`,
              backgroundClip: 'text',
              color: 'transparent',
              filter: `drop-shadow(0 0 50px ${BRAND_COLORS.primary}60)`,
              marginTop: 10,
            }}
          >
            {line2Text}
          </div>
        </div>

        {/* Score: large centered number */}
        <div
          style={{
            display: 'flex',
            fontSize: 140,
            fontWeight: 900,
            color: '#ffffff',
            marginTop: 60,
          }}
        >
          {correctCount}/{totalQuestions}
        </div>

        {/* Tagline: italic result message */}
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: 40,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          {result.tagline}
        </div>
      </div>

      {/* Footer CTA */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 70px 95px',
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          Teste dein Wissen auf
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            fontWeight: 700,
            background: `linear-gradient(90deg, ${BRAND_COLORS.gradientStart}, ${BRAND_COLORS.light})`,
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          bundestag-wrapped.de
        </div>
      </div>
    </div>
  );
}

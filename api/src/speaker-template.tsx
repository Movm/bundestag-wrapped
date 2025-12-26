/**
 * Satori JSX template for speaker sharepics
 * Renders to 1080x1080 PNG via satori + resvg
 */

import { BRAND_COLORS, BG_COLORS, getPartyColor, getAnimalArticle } from './colors.js';

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

export function SpeakerTemplate({ data, logoBase64 }: { data: SpeakerShareData; logoBase64: string }) {
  const { name, party, spiritAnimal, signatureWord } = data;
  const partyColor = getPartyColor(party);
  const hasAnimal = !!spiritAnimal;

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
      {/* Decorative orbs wrapper */}
      <div style={{ display: 'flex', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${partyColor}30 0%, ${BRAND_COLORS.secondary}0a 50%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: -100,
            width: 440,
            height: 440,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${partyColor}20 0%, ${BRAND_COLORS.primary}08 60%, transparent 70%)`,
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
            fontSize: 25,
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.02em',
          }}
        >
          BUNDESTAG WRAPPED 2025
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '50px 70px',
          flex: 1,
        }}
      >
        {hasAnimal ? (
          <>
            {/* Spirit Animal Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {/* Line 1: "Name, dein Spirit Animal" */}
              <div style={{ display: 'flex', fontSize: 55, fontWeight: 700 }}>
                <span style={{ color: '#ffffff' }}>{name}, dein </span>
                <span
                  style={{
                    background: `linear-gradient(90deg, ${BRAND_COLORS.gradientStart}, ${BRAND_COLORS.primary}, ${BRAND_COLORS.light})`,
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Spirit Animal
                </span>
              </div>

              {/* Line 2: "ist der/die/das AnimalName." */}
              <div style={{ display: 'flex', fontSize: 55, fontWeight: 700 }}>
                <span style={{ color: '#ffffff' }}>
                  ist {getAnimalArticle(spiritAnimal!.name)}{' '}
                </span>
                <span
                  style={{
                    background: `linear-gradient(90deg, ${BRAND_COLORS.gradientStart}, ${BRAND_COLORS.primary}, ${BRAND_COLORS.light})`,
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {spiritAnimal!.name}.
                </span>
              </div>
            </div>

            {/* Animal subtitle */}
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                color: '#ffffff',
                marginTop: 40,
                lineHeight: 1.4,
                maxWidth: 940,
              }}
            >
              {spiritAnimal!.title}: {spiritAnimal!.reason}
            </div>

            {/* Large emoji */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  fontSize: 220,
                  filter: `drop-shadow(0 0 60px ${partyColor}50)`,
                }}
              >
                {spiritAnimal!.emoji}
              </div>
            </div>
          </>
        ) : (
          /* No animal: just show the name */
          <div
            style={{
              fontSize: 61,
              fontWeight: 700,
              background: `linear-gradient(90deg, ${BRAND_COLORS.gradientStart}, ${BRAND_COLORS.primary}, ${BRAND_COLORS.light})`,
              backgroundClip: 'text',
              color: 'transparent',
              marginTop: 50,
            }}
          >
            {name}
          </div>
        )}

        {/* Signature word section */}
        {signatureWord && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: hasAnimal ? 0 : 100,
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', fontSize: 55, fontWeight: 700, flexWrap: 'wrap' }}>
              <span style={{ color: '#ffffff' }}>Dein Signaturwort ist </span>
              <span
                style={{
                  background: `linear-gradient(90deg, ${BRAND_COLORS.gradientStart}, ${BRAND_COLORS.primary}, ${BRAND_COLORS.light})`,
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {signatureWord.word}.
              </span>
            </div>
            <div style={{ display: 'flex', fontSize: 30, color: '#ffffff', marginTop: 10 }}>
              {signatureWord.ratioParty.toFixed(1)}× häufiger als deine Fraktion
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 70px 55px',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: '#ffffff', textAlign: 'center' }}>
          Du willst auch dein Spirit Animal und Signaturwort kennen?
        </div>
        <div style={{ display: 'flex', fontSize: 26 }}>
          <span style={{ color: '#ffffff' }}>Finde dein eigenes Wrapped auf </span>
          <span
            style={{
              background: `linear-gradient(90deg, ${BRAND_COLORS.gradientStart}, ${BRAND_COLORS.light})`,
              backgroundClip: 'text',
              color: 'transparent',
              marginLeft: 6,
            }}
          >
            bundestag-wrapped.de
          </span>
        </div>
      </div>
    </div>
  );
}

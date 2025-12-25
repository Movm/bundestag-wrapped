import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  renderSpeakerShareImage,
  downloadSpeakerShareImage,
  getResponsiveFontSize,
  _resetLogoForTesting,
  type SpeakerShareData,
} from './speaker-share-canvas';

// Mock canvas context with all required methods
function createMockContext(): CanvasRenderingContext2D {
  return {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    roundRect: vi.fn(),
    drawImage: vi.fn(),
    measureText: vi.fn(() => ({ width: 100 })),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    // Properties
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    textAlign: 'start',
    font: '',
    shadowColor: '',
    shadowBlur: 0,
  } as unknown as CanvasRenderingContext2D;
}

function createMockCanvas(ctx: CanvasRenderingContext2D) {
  return {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ctx),
    toBlob: vi.fn((callback: (blob: Blob | null) => void) => {
      callback(new Blob(['test'], { type: 'image/png' }));
    }),
  } as unknown as HTMLCanvasElement;
}

describe('speaker-share-canvas', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockCtx = createMockContext();
    mockCanvas = createMockCanvas(mockCtx);
    _resetLogoForTesting();
  });

  describe('renderSpeakerShareImage', () => {
    it('should set canvas dimensions to 1080x1080', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: null,
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      expect(mockCanvas.width).toBe(1080);
      expect(mockCanvas.height).toBe(1080);
    });

    it('should call getContext with 2d', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: null,
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    });

    it('should draw background gradient', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: null,
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      expect(mockCtx.createLinearGradient).toHaveBeenCalled();
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 1080, 1080);
    });

    it('should render header text', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: null,
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasHeaderText = fillTextCalls.some(
        (call: unknown[]) => call[0] === 'BUNDESTAG WRAPPED 2025'
      );
      expect(hasHeaderText).toBe(true);
    });

    it('should render speaker name', () => {
      const data: SpeakerShareData = {
        name: 'Friedrich Merz',
        party: 'CDU/CSU',
        spiritAnimal: null,
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasName = fillTextCalls.some(
        (call: unknown[]) => call[0] === 'Friedrich Merz'
      );
      expect(hasName).toBe(true);
    });

    it('should render spirit animal emoji when provided', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: {
          emoji: '🐘',
          name: 'Elefant',
          title: 'Wortgewaltige:r Redner:in',
          reason: 'Mit 45.000 Wörtern eine:r der redefreudigsten Abgeordneten.',
        },
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasEmoji = fillTextCalls.some((call: unknown[]) => call[0] === '🐘');
      expect(hasEmoji).toBe(true);
    });

    it('should render spirit text with white and pink parts for masculine animals', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: {
          emoji: '🐘',
          name: 'Elefant',
          title: 'Wortgewaltige:r Redner:in',
          reason: 'Mit 45.000 Wörtern eine:r der redefreudigsten Abgeordneten.',
        },
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      // White parts
      expect(fillTextCalls.some((c: unknown[]) => c[0] === 'Lars Klingbeil, dein ')).toBe(true);
      expect(fillTextCalls.some((c: unknown[]) => c[0] === 'ist der ')).toBe(true);
      // Pink parts (with period at end of animal name)
      expect(fillTextCalls.some((c: unknown[]) => c[0] === 'Spirit Animal')).toBe(true);
      expect(fillTextCalls.some((c: unknown[]) => c[0] === 'Elefant.')).toBe(true);
    });

    it('should render spirit text with correct article for feminine animals', () => {
      const data: SpeakerShareData = {
        name: 'Paula Piechotta',
        party: 'GRÜNE',
        spiritAnimal: {
          emoji: '🦉',
          name: 'Eule',
          title: 'Themenexpert:in',
          reason: 'Fokussiert auf wenige Kernthemen mit großer Expertise.',
        },
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      expect(fillTextCalls.some((c: unknown[]) => c[0] === 'ist die ')).toBe(true);
      expect(fillTextCalls.some((c: unknown[]) => c[0] === 'Eule.')).toBe(true);
    });

    it('should render spirit animal subtitle with title and reason', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: {
          emoji: '🐘',
          name: 'Elefant',
          title: 'Wortgewaltige:r Redner:in',
          reason: 'Mit 45.000 Wörtern eine:r der redefreudigsten Abgeordneten.',
        },
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasSubtitle = fillTextCalls.some(
        (c: unknown[]) => c[0] === 'Wortgewaltige:r Redner:in: Mit 45.000 Wörtern eine:r der redefreudigsten Abgeordneten.'
      );
      expect(hasSubtitle).toBe(true);
    });

    it('should render signature word', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: null,
        signatureWord: { word: 'Standortfördergesetz', ratioParty: 5, ratioBundestag: 8 },
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasSignatureWord = fillTextCalls.some(
        (call: unknown[]) => call[0] === 'Standortfördergesetz.'
      );
      expect(hasSignatureWord).toBe(true);
    });

    it('should render signature word label', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: null,
        signatureWord: { word: 'Standortfördergesetz', ratioParty: 5, ratioBundestag: 8 },
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      // White label text (with trailing space before pink word)
      expect(fillTextCalls.some((c: unknown[]) => c[0] === 'Dein Signaturwort ist ')).toBe(true);
    });

    it('should render signature word ratio stats', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: null,
        signatureWord: { word: 'Standortfördergesetz', ratioParty: 5, ratioBundestag: 8 },
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasRatioText = fillTextCalls.some(
        (call: unknown[]) => call[0] === '5× häufiger als deine Fraktion'
      );
      expect(hasRatioText).toBe(true);
    });

    it('should not render signature section when no signature word', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: null,
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasLabel = fillTextCalls.some(
        (call: unknown[]) => call[0] === 'Dein Signaturwort ist '
      );
      expect(hasLabel).toBe(false);
    });

    it('should render footer CTA', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: null,
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasQuestion = fillTextCalls.some(
        (call: unknown[]) => call[0] === 'Du willst auch dein Spirit Animal und Signaturwort kennen?'
      );
      const hasAnswer = fillTextCalls.some(
        (call: unknown[]) => call[0] === 'Finde dein eigenes Wrapped auf '
      );
      const hasUrl = fillTextCalls.some(
        (call: unknown[]) => call[0] === 'bundestag-wrapped.de'
      );
      expect(hasQuestion).toBe(true);
      expect(hasAnswer).toBe(true);
      expect(hasUrl).toBe(true);
    });

    it('should handle complete speaker data with all fields', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: {
          emoji: '🐘',
          name: 'Elefant',
          title: 'Wortgewaltige:r Redner:in',
          reason: 'Mit 45.000 Wörtern eine:r der redefreudigsten Abgeordneten.',
        },
        signatureWord: { word: 'Standortfördergesetz', ratioParty: 5, ratioBundestag: 8 },
      };

      renderSpeakerShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;

      // Should have all elements (with periods)
      expect(fillTextCalls.some((c: unknown[]) => c[0] === '🐘')).toBe(true);
      expect(fillTextCalls.some((c: unknown[]) => c[0] === 'Spirit Animal')).toBe(true);
      expect(fillTextCalls.some((c: unknown[]) => c[0] === 'Elefant.')).toBe(true);
      expect(fillTextCalls.some((c: unknown[]) => c[0] === 'Standortfördergesetz.')).toBe(true);
    });

    it('should draw decorative orbs', () => {
      const data: SpeakerShareData = {
        name: 'Lars Klingbeil',
        party: 'SPD',
        spiritAnimal: null,
        signatureWord: null,
      };

      renderSpeakerShareImage(mockCanvas, data);

      // Decorative orbs use radial gradients
      expect(mockCtx.createRadialGradient).toHaveBeenCalled();
      // Should have multiple arc calls for orbs
      expect(mockCtx.arc).toHaveBeenCalled();
    });
  });

  describe('getResponsiveFontSize', () => {
    it('should return start size if text fits', () => {
      const ctx = createMockContext();
      (ctx.measureText as ReturnType<typeof vi.fn>).mockReturnValue({ width: 800 });

      const fontSize = getResponsiveFontSize(ctx, 'Short', 900, 64, 40);

      expect(fontSize).toBe(64);
    });

    it('should reduce font size for long text', () => {
      const ctx = createMockContext();
      let callCount = 0;
      (ctx.measureText as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        // First few calls return wide, then fits at smaller size
        return { width: callCount <= 3 ? 1000 : 800 };
      });

      const fontSize = getResponsiveFontSize(ctx, 'VeryLongGermanWord', 900, 64, 40);

      // Should have reduced from 64 by steps of 4
      expect(fontSize).toBeLessThan(64);
      expect(fontSize).toBeGreaterThanOrEqual(40);
    });

    it('should not go below minimum size', () => {
      const ctx = createMockContext();
      (ctx.measureText as ReturnType<typeof vi.fn>).mockReturnValue({ width: 2000 });

      const fontSize = getResponsiveFontSize(ctx, 'ExtremelyLongWord', 900, 64, 40);

      expect(fontSize).toBe(40);
    });
  });

  describe('downloadSpeakerShareImage', () => {
    it('should call toBlob on canvas', () => {
      downloadSpeakerShareImage(mockCanvas, 'Lars Klingbeil');
      expect(mockCanvas.toBlob).toHaveBeenCalled();
    });

    it('should create download link with slugified name', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const mockLink = { href: '', download: '', click: vi.fn() };
      createElementSpy.mockReturnValue(mockLink as unknown as HTMLAnchorElement);

      const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');

      downloadSpeakerShareImage(mockCanvas, 'Lars Klingbeil');

      expect(mockLink.download).toBe('bundestag-wrapped-lars-klingbeil.png');

      createElementSpy.mockRestore();
      revokeObjectURL.mockRestore();
      createObjectURL.mockRestore();
    });

    it('should handle German umlauts in filename', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const mockLink = { href: '', download: '', click: vi.fn() };
      createElementSpy.mockReturnValue(mockLink as unknown as HTMLAnchorElement);

      const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');

      downloadSpeakerShareImage(mockCanvas, 'Jürgen Müller');

      expect(mockLink.download).toBe('bundestag-wrapped-juergen-mueller.png');

      createElementSpy.mockRestore();
      revokeObjectURL.mockRestore();
      createObjectURL.mockRestore();
    });
  });
});

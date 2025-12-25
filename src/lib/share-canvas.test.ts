import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderShareImage, downloadShareImage, type ShareImageData } from './share-canvas';

// Mock canvas context with all required methods
function createMockContext(): CanvasRenderingContext2D {
  const mockGradient = {
    addColorStop: vi.fn(),
  };
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
    save: vi.fn(),
    restore: vi.fn(),
    clip: vi.fn(),
    closePath: vi.fn(),
    drawImage: vi.fn(),
    createLinearGradient: vi.fn(() => mockGradient),
    createRadialGradient: vi.fn(() => mockGradient),
    measureText: vi.fn(() => ({ width: 100 })),
    // Properties
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    font: '',
    globalAlpha: 1,
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
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

describe('share-canvas', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockCtx = createMockContext();
    mockCanvas = createMockCanvas(mockCtx);
  });

  describe('renderShareImage', () => {
    it('should set canvas dimensions to 1080x1080', () => {
      const data: ShareImageData = {
        correctCount: 10,
        totalQuestions: 14,
      };

      renderShareImage(mockCanvas, data);

      expect(mockCanvas.width).toBe(1080);
      expect(mockCanvas.height).toBe(1080);
    });

    it('should call getContext with 2d', () => {
      const data: ShareImageData = {
        correctCount: 10,
        totalQuestions: 14,
      };

      renderShareImage(mockCanvas, data);

      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    });

    it('should draw background gradient', () => {
      const data: ShareImageData = {
        correctCount: 10,
        totalQuestions: 14,
      };

      renderShareImage(mockCanvas, data);

      expect(mockCtx.createLinearGradient).toHaveBeenCalled();
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 1080, 1080);
    });

    it('should render text elements', () => {
      const data: ShareImageData = {
        correctCount: 10,
        totalQuestions: 14,
      };

      renderShareImage(mockCanvas, data);

      // Should have multiple fillText calls (emoji, title, score, etc.)
      expect(mockCtx.fillText).toHaveBeenCalled();
      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;

      // Check for score text
      const hasScoreText = fillTextCalls.some(
        (call: unknown[]) => call[0] === '10/14'
      );
      expect(hasScoreText).toBe(true);
    });

    it('should include user name when provided', () => {
      const data: ShareImageData = {
        correctCount: 10,
        totalQuestions: 14,
        userName: 'Max',
      };

      renderShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasUserName = fillTextCalls.some(
        (call: unknown[]) => typeof call[0] === 'string' && call[0].includes('Max')
      );
      expect(hasUserName).toBe(true);
    });

    it('should not include user name section when empty string', () => {
      const data: ShareImageData = {
        correctCount: 10,
        totalQuestions: 14,
        userName: '',
      };

      renderShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasErgebnisText = fillTextCalls.some(
        (call: unknown[]) => typeof call[0] === 'string' && call[0].includes('Ergebnis')
      );
      expect(hasErgebnisText).toBe(false);
    });

    it('should trim whitespace from user name', () => {
      const data: ShareImageData = {
        correctCount: 10,
        totalQuestions: 14,
        userName: '  Max  ',
      };

      renderShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      // Should use trimmed name in the "Max, du bist" line
      const userNameCall = fillTextCalls.find(
        (call: unknown[]) => typeof call[0] === 'string' && call[0].includes('Max')
      );
      expect(userNameCall?.[0]).toBe('Max, du bist');
    });

    it('should draw decorative orbs using arc', () => {
      const data: ShareImageData = {
        correctCount: 7,
        totalQuestions: 14,
      };

      renderShareImage(mockCanvas, data);

      // Arc is used for decorative orbs
      expect(mockCtx.arc).toHaveBeenCalled();
    });

    it('should display score as fraction', () => {
      const data: ShareImageData = {
        correctCount: 7,
        totalQuestions: 14,
      };

      renderShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasScore = fillTextCalls.some(
        (call: unknown[]) => call[0] === '7/14'
      );
      expect(hasScore).toBe(true);
    });

    it('should show Polit-Legende for 80%+ score', () => {
      const data: ShareImageData = {
        correctCount: 12,
        totalQuestions: 14,
      };

      renderShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasTitle = fillTextCalls.some(
        (call: unknown[]) => typeof call[0] === 'string' && call[0].includes('Polit-Legende!')
      );
      expect(hasTitle).toBe(true);
    });

    it('should show Demokratie-Star for 60-79% score', () => {
      const data: ShareImageData = {
        correctCount: 9,
        totalQuestions: 14,
      };

      renderShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasTitle = fillTextCalls.some(
        (call: unknown[]) => typeof call[0] === 'string' && call[0].includes('Demokratie-Star!')
      );
      expect(hasTitle).toBe(true);
    });

    it('should show Politik-Talent for 40-59% score', () => {
      const data: ShareImageData = {
        correctCount: 6,
        totalQuestions: 14,
      };

      renderShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasTitle = fillTextCalls.some(
        (call: unknown[]) => typeof call[0] === 'string' && call[0].includes('Politik-Talent!')
      );
      expect(hasTitle).toBe(true);
    });

    it('should show Rising Star for <40% score', () => {
      const data: ShareImageData = {
        correctCount: 3,
        totalQuestions: 14,
      };

      renderShareImage(mockCanvas, data);

      const fillTextCalls = (mockCtx.fillText as ReturnType<typeof vi.fn>).mock.calls;
      const hasTitle = fillTextCalls.some(
        (call: unknown[]) => typeof call[0] === 'string' && call[0].includes('Rising Star!')
      );
      expect(hasTitle).toBe(true);
    });
  });

  describe('downloadShareImage', () => {
    it('should call toBlob on canvas', () => {
      downloadShareImage(mockCanvas);
      expect(mockCanvas.toBlob).toHaveBeenCalled();
    });

    it('should include user name in filename when provided', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const mockLink = { href: '', download: '', click: vi.fn() };
      createElementSpy.mockReturnValue(mockLink as unknown as HTMLAnchorElement);

      const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');

      downloadShareImage(mockCanvas, 'Max');

      // Wait for the toBlob callback
      expect(mockLink.download).toBe('bundestag-wrapped-2025-max.png');

      createElementSpy.mockRestore();
      revokeObjectURL.mockRestore();
      createObjectURL.mockRestore();
    });
  });
});

/**
 * Mobile Components
 *
 * Main component exports for the mobile app.
 */

// Wrapped experience (native implementation)
export { WrappedExperience } from './WrappedExperience';
export { NativeSlideController } from './NativeSlideController';
export { SlideRenderer, SLIDES, TOTAL_QUIZ_QUESTIONS, type SlideType } from './SlideRenderer';

// Legacy DOM-based (kept for fallback)
export { SlideController } from './SlideController';

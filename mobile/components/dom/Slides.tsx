// @ts-nocheck
// TypeScript checking is disabled because this file uses expo-dom's 'use dom'
// directive which runs in a web context with different module resolution.
'use dom';

/**
 * DOM Components Wrapper for Expo
 *
 * This file uses the 'use dom' directive to run web React components
 * inside a native WebView context. All imports from @/ are resolved
 * by Metro to ../src/ (the web codebase).
 *
 * These components run in web context with full access to:
 * - Motion (framer-motion) animations
 * - Tailwind CSS classes
 * - localStorage (for progress persistence)
 * - All web APIs
 */

// Import web CSS for TailwindCSS classes and custom theme
// Using relative path because DOM bundler doesn't resolve @/ alias for CSS
import '../../../src/index.css';

// Re-export MobileWrappedPage from web codebase as default export
// 'use dom' only supports single default exports
import { MobileWrappedPage } from '@/components/MobileWrappedPage';
export default MobileWrappedPage;

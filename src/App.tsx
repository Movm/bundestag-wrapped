import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { DarkLayout, LightLayout } from '@/layouts/MainLayout';
import { MobileMenu } from '@/components/ui/MobileMenu';
import { useMenuState } from '@/hooks/useMenuState';

// Critical path - keep eager
import { MainWrappedPage } from '@/components/MainWrappedPage';
import { SpeakerWrappedPage } from '@/components/SpeakerWrappedPage';

// Lazy-loaded routes for smaller initial bundle
const DatenschutzPage = lazy(() => import('@/components/DatenschutzPage').then(m => ({ default: m.DatenschutzPage })));
const DokumentationPage = lazy(() => import('@/components/DokumentationPage').then(m => ({ default: m.DokumentationPage })));
// TODO: Re-enable when statistiken is ready
// const StatistikenPage = lazy(() => import('@/components/StatistikenPage').then(m => ({ default: m.StatistikenPage })));
const SuchePage = lazy(() => import('@/components/SuchePage').then(m => ({ default: m.SuchePage })));
const AbgeordnetePage = lazy(() => import('@/components/AbgeordnetePage').then(m => ({ default: m.AbgeordnetePage })));

function PageLoader() {
  return (
    <div className="min-h-screen page-bg flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🏛️</div>
        <p className="text-white/60">Lade...</p>
      </div>
    </div>
  );
}

// Special wrapper for MainWrappedPage which manages its own header
function MainWrappedRoute() {
  const { isOpen: isMenuOpen, toggle: toggleMenu, close: closeMenu } = useMenuState();

  return (
    <>
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} variant="dark" />
      <MainWrappedPage isMenuOpen={isMenuOpen} onMenuToggle={toggleMenu} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Main page has special header behavior (scroll-based visibility) */}
          <Route path="/" element={<MainWrappedRoute />} />

          {/* Dark theme routes */}
          <Route element={<DarkLayout />}>
            <Route path="/wrapped/:slug" element={<SpeakerWrappedPage />} />
            <Route path="/suche" element={<SuchePage />} />
            <Route path="/reden" element={<SuchePage />} />
            <Route path="/abgeordnete" element={<AbgeordnetePage />} />
            {/* TODO: Re-enable when statistiken is ready */}
            {/* <Route path="/statistiken" element={<StatistikenPage />} /> */}
          </Route>

          {/* Light theme routes */}
          <Route element={<LightLayout />}>
            <Route path="/datenschutz" element={<DatenschutzPage />} />
            <Route path="/dokumentation" element={<DokumentationPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

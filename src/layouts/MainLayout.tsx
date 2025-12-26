import { Outlet } from 'react-router';
import { Header } from '@/components/ui/Header';
import { MobileMenu } from '@/components/ui/MobileMenu';
import { TabNavigation } from '@/components/ui/TabNavigation';
import { SkipLink } from '@/components/ui/SkipLink';
import { useMenuState } from '@/hooks/useMenuState';
import { isNative } from '@/lib/capacitor';

interface MainLayoutProps {
  variant?: 'dark' | 'light';
}

export function MainLayout({ variant = 'dark' }: MainLayoutProps) {
  const { isOpen: isMenuOpen, toggle: toggleMenu, close: closeMenu } = useMenuState();

  return (
    <>
      <SkipLink />
      {/* Hide header on native - use tab navigation instead */}
      {!isNative() && (
        <Header variant={variant} isMenuOpen={isMenuOpen} onMenuToggle={toggleMenu} />
      )}
      {/* Show drawer menu on web, tab navigation on native */}
      {!isNative() && (
        <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} variant={variant} />
      )}
      <main id="main-content" className={isNative() ? 'pb-20' : ''}>
        <Outlet />
      </main>
      <TabNavigation />
    </>
  );
}

export function DarkLayout() {
  return <MainLayout variant="dark" />;
}

export function LightLayout() {
  return <MainLayout variant="light" />;
}

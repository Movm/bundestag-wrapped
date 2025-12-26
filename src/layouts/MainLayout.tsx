import { Outlet } from 'react-router';
import { Header } from '@/components/ui/Header';
import { MobileMenu } from '@/components/ui/MobileMenu';
import { SkipLink } from '@/components/ui/SkipLink';
import { useMenuState } from '@/hooks/useMenuState';

interface MainLayoutProps {
  variant?: 'dark' | 'light';
}

export function MainLayout({ variant = 'dark' }: MainLayoutProps) {
  const { isOpen: isMenuOpen, toggle: toggleMenu, close: closeMenu } = useMenuState();

  return (
    <>
      <SkipLink />
      <Header variant={variant} isMenuOpen={isMenuOpen} onMenuToggle={toggleMenu} />
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} variant={variant} />
      <main id="main-content">
        <Outlet />
      </main>
    </>
  );
}

export function DarkLayout() {
  return <MainLayout variant="dark" />;
}

export function LightLayout() {
  return <MainLayout variant="light" />;
}

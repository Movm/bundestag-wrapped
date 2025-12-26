import { Link, useLocation } from 'react-router';
import { Home, Users, Search, FileText } from 'lucide-react';
import { isNative } from '@/lib/capacitor';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/abgeordnete', label: 'Abgeordnete', icon: Users },
  { path: '/suche', label: 'Suche', icon: Search },
  { path: '/dokumentation', label: 'Doku', icon: FileText },
];

export function TabNavigation() {
  const location = useLocation();

  // Only render on native platforms
  if (!isNative()) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 tab-navigation">
      <div className="flex items-center justify-around h-16 bg-[#0a0a0f] border-t border-white/10">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/' || location.pathname.startsWith('/wrapped/')
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-pink-500'
                  : 'text-white/50 active:text-white/70'
              }`}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className="mb-1"
              />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-pink-500 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for gesture navigation */}
      <div className="h-[env(safe-area-inset-bottom)] bg-[#0a0a0f]" />
    </nav>
  );
}

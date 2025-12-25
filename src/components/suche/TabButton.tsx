interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  controls?: string;
}

export function TabButton({ active, onClick, children, controls }: TabButtonProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-pink-600 text-white'
          : 'bg-white/10 text-white/70 hover:bg-white/20'
      }`}
    >
      {children}
    </button>
  );
}

interface SpeechTypeBadgeProps {
  type: string;
  category?: 'rede' | 'wortbeitrag';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const TYPE_LABELS: Record<string, string> = {
  rede: 'Rede',
  fragestunde: 'Fragestunde',
  fragestunde_antwort: 'Antwort',
  befragung: 'Befragung',
  zwischenfrage: 'Zwischenfrage',
  kurzintervention: 'Kurzintervention',
  abstimmung: 'Abstimmung',
  statement: 'Statement',
  protokoll: 'Protokoll',
  sonstiges: 'Sonstiges',
};

const CATEGORY_CONFIG = {
  rede: {
    color: '#F59E0B', // Amber
    label: 'Rede',
    icon: null,
  },
  wortbeitrag: {
    color: '#0EA5E9', // Sky
    label: 'Wortbeitrag',
    icon: null,
  },
};

export function SpeechTypeBadge({
  type,
  category,
  size = 'md',
  showLabel = true,
  className = '',
}: SpeechTypeBadgeProps) {
  // Determine category from type if not provided
  const effectiveCategory = category || (type === 'rede' ? 'rede' : 'wortbeitrag');
  const config = CATEGORY_CONFIG[effectiveCategory];
  const label = showLabel ? TYPE_LABELS[type] || config.label : config.label;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
        border: `1px solid ${config.color}40`,
      }}
    >
      {label}
    </span>
  );
}

// Compact badge showing just the category
export function CategoryBadge({
  category,
  size = 'sm',
  className = '',
}: {
  category: 'rede' | 'wortbeitrag';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const config = CATEGORY_CONFIG[category];

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded font-semibold uppercase tracking-wide ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
}

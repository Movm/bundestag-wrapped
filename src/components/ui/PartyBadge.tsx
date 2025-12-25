import { getPartyColor } from '@/lib/party-colors';

interface PartyBadgeProps {
  party: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PartyBadge({ party, size = 'md', className = '' }: PartyBadgeProps) {
  const color = getPartyColor(party);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`
      }}
    >
      {party}
    </span>
  );
}

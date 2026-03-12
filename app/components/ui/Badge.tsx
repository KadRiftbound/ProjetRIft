type BadgeVariant = "neutral" | "domain" | "tier" | "rarity" | "difficulty" | "meta";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  title?: string;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "bg-white/5 text-[var(--text-secondary)] border-white/10",
  domain: "bg-black/40 text-[var(--text-secondary)] border-white/10",
  tier: "bg-white text-black border-white font-black",
  rarity: "bg-white/5 text-[var(--text-tertiary)] border-white/10",
  difficulty: "bg-white/5 text-[var(--text-secondary)] border-white/10",
  meta: "bg-rift-blue/10 text-rift-blue border-rift-blue/20",
};

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full 
        text-[10px] font-black uppercase tracking-widest border
        transition-colors duration-200
        ${VARIANT_CLASSES[variant]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}

interface DomainBadgeProps {
  domain: string;
  size?: 'sm' | 'md';
  className?: string;
}

const DOMAIN_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Fury: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  Calm: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  Mind: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  Body: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  Chaos: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  Order: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
};

export function DomainBadge({ domain, size = 'sm', className = '' }: DomainBadgeProps) {
  const style = DOMAIN_STYLES[domain] || DOMAIN_STYLES.Fury;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[7px]' : 'px-3 py-1 text-[9px]';

  return (
    <span
      className={`
        inline-flex items-center rounded font-black uppercase tracking-widest border
        ${style.bg} ${style.text} ${style.border}
        ${sizeClasses}
        ${className}
      `.trim()}
    >
      {domain}
    </span>
  );
}

interface TierBadgeProps {
  tier: string;
  size?: 'sm' | 'md' | 'lg';
  showShadow?: boolean;
  className?: string;
}

const TIER_STYLES: Record<string, { bg: string; text: string; shadow?: string }> = {
  S: { bg: 'bg-red-600', text: 'text-white', shadow: 'shadow-[0_0_16px_rgba(220,38,38,0.5)]' },
  A: { bg: 'bg-orange-500', text: 'text-white', shadow: 'shadow-[0_0_16px_rgba(249,115,22,0.5)]' },
  B: { bg: 'bg-yellow-500', text: 'text-black', shadow: 'shadow-[0_0_16px_rgba(234,179,8,0.5)]' },
  C: { bg: 'bg-blue-500', text: 'text-white', shadow: 'shadow-[0_0_16px_rgba(59,130,246,0.5)]' },
  D: { bg: 'bg-gray-500', text: 'text-white' },
  'S+': { bg: 'bg-red-600', text: 'text-white', shadow: 'shadow-[0_0_16px_rgba(220,38,38,0.5)]' },
  'S-': { bg: 'bg-orange-400', text: 'text-white', shadow: 'shadow-[0_0_16px_rgba(249,115,22,0.5)]' },
};

export function TierBadge({ tier, size = 'md', showShadow = true, className = '' }: TierBadgeProps) {
  const style = TIER_STYLES[tier] || TIER_STYLES.C;
  const sizeClasses = {
    sm: 'w-6 h-6 text-[8px] rounded-lg',
    md: 'w-8 h-8 text-[10px] rounded-xl',
    lg: 'w-12 h-12 text-sm rounded-2xl',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center font-black
        ${style.bg} ${style.text}
        ${showShadow && style.shadow ? style.shadow : ''}
        ${sizeClasses[size]}
        ${className}
      `.trim()}
    >
      {tier}
    </span>
  );
}

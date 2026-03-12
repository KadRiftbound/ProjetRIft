type CardPanelVariant = 'default' | 'elevated' | 'subtle' | 'interactive';
type CardPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardPanelVariant;
  glow?: boolean;
  hoverable?: boolean;
};

const VARIANT_STYLES: Record<CardPanelVariant, string> = {
  default: 'bg-[var(--surface-3)] border-[var(--border-subtle)]',
  elevated: 'bg-[var(--surface-2)] border-[var(--border-default)] shadow-[var(--shadow-2xl)]',
  subtle: 'bg-[var(--surface-2)]/50 border-[var(--border-subtle)]',
  interactive: 'bg-[var(--surface-3)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:-translate-y-1 transition-all duration-300',
};

export function CardPanel({ 
  children, 
  className = "", 
  variant = 'default',
  glow = false, 
  hoverable = false,
  ...rest 
}: CardPanelProps) {
  const baseClasses = VARIANT_STYLES[variant];
  const hoverClasses = hoverable 
    ? 'cursor-pointer hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lg)]' 
    : '';

  return (
    <div
      className={`
        relative rounded-[var(--radius-xl)] border shadow-[var(--shadow-xl)]
        ${baseClasses}
        ${hoverClasses}
        ${glow ? 'overflow-hidden' : ''}
        ${className}
      `.trim()}
      {...rest}
    >
      {glow && (
        <>
          <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-rift-blue/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-rift-gold/10 blur-[80px]" />
        </>
      )}
      <div className={glow ? "relative" : ""}>{children}</div>
    </div>
  );
}

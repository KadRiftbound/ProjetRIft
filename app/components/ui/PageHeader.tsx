type PageHeaderProps = {
  eyebrow?: string;
  eyebrowVariant?: 'blue' | 'purple' | 'gold' | 'red' | 'neutral';
  eyebrowClassName?: string;
  title: string;
  titleAccent?: string;
  accentClassName?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

const EYEBROW_VARIANTS = {
  blue: 'bg-rift-blue/10 border-rift-blue/20 text-rift-blue',
  purple: 'bg-rift-purple/10 border-rift-purple/20 text-rift-purple',
  gold: 'bg-rift-gold/10 border-rift-gold/20 text-rift-gold',
  red: 'bg-rift-red/10 border-rift-red/20 text-rift-red',
  neutral: 'bg-white/5 border-white/10 text-gray-400',
};

export function PageHeader({
  eyebrow,
  eyebrowVariant = 'blue',
  eyebrowClassName = '',
  title,
  titleAccent,
  accentClassName = 'text-rift-blue',
  description,
  subtitle,
  align = "center",
  className = "",
  actions,
}: PageHeaderProps) {
  const isCentered = align === "center";
  const eyebrowClasses = eyebrowClassName || EYEBROW_VARIANTS[eyebrowVariant];
  const accentClasses = accentClassName;

  return (
    <div className={`${isCentered ? "text-center" : "text-left"} ${className}`.trim()}>
      {eyebrow && (
        <div
          className={`
            inline-flex items-center px-5 py-2 mb-8
            rounded-full border backdrop-blur-md
            text-[11px] font-bold tracking-[0.25em] uppercase
            ${eyebrowClasses}
          `.trim()}
        >
          {eyebrow}
        </div>
      )}

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight uppercase leading-[0.92]">
        {title}
        {titleAccent && (
          <span className={`italic ${accentClasses}`}>{titleAccent}</span>
        )}
      </h1>

      {subtitle && (
        <p className="text-lg md:text-xl font-semibold text-white/90 mb-6 tracking-wide">
          {subtitle}
        </p>
      )}

      {description && (
        <p
          className={`
            text-base md:text-lg text-[var(--text-secondary)] max-w-2xl font-normal leading-relaxed
            ${isCentered ? "mx-auto" : ""}
          `.trim()}
        >
          {description}
        </p>
      )}

      {actions && (
        <div className={`mt-8 flex gap-4 flex-wrap ${isCentered ? 'justify-center' : ''}`}>
          {actions}
        </div>
      )}
    </div>
  );
}

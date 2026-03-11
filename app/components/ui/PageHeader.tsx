type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  eyebrowClassName?: string;
  accentClassName?: string;
  subtitle?: string;
};

export function PageHeader({
  eyebrow,
  title,
  titleAccent,
  description,
  subtitle,
  align = "center",
  className = "",
  eyebrowClassName = "",
  accentClassName = "text-rift-blue",
}: PageHeaderProps) {
  const isCentered = align === "center";

  return (
    <div className={`${isCentered ? "text-center" : "text-left"} ${className}`.trim()}>
      {eyebrow && (
        <div
          className={`
            inline-flex items-center px-5 py-2 mb-8
            rounded-full bg-rift-blue/10 border border-rift-blue/20
            backdrop-blur-md
            ${eyebrowClassName}
          `.trim()}
        >
          <span className="text-[11px] font-bold tracking-[0.25em] text-rift-blue uppercase leading-none">
            {eyebrow}
          </span>
        </div>
      )}

      <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight uppercase leading-[0.92] font-[family-name:var(--font-cinzel),serif]">
        {title}{" "}
        {titleAccent && (
          <span className={`${accentClassName} font-[family-name:var(--font-cinzel),serif]`}>{titleAccent}</span>
        )}
      </h1>

      {subtitle && (
        <p className="text-xl md:text-2xl font-semibold text-white/90 mb-6 tracking-wide">
          {subtitle}
        </p>
      )}

      {description && (
        <p
          className={`
            text-base md:text-lg text-gray-300 max-w-2xl font-normal leading-relaxed
            ${isCentered ? "mx-auto" : ""}
          `.trim()}
        >
          {description}
        </p>
      )}
    </div>
  );
}

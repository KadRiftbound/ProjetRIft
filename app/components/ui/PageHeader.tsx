type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  eyebrowClassName?: string;
  accentClassName?: string;
};

export function PageHeader({
  eyebrow,
  title,
  titleAccent,
  description,
  align = "center",
  className = "",
  eyebrowClassName = "",
  accentClassName = "text-rift-gold italic",
}: PageHeaderProps) {
  const isCentered = align === "center";

  return (
    <div className={`${isCentered ? "text-center" : "text-left"} ${className}`.trim()}>
      {eyebrow && (
        <div
          className={`
            inline-flex items-center px-4 py-1.5 mb-6
            rounded-full bg-white/5 border border-white/10
            backdrop-blur-md
            ${eyebrowClassName}
          `.trim()}
        >
          <span className="text-[10px] font-black tracking-[0.3em] text-rift-gold uppercase leading-none">
            {eyebrow}
          </span>
        </div>
      )}

      <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.95]">
        {title}{" "}
        {titleAccent && (
          <span className={accentClassName}>{titleAccent}</span>
        )}
      </h1>

      {description && (
        <p
          className={`
            text-lg text-gray-400 max-w-2xl font-medium leading-relaxed
            ${isCentered ? "mx-auto" : ""}
          `.trim()}
        >
          {description}
        </p>
      )}
    </div>
  );
}

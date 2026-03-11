type SectionTitleProps = {
  children: React.ReactNode;
  className?: string;
  lineClassName?: string;
};

export function SectionTitle({
  children,
  className = "",
  lineClassName = "bg-gradient-to-r from-rift-gold/50 to-transparent",
}: SectionTitleProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`.trim()}>
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{children}</h2>
      <div className={`h-px flex-1 ${lineClassName}`.trim()} />
    </div>
  );
}

type CardPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

export function CardPanel({ children, className = "", glow = false, ...rest }: CardPanelProps) {
  return (
    <div
      className={`relative bg-[var(--surface-3)] rounded-[var(--radius-xl)] border border-[var(--border-subtle)] shadow-[var(--shadow-xl)] ${
        glow ? "overflow-hidden" : ""
      } ${className}`.trim()}
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

type BadgeVariant = "neutral" | "domain" | "tier" | "category" | "rarity";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  title?: string;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "bg-white/5 text-gray-300 border-white/10",
  domain: "bg-black/40 text-gray-200 border-white/10",
  tier: "bg-white text-black border-white",
  category: "bg-white/5 text-gray-300 border-white/10",
  rarity: "bg-white/5 text-gray-300 border-white/10",
};

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
        VARIANT_CLASSES[variant]
      } ${className}`.trim()}
    >
      {children}
    </span>
  );
}

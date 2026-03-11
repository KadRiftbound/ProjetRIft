type EmptyStateProps = {
  message: string;
  icon?: string;
  className?: string;
};

export function EmptyState({ message, icon, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`text-center py-32 bg-[var(--surface-2)] rounded-[var(--radius-2xl)] border border-[var(--border-subtle)] ${className}`.trim()}
    >
      {icon && <div className="text-4xl mb-4 opacity-40">{icon}</div>}
      <p className="text-[var(--text-tertiary)] text-xl font-medium">{message}</p>
    </div>
  );
}

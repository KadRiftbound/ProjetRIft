type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        className={`animate-spin ${sizeClasses[size]}`} 
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4" 
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
        />
      </svg>
    </div>
  );
}

type LoadingPageProps = {
  message?: string;
};

export function LoadingPage({ message = 'Chargement...' }: LoadingPageProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" className="text-rift-blue mb-4" />
      <p className="text-[var(--text-secondary)] font-medium">{message}</p>
    </div>
  );
}

type LoadingCardProps = {
  className?: string;
};

export function LoadingCard({ className = '' }: LoadingCardProps) {
  return (
    <div className={`animate-pulse bg-[var(--border-subtle)] rounded-[var(--radius-xl)] ${className}`} />
  );
}

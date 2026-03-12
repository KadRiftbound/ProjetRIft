import { ButtonHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold' | 'purple' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-rift-blue text-rift-dark font-bold
    hover:bg-rift-cyan hover:scale-[1.02]
    active:scale-[0.98]
    shadow-[var(--shadow-lg)] hover:shadow-[var(--glow-blue)]
  `,
  secondary: `
    bg-white text-black font-bold
    hover:bg-gray-100 hover:scale-[1.02]
    active:scale-[0.98]
    shadow-[var(--shadow-lg)]
  `,
  outline: `
    bg-transparent text-white font-bold
    border border-[var(--border-default)]
    hover:bg-[var(--border-subtle)] hover:border-[var(--border-strong)]
    active:scale-[0.98]
  `,
  ghost: `
    bg-transparent text-gray-300 font-bold
    hover:text-white hover:bg-white/5
    active:scale-[0.98]
  `,
  danger: `
    bg-rift-red text-white font-bold
    hover:bg-red-600 hover:scale-[1.02]
    active:scale-[0.98]
    shadow-[var(--shadow-md)]
  `,
  gold: `
    bg-rift-gold text-black font-bold
    hover:bg-yellow-500 hover:scale-[1.02]
    active:scale-[0.98]
    shadow-[var(--glow-gold)]
  `,
  purple: `
    bg-rift-purple text-white font-bold
    hover:bg-purple-500 hover:scale-[1.02]
    active:scale-[0.98]
    shadow-[var(--shadow-lg)] hover:shadow-[var(--glow-purple)]
  `,
  gradient: `
    bg-gradient-to-br from-rift-purple/20 to-rift-blue/20 text-white font-bold
    border border-[var(--border-subtle)]
    hover:border-[var(--border-default)] hover:scale-[1.02]
    active:scale-[0.98]
    shadow-[var(--shadow-2xl)]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs rounded-lg tracking-wider',
  md: 'px-6 py-3 text-sm rounded-xl tracking-widest',
  lg: 'px-8 py-4 text-base rounded-2xl tracking-widest',
  xl: 'px-14 py-8 text-lg rounded-[32px] tracking-[0.1em]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    href,
    className = '', 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center gap-2
      font-bold uppercase tracking-widest
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rift-blue focus-visible:ring-offset-2 focus-visible:ring-offset-rift-dark
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `.trim();

    if (href) {
      return (
        <Link 
          href={href}
          className={baseClasses}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Chargement...</span>
            </>
          ) : children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={baseClasses}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Chargement...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'outline' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  label: string;
}

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-2xl',
  xl: 'w-16 h-16 rounded-3xl',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, variant = 'ghost', size = 'md', label, className = '', ...props }, ref) => {
    const variantClasses = {
      ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10',
      outline: 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-rift-blue/50 hover:bg-white/10',
      primary: 'bg-rift-blue text-rift-dark hover:bg-rift-cyan',
    };

    return (
      <button
        ref={ref}
        aria-label={label}
        className={`
          inline-flex items-center justify-center
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rift-blue focus-visible:ring-offset-2 focus-visible:ring-offset-rift-dark
          disabled:opacity-50 disabled:cursor-not-allowed
          ${iconSizeStyles[size]}
          ${variantClasses[variant]}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

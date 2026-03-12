import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 
            bg-[var(--surface-2)] border rounded-xl
            text-white placeholder-gray-500
            text-sm font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-rift-blue/50 focus:border-rift-blue
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error 
              ? 'border-rift-red focus:ring-rift-red/50 focus:border-rift-red' 
              : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]'
            }
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-2 text-xs text-rift-red">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-2 text-xs text-[var(--text-tertiary)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={selectId} 
            className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full px-4 py-3 pr-10
              bg-[var(--surface-2)] border rounded-xl
              text-white
              text-sm font-medium
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-rift-blue/50 focus:border-rift-blue
              disabled:opacity-50 disabled:cursor-not-allowed
              appearance-none cursor-pointer
              ${error 
                ? 'border-rift-red focus:ring-rift-red/50 focus:border-rift-red' 
                : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]'
              }
              ${className}
            `.trim()}
            {...props}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[var(--surface-2)]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-xs text-rift-red">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId} 
            className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-4 py-3 
            bg-[var(--surface-2)] border rounded-xl
            text-white placeholder-gray-500
            text-sm font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-rift-blue/50 focus:border-rift-blue
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${error 
              ? 'border-rift-red focus:ring-rift-red/50 focus:border-rift-red' 
              : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]'
            }
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-2 text-xs text-rift-red">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

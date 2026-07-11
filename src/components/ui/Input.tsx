import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...rest }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-black/70">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-black placeholder:text-black/30 outline-none transition-colors duration-200 focus:border-black/40 ${
            error ? 'border-red-400 focus:border-red-500' : ''
          } ${className}`}
          {...rest}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

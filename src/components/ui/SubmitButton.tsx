import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function SubmitButton({ children, isLoading, disabled, className = '', ...rest }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`w-full inline-flex items-center justify-center gap-2 bg-black text-white text-base font-medium py-3 rounded-full transition-colors duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

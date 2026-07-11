import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-black text-white hover:bg-gray-800',
  secondary: 'bg-white text-black border border-black/10 hover:bg-black/5',
  ghost: 'bg-transparent text-black/70 hover:text-black hover:bg-black/5',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm px-4 py-1.5',
  md: 'text-base px-5 py-2.5',
};

export function Button({ variant = 'secondary', size = 'md', className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}

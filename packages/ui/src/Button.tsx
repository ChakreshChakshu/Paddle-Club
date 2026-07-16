import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-brand-court text-white hover:bg-brand-court-light focus:ring-brand-court',
      secondary: 'bg-brand-cafe text-white hover:bg-brand-cafe-light focus:ring-brand-cafe',
      outline: 'border-2 border-brand-dark-border text-slate-100 hover:bg-brand-dark-card focus:ring-brand-dark-border',
      ghost: 'text-slate-400 hover:text-slate-100 hover:bg-brand-dark-card focus:ring-brand-dark-border',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedClassName}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

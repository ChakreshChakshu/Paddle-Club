import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#010D00] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]';

    const variants = {
      // Cream pill with deep-forest text — the "light CTA on dark bg" pattern
      primary:   'bg-[#F2EBDC] text-[#010D00] hover:bg-[#fffaf2] focus:ring-[#F2EBDC] shadow-md shadow-black/30',
      // Sage with dark text — secondary action
      secondary: 'bg-[#7D8C82] text-[#010D00] hover:bg-[#8fa297] focus:ring-[#7D8C82]',
      // Outlined — cream border, cream text on transparent
      outline:   'border-2 border-[#F2EBDC]/30 text-[#F2EBDC] hover:bg-[#F2EBDC]/10 hover:border-[#F2EBDC]/60 focus:ring-[#F2EBDC]/40',
      // Ghost — sage text, subtle fill on hover
      ghost:     'text-[#7D8C82] hover:text-[#F2EBDC] hover:bg-[#16261C] focus:ring-[#7D8C82]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-700 hover:to-slate-800 focus:ring-slate-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
      secondary: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500 focus:ring-cyan-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
      accent: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500 focus:ring-amber-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
      success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 focus:ring-emerald-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

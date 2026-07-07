'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const baseStyles = clsx(
      'inline-flex items-center justify-center font-body font-semibold rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-border-brand focus:ring-offset-2 focus:ring-offset-bg-base disabled:opacity-40 disabled:cursor-not-allowed',
    );

    const variants = {
      primary:
        'bg-brand-primary text-text-primary hover:bg-brand-hover active:bg-brand-active shadow-raised',
      secondary:
        'bg-transparent border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary hover:bg-bg-hover',
      ghost: 'bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary',
      danger: 'bg-semantic-danger text-text-primary hover:bg-red-700 active:bg-red-800',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-5 text-sm gap-2',
      lg: 'h-12 px-7 text-base gap-2.5',
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
        disabled={disabled || isLoading}
        className={twMerge(baseStyles, variants[variant], sizes[size], className)}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
export default Button;

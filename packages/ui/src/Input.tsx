import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helpText, id, disabled, ...props }, ref) => {
    const inputId = id || `input-${React.useId()}`;
    const errorId = `${inputId}-error`;
    const helpId = `${inputId}-help`;

    return (
      <div className="flex flex-col w-full gap-1.5 font-body">
        {label && (
          <label htmlFor={inputId} className="text-label-md text-text-secondary">
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={clsx(error && errorId, helpText && helpId) || undefined}
          className={twMerge(
            clsx(
              'h-10 w-full px-3 text-body-sm bg-bg-subtle border border-border-default rounded-sm text-text-primary placeholder:text-text-placeholder transition-all duration-fast focus:outline-none focus:border-border-brand focus:ring-1 focus:ring-border-brand disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-semantic-danger focus:border-semantic-danger focus:ring-semantic-danger',
            ),
            className,
          )}
          {...props}
        />

        {error && (
          <span id={errorId} role="alert" className="text-body-xs text-semantic-danger">
            {error}
          </span>
        )}

        {!error && helpText && (
          <span id={helpId} className="text-body-xs text-text-muted">
            {helpText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;

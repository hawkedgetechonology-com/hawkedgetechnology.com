import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <select
          className={cn(
            "flex h-12 w-full appearance-none rounded-lg border bg-white px-4 py-2 text-sm text-foreground transition-colors placeholder:text-foreground/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus-visible:ring-red-500" : "border-border-color",
            className
          )}
          ref={ref}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom Chevron for select */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground/50">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

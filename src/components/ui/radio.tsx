import React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="radio"
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <div className={cn(
            "w-5 h-5 rounded-full border bg-white flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
            "peer-checked:border-primary",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            error ? "border-red-500" : "border-border-color",
            className
          )}>
            <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {label && (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{label}</span>
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
          </div>
        )}
      </label>
    );
  }
);
Radio.displayName = "Radio";

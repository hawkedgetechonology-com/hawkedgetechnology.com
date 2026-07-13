import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <div className={cn(
            "w-5 h-5 rounded border bg-white flex items-center justify-center transition-all cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
            "peer-checked:bg-primary peer-checked:border-primary",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            error ? "border-red-500" : "border-border-color",
            className
          )}>
            <Check size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {label && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-foreground cursor-pointer" onClick={() => props.id && document.getElementById(props.id)?.click()}>
              {label}
            </label>
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

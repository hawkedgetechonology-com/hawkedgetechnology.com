import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: "white" | "soft-blue" | "light-gray";
  containerSize?: "sm" | "md" | "lg" | "full";
}

export function Section({ 
  className, 
  children, 
  background = "white",
  containerSize = "lg",
  ...props 
}: SectionProps) {
  const bgStyles = {
    "white": "bg-white",
    "soft-blue": "bg-soft-blue",
    "light-gray": "bg-light-gray",
  };

  const containerStyles = {
    "sm": "max-w-3xl",
    "md": "max-w-5xl",
    "lg": "max-w-7xl",
    "full": "max-w-full px-0",
  };

  return (
    <section className={cn("py-20 md:py-28", bgStyles[background], className)} {...props}>
      <div className={cn("mx-auto px-6 md:px-12", containerStyles[containerSize])}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ className, title, subtitle, centered = true, ...props }: SectionHeaderProps) {
  return (
    <div className={cn("mb-16", centered && "text-center mx-auto max-w-3xl", className)} {...props}>
      <h2 className="text-3xl md:text-5xl font-bold text-secondary tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-foreground/70">
          {subtitle}
        </p>
      )}
    </div>
  );
}

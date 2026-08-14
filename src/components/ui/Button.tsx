import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "amber" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", icon, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl";

    const variants = {
      primary:
        "bg-gradient-to-r from-beebox-amber-500 to-amber-600 hover:from-amber-400 hover:to-beebox-amber-500 text-beebox-navy-950 font-bold shadow-lg shadow-beebox-amber-500/20 hover:shadow-beebox-amber-500/40 focus:ring-beebox-amber-400 active:scale-[0.98]",
      amber:
        "bg-beebox-amber-500 hover:bg-amber-400 text-beebox-navy-950 font-bold focus:ring-amber-400 active:scale-[0.98]",
      outline:
        "border border-slate-700 hover:border-beebox-amber-500/50 bg-slate-900/50 text-slate-200 hover:text-white hover:bg-slate-800/80 focus:ring-beebox-amber-500",
      ghost:
        "text-slate-300 hover:text-white hover:bg-slate-800/60 focus:ring-slate-700",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3.5 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

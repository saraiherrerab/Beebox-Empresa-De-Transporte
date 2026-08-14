import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <span className="absolute left-3.5 text-slate-400 shrink-0 pointer-events-none">{icon}</span>}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl border border-slate-700/80 bg-beebox-navy-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:border-beebox-amber-500 focus:bg-beebox-navy-900 focus:outline-none focus:ring-2 focus:ring-beebox-amber-500/20",
              icon && "pl-11",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

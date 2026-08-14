import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "amber" | "cyan" | "green" | "slate";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "amber", children, ...props }) => {
  const variants = {
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    slate: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

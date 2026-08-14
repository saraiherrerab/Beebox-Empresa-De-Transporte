import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverEffect = true, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-beebox-navy-900/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300",
        hoverEffect && "hover:border-beebox-amber-500/30 hover:shadow-beebox-amber-500/10 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

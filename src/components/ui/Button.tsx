import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "amber";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-xl gap-2";

  const variants = {
    primary:
      "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95",
    amber:
      "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95",
    secondary:
      "bg-beebox-navy-900 hover:bg-beebox-navy-800 text-white shadow-md active:scale-95",
    outline:
      "border-2 border-slate-200 hover:border-amber-500 bg-transparent text-slate-700 hover:text-slate-950 active:scale-95",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 active:scale-95",
  };

  const sizes = {
    sm: "text-xs px-3.5 py-2",
    md: "text-xs px-5 py-3",
    lg: "text-sm px-7 py-4",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

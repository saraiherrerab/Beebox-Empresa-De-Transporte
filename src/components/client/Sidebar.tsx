"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  LayoutDashboard,
  Package,
  Truck,
  CalendarCheck,
  Calculator,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mis Paquetes", href: "/dashboard/paquetes", icon: Package },
    { name: "Solicitar Pickup", href: "/dashboard/pickup", icon: Truck },
    { name: "Agendar Retiro", href: "/dashboard/retiros", icon: CalendarCheck },
    { name: "Calculadora", href: "/dashboard/calculadora", icon: Calculator },
    { name: "Mi Perfil", href: "/dashboard/perfil", icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-6 shrink-0">
      <div className="space-y-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20">
            <Box className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
              BEE<span className="text-amber-500">BOX</span>
            </span>
            <span className="text-[9px] tracking-widest uppercase font-bold text-slate-400 block -mt-1">
              A Swarm of Quality
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer (Matching Image 4) */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm border-2 border-white shadow-sm shrink-0">
            {user?.name ? user.name.charAt(0) : "J"}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">{user?.name || "Juan Pérez"}</h4>
            <span className="text-[10px] font-mono font-semibold text-amber-600 truncate block">
              {user?.suiteCode || "CAS-88293-MX"}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

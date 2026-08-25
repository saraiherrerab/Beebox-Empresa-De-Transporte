"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BellRing,
  Package,
  Truck,
  Calculator,
  User,
  LogOut,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, setRole, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Notificaciones", href: "/dashboard/notificaciones", icon: BellRing },
    { name: "Prealertas", href: "/dashboard/prealertas", icon: Package },
    { name: "Mis Paquetes", href: "/dashboard/paquetes", icon: Truck },
    { name: "Solicitar Pickup", href: "/dashboard/pickup", icon: Calculator },
    { name: "Calculadora", href: "/dashboard/calculadora", icon: Calculator },
    { name: "Mi Perfil", href: "/dashboard/perfil", icon: User },
  ];

  const handleRoleToggle = () => {
    setRole("admin");
    router.push("/admin");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-6 shrink-0 shadow-sm">
      <div className="space-y-6">
        {/* Official Logo Image */}
        <Link href="/" className="block">
          <img
            src="/beebox-logo.jpg"
            alt="Beebox Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>



        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-1">
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

      {/* User Profile Footer */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm border-2 border-white shadow-sm shrink-0">
            {user?.name ? user.name.charAt(0) : "J"}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">{user?.name || "Juan Pérez"}</h4>
            <span className="text-[10px] font-mono font-bold text-amber-700 truncate block">
              {user?.suiteCode || "CAS-88293-MIAMI"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

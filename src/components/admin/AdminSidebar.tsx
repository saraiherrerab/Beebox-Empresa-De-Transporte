"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BellRing,
  Route,
  CalendarCheck,
  Calculator,
  Image as ImageIcon,
  ArrowRightLeft,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setRole, logout } = useAuth();

  const adminNav = [
    { name: "Resumen Admin", href: "/admin", icon: LayoutDashboard },
    { name: "Clientes & Casilleros", href: "/admin/clientes", icon: Users },
    { name: "Vinculación Prealertas", href: "/admin/prealertas", icon: BellRing },
    { name: "Rutas & Tarifas Standard", href: "/admin/rutas", icon: Route },
    { name: "Gestión de Retiros", href: "/admin/retiros", icon: CalendarCheck },
    { name: "Calculadora Admin", href: "/admin/calculadora", icon: Calculator },
    { name: "Banners CMS", href: "/admin/cms", icon: ImageIcon },
  ];

  const handleSwitchToClient = () => {
    setRole("client");
    router.push("/dashboard");
  };

  return (
    <aside className="w-64 bg-slate-950 text-white min-h-screen flex flex-col justify-between p-6 shrink-0 border-r border-slate-800">
      <div className="space-y-6">
        {/* Logo & Admin Badge */}
        <div className="space-y-2">
          <Link href="/" className="block">
            <img
              src="/beebox-logo.jpg"
              alt="Beebox Logo"
              className="h-10 w-auto object-contain bg-white p-1 rounded-xl"
            />
          </Link>
          <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 inline-block">
            PANEL DE CONTROL CMS
          </span>
        </div>

        {/* Role Toggle back to Client */}
        <button
          onClick={handleSwitchToClient}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all font-bold text-xs shadow-lg shadow-amber-500/20 group"
        >
          <div className="flex items-center gap-2 text-left">
            <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0" />
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-800 block">CAMBIAR A</span>
              <span className="text-xs font-bold text-slate-950 font-mono">PORTAL CLIENTE</span>
            </div>
          </div>
          <ArrowRightLeft className="w-4 h-4 text-slate-950 group-hover:rotate-180 transition-transform" />
        </button>

        {/* Admin Navigation */}
        <nav className="space-y-1.5 pt-2">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-800 text-amber-400 border border-slate-700 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin User Footer */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
            ADM
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">Administrador Beebox</h4>
            <span className="text-[10px] font-mono text-amber-400 block truncate">superadmin@beebox.com</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

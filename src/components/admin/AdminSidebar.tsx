"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Package,
  CalendarCheck,
  Route,
  Users,
  BellRing,
  Globe,
  Settings,
  ShieldCheck,
  ArrowRightLeft,
  Sparkles,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setRole, logout } = useAuth();

  const handleSwitchToClient = () => {
    setRole("client");
    router.push("/dashboard");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navGroups = [
    {
      group: "PRINCIPAL",
      items: [{ name: "Resumen General", href: "/admin", icon: LayoutDashboard }],
    },
    {
      group: "OPERACIONES",
      items: [
        { name: "Recolecciones (Pickups)", href: "/admin/pickups", icon: Truck, badge: "5" },
        { name: "Control de Envíos", href: "/admin/envios", icon: Package },
        { name: "Citas de Retiro", href: "/admin/retiros", icon: CalendarCheck, badge: "12" },
        { name: "Rutas de Entrega", href: "/admin/rutas", icon: Route },
      ],
    },
    {
      group: "GESTIÓN DE CLIENTES",
      items: [
        { name: "Base de Clientes (CRM)", href: "/admin/clientes", icon: Users },
        { name: "Vinculación Prealertas", href: "/admin/prealertas", icon: BellRing },
      ],
    },
    {
      group: "SITIO WEB",
      items: [{ name: "Landing Page (CMS)", href: "/admin/cms", icon: Globe }],
    },
    {
      group: "CONFIGURACIÓN",
      items: [{ name: "Configuración del Sistema", href: "/admin/configuracion", icon: Settings }],
    },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 min-h-screen flex flex-col justify-between p-6 shrink-0 border-r border-slate-800">
      <div className="space-y-6">
        {/* Logo */}
        <Link href="/" className="block">
          <img
            src="/beebox-logo.jpg"
            alt="Beebox Logo"
            className="h-10 w-auto object-contain bg-white p-1 rounded-xl shadow-md"
          />
        </Link>

        {/* Highly Intuitive Demo Role Switcher Button to Client */}
        <button
          onClick={handleSwitchToClient}
          className="w-full p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all font-bold text-xs shadow-lg shadow-amber-500/20 group text-left space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> PROBAR MODO DEMO
            </span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-xs font-black text-slate-950 block uppercase tracking-wider">
            CAMBIAR A MODO CLIENTE
          </span>
          <span className="text-[10px] text-slate-900 block leading-tight font-bold">
            Regresa al portal privado del cliente
          </span>
        </button>

        {/* Grouped Navigation */}
        <nav className="space-y-5 pt-1">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1.5">
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 px-3 block">
                {grp.group}
              </span>
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-slate-800 text-amber-400 border border-slate-700 shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Admin User Footer */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md">
            AD
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">Admin Principal</h4>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400 block truncate">
              SUPERUSER
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

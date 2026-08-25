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
        { name: "Control de Envíos", href: "/admin/envios", icon: Package },
        { name: "Destinos de Envío", href: "/admin/rutas", icon: Route },
      ],
    },
    {
      group: "GESTIÓN DE CLIENTES",
      items: [
        { name: "Base de Clientes (CRM)", href: "/admin/clientes", icon: Users },
        { name: "Confirmación de Prealertas", href: "/admin/prealertas", icon: BellRing },
      ],
    },
    {
      group: "SITIO WEB",
      items: [{ name: "Landing Page (CMS)", href: "/admin/cms", icon: Globe }],
    },
    {
      group: "CONFIGURACIÓN",
      items: [{ name: "Perfil y Seguridad", href: "/admin/configuracion", icon: Settings }],
    },
  ];

  return (
    <aside className="w-64 bg-slate-100 text-slate-800 min-h-screen flex flex-col justify-between p-6 shrink-0 border-r border-slate-200/80 shadow-sm">
      <div className="space-y-6">
        {/* Logo & Executive Badge */}
        <div className="space-y-3">
          <Link href="/" className="block">
            <img
              src="/beebox-logo.jpg"
              alt="Beebox Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-black tracking-wider uppercase shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>PANEL ADMINISTRATIVO (CMS)</span>
          </div>
        </div>



        {/* Grouped Navigation */}
        <nav className="space-y-5 pt-1">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1.5">
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 px-3 block">
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
                        ? "bg-amber-500 text-slate-950 shadow-md font-black"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Admin User Footer */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
            AD
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">Admin Principal</h4>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block truncate">
              SUPERUSER CMS
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

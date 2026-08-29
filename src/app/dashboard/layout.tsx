"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldAlert, AlertTriangle } from "lucide-react";
import { Sidebar } from "@/components/client/Sidebar";
import { NotificationBell } from "@/components/client/NotificationBell";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Mobile Top Header Bar (< 768px) */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <img src="/beebox-logo.jpg" alt="Beebox Logo" className="h-9 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : ""}
          </div>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-800 focus:outline-none"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex">
          <div className="w-72 bg-white h-full overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div onClick={() => setMobileSidebarOpen(false)}>
              <Sidebar />
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar (>= 768px) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Desktop Header with Notification Bell */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              PORTAL DE USUARIO • CASILLERO TULSA, OK
            </span>
            <h2 className="text-sm font-bold text-slate-800">Bienvenido, {user?.name || "Cliente"}</h2>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : ""}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block leading-none">{user?.name || ""}</span>
                <span className="text-[10px] font-mono text-amber-700 font-bold">{user?.suiteCode || ""}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Banner de Aviso de Inhabilitación (Si user.active === false) */}
        {user?.active === false && (
          <div className="bg-rose-500 text-white px-6 py-4 shadow-lg flex items-center justify-between border-b border-rose-600 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 shrink-0">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-wide uppercase">Tu cuenta se encuentra inhabilitada hasta nuevo aviso.</h4>
                <p className="text-xs text-rose-100 font-medium">
                  Algunas funciones como la creación de prealertas están pausadas. Para mayor información o asistencia, por favor contacta a soporte.
                </p>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}

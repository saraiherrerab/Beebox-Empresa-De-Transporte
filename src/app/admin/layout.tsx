"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileAdminSidebarOpen, setMobileAdminSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Mobile Top Header Bar for Admin (< 768px) */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <img src="/beebox-logo.jpg" alt="Beebox Logo" className="h-9 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-amber-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> CMS ADMIN
          </span>

          <button
            onClick={() => setMobileAdminSidebarOpen(!mobileAdminSidebarOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-800 focus:outline-none"
          >
            {mobileAdminSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Admin Sidebar Overlay Drawer */}
      {mobileAdminSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex">
          <div className="w-72 bg-slate-100 h-full overflow-y-auto shadow-2xl relative border-r border-slate-200">
            <button
              onClick={() => setMobileAdminSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white text-slate-800 z-10 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            <div onClick={() => setMobileAdminSidebarOpen(false)}>
              <AdminSidebar />
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileAdminSidebarOpen(false)} />
        </div>
      )}

      {/* Desktop Admin Sidebar (>= 768px) */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full bg-slate-50">{children}</main>
    </div>
  );
}

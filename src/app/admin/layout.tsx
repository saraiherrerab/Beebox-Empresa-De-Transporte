"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-50">{children}</main>
    </div>
  );
}

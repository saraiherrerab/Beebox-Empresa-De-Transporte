"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto bg-slate-950">{children}</main>
    </div>
  );
}

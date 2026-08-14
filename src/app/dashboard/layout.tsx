"use client";

import React from "react";
import { Sidebar } from "@/components/client/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl">{children}</main>
    </div>
  );
}

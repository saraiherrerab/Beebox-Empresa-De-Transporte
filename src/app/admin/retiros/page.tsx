"use client";

import React, { useState } from "react";
import { Search, CalendarCheck, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminRetirosPage() {
  const [activeTab, setActiveTab] = useState<string>("hoy");
  const [delivered, setDelivered] = useState(false);

  const appointments = [
    {
      id: "apt_1",
      time: "09:00 AM",
      clientName: "Juan Pérez Rodríguez",
      suiteCode: "CAS-88293-MX",
      branch: "Almacén Central (CDMX)",
      counter: "Ventanilla #2",
      packagesCount: "3 Paquetes",
      status: "CONFIRMADA",
    },
    {
      id: "apt_2",
      time: "10:30 AM",
      clientName: "María González",
      suiteCode: "CAS-74120-MX",
      branch: "Almacén Central (CDMX)",
      counter: "Ventanilla #1",
      packagesCount: "1 Paquete",
      status: "CONFIRMADA",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Citas de Retiro</h1>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          GESTIÓN DE ENTREGAS PROGRAMADAS EN SUCURSAL
        </span>
      </div>

      {/* Container Card (Matching Mockup 3) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        {/* Tabs & Search Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-6 text-xs font-black uppercase tracking-wider text-slate-400">
            {["hoy", "manana", "proximas", "completadas"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === tab ? "border-amber-500 text-amber-600 font-bold" : "border-transparent hover:text-slate-700"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o ID de cita..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Appointments Table (Matching Mockup 3) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4">HORA</th>
                <th className="py-4 px-4">CLIENTE / CASILLERO</th>
                <th className="py-4 px-4">SUCURSAL / VENTANILLA</th>
                <th className="py-4 px-4">PAQUETES LISTOS</th>
                <th className="py-4 px-4">ESTADO</th>
                <th className="py-4 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-mono font-black text-amber-600 text-sm">{apt.time}</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block">{apt.clientName}</span>
                    <span className="text-[10px] font-mono font-bold text-amber-600">{apt.suiteCode}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 block">{apt.branch}</span>
                    <span className="text-[10px] text-slate-400">{apt.counter}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">{apt.packagesCount}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setDelivered(true)}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all"
                    >
                      {delivered ? "ENTREGADO ✓" : "ENTREGAR"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mi Perfil de Cliente</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Gestiona tus datos personales, casillero asignado y direcciones guardadas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto border-4 border-amber-100 shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : ""}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name || ""}</h3>
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {user?.suiteCode || ""}
            </span>
          </div>
          <div className="pt-2 text-xs text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Cuenta Verificada
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Información Personal</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre Completo
              </label>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                {user?.name || ""}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                {user?.email || ""}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Teléfono de Contacto
              </label>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                {user?.phone || "+52 55 9876 5432"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Casillero Asignado
              </label>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold font-mono text-amber-700">
                {user?.suiteCode || "CAS-88293-MX"}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button variant="amber" className="rounded-2xl px-6 py-3 font-bold">
              ACTUALIZAR DATOS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

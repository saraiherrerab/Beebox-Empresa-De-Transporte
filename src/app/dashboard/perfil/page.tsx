"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, ShieldCheck, Users, Home, ArrowRight, BookUser } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { user } = useAuth();
  const [recipientCount, setRecipientCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rec = JSON.parse(localStorage.getItem("beebox_saved_recipients") || "[]");
        if (Array.isArray(rec)) setRecipientCount(rec.length);
        const addr = JSON.parse(localStorage.getItem("beebox_saved_addresses") || "[]");
        if (Array.isArray(addr)) setAddressCount(addr.length);
      } catch {}
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mi Perfil de Cliente</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Gestiona tus datos personales, casillero asignado y libreta de destinatarios y direcciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto border-4 border-amber-100 shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name || "Cliente Beebox"}</h3>
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {user?.suiteCode || "CAS-PENDIENTE"}
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
                {user?.name || "Sin nombre registrado"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                {user?.email || "Sin correo"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Teléfono de Contacto
              </label>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                {user?.phone || "Sin teléfono registrado"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Casillero Asignado
              </label>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold font-mono text-amber-700">
                {user?.suiteCode || "Pendiente de Asignación"}
              </div>
            </div>
          </div>

          {/* Accesos directos a Libreta de Destinatarios y Direcciones */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              Libreta de Envíos y Recolecciones
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard/destinatarios"
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                    <BookUser className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-950">
                      Destinatarios Guardados
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {recipientCount} {recipientCount === 1 ? "registrado" : "registrados"}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </Link>

              <Link
                href="/dashboard/destinatarios"
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-950">
                      Direcciones de Recogida
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {addressCount} {addressCount === 1 ? "guardada" : "guardadas"}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

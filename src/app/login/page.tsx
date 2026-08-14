"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCheck, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAuth();

  const handleLoginClient = () => {
    setRole("client");
    router.push("/dashboard");
  };

  const handleLoginAdmin = () => {
    setRole("admin");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-xl w-full space-y-8 animate-in fade-in duration-300">
        {/* Header & Logo */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block">
            <img
              src="/beebox-logo.jpg"
              alt="Beebox Logo"
              className="h-14 w-auto object-contain mx-auto transition-transform hover:scale-105"
            />
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Portal de Autenticación Demo
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              SELECCIONA EL PERFIL DE PRUEBA PARA INGRESAR AL SISTEMA
            </p>
          </div>
        </div>

        {/* Instant 2-Button Demo Selector Grid */}
        <div className="space-y-6">
          {/* Card 1: Cliente Demo Access */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-amber-400 shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-slate-950 font-black text-base flex items-center justify-center border border-amber-300 shadow-sm">
                  JP
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Cliente de Prueba</h3>
                  <span className="text-xs font-mono font-bold text-amber-700 block">CAS-88293-MIAMI</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                ● ACTIVO
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Accede al Área Privada de Cliente: Prealertas de compras en línea, solicitudes de pickup, rastreo en tiempo real y perfil de casillero.
            </p>

            <button
              onClick={handleLoginClient}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" /> INGRESA COMO CLIENTE DE PRUEBA <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Admin CMS Demo Access */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-slate-800 shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center shadow-md">
                  AD
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Administrador de Prueba (CMS)</h3>
                  <span className="text-xs font-extrabold font-mono text-amber-700 block uppercase">SUPERUSER CMS</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                ★ ADMIN
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Accede al Panel de Administración: Gestión de pickups, control global de envíos, vinculación de prealertas, catálogo de rutas y CMS.
            </p>

            <button
              onClick={handleLoginAdmin}
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" /> INGRESA COMO ADMIN DE PRUEBA (CMS) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Link back to Home */}
        <div className="text-center pt-2">
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-wider">
            &larr; Volver a la Página Principal
          </Link>
        </div>
      </div>
    </div>
  );
}

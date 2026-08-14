"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Sparkles, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function RegistroPage() {
  const router = useRouter();
  const { setRole } = useAuth();
  const [createdSuite, setCreatedSuite] = useState<string | null>(null);

  const handleRegisterDemo = () => {
    const randomSuite = `CAS-${Math.floor(10000 + Math.random() * 90000)}-MIAMI`;
    setCreatedSuite(randomSuite);
    setRole("client");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
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
              Apertura de Casillero Gratuito (Demo)
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              OBTÉN TU DIRECCIÓN FÍSICA EN MIAMI, MADRID Y SHENZHEN AL INSTANTE
            </p>
          </div>
        </div>

        {/* Demo Register Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
          {createdSuite ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black text-slate-900">¡CASILLERO ASIGNADO CON ÉXITO!</h3>
              <div className="text-2xl font-black font-mono text-amber-700">{createdSuite}</div>
              <p className="text-xs font-bold text-slate-600">Redirigiendo a tu Área Privada...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Beneficios del Casillero Beebox:
                </div>
                <ul className="text-xs text-slate-600 space-y-1 font-medium pl-6 list-disc">
                  <li>Dirección propia en Miami (8400 NW 25th St).</li>
                  <li>Prealerta de compras en Amazon, eBay, Walmart, etc.</li>
                  <li>Sin costos de mantención anual.</li>
                </ul>
              </div>

              <button
                onClick={handleRegisterDemo}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" /> GENERAR MI CASILLERO DE PRUEBA <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-wider">
            ¿Ya tienes casillero? Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

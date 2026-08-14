"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name || "Juan Pérez", email || "juan.perez@beebox.com", phone || "+52 55 9876 5432");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Box className="w-7 h-7 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            BEE<span className="text-amber-500">BOX</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Crear una Cuenta</h2>
        <p className="text-xs text-slate-500">Obtén tu casillero internacional gratis en Miami, Madrid y Shenzhen</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200 sm:px-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pl-10 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pl-10 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Teléfono de Contacto
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pl-10 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pl-10 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" required className="rounded text-amber-500 focus:ring-amber-500" />
              <span>Acepto los <a href="#" className="font-bold text-amber-600 underline">Términos y Condiciones</a></span>
            </div>

            <Button type="submit" variant="amber" className="w-full justify-center py-3.5 text-base font-bold">
              CREAR CUENTA <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 border-t border-slate-200 pt-4">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-bold text-amber-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

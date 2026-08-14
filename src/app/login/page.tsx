"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "juan.perez@beebox.com", password);
    router.push("/dashboard");
  };

  const handleDemoLogin = () => {
    login("juan.perez@beebox.com", "demo123");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link href="/" className="inline-block">
          <img
            src="/beebox-logo.jpg"
            alt="Beebox Logo"
            className="h-14 w-auto object-contain mx-auto"
          />
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Iniciar Sesión</h2>
        <p className="text-xs text-slate-500">Accede a tu casillero internacional y rastreo de envíos</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200 sm:px-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pl-10 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 font-medium">
                <input type="checkbox" className="rounded text-amber-500 focus:ring-amber-500" />
                Recordarme
              </label>
              <a href="#" className="font-bold text-amber-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button type="submit" variant="amber" className="w-full justify-center py-3.5 text-base font-bold">
              INICIAR SESIÓN <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Login Box */}
          <div className="pt-4 border-t border-slate-200 text-center space-y-3">
            <span className="text-xs text-slate-400 block font-medium">¿Deseas probar el sistema sin registrarte?</span>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <UserCheck className="w-4 h-4 text-amber-500" />
              Ingresar con Cuenta Demo (Juan Pérez)
            </button>
          </div>

          <div className="text-center text-xs text-slate-500">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="font-bold text-amber-600 hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

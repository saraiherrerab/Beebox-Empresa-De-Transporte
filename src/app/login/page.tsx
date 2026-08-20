"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Ingresa tu correo electrónico y contraseña.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      setLoading(false);
      if (email.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "Credenciales inválidas. Verifica tu correo y contraseña.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-md w-full space-y-8 animate-in fade-in duration-300">
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
              Iniciar Sesión
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              INGRESA TUS CREDENCIALES PARA ACCEDER AL SISTEMA
            </p>
          </div>
        </div>

        {/* Error message alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-3 animate-in shake">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Clean Login Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@beebox.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              INICIAR SESIÓN <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs font-medium text-slate-500">
              ¿No tienes casillero?{" "}
              <Link href="/registro" className="font-bold text-amber-700 hover:underline">
                Regístrate aquí
              </Link>
            </p>
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

"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Check, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import { API_URL } from "@/config/api";

const RULES = [
  { label: "Al menos 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Al menos una letra", test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: "Al menos un número", test: (p: string) => /\d/.test(p) },
  {
    label: "Al menos un carácter especial (ej. !@#$%^&*)",
    test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
  },
];

const inputClass =
  "w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all";

function RestablecerForm() {
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    token ? null : "El enlace no es válido o ya venció."
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!RULES.every((r) => r.test(password))) {
      setErrorMsg("La contraseña no cumple todos los requisitos.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || "No pudimos restablecer la contraseña.");
      setDone(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "No pudimos conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-5">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Contraseña actualizada. Ya puedes iniciar sesión con tu nueva contraseña.</span>
        </div>
        <Link
          href="/login"
          className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center"
        >
          INICIAR SESIÓN
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold space-y-2">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <Link href="/recuperar-contrasena" className="block pl-8 text-amber-700 hover:underline">
            Solicitar un enlace nuevo
          </Link>
        </div>
      )}

      {token && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wider">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <ul className="mt-3 space-y-1">
              {RULES.map((rule) => {
                const ok = rule.test(password);
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-[11px] font-bold ${ok ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wider">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            GUARDAR CONTRASEÑA
          </button>
        </form>
      )}
    </div>
  );
}

export default function RestablecerContrasenaPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-md w-full space-y-8 animate-in fade-in duration-300">
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
              Nueva Contraseña
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              ELIGE UNA CONTRASEÑA SEGURA PARA TU CUENTA
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6">
          <Suspense fallback={<Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />}>
            <RestablecerForm />
          </Suspense>
          <div className="pt-4 border-t border-slate-100 text-center">
            <Link href="/login" className="text-xs font-bold text-amber-700 hover:underline">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

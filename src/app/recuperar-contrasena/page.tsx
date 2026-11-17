"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { API_URL } from "@/config/api";

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Ingresa tu correo electrónico.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || "No pudimos procesar la solicitud.");
      setSuccessMsg(body.message);
    } catch (err: any) {
      setErrorMsg(err?.message || "No pudimos conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

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
              Recuperar Contraseña
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              TE ENVIAREMOS UN ENLACE A TU CORREO
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6">
          {successMsg ? (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  {successMsg} Revisa también la carpeta de spam. El enlace vence en 30 minutos.
                </span>
              </div>
              <Link
                href="/login"
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center"
              >
                VOLVER A INICIAR SESIÓN
              </Link>
            </div>
          ) : (
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
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                ENVIAR ENLACE
              </button>
            </form>
          )}

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

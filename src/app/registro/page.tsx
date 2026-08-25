"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Sparkles, Package, Mail, Lock, User, Phone, AlertCircle, Loader2, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegistroPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdSuite, setCreatedSuite] = useState<string | null>(null);

  // Reglas de seguridad de contraseña
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber && hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("Nombre, correo y contraseña son obligatorios.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg("La contraseña no cumple con todas las reglas de seguridad requeridas.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await register(name, email, password, phone);
      setLoading(false);
      const generatedCode = `CAS-${Math.floor(10000 + Math.random() * 90000)}-TULSA`;
      setCreatedSuite(generatedCode);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "Error al registrar casillero.");
    }
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
              Apertura de Casillero Gratuito BeeBox
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              REGISTRO EN LÍNEA CONECTADO A LA API BACKEND
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

        {/* Register Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
          {createdSuite ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black text-slate-900">¡CASILLERO ASIGNADO CON ÉXITO!</h3>
              <p className="text-xs font-bold text-slate-600">Redirigiendo a tu Área Privada...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Beneficios de tu Casillero BeeBox:
                </div>
                <ul className="text-xs text-slate-600 space-y-1 font-medium pl-6 list-disc">
                  <li>Dirección física propia en Tulsa, Oklahoma, USA.</li>
                  <li>Prealerta automática de paquetes.</li>
                  <li>Control y seguimiento en tiempo real.</li>
                </ul>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Nombre Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. María González"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maria.gonzalez@ejemplo.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Teléfono (opcional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Contraseña Segura</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Requisitos de Contraseña en tiempo real */}
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Requisitos de Seguridad de Contraseña:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-semibold">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600" : "text-slate-400"}`}>
                      {hasMinLength ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                      <span>Mínimo 8 caracteres</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLetter ? "text-emerald-600" : "text-slate-400"}`}>
                      {hasLetter ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                      <span>Al menos una letra</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600" : "text-slate-400"}`}>
                      {hasNumber ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                      <span>Al menos un número</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-600" : "text-slate-400"}`}>
                      {hasSpecial ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                      <span>Un carácter especial (ej. !@#$)</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (password.length > 0 && !isPasswordValid)}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                CREAR MI CASILLERO & REGISTRARME <ArrowRight className="w-4 h-4" />
              </button>
            </form>
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

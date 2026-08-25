"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { KeyRound, UserCheck, ShieldCheck, CheckCircle2, AlertCircle, Save, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminConfiguracionPage() {
  const { user } = useAuth();

  // Profile State
  const [name, setName] = useState(user?.name || "Administrador Principal");
  const [phone, setPhone] = useState(user?.phone || "+1 (918) 555-0199");
  const [profileNotice, setProfileNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotice, setPasswordNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileNotice(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (!token) {
      setProfileNotice({ type: "error", msg: "No tienes una sesión activa." });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfileNotice({ type: "success", msg: "Perfil de administrador actualizado correctamente." });
        setTimeout(() => setProfileNotice(null), 5000);
      } else {
        setProfileNotice({ type: "error", msg: data.message || "Error al actualizar perfil." });
      }
    } catch {
      setProfileNotice({ type: "error", msg: "Error de conexión con el servidor." });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (newPassword !== confirmPassword) {
      setPasswordNotice({ type: "error", msg: "La confirmación de la contraseña no coincide." });
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (!token) {
      setPasswordNotice({ type: "error", msg: "No tienes una sesión activa." });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordNotice({ type: "success", msg: "¡Tu contraseña ha sido actualizada con éxito!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordNotice(null), 5000);
      } else {
        setPasswordNotice({ type: "error", msg: data.message || "Error al cambiar la contraseña." });
      }
    } catch {
      setPasswordNotice({ type: "error", msg: "Error de conexión con el servidor." });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Perfil y Seguridad del Administrador</h1>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          GESTIÓN DE CREDENCIALES, CONTRASEÑA Y DATOS PERSONALES
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Datos de Perfil */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Datos Personales</h3>
              <p className="text-xs text-slate-500 font-medium">Información de la cuenta administradora</p>
            </div>
          </div>

          {profileNotice && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                profileNotice.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}
            >
              {profileNotice.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              {profileNotice.msg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Correo Electrónico (Solo Lectura)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || "admin@beebox.com"}
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 p-3.5 text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs">
                <Save className="w-4 h-4 mr-1.5" /> GUARDAR DATOS
              </Button>
            </div>
          </form>
        </div>

        {/* Card 2: Cambio de Contraseña */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Seguridad y Contraseña</h3>
              <p className="text-xs text-slate-500 font-medium">Actualiza tu clave de acceso al sistema</p>
            </div>
          </div>

          {passwordNotice && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                passwordNotice.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}
            >
              {passwordNotice.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              {passwordNotice.msg}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Contraseña Actual
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres (letras, números y símbolos)"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva contraseña"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs">
                <Lock className="w-4 h-4 mr-1.5" /> CAMBIAR CONTRASEÑA
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

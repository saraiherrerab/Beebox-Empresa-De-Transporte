"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchSavedAddresses, fetchSavedRecipients } from "@/lib/addressBook";
import {
  ShieldCheck,
  AlertCircle,
  Home,
  ArrowRight,
  BookUser,
  Pencil,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/config/api";

const COUNTRY_CODES = [
  { code: "+58", label: "🇻🇪 +58 (VE)" },
  { code: "+1", label: "🇺🇸 +1 (US)" },
  { code: "+57", label: "🇨🇴 +57 (CO)" },
  { code: "+56", label: "🇨🇱 +56 (CL)" },
  { code: "+52", label: "🇲🇽 +52 (MX)" },
  { code: "+507", label: "🇵🇦 +507 (PA)" },
  { code: "+34", label: "🇪🇸 +34 (ES)" },
];

function splitPhoneCode(fullPhone?: string): { prefix: string; localNumber: string } {
  const raw = (fullPhone || "").trim();
  if (!raw) return { prefix: "+58", localNumber: "" };
  for (const item of COUNTRY_CODES) {
    if (raw.startsWith(item.code)) {
      return {
        prefix: item.code,
        localNumber: raw.slice(item.code.length).trim(),
      };
    }
  }
  return { prefix: "+58", localNumber: raw };
}

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [recipientCount, setRecipientCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);

  // Estado de edición de datos personales (OBS-12)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+58");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Estado de cambio de contraseña (OBS-07 y OBS-08)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [passSuccessMsg, setPassSuccessMsg] = useState<string | null>(null);
  const [passErrorMsg, setPassErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedRecipients()
      .then((list) => setRecipientCount(list.length))
      .catch(() => {});
    fetchSavedAddresses()
      .then((list) => setAddressCount(list.length))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      const parsed = splitPhoneCode(user.phone);
      setPhonePrefix(parsed.prefix);
      setPhoneNumber(parsed.localNumber);
    }
  }, [user]);

  const startEditingProfile = () => {
    setProfileErrorMsg(null);
    setProfileSuccessMsg(null);
    setEditName(user?.name || "");
    const parsed = splitPhoneCode(user?.phone);
    setPhonePrefix(parsed.prefix);
    setPhoneNumber(parsed.localNumber);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);
    setProfileSuccessMsg(null);

    const trimmedName = editName.trim();
    if (trimmedName.length < 3) {
      setProfileErrorMsg("El nombre completo debe tener al menos 3 caracteres.");
      return;
    }

    const cleanDigits = phoneNumber.replace(/[^\d]/g, "");
    if (phoneNumber.trim() && (cleanDigits.length < 7 || cleanDigits.length > 15)) {
      setProfileErrorMsg("Ingresa un número de teléfono válido (entre 7 y 15 dígitos).");
      return;
    }

    const finalPhone = cleanDigits ? `${phonePrefix} ${cleanDigits}` : "";

    setProfileSaving(true);
    try {
      await updateUserProfile({
        name: trimmedName,
        phone: finalPhone,
      });
      setIsEditingProfile(false);
      setProfileSuccessMsg("¡Tus datos personales han sido actualizados correctamente!");
      setTimeout(() => setProfileSuccessMsg(null), 5000);
    } catch (err: any) {
      setProfileErrorMsg(err?.message || "No se pudieron guardar los cambios.");
    } finally {
      setProfileSaving(false);
    }
  };

  // Validaciones de contraseña (OBS-07)
  const hasMinLength = newPassword.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isNewPasswordValid = hasMinLength && hasLetter && hasNumber && hasSpecial && passwordsMatch;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg(null);
    setPassSuccessMsg(null);

    if (!currentPassword) {
      setPassErrorMsg("Ingresa tu contraseña actual para confirmar tu identidad.");
      return;
    }
    if (!hasMinLength || !hasLetter || !hasNumber || !hasSpecial) {
      setPassErrorMsg("La nueva contraseña no cumple con todos los requisitos de seguridad.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassErrorMsg("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    setShowCurrentPass(false);
    setShowNewPass(false);
    setShowConfirmPass(false);
    setPassSaving(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Error al cambiar la contraseña.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPassSuccessMsg("¡Contraseña actualizada exitosamente!");
      setTimeout(() => setPassSuccessMsg(null), 5000);
    } catch (err: any) {
      setPassErrorMsg(err?.message || "No se pudo actualizar la contraseña.");
    } finally {
      setPassSaving(false);
    }
  };

  const hasRegisteredPhone = Boolean(user?.phone && user.phone.trim().length > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mi Perfil de Cliente</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Gestiona tus datos personales, seguridad de acceso, casillero asignado y libreta de direcciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Tarjeta Lateral de Resumen y Estado Real de Cuenta (OBS-06 Opción A) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto border-4 border-amber-100 shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name || "Cliente Beebox"}</h3>
            <span className="inline-block mt-1 text-xs font-mono font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {user?.suiteCode || "CAS-PENDIENTE"}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100">
            {user?.active === false ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> Cuenta Inhabilitada
              </div>
            ) : hasRegisteredPhone ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> Cuenta Activa · Contacto Completo
              </div>
            ) : (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                  <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Teléfono pendiente de registro
                </div>
                {!isEditingProfile && (
                  <button
                    type="button"
                    onClick={startEditingProfile}
                    className="block mx-auto text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    + Registrar teléfono ahora
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Columna Principal: Información Personal + Seguridad */}
        <div className="md:col-span-2 space-y-8">
          {/* Tarjeta 1: Información Personal Editable (OBS-12) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Información Personal</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Mantén tu nombre y teléfono actualizados para la entrega de envíos y trámites de aduana.
                </p>
              </div>
              {!isEditingProfile && (
                <button
                  type="button"
                  onClick={startEditingProfile}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-xs font-bold text-slate-800 transition-colors self-start sm:self-auto"
                >
                  <Pencil className="w-3.5 h-3.5 text-amber-600" /> Editar Datos
                </button>
              )}
            </div>

            {profileSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {profileErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Ej. Eduardo Pérez"
                      className="w-full p-3.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Correo Electrónico (Identificador de Acceso)
                    </label>
                    <div
                      title="Para cambiar el correo electrónico de acceso contacta a soporte o administración"
                      className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 cursor-not-allowed"
                    >
                      {user?.email || "Sin correo"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Teléfono de Contacto
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={phonePrefix}
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        aria-label="Código de país"
                        className="rounded-2xl bg-white border border-slate-300 px-3 py-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shrink-0"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="412 1234567"
                        className="w-full p-3.5 rounded-2xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
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

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileErrorMsg(null);
                    }}
                    className="px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <Button
                    type="submit"
                    variant="amber"
                    disabled={profileSaving}
                    className="rounded-2xl px-6 py-2.5 text-xs font-bold"
                  >
                    {profileSaving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            ) : (
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
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>{user?.phone || "Sin teléfono registrado"}</span>
                    {!hasRegisteredPhone && (
                      <button
                        type="button"
                        onClick={startEditingProfile}
                        className="text-[11px] font-bold text-amber-700 hover:underline"
                      >
                        Añadir
                      </button>
                    )}
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
            )}

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
                  href="/dashboard/direcciones"
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

          {/* Tarjeta 2: Seguridad y Cambio de Contraseña (OBS-07 y OBS-08) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Seguridad y Contraseña</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Actualiza tu contraseña de acceso periódicamente para mantener protegido tu casillero.
                </p>
              </div>
            </div>

            {passSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passSuccessMsg}</span>
              </div>
            )}

            {passErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Contraseña Actual */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contraseña Actual *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full pl-3.5 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass((prev) => !prev)}
                      aria-label={showCurrentPass ? "Ocultar contraseña actual" : "Mostrar contraseña actual"}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Nueva Contraseña */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full pl-3.5 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass((prev) => !prev)}
                      aria-label={showNewPass ? "Ocultar nueva contraseña" : "Mostrar nueva contraseña"}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Nueva Contraseña */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirmar Nueva *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full pl-3.5 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass((prev) => !prev)}
                      aria-label={showConfirmPass ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Requisitos visibles de seguridad (OBS-07) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                  Requisitos de la nueva contraseña:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-semibold text-[11px]">
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
                    <span>Un símbolo (!@#$%^&*)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-emerald-600" : "text-slate-400"}`}>
                    {passwordsMatch ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                    <span>Las contraseñas coinciden</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant="amber"
                  disabled={passSaving || (newPassword.length > 0 && !isNewPasswordValid)}
                  className="rounded-2xl px-6 py-2.5 text-xs font-bold disabled:opacity-50"
                >
                  {passSaving ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Actualizando...
                    </span>
                  ) : (
                    "Actualizar Contraseña"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

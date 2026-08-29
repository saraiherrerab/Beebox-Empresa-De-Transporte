"use client";

import React, { useState, useEffect } from "react";
import { Shield, Plus, CheckCircle2, Loader2, UserCheck, UserX, Lock, Mail, Phone, User, Key, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  suiteCode?: string;
  role: string;
  active: boolean;
  disabledReason?: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const FALLBACK_ADMINS: AdminUser[] = [
  {
    id: "adm_mock_1",
    name: "Super Admin Principal",
    email: "superadmin@beebox.com",
    phone: "+56 9 8765 4321",
    suiteCode: "CAS-SUPER-HQ",
    role: "super_admin",
    active: true,
    createdAt: "2026-08-29T20:01:59.623Z",
  },
  {
    id: "adm_mock_2",
    name: "Admin Principal",
    email: "admin@beebox.com",
    phone: "+56 9 1234 5678",
    suiteCode: "CAS-ADMIN-HUB",
    role: "admin",
    active: true,
    createdAt: "2026-08-20T01:02:43.931Z",
  },
];

export default function AdminAdministradoresPage() {
  const { user, logout } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSuperAdmin = user?.role === "super_admin" || user?.email?.includes("super");

  const fetchAdmins = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetch(`${API_URL}/users/admins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.admins) {
          setAdmins(data.admins);
          setAuthError(null);
          setLoading(false);
          return;
        } else if (res.status === 401 || res.status === 403) {
          setAuthError("Tu token de sesión es anterior al cambio de permisos o expiró. Por favor vuelve a iniciar sesión para actualizar tu acceso de Super Admin.");
        }
      } catch (err) {
        console.error("Error al cargar administradores:", err);
      }
    }

    setAdmins(FALLBACK_ADMINS);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password.length < 8) {
      setNoticeMsg("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setSubmitting(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;

    try {
      const res = await fetch(`${API_URL}/users/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (res.ok) {
        setNoticeMsg(`Administrador '${name}' registrado exitosamente.`);
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setShowModal(false);
        fetchAdmins();
        setTimeout(() => setNoticeMsg(null), 4000);
      } else {
        setNoticeMsg(data.message || "Error al crear el administrador.");
      }
    } catch {
      setNoticeMsg("Error de red al registrar administrador.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (adminId: string, currentStatus: boolean) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/users/${adminId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          active: !currentStatus,
          disabledReason: !currentStatus ? undefined : "Inhabilitado por el Super Administrador",
        }),
      });

      if (res.ok) {
        setNoticeMsg(`Estado del administrador actualizado.`);
        fetchAdmins();
        setTimeout(() => setNoticeMsg(null), 4000);
      }
    } catch {
      setNoticeMsg("Error al cambiar estado del administrador.");
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-black text-slate-900">Acceso Restringido</h2>
        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
          Esta sección está reservada exclusivamente para la gestión de administradores por parte del **Super Administrador**.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {authError && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">Sesión Desactualizada Detectada</h4>
              <p className="text-xs font-semibold text-amber-800 mt-0.5">{authError}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== "undefined") localStorage.removeItem("beebox_token");
              logout();
              window.location.href = "/";
            }}
            className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors shrink-0 shadow-sm"
          >
            Re-iniciar Sesión (Super Admin)
          </button>
        </div>
      )}

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-500" /> Gestión de Administradores
          </h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            CREACIÓN Y ADMINISTRACIÓN DE CUENTAS CON ROL DE OPERADOR
          </span>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          variant="amber"
          className="rounded-2xl font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4 mr-1.5" /> REGISTRAR NUEVO ADMINISTRADOR
        </Button>
      </div>

      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {noticeMsg}
        </div>
      )}

      {/* Modal de Registro de Administrador */}
      {showModal && (
        <form onSubmit={handleCreateAdmin} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-500" /> Registrar Nuevo Administrador Operativo
            </h3>
            <button type="button" onClick={() => setShowModal(false)} className="text-xs font-bold text-slate-400">
              CANCELAR
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ej. Carlos Mendoza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="ej. carlos.admin@beebox.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Contraseña Segura</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres (Ej: AdminPass2026!)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Teléfono (Opcional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="+56 9 8765 4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
            🔒 <strong>Seguridad:</strong> El nuevo usuario tendrá el rol de <strong>Administrador Operador (`admin`)</strong> y podrá confirmar prealertas, gestionar envíos y consultar clientes sin permisos de modificación de tarifas o destinos.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="amber"
              disabled={submitting}
              className="rounded-xl px-6 py-3 text-xs font-bold"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
              REGISTRAR ADMINISTRADOR
            </Button>
          </div>
        </form>
      )}

      {/* Main Admins Table / Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Cargando lista de administradores...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
              Administradores Registrados ({admins.length})
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {admins.map((adm) => (
              <div key={adm.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-black text-base flex items-center justify-center border border-amber-200 shrink-0">
                    {adm.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{adm.name}</h4>
                      {adm.role === "super_admin" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500 text-slate-950 shadow-sm">
                          ⭐ Super Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                          🛡️ Operador
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {adm.email}
                      </span>
                      {adm.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {adm.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    adm.active
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}>
                    {adm.active ? "🟢 Activo" : "🔴 Inhabilitado"}
                  </span>

                  {adm.role !== "super_admin" && (
                    <button
                      onClick={() => handleToggleStatus(adm.id, adm.active)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border flex items-center gap-1 ${
                        adm.active
                          ? "bg-slate-100 text-rose-600 border-slate-200 hover:bg-rose-50"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      {adm.active ? (
                        <>
                          <UserX className="w-3.5 h-3.5" /> Inhabilitar
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" /> Activar
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

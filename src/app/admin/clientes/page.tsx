"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Users, UserPlus, Eye, ShieldAlert, ShieldCheck, Filter, Loader2, AlertTriangle, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  suiteCode: string;
  role: string;
  active?: boolean;
  disabledReason?: string;
  createdAt: string;
  _count?: {
    shipments: number;
    prealertas: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const FALLBACK_CLIENTS: ApiUser[] = [
  {
    id: "usr_mock_1",
    name: "Sarai Herrera",
    email: "sarai.herrera@beebox.com",
    phone: "+52 55 9876 5432",
    suiteCode: "CAS-77382-MIAMI",
    role: "client",
    active: true,
    createdAt: "2026-08-20T01:00:00.000Z",
  },
  {
    id: "usr_mock_2",
    name: "Juan Pérez",
    email: "juan.perez@beebox.com",
    phone: "+52 55 9876 5432",
    suiteCode: "CAS-88293-MIAMI",
    role: "client",
    active: true,
    createdAt: "2026-08-20T01:02:44.011Z",
  },
  {
    id: "usr_mock_3",
    name: "Laura Gómez",
    email: "laura.gomez@beebox.com",
    phone: "+52 55 1234 5678",
    suiteCode: "CAS-42346-MIAMI",
    role: "client",
    active: true,
    createdAt: "2026-08-20T03:53:30.839Z",
  },
  {
    id: "usr_mock_4",
    name: "Maria Gonzalez",
    email: "maria@gmail.com",
    phone: "+58 412 134 5071",
    suiteCode: "CAS-62607-MIAMI",
    role: "client",
    active: true,
    createdAt: "2026-08-25T14:39:13.748Z",
  },
];

export default function AdminClientesPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const isSuperAdmin = user?.role === "super_admin" || user?.email?.includes("super");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ApiUser[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  // Modal State
  const [selectedClient, setSelectedClient] = useState<ApiUser | null>(null);
  const [modalMode, setModalMode] = useState<"disable" | "view">("disable");
  const [disabledReasonInput, setDisabledReasonInput] = useState("");
  const [processingStatus, setProcessingStatus] = useState(false);

  const fetchUsers = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.users) {
          const clientOnly = data.users.filter(
            (u: ApiUser) => u.role !== "admin" && u.role !== "super_admin"
          );
          setClients(clientOnly);
          setAuthError(null);
          return;
        } else if (res.status === 401 || res.status === 403) {
          setAuthError("Tu token de sesión es anterior al cambio de permisos o expiró. Por favor vuelve a iniciar sesión para actualizar tu acceso de Super Admin.");
        }
      } catch (err) {
        console.error("Error de red al obtener usuarios:", err);
      }
    }

    setClients(FALLBACK_CLIENTS);
  }, []);

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false));
  }, [fetchUsers, isAuthenticated, user]);

  const handleToggleStatus = async (user: ApiUser, newActive: boolean) => {
    if (!newActive && !disabledReasonInput.trim()) {
      alert("Por favor ingresa un motivo interno de inhabilitación.");
      return;
    }

    setProcessingStatus(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;

    try {
      if (token) {
        const res = await fetch(`${API_URL}/users/${user.id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            active: newActive,
            disabledReason: newActive ? null : disabledReasonInput,
          }),
        });

        if (res.ok) {
          await fetchUsers();
          setSelectedClient(null);
          setDisabledReasonInput("");
          setProcessingStatus(false);
          return;
        }
      }
    } catch {
      // Fallback local
    }

    // Actualizar estado local si está desconectado
    setClients((prev) =>
      prev.map((c) =>
        c.id === user.id
          ? { ...c, active: newActive, disabledReason: newActive ? undefined : disabledReasonInput }
          : c
      )
    );

    setSelectedClient(null);
    setDisabledReasonInput("");
    setProcessingStatus(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Resetear a la primera página al buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.suiteCode.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE) || 1;
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
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

      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Clientes</h1>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          BASE DE DATOS CENTRALIZADA & CONTROL DE ACCESO
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">TOTAL CLIENTES</span>
            <div className="text-3xl font-black text-slate-900 font-mono">{clients.length}</div>
            <span className="text-[10px] font-bold text-emerald-600">↗ {clients.filter(c => c.active !== false).length} Activos</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">INHABILITADOS</span>
            <div className="text-3xl font-black text-rose-600 font-mono">
              {clients.filter((c) => c.active === false).length}
            </div>
            <span className="text-[10px] font-bold text-slate-400">ACCESO SUSPENDIDO</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Lista Maestra de Clientes</h3>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              ESTADO DE CUENTA Y CONTROL DE ACCESO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, email o casillero..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Cargando clientes desde el servidor...</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-4">CLIENTE / REGISTRO</th>
                    <th className="py-4 px-4">CASILLERO ID</th>
                    <th className="py-4 px-4">CONTACTO</th>
                    <th className="py-4 px-4">ESTADO</th>
                    <th className="py-4 px-4">ROL</th>
                    {isSuperAdmin && <th className="py-4 px-4 text-right">ACCIONES</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {paginatedClients.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[10px] text-slate-400">
                            Registrado: {c.createdAt ? c.createdAt.split("T")[0] : "Reciente"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">{c.suiteCode || "CAS-PENDIENTE"}</td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-800 block">{c.email}</span>
                        <span className="text-[10px] text-slate-400">{c.phone || "Sin teléfono"}</span>
                      </td>
                      <td className="py-4 px-4">
                        {c.active !== false ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="w-3 h-3" /> Activo
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                              <ShieldAlert className="w-3 h-3" /> Inhabilitado
                            </span>
                            {c.disabledReason && (
                              <p className="text-[10px] text-rose-600 font-bold max-w-xs truncate" title={c.disabledReason}>
                                Motivo admin: {c.disabledReason}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            c.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {c.role || "client"}
                        </span>
                      </td>
                      {isSuperAdmin && (
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {c.active !== false ? (
                              <button
                                onClick={() => {
                                  setSelectedClient(c);
                                  setModalMode("disable");
                                  setDisabledReasonInput("");
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-[10px] flex items-center gap-1 transition-colors"
                              >
                                <ShieldAlert className="w-3.5 h-3.5" /> Inhabilitar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleStatus(c, true)}
                                disabled={processingStatus}
                                className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] flex items-center gap-1 transition-colors disabled:opacity-50"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" /> Reactivar
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de Paginación (15 por página) */}
            {filteredClients.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500">
                  Mostrando{" "}
                  <strong className="text-slate-900">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)}
                  </strong>{" "}
                  de <strong className="text-slate-900">{filteredClients.length}</strong> clientes
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>

                  <span className="text-xs font-bold text-slate-700 px-2">
                    Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para Inhabilitar Cliente (Motivo Interno Admin) */}
      {selectedClient && modalMode === "disable" && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Inhabilitar Cliente</h3>
                  <p className="text-[11px] font-medium text-slate-500">{selectedClient.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs leading-relaxed font-medium">
                <p className="font-bold">🔒 Nota de Privacidad:</p>
                El motivo que ingreses a continuación es <strong>exclusivamente para control interno del administrador</strong>.
                El cliente únicamente recibirá el aviso general: <em>"Tu cuenta se encuentra inhabilitada hasta nuevo aviso."</em>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Motivo Interno de Inhabilitación (Obligatorio para Admin):
                </label>
                <textarea
                  rows={3}
                  value={disabledReasonInput}
                  onChange={(e) => setDisabledReasonInput(e.target.value)}
                  placeholder="Ej: Falta de pago, verificación de identidad pendiente, irregularidad en datos de envío..."
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                disabled={processingStatus || !disabledReasonInput.trim()}
                onClick={() => handleToggleStatus(selectedClient, false)}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {processingStatus && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirmar Inhabilitación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

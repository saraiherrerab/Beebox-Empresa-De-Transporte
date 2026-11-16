"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Users,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  X,
  Pencil,
  CheckCircle2,
  MapPin,
  BookUser,
  Home,
  Phone,
  Mail,
  Save,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/config/api";

interface SavedAddressItem {
  id: string;
  label: string;
  address: string;
  city: string;
  contactName?: string | null;
  contactPhone?: string | null;
}

interface SavedRecipientItem {
  id: string;
  name: string;
  phone: string;
  phone2?: string | null;
  address: string;
  city: string;
}

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
  updatedAt?: string;
  savedAddresses?: SavedAddressItem[];
  savedRecipients?: SavedRecipientItem[];
  _count?: {
    shipments: number;
    prealertas: number;
  };
}

export default function AdminClientesPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ApiUser[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [globalNotice, setGlobalNotice] = useState<string | null>(null);

  // Modal State
  const [selectedClient, setSelectedClient] = useState<ApiUser | null>(null);
  const [modalMode, setModalMode] = useState<"disable" | "view">("view");
  const [disabledReasonInput, setDisabledReasonInput] = useState("");
  const [processingStatus, setProcessingStatus] = useState(false);

  // Estado de Ficha / Edición de Cliente (OBS-13)
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSuiteCode, setEditSuiteCode] = useState("");
  const [savingClient, setSavingClient] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailSuccess, setDetailSuccess] = useState<string | null>(null);

  // Edición de direcciones y destinatarios del cliente desde el CRM
  const [editingRecipientId, setEditingRecipientId] = useState<string | null>(null);
  const [recForm, setRecForm] = useState({ name: "", phone: "", phone2: "", address: "", city: "" });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState({ label: "", address: "", city: "", contactName: "", contactPhone: "" });
  const [savingSubItem, setSavingSubItem] = useState(false);

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
          setAuthError(
            "Tu token de sesión es anterior al cambio de permisos o expiró. Por favor vuelve a iniciar sesión para actualizar tu acceso."
          );
        }
      } catch (err) {
        console.error("Error de red al obtener usuarios:", err);
      }
    }

    setClients([]);
  }, []);

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false));
  }, [fetchUsers, isAuthenticated, user]);

  // Abrir ficha detallada del cliente (OBS-13)
  const handleOpenClientDetail = async (clientRow: ApiUser) => {
    setSelectedClient(clientRow);
    setModalMode("view");
    setDetailError(null);
    setDetailSuccess(null);
    setEditingRecipientId(null);
    setEditingAddressId(null);
    setEditName(clientRow.name || "");
    setEditEmail(clientRow.email || "");
    setEditPhone(clientRow.phone || "");
    setEditSuiteCode(clientRow.suiteCode || "");

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (!token) return;

    setLoadingDetail(true);
    try {
      const res = await fetch(`${API_URL}/users/${clientRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setSelectedClient(data.user);
        setEditName(data.user.name || "");
        setEditEmail(data.user.email || "");
        setEditPhone(data.user.phone || "");
        setEditSuiteCode(data.user.suiteCode || "");
      }
    } catch {
      // Conservar datos básicos de la fila
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSaveClientData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    setDetailError(null);
    setDetailSuccess(null);

    if (!editName.trim() || !editEmail.trim()) {
      setDetailError("El nombre y el correo electrónico del cliente son obligatorios.");
      return;
    }

    setSavingClient(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    try {
      const res = await fetch(`${API_URL}/users/${selectedClient.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          suiteCode: editSuiteCode.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar los datos del cliente.");
      }

      const updatedUser: ApiUser = data.user || {
        ...selectedClient,
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        suiteCode: editSuiteCode.trim(),
      };

      setSelectedClient(updatedUser);
      setClients((prev) => prev.map((c) => (c.id === updatedUser.id ? { ...c, ...updatedUser } : c)));
      setDetailSuccess(
        "¡Datos del cliente actualizados y notificación enviada a su portal!"
      );
      setGlobalNotice(`Datos de ${updatedUser.name} actualizados correctamente.`);
      setTimeout(() => setGlobalNotice(null), 5000);
    } catch (err: any) {
      setDetailError(err?.message || "No se pudieron guardar los cambios.");
    } finally {
      setSavingClient(false);
    }
  };

  const handleSaveRecipient = async (recipientId: string) => {
    if (!selectedClient) return;
    setSavingSubItem(true);
    setDetailError(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    try {
      const res = await fetch(`${API_URL}/recipients/${recipientId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(recForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar dirección de entrega.");
      }
      const updatedRec = data.recipient;
      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              savedRecipients: (prev.savedRecipients || []).map((r) =>
                r.id === recipientId ? updatedRec : r
              ),
            }
          : prev
      );
      setEditingRecipientId(null);
      setDetailSuccess("Dirección de destinatario corregida y notificada al cliente.");
    } catch (err: any) {
      setDetailError(err?.message || "Error al actualizar destinatario.");
    } finally {
      setSavingSubItem(false);
    }
  };

  const handleSaveAddress = async (addressId: string) => {
    if (!selectedClient) return;
    setSavingSubItem(true);
    setDetailError(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    try {
      const res = await fetch(`${API_URL}/saved-addresses/${addressId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(addrForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar dirección de recogida.");
      }
      const updatedAddr = data.savedAddress;
      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              savedAddresses: (prev.savedAddresses || []).map((a) =>
                a.id === addressId ? updatedAddr : a
              ),
            }
          : prev
      );
      setEditingAddressId(null);
      setDetailSuccess("Dirección de recogida corregida y notificada al cliente.");
    } catch (err: any) {
      setDetailError(err?.message || "Error al actualizar dirección.");
    } finally {
      setSavingSubItem(false);
    }
  };

  const handleToggleStatus = async (targetUser: ApiUser, newActive: boolean) => {
    if (!newActive && !disabledReasonInput.trim()) {
      alert("Por favor ingresa un motivo interno de inhabilitación.");
      return;
    }

    setProcessingStatus(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;

    try {
      if (token) {
        const res = await fetch(`${API_URL}/users/${targetUser.id}/status`, {
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

    setClients((prev) =>
      prev.map((c) =>
        c.id === targetUser.id
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

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || "").toLowerCase().includes(search.toLowerCase()) ||
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
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                Sesión Desactualizada Detectada
              </h4>
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
            Re-iniciar Sesión
          </button>
        </div>
      )}

      {globalNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{globalNotice}</span>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Clientes (CRM)</h1>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          BASE DE DATOS CENTRALIZADA, EDICIÓN DE FICHAS Y CONTROL DE ACCESO
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">TOTAL CLIENTES</span>
            <div className="text-3xl font-black text-slate-900 font-mono">{clients.length}</div>
            <span className="text-[10px] font-bold text-emerald-600">
              ↗ {clients.filter((c) => c.active !== false).length} Activos
            </span>
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
              EDICIÓN DE CONTACTO, DIRECCIONES Y ESTADO DE CUENTA
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, email, teléfono o casillero..."
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
                    <th className="py-4 px-4 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {paginatedClients.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => handleOpenClientDetail(c)}
                            className="font-bold text-slate-900 hover:text-amber-600 text-left block transition-colors"
                          >
                            {c.name}
                          </button>
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
                              <p
                                className="text-[10px] text-rose-600 font-bold max-w-xs truncate"
                                title={c.disabledReason}
                              >
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
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenClientDetail(c)}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 font-bold text-[10px] flex items-center gap-1 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-700" /> Editar / Ficha
                          </button>

                          {c.active !== false ? (
                            <button
                              type="button"
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
                              type="button"
                              onClick={() => handleToggleStatus(c, true)}
                              disabled={processingStatus}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> Reactivar
                            </button>
                          )}
                        </div>
                      </td>
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

      {/* Modal de Ficha y Edición de Cliente (OBS-13) */}
      {selectedClient && modalMode === "view" && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedClient(null);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shadow-sm">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Ficha y Corrección de Datos del Cliente</h3>
                  <p className="text-xs font-mono font-bold text-amber-600">
                    {selectedClient.suiteCode || "CAS-PENDIENTE"} • Registrado:{" "}
                    {selectedClient.createdAt ? selectedClient.createdAt.split("T")[0] : "Reciente"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{detailSuccess}</span>
              </div>
            )}

            {detailError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{detailError}</span>
              </div>
            )}

            {/* Formulario de Datos Personales y Casillero */}
            <form onSubmit={handleSaveClientData} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  1. Datos de Contacto y Casillero
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Al guardar se notifica automáticamente al cliente
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Ej. +58 412 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Código de Casillero (Suite ID)
                  </label>
                  <input
                    type="text"
                    value={editSuiteCode}
                    onChange={(e) => setEditSuiteCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-amber-800 focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingClient}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                >
                  {savingClient ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar Datos de Contacto
                </button>
              </div>
            </form>

            {/* Direcciones de Entrega (Destinatarios) y de Recogida */}
            {loadingDetail ? (
              <div className="p-6 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> Cargando libreta de direcciones del cliente...
              </div>
            ) : (
              <div className="space-y-5">
                {/* Destinatarios Guardados (Direcciones de Entrega) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <BookUser className="w-4 h-4 text-amber-600" /> 2. Destinatarios y Direcciones de Entrega (
                      {selectedClient.savedRecipients?.length || 0})
                    </span>
                  </div>

                  {!selectedClient.savedRecipients || selectedClient.savedRecipients.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400 text-center">
                      El cliente no tiene destinatarios de entrega guardados.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedClient.savedRecipients.map((r) => (
                        <div key={r.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                          {editingRecipientId === r.id ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <input
                                  type="text"
                                  value={recForm.name}
                                  onChange={(e) => setRecForm({ ...recForm, name: e.target.value })}
                                  placeholder="Nombre destinatario"
                                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                                />
                                <input
                                  type="text"
                                  value={recForm.phone}
                                  onChange={(e) => setRecForm({ ...recForm, phone: e.target.value })}
                                  placeholder="Teléfono principal"
                                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                                />
                                <input
                                  type="text"
                                  value={recForm.city}
                                  onChange={(e) => setRecForm({ ...recForm, city: e.target.value })}
                                  placeholder="Ciudad destino"
                                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                                />
                              </div>
                              <input
                                type="text"
                                value={recForm.address}
                                onChange={(e) => setRecForm({ ...recForm, address: e.target.value })}
                                placeholder="Dirección exacta de entrega"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingRecipientId(null)}
                                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  disabled={savingSubItem}
                                  onClick={() => handleSaveRecipient(r.id)}
                                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                >
                                  {savingSubItem ? "Guardando..." : "Guardar Dirección"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="space-y-0.5 text-xs">
                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                  <span>{r.name}</span>
                                  <span className="font-mono text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    {r.phone}
                                  </span>
                                </div>
                                <p className="text-slate-600 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {r.address}{" "}
                                  {r.city ? `(${r.city})` : ""}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingRecipientId(r.id);
                                  setRecForm({
                                    name: r.name || "",
                                    phone: r.phone || "",
                                    phone2: r.phone2 || "",
                                    address: r.address || "",
                                    city: r.city || "",
                                  });
                                }}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-[11px] font-bold text-slate-700 shrink-0 self-start sm:self-center"
                              >
                                Corregir Dirección
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direcciones de Recogida (Pickups) */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-amber-600" /> 3. Direcciones de Recogida para Pickups (
                    {selectedClient.savedAddresses?.length || 0})
                  </span>

                  {!selectedClient.savedAddresses || selectedClient.savedAddresses.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400 text-center">
                      El cliente no tiene direcciones de recogida guardadas.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedClient.savedAddresses.map((a) => (
                        <div key={a.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                          {editingAddressId === a.id ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <input
                                  type="text"
                                  value={addrForm.label}
                                  onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                                  placeholder="Etiqueta (Ej. Casa, Oficina)"
                                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                                />
                                <input
                                  type="text"
                                  value={addrForm.city}
                                  onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                                  placeholder="Ciudad"
                                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                                />
                              </div>
                              <input
                                type="text"
                                value={addrForm.address}
                                onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })}
                                placeholder="Dirección física de recogida"
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingAddressId(null)}
                                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  disabled={savingSubItem}
                                  onClick={() => handleSaveAddress(a.id)}
                                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                >
                                  {savingSubItem ? "Guardando..." : "Guardar Dirección"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="space-y-0.5 text-xs">
                                <div className="font-bold text-slate-900">
                                  {a.label} <span className="text-slate-400 font-normal">({a.city})</span>
                                </div>
                                <p className="text-slate-600">{a.address}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAddressId(a.id);
                                  setAddrForm({
                                    label: a.label || "",
                                    address: a.address || "",
                                    city: a.city || "",
                                    contactName: a.contactName || "",
                                    contactPhone: a.contactPhone || "",
                                  });
                                }}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-[11px] font-bold text-slate-700 shrink-0 self-start sm:self-center"
                              >
                                Corregir
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

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
                El motivo que ingreses a continuación es{" "}
                <strong>exclusivamente para control interno del administrador</strong>. El cliente únicamente recibirá
                el aviso general: <em>&ldquo;Tu cuenta se encuentra inhabilitada hasta nuevo aviso.&rdquo;</em>
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

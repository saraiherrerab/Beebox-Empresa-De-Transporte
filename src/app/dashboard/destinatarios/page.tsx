"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  MapPin,
  Plus,
  Search,
  Phone,
  Globe,
  Trash2,
  Edit2,
  CheckCircle2,
  BookmarkCheck,
  User,
  Home,
  Building2,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/config/api";
import { SavedRecipient } from "@/components/client/PickupWizardStep3";
import { SavedAddress } from "@/components/client/PickupWizardStep1";

const STORAGE_KEY_RECIPIENTS = "beebox_saved_recipients";
const STORAGE_KEY_ADDRESSES = "beebox_saved_addresses";

export default function DestinatariosPage() {
  const [activeTab, setActiveTab] = useState<"destinatarios" | "direcciones">("destinatarios");
  const [searchTerm, setSearchTerm] = useState("");

  // Destinatarios State
  const [recipients, setRecipients] = useState<SavedRecipient[]>([]);
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [editingRecipientId, setEditingRecipientId] = useState<string | null>(null);
  const [recName, setRecName] = useState("");
  const [recPhone1, setRecPhone1] = useState("");
  const [recPhone2, setRecPhone2] = useState("");
  const [recAddress, setRecAddress] = useState("");
  const [recCity, setRecCity] = useState("");

  // Direcciones de Recogida State
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState("Casa / Domicilio");
  const [addrAddress, setAddrAddress] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrContactName, setAddrContactName] = useState("");
  const [addrContactPhone, setAddrContactPhone] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  // Load from LocalStorage and Backend on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedRec = localStorage.getItem(STORAGE_KEY_RECIPIENTS);
        if (storedRec) {
          const parsed = JSON.parse(storedRec);
          if (Array.isArray(parsed)) setRecipients(parsed);
        }

        const storedAddr = localStorage.getItem(STORAGE_KEY_ADDRESSES);
        if (storedAddr) {
          const parsed = JSON.parse(storedAddr);
          if (Array.isArray(parsed)) setAddresses(parsed);
        }
      } catch (e) {
        console.error("Error reading storage:", e);
      }
    }

    // Backend sync for recipients
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/recipients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.recipients) && data.recipients.length > 0) {
            setRecipients(data.recipients);
            localStorage.setItem(STORAGE_KEY_RECIPIENTS, JSON.stringify(data.recipients));
          }
        })
        .catch(() => {});
    }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Recipient Handlers
  const handleOpenAddRecipient = () => {
    setEditingRecipientId(null);
    setRecName("");
    setRecPhone1("");
    setRecPhone2("");
    setRecAddress("");
    setRecCity("");
    setIsRecipientModalOpen(true);
  };

  const handleOpenEditRecipient = (r: SavedRecipient) => {
    setEditingRecipientId(r.id);
    setRecName(r.name);
    setRecPhone1(r.phone);
    setRecPhone2(r.phone2 || "");
    setRecAddress(r.address);
    setRecCity(r.city);
    setIsRecipientModalOpen(true);
  };

  const handleSaveRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recName.trim() || !recPhone1.trim() || !recAddress.trim() || !recCity.trim()) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const item: SavedRecipient = {
      id: editingRecipientId || `rec_${Date.now()}`,
      name: recName.trim(),
      phone: recPhone1.trim(),
      phone2: recPhone2.trim(),
      address: recAddress.trim(),
      city: recCity.trim(),
    };

    let updated: SavedRecipient[];
    if (editingRecipientId) {
      updated = recipients.map((r) => (r.id === editingRecipientId ? item : r));
      showNotification("Destinatario actualizado correctamente");
    } else {
      updated = [item, ...recipients];
      showNotification("Nuevo destinatario guardado con éxito");
    }

    setRecipients(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_RECIPIENTS, JSON.stringify(updated));
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/recipients`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(item),
      }).catch(() => {});
    }

    setIsRecipientModalOpen(false);
  };

  const handleDeleteRecipient = (id: string) => {
    if (!confirm("¿Deseas eliminar este destinatario de tu libreta?")) return;
    const updated = recipients.filter((r) => r.id !== id);
    setRecipients(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_RECIPIENTS, JSON.stringify(updated));
    }
    showNotification("Destinatario eliminado de la libreta");
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrLabel("Casa / Domicilio");
    setAddrAddress("");
    setAddrCity("");
    setAddrContactName("");
    setAddrContactPhone("");
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (a: SavedAddress) => {
    setEditingAddressId(a.id);
    setAddrLabel(a.label);
    setAddrAddress(a.address);
    setAddrCity(a.city);
    setAddrContactName(a.contactName || "");
    setAddrContactPhone(a.contactPhone || "");
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrAddress.trim() || !addrCity.trim()) {
      alert("Por favor ingresa la dirección y ciudad.");
      return;
    }

    const item: SavedAddress = {
      id: editingAddressId || `addr_${Date.now()}`,
      label: addrLabel.trim() || "Dirección",
      address: addrAddress.trim(),
      city: addrCity.trim(),
      contactName: addrContactName.trim(),
      contactPhone: addrContactPhone.trim(),
    };

    let updated: SavedAddress[];
    if (editingAddressId) {
      updated = addresses.map((a) => (a.id === editingAddressId ? item : a));
      showNotification("Dirección actualizada correctamente");
    } else {
      updated = [item, ...addresses];
      showNotification("Nueva dirección guardada con éxito");
    }

    setAddresses(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
    }

    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    if (!confirm("¿Deseas eliminar esta dirección de recogida?")) return;
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
    }
    showNotification("Dirección eliminada de la libreta");
  };

  // Filtered lists
  const filteredRecipients = recipients.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q)
    );
  });

  const filteredAddresses = addresses.filter((a) => {
    const q = searchTerm.toLowerCase();
    return (
      a.label.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q) ||
      (a.contactName && a.contactName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Notice */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Libreta de Destinatarios y Direcciones
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Gestiona los destinatarios frecuentes de tus envíos y tus direcciones habituales de recolección.
          </p>
        </div>

        {/* Action Button */}
        {activeTab === "destinatarios" ? (
          <Button
            onClick={handleOpenAddRecipient}
            variant="amber"
            className="rounded-2xl px-5 py-2.5 font-black text-xs uppercase shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo Destinatario
          </Button>
        ) : (
          <Button
            onClick={handleOpenAddAddress}
            variant="amber"
            className="rounded-2xl px-5 py-2.5 font-black text-xs uppercase shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nueva Dirección
          </Button>
        )}
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("destinatarios")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${
              activeTab === "destinatarios"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Destinatarios ({recipients.length})
          </button>

          <button
            onClick={() => setActiveTab("direcciones")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${
              activeTab === "direcciones"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Direcciones de Recogida ({addresses.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === "destinatarios"
                ? "Buscar por nombre, teléfono, ciudad..."
                : "Buscar por etiqueta, dirección..."
            }
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* TAB 1: DESTINATARIOS */}
      {activeTab === "destinatarios" && (
        <div>
          {filteredRecipients.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {recipients.length === 0
                  ? "Aún no tienes destinatarios guardados"
                  : "No se encontraron destinatarios con esa búsqueda"}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {recipients.length === 0
                  ? "Guarda las personas o empresas que recibirán tus paquetes en destino. Al solicitar un pickup podrás seleccionarlos en 1 clic."
                  : "Prueba con otro término de búsqueda o limpia el filtro."}
              </p>
              {recipients.length === 0 && (
                <Button
                  onClick={handleOpenAddRecipient}
                  variant="amber"
                  className="rounded-2xl px-6 py-2.5 font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Agregar Mi Primer Destinatario
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipients.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 font-bold flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 leading-tight">{rec.name}</h4>
                          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-slate-400" /> {rec.city}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditRecipient(rec)}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                          title="Editar destinatario"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecipient(rec.id)}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                          title="Eliminar destinatario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-medium leading-relaxed">{rec.address}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Teléfono 1:</span>
                        <span className="font-mono font-bold text-slate-800">{rec.phone}</span>
                      </div>
                      {rec.phone2 && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Teléfono 2:</span>
                          <span className="font-mono font-bold text-slate-600">{rec.phone2}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <BookmarkCheck className="w-3 h-3 text-emerald-500" /> Disponible en Pickups
                    </span>
                    <button
                      onClick={() => handleOpenEditRecipient(rec)}
                      className="text-amber-600 font-bold hover:underline"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DIRECCIONES DE RECOGIDA */}
      {activeTab === "direcciones" && (
        <div>
          {filteredAddresses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {addresses.length === 0
                  ? "Aún no tienes direcciones de recogida guardadas"
                  : "No se encontraron direcciones con esa búsqueda"}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {addresses.length === 0
                  ? "Guarda tu domicilio, oficina o bodega para autoseleccionarla al solicitar una recolección en tu puerta."
                  : "Prueba con otro término de búsqueda o limpia el filtro."}
              </p>
              {addresses.length === 0 && (
                <Button
                  onClick={handleOpenAddAddress}
                  variant="amber"
                  className="rounded-2xl px-6 py-2.5 font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Agregar Mi Primera Dirección
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 font-bold flex items-center justify-center">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 leading-tight">{addr.label}</h4>
                          <span className="text-[10px] font-semibold text-slate-400">{addr.city}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                          title="Editar dirección"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                          title="Eliminar dirección"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">DIRECCIÓN:</span>
                      <p className="text-[11px] font-medium text-slate-800 leading-relaxed">{addr.address}</p>
                    </div>

                    {(addr.contactName || addr.contactPhone) && (
                      <div className="space-y-1 text-xs pt-1">
                        {addr.contactName && (
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-slate-400">Contacto:</span>
                            <span className="font-semibold text-slate-800">{addr.contactName}</span>
                          </div>
                        )}
                        {addr.contactPhone && (
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-slate-400">Teléfono:</span>
                            <span className="font-mono font-bold text-slate-800">{addr.contactPhone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <BookmarkCheck className="w-3 h-3 text-emerald-500" /> Disponible en Paso 1 de Pickups
                    </span>
                    <button onClick={() => handleOpenEditAddress(addr)} className="text-amber-600 font-bold hover:underline">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: AGREGAR / EDITAR DESTINATARIO */}
      {isRecipientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {editingRecipientId ? "Editar Destinatario" : "Nuevo Destinatario Internacional"}
                </h3>
              </div>
              <button
                onClick={() => setIsRecipientModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipient} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nombre Completo / Razón Social *
                </label>
                <input
                  type="text"
                  required
                  value={recName}
                  onChange={(e) => setRecName(e.target.value)}
                  placeholder="Ej. Carlos Salazar o Inversiones Alfa C.A."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Teléfono 1 (Principal - WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={recPhone1}
                    onChange={(e) => setRecPhone1(e.target.value)}
                    placeholder="Ej. +58 412 555 1234"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Teléfono 2 (Secundario / Alternativo)
                  </label>
                  <input
                    type="tel"
                    value={recPhone2}
                    onChange={(e) => setRecPhone2(e.target.value)}
                    placeholder="Ej. +58 414 777 8899"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Ciudad y País de Destino *
                </label>
                <input
                  type="text"
                  required
                  value={recCity}
                  onChange={(e) => setRecCity(e.target.value)}
                  placeholder="Ej. Caracas, Venezuela o Valencia, España"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Dirección Exacta de Entrega *
                </label>
                <textarea
                  rows={3}
                  required
                  value={recAddress}
                  onChange={(e) => setRecAddress(e.target.value)}
                  placeholder="Calle, avenida, edificio, número de casa, piso o sector..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setIsRecipientModalOpen(false)}
                  variant="outline"
                  className="rounded-xl px-4 py-2 text-xs font-bold"
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="amber" className="rounded-xl px-6 py-2 text-xs font-bold">
                  {editingRecipientId ? "Guardar Cambios" : "Guardar Destinatario"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR / EDITAR DIRECCIÓN DE RECOGIDA */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {editingAddressId ? "Editar Dirección de Recogida" : "Nueva Dirección de Recogida"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Etiqueta de la Dirección *
                </label>
                <input
                  type="text"
                  required
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  placeholder="Ej. Casa, Oficina, Almacén Central..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Dirección Exacta de Recogida *
                </label>
                <textarea
                  rows={2}
                  required
                  value={addrAddress}
                  onChange={(e) => setAddrAddress(e.target.value)}
                  placeholder="Calle, número exterior/interior, urbanización o sector..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Ciudad / Estado *
                </label>
                <input
                  type="text"
                  required
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  placeholder="Ej. Broken Arrow, OK"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Nombre del Contacto en el Lugar
                  </label>
                  <input
                    type="text"
                    value={addrContactName}
                    onChange={(e) => setAddrContactName(e.target.value)}
                    placeholder="Ej. Nombre de quien entrega"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Teléfono del Contacto
                  </label>
                  <input
                    type="tel"
                    value={addrContactPhone}
                    onChange={(e) => setAddrContactPhone(e.target.value)}
                    placeholder="Ej. +1 (918) 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  variant="outline"
                  className="rounded-xl px-4 py-2 text-xs font-bold"
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="amber" className="rounded-xl px-6 py-2 text-xs font-bold">
                  {editingAddressId ? "Guardar Cambios" : "Guardar Dirección"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

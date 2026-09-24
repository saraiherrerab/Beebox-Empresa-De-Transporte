"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Phone,
  Globe,
  Trash2,
  Edit2,
  CheckCircle2,
  BookmarkCheck,
  User,
  MapPin,
  X,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/config/api";
import { SavedRecipient } from "@/components/client/PickupWizardStep3";

const STORAGE_KEY_RECIPIENTS = "beebox_saved_recipients";

export default function DestinatariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipients, setRecipients] = useState<SavedRecipient[]>([]);
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [editingRecipientId, setEditingRecipientId] = useState<string | null>(null);

  // Form fields
  const [recName, setRecName] = useState("");
  const [recPhone1, setRecPhone1] = useState("");
  const [recPhone2, setRecPhone2] = useState("");
  const [recAddress, setRecAddress] = useState("");
  const [recCity, setRecCity] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedRec = localStorage.getItem(STORAGE_KEY_RECIPIENTS);
        if (storedRec) {
          const parsed = JSON.parse(storedRec);
          if (Array.isArray(parsed)) setRecipients(parsed);
        }
      } catch (e) {
        console.error("Error loading recipients:", e);
      }
    }

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

  const handleOpenAdd = () => {
    setEditingRecipientId(null);
    setRecName("");
    setRecPhone1("");
    setRecPhone2("");
    setRecAddress("");
    setRecCity("");
    setIsRecipientModalOpen(true);
  };

  const handleOpenEdit = (r: SavedRecipient) => {
    setEditingRecipientId(r.id);
    setRecName(r.name);
    setRecPhone1(r.phone);
    setRecPhone2(r.phone2 || "");
    setRecAddress(r.address);
    setRecCity(r.city);
    setIsRecipientModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recName.trim() || !recPhone1.trim() || !recAddress.trim() || !recCity.trim()) {
      alert("Por favor completa los campos obligatorios (*).");
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

  const handleDelete = (id: string) => {
    if (!confirm("¿Deseas eliminar este destinatario de tu libreta?")) return;
    const updated = recipients.filter((r) => r.id !== id);
    setRecipients(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_RECIPIENTS, JSON.stringify(updated));
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/recipients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    showNotification("Destinatario eliminado de la libreta");
  };

  const filtered = recipients.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      (r.phone2 && r.phone2.toLowerCase().includes(q)) ||
      r.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
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
            Mis Destinatarios Internacionales
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Gestiona las personas o empresas que reciben tus paquetes en el país de destino.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="amber"
          className="rounded-2xl px-5 py-2.5 font-black text-xs uppercase shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo Destinatario
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            Total Destinatarios: {recipients.length}
          </span>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, teléfono, ciudad..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Recipient Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {recipients.length === 0
              ? "Aún no tienes destinatarios guardados"
              : "No se encontraron destinatarios con esa búsqueda"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {recipients.length === 0
              ? "Guarda las personas que recibirán tus envíos internacionales. Al solicitar un pickup podrás seleccionarlos en un clic para autocompletar toda su información."
              : "Intenta con otro término o limpia el buscador para ver todos tus contactos."}
          </p>
          {recipients.length === 0 && (
            <Button
              onClick={handleOpenAdd}
              variant="amber"
              className="rounded-2xl px-6 py-2.5 font-bold text-xs uppercase"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Agregar Mi Primer Destinatario
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rec) => (
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
                      onClick={() => handleOpenEdit(rec)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                      title="Editar destinatario"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(rec.id)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
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
                    <span className="text-[10px] font-bold uppercase text-slate-400">Teléfono Principal:</span>
                    <span className="font-mono font-bold text-slate-800">{rec.phone}</span>
                  </div>
                  {rec.phone2 && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Teléfono Secundario:</span>
                      <span className="font-mono font-bold text-slate-600">{rec.phone2}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <BookmarkCheck className="w-3 h-3 text-emerald-500" /> Disponible en Paso 3 de Pickups
                </span>
                <button
                  onClick={() => handleOpenEdit(rec)}
                  className="text-amber-600 font-bold hover:underline cursor-pointer"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Agregar / Editar Destinatario */}
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
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
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
                  Dirección Exacta de Entrega en Destino *
                </label>
                <textarea
                  rows={3}
                  required
                  value={recAddress}
                  onChange={(e) => setRecAddress(e.target.value)}
                  placeholder="Calle, avenida, edificio, número de casa, piso, urbanización o sector..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setIsRecipientModalOpen(false)}
                  variant="outline"
                  className="rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="amber" className="rounded-xl px-6 py-2 text-xs font-bold cursor-pointer">
                  {editingRecipientId ? "Guardar Cambios" : "Guardar Destinatario"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

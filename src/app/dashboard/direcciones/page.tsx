"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Search,
  Phone,
  Trash2,
  Edit2,
  CheckCircle2,
  BookmarkCheck,
  Home,
  Building2,
  X,
  Truck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SavedAddress } from "@/components/client/PickupWizardStep1";

const STORAGE_KEY_ADDRESSES = "beebox_saved_addresses";

export default function DireccionesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Form fields
  const [addrLabel, setAddrLabel] = useState("Casa / Domicilio");
  const [addrAddress, setAddrAddress] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrContactName, setAddrContactName] = useState("");
  const [addrContactPhone, setAddrContactPhone] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedAddr = localStorage.getItem(STORAGE_KEY_ADDRESSES);
        if (storedAddr) {
          const parsed = JSON.parse(storedAddr);
          if (Array.isArray(parsed)) setAddresses(parsed);
        }
      } catch (e) {
        console.error("Error loading addresses:", e);
      }
    }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingAddressId(null);
    setAddrLabel("Casa / Domicilio");
    setAddrAddress("");
    setAddrCity("");
    setAddrContactName("");
    setAddrContactPhone("");
    setIsAddressModalOpen(true);
  };

  const handleOpenEdit = (a: SavedAddress) => {
    setEditingAddressId(a.id);
    setAddrLabel(a.label);
    setAddrAddress(a.address);
    setAddrCity(a.city);
    setAddrContactName(a.contactName || "");
    setAddrContactPhone(a.contactPhone || "");
    setIsAddressModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrAddress.trim() || !addrCity.trim()) {
      alert("Por favor ingresa la dirección exacta y la ciudad.");
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
      showNotification("Nueva dirección de recolección guardada");
    }

    setAddresses(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
    }

    setIsAddressModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Deseas eliminar esta dirección de recogida?")) return;
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
    }
    showNotification("Dirección eliminada de la libreta");
  };

  const filtered = addresses.filter((a) => {
    const q = searchTerm.toLowerCase();
    return (
      a.label.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q) ||
      (a.contactName && a.contactName.toLowerCase().includes(q)) ||
      (a.contactPhone && a.contactPhone.toLowerCase().includes(q))
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
            Mis Direcciones de Recogida
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Gestiona los lugares habituales donde nuestro chofer retira tus cajas (casa, oficina, almacén).
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="amber"
          className="rounded-2xl px-5 py-2.5 font-black text-xs uppercase shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nueva Dirección
        </Button>
      </div>

      {/* Search and Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            Total Direcciones: {addresses.length}
          </span>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por etiqueta, calle, ciudad..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Address Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {addresses.length === 0
              ? "Aún no tienes direcciones de recogida guardadas"
              : "No se encontraron direcciones con esa búsqueda"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {addresses.length === 0
              ? "Guarda tu casa, oficina o bodega. Al solicitar un pickup a domicilio, podrás seleccionarla en 1 clic para no escribir tu dirección cada vez."
              : "Intenta con otro término o limpia el buscador para ver todas tus direcciones."}
          </p>
          {addresses.length === 0 && (
            <Button
              onClick={handleOpenAdd}
              variant="amber"
              className="rounded-2xl px-6 py-2.5 font-bold text-xs uppercase"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Agregar Mi Primera Dirección
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((addr) => (
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
                      onClick={() => handleOpenEdit(addr)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                      title="Editar dirección"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
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
                <button
                  onClick={() => handleOpenEdit(addr)}
                  className="text-amber-600 font-bold hover:underline cursor-pointer"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Agregar / Editar Dirección */}
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
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
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
                  placeholder="Calle, número de casa/edificio, piso, sector o referencias de llegada..."
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
                  placeholder="Ej. Broken Arrow, OK o Tulsa, OK"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Nombre del Contacto (Opcional)
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
                    Teléfono del Contacto (Opcional)
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
                  className="rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="amber" className="rounded-xl px-6 py-2 text-xs font-bold cursor-pointer">
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

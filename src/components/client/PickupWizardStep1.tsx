"use client";

import React, { useState, useEffect } from "react";
import { Home, Building2, Plus, Info, MapPin, User, Phone, Bookmark, Check, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  contactName?: string;
  contactPhone?: string;
}

interface PickupWizardStep1Props {
  onNext: () => void;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  onUpdateData: (data: {
    senderName: string;
    senderPhone: string;
    senderAddress: string;
    senderCity: string;
  }) => void;
}

const STORAGE_KEY_ADDRESSES = "beebox_saved_addresses";

export const PickupWizardStep1: React.FC<PickupWizardStep1Props> = ({
  onNext,
  senderName: initialSenderName,
  senderPhone: initialSenderPhone,
  senderAddress: initialSenderAddress,
  senderCity: initialSenderCity,
  onUpdateData,
}) => {
  const { user } = useAuth();
  const [selectedAddressMode, setSelectedAddressMode] = useState<string>("custom");
  const [senderName, setSenderName] = useState(initialSenderName || user?.name || "");
  const [senderPhone, setSenderPhone] = useState(initialSenderPhone || user?.phone || "");
  const [senderAddress, setSenderAddress] = useState(initialSenderAddress || "");
  const [senderCity, setSenderCity] = useState(initialSenderCity || "");
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Casa / Domicilio");

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  // Cargar direcciones guardadas reales del usuario
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_ADDRESSES);
        if (stored) {
          const list: SavedAddress[] = JSON.parse(stored);
          setSavedAddresses(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("Error al cargar direcciones guardadas:", err);
      }
    }
  }, []);

  // Si cambia el usuario autenticado y los campos están vacíos, completarlos con su perfil real
  useEffect(() => {
    if (user?.name && !senderName) {
      setSenderName(user.name);
      notifyChange(user.name, senderPhone, senderAddress, senderCity);
    }
    if (user?.phone && !senderPhone) {
      setSenderPhone(user.phone);
      notifyChange(senderName, user.phone, senderAddress, senderCity);
    }
  }, [user]);

  const notifyChange = (
    name = senderName,
    phone = senderPhone,
    addr = senderAddress,
    city = senderCity
  ) => {
    onUpdateData({
      senderName: name,
      senderPhone: phone,
      senderAddress: addr,
      senderCity: city,
    });
  };

  const handleSelectSavedAddress = (addrItem: SavedAddress | "custom") => {
    if (addrItem === "custom") {
      setSelectedAddressMode("custom");
      return;
    }
    setSelectedAddressMode(addrItem.id);
    setSenderAddress(addrItem.address);
    setSenderCity(addrItem.city);
    if (addrItem.contactName && !senderName) setSenderName(addrItem.contactName);
    if (addrItem.contactPhone && !senderPhone) setSenderPhone(addrItem.contactPhone);
    notifyChange(
      addrItem.contactName || senderName,
      addrItem.contactPhone || senderPhone,
      addrItem.address,
      addrItem.city
    );
  };

  const handleSaveCurrentAddress = () => {
    if (!senderAddress.trim() || !senderCity.trim()) return;

    const newAddr: SavedAddress = {
      id: `addr_${Date.now()}`,
      label: addressLabel.trim() || "Dirección",
      address: senderAddress.trim(),
      city: senderCity.trim(),
      contactName: senderName.trim(),
      contactPhone: senderPhone.trim(),
    };

    const updated = [newAddr, ...savedAddresses];
    setSavedAddresses(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
      } catch {}
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left 2 Cols: Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              1. Datos del Remitente y Lugar de Recolección
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa los datos de contacto y la ubicación exacta donde nuestro chofer retirará los paquetes.
            </p>
          </div>

          {/* Selector de Direcciones Guardadas (Solo si existen direcciones reales) */}
          {savedAddresses.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Direcciones Frecuentes Guardadas
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Selecciona una para autocompletar
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => handleSelectSavedAddress("custom")}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedAddressMode === "custom"
                      ? "border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block leading-tight">
                        Nueva Dirección
                      </span>
                      <span className="text-[10px] text-slate-500">Ingresar manualmente</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="addrOption"
                    checked={selectedAddressMode === "custom"}
                    onChange={() => handleSelectSavedAddress("custom")}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                </div>

                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressMode === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="overflow-hidden pr-2">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 truncate">
                          <Home className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {addr.label}
                        </span>
                        <p className="text-[11px] text-slate-600 truncate mt-0.5">{addr.address}</p>
                        <span className="text-[10px] text-slate-400 font-semibold">{addr.city}</span>
                      </div>
                      <input
                        type="radio"
                        name="addrOption"
                        checked={isSelected}
                        onChange={() => handleSelectSavedAddress(addr)}
                        className="text-amber-500 focus:ring-amber-500 shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Ingresa la dirección donde retiraremos tus cajas. Podrás guardarla al final para futuras solicitudes.
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 space-y-4">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
              Detalles Específicos de Recogida
            </span>

            {/* Remitente y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nombre de Quien Entrega (Remitente) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => {
                      setSenderName(e.target.value);
                      notifyChange(e.target.value, senderPhone, senderAddress, senderCity);
                    }}
                    placeholder="Tu nombre completo o razón social"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Teléfono de Contacto (Chofer) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => {
                      setSenderPhone(e.target.value);
                      notifyChange(senderName, e.target.value, senderAddress, senderCity);
                    }}
                    placeholder="Ej. +1 (918) 555-0199"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Dirección y Ciudad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dirección Completa de Recogida *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <textarea
                    rows={2}
                    required
                    value={senderAddress}
                    onChange={(e) => {
                      setSelectedAddressMode("custom");
                      setSenderAddress(e.target.value);
                      notifyChange(senderName, senderPhone, e.target.value, senderCity);
                    }}
                    placeholder="Calle, número de casa/edificio, piso, sector o referencias de llegada..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ciudad / Estado *
                </label>
                <input
                  type="text"
                  required
                  value={senderCity}
                  onChange={(e) => {
                    setSenderCity(e.target.value);
                    notifyChange(senderName, senderPhone, senderAddress, e.target.value);
                  }}
                  placeholder="Ej. Broken Arrow, OK"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Opción para guardar la dirección */}
            {selectedAddressMode === "custom" && senderAddress.trim() && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 animate-in fade-in">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900">
                  <input
                    type="checkbox"
                    checked={saveAddressForFuture}
                    onChange={(e) => {
                      setSaveAddressForFuture(e.target.checked);
                      if (e.target.checked) handleSaveCurrentAddress();
                    }}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Guardar esta dirección en mi libreta para próximas recolecciones</span>
                </label>

                {saveAddressForFuture && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0">Etiqueta:</span>
                    <input
                      type="text"
                      value={addressLabel}
                      onChange={(e) => setAddressLabel(e.target.value)}
                      placeholder="Ej. Casa, Oficina, Almacén..."
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Col: Helper Guide */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
            <Info className="w-4 h-4 text-amber-500" /> Recolección en Domicilio
          </div>
          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <h4 className="font-bold text-slate-800">Unidad de Flota Asignada</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Nuestras unidades móviles y choferes cubrirán la ruta según la franja horaria que elijas en el paso 4.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Confirmación Previa</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                El chofer se comunicará al teléfono indicado antes de arribar al punto de recogida.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-xl space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">BEEBOX EXPRESS</span>
          <h4 className="text-sm font-bold leading-snug">¿Necesitas coordinar un horario especial para tu recogida?</h4>
          <p className="text-[11px] text-slate-400">
            Puedes indicarlo en las notas del chofer en el paso 2 o contactar a soporte para rutas corporativas.
          </p>
        </div>
      </div>
    </div>
  );
};

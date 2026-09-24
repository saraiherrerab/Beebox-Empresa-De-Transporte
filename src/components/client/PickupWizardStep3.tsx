"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Globe, BookmarkCheck, Plus, Check, Sparkles } from "lucide-react";
import { API_URL } from "@/config/api";

export interface SavedRecipient {
  id: string;
  name: string;
  phone: string;
  phone2?: string;
  address: string;
  city: string;
}

interface PickupWizardStep3Props {
  onNext: () => void;
  onBack: () => void;
  recipientName: string;
  recipientPhone: string;
  recipientPhone2?: string;
  recipientAddress: string;
  recipientCity: string;
  onUpdateData: (data: {
    recipientName: string;
    recipientPhone: string;
    recipientPhone2: string;
    recipientAddress: string;
    recipientCity: string;
  }) => void;
}

const STORAGE_KEY = "beebox_saved_recipients";

export const PickupWizardStep3: React.FC<PickupWizardStep3Props> = ({
  onNext,
  onBack,
  recipientName: initialRecipientName,
  recipientPhone: initialRecipientPhone,
  recipientPhone2: initialRecipientPhone2 = "",
  recipientAddress: initialRecipientAddress,
  recipientCity: initialRecipientCity,
  onUpdateData,
}) => {
  const [recipientName, setRecipientName] = useState(initialRecipientName || "");
  const [primaryPhone, setPrimaryPhone] = useState(initialRecipientPhone || "");
  const [secondaryPhone, setSecondaryPhone] = useState(initialRecipientPhone2 || "");
  const [address, setAddress] = useState(initialRecipientAddress || "");
  const [city, setCity] = useState(initialRecipientCity || "Caracas, Venezuela");

  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>("custom");

  // Load saved recipients from local storage & API
  useEffect(() => {
    let localList: SavedRecipient[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          localList = JSON.parse(stored);
        }
      } catch (err) {
        console.error("Error loading recipients from localStorage:", err);
      }
    }

    // Default suggestions if none saved yet
    if (localList.length === 0) {
      localList = [
        {
          id: "rec_default_1",
          name: "Carlos Salazar",
          phone: "+58 412 555 1234",
          phone2: "+58 414 777 8899",
          address: "Calle Reforma 456, Urb Las Mercedes",
          city: "Caracas, Venezuela",
        },
        {
          id: "rec_default_2",
          name: "María Fernández",
          phone: "+58 424 999 1122",
          phone2: "+58 416 333 4455",
          address: "Av. 4 Bella Vista con Calle 72, Edif. Panamericano",
          city: "Maracaibo, Venezuela",
        },
      ];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(localList));
        } catch {}
      }
    }

    setSavedRecipients(localList);

    // Also attempt fetching from backend API
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/recipients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.recipients) && data.recipients.length > 0) {
            setSavedRecipients(data.recipients);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.recipients));
          }
        })
        .catch(() => {
          // Graceful fallback to local storage
        });
    }
  }, []);

  const notifyChange = (
    rName = recipientName,
    rPhone = primaryPhone,
    rPhone2 = secondaryPhone,
    rAddr = address,
    rCity = city
  ) => {
    onUpdateData({
      recipientName: rName,
      recipientPhone: rPhone,
      recipientPhone2: rPhone2,
      recipientAddress: rAddr,
      recipientCity: rCity,
    });
  };

  const handleSelectSavedRecipient = (recId: string) => {
    setSelectedRecipientId(recId);
    if (recId === "custom") {
      return;
    }
    const target = savedRecipients.find((r) => r.id === recId);
    if (target) {
      setRecipientName(target.name);
      setPrimaryPhone(target.phone);
      setSecondaryPhone(target.phone2 || "");
      setAddress(target.address);
      setCity(target.city);
      notifyChange(target.name, target.phone, target.phone2 || "", target.address, target.city);
    }
  };

  const saveRecipientToStorageAndApi = () => {
    if (!recipientName.trim() || !primaryPhone.trim() || !address.trim()) {
      return;
    }

    const newRecipient: SavedRecipient = {
      id: selectedRecipientId !== "custom" ? selectedRecipientId : `rec_${Date.now()}`,
      name: recipientName.trim(),
      phone: primaryPhone.trim(),
      phone2: secondaryPhone.trim(),
      address: address.trim(),
      city: city.trim() || "Caracas, Venezuela",
    };

    // Update in local state & localStorage
    setSavedRecipients((prev) => {
      const existsIndex = prev.findIndex(
        (r) => r.id === newRecipient.id || (r.name.toLowerCase() === newRecipient.name.toLowerCase() && r.phone === newRecipient.phone)
      );
      let updated: SavedRecipient[];
      if (existsIndex >= 0) {
        updated = [...prev];
        updated[existsIndex] = newRecipient;
      } else {
        updated = [newRecipient, ...prev];
      }
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

    // Try posting to API in background (with offline protection)
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/recipients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecipient),
      }).catch(() => {
        // Silently catch offline errors
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              3. Información del Destinatario Internacional
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Indica quién recibirá el paquete en el país de destino una vez procesado el envío.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold">
            <BookmarkCheck className="w-4 h-4 text-amber-600" />
            <span>Autoguardado al Continuar</span>
          </div>
        </div>

        {/* SELECTOR DE DESTINATARIOS FRECUENTES GUARDADOS */}
        {savedRecipients.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Destinatarios Frecuentes Guardados
              </label>
              <span className="text-[10px] font-bold text-slate-400">
                Selecciona uno para autocompletar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectSavedRecipient("custom")}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  selectedRecipientId === "custom"
                    ? "border-amber-500 bg-amber-50/60 shadow-sm ring-1 ring-amber-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block leading-tight">
                    Nuevo Destinatario
                  </span>
                  <span className="text-[10px] text-slate-500">Ingresar datos manuales</span>
                </div>
              </button>

              {savedRecipients.slice(0, 5).map((rec) => {
                const isSelected = selectedRecipientId === rec.id;
                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => handleSelectSavedRecipient(rec.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/60 shadow-sm ring-1 ring-amber-500/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-black text-slate-900 block truncate leading-tight">
                        {rec.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {rec.city} • {rec.phone}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Nombre completo / Razón social */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre Completo / Razón Social del Destinatario *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => {
                  setRecipientName(e.target.value);
                  notifyChange(e.target.value, primaryPhone, secondaryPhone, address, city);
                }}
                placeholder="Ej: Carlos Salazar o Inversiones Alfa C.A."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Teléfono 1 y Teléfono 2 (Obligatorios ambos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Teléfono 1 (Principal - WhatsApp / Móvil) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={primaryPhone}
                  onChange={(e) => {
                    setPrimaryPhone(e.target.value);
                    notifyChange(recipientName, e.target.value, secondaryPhone, address, city);
                  }}
                  placeholder="Ej: +58 412 555 1234"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Teléfono 2 (Secundario / Alternativo - WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={secondaryPhone}
                  onChange={(e) => {
                    setSecondaryPhone(e.target.value);
                    notifyChange(recipientName, primaryPhone, e.target.value, address, city);
                  }}
                  placeholder="Ej: +58 414 777 8899"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* City / Country */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ciudad y País de Destino *
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  notifyChange(recipientName, primaryPhone, secondaryPhone, address, e.target.value);
                }}
                placeholder="Ej: Caracas, Venezuela"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Destination Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Dirección Exacta de Entrega en Destino *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  notifyChange(recipientName, primaryPhone, secondaryPhone, e.target.value, city);
                }}
                placeholder="Calle, avenida, edificio, número de casa, piso, urbanización o sector..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

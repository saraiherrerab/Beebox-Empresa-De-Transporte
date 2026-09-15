"use client";

import React, { useState, useEffect } from "react";
import { Home, Building2, Plus, Info, MapPin, User, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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

export const PickupWizardStep1: React.FC<PickupWizardStep1Props> = ({
  onNext,
  senderName: initialSenderName,
  senderPhone: initialSenderPhone,
  senderAddress: initialSenderAddress,
  senderCity: initialSenderCity,
  onUpdateData,
}) => {
  const { user } = useAuth();
  const [selectedAddressMode, setSelectedAddressMode] = useState<"preset" | "custom">("custom");
  const [senderName, setSenderName] = useState(initialSenderName || user?.name || "");
  const [senderPhone, setSenderPhone] = useState(initialSenderPhone || user?.phone || "");
  const [senderAddress, setSenderAddress] = useState(initialSenderAddress || "");
  const [senderCity, setSenderCity] = useState(initialSenderCity || "Broken Arrow, OK");

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

  const handleSelectPreset = (addr: string, city: string) => {
    setSelectedAddressMode("preset");
    setSenderAddress(addr);
    setSenderCity(city);
    notifyChange(senderName, senderPhone, addr, city);
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

          {/* Preset Address Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => handleSelectPreset("Av. Insurgentes Sur 1234, Col. Del Valle", "Broken Arrow, OK")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedAddressMode === "preset" && senderAddress.includes("Insurgentes")
                  ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-amber-500" /> Domicilio / Casa
                </span>
                <input
                  type="radio"
                  name="addrPreset"
                  checked={selectedAddressMode === "preset" && senderAddress.includes("Insurgentes")}
                  onChange={() => handleSelectPreset("Av. Insurgentes Sur 1234, Col. Del Valle", "Broken Arrow, OK")}
                  className="text-amber-500 focus:ring-amber-500"
                />
              </div>
              <p className="text-xs text-slate-600 font-medium">Av. Insurgentes Sur 1234, Col. Del Valle</p>
              <span className="text-[10px] text-slate-400 font-semibold">Broken Arrow, OK</span>
            </div>

            <div
              onClick={() => handleSelectPreset("1405 Elm St, Suite 300", "Tulsa, OK")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedAddressMode === "preset" && senderAddress.includes("Elm St")
                  ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-500" /> Oficina / Negocio
                </span>
                <input
                  type="radio"
                  name="addrPreset"
                  checked={selectedAddressMode === "preset" && senderAddress.includes("Elm St")}
                  onChange={() => handleSelectPreset("1405 Elm St, Suite 300", "Tulsa, OK")}
                  className="text-amber-500 focus:ring-amber-500"
                />
              </div>
              <p className="text-xs text-slate-600 font-medium">1405 Elm St, Suite 300</p>
              <span className="text-[10px] text-slate-400 font-semibold">Tulsa, OK</span>
            </div>
          </div>

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
                    placeholder="Ej. Juan Pérez"
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
                    placeholder="Calle, número exterior/interior, colonia o referencia..."
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
                El chofer se comunicará al teléfono indicado 30 minutos antes de arribar al punto de recogida.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-xl space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">BEEBOX EXPRESS</span>
          <h4 className="text-sm font-bold leading-snug">¿Necesitas coordinar un horario especial para tu recogida?</h4>
          <p className="text-[11px] text-slate-400">
            Puedes indicarlo en las notas o contactar a soporte para rutas corporativas directas.
          </p>
        </div>
      </div>
    </div>
  );
};

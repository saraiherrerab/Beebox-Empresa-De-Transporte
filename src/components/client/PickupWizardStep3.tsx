"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Globe } from "lucide-react";

interface PickupWizardStep3Props {
  onNext: () => void;
  onBack: () => void;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  onUpdateData: (data: {
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    recipientCity: string;
  }) => void;
}

export const PickupWizardStep3: React.FC<PickupWizardStep3Props> = ({
  onNext,
  onBack,
  recipientName: initialRecipientName,
  recipientPhone: initialRecipientPhone,
  recipientAddress: initialRecipientAddress,
  recipientCity: initialRecipientCity,
  onUpdateData,
}) => {
  const [recipientName, setRecipientName] = useState(initialRecipientName || "");
  const [primaryPhone, setPrimaryPhone] = useState(initialRecipientPhone || "");
  const [address, setAddress] = useState(initialRecipientAddress || "");
  const [city, setCity] = useState(initialRecipientCity || "Caracas, Venezuela");

  const notifyChange = (
    rName = recipientName,
    rPhone = primaryPhone,
    rAddr = address,
    rCity = city
  ) => {
    onUpdateData({
      recipientName: rName,
      recipientPhone: rPhone,
      recipientAddress: rAddr,
      recipientCity: rCity,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            3. Información del Destinatario Internacional
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Indica quién recibirá el paquete en el país de destino una vez procesado el envío.
          </p>
        </div>

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
                  notifyChange(e.target.value, primaryPhone, address, city);
                }}
                placeholder="Ej: Carlos Salazar o Inversiones Alfa C.A."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Teléfono de Contacto Destinatario (WhatsApp / Móvil) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={primaryPhone}
                  onChange={(e) => {
                    setPrimaryPhone(e.target.value);
                    notifyChange(recipientName, e.target.value, address, city);
                  }}
                  placeholder="Ej: +58 412 555 1234"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
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
                    notifyChange(recipientName, primaryPhone, address, e.target.value);
                  }}
                  placeholder="Ej: Caracas, Venezuela"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
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
                  notifyChange(recipientName, primaryPhone, e.target.value, city);
                }}
                placeholder="Calle, avenida, edificio, piso, urbanización o sector..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

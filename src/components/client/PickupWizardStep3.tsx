"use client";

import React, { useState } from "react";

export const PickupWizardStep3: React.FC<{ onNext: () => void; onBack: () => void }> = ({
  onNext,
  onBack,
}) => {
  const [recipientName, setRecipientName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Información del Destinatario Internacional</h3>

        <div className="space-y-4">
          {/* Nombre completo / Razón social */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nombre Completo / Razón Social (Obligatorio)
            </label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Ej: Juan López o Empresa S.A."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tax ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                ID / Tax ID (Opcional)
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="Número de identificación fiscal"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Primary Phone (Required) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Teléfono Principal (Obligatorio)
              </label>
              <input
                type="tel"
                required
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Secondary Phone (Required as per Section 3.4) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Teléfono Secundario (Obligatorio)
              </label>
              <input
                type="tel"
                required
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                placeholder="+56 9 8765 4321"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Destination Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Dirección Exacta de Entrega Internacional (Obligatorio)
            </label>
            <textarea
              rows={4}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dirección completa incluyendo calle, número, apto/oficina, ciudad, provincia y código postal"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

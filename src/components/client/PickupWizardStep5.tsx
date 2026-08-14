"use client";

import React, { useState } from "react";
import { FileText, CheckCircle2, Info, Receipt } from "lucide-react";

export const PickupWizardStep5: React.FC<{ onComplete: () => void; onBack: () => void }> = ({
  onComplete,
  onBack,
}) => {
  const [receiptFile, setReceiptFile] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0].name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Información de Pago</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Transfer Details Card (Image 3) */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
                DATOS DE TRANSFERENCIA
              </span>

              <div className="space-y-2 text-xs font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Banco:</span>
                  <span className="font-bold text-slate-900">Banco Nacional</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cuenta:</span>
                  <span className="font-bold text-slate-900 font-mono">0123-4567-8901</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nombre:</span>
                  <span className="font-bold text-slate-900">Beebox S.A. de C.V.</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-amber-200/60">
                  <span className="text-slate-500">Concepto:</span>
                  <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                    PICKUP-0911
                  </span>
                </div>
              </div>
            </div>

            {/* Dark Total Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 flex items-center justify-between shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                MONTO TOTAL
              </span>
              <span className="text-3xl font-black text-amber-400 font-mono">$50.00 USD</span>
            </div>
          </div>

          {/* Receipt Upload & Info Note (Image 3) */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                SUBIR COMPROBANTE
              </span>

              <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 min-h-[160px]">
                <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} className="hidden" />
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-2">
                  <Receipt className="w-5 h-5" />
                </div>
                {receiptFile ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> Comprobante: {receiptFile}
                  </div>
                ) : (
                  <>
                    <h5 className="text-xs font-bold text-slate-900">Click para seleccionar</h5>
                    <p className="text-[11px] text-slate-500 mt-1">Sube una captura o PDF del comprobante de transferencia.</p>
                  </>
                )}
              </label>
            </div>

            {/* Yellow info callout box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Tu solicitud será procesada una vez que el administrador valide el pago. Recibirás una notificación en tu correo electrónico.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

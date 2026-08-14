"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

export const PickupWizardStep2: React.FC<{ onNext: () => void; onBack: () => void }> = ({
  onNext,
  onBack,
}) => {
  const [cargoType, setCargoType] = useState("Mercancía General");
  const [length, setLength] = useState("30");
  const [width, setWidth] = useState("20");
  const [height, setHeight] = useState("15");
  const [weight, setWeight] = useState("5.0");
  const [declaredValue, setDeclaredValue] = useState("150.00");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Información de la Carga</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cargo type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tipo de Carga
            </label>
            <select
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
            >
              <option value="Mercancía General">Mercancía General</option>
              <option value="Electrónicos">Electrónicos / Tecnología</option>
              <option value="Ropa & Calzado">Ropa & Calzado</option>
              <option value="Carga Pesada">Carga Pesada Industrial</option>
            </select>
          </div>

          {/* Dimensions (CM) L / W / H */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Dimensiones (CM)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="L"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
              <input
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="W"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="H"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Peso EST. */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Peso Est. (KG)
            </label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Valor Decl. */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Valor Decl. (USD)
            </label>
            <input
              type="text"
              value={declaredValue}
              onChange={(e) => setDeclaredValue(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Customs Upload Area (Image 5) */}
        <div className="pt-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Declaración Aduanal</h4>

          <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50">
            <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} className="hidden" />
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 border border-amber-200">
              <Upload className="w-6 h-6" />
            </div>
            {uploadedFile ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Factura Cargada: {uploadedFile}
              </div>
            ) : (
              <>
                <h5 className="text-xs font-bold text-slate-900">Subir Factura Comercial (Obligatorio)</h5>
                <p className="text-[11px] text-slate-500 mt-1">Arrastra el archivo aquí o haz click para buscar (PDF, JPG)</p>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

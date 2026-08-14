"use client";

import React, { useState } from "react";
import { Upload, Plus, Trash2, CheckCircle2, Laptop } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PackageBox {
  id: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  declaredValue: string;
}

export const PickupWizardStep2: React.FC<{ onNext: () => void; onBack: () => void }> = ({
  onNext,
  onBack,
}) => {
  const [cargoType, setCargoType] = useState("Mercancía General");
  const [boxes, setBoxes] = useState<PackageBox[]>([
    { id: "box_1", length: "30", width: "20", height: "15", weight: "5.0", declaredValue: "150.00" },
  ]);

  const [hasElectronics, setHasElectronics] = useState<boolean | null>(null);
  const [electronicBrand, setElectronicBrand] = useState("");
  const [electronicModel, setElectronicModel] = useState("");

  const addBox = () => {
    setBoxes((prev) => [
      ...prev,
      {
        id: `box_${Date.now()}`,
        length: "20",
        width: "20",
        height: "20",
        weight: "2.0",
        declaredValue: "50.00",
      },
    ]);
  };

  const removeBox = (id: string) => {
    if (boxes.length > 1) {
      setBoxes((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Información del Paquete y Carga</h3>

          <Button onClick={addBox} variant="outline" size="sm" className="rounded-xl border-amber-500 text-amber-700 text-xs font-bold">
            <Plus className="w-4 h-4 mr-1" /> AGREGAR OTRA CAJA ({boxes.length})
          </Button>
        </div>

        {/* Cargo Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Tipo de Carga Generada
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

        {/* Carga Multipaquete (Multiple Boxes List) */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Cajas / Bultos Registrados ({boxes.length})
          </span>

          {boxes.map((box, idx) => (
            <div key={box.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  Caja #{idx + 1}
                </span>
                {boxes.length > 1 && (
                  <button onClick={() => removeBox(box.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Dimensiones L / W / H (CM)
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <input
                      type="text"
                      defaultValue={box.length}
                      placeholder="L"
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-center text-xs font-mono font-bold text-slate-900"
                    />
                    <input
                      type="text"
                      defaultValue={box.width}
                      placeholder="W"
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-center text-xs font-mono font-bold text-slate-900"
                    />
                    <input
                      type="text"
                      defaultValue={box.height}
                      placeholder="H"
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-center text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Peso Est. (KG)
                  </label>
                  <input
                    type="text"
                    defaultValue={box.weight}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Valor Decl. (USD)
                  </label>
                  <input
                    type="text"
                    defaultValue={box.declaredValue}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Condicional para Dispositivos Electrónicos (Requirement Section 3.4) */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
          <div className="flex items-start gap-2">
            <Laptop className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                ¿El envío contiene dispositivos electrónicos?
              </h4>
              <p className="text-[11px] text-slate-500">
                Requisito regulatorio indispensable para la inspección y manejo de baterías / tecnología.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="electronics"
                checked={hasElectronics === true}
                onChange={() => setHasElectronics(true)}
                className="text-amber-500 focus:ring-amber-500"
              />
              SÍ, contiene equipos electrónicos
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="electronics"
                checked={hasElectronics === false}
                onChange={() => setHasElectronics(false)}
                className="text-amber-500 focus:ring-amber-500"
              />
              NO contiene electrónicos
            </label>
          </div>

          {/* Conditional Mandatory Fields: Marca & Modelo */}
          {hasElectronics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-amber-200/80 animate-in fade-in duration-200">
              <div>
                <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Marca del Equipo (Obligatorio)
                </label>
                <input
                  type="text"
                  required
                  value={electronicBrand}
                  onChange={(e) => setElectronicBrand(e.target.value)}
                  placeholder="Ej. Apple, Sony, Lenovo, Samsung"
                  className="w-full rounded-xl border border-amber-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Modelo / Serie del Equipo (Obligatorio)
                </label>
                <input
                  type="text"
                  required
                  value={electronicModel}
                  onChange={(e) => setElectronicModel(e.target.value)}
                  placeholder="Ej. MacBook Pro A2992, Xperia 1 V"
                  className="w-full rounded-xl border border-amber-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

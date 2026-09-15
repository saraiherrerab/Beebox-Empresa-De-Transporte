"use client";

import React, { useState } from "react";
import { Scale, Package, ShieldCheck, Laptop, BatteryCharging, AlertTriangle, Plus, Minus } from "lucide-react";

interface PickupWizardStep2Props {
  onNext: () => void;
  onBack: () => void;
  initialBoxCount?: number;
  initialContainElectronics?: boolean;
  initialContainLithium?: boolean;
  onUpdateData?: (data: {
    boxCount: number;
    cargoType: string;
    containElectronics: boolean;
    containLithium: boolean;
  }) => void;
}

export const PickupWizardStep2: React.FC<PickupWizardStep2Props> = ({
  onNext,
  onBack,
  initialBoxCount = 1,
  initialContainElectronics = false,
  initialContainLithium = false,
  onUpdateData,
}) => {
  const [boxCount, setBoxCount] = useState<number>(initialBoxCount);
  const [cargoType, setCargoType] = useState<string>("Mercancía General");
  const [packageSize, setPackageSize] = useState<string>("Mediano");
  const [hasElectronics, setHasElectronics] = useState<boolean>(initialContainElectronics);
  const [hasLithium, setHasLithium] = useState<boolean>(initialContainLithium);
  const [notes, setNotes] = useState<string>("");

  const triggerUpdate = (
    bCount: number = boxCount,
    cType: string = cargoType,
    elect: boolean = hasElectronics,
    lith: boolean = hasLithium
  ) => {
    if (onUpdateData) {
      onUpdateData({
        boxCount: bCount,
        cargoType: cType,
        containElectronics: elect,
        containLithium: lith,
      });
    }
  };

  const handleBoxCountChange = (newCount: number) => {
    const val = Math.max(1, Math.min(newCount, 20));
    setBoxCount(val);
    triggerUpdate(val, cargoType, hasElectronics, hasLithium);
  };

  const handleCargoTypeChange = (newType: string) => {
    setCargoType(newType);
    triggerUpdate(boxCount, newType, hasElectronics, hasLithium);
  };

  const handleElectronicsChange = (val: boolean) => {
    setHasElectronics(val);
    triggerUpdate(boxCount, cargoType, val, hasLithium);
  };

  const handleLithiumChange = (val: boolean) => {
    setHasLithium(val);
    triggerUpdate(boxCount, cargoType, hasElectronics, val);
  };

  const sizes = [
    { id: "Pequeño", label: "Pequeño", desc: "Tipo sobre o caja de zapatos (< 3 kg)", icon: "📦" },
    { id: "Mediano", label: "Mediano", desc: "Caja estándar de encomienda (3 a 10 kg)", icon: "📦📦" },
    { id: "Grande", label: "Grande / Voluminoso", desc: "Caja grande o electrodoméstico (> 10 kg)", icon: "📦📦📦" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Encabezado */}
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Información Referencial de la Carga
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Indícanos cuántas cajas o bultos aproximadamente retiraremos para asignar la unidad de transporte adecuada.
          </p>
        </div>

        {/* Banner Informativo: El Personal Operativo se Encarga de Peso y Medidas */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 shrink-0 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-extrabold text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Pesaje y Cubicaje Oficial en Operaciones
            </h4>
            <p className="text-amber-900/80 leading-relaxed font-medium">
              <strong>No requieres pesar ni medir tus cajas.</strong> Al realizar la recolección física, nuestro equipo operativo realiza el pesaje certificado y medición exacta (largo, ancho y alto) en almacén para la liquidación final de tu guía.
            </p>
          </div>
        </div>

        {/* Selector de Cantidad de Cajas */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Cantidad de Cajas o Bultos a Retirar
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-slate-200 rounded-2xl p-1 bg-slate-50">
              <button
                type="button"
                onClick={() => handleBoxCountChange(boxCount - 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 flex items-center justify-center font-black transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-16 text-center font-mono text-lg font-black text-slate-900">
                {boxCount}
              </span>
              <button
                type="button"
                onClick={() => handleBoxCountChange(boxCount + 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 flex items-center justify-center font-black transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {boxCount === 1 ? "1 bulto para recolección" : `${boxCount} bultos para recolección`}
            </span>
          </div>
        </div>

        {/* Tamaño Aproximado Estimado (Referencial para la unidad móvil) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Tamaño Aproximado Referencial
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sizes.map((s) => (
              <div
                key={s.id}
                onClick={() => setPackageSize(s.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1.5 ${
                  packageSize === s.id
                    ? "border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <span className="text-xl block">{s.icon}</span>
                <span className="text-xs font-bold text-slate-900 block">{s.label}</span>
                <p className="text-[10px] text-slate-500 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tipo de Carga General */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Categoría del Contenido
          </label>
          <select
            value={cargoType}
            onChange={(e) => handleCargoTypeChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
          >
            <option value="Mercancía General">Mercancía General</option>
            <option value="Ropa, Calzado y Textiles">Ropa, Calzado y Textiles</option>
            <option value="Artículos Personales y Hogar">Artículos Personales y Hogar</option>
            <option value="Documentos y Papelería">Documentos y Papelería</option>
            <option value="Alimentos No Perecederos">Alimentos No Perecederos</option>
            <option value="Repuestos y Accesorios">Repuestos y Accesorios</option>
            <option value="Electrónicos / Tecnología">Equipos Electrónicos / Tecnología</option>
          </select>
        </div>

        {/* SECCIÓN 1: DECLARACIÓN DE DISPOSITIVOS ELECTRÓNICOS */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  1. Dispositivos y Equipos Electrónicos
                </span>
                <span className="text-[11px] text-slate-500">
                  Laptops, computadoras, pantallas, tabletas, consolas de videojuegos o electrodomésticos.
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="electronics_option"
                checked={hasElectronics === true}
                onChange={() => handleElectronicsChange(true)}
                className="text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
              SÍ, contiene equipos electrónicos
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="electronics_option"
                checked={hasElectronics === false}
                onChange={() => handleElectronicsChange(false)}
                className="text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
              NO contiene electrónicos
            </label>
          </div>
        </div>

        {/* SECCIÓN 2: DECLARACIÓN SEPARADA DE BATERÍAS DE LITIO (REGULACIÓN AÉREA) */}
        <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
          hasLithium ? "bg-amber-50/70 border-amber-300" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
                <BatteryCharging className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  2. Baterías de Litio o Pilas Especiales (Norma IATA)
                </span>
                <span className="text-[11px] text-slate-500">
                  Baterías de Ion de Litio (Li-ion), baterías de polímero, powerbanks externos o pilas de litio sueltas/instaladas.
                </span>
              </div>
            </div>

            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
              Seguridad Aérea
            </span>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="lithium_option"
                checked={hasLithium === true}
                onChange={() => handleLithiumChange(true)}
                className="text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
              SÍ, contiene baterías de litio
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="lithium_option"
                checked={hasLithium === false}
                onChange={() => handleLithiumChange(false)}
                className="text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
              NO contiene baterías de litio
            </label>
          </div>

          {hasLithium && (
            <div className="mt-2 p-3 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-950 text-[11px] font-medium flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Regulación IATA / Carga Aérea:</strong> Al recolectar tu paquete, nuestro personal operativo le colocará el etiquetado de seguridad internacional correspondiente (UN3481 / UN3480) para su despacho conforme a las normas aeronáuticas.
              </span>
            </div>
          )}
        </div>

        {/* Observaciones o Instrucciones Especiales para el Chofer */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Instrucciones para el Chofer (Opcional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej. Tocar timbre portón negro, retirar en conserjería/vigilancia, paquete frágil..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

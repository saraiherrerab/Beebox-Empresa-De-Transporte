"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  Package,
  ShieldCheck,
  Laptop,
  BatteryCharging,
  AlertTriangle,
  Plus,
  Minus,
  DollarSign,
  FileText,
  Boxes,
} from "lucide-react";

export interface BoxItem {
  id: string;
  size: string;
  contentDescription: string;
  declaredValue: number | "";
}

interface PickupWizardStep2Props {
  onNext: () => void;
  onBack: () => void;
  initialBoxCount?: number;
  initialBoxes?: BoxItem[];
  initialContainElectronics?: boolean;
  initialElectronicsDetails?: string;
  initialElectronicsDeclaredValue?: number | "";
  initialContainLithium?: boolean;
  initialNotes?: string;
  onUpdateData?: (data: {
    boxCount: number;
    boxes: BoxItem[];
    containElectronics: boolean;
    electronicsDetails: string;
    electronicsDeclaredValue: number | "";
    containLithium: boolean;
    notes: string;
  }) => void;
}

export const PickupWizardStep2: React.FC<PickupWizardStep2Props> = ({
  onNext,
  onBack,
  initialBoxCount = 1,
  initialBoxes,
  initialContainElectronics = false,
  initialElectronicsDetails = "",
  initialElectronicsDeclaredValue = "",
  initialContainLithium = false,
  initialNotes = "",
  onUpdateData,
}) => {
  const [boxCount, setBoxCount] = useState<number>(initialBoxCount);

  // Initialize boxes array based on boxCount
  const [boxes, setBoxes] = useState<BoxItem[]>(() => {
    if (initialBoxes && initialBoxes.length > 0) {
      return initialBoxes;
    }
    const initialArr: BoxItem[] = [];
    for (let i = 0; i < initialBoxCount; i++) {
      initialArr.push({
        id: `box_${i + 1}`,
        size: "Mediano",
        contentDescription: "",
        declaredValue: "",
      });
    }
    return initialArr;
  });

  const [hasElectronics, setHasElectronics] = useState<boolean>(initialContainElectronics);
  const [electronicsDetails, setElectronicsDetails] = useState<string>(initialElectronicsDetails);
  const [electronicsDeclaredValue, setElectronicsDeclaredValue] = useState<number | "">(
    initialElectronicsDeclaredValue
  );

  const [hasLithium, setHasLithium] = useState<boolean>(initialContainLithium);
  const [notes, setNotes] = useState<string>(initialNotes);

  // Synchronize notify changes to parent
  const triggerUpdate = (
    bCount: number = boxCount,
    bList: BoxItem[] = boxes,
    elect: boolean = hasElectronics,
    eDetails: string = electronicsDetails,
    eValue: number | "" = electronicsDeclaredValue,
    lith: boolean = hasLithium,
    nts: string = notes
  ) => {
    if (onUpdateData) {
      onUpdateData({
        boxCount: bCount,
        boxes: bList,
        containElectronics: elect,
        electronicsDetails: eDetails,
        electronicsDeclaredValue: eValue,
        containLithium: lith,
        notes: nts,
      });
    }
  };

  const handleBoxCountChange = (newCount: number) => {
    const val = Math.max(1, Math.min(newCount, 20));
    setBoxCount(val);

    let updatedBoxes = [...boxes];
    if (val > boxes.length) {
      for (let i = boxes.length; i < val; i++) {
        updatedBoxes.push({
          id: `box_${Date.now()}_${i + 1}`,
          size: "Mediano",
          contentDescription: "",
          declaredValue: "",
        });
      }
    } else if (val < boxes.length) {
      updatedBoxes = updatedBoxes.slice(0, val);
    }

    setBoxes(updatedBoxes);
    triggerUpdate(val, updatedBoxes, hasElectronics, electronicsDetails, electronicsDeclaredValue, hasLithium, notes);
  };

  const updateBoxItem = (index: number, field: keyof BoxItem, value: any) => {
    const updated = [...boxes];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setBoxes(updated);
    triggerUpdate(boxCount, updated, hasElectronics, electronicsDetails, electronicsDeclaredValue, hasLithium, notes);
  };

  const handleElectronicsChange = (val: boolean) => {
    setHasElectronics(val);
    triggerUpdate(boxCount, boxes, val, electronicsDetails, electronicsDeclaredValue, hasLithium, notes);
  };

  const handleElectronicsDetailsChange = (val: string) => {
    setElectronicsDetails(val);
    triggerUpdate(boxCount, boxes, hasElectronics, val, electronicsDeclaredValue, hasLithium, notes);
  };

  const handleElectronicsDeclaredValueChange = (val: number | "") => {
    setElectronicsDeclaredValue(val);
    triggerUpdate(boxCount, boxes, hasElectronics, electronicsDetails, val, hasLithium, notes);
  };

  const handleLithiumChange = (val: boolean) => {
    setHasLithium(val);
    triggerUpdate(boxCount, boxes, hasElectronics, electronicsDetails, electronicsDeclaredValue, val, notes);
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    triggerUpdate(boxCount, boxes, hasElectronics, electronicsDetails, electronicsDeclaredValue, hasLithium, val);
  };

  const sizes = [
    { id: "Pequeño", label: "Pequeño", desc: "< 3 kg (Sobre / Calzado)", icon: "📦" },
    { id: "Mediano", label: "Mediano", desc: "3 - 10 kg (Caja Estándar)", icon: "📦📦" },
    { id: "Grande", label: "Grande", desc: "> 10 kg (Voluminoso)", icon: "📦📦📦" },
  ];

  const totalDeclaredBoxes = boxes.reduce((acc, b) => acc + (typeof b.declaredValue === "number" ? b.declaredValue : 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Encabezado */}
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            2. Información Individualizada de Cajas / Bultos
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Indica cuántas cajas retirarás e ingresa los detalles obligatorios de cada una (tamaño, contenido y valor declarado).
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
              <strong>No requieres pesar ni medir tus cajas de forma exacta.</strong> Al realizar la recolección física, nuestro equipo operativo realiza el pesaje certificado y medición en almacén para la liquidación final.
            </p>
          </div>
        </div>

        {/* Selector de Cantidad de Cajas */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Cantidad de Cajas o Bultos a Retirar *
            </label>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              {boxCount} {boxCount === 1 ? "Caja configurada" : "Cajas configuradas"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-slate-200 rounded-2xl p-1 bg-slate-50">
              <button
                type="button"
                onClick={() => handleBoxCountChange(boxCount - 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 flex items-center justify-center font-black transition-all"
                title="Reducir cantidad de cajas"
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
                title="Aumentar cantidad de cajas"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Se desplegará una tarjeta por cada caja para detallar su contenido y valor declarado.
            </span>
          </div>
        </div>

        {/* LÓGICA DINÁMICA DE CAJAS / BULTOS */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-amber-600" /> Detalle Individual por Caja ({boxes.length})
            </span>
            <span className="text-xs font-bold text-slate-500">
              Total Declarado: <strong className="text-slate-900">${totalDeclaredBoxes.toFixed(2)} USD</strong>
            </span>
          </div>

          <div className="space-y-4">
            {boxes.map((box, index) => (
              <div
                key={box.id || index}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all space-y-4 relative"
              >
                {/* Header de la caja */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Caja #{index + 1}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {box.size || "Mediano"}
                  </span>
                </div>

                {/* Selección de tamaño por caja */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    1. Tamaño de la Caja *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => updateBoxItem(index, "size", s.id)}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all flex items-center gap-2.5 ${
                          box.size === s.id
                            ? "border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-500/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <span className="text-lg">{s.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block leading-tight">{s.label}</span>
                          <span className="text-[10px] text-slate-500">{s.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campos obligatorios: Descripción y Monto declarado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      2. Descripción General del Contenido *
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={box.contentDescription}
                        onChange={(e) => updateBoxItem(index, "contentDescription", e.target.value)}
                        placeholder="Ej. Ropa variada, calzado deportivo, cosméticos, sábanas..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      3. Monto Declarado ($ USD) *
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={box.declaredValue === "" ? "" : box.declaredValue}
                        onChange={(e) => {
                          const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                          updateBoxItem(index, "declaredValue", val);
                        }}
                        placeholder="Ej. 150"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 1: DECLARACIÓN DE DISPOSITIVOS ELECTRÓNICOS CON CAMPOS DINÁMICOS */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Dispositivos y Equipos Electrónicos
                </span>
                <span className="text-[11px] text-slate-500">
                  Laptops, computadoras, pantallas, tabletas, consolas de videojuegos, teléfonos o electrodomésticos.
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

          {/* CAMPOS CONDICIONALES PARA DISPOSITIVOS ELECTRÓNICOS */}
          {hasElectronics && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-xs">
                <Laptop className="w-4 h-4 text-blue-600" /> Detalle Obligatorio de Equipos Electrónicos
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-950 mb-1">
                    Marca, Modelo y Cantidad del Equipo *
                  </label>
                  <input
                    type="text"
                    required
                    value={electronicsDetails}
                    onChange={(e) => handleElectronicsDetailsChange(e.target.value)}
                    placeholder="Ej. 1 Laptop Lenovo ThinkPad T14, 1 Tablet iPad 10ma Gen"
                    className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white text-xs font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-950 mb-1">
                    Monto Declarado del Equipo ($ USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={electronicsDeclaredValue === "" ? "" : electronicsDeclaredValue}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                        handleElectronicsDeclaredValueChange(val);
                      }}
                      placeholder="Ej. 650"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-blue-200 bg-white text-xs font-mono font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECCIÓN 2: DECLARACIÓN SEPARADA DE BATERÍAS DE LITIO (REGULACIÓN AÉREA) */}
        <div
          className={`p-5 rounded-2xl border transition-all space-y-3 ${
            hasLithium ? "bg-amber-50/70 border-amber-300" : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
                <BatteryCharging className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Baterías de Litio o Pilas Especiales (Norma IATA)
                </span>
                <span className="text-[11px] text-slate-500">
                  Baterías de Ion de Litio (Li-ion), baterías de polímero, powerbanks externos o pilas de litio.
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
            Instrucciones para el Chofer de Recolección (Opcional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Ej. Tocar timbre portón negro, retirar en conserjería/vigilancia, paquete frágil..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { Sun, Sunset, Info, Calendar as CalendarIcon, Clock } from "lucide-react";

interface PickupWizardStep4Props {
  onNext: () => void;
  onBack: () => void;
  pickupDate: string;
  timeSlot: string;
  onUpdateData: (data: { pickupDate: string; timeSlot: string }) => void;
}

export const PickupWizardStep4: React.FC<PickupWizardStep4Props> = ({
  onNext,
  onBack,
  pickupDate: initialPickupDate,
  timeSlot: initialTimeSlot,
  onUpdateData,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(initialPickupDate || today);
  const [selectedSlot, setSelectedSlot] = useState(initialTimeSlot || "mañana");

  const notifyChange = (date = selectedDate, slot = selectedSlot) => {
    onUpdateData({ pickupDate: date, timeSlot: slot });
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    notifyChange(newDate, selectedSlot);
  };

  const handleSlotChange = (newSlot: string) => {
    setSelectedSlot(newSlot);
    notifyChange(selectedDate, newSlot);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            4. Fecha y Franja Horaria de Recolección
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Selecciona el día y horario en el que nuestro chofer de flota acudirá a retirar los paquetes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Date Selector */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-amber-500" /> Fecha de Recolección Programada *
            </span>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Selecciona la fecha en calendario:
              </label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xs font-bold font-mono text-slate-900 focus:border-amber-500 focus:outline-none shadow-sm cursor-pointer"
              />

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="text-slate-400">Día Seleccionado:</span>
                <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-950 font-mono">
                  {selectedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Time Slot Cards */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" /> Franja Horaria de Llegada *
            </span>

            {/* Morning Slot */}
            <div
              onClick={() => handleSlotChange("mañana")}
              className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                selectedSlot === "mañana" || selectedSlot === "manana"
                  ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Mañana (09:00 – 13:00)</span>
                  <span className="text-[10px] text-slate-500">Ruta de recolección matutina</span>
                </div>
              </div>

              <input
                type="radio"
                name="timeSlotGroup"
                checked={selectedSlot === "mañana" || selectedSlot === "manana"}
                onChange={() => handleSlotChange("mañana")}
                className="text-amber-500 focus:ring-amber-500"
              />
            </div>

            {/* Afternoon Slot */}
            <div
              onClick={() => handleSlotChange("tarde")}
              className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                selectedSlot === "tarde"
                  ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Sunset className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Tarde (14:00 – 18:00)</span>
                  <span className="text-[10px] text-slate-500">Ruta de recolección vespertina</span>
                </div>
              </div>

              <input
                type="radio"
                name="timeSlotGroup"
                checked={selectedSlot === "tarde"}
                onChange={() => handleSlotChange("tarde")}
                className="text-amber-500 focus:ring-amber-500"
              />
            </div>

            <p className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-1">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              El chofer de la unidad asignada te contactará vía telefónica antes de llegar a la dirección indicada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

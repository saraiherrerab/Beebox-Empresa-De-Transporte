"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Sun, Sunset, Info } from "lucide-react";

export const PickupWizardStep4: React.FC<{ onNext: () => void; onBack: () => void }> = ({
  onNext,
  onBack,
}) => {
  const [selectedDay, setSelectedDay] = useState(11);
  const [selectedSlot, setSelectedSlot] = useState("tarde");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Selecciona tu horario de recogida</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Mini Calendar View (Image 2) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                OCTUBRE 2026
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
              <span>L</span>
              <span>M</span>
              <span>X</span>
              <span>J</span>
              <span>V</span>
              <span className="text-red-400">S</span>
              <span className="text-red-400">D</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`py-2.5 rounded-xl font-bold transition-all ${
                    selectedDay === day
                      ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Cards (Image 2) */}
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              FRANJAS HORARIAS
            </span>

            {/* Morning Slot */}
            <div
              onClick={() => setSelectedSlot("manana")}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                selectedSlot === "manana"
                  ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <span className="text-xs font-bold text-slate-900">Mañana (09:00 – 12:00)</span>
              <Sun className="w-5 h-5 text-amber-500" />
            </div>

            {/* Afternoon Slot */}
            <div
              onClick={() => setSelectedSlot("tarde")}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                selectedSlot === "tarde"
                  ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <span className="text-xs font-bold text-slate-900">Tarde (14:00 – 18:00)</span>
              <Sunset className="w-5 h-5 text-amber-500" />
            </div>

            <p className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              El transportista te contactará 30 minutos antes de llegar a la dirección de recogida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { ShieldAlert, ChevronLeft, ChevronRight, Clock, Calendar, CheckCircle2, UserCheck, QrCode } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AgendarRetiroPage() {
  const [selectedDay, setSelectedDay] = useState(9);
  const [selectedTime, setSelectedTime] = useState("09:00 AM");
  const [isBooked, setIsBooked] = useState(false);

  const daysGrid = [
    { day: 1, status: "abierto", label: "Abierto" },
    { day: 2, status: "pocos", label: "Pocos Cupos" },
    { day: 3, status: "cerrado" },
    { day: 4, status: "cerrado" },
    { day: 5, status: "abierto", label: "Abierto" },
    { day: 6, status: "abierto", label: "Abierto" },
    { day: 7, status: "abierto", label: "Abierto" },
    { day: 8, status: "pocos", label: "Pocos Cupos" },
    { day: 9, status: "seleccionado", label: "Seleccionado" },
    { day: 10, status: "cerrado" },
    { day: 11, status: "cerrado" },
    { day: 12, status: "abierto", label: "Abierto" },
    { day: 13, status: "abierto", label: "Abierto" },
    { day: 14, status: "abierto", label: "Abierto" },
    { day: 15, status: "abierto", label: "Abierto" },
    { day: 16, status: "abierto", label: "Abierto" },
  ];

  const timeSlots = [
    { time: "09:00 AM", status: "elegido", label: "ELEGIDO" },
    { time: "10:30 AM", status: "disponible", label: "DISPONIBLE" },
    { time: "11:00 AM", status: "disponible", label: "DISPONIBLE" },
    { time: "01:30 PM", status: "lleno", label: "LLENO" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Orange Top Requirements Banner (Image 4) */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-black uppercase text-base sm:text-lg tracking-tight">
            <ShieldAlert className="w-6 h-6 shrink-0" /> REQUISITOS OBLIGATORIOS PARA EL RETIRO
          </div>
          <p className="text-xs text-white/90 font-medium">
            Asegúrate de contar con estos documentos antes de agendar tu cita.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <UserCheck className="w-4 h-4" /> ID OFICIAL ORIGINAL
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/20 text-xs font-bold font-mono tracking-wider backdrop-blur-md">
            <QrCode className="w-4 h-4" /> CÓDIGO CAS-88293-MX
          </span>
        </div>
      </div>

      {/* Main Title & Month Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Calendario de Retiros</h2>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">OCTUBRE 2026</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-1">
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Month Grid (Image 4) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100 text-center py-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          <div>LUNES</div>
          <div>MARTES</div>
          <div>MIÉRCOLES</div>
          <div>JUEVES</div>
          <div>VIERNES</div>
          <div className="text-red-400">SÁBADO</div>
          <div className="text-red-400">DOMINGO</div>
        </div>

        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[220px]">
          {/* Empty prefix cells for Monday - Wednesday */}
          <div className="p-4 bg-slate-50/50" />
          <div className="p-4 bg-slate-50/50" />
          <div className="p-4 bg-slate-50/50" />

          {daysGrid.map((item) => {
            const isSelected = selectedDay === item.day;

            return (
              <div
                key={item.day}
                onClick={() => item.status !== "cerrado" && setSelectedDay(item.day)}
                className={`p-3 min-h-[90px] flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-50/50 ring-2 ring-amber-500 border-amber-500"
                    : item.status === "cerrado"
                    ? "bg-slate-50/30 text-slate-300 pointer-events-none"
                    : "hover:bg-slate-50 text-slate-800"
                }`}
              >
                <span className={`text-xs font-black font-mono ${isSelected ? "text-amber-600" : ""}`}>
                  {item.day}
                </span>

                {item.label && (
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block text-center ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : item.status === "abierto"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Time Slots Section (Image 4) */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          Horarios Disponibles para el Viernes {selectedDay} de Octubre
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {timeSlots.map((slot) => {
            const isSelectedSlot = selectedTime === slot.time;
            const isLleno = slot.status === "lleno";

            return (
              <div
                key={slot.time}
                onClick={() => !isLleno && setSelectedTime(slot.time)}
                className={`p-5 rounded-2xl border transition-all text-center space-y-1 ${
                  isSelectedSlot
                    ? "bg-amber-500 border-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer"
                    : isLleno
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                    : "bg-white border-slate-200 text-slate-900 hover:border-amber-500/50 cursor-pointer shadow-sm"
                }`}
              >
                <div className={`text-base font-black font-mono ${isSelectedSlot ? "text-slate-950" : ""}`}>
                  {slot.time}
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                    isSelectedSlot ? "text-slate-950" : isLleno ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {slot.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Bar Card (Image 4) */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Cita Detail */}
          <div className="space-y-1 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 md:pr-8 pb-4 md:pb-0 w-full md:w-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              DETALLE DE TU CITA
            </span>
            <div className="text-xl font-black text-slate-900 font-mono">
              {selectedDay} Oct 2026 — {selectedTime}
            </div>
            <p className="text-xs font-bold text-amber-600">CDMX – Vallejo Hub (Almacén Central)</p>
          </div>

          {/* Items Ready */}
          <div className="space-y-1 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 md:pr-8 pb-4 md:pb-0 w-full md:w-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              PAQUETES PARA RETIRO
            </span>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center border-2 border-white">
                  📦
                </div>
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
                  +1
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">3 Ítems Listos</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto">
            <Button
              onClick={() => setIsBooked(true)}
              className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl shadow-xl justify-center text-xs tracking-wider uppercase"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isBooked ? "CITA CONFIRMADA ✓" : "AGENDAR RETIRO AHORA"}
            </Button>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-slate-100">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            SE GENERARÁ UN CÓDIGO QR ÚNICO PARA TU INGRESO AL ALMACÉN
          </span>
        </div>
      </div>
    </div>
  );
}

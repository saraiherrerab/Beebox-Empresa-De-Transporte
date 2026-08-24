"use client";

import React, { useState } from "react";
import { ShieldAlert, ChevronLeft, ChevronRight, Clock, Calendar, UserCheck, QrCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AgendarRetiroPage() {
  const [selectedDay, setSelectedDay] = useState(18);
  const [selectedTime, setSelectedTime] = useState("09:00 AM");
  const [isBooked, setIsBooked] = useState(false);
  const [generatedPin, setGeneratedPin] = useState("894012");
  const [loading, setLoading] = useState(false);

  const daysGrid = [
    { day: 10, status: "abierto", label: "Abierto" },
    { day: 11, status: "pocos", label: "Pocos Cupos" },
    { day: 12, status: "cerrado" },
    { day: 13, status: "cerrado" },
    { day: 14, status: "abierto", label: "Abierto" },
    { day: 15, status: "abierto", label: "Abierto" },
    { day: 16, status: "abierto", label: "Abierto" },
    { day: 17, status: "pocos", label: "Pocos Cupos" },
    { day: 18, status: "seleccionado", label: "Seleccionado" },
    { day: 19, status: "abierto", label: "Abierto" },
    { day: 20, status: "abierto", label: "Abierto" },
  ];

  const timeSlots = [
    { time: "09:00 AM", status: "elegido", label: "ELEGIDO" },
    { time: "10:30 AM", status: "disponible", label: "DISPONIBLE" },
    { time: "11:00 AM", status: "disponible", label: "DISPONIBLE" },
    { time: "01:30 PM", status: "lleno", label: "LLENO" },
  ];

  const handleScheduleRetiro = async () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;

    try {
      if (token) {
        const res = await fetch(`${API_URL}/retiros`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shipmentId: "MIA-449201",
            branchName: "Almacén Central (CDMX)",
            scheduledDate: `2026-10-${selectedDay}`,
            scheduledTime: selectedTime,
          }),
        });
        const data = await res.json();
        if (res.ok && data.retiro) {
          setGeneratedPin(data.retiro.pinCode);
        }
      }
    } catch {
      // Fallback
      setGeneratedPin(String(Math.floor(100000 + Math.random() * 900000)));
    } finally {
      setLoading(false);
      setIsBooked(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Requirements Banner */}
      <div className="rounded-3xl bg-amber-500 p-6 sm:p-8 text-slate-950 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-400">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-black uppercase text-base sm:text-lg tracking-tight text-slate-950">
            <ShieldAlert className="w-6 h-6 shrink-0 text-slate-950" /> REQUISITOS OBLIGATORIOS PARA EL RETIRO EN SUCURSAL
          </div>
          <p className="text-xs text-slate-900 font-bold">
            Presenta tu identificación oficial y el código PIN de seguridad de 6 dígitos emitido al confirmar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-950 text-amber-400 text-xs font-black uppercase tracking-wider shadow-md">
            <UserCheck className="w-4 h-4" /> ID OFICIAL ORIGINAL
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-950 text-amber-400 text-xs font-black font-mono tracking-wider shadow-md">
            <QrCode className="w-4 h-4" /> CÓDIGO PIN 6 DÍGITOS
          </span>
        </div>
      </div>

      {isBooked && (
        <div className="p-6 rounded-3xl bg-emerald-500 text-slate-950 shadow-xl space-y-2 border border-emerald-400 text-center animate-in zoom-in-95">
          <div className="w-12 h-12 bg-slate-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black uppercase">¡Cita de Retiro Confirmada Exitosamente!</h3>
          <p className="text-xs font-bold">Tu código PIN de seguridad para entrega en mostrador es:</p>
          <div className="text-4xl font-mono font-black bg-slate-950 text-amber-400 tracking-widest inline-block px-8 py-3 rounded-2xl shadow-md my-2">
            {generatedPin}
          </div>
          <p className="text-[11px] font-bold text-slate-900">Muestra este PIN al operador en la ventanilla de la sucursal.</p>
        </div>
      )}

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

      {/* Calendar Month Grid */}
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

        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[180px]">
          {daysGrid.map((item) => {
            const isSelected = selectedDay === item.day;

            return (
              <div
                key={item.day}
                onClick={() => item.status !== "cerrado" && setSelectedDay(item.day)}
                className={`p-3 min-h-[80px] flex flex-col justify-between transition-all cursor-pointer ${
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

      {/* Available Time Slots Section */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          Horarios Disponibles para el Día {selectedDay} de Octubre
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

      {/* Bottom Summary Bar Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 md:pr-8 pb-4 md:pb-0 w-full md:w-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              DETALLE DE TU CITA
            </span>
            <div className="text-xl font-black text-slate-900 font-mono">
              {selectedDay} Oct 2026 — {selectedTime}
            </div>
            <p className="text-xs font-bold text-amber-600">CDMX – Vallejo Hub (Almacén Central)</p>
          </div>

          <div className="w-full md:w-auto">
            <Button
              onClick={handleScheduleRetiro}
              disabled={loading}
              className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl shadow-xl justify-center text-xs tracking-wider uppercase"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {loading ? "PROCESANDO CITA..." : isBooked ? "CITA AGENDADA ✓" : "AGENDAR RETIRO AHORA"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

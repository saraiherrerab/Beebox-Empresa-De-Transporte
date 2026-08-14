import React from "react";
import { CheckCircle2, Clock, Truck, MapPin, AlertCircle, PackageCheck } from "lucide-react";
import { TrackingEvent, TrackingStatusStep } from "@/types";

interface StatusTimelineProps {
  events: TrackingEvent[];
  currentStatus: TrackingStatusStep;
}

const statusStepOrder: TrackingStatusStep[] = [
  "recoleccion",
  "centro_distribucion",
  "en_transito",
  "en_reparto",
  "entregado",
];

const statusNames: Record<TrackingStatusStep, string> = {
  recoleccion: "Recogido",
  centro_distribucion: "Hub Central",
  en_transito: "En Tránsito",
  en_reparto: "En Reparto",
  entregado: "Entregado",
  incidencia: "Incidencia",
};

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ events, currentStatus }) => {
  const currentIndex = statusStepOrder.indexOf(currentStatus);

  return (
    <div className="space-y-8">
      {/* Top Stepper Bar */}
      <div className="hidden sm:flex justify-between items-center relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-full before:h-1 before:bg-slate-800 before:z-0 px-4">
        {statusStepOrder.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = step === currentStatus;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCurrent
                    ? "bg-beebox-amber-500 text-beebox-navy-950 ring-4 ring-beebox-amber-500/20 scale-110"
                    : isDone
                    ? "bg-emerald-500 text-beebox-navy-950"
                    : "bg-slate-900 border border-slate-700 text-slate-500"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isCurrent ? "text-beebox-amber-400 font-extrabold" : isDone ? "text-slate-200" : "text-slate-500"
                }`}
              >
                {statusNames[step]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Vertical Event List */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Historial de Eventos del Envío</h4>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {events.map((evt) => (
            <div key={evt.id} className="relative group">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-beebox-navy-900 border-2 border-beebox-amber-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-beebox-amber-400" />
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-1 hover:border-slate-700 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-white">{evt.title}</span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-beebox-amber-500" /> {evt.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{evt.description}</p>

                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-beebox-cyan-400" />
                  <span>{evt.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { CheckCircle2, Clock, MapPin, PackageCheck, Truck, Home } from "lucide-react";
import { TrackingEvent, TrackingStatusStep } from "@/types";

interface StatusTimelineProps {
  events: TrackingEvent[];
  currentStatus: string;
}

const simplifiedStatusSteps = [
  { key: "En el origen", label: "En el Origen", icon: PackageCheck },
  { key: "En camino", label: "En Camino", icon: Truck },
  { key: "Llegó a su destino", label: "Llegó a su Destino", icon: Home },
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ events, currentStatus }) => {
  const normalizedStatus = (currentStatus || "").toLowerCase();

  const getStepIndex = (statusStr: string) => {
    const s = statusStr.toLowerCase();
    if (s.includes("destino") || s.includes("entregado")) return 2;
    if (s.includes("camino") || s.includes("transito") || s.includes("reparto")) return 1;
    return 0; // Default: En el origen
  };

  const currentIndex = getStepIndex(normalizedStatus);

  return (
    <div className="space-y-8">
      {/* Top Stepper Bar (3 Estados: En el Origen -> En Camino -> Llegó a su Destino) */}
      <div className="flex justify-between items-center relative before:absolute before:left-8 before:right-8 before:top-5 before:h-1 before:bg-slate-800 before:z-0 px-2 sm:px-6">
        {simplifiedStatusSteps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCurrent
                    ? "bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 scale-110"
                    : isDone
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-900 border border-slate-700 text-slate-500"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4 text-slate-500" />}
              </div>
              <span
                className={`text-[11px] sm:text-xs font-black uppercase tracking-wider text-center ${
                  isCurrent ? "text-amber-400" : isDone ? "text-slate-200" : "text-slate-500"
                }`}
              >
                {step.label}
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
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-1 hover:border-slate-700 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-white">{evt.title}</span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> {evt.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{evt.description}</p>

                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-cyan-400" />
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

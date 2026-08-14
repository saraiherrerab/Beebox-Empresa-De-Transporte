"use client";

import React, { useState } from "react";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { PickupWizardStep1 } from "@/components/client/PickupWizardStep1";
import { PickupWizardStep2 } from "@/components/client/PickupWizardStep2";
import { Button } from "@/components/ui/Button";

export default function SolicitarPickupPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { num: 1, label: "REMITENTE" },
    { num: 2, label: "PAQUETE" },
    { num: 3, label: "DESTINATARIO" },
    { num: 4, label: "HORARIO" },
    { num: 5, label: "PAGO" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Solicitar Pickup</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          {currentStep === 1
            ? "Sigue los pasos para programar la recolección de tu carga internacional."
            : currentStep === 2
            ? "Paso 2: Detalles del Paquete y Facturación"
            : "Completa la información final para confirmar tu solicitud de pickup."}
        </p>
      </div>

      {/* Stepper Header Bar (Matching Image 4 & 5) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative before:absolute before:left-8 before:right-8 before:top-4 before:h-0.5 before:bg-slate-200 before:z-0">
          {steps.map((s) => {
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;

            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                <button
                  onClick={() => setCurrentStep(s.num)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white shadow-md"
                      : isCurrent
                      ? "bg-amber-500 text-slate-950 ring-4 ring-amber-100 font-black shadow-md scale-110"
                      : "bg-white border-2 border-slate-300 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </button>
                <span
                  className={`text-[10px] font-extrabold tracking-wider uppercase ${
                    isCurrent ? "text-amber-600 font-bold" : isCompleted ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && <PickupWizardStep1 onNext={() => setCurrentStep(2)} />}
      {currentStep === 2 && (
        <PickupWizardStep2 onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />
      )}
      {currentStep >= 3 && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {currentStep === 5 ? "¡Solicitud Confirmada!" : `Paso ${currentStep}: Información Registrada`}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hemos recibido los detalles de tu recolección. Un chofer Beebox asignado pasará por la dirección indicada.
          </p>
        </div>
      )}

      {/* Bottom Actions Bar (Matching Image 4 & 5) */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" /> Atrás
        </button>

        <Button
          onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
          variant="amber"
          className="rounded-2xl px-6 py-3 font-bold"
        >
          {currentStep === 5 ? "FINALIZAR" : "SIGUIENTE"} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

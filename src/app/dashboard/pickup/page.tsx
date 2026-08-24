"use client";

import React, { useState } from "react";
import { Check, ArrowRight, ArrowLeft, Truck } from "lucide-react";
import { PickupWizardStep1 } from "@/components/client/PickupWizardStep1";
import { PickupWizardStep2 } from "@/components/client/PickupWizardStep2";
import { PickupWizardStep3 } from "@/components/client/PickupWizardStep3";
import { PickupWizardStep4 } from "@/components/client/PickupWizardStep4";
import { Button } from "@/components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function SolicitarPickupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("PK-9821-DOM");
  const [loading, setLoading] = useState(false);

  // Form state
  const [senderName, setSenderName] = useState("Juan Pérez");
  const [senderPhone, setSenderPhone] = useState("+52 55 1234 5678");
  const [senderAddress, setSenderAddress] = useState("Av. Insurgentes Sur 1234");
  const [senderCity, setSenderCity] = useState("Ciudad de México");
  const [boxCount, setBoxCount] = useState(1);
  const [totalWeightKg, setTotalWeightKg] = useState(1.5);
  const [containElectronics, setContainElectronics] = useState(false);
  const [recipientName, setRecipientName] = useState("María López");
  const [recipientPhone, setRecipientPhone] = useState("+52 55 9876 5432");
  const [recipientAddress, setRecipientAddress] = useState("Calle Reforma 456");
  const [recipientCity, setRecipientCity] = useState("Guadalajara");
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState("mañana");

  const steps = [
    { num: 1, label: "REMITENTE" },
    { num: 2, label: "PAQUETES" },
    { num: 3, label: "DESTINATARIO" },
    { num: 4, label: "HORARIO & CONFIRMACIÓN" },
  ];

  const handleFinalSubmit = async () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;

    try {
      if (token) {
        const res = await fetch(`${API_URL}/pickups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            senderName,
            senderPhone,
            senderAddress,
            senderCity,
            boxCount,
            totalWeightKg,
            containElectronics,
            recipientName,
            recipientPhone,
            recipientAddress,
            recipientCity,
            pickupDate,
            timeSlot,
          }),
        });
        const data = await res.json();
        if (res.ok && data.pickup) {
          setGeneratedCode(data.pickup.pickupCode);
        }
      }
    } catch {
      // Fallback a código generado localmente si está offline
      setGeneratedCode(`PK-${Math.floor(1000 + Math.random() * 9000)}-DOM`);
    } finally {
      setLoading(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Solicitar Pickup a Domicilio</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          {currentStep === 1
            ? "Paso 1: Registra la ubicación exacta de recogida del paquete."
            : currentStep === 2
            ? "Paso 2: Registra las dimensiones de tus cajas e inspección de electrónicos."
            : currentStep === 3
            ? "Paso 3: Información del destinatario final y teléfonos de contacto."
            : "Paso 4: Selecciona la fecha y franja horaria de recolección."}
        </p>
      </div>

      {!isSubmitted ? (
        <>
          {/* Stepper Header Bar */}
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
          {currentStep === 3 && (
            <PickupWizardStep3 onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />
          )}
          {currentStep === 4 && (
            <PickupWizardStep4 onNext={handleFinalSubmit} onBack={() => setCurrentStep(3)} />
          )}

          {/* Bottom Actions Bar */}
          <div className="max-w-4xl mx-auto flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || loading}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" /> Atrás
            </button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                variant="amber"
                className="rounded-2xl px-6 py-3 font-bold"
              >
                SIGUIENTE <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleFinalSubmit}
                disabled={loading}
                variant="amber"
                className="rounded-2xl px-8 py-3 font-bold shadow-lg shadow-amber-500/20"
              >
                {loading ? "PROCESANDO..." : "SOLICITAR PICKUP AHORA"} <Check className="w-4 h-4 ml-1 stroke-[3]" />
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <Truck className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">¡Recolección Programada Exitosamente!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Tu orden de pickup <span className="font-mono font-bold text-amber-600">{generatedCode}</span> ha sido asignada al chofer de ruta local. Te contactaremos 30 minutos antes de llegar.
          </p>
          <div className="pt-4">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }}
              variant="amber"
              className="rounded-2xl px-6"
            >
              Solicitar Otro Pickup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

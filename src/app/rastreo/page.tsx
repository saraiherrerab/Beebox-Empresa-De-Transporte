import React, { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_SHIPMENTS } from "@/constants";
import { ParcelDetailsCard } from "@/components/tracking/ParcelDetailsCard";
import { StatusTimeline } from "@/components/tracking/StatusTimeline";
import { TrackingWidget } from "@/components/home/TrackingWidget";
import { AlertCircle, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TrackingPageProps {
  searchParams: Promise<{ codigo?: string }>;
}

export default async function TrackingPage({ searchParams }: TrackingPageProps) {
  const params = await searchParams;
  const rawCode = params.codigo || "BEE-98234-CL";
  const normalizedCode = rawCode.trim().toUpperCase();

  const shipment = MOCK_SHIPMENTS[normalizedCode];

  return (
    <div className="min-h-screen flex flex-col bg-beebox-navy-950">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-beebox-amber-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al Inicio
            </Link>
            <span className="text-xs text-slate-500 font-mono">Panel de Rastreo Beebox v1.0</span>
          </div>

          {/* Quick Search widget */}
          <div className="mb-6">
            <TrackingWidget />
          </div>

          {shipment ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Shipment Details */}
              <ParcelDetailsCard shipment={shipment} />

              {/* Event Timeline */}
              <div className="rounded-2xl border border-slate-800 bg-beebox-navy-900/80 p-6 md:p-8 backdrop-blur-md space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-beebox-amber-400" />
                  Estado del Envío en Tiempo Real
                </h3>

                <StatusTimeline events={shipment.events} currentStatus={shipment.currentStatus} />
              </div>
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-beebox-navy-900/60 border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No se encontró el código: {normalizedCode}</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Verifica haber ingresado correctamente los caracteres o intenta con nuestro código de demostración.
              </p>
              <div className="pt-2">
                <Link href="/rastreo?codigo=BEE-98234-CL">
                  <Button variant="primary">Probar Código Demo (BEE-98234-CL)</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

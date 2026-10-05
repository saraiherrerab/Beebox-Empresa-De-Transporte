import React, { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_SHIPMENTS } from "@/constants";
import { ParcelDetailsCard } from "@/components/tracking/ParcelDetailsCard";
import { StatusTimeline } from "@/components/tracking/StatusTimeline";
import { TrackingWidget } from "@/components/home/TrackingWidget";
import { AlertCircle, ArrowLeft, Search, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/config/api";

interface TrackingPageProps {
  searchParams: Promise<{ codigo?: string }>;
}

export default async function TrackingPage({ searchParams }: TrackingPageProps) {
  const params = await searchParams;
  const rawCode = params.codigo ? params.codigo.trim() : "";
  const normalizedCode = rawCode.toUpperCase();

  let shipment: any = null;
  if (normalizedCode) {
    try {
      const res = await fetch(`${API_URL}/shipments/${encodeURIComponent(normalizedCode)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        shipment = {
          code: data.trackingCode,
          serviceType: data.serviceType || "Aéreo Express",
          origin: {
            country: "Estados Unidos",
            city: data.senderCity || "Broken Arrow, OK",
            date: data.createdAt ? data.createdAt.split("T")[0] : "",
          },
          destination: {
            country: "Venezuela",
            city: data.recipientCity || "Destino",
            estimatedDate: data.estimatedDelivery || "3-5 días hábiles",
          },
          currentStatus: data.currentStatus || "En el origen",
          weight: data.weightKg ? `${data.weightKg} kg` : "N/A",
          dimensions: data.dimensions || "N/A",
          sender: {
            name: data.senderName || "Remitente",
            city: data.senderCity || "Broken Arrow, OK",
          },
          recipient: {
            name: data.recipientName || "Destinatario",
            city: data.recipientCity || "Destino",
          },
          events: Array.isArray(data.trackingEvents) && data.trackingEvents.length > 0
            ? data.trackingEvents.map((ev: any) => ({
                id: ev.id,
                status: ev.status,
                location: ev.location,
                timestamp: ev.timestamp ? new Date(ev.timestamp).toLocaleString("es-VE") : "",
                description: ev.description,
                completed: true,
              }))
            : [
                {
                  id: "ev_1",
                  status: data.currentStatus || "En el origen",
                  location: data.senderCity || "Broken Arrow, OK",
                  timestamp: data.createdAt ? new Date(data.createdAt).toLocaleString("es-VE") : "",
                  description: "Carga registrada en sistema y disponible en almacén.",
                  completed: true,
                },
              ],
        };
      }
    } catch {
      // Fallback
    }

    if (!shipment && MOCK_SHIPMENTS[normalizedCode]) {
      shipment = MOCK_SHIPMENTS[normalizedCode];
    }
  }

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
          ) : !normalizedCode ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-beebox-navy-900/60 border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <PackageSearch className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Consulta el Estado de tu Envío</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Ingresa en el buscador tu número de Warehouse (WR-XXXXX) o Guía de Salida para conocer su ubicación y recorrido en tiempo real.
              </p>
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-beebox-navy-900/60 border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No se encontró el código: {normalizedCode}</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Verifica haber ingresado correctamente los caracteres de tu Warehouse o Guía de Salida.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
